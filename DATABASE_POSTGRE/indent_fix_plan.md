# Indentation Fix Plan (DATABASE_POSTGRE/database.py)

## Information Gathered
- `DATABASE_POSTGRE/database.py` has severe indentation issues:
  - `def test_connection()` body is not indented correctly (blank lines + missing indentation)
  - `clean_text()` uses duplicated/incorrect blank lines around `if` and `return`
  - `calculate_score()` contains each token on its own line, breaking readability and risking syntax errors
  - `suggest_lawyer_types()` has incorrect indentation for `try:` block (extra indentation)
  - `except` block is incorrectly aligned
  - `if name == "**main**":` is wrong and should be `if __name__ == "__main__":`
  - Many parentheses/logic blocks are present but indentation makes the structure inconsistent.

## Plan
1. Reformat `database.py` with correct Python indentation and normal multi-line formatting.
2. Fix the `__main__` guard.
3. Ensure `try/except` blocks align correctly.
4. Make sure functions return correct values and variables are defined.
5. Run `python -m py_compile DATABASE_POSTGRE/database.py` to ensure no syntax errors.

## Dependent Files to be edited
- `DATABASE_POSTGRE/database.py`

## Followup steps
- After compile passes, commit and open a PR.

<ask_followup_question>
Confirm I should proceed to rewrite only `DATABASE_POSTGRE/database.py` to fix indentation/structure and then run a syntax check.
</ask_followup_question>

