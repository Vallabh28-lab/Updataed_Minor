import json
import re
import uvicorn
import fitz  # PyMuPDF
import pytesseract
import os
import cv2
import numpy as np
import uuid
import logging
import concurrent.futures
from google import genai

from sqlalchemy import create_engine, text

from datetime import datetime, timezone, timedelta
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
MAX_JOBS = 100
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
GEMINI_TIMEOUT = 120               # seconds
JOB_TTL = timedelta(hours=1)
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

# Logging setup
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] [%(asctime)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(
            os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log")
        ),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(
    title="Legal Case Analysis API",
    description="AI-powered legal document analysis: OCR extraction, risk scoring, clause detection, and lawyer recommendations.",
    version="1.0.0",
)

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

# Gemini client setup (new SDK)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Test available models on startup
try:
    available_models = client.models.list()
    logger.info("Available Gemini models:")
    for m in available_models:
        logger.info(f"  - {m.name}")
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
        if pix.n == 4:
            img = cv2.cvtColor(img_data, cv2.COLOR_RGBA2BGR)
        else:
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

        file_text = extract_text(file_bytes, job_id)[:12000]

        if len(file_text) < 50:
            jobs[job_id] = {
                "status": "failed",
                "error": (
                    f"Document appears empty or is a bad scan. Only {len(file_text)} characters extracted."
                ),
            }
            return

        jobs[job_id]["status"] = "analyzing"





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

        def _call_gemini(contents: str) -> str:
            """Call Gemini with timeout, return raw response text."""
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as gem_exec:
                future = gem_exec.submit(
                    client.models.generate_content,
                    model="gemini-2.5-flash",
                    contents=contents,
                )
                return future.result(timeout=GEMINI_TIMEOUT).text

        def _extract_json(raw: str) -> dict:
            """Strip markdown fences and extract the first JSON object."""
            cleaned = re.sub(r"^```json|^```|```$", "", raw.strip(), flags=re.MULTILINE).strip()
            m = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if not m:
                raise ValueError("No JSON object found in Gemini response")
            return json.loads(m.group())

        try:
            raw = _call_gemini(prompt)
        except concurrent.futures.TimeoutError:
            jobs[job_id] = {"status": "failed", "error": "AI service timed out. Please retry."}
            logger.error("Job %s: Gemini timed out after %ds", job_id, GEMINI_TIMEOUT)
            return

        # ── Retry JSON parsing once if first attempt fails ──────────────────
        try:
            parsed_data = _extract_json(raw)
        except (ValueError, json.JSONDecodeError) as first_err:
            logger.warning("Job %s: First JSON parse failed (%s) — retrying Gemini", job_id, first_err)
            retry_prompt = prompt + "\n\nIMPORTANT: Return ONLY raw JSON. No markdown, no explanation, no code fences."
            try:
                raw = _call_gemini(retry_prompt)
                parsed_data = _extract_json(raw)
                logger.info("Job %s: Retry JSON parse succeeded", job_id)
            except (ValueError, json.JSONDecodeError) as second_err:
                logger.error("Job %s: Retry JSON parse also failed: %s", job_id, second_err)
                jobs[job_id] = {"status": "failed", "error": "JSON parsing failed after retry. AI returned malformed response."}
                return

        try:
            analysis = LegalAnalysis(**parsed_data)

            # ── Composite risk score: Gemini base + clause weight ────────────
            HIGH_RISK_WEIGHT   = 15
            MEDIUM_RISK_WEIGHT = 7
            LOW_RISK_WEIGHT    = 3
            clause_bonus = sum(
                HIGH_RISK_WEIGHT   if c.riskLevel.lower() == "high"   else
                MEDIUM_RISK_WEIGHT if c.riskLevel.lower() == "medium" else
                LOW_RISK_WEIGHT
                for c in analysis.riskyClauses
            )
            composite_risk = min(100, int(analysis.riskScore * 0.7 + clause_bonus * 0.3))
            logger.info(
                "Job %s: Risk — Gemini=%d, clause_bonus=%d, composite=%d",
                job_id, analysis.riskScore, clause_bonus, composite_risk,
            )
            analysis = analysis.model_copy(update={"riskScore": composite_risk})

            # ------------------------
            # LAWYER RECOMMENDATION
            # ------------------------
            recommended_lawyers: List[Dict[str, Any]] = []

            try:
                risky_clause_types = [
                    c.clauseType for c in analysis.riskyClauses
                ] if analysis.riskyClauses else []

                recommended_raw = suggest_lawyer_types(
                    summary=analysis.summary,
                    legal_category=analysis.legalCategory,
                    keywords=analysis.keywords,
                    risky_clause_types=risky_clause_types,
                )

                # Normalise score to a realistic confidence percentage (60-97 range)
                scores = [r["score"] for r in recommended_raw] or [1]
                max_score = max(scores)

                for item in recommended_raw:
                    matched = list(set(item.get("matched_terms", [])))
                    match_count = len(matched)

                    # Realistic confidence: top scorer gets ~92-97%, rest scale down
                    raw_pct = (item["score"] / max_score) * 100
                    match_percentage = int(60 + (raw_pct / 100) * 37)  # maps to 60-97

                    if match_count >= 3 and match_percentage >= 60:
                        recommended_lawyers.append({
                            "lawyer_type": item.get("lawyer_type", ""),
                            "legal_domain": item.get("domain", ""),
                            "match_percentage": match_percentage,
                            "matched_items": matched,
                            "match_count": match_count,
                        })

                recommended_lawyers = sorted(
                    recommended_lawyers,
                    key=lambda x: x["match_percentage"],
                    reverse=True,
                )[:5]

            except Exception as e:
                logger.error(
                    f"Job {job_id}: Lawyer matching failed - {str(e)}", exc_info=True
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
                "created_at": jobs[job_id].get("created_at"),
            }

            logger.info(
                f"Job {job_id}: Complete pipeline finished successfully. "
                f"Analysis saved, {len(recommended_lawyers)} lawyer types recommended"
            )

        except ValidationError as ve:
            logger.error("Job %s: Pydantic validation failed - %s", job_id, ve)
            jobs[job_id] = {"status": "failed", "error": "Invalid response format from AI."}

    except fitz.FileDataError:
        logger.error(f"Job {job_id}: Invalid or corrupted PDF")
        jobs[job_id] = {"status": "failed", "error": "Invalid PDF. The file may be corrupted or password-protected."}
    except Exception as e:
        msg = str(e)
        if "quota" in msg.lower() or "429" in msg:
            user_msg = "Gemini API quota exceeded. Please try again later."
        elif "ECONNREFUSED" in msg or "connection" in msg.lower():
            user_msg = "OCR extraction failed. Internal service unavailable."
        else:
            user_msg = f"Processing failed: {msg}"
        logger.error(f"Job {job_id}: {user_msg}")
        jobs[job_id] = {"status": "failed", "error": user_msg}

    finally:
        try:
            os.remove(file_path)
            logger.info(
                f"Job {job_id}: Cleaned up file {os.path.basename(file_path)}"
            )
        except Exception as e:
            logger.warning(f"Job {job_id}: Failed to cleanup file - {str(e)}")


def _evict_old_jobs():
    """Remove completed/failed jobs older than JOB_TTL to keep RAM low."""
    cutoff = datetime.now(timezone.utc) - JOB_TTL
    stale = [
        jid for jid, data in jobs.items()
        if data.get("status") in ("completed", "failed")
        and data.get("created_at", datetime.now(timezone.utc)) < cutoff
    ]
    for jid in stale:
        del jobs[jid]
    if stale:
        logger.info("Evicted %d stale jobs", len(stale))


@app.post(
    "/api/predict",
    response_model=JobResponse,
    summary="Upload and analyze a legal document",
    description="Accepts a PDF or image file. Returns a job_id to poll for results.",
    responses={
        200: {
            "description": "Job queued successfully",
            "content": {"application/json": {"example": {"job_id": "a1b2c3d4-...", "status": "queued"}}},
        },
        400: {"description": "Unsupported file type"},
        413: {"description": "File exceeds 10 MB limit"},
    },
)
async def upload_and_analyze_document(file: UploadFile = File(..., description="Legal document — PDF, PNG, JPG or JPEG, max 10 MB")):
    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type '{ext}'. Allowed: pdf, png, jpg, jpeg.")

    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, f"File too large ({len(content) // (1024*1024)} MB). Maximum allowed is 10 MB.")

    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")

    logger.info("Job %s: Received '%s' (%d bytes)", job_id, file.filename, len(content))

    with open(file_path, "wb") as f:
        f.write(content)

    # Evict old jobs, then enforce hard cap
    _evict_old_jobs()
    if len(jobs) >= MAX_JOBS:
        oldest = next(iter(jobs))
        del jobs[oldest]

    jobs[job_id] = {"status": "queued", "created_at": datetime.now(timezone.utc)}

    executor.submit(process_document, job_id, file_path)

    return {"job_id": job_id, "status": "queued"}


