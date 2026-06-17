import json
import uvicorn
import fitz  # PyMuPDF
import pytesseract
import os
import cv2
import numpy as np
import uuid
import logging
import google.generativeai as genai

from sqlalchemy import create_engine, text

from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, ValidationError
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database.database import suggest_lawyer_types

#------------------------------------------------------------------------------------------
# PostgreSQL Connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL)

# CONFIGURATION
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# Logging setup
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] [%(asctime)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log")),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="Legal AI Backend")

# Pydantic Models
class RiskyClause(BaseModel):
    clauseType: str
    riskLevel: str
    reason: str

class RecommendedLawyerType(BaseModel):
    lawyer_type: str
    legal_domain: str
    match_percentage: int
    matched_items: List[str]
    match_count: int

class LegalAnalysis(BaseModel):
    summary: str
    legalCategory: str
    urgencyLevel: str
    riskScore: int
    importantDates: List[str] = []
    keywords: List[str] = []
    riskyClauses: List[RiskyClause] = []

class JobResponse(BaseModel):
    job_id: str
    status: str

class JobStatus(BaseModel):
    status: str
    analysis: Optional[LegalAnalysis] = None
    recommendedLawyerTypes: Optional[List[RecommendedLawyerType]] = []
    error: Optional[str] = None


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Test available models on startup
try:
    available_models = genai.list_models()
    logger.info("Available Gemini models:")
    for model in available_models:
        if "generateContent" in model.supported_generation_methods:
            logger.info(f"  - {model.name}")
except Exception as e:
    logger.warning(f"Could not list models: {e}")

# Job storage and executor
jobs: Dict[str, Dict[str, Any]] = {}
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
executor = ThreadPoolExecutor(max_workers=4)


def get_high_accuracy_ocr(pix, page_num=None):
    """Uses OpenCV to clean the image and Tesseract for text extraction."""
    try:
        img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        img = cv2.cvtColor(img_data, cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        custom_config = r"--oem 3 --psm 6"
        text = pytesseract.image_to_string(thresh, config=custom_config)

        if page_num:
            logger.info(
                f"OCR completed on page {page_num}, extracted {len(text)} characters"
            )
        return text
    except Exception as e:
        logger.error(f"OCR failed on page {page_num}: {str(e)}")
        raise


def extract_text(file_bytes, job_id=None):
    """Hybrid extraction: Native text first, OCR fallback if empty."""
    try:
        logger.info(f"Job {job_id}: Opening PDF document")
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        total_pages = len(doc)

        logger.info(f"Job {job_id}: Processing PDF with {total_pages} pages")

        full_text = ""

        for page_num, page in enumerate(doc, start=1):
            try:
                text = page.get_text()

                logger.info(
                    f"Job {job_id}: Page {page_num} native text: {len(text)} chars"
                )

                # Fallback to OCR if page has little to no text layer
                if len(text.strip()) < 50:
                    logger.info(
                        f"Job {job_id}: Page {page_num} has minimal text, using OCR"
                    )
                    pix = page.get_pixmap(dpi=300)
                    text = get_high_accuracy_ocr(pix, page_num)

                full_text += text

            except Exception as e:
                logger.error(
                    f"Job {job_id}: Failed to process page {page_num}: {str(e)}"
                )
                continue

        logger.info(f"Job {job_id}: Extracted {len(full_text)} total characters")
        return full_text

    except Exception as e:
        logger.error(f"Job {job_id}: PDF extraction failed: {str(e)}")
        raise


def process_document(job_id: str, file_path: str):
    """Background task for document analysis"""
    logger.info(f"Job {job_id}: Started processing {os.path.basename(file_path)}")

    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        jobs[job_id]["status"] = "extracting_text"

        file_text = extract_text(file_bytes, job_id)[:5000]

        if len(file_text) < 50:
            jobs[job_id] = {
                "status": "failed",
                "error": (
                    f"Document appears empty or is a bad scan. Only {len(file_text)} characters extracted."
                ),
            }
            return

        jobs[job_id]["status"] = "analyzing"

        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        Analyze the following legal document.

        Document:
        {file_text}

        Extract and return ONLY valid JSON in the following format:

        {{
            "summary": "Short summary of the document",
            "legalCategory": "Real Estate | Intellectual Property | Employment | Corporate | Criminal | Other",
            "urgencyLevel": "Low | Medium | High",
            "riskScore": 0,
            "importantDates": [],
            "keywords": [],
            "riskyClauses": [
                {{
                    "clauseType": "",
                    "riskLevel": "",
                    "reason": ""
                }}
            ]
        }}

        Instructions:

        1. legalCategory:
        Identify the primary legal domain of the document.

        2. urgencyLevel:
        Determine urgency based on:
        - Litigation clauses
        - Penalty clauses
        - Termination clauses
        - Expiry deadlines

        3. riskScore:
        Give a score from 0-100.
        - 0-30 = Low Risk
        - 31-70 = Medium Risk
        - 71-100 = High Risk

        4. importantDates:
        Return ONLY a list of strings.

        5. keywords:
        Extract important legal terms and topics.

        6. riskyClauses:
        Identify clauses that may expose a party to legal or financial risk.

        Return ONLY JSON.
        """

        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()

        try:
            parsed_data = json.loads(clean_text)
            analysis = LegalAnalysis(**parsed_data)

            recommended_lawyers: List[Dict[str, Any]] = []
            search_text = ""

            try:
                document_context: List[str] = []

                if analysis.summary:
                    document_context.append(analysis.summary)

                if analysis.keywords:
                    document_context.extend(analysis.keywords)

                search_text += (analysis.summary or "") + " "
                search_text += analysis.legalCategory + " "
                search_text += " ".join(analysis.keywords or []) + " "

                if analysis.riskyClauses:
                    for clause in analysis.riskyClauses:
                        document_context.append(clause.clauseType)
                        document_context.append(clause.reason)
                        search_text += clause.clauseType + " "
                        search_text += clause.reason + " "

                search_text += """
                agreement
                contract
                consultant
                compensation
                invoice
                payment
                services
                termination
                liability
                commercial
                business
                corporate
                """

                recommended_raw = suggest_lawyer_types(search_text)

                for item in recommended_raw:
                    matched = (
                        item.get("matched_terms", [])
                        + item.get("matched_clauses", [])
                        + item.get("matched_risks", [])
                    )

                    recommended_lawyers.append(
                        {
                            "lawyer_type": item.get("lawyer_type", ""),
                            "legal_domain": item.get("domain", ""),
                            "match_percentage": min(int(item.get("score", 0)), 100),
                            "matched_items": matched,
                            "match_count": len(set(matched)),
                        }
                    )

            except Exception as e:
                logger.error(
                    f"Job {job_id}: Lawyer matching failed - {str(e)}",
                    exc_info=True,
                )
                recommended_lawyers = []

            with engine.connect() as conn:
                conn.execute(
                    text(
                        """
                    INSERT INTO analyses
                    (
                        job_id,
                        legal_category,
                        urgency_level,
                        risk_score,
                        summary
                    )
                    VALUES
                    (
                        :job_id,
                        :legal_category,
                        :urgency_level,
                        :risk_score,
                        :summary
                    )
                    """
                    ),
                    {
                        "job_id": job_id,
                        "legal_category": analysis.legalCategory,
                        "urgency_level": analysis.urgencyLevel,
                        "risk_score": analysis.riskScore,
                        "summary": analysis.summary,
                    },
                )
                conn.commit()

            jobs[job_id] = {
                "status": "completed",
                "analysis": analysis.model_dump(),
                "recommendedLawyerTypes": recommended_lawyers,
            }

        except ValidationError as ve:
            jobs[job_id] = {"status": "failed", "error": f"Invalid response format: {str(ve)}"}
        except json.JSONDecodeError as je:
            jobs[job_id] = {"status": "failed", "error": f"Invalid JSON response: {str(je)}"}

    except Exception as e:
        logger.error(f"Job {job_id}: Processing failed - {str(e)}")
        jobs[job_id] = {"status": "failed", "error": str(e)}
    finally:
        try:
            os.remove(file_path)
        except Exception:
            pass


@app.post("/api/predict", response_model=JobResponse)
async def upload_and_analyze_document(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    jobs[job_id] = {"status": "queued"}
    executor.submit(process_document, job_id, file_path)

    return {"job_id": job_id, "status": "queued"}


@app.get("/api/status/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]


if __name__ == "__main__":
    logger.info("Starting Legal AI Backend server")
    uvicorn.run("main_fixed:app", host="127.0.0.1", port=5000, reload=True)

