import logging
import re
from typing import List, Dict, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from collections import defaultdict

# Configure logging
logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(bind=engine)


class LawyerMatcher:
    """
    Production-grade lawyer type matching engine that scores
    lawyer types based on extracted text from legal documents.
    """
    
    # Scoring weights
    LEGAL_TERM_SCORE = 1
    CLAUSE_SCORE = 3
    RISK_KEYWORD_SCORE = 5
    
    def __init__(self):
        self.session = SessionLocal()
        logger.info("LawyerMatcher initialized with database connection")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
    
    def close(self):
        """Close database session"""
        if self.session:
            self.session.close()
            logger.info("Database session closed")
    
    def _normalize_text(self, text: str) -> str:
        """
        Normalize text for matching by converting to lowercase
        and removing extra whitespace.
        
        Args:
            text: Raw text string
            
        Returns:
            Normalized lowercase text
        """
        if not text:
            return ""
        
        # Convert to lowercase and remove extra whitespace
        normalized = re.sub(r'\s+', ' ', text.lower().strip())
        logger.debug(f"Normalized text length: {len(normalized)} characters")
        return normalized
    
    def _split_csv_field(self, field: str) -> List[str]:
        """
        Split comma-separated field into list of terms.
        
        Args:
            field: Comma-separated string from database
            
        Returns:
            List of individual terms
        """
        if not field:
            return []
        
        # Split by comma and clean each term
        terms = [term.strip().lower() for term in field.split(',') if term.strip()]
        return terms
    
    def _count_matches(self, text: str, terms: List[str]) -> Tuple[int, List[str]]:
        """
        Count how many terms appear in the text.
        
        Args:
            text: Normalized text to search in
            terms: List of terms to search for
            
        Returns:
            Tuple of (match_count, matched_terms)
        """
        matched_terms = []
        
        for term in terms:
            # Use word boundary matching for accurate results
            pattern = r'\b' + re.escape(term) + r'\b'
            if re.search(pattern, text):
                matched_terms.append(term)
        
        return len(matched_terms), matched_terms
    
    def _calculate_lawyer_score(
        self, 
        text: str, 
        legal_terms: str, 
        clauses: str, 
        risk_keywords: str
    ) -> Dict[str, any]:
        """
        Calculate relevance score for a lawyer type based on text matching.
        
        Args:
            text: Normalized extracted text
            legal_terms: Comma-separated legal terms from database
            clauses: Comma-separated clauses from database
            risk_keywords: Comma-separated risk keywords from database
            
        Returns:
            Dictionary with score and matched items
        """
        # Parse CSV fields
        legal_terms_list = self._split_csv_field(legal_terms)
        clauses_list = self._split_csv_field(clauses)
        risk_keywords_list = self._split_csv_field(risk_keywords)
        
        # Count matches
        legal_matches, matched_legal = self._count_matches(text, legal_terms_list)
        clause_matches, matched_clauses = self._count_matches(text, clauses_list)
        risk_matches, matched_risks = self._count_matches(text, risk_keywords_list)
        
        # Calculate weighted score
        score = (
            legal_matches * self.LEGAL_TERM_SCORE +
            clause_matches * self.CLAUSE_SCORE +
            risk_matches * self.RISK_KEYWORD_SCORE
        )
        
        return {
            'score': score,
            'matched_legal_terms': matched_legal,
            'matched_clauses': matched_clauses,
            'matched_risk_keywords': matched_risks,
            'term_count': legal_matches,
            'clause_count': clause_matches,
            'risk_count': risk_matches
        }
    
    def find_matching_lawyer_types(self, extracted_text: str, top_n: int = 5) -> List[Dict]:
        """
        Find and rank lawyer types based on extracted document text.
        
        Args:
            extracted_text: OCR extracted text from legal document
            top_n: Number of top results to return (default: 5)
            
        Returns:
            List of dictionaries with lawyer type recommendations sorted by score
            
        Example:
            [
                {
                    "lawyer_type": "Corporate Lawyer",
                    "score": 92,
                    "legal_domain": "Corporate Law",
                    "matched_terms": ["shareholder agreement", "board resolution"],
                    "matched_clauses": ["termination clause"],
                    "matched_risks": ["breach"],
                    "confidence": "High"
                },
                ...
            ]
        """
        logger.info("Starting lawyer type matching process")
        logger.debug(f"Extracted text length: {len(extracted_text)} characters")
        
        # Normalize input text
        normalized_text = self._normalize_text(extracted_text)
        
        if not normalized_text:
            logger.warning("Empty or invalid extracted text provided")
            return []
        
        try:
            # Fetch all lawyer mappings from database
            query = text("""
                SELECT 
                    lawyer_type,
                    legal_domain,
                    common_legal_terms,
                    common_clauses,
                    risk_keywords,
                    document_types,
                    urgency_indicators,
                    related_lawyer_types
                FROM lawyer_mapping
            """)
            
            result = self.session.execute(query)
            rows = result.fetchall()
            
            logger.info(f"Fetched {len(rows)} lawyer types from database")
            
            if not rows:
                logger.error("No lawyer mappings found in database")
                return []
            
            # Score each lawyer type
            lawyer_scores = []
            
            for row in rows:
                lawyer_type = row[0]
                legal_domain = row[1]
                legal_terms = row[2]
                clauses = row[3]
                risk_keywords = row[4]
                document_types = row[5]
                urgency_indicators = row[6]
                related_lawyer_types = row[7]
                
                # Calculate score
                score_data = self._calculate_lawyer_score(
                    normalized_text,
                    legal_terms,
                    clauses,
                    risk_keywords
                )
                
                # Skip if no matches found
                if score_data['score'] == 0:
                    logger.debug(f"No matches for {lawyer_type}")
                    continue
                
                # Determine confidence level
                confidence = self._get_confidence_level(score_data['score'])
                
                lawyer_scores.append({
                    'lawyer_type': lawyer_type,
                    'legal_domain': legal_domain,
                    'score': score_data['score'],
                    'matched_terms': score_data['matched_legal_terms'],
                    'matched_clauses': score_data['matched_clauses'],
                    'matched_risks': score_data['matched_risk_keywords'],
                    'term_count': score_data['term_count'],
                    'clause_count': score_data['clause_count'],
                    'risk_count': score_data['risk_count'],
                    'confidence': confidence,
                    'document_types': document_types,
                    'urgency_indicators': urgency_indicators,
                    'related_types': related_lawyer_types
                })
                
                logger.debug(
                    f"{lawyer_type}: score={score_data['score']}, "
                    f"terms={score_data['term_count']}, "
                    f"clauses={score_data['clause_count']}, "
                    f"risks={score_data['risk_count']}"
                )
            
            # Sort by score (descending)
            lawyer_scores.sort(key=lambda x: x['score'], reverse=True)
            
            # Return top N results
            top_results = lawyer_scores[:top_n]
            
            logger.info(
                f"Matching complete. Found {len(lawyer_scores)} matches, "
                f"returning top {len(top_results)}"
            )
            
            if top_results:
                logger.info(
                    f"Top recommendation: {top_results[0]['lawyer_type']} "
                    f"(score: {top_results[0]['score']}, confidence: {top_results[0]['confidence']})"
                )
            
            return top_results
            
        except Exception as e:
            logger.error(f"Error during lawyer type matching: {str(e)}", exc_info=True)
            raise
    
    def _get_confidence_level(self, score: int) -> str:
        """
        Determine confidence level based on score.
        
        Args:
            score: Calculated relevance score
            
        Returns:
            Confidence level string (High/Medium/Low)
        """
        if score >= 20:
            return "High"
        elif score >= 10:
            return "Medium"
        else:
            return "Low"
    
    def get_lawyer_type_details(self, lawyer_type: str) -> Dict:
        """
        Get detailed information about a specific lawyer type.
        
        Args:
            lawyer_type: Name of the lawyer type
            
        Returns:
            Dictionary with complete lawyer type information
        """
        logger.info(f"Fetching details for lawyer type: {lawyer_type}")
        
        try:
            query = text("""
                SELECT 
                    lawyer_type,
                    legal_domain,
                    common_legal_terms,
                    common_clauses,
                    risk_keywords,
                    document_types,
                    urgency_indicators,
                    related_lawyer_types
                FROM lawyer_mapping
                WHERE lawyer_type = :lawyer_type
            """)
            
            result = self.session.execute(query, {"lawyer_type": lawyer_type})
            row = result.fetchone()
            
            if not row:
                logger.warning(f"Lawyer type not found: {lawyer_type}")
                return None
            
            return {
                'lawyer_type': row[0],
                'legal_domain': row[1],
                'common_legal_terms': self._split_csv_field(row[2]),
                'common_clauses': self._split_csv_field(row[3]),
                'risk_keywords': self._split_csv_field(row[4]),
                'document_types': self._split_csv_field(row[5]),
                'urgency_indicators': self._split_csv_field(row[6]),
                'related_lawyer_types': self._split_csv_field(row[7])
            }
            
        except Exception as e:
            logger.error(f"Error fetching lawyer type details: {str(e)}", exc_info=True)
            raise