@app.get(
    "/api/status/{job_id}",
    response_model=JobStatus,
    summary="Poll analysis job status",
    description="Returns current status and, when complete, the full analysis with recommended lawyer types.",
    responses={
        200: {
            "description": "Job status",
            "content": {
                "application/json": {
                    "example": {
                        "status": "completed",
                        "analysis": {
                            "summary": "Service agreement between two corporate parties.",
                            "legalCategory": "Corporate",
                            "urgencyLevel": "Medium",
                            "riskScore": 74,
                            "importantDates": ["01 January 2025"],
                            "keywords": ["indemnity", "liability", "termination"],
                            "riskyClauses": [
                                {"clauseType": "Liability", "riskLevel": "high", "reason": "Uncapped liability exposure."}
                            ],
                        },
                        "recommendedLawyerTypes": [
                            {"lawyer_type": "Corporate Lawyer",      "legal_domain": "Corporate Law",  "match_percentage": 92, "matched_items": ["indemnity", "liability"], "match_count": 5},
                            {"lawyer_type": "Contract Lawyer",       "legal_domain": "Contract Law",   "match_percentage": 86, "matched_items": ["termination", "breach"],  "match_count": 4},
                            {"lawyer_type": "Construction Lawyer",   "legal_domain": "Construction Law","match_percentage": 73, "matched_items": ["penalty", "delay"],     "match_count": 3},
                        ],
                    }
                }
            },
        },
        404: {"description": "Job not found"},
    },
)
async def get_job_status(job_id: str):
    if job_id not in jobs:
        logger.warning(f"Status check for unknown job: {job_id}")
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]


if __name__ == "__main__":
    logger.info("Starting Legal AI Backend server")
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)

