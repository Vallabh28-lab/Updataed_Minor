import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database.database import suggest_lawyer_types
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

print("RUNNING DATABASE QUERY...")
results = suggest_lawyer_types(test_text)
print(f"Total results returned from suggest_lawyer_types: {len(results)}")

print("\nDetailing all lawyers in DB:")
from database.database import engine, text
with engine.connect() as conn:
    rows = conn.execute(text("SELECT lawyer_type, legal_domain, common_legal_terms, common_clauses, risk_keywords FROM lawyer_mapping")).fetchall()
    
    txt = test_text.lower()
    all_words = set(txt.split())
    
    for row in rows:
        combined = (str(row.common_legal_terms) + " " + str(row.common_clauses) + " " + str(row.risk_keywords)).lower()
        matched = []
        for word in all_words:
            word = word.strip()
            if len(word) < 5:
                continue
            if word in combined:
                matched.append(word)
        
        # Stop word filtering
        filtered_matched = list(set([x.lower().strip() for x in matched if x.lower().strip() not in STOP_WORDS]))
        match_count = len(filtered_matched)
        match_percentage = min(match_count * 20, 100)
        
        print(f"Lawyer: {row.lawyer_type}")
        print(f"  All matched: {matched}")
        print(f"  Filtered matched: {filtered_matched}")
        print(f"  Match Count: {match_count}, Match Percentage: {match_percentage}%")
