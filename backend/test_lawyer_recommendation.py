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
    results = suggest_lawyer_types(test_text, top_n=5)
    
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
