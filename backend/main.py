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

from sqlalchemy import create_engine, text

from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ValidationError
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai

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
    error: Optional[str] = None

class LawyerRequest(BaseModel):
    legalCategory: str
    latitude: float
    longitude: float
    radius: float = 5000
    specializationTypes: Optional[List[str]] = None

class LawyerLocation(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    distance: Optional[int] = None
    lat: float
    lon: float
    specialization: Optional[str] = None

class NearbyLawyersResponse(BaseModel):
    count: int
    lawyers: List[LawyerLocation]
    category: str
    recommendedSpecializations: List[str]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        total_pages = len(doc)
        logger.info(f"Job {job_id}: Processing PDF with {total_pages} pages")
        
        full_text = ""
        
        for page_num, page in enumerate(doc, start=1):
            try:
                text = page.get_text()
                # Fallback to OCR if page has little to no text layer
                if len(text.strip()) < 50:
                    logger.info(f"Job {job_id}: Page {page_num} has minimal text, using OCR")
                    pix = page.get_pixmap(dpi=300) 
                    text = get_high_accuracy_ocr(pix, page_num)
                full_text += text
            except Exception as e:
                logger.error(f"Job {job_id}: Failed to process page {page_num}: {str(e)}")
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
        with open(file_path, 'rb') as f:
            file_bytes = f.read()
        
        jobs[job_id]["status"] = "extracting_text"
        logger.info(f"Job {job_id}: Extracting text from document")
        file_text = extract_text(file_bytes, job_id)[:5000]
        
        if not file_text.strip():
            logger.warning(f"Job {job_id}: No readable text extracted")
            jobs[job_id] = {"status": "failed", "error": "No readable text"}
            return
        
        jobs[job_id]["status"] = "analyzing"
        logger.info(f"Job {job_id}: Sending to Gemini AI for analysis")
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
                        "analysis": analysis.model_dump()
                    }

                    logger.info(f"Job {job_id}: Analysis completed successfully")


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


@app.post("/api/recommend-lawyers")
async def recommend_lawyers(request: LawyerRequest):
    """Recommend lawyers from database based on category and location"""
    logger.info(f"Recommending {request.legalCategory} lawyers near ({request.latitude}, {request.longitude}) within {request.radius}m")

    try:
        # Get specializations for this category
        specializations = SPECIALIZATION_MAP.get(request.legalCategory, SPECIALIZATION_MAP["Other"])
        
        query = text("""
        SELECT
            id,
            name,
            specialization,
            experience_years,
            phone,
            ST_Distance(
                location,
                ST_GeogFromText(:user_point)
            ) AS distance
        FROM lawyers
        WHERE specialization = :category
        AND ST_DWithin(
            location,
            ST_GeogFromText(:user_point),
            :radius
        )
        ORDER BY distance
        LIMIT 10;
        """)

        user_point = f"POINT({request.longitude} {request.latitude})"

        with engine.connect() as conn:
            result = conn.execute(
                query,
                {
                    "category": request.legalCategory,
                    "user_point": user_point,
                    "radius": request.radius
                }
            )

            lawyers = []
            for row in result:
                lawyers.append(dict(row._mapping))
        
        logger.info(f"Found {len(lawyers)} {request.legalCategory} lawyers within {request.radius}m")
        
        return {
            "status": "success",
            "lawyers": lawyers,
            "category": request.legalCategory,
            "recommendedSpecializations": specializations
        }

    except Exception as e:
        logger.error(f"Lawyer recommendation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lawyers/nearby", response_model=NearbyLawyersResponse)
async def get_nearby_lawyers(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(5000, description="Search radius in meters"),
    category: Optional[str] = Query(None, description="Legal category filter")
):
    """
    Find nearby lawyers using Geoapify Places API.
    Example: /api/lawyers/nearby?lat=19.0760&lng=72.8777&radius=5000&category=Corporate
    """
    api_key = os.getenv("GEOAPIFY_API_KEY")
    
    if not api_key:
        logger.error("GEOAPIFY_API_KEY not configured")
        raise HTTPException(status_code=500, detail="Location service not configured")
    
    logger.info(f"Searching lawyers near ({lat}, {lng}) within {radius}m, category: {category}")
    
    try:
        url = "https://api.geoapify.com/v2/places"
        params = {
            "categories": "service.legal",
            "filter": f"circle:{lng},{lat},{radius}",
            "bias": f"proximity:{lng},{lat}",
            "limit": 20,
            "apiKey": api_key
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        
        lawyers = [
            LawyerLocation(
                name=f.get("properties", {}).get("name", "Law Office"),
                address=f.get("properties", {}).get("address_line2"),
                city=f.get("properties", {}).get("city"),
                distance=round(f.get("properties", {}).get("distance", 0)),
                lat=f.get("properties", {}).get("lat"),
                lon=f.get("properties", {}).get("lon")
            )
            for f in data.get("features", [])
        ]
        
        # Get specializations for category
        category = category or "Other"
        specializations = SPECIALIZATION_MAP.get(category, SPECIALIZATION_MAP["Other"])
        
        logger.info(f"Found {len(lawyers)} lawyers nearby for category: {category}")
        
        return NearbyLawyersResponse(
            count=len(lawyers),
            lawyers=lawyers,
            category=category,
            recommendedSpecializations=specializations
        )
        
    except httpx.HTTPError as e:
        logger.error(f"Geoapify API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch nearby lawyers")
    except Exception as e:
        logger.error(f"Unexpected error in lawyer search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == '__main__':
    logger.info("Starting Legal AI Backend server")
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)