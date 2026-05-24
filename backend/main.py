import os
import io
import pytesseract
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deep_translator import GoogleTranslator

# Point pytesseract to the local Tesseract-OCR binary in the project folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pytesseract.pytesseract.tesseract_cmd = os.path.join(
    BASE_DIR, '..', 'Tesseract-OCR', 'tesseract.exe'
)

app = FastAPI(title="LegalAI OCR API - Tesseract Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("✅ Tesseract OCR engine ready.")


@app.get("/")
def home():
    return {"status": "Online", "message": "Tesseract OCR backend is running."}


@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename.lower()
    extracted_lines = []

    try:
        # Build language string based on available traineddata files
        tessdata_dir = os.path.join(BASE_DIR, '..', 'Tesseract-OCR', 'tessdata')
        available_langs = ['eng']
        for lang_code in ['hin', 'mar']:
            if os.path.exists(os.path.join(tessdata_dir, f'{lang_code}.traineddata')):
                available_langs.append(lang_code)
        lang_str = '+'.join(available_langs)
        print(f"🌐 OCR languages active: {lang_str}")

        if filename.endswith(".pdf"):
            from pdf2image import convert_from_bytes
            poppler_path = os.path.join(BASE_DIR, '..', 'poppler', 'bin')
            pages = convert_from_bytes(
                contents,
                dpi=300,
                poppler_path=poppler_path if os.path.exists(poppler_path) else None
            )
            for page in pages:
                text = pytesseract.image_to_string(page, lang=lang_str, config='--psm 6')
                extracted_lines.extend([l for l in text.splitlines() if l.strip()])
        else:
            img = Image.open(io.BytesIO(contents)).convert('RGB')
            text = pytesseract.image_to_string(img, lang=lang_str, config='--psm 6')
            extracted_lines = [l for l in text.splitlines() if l.strip()]

        full_text = "\n".join(extracted_lines)

        # Save output to file for debugging
        output_path = os.path.join(BASE_DIR, "extracted_output.txt")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"EXTRACTED FROM: {file.filename}\n{'='*40}\n{full_text}\n{'='*40}\n")

        return {
            "success": True,
            "filename": file.filename,
            "text_lines": extracted_lines,
            "full_text": full_text,
        }

    except Exception as e:
        print(f"❌ OCR Error: {e}")
        return {"success": False, "error": str(e)}


class TranslateRequest(BaseModel):
    text: str
    target: str  # 'hi' for Hindi, 'mr' for Marathi, 'en' for English

@app.post("/api/translate")
def translate_text(req: TranslateRequest):
    try:
        chunks = [req.text[i:i+4500] for i in range(0, len(req.text), 4500)]
        translated = [GoogleTranslator(source='auto', target=req.target).translate(c) for c in chunks]
        return {"success": True, "translated_text": ' '.join(translated)}
    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
