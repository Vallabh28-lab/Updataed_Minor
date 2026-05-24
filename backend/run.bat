@echo off
echo 🚀 Setting Hard Environment Overrides for PaddleOCR...
set FLAGS_use_onednn=0
set FLAGS_allocator_strategy=naive_best_fit

echo 🐍 Activating Virtual Environment...
call venv\Scripts\activate

echo 🔌 Starting FastAPI Server on Port 8000...
uvicorn main:app --reload --port 8000