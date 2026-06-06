@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM  FIX PYMUPDF INSTALLATION
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo ╔═══════════════════════════════════════════════════════════════════════╗
echo ║  FIXING PYMUPDF MODULE CONFLICT                                       ║
echo ╚═══════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Activate venv
call venv\Scripts\activate.bat

echo [1/4] Uninstalling broken PyMuPDF...
pip uninstall -y PyMuPDF fitz pymupdf

echo.
echo [2/4] Clearing pip cache...
pip cache purge

echo.
echo [3/4] Installing correct PyMuPDF version...
pip install --no-cache-dir PyMuPDF==1.24.14

echo.
echo [4/4] Verifying installation...
python -c "import fitz; print('[OK] PyMuPDF version:', fitz.__version__)"

if errorlevel 1 (
    echo [ERROR] Installation failed
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════════════════════════╗
echo ║  FIX COMPLETE                                                         ║
echo ╚═══════════════════════════════════════════════════════════════════════╝
echo.
echo You can now run: python main.py
echo.
pause
