from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:vallabh@localhost:5432/lawyerdb')

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

with engine.connect() as conn:
    row = conn.execute(text("SELECT summary FROM analyses WHERE id = 22")).fetchone()
    summary = row[0]
    print(f"Summary from DB:\n{summary}\n")
    
    # We will simulate suggest_lawyer_types but without limiting, and filter/sort
    rows = conn.execute(text("SELECT lawyer_type, legal_domain, common_legal_terms, common_clauses, risk_keywords FROM lawyer_mapping")).fetchall()
    
    txt = summary.lower()
    all_words = set(txt.split())
    
    recommended_lawyers = []
    for r in rows:
        combined = (str(r.common_legal_terms) + " " + str(r.common_clauses) + " " + str(r.risk_keywords)).lower()
        matched = []
        for word in all_words:
            word = word.strip()
            # Clean punctuation from word
            word = "".join([c for c in word if c.isalnum()])
            if len(word) < 5:
                continue
            if word in combined:
                matched.append(word)
        
        filtered_matched = list(set([x.lower().strip() for x in matched if x.lower().strip() not in STOP_WORDS]))
        match_count = len(filtered_matched)
        match_percentage = min(match_count * 20, 100)
        
        if match_count > 0:
            print(f"Lawyer: {r.lawyer_type} | Filtered Count: {match_count} | Pct: {match_percentage}% | Matched: {filtered_matched}")
        
        # Proposed filter:
        if match_percentage >= 60 and match_count >= 3:
            recommended_lawyers.append({
                "lawyer_type": r.lawyer_type,
                "legal_domain": r.legal_domain,
                "match_percentage": match_percentage,
                "matched_items": filtered_matched,
                "match_count": match_count,
            })
            
    recommended = sorted(
        recommended_lawyers,
        key=lambda x: x["match_percentage"],
        reverse=True
    )[:5]
    
    print("RECOMMENDED LAWYERS FROM PROPOSED LOGIC:")
    for r in recommended:
        print(f"- {r['lawyer_type']} ({r['match_percentage']}%, count={r['match_count']})")
        print(f"  Matched items: {r['matched_items']}")
