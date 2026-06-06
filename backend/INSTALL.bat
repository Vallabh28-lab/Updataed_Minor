@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM  LEGAL AI BACKEND — COMPLETE INSTALLATION SCRIPT
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo ╔═══════════════════════════════════════════════════════════════════════╗
echo ║  LEGAL AI BACKEND — AUTOMATED SETUP                                   ║
echo ╚═══════════════════════════════════════════════════════════════════════╝
echo.

REM ── Step 1: Check Python ───────────────────────────────────────────────────
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)
python --version
echo [OK] Python found
echo.

REM ── Step 2: Virtual Environment ────────────────────────────────────────────
echo [2/5] Setting up virtual environment...
cd /d "%~dp0"
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)
echo.

REM ── Step 3: Activate and Upgrade pip ───────────────────────────────────────
echo [3/5] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated
echo.

echo [3/5] Upgrading pip...
python -m pip install --upgrade pip setuptools wheel
echo.

REM ── Step 4: Install Dependencies ───────────────────────────────────────────
echo [4/5] Installing Python dependencies...
echo This may take 2-3 minutes...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] All dependencies installed
echo.

REM ── Step 5: Verify Critical Binaries ───────────────────────────────────────
echo [5/5] Verifying external dependencies...

REM Check Tesseract
if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    echo [OK] Tesseract OCR found
) else (
    echo [WARNING] Tesseract OCR not found at: C:\Program Files\Tesseract-OCR
    echo Install from: https://github.com/UB-Mannheim/tesseract/wiki
)

REM Check Poppler (optional for PDF OCR)
if exist "..\poppler\bin\pdftoppm.exe" (
    echo [OK] Poppler found
) else (
    echo [INFO] Poppler not found (optional, for PDF-to-image conversion)
)

echo.
echo ╔═══════════════════════════════════════════════════════════════════════╗
echo ║  SETUP COMPLETE                                                       ║
echo ╚═══════════════════════════════════════════════════════════════════════╝
echo.
echo To start the backend server:
echo   python main.py
echo.
echo Server will run on: http://127.0.0.1:5000
echo.
pause
