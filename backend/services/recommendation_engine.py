import logging
from typing import List, Dict, Tuple
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class ScoreBreakdown:
    """Detailed score breakdown for transparency"""
    term_score: float
    clause_score: float
    risk_score: float
    urgency_score: float
    category_score: float
    final_score: float
    confidence: str


class RecommendationEngine:
    """
    Advanced recommendation engine with weighted scoring,
    confidence levels, and explainable match reasons.
    """
    
    # Scoring weights
    TERM_WEIGHT = 0.25
    CLAUSE_WEIGHT = 0.30
    RISK_WEIGHT = 0.25
    URGENCY_WEIGHT = 0.10
    CATEGORY_WEIGHT = 0.10
    
    # Confidence thresholds
    CONFIDENCE_THRESHOLDS = {
        'Highly Recommended': 90,
        'Recommended': 70,
        'Possible Match': 50,
        'Weak Match': 0
    }
    
    # Urgency score mapping
    URGENCY_SCORES = {
        'High': 100,
        'Medium': 60,
        'Low': 30
    }
    
    @staticmethod
    def calculate_lawyer_score(
        lawyer_type_data: Dict,
        legal_category: str,
        urgency_level: str,
        risk_score: int
    ) -> ScoreBreakdown:
        """
        Calculate comprehensive lawyer type recommendation score.
        
        Args:
            lawyer_type_data: Dictionary with matched terms, clauses, risks, counts
            legal_category: Legal category from Gemini analysis
            urgency_level: Urgency level from Gemini (High/Medium/Low)
            risk_score: Risk score from Gemini (0-100)
            
        Returns:
            ScoreBreakdown with detailed component scores
        """
        logger.debug(f"Calculating score for {lawyer_type_data.get('lawyer_type', 'Unknown')}")
        
        # 1. Term Match Score (0-100)
        term_count = lawyer_type_data.get('term_count', 0)
        term_score = min(term_count * 10, 100)
        logger.debug(f"Term score: {term_score} (matched {term_count} terms)")
        
        # 2. Clause Match Score (0-100)
        clause_count = lawyer_type_data.get('clause_count', 0)
        clause_score = min(clause_count * 15, 100)
        logger.debug(f"Clause score: {clause_score} (matched {clause_count} clauses)")
        
        # 3. Risk Match Score (0-100)
        risk_count = lawyer_type_data.get('risk_count', 0)
        risk_match_score = min(risk_count * 20, 100)
        logger.debug(f"Risk match score: {risk_match_score} (matched {risk_count} risk keywords)")
        
        # 4. Urgency Score (0-100)
        urgency_score = RecommendationEngine.URGENCY_SCORES.get(urgency_level, 30)
        logger.debug(f"Urgency score: {urgency_score} (level: {urgency_level})")
        
        # 5. Category Match Score (0-100)
        lawyer_domain = lawyer_type_data.get('legal_domain', '').lower()
        category_match = legal_category.lower() in lawyer_domain
        category_score = 100 if category_match else 30
        logger.debug(f"Category score: {category_score} (match: {category_match})")
        
        # Calculate weighted final score
        final_score = (
            term_score * RecommendationEngine.TERM_WEIGHT +
            clause_score * RecommendationEngine.CLAUSE_WEIGHT +
            risk_match_score * RecommendationEngine.RISK_WEIGHT +
            urgency_score * RecommendationEngine.URGENCY_WEIGHT +
            category_score * RecommendationEngine.CATEGORY_WEIGHT
        )
        
        # Round to 2 decimal places
        final_score = round(final_score, 2)
        
        # Determine confidence level
        confidence = RecommendationEngine._get_confidence_level(final_score)
        
        logger.info(
            f"Final score: {final_score} | Confidence: {confidence} | "
            f"Components: T={term_score}, C={clause_score}, R={risk_match_score}, "
            f"U={urgency_score}, Cat={category_score}"
        )
        
        return ScoreBreakdown(
            term_score=term_score,
            clause_score=clause_score,
            risk_score=risk_match_score,
            urgency_score=urgency_score,
            category_score=category_score,
            final_score=final_score,
            confidence=confidence
        )
    
    @staticmethod
    def _get_confidence_level(score: float) -> str:
        """Determine confidence level based on score thresholds"""
        for level, threshold in RecommendationEngine.CONFIDENCE_THRESHOLDS.items():
            if score >= threshold:
                return level
        return 'Weak Match'
    
    @staticmethod
    def generate_match_reasons(lawyer_type_data: Dict) -> List[str]:
        """
        Generate human-readable reasons for lawyer type match.
        
        Args:
            lawyer_type_data: Dictionary with matched terms, clauses, risks
            
        Returns:
            List of reason strings
        """
        reasons = []
        
        # Add matched terms
        matched_terms = lawyer_type_data.get('matched_terms', [])
        for term in matched_terms[:3]:  # Top 3 terms
            reasons.append(f"Matched legal term: '{term}'")
        
        # Add matched clauses
        matched_clauses = lawyer_type_data.get('matched_clauses', [])
        for clause in matched_clauses[:2]:  # Top 2 clauses
            reasons.append(f"Matched clause: '{clause}'")
        
        # Add matched risks
        matched_risks = lawyer_type_data.get('matched_risks', [])
        for risk in matched_risks[:2]:  # Top 2 risks
            reasons.append(f"Matched risk keyword: '{risk}'")
        
        # Add specialization reason
        if lawyer_type_data.get('legal_domain'):
            reasons.append(f"Specializes in {lawyer_type_data['legal_domain']}")
        
        logger.debug(f"Generated {len(reasons)} match reasons")
        return reasons
    
    @staticmethod
    def rank_nearby_lawyers(
        lawyers: List[Dict],
        recommended_types: List[Dict]
    ) -> List[Dict]:
        """
        Rank nearby lawyers using multi-factor scoring algorithm.
        
        Formula:
        Rank = RecommendationScore + (Experience × 2) - (Distance × 0.5)
        
        Args:
            lawyers: List of nearby lawyers from PostGIS query
            recommended_types: List of recommended lawyer types with scores
            
        Returns:
            Sorted list of lawyers with rank scores
        """
        logger.info(f"Ranking {len(lawyers)} nearby lawyers")
        
        # Create lookup for recommendation scores by specialization
        rec_score_map = {}
        for rec in recommended_types:
            lawyer_type = rec.get('lawyer_type', '')
            score = rec.get('score', 0)
            rec_score_map[lawyer_type] = score
        
        ranked_lawyers = []
        
        for lawyer in lawyers:
            specialization = lawyer.get('specialization', '')
            experience = lawyer.get('experience_years', 0)
            distance_m = lawyer.get('distance', 0)
            distance_km = distance_m / 1000.0
            
            # Get recommendation score for this specialization
            rec_score = rec_score_map.get(specialization, 30)  # Default 30 if not found
            
            # Calculate rank score
            rank_score = (
                rec_score +
                (experience * 2) -
                (distance_km * 0.5)
            )
            
            # Round to 2 decimal places
            rank_score = round(rank_score, 2)
            
            # Add ranking information
            lawyer['rank_score'] = rank_score
            lawyer['recommendation_score'] = rec_score
            
            ranked_lawyers.append(lawyer)
            
            logger.debug(
                f"Ranked: {lawyer.get('name', 'Unknown')} | "
                f"Rank={rank_score} | Rec={rec_score} | "
                f"Exp={experience}y | Dist={distance_km:.1f}km"
            )
        
        # Sort by rank score (descending)
        ranked_lawyers.sort(key=lambda x: x['rank_score'], reverse=True)
        
        if ranked_lawyers:
            top = ranked_lawyers[0]
            logger.info(
                f"Top ranked lawyer: {top.get('name', 'Unknown')} "
                f"(rank: {top['rank_score']})"
            )
        
        return ranked_lawyers
    
    @staticmethod
    def enhance_recommendations(
        lawyer_types: List[Dict],
        legal_category: str,
        urgency_level: str,
        risk_score: int
    ) -> List[Dict]:
        """
        Enhance lawyer type recommendations with scores and reasons.
        
        Args:
            lawyer_types: Raw lawyer type matches from lawyer_matcher
            legal_category: Legal category from analysis
            urgency_level: Urgency level from analysis
            risk_score: Risk score from analysis
            
        Returns:
            Enhanced lawyer types with advanced scoring and reasons
        """
        logger.info(f"Enhancing {len(lawyer_types)} lawyer type recommendations")
        
        enhanced = []
        
        for lt in lawyer_types:
            # Calculate advanced score
            score_breakdown = RecommendationEngine.calculate_lawyer_score(
                lawyer_type_data=lt,
                legal_category=legal_category,
                urgency_level=urgency_level,
                risk_score=risk_score
            )
            
            # Generate match reasons
            reasons = RecommendationEngine.generate_match_reasons(lt)
            
            # Build enhanced recommendation
            enhanced_lt = {
                'lawyer_type': lt['lawyer_type'],
                'legal_domain': lt['legal_domain'],
                'score': score_breakdown.final_score,
                'confidence': score_breakdown.confidence,
                'matched_terms': lt.get('matched_terms', []),
                'matched_clauses': lt.get('matched_clauses', []),
                'matched_risks': lt.get('matched_risks', []),
                'term_count': lt.get('term_count', 0),
                'clause_count': lt.get('clause_count', 0),
                'risk_count': lt.get('risk_count', 0),
                'match_reasons': reasons,
                'score_breakdown': {
                    'term_score': score_breakdown.term_score,
                    'clause_score': score_breakdown.clause_score,
                    'risk_score': score_breakdown.risk_score,
                    'urgency_score': score_breakdown.urgency_score,
                    'category_score': score_breakdown.category_score
                }
            }
            
            enhanced.append(enhanced_lt)
            
            logger.debug(
                f"Enhanced {lt['lawyer_type']}: "
                f"score={score_breakdown.final_score}, "
                f"confidence={score_breakdown.confidence}, "
                f"reasons={len(reasons)}"
            )
        
        # Sort by score (descending)
        enhanced.sort(key=lambda x: x['score'], reverse=True)
        
        logger.info(
            f"Enhanced recommendations complete. "
            f"Top: {enhanced[0]['lawyer_type']} ({enhanced[0]['score']})"
        )
        
        return enhanced


