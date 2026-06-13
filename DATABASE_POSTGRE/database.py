from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"

engine = create_engine(DATABASE_URL)


def test_connection():
    try:
        with engine.connect():
            print("Database Connected Successfully!")
    except Exception as e:
        print(e)


def suggest_lawyer_types(document_text):

    try:

        words = set(document_text.lower().split())

        result = []

        with engine.connect() as conn:

            rows = conn.execute(text("""
                SELECT
                    lawyer_type,
                    legal_domain,
                    common_legal_terms,
                    common_clauses,
                    risk_keywords
                FROM lawyer_mapping
            """))

            for row in rows:

                lawyer = row[0]
                domain = row[1]

                terms = str(row[2] or "").lower()
                clauses = str(row[3] or "").lower()
                risks = str(row[4] or "").lower()

                score = 0

                for word in words:

                    if word in terms:
                        score += 2

                    if word in clauses:
                        score += 5

                    if word in risks:
                        score += 8

                if score > 0:

                    result.append({
                        "lawyer_type": lawyer,
                        "domain": domain,
                        "score": score
                    })

        result.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return result[:5]

    except Exception as e:

        print(e)
        return []


if __name__ == "__main__":

    test_connection()

    sample = """
professional services agreement
termination clause
payment clause
liability
invoice
compensation
breach
consultant
"""

    result = suggest_lawyer_types(sample)

    print("\nSuggested Lawyers:\n")

    for row in result:

        print(
            row["lawyer_type"],
            "-",
            row["domain"],
            "| score:",
            row["score"]
        )