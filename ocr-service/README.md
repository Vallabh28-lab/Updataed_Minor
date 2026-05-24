# OCR Service — Document Analysis Feature

This folder contains all files related to the Document Analysis & OCR feature.
These are reference/backup copies. The live files are in their original locations.

## Folder Structure

```
ocr-service/
├── backend/
│   ├── main.py               → FastAPI Python server (Tesseract OCR engine, port 8000)
│   └── documents.route.js    → Express route (/api/documents/analyze + /api/documents/translate)
├── frontend/
│   └── DocumentAnalysis.jsx  → React page (upload UI, OCR results, EN/HI/MR language toggle)
└── README.md
```

## Live File Locations

| File | Live Path |
|------|-----------|
| main.py | backend/main.py |
| documents.route.js | backend/src/routes/documents.js |
| DocumentAnalysis.jsx | frontend/src/pages/DocumentAnalysis.jsx |

## How to Run

### 1. Start Python OCR Server (port 8000)
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start Express Gateway (port 5000)
```bash
cd backend
npm run dev
```

### 3. Start React Frontend (port 5173)
```bash
cd frontend
npm run dev
```

## Dependencies

### Python
```bash
pip install fastapi uvicorn pytesseract pillow pdf2image deep-translator python-multipart
```

### Node.js
```bash
npm install axios form-data
```

## Features
- Image OCR (JPG, PNG, TIFF, BMP)
- PDF OCR (requires Poppler in /Tesseract-OCR/../poppler/bin)
- Key term extraction (dates, parties, monetary amounts)
- Legal clause detection (Termination, Liability, Confidentiality, etc.)
- On-demand translation: English → Hindi / Marathi
