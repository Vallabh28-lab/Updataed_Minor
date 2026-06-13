import json
import uvicorn
import fitz  # PyMuPDF
import pytesseract
import io
import os
import cv2
import numpy as np
import uuid
import logging
import httpx
import google.generativeai as genai

from sqlalchemy import create_engine, text

from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ValidationError
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from dotenv import load_dotenv
from database.database import suggest_lawyer_types

#------------------------------------------------------------------------------------------
# PostgreSQL Connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"

engine = create_engine(DATABASE_URL)



# CONFIGURATION
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Logging setup
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] [%(asctime)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log")),
        logging.StreamHandler()
    ]
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
        if 'generateContent' in model.supported_generation_methods:
            logger.info(f"  - {model.name}")
except Exception as e:
    logger.warning(f"Could not list models: {e}")

# Job storage and executor
jobs = {}
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
executor = ThreadPoolExecutor(max_workers=4)

# Legal specialization mappings
SPECIALIZATION_MAP = {
    "Corporate": [
        "Mergers and Acquisitions (M&A) Lawyer",
        "Securities and Capital Markets Lawyer",
        "Corporate Governance and Compliance Lawyer",
        "Venture Capital and Private Equity Lawyer",
        "Insolvency and Restructuring Lawyer",
        "In-House Counsel",
        "Corporate Litigator",
        "Tax Lawyer",
        "Employment and Labor Lawyer",
        "Banking and Finance Lawyer"
    ],
    "Intellectual Property": [
        "Patent Attorney",
        "Trademark Lawyer",
        "Copyright Lawyer",
        "Trade Secret Lawyer",
        "IP Litigator",
        "IP Transactional / Licensing Lawyer",
        "Entertainment and Media Lawyer",
        "Sports Law IP Specialist",
        "Franchise Lawyer",
        "Privacy and Data Protection Lawyer"
    ],
    "Real Estate": [
        "Real Estate Transactional Lawyer",
        "Real Estate Litigator",
        "Zoning and Land Use Lawyer",
        "Construction Lawyer",
        "Property Tax Lawyer"
    ],
    "Employment": [
        "Employment and Labor Lawyer",
        "Employment Litigator",
        "Workplace Discrimination Lawyer",
        "Benefits and Compensation Lawyer",
        "Union and Collective Bargaining Lawyer"
    ],
    "Criminal": [
        "Criminal Defense Lawyer",
        "Prosecutor",
        "White Collar Crime Lawyer",
        "DUI/DWI Lawyer",
        "Appellate Lawyer"
    ],
    "Other": [
        "General Practice Lawyer",
        "Civil Litigator",
        "Contract Lawyer",
        "Dispute Resolution Lawyer"
    ]
}

def get_high_accuracy_ocr(pix, page_num=None):
    """Uses OpenCV to clean the image and Tesseract for text extraction."""
    try:
        # Convert PyMuPDF pixmap to OpenCV format
        img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        # Convert RGB to BGR for OpenCV
        img = cv2.cvtColor(img_data, cv2.COLOR_RGB2BGR)
        
        # Pre-processing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Professional Tesseract Configuration
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(thresh, config=custom_config)
        
        if page_num:
            logger.info(f"OCR completed on page {page_num}, extracted {len(text)} characters")
        return text
    except Exception as e:
        logger.error(f"OCR failed on page {page_num}: {str(e)}")
        raise

