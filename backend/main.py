import os
import io
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import easyocr

# Advanced Image Processing Libraries
import cv2
import numpy as np

# 1. Initialize the FastAPI instance
app = FastAPI(title="Minor Project OCR API")

# 2. Setup CORS Middleware (Allows your frontend to communicate with this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup Model Path and Load Reader
MODEL_DIR = os.path.join(os.path.dirname(__file__), "easyocr_models")
print("🔄 Loading EasyOCR engine into server memory...")
reader = easyocr.Reader(['en'], gpu=False, model_storage_directory=MODEL_DIR)
print("✅ OCR Server Ready!")

# 4. Endpoints
@app.get("/")
def home():
    return {"status": "Online", "message": "OCR Backend API is running perfectly with Max-Accuracy pipeline."}

@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Read the uploaded image file directly into memory bytes
        image_bytes = await file.read()
        
        # Load raw image array from bytes using OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # ==========================================================
        # 🔥 ADVANCED OPENCV PREPROCESSING FOR MAXIMUM ACCURACY
        # ==========================================================
        
        # 1. UPSCALE: Make small or pixelated text 2x larger to reveal structural loops
        img_large = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

        # 2. GRAYSCALE: Drop color data to isolate structural details and reduce noise
        gray = cv2.cvtColor(img_large, cv2.COLOR_BGR2GRAY)

        # 3. BILATERAL FILTER: Smooth background pixel texture without blurring letter boundaries
        filtered = cv2.bilateralFilter(gray, 9, 75, 75)

        # 4. ADAPTIVE THRESHOLDING: Create absolute black/white mask tailored to localized lighting
        binary_img = cv2.adaptiveThreshold(
            filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        # ==========================================================
        
        # Pass the heavily optimized binary image array straight into EasyOCR
        # paragraph=True uses sentence structures to contextually auto-correct typos
        result = reader.readtext(binary_img, paragraph=True)
        
        # Format the text outputs cleanly
        extracted_lines = []
        for item in result:
            extracted_lines.append(item[1])  # item[1] contains the string text
            
        full_text = " ".join(extracted_lines)
        
        # Write the text directly to a file in VS Code
        output_file_path = os.path.join(os.path.dirname(__file__), "extracted_output.txt")
        with open(output_file_path, "w", encoding="utf-8") as f:
            f.write(f"📄 EXTRACTED FROM: {file.filename}\n")
            f.write("="*40 + "\n")
            f.write(full_text)
            f.write("\n" + "="*40 + "\n")
            
        print(f"📝 Output file updated successfully at: {output_file_path}")
            
        return {
            "success": True,
            "filename": file.filename,
            "text_lines": extracted_lines,
            "full_text": full_text,
            "saved_to_file": "extracted_output.txt"
        }
        
    except Exception as e:
        print(f"❌ Error encountered during execution: {str(e)}")
        return {"success": False, "error": str(e)}