def find_matching_lawyer_types(extracted_text: str, top_n: int = 5) -> List[Dict]:
    """
    Convenience function for one-off lawyer type matching.
    
    Args:
        extracted_text: OCR extracted text from legal document
        top_n: Number of top results to return
        
    Returns:
        List of lawyer type recommendations
    """
    with LawyerMatcher() as matcher:
        return matcher.find_matching_lawyer_types(extracted_text, top_n)


# Example usage and testing
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='[%(levelname)s] [%(asctime)s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Test text
    sample_text = """
    This shareholder agreement contains provisions regarding board resolution,
    termination clause, and potential breach of contract. The corporate structure
    includes liability limitations and indemnification clauses.
    """
    
    print("Testing Lawyer Matcher Service")
    print("=" * 60)
    print(f"Sample text: {sample_text[:100]}...\n")
    
    try:
        results = find_matching_lawyer_types(sample_text, top_n=5)
        
        print(f"\nTop {len(results)} Lawyer Type Recommendations:")
        print("=" * 60)
        
        for i, lawyer in enumerate(results, 1):
            print(f"\n{i}. {lawyer['lawyer_type']}")
            print(f"   Legal Domain: {lawyer['legal_domain']}")
            print(f"   Score: {lawyer['score']}")
            print(f"   Confidence: {lawyer['confidence']}")
            print(f"   Matched Terms: {', '.join(lawyer['matched_terms'][:3])}")
            print(f"   Matched Clauses: {', '.join(lawyer['matched_clauses'][:3])}")
            print(f"   Matched Risks: {', '.join(lawyer['matched_risks'][:3])}")
        
    except Exception as e:
        print(f"\nError: {str(e)}")