def extract_text(file_bytes, job_id=None):
    """Hybrid extraction: Native text first, OCR fallback if empty."""
    try:
        logger.info(f"Job {job_id}: Opening PDF document")
        print(f"DEBUG: Opening PDF document for job {job_id}")
        
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        total_pages = len(doc)
        
        logger.info(f"Job {job_id}: Processing PDF with {total_pages} pages")
        print(f"DEBUG: PDF has {total_pages} pages")
        
        full_text = ""
        
        for page_num, page in enumerate(doc, start=1):
            try:
                text = page.get_text()
                
                logger.info(f"Job {job_id}: Page {page_num} native text: {len(text)} chars")
                print(f"DEBUG: Page {page_num} native extraction: {len(text)} chars")
                
                # Fallback to OCR if page has little to no text layer
                if len(text.strip()) < 50:
                    logger.info(f"Job {job_id}: Page {page_num} has minimal text, using OCR")
                    print(f"DEBUG: Page {page_num} switching to OCR")
                    
                    pix = page.get_pixmap(dpi=300) 
                    text = get_high_accuracy_ocr(pix, page_num)
                    
                    logger.info(f"Job {job_id}: Page {page_num} OCR result: {len(text)} chars")
                    print(f"DEBUG: Page {page_num} OCR extraction: {len(text)} chars")
                
                full_text += text
                
            except Exception as e:
                logger.error(f"Job {job_id}: Failed to process page {page_num}: {str(e)}")
                print(f"DEBUG ERROR: Page {page_num} failed: {str(e)}")
                continue
        
        logger.info(f"Job {job_id}: Extracted {len(full_text)} total characters")
        print(f"DEBUG: Total extracted text: {len(full_text)} characters")
        
        if full_text:
            print(f"DEBUG: Sample text (first 300 chars): {full_text[:300]}")
        else:
            print(f"DEBUG WARNING: No text extracted from any page!")
        
        return full_text
        
    except Exception as e:
        logger.error(f"Job {job_id}: PDF extraction failed: {str(e)}")
        print(f"DEBUG CRITICAL ERROR: PDF extraction completely failed: {str(e)}")
        raise

def process_document(job_id: str, file_path: str):
    """Background task for document analysis"""
    logger.info(f"Job {job_id}: Started processing {os.path.basename(file_path)}")
    
    try:
        with open(file_path, 'rb') as f:
            file_bytes = f.read()
        
        logger.info(f"Job {job_id}: Read {len(file_bytes)} bytes from file")
        print(f"DEBUG: Read {len(file_bytes)} bytes from file")
        
        jobs[job_id]["status"] = "extracting_text"
        logger.info(f"Job {job_id}: Extracting text from document")
        
        # 1. ALWAYS call extract_text function first
        file_text = extract_text(file_bytes, job_id)[:5000]
        
        # 2. Add debug print statement
        print(f"DEBUG: Extracted {len(file_text)} characters.")
        logger.info(f"Job {job_id}: Extracted text length: {len(file_text)} characters")
        
        # 3. Only proceed if file_text has content
        if len(file_text) < 50:
            logger.warning(f"Job {job_id}: Insufficient text extracted (only {len(file_text)} characters)")
            print(f"DEBUG: Document appears empty or is a bad scan. Only {len(file_text)} characters extracted.")
            jobs[job_id] = {
                "status": "failed", 
                "error": f"Document appears empty or is a bad scan. Only {len(file_text)} characters extracted."
            }
            return
        
        # Log first 200 characters for debugging
        logger.info(f"Job {job_id}: First 200 chars: {file_text[:200]}")
        print(f"DEBUG: First 200 chars: {file_text[:200]}")
        
        jobs[job_id]["status"] = "analyzing"
        logger.info(f"Job {job_id}: Sending to Gemini AI for analysis")
        # Try the most common working model name
        # Change from 'models/gemini-1.5-flash' to:
        model = genai.GenerativeModel('gemini-3.5-flash')
        
