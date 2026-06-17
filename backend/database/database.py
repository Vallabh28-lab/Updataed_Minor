import logging
from typing import List, Dict
from sqlalchemy import create_engine, text

logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)


def suggest_lawyer_types(search_text):

    print("\n========== INPUT ==========")
    print(search_text)

    with engine.connect() as conn:

        rows = conn.execute(
            text("""
            SELECT
                lawyer_type,
                legal_domain AS domain,
                common_legal_terms AS common_terms,
                common_clauses,
                risk_keywords
            FROM lawyer_mapping
            """)
        ).fetchall()

        print("\n========== DB ROW COUNT ==========")
        print(len(rows))

        results = []

        txt = search_text.lower()

        for row in rows:

            combined = (
                str(row.common_terms)
                + " "
                + str(row.common_clauses)
                + " "
                + str(row.risk_keywords)
            ).lower()

            matched = []

            score = 0

            for word in set(txt.split()):

                word = word.strip()

                if len(word) < 5:
                    continue

                if word in combined:

                    matched.append(word)
                    score += 10

            # Ignore weak matches
            if score >= 30:

                results.append(
                    {
                        "lawyer_type": row.lawyer_type,

                        "domain": row.domain,

                        "score": min(score, 100),

                        "matched_terms": matched,

                        "matched_clauses": [],

                        "matched_risks": []
                    }
                )

        results.sort(
            key=lambda x: (
                x["score"],
                len(x["matched_terms"])
            ),
            reverse=True
        )

        print("\n========== RESULTS ==========")
        print(results)

        return results[:5]


def _calculate_match_score(
    text: str,
    legal_terms: str,
    clauses: str,
    risks: str
) -> Dict:
    """
    Calculate match score based on term frequency.
    
    Scoring:
    - Legal term match: +1 point
    - Clause match: +3 points
    - Risk keyword match: +5 points
    """
    matched_items = []
    total_score = 0
    match_count = 0
    
    # Parse CSV fields
    term_list = [t.strip().lower() for t in legal_terms.split(',') if t.strip()]
    clause_list = [c.strip().lower() for c in clauses.split(',') if c.strip()]
    risk_list = [r.strip().lower() for r in risks.split(',') if r.strip()]
    
    # Count legal term matches
    for term in term_list:
        if term in text:
            matched_items.append(term)
            total_score += 1
            match_count += 1
    
    # Count clause matches (higher weight)
    for clause in clause_list:
        if clause in text:
            matched_items.append(clause)
            total_score += 3
            match_count += 1
    
    # Count risk keyword matches (highest weight)
    for risk in risk_list:
        if risk in text:
            matched_items.append(risk)
            total_score += 5
            match_count += 1
    
    # Calculate percentage (normalize to 0-100)
    # Max possible score per category: assume 10 terms max per field
    max_possible = (10 * 1) + (10 * 3) + (10 * 5)  # 80
    percentage = min(100, int((total_score / max_possible) * 100))
    
    return {
        'total_score': total_score,
        'match_count': match_count,
        'percentage': percentage,
        'matched_items': matched_items[:10]  # Limit to top 10 for display
    }
