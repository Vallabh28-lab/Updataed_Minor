import logging
from typing import List, Dict
from sqlalchemy import create_engine, text

logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)


def suggest_lawyer_types(document_text: str, top_n: int = 5) -> List[Dict]:
    """
    Search lawyer_mapping table and rank lawyer types by document relevance.
    
    Args:
        document_text: Combined text from OCR + AI analysis
        top_n: Number of results to return
        
    Returns:
        List of lawyer types with match percentages
        
    Example:
        [
            {
                "lawyer_type": "Corporate Lawyer",
                "legal_domain": "Corporate Law",
                "match_percentage": 94,
                "matched_items": ["payment clause", "liability clause", "compensation"]
            }
        ]
    """
    logger.info(f"Searching lawyer types for document ({len(document_text)} chars)")
    
    if not document_text or len(document_text.strip()) < 10:
        logger.warning("Document text too short for matching")
        return []
    
    # Normalize text
    search_text = document_text.lower()
    
    try:
        with engine.connect() as conn:
            # Fetch all lawyer mappings
            query = text("""
                SELECT 
                    lawyer_type,
                    legal_domain,
                    common_legal_terms,
                    common_clauses,
                    risk_keywords
                FROM lawyer_mapping
            """)
            
            result = conn.execute(query)
            rows = result.fetchall()
            
            if not rows:
                logger.error("No lawyer mappings found in database")
                return []
            
            logger.info(f"Loaded {len(rows)} lawyer types from database")
            
            # Score each lawyer type
            scored_lawyers = []
            
            for row in rows:
                lawyer_type = row[0]
                legal_domain = row[1]
                legal_terms = row[2] or ""
                clauses = row[3] or ""
                risks = row[4] or ""
                
                # Calculate match score
                score_data = _calculate_match_score(
                    search_text,
                    legal_terms,
                    clauses,
                    risks
                )
                
                # Skip if no matches
                if score_data['total_score'] == 0:
                    continue
                
                scored_lawyers.append({
                    "lawyer_type": lawyer_type,
                    "legal_domain": legal_domain,
                    "match_percentage": score_data['percentage'],
                    "matched_items": score_data['matched_items'],
                    "match_count": score_data['match_count'],
                    "score": score_data['total_score']
                })
            
            # Sort by percentage (descending)
            scored_lawyers.sort(key=lambda x: x['match_percentage'], reverse=True)
            
            # Return top N
            top_results = scored_lawyers[:top_n]
            
            logger.info(
                f"Found {len(scored_lawyers)} matching lawyer types, "
                f"returning top {len(top_results)}"
            )
            
            if top_results:
                logger.info(
                    f"Top match: {top_results[0]['lawyer_type']} "
                    f"({top_results[0]['match_percentage']}%)"
                )
            
            return top_results
            
    except Exception as e:
        logger.error(f"Database error during lawyer matching: {str(e)}")
        raise


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
