## main.py indentation fix TODO

- [ ] Normalize indentation issues in `backend/main.py` (notably inside Gemini parsing and lawyer matching loops).
- [ ] Remove stray/incorrect comment separators that break visual structure.
- [ ] Ensure `try/except` blocks align and `recommended_lawyers` is always defined before use.
- [ ] Run a Python syntax check: `python -m py_compile backend/main.py`.
- [ ] Run unit smoke (if available): start app with `python backend/main.py` or `uvicorn backend.main:app --reload` (optional).

