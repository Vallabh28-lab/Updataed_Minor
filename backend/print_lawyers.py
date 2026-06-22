from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:vallabh@localhost:5432/lawyerdb')
with engine.connect() as conn:
    r = conn.execute(text("SELECT lawyer_type, legal_domain, common_legal_terms, common_clauses, risk_keywords FROM lawyer_mapping WHERE lawyer_type IN ('Corporate Lawyer', 'Contract Lawyer', 'Infrastructure Lawyer', 'Construction Lawyer')")).fetchall()
    for row in r:
        print(f"Lawyer: {row.lawyer_type}")
        print(f"  Domain: {row.legal_domain}")
        print(f"  Terms: {row.common_legal_terms}")
        print(f"  Clauses: {row.common_clauses}")
        print(f"  Risks: {row.risk_keywords}")
        print()