# Convenience functions
def calculate_score(
    lawyer_type_data: Dict,
    legal_category: str,
    urgency_level: str,
    risk_score: int
) -> ScoreBreakdown:
    """Calculate lawyer type score"""
    return RecommendationEngine.calculate_lawyer_score(
        lawyer_type_data, legal_category, urgency_level, risk_score
    )


def rank_lawyers(
    lawyers: List[Dict],
    recommended_types: List[Dict]
) -> List[Dict]:
    """Rank nearby lawyers"""
    return RecommendationEngine.rank_nearby_lawyers(lawyers, recommended_types)


def enhance_recommendations(
    lawyer_types: List[Dict],
    legal_category: str,
    urgency_level: str,
    risk_score: int
) -> List[Dict]:
    """Enhance recommendations with advanced scoring"""
    return RecommendationEngine.enhance_recommendations(
        lawyer_types, legal_category, urgency_level, risk_score
    )


# Testing
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='[%(levelname)s] %(name)s: %(message)s'
    )
    
    print("Testing Recommendation Engine")
    print("=" * 60)
    
    # Sample lawyer type data
    sample_lawyer = {
        'lawyer_type': 'Corporate Lawyer',
        'legal_domain': 'Corporate Law',
        'matched_terms': ['shareholder agreement', 'merger', 'acquisition'],
        'matched_clauses': ['termination clause', 'liability clause'],
        'matched_risks': ['breach', 'default'],
        'term_count': 3,
        'clause_count': 2,
        'risk_count': 2
    }
    
    # Test scoring
    print("\n1. Testing Score Calculation:")
    print("-" * 60)
    score = calculate_score(
        sample_lawyer,
        legal_category='Corporate',
        urgency_level='High',
        risk_score=75
    )
    print(f"Final Score: {score.final_score}")
    print(f"Confidence: {score.confidence}")
    print(f"Breakdown: T={score.term_score}, C={score.clause_score}, "
          f"R={score.risk_score}, U={score.urgency_score}, Cat={score.category_score}")
    
    # Test match reasons
    print("\n2. Testing Match Reasons:")
    print("-" * 60)
    reasons = RecommendationEngine.generate_match_reasons(sample_lawyer)
    for i, reason in enumerate(reasons, 1):
        print(f"{i}. {reason}")
    
    # Test lawyer ranking
    print("\n3. Testing Lawyer Ranking:")
    print("-" * 60)
    sample_lawyers = [
        {'name': 'Anita Mehra', 'specialization': 'Corporate Lawyer', 
         'experience_years': 15, 'distance': 2000},
        {'name': 'Rajesh Kumar', 'specialization': 'Corporate Lawyer', 
         'experience_years': 10, 'distance': 1000},
        {'name': 'Priya Sharma', 'specialization': 'Corporate Lawyer', 
         'experience_years': 20, 'distance': 5000}
    ]
    
    sample_recs = [{'lawyer_type': 'Corporate Lawyer', 'score': 92}]
    
    ranked = rank_lawyers(sample_lawyers, sample_recs)
    
    for i, lawyer in enumerate(ranked, 1):
        print(f"{i}. {lawyer['name']}: Rank={lawyer['rank_score']}, "
              f"Exp={lawyer['experience_years']}y, Dist={lawyer['distance']/1000}km")
