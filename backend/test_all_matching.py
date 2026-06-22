import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database.database import engine, text
from test_lawyer_recommendation import test_text

STOP_WORDS = {
    "agreement",
    "contract",
    "payment",
    "consultant",
    "services",
    "termination",
    "performance",
    "invoice",
    "commission",
    "corporate",
}

def suggest_lawyer_types_all(search_text):
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
        return results

# Simulate the caller logic (with the proposed filter and sorting)
search_text = test_text
recommended_raw = suggest_lawyer_types_all(search_text)

recommended_lawyers = []
for item in recommended_raw:
    matched = (
        item.get("matched_terms", [])
        + item.get("matched_clauses", [])
        + item.get("matched_risks", [])
    )

    matched = list(
        set(
            [
                x.lower().strip()
                for x in matched
                if x.lower().strip() not in STOP_WORDS
            ]
        )
    )

    match_count = len(matched)
    match_percentage = min(match_count * 20, 100)

    if match_percentage >= 60 and match_count >= 3:
        recommended_lawyers.append(
            {
                "lawyer_type": item.get("lawyer_type", ""),
                "legal_domain": item.get("domain", ""),
                "match_percentage": match_percentage,
                "matched_items": matched,
                "match_count": match_count,
            }
        )

recommended = sorted(
    recommended_lawyers,
    key=lambda x: x["match_percentage"],
    reverse=True
)[:5]

print("RECOMMENDED LAWYERS:")
for r in recommended:
    print(f"- {r['lawyer_type']} ({r['match_percentage']}%, count={r['match_count']})")
