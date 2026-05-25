import os
import json
import math
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI(title="Legal AI Backend")

# 🔓 Updated CORS to dynamically accept wildcard local connections to stop blocking requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key Configuration
GEMINI_KEY = "AIzaSyBlZ5ng4goK5pTPxPlg6uTPrPcbrjKWkuo"
genai.configure(api_key=GEMINI_KEY)

class LegalLookupRequest(BaseModel):
    crime_type: str

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "online"}

@app.post("/api/legal-lookup")
async def process_legal_lookup(payload: LegalLookupRequest):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Analyze: {payload.crime_type}. Return JSON: {{'crime': '', 'ipc': '', 'bns': '', 'summary': '', 'citizen_protocols': []}}"
        response = model.generate_content(prompt)
        
        # Safe JSON scrubbing
        clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Processing Error: {str(e)}")

# 🗺️ FIX: Changed from POST to GET to match your frontend fetch request structure perfectly!
@app.get("/api/lawyers")
async def extract_live_osm_lawyers(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(3000), # Incoming radius from frontend select list (e.g. 1000, 3000)
    keyword: Optional[str] = Query("lawyer")
):
    # FIX: Convert radius from meters to latitude degrees (approx 111,000 meters per degree)
    offset = float(radius) / 111000.0
    
    min_lat = lat - offset
    max_lat = lat + offset
    min_lng = lng - offset
    max_lng = lng + offset

    url = "https://overpass-api.de/api/interpreter"
    
    # Strict OSM Overpass Bounding Box order: (min_lat, min_lng, max_lat, max_lng)
    query = f"""[out:json][timeout:25];
    (
      node["office"="lawyer"]({min_lat},{min_lng},{max_lat},{max_lng});
      way["office"="lawyer"]({min_lat},{min_lng},{max_lat},{max_lng});
    );
    out center;"""
    
    try:
        response = requests.post(url, data={'data': query}, timeout=15)
        data = response.json()
        
        results = []
        for el in data.get('elements', []):
            tags = el.get('tags', {})
            
            # Map elements occasionally store coordinates inside a 'center' nesting block
            item_lat = el.get('lat') or el.get('center', {}).get('lat')
            item_lng = el.get('lon') or el.get('center', {}).get('lng') or el.get('center', {}).get('lon')
            
            if not item_lat or not item_lng:
                continue

            results.append({
                "id": el.get('id'),
                "name": tags.get('name') or tags.get('office') or "Independent Legal Counsel",
                "lat": item_lat,
                "lng": item_lng,
                "vicinity": tags.get('addr:full') or f"{tags.get('addr:street', 'Nearby Court Area')}, {tags.get('addr:city', 'Pune')}",
                "phone": tags.get('phone') or tags.get('contact:phone') or "Available by Appointment",
                "rating": 4.5
            })
        return results
    except Exception as e:
        print(f"OSM Overpass Request Fail: {e}")
        return []

@app.post("/api/predict")
async def upload_and_analyze_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        # Decode contents to a clean readable string if it's text/txt/ocr dump
        file_text_sample = content[:2000].decode("utf-8", errors="ignore")
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Analyze this extracted text data from a legal document file:
        ---
        {file_text_sample}
        ---
        Provide a professional summary analysis in valid raw JSON format containing matching keys for summary, risks, and recommended_actions.
        """
        response = model.generate_content(prompt)
        
        clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return {
            "filename": file.filename,
            "status": "Success",
            "analysis": json.loads(clean_text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    # Enforces explicit port alignment to match your frontend network setup configuration exactly
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)