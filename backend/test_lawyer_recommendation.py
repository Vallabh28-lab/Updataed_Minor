"""
Test script for simplified lawyer recommendation system
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database.database import suggest_lawyer_types

# Test document text
test_text = """
Professional Services Agreement

This agreement contains the following key provisions:
- Payment Clause: Net 30 days payment terms
- Liability Clause: Limited liability to contract value
- Compensation Terms: Fixed monthly retainer of $5000
- Key Personnel Restriction: Named consultants cannot be replaced without approval
- Termination Clause: 30 days notice required
- Confidentiality Clause: All proprietary information must be protected
- Intellectual Property: Work product owned by client
"""

print("=" * 70)
print("SIMPLIFIED LAWYER RECOMMENDATION SYSTEM - TEST")
print("=" * 70)
print()
print("Document Text:")
print("-" * 70)
print(test_text)
print()
print("=" * 70)
print("SEARCHING LAWYER_MAPPING DATABASE...")
print("=" * 70)
print()

try:
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

    raw_results = suggest_lawyer_types(test_text)
    
    results = []
    for item in raw_results:
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
        
        result = {
            "lawyer_type": item.get("lawyer_type", ""),
            "legal_domain": item.get("domain", ""),
            "match_percentage": match_percentage,
            "matched_items": matched,
            "match_count": match_count,
        }
        
        if match_percentage >= 60 and match_count >= 3:
            results.append(result)
            
    results = sorted(
        results,
        key=lambda x: x["match_percentage"],
        reverse=True
    )[:5]
    
    if not results:
        print("❌ No matching lawyer types found!")
        print()
        print("Possible reasons:")
        print("1. lawyer_mapping table is empty")
        print("2. No matching terms in database")
        print("3. Database connection failed")
    else:
        print(f"✅ Found {len(results)} matching lawyer types!")
        print()
        print("RECOMMENDED LAWYERS TO CONSULT:")
        print("=" * 70)
        
        for i, lawyer in enumerate(results, 1):
            print()
            print(f"{i}. {lawyer['lawyer_type']} ({lawyer['match_percentage']}%)")
            print(f"   Legal Domain: {lawyer['legal_domain']}")
            print(f"   Match Count: {lawyer['match_count']} items")
            print(f"   Detected:")
            
            for item in lawyer['matched_items'][:5]:
                print(f"      ✓ {item}")
            
            if len(lawyer['matched_items']) > 5:
                print(f"      ... +{len(lawyer['matched_items']) - 5} more")
        
        print()
        print("=" * 70)
        print("✅ TEST COMPLETED SUCCESSFULLY")
        print("=" * 70)

except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    print()
    import traceback
    traceback.print_exc()
