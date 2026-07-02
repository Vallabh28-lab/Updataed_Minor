import logging
from typing import List, Dict
from sqlalchemy import create_engine, text

logger = logging.getLogger(__name__)

DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)

# Source weights: higher = more signal, less noise
_WEIGHT_CATEGORY = 5
_WEIGHT_CLAUSE   = 4
_WEIGHT_KEYWORD  = 3
_WEIGHT_SUMMARY  = 1

STOP_WORDS = {
    "agreement", "contract", "payment", "consultant", "services",
    "termination", "performance", "invoice", "commission", "corporate",
    "shall", "party", "parties", "clause", "section", "herein",
}


def suggest_lawyer_types(
    summary: str,
    legal_category: str,
    keywords: List[str],
    risky_clause_types: List[str],
) -> List[Dict]:
    """
    Score lawyer types using weighted source matching.
    Higher weight given to legalCategory and risky clause types
    to avoid generic word noise from summary text.
    """
    logger.info("suggest_lawyer_types called | category=%s | keywords=%d | clauses=%d",
                legal_category, len(keywords), len(risky_clause_types))

    category_txt = legal_category.lower()
    clause_txt   = " ".join(risky_clause_types).lower()
    keyword_txt  = " ".join(keywords).lower()
    summary_txt  = summary.lower()

    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT lawyer_type, legal_domain AS domain,
                   common_legal_terms AS common_terms,
                   common_clauses, risk_keywords
            FROM lawyer_mapping
        """)).fetchall()

    logger.info("Loaded %d lawyer types from DB", len(rows))

    results = []

    for row in rows:
        combined = (
            str(row.common_terms) + " " +
            str(row.common_clauses) + " " +
            str(row.risk_keywords)
        ).lower()

        score = 0
        matched = []

        for word in set(combined.split()):
            word = word.strip(",. ")
            if len(word) < 5 or word in STOP_WORDS:
                continue

            if word in category_txt:
                score += _WEIGHT_CATEGORY
                matched.append(word)
            elif word in clause_txt:
                score += _WEIGHT_CLAUSE
                matched.append(word)
            elif word in keyword_txt:
                score += _WEIGHT_KEYWORD
                matched.append(word)
            elif word in summary_txt:
                score += _WEIGHT_SUMMARY
                matched.append(word)

        matched = list(set(matched))

        if score >= 10:
            results.append({
                "lawyer_type": row.lawyer_type,
                "domain": row.domain,
                "score": score,
                "matched_terms": matched,
                "matched_clauses": [],
                "matched_risks": [],
            })
            logger.debug("  %s -> score=%d matched=%s", row.lawyer_type, score, matched)

    results.sort(key=lambda x: (x["score"], len(x["matched_terms"])), reverse=True)
    logger.info("Returning %d candidate lawyer types", len(results))
    return results
