# TODO - Case Prediction backend (Flask+React)

## Plan items
- [ ] Create/extend Python prediction engine in `backend/main.py` (or a new module) to:
  - [ ] Load the new CSV dataset from `CASE_SEARCH_DATASET/archive (2)/case_files_total.csv` using pandas.
  - [ ] Implement statutory mapping from Event Description/Category -> IPC section -> BNS 2023 section using `backend/src/data/legal_statutes.json`.
  - [ ] Implement predictive analytics scoring ALLOWED vs DISMISSED using evidentiary heuristics + Gemini semantic grounding.
  - [ ] Enforce exact JSON output schema.
- [ ] Add/adjust API route in Python to accept required fields for Case Prediction:
  - [ ] `description` and `case_category` (plus optional fields if present in frontend).
- [ ] Ensure Node/Express gateway already proxies `/api/predict` to FastAPI; verify request/response shape compatibility.
- [ ] Add minimal tests / a local invocation path (optional) to validate JSON parsing.

## Progress
- [ ] Repo understood; existing FastAPI `/api/predict` endpoint found.
- [ ] Need to refactor/extend prediction logic to meet statutory mapping + schema requirements.