#-------------------------------------------------------------------------------------------------------        
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
        Example:
        "importantDates": [
            "12/05/2026",
            "25/07/2026"
        ]
        
        Do NOT return objects such as:
        {{
           "date": "12/05/2026"
        }}

        5. keywords:
        Extract important legal terms and topics.

        6. riskyClauses:
        Identify clauses that may expose a party to legal or financial risk.

        Return ONLY JSON.
        """


#---------------------------------------------------------------------------------------------
        
        
        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        
        # Debug: Log Gemini's response
        logger.info(f"Job {job_id}: Gemini returned: {clean_text}")
        
        # Parse and validate with Pydantic
        try:
                    parsed_data = json.loads(clean_text)

                    analysis = LegalAnalysis(**parsed_data)
                    
                    logger.info(f"Job {job_id}: Gemini analysis completed successfully")

                    # ═══════════════════════════════════════════════════════════════
                    # LAWYER TYPE RECOMMENDATION (DATABASE MATCHING)
                    # ═══════════════════════════════════════════════════════════════
                    
                    logger.info(f"Job {job_id}: Building document context for lawyer matching")
                    
                    try:
                        # Build search context from AI analysis results
                        document_context = []
                        
                        # Add summary
                        if analysis.summary:
                            document_context.append(analysis.summary)
                        
                        # Add keywords
                        if analysis.keywords:
                            document_context.extend(analysis.keywords)
                        
                        # Add risky clauses
                        if analysis.riskyClauses:
                            for clause in analysis.riskyClauses:
                                document_context.append(clause.clauseType)
                                document_context.append(clause.reason)
                        
                        # Combine into searchable text
                        search_text = " ".join(document_context)
                        
                        logger.info(
                            f"Job {job_id}: Document context prepared "
                            f"({len(search_text)} chars, {len(document_context)} components)"
                        )
                        
                        # Search database for matching lawyer types
                        logger.info(f"Job {job_id}: Searching lawyer_mapping table")
                        recommended_lawyers = suggest_lawyer_types(search_text, top_n=5)
                        
                        logger.info(
                            f"Job {job_id}: Found {len(recommended_lawyers)} matching lawyer types"
                        )
                        
                        if recommended_lawyers:
                            top = recommended_lawyers[0]
                            logger.info(
                                f"Job {job_id}: Top recommendation: {top['lawyer_type']} "
                                f"({top['match_percentage']}% match)"
                            )
                        
                    except Exception as e:
                        logger.error(
                            f"Job {job_id}: Lawyer matching failed - {str(e)}",
                            exc_info=True
                        )
                        recommended_lawyers = []
                        logger.warning(f"Job {job_id}: Continuing without lawyer recommendations")
                    
                    # ═══════════════════════════════════════════════════════════════
                    # END LAWYER MATCHING
                    # ═══════════════════════════════════════════════════════════════

                    with engine.connect() as conn:

                        conn.execute(
                            text("""
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
                            """),
                            {
                                "job_id": job_id,
                                "legal_category": analysis.legalCategory,
                                "urgency_level": analysis.urgencyLevel,
                                "risk_score": analysis.riskScore,
                                "summary": analysis.summary
                            }
                        )

                        conn.commit()

                    jobs[job_id] = {
                        "status": "completed",
                        "analysis": analysis.model_dump(),
                        "recommendedLawyerTypes": recommended_lawyers
                    }

                    logger.info(
                        f"Job {job_id}: Complete pipeline finished successfully. "
                        f"Analysis saved, {len(recommended_lawyers)} lawyer types recommended"
                    )


        except ValidationError as ve:
            logger.error(f"Job {job_id}: Validation failed - {str(ve)}")
            jobs[job_id] = {"status": "failed", "error": f"Invalid response format: {str(ve)}"}
        except json.JSONDecodeError as je:
            logger.error(f"Job {job_id}: JSON parsing failed - {str(je)}")
            jobs[job_id] = {"status": "failed", "error": f"Invalid JSON response: {str(je)}"}
    except Exception as e:
        logger.error(f"Job {job_id}: Processing failed - {str(e)}")
        jobs[job_id] = {"status": "failed", "error": str(e)}
    finally:
        # Cleanup file after processing
        try:
            os.remove(file_path)
            logger.info(f"Job {job_id}: Cleaned up file {os.path.basename(file_path)}")
        except Exception as e:
            logger.warning(f"Job {job_id}: Failed to cleanup file - {str(e)}")

@app.post("/api/predict", response_model=JobResponse)
async def upload_and_analyze_document(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    logger.info(f"Job {job_id}: Received upload request for {file.filename}")
    
    # Save file asynchronously
    content = await file.read()
    
    # DEBUG: Log file size
    logger.info(f"Job {job_id}: File size: {len(content)} bytes")
    print(f"DEBUG: File size: {len(content)} bytes")
    
    with open(file_path, 'wb') as f:
        f.write(content)
    
    logger.info(f"Job {job_id}: File saved ({len(content)} bytes), queuing for processing")
    
    # Initialize job status
    jobs[job_id] = {"status": "queued"}
    
    # Submit to thread pool (non-blocking)
    executor.submit(process_document, job_id, file_path)
    
    return {"job_id": job_id, "status": "queued"}

@app.get("/api/status/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    if job_id not in jobs:
        logger.warning(f"Status check for unknown job: {job_id}")
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]




if __name__ == '__main__':
    logger.info("Starting Legal AI Backend server")
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)