from sqlalchemy import create_engine, text
import re

DATABASE_URL = (
    "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
)

engine = create_engine(DATABASE_URL)

# -------------------------

# SCORE WEIGHTS

# -------------------------

TERM_WEIGHT = 1
CLAUSE_WEIGHT = 18
RISK_WEIGHT = 12

MIN_MATCH_COUNT = 3

# -------------------------

# DATABASE TEST

# -------------------------

def test_connection():
    try:
        with engine.connect():
            print("Database Connected Successfully!")
    except Exception as e:
        print("Database Error:", e)


# -------------------------

# TEXT CLEANING

# -------------------------

def clean_text(text_input):
    if not text_input:
        return set()

    cleaned = re.sub(
        r"[^a-zA-Z0-9 ]",
        " ",
        str(text_input).lower(),
    )

    stop_words = {
        "the",
        "a",
        "an",
        "and",
        "or",
        "to",
        "for",
        "of",
        "with",
        "in",
        "on",
        "is",
        "are",
        "agreement",
        "service",
        "services",
        "company",
        "document",
        "section",
        "general",
        "legal",
        "payment",
        "professional",
    }

    return {
        word
        for word in cleaned.split()
        if len(word) > 3 and word not in stop_words
    }


# -------------------------

# SCORE ENGINE

# -------------------------

def calculate_score(words, terms, clauses, risks):
    term_hits = words & clean_text(terms)
    clause_hits = words & clean_text(clauses)
    risk_hits = words & clean_text(risks)

    total_hits = len(term_hits) + len(clause_hits) + len(risk_hits)
    if total_hits < MIN_MATCH_COUNT:
        return 0, set(), set(), set()

    score = 0
    score += len(term_hits) * TERM_WEIGHT
    score += len(clause_hits) * CLAUSE_WEIGHT
    score += len(risk_hits) * RISK_WEIGHT

    return score, term_hits, clause_hits, risk_hits


# -------------------------

# MAIN RECOMMENDER

# -------------------------

def suggest_lawyer_types(document_text):
    try:
        words = clean_text(document_text)

        recommendations = []
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT
                        lawyer_type,
                        legal_domain,
                        common_legal_terms,
                        common_clauses,
                        risk_keywords
                    FROM lawyer_mapping
                    """
                )
            )

            for row in rows:
                lawyer = row[0]
                domain = row[1]
                terms = row[2]
                clauses = row[3]
                risks = row[4]

                score, term_hits, clause_hits, risk_hits = calculate_score(
                    words,
                    terms,
                    clauses,
                    risks,
                )

                if score <= 0:
                    continue

                recommendations.append(
                    {
                        "lawyer_type": lawyer,
                        "domain": domain,
                        "score": score,
                        "matched_terms": sorted(list(term_hits)),
                        "matched_clauses": sorted(list(clause_hits)),
                        "matched_risks": sorted(list(risk_hits)),
                    }
                )

        # Remove duplicates (keep the highest score per lawyer_type)
        unique = {}
        for item in recommendations:
            key = item["lawyer_type"]
            if key not in unique:
                unique[key] = item
            elif item["score"] > unique[key]["score"]:
                unique[key] = item

        final = sorted(
            unique.values(),
            key=lambda x: x["score"],
            reverse=True,
        )

        return final[:5]

    except Exception as e:
        print("\nRecommendation Error:\n")
        print(e)
        return []


# -------------------------

# LOCAL TEST

# -------------------------

if __name__ == "__main__":
    test_connection()

    sample = """
    Professional Services Agreement

    termination

    invoice

    consultant

    compensation

    liability

    breach

    milestone

    payment

    contract
    """

    result = suggest_lawyer_types(sample)

    print("\nSuggested Lawyers:\n")
    for lawyer in result:
        print(
            lawyer["lawyer_type"],
            "-",
            lawyer["domain"],
            "| score:",
            lawyer["score"],
        )

