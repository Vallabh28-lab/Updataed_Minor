import logging
from typing import List, Dict, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Configure logging
logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(bind=engine)


class LawyerLocator:
    """
    Production-grade lawyer location service using PostGIS spatial queries
    to find nearby lawyers based on user location and recommended types.
    """
    
    def __init__(self):
        self.session = SessionLocal()
        logger.info("LawyerLocator initialized with database connection")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
    
    def close(self):
        """Close database session"""
        if self.session:
            self.session.close()
            logger.info("Database session closed")
    
    def _validate_coordinates(self, latitude: float, longitude: float) -> bool:
        """
        Validate latitude and longitude ranges.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            True if valid, False otherwise
        """
        if not (-90 <= latitude <= 90):
            logger.error(f"Invalid latitude: {latitude}. Must be between -90 and 90")
            return False
        
        if not (-180 <= longitude <= 180):
            logger.error(f"Invalid longitude: {longitude}. Must be between -180 and 180")
            return False
        
        return True
    
    def find_nearby_lawyers(
        self,
        latitude: float,
        longitude: float,
        lawyer_types: List[str],
        radius: int = 10000,
        limit: int = 10
    ) -> List[Dict]:
        """
        Find nearby lawyers matching recommended types using PostGIS spatial queries.
        
        Args:
            latitude: User's latitude coordinate
            longitude: User's longitude coordinate
            lawyer_types: List of recommended lawyer types to search for
            radius: Search radius in meters (default: 10km)
            limit: Maximum number of results to return (default: 10)
            
        Returns:
            List of dictionaries containing lawyer information with distance
            
        Example:
            [
                {
                    "id": 1,
                    "name": "Anita Mehra",
                    "specialization": "Corporate Lawyer",
                    "experience_years": 15,
                    "phone": "9876543210",
                    "distance": 504.5
                },
                ...
            ]
        """
        logger.info(
            f"Starting nearby lawyer search: "
            f"location=({latitude}, {longitude}), "
            f"types={lawyer_types}, "
            f"radius={radius}m, "
            f"limit={limit}"
        )
        
        # Validate coordinates
        if not self._validate_coordinates(latitude, longitude):
            raise ValueError("Invalid latitude or longitude coordinates")
        
        # Validate lawyer types
        if not lawyer_types or len(lawyer_types) == 0:
            logger.warning("No lawyer types provided for search")
            return []
        
        try:
            # Create PostGIS point from user coordinates (longitude, latitude order for PostGIS)
            user_point = f"POINT({longitude} {latitude})"
            logger.debug(f"User point: {user_point}")
            
            # Build SQL query with PostGIS spatial functions
            query = text("""
                SELECT
                    id,
                    name,
                    specialization,
                    experience_years,
                    phone,
                    ROUND(
                        ST_Distance(
                            location::geography,
                            ST_GeogFromText(:user_point)
                        )::numeric,
                        2
                    ) AS distance
                FROM lawyers
                WHERE specialization = ANY(:lawyer_types)
                AND ST_DWithin(
                    location::geography,
                    ST_GeogFromText(:user_point),
                    :radius
                )
                ORDER BY distance ASC
                LIMIT :limit;
            """)
            
            logger.debug(f"Executing spatial query with lawyer_types={lawyer_types}")
            
            # Execute query
            result = self.session.execute(
                query,
                {
                    "user_point": user_point,
                    "lawyer_types": lawyer_types,
                    "radius": radius,
                    "limit": limit
                }
            )
            
            # Fetch all results
            rows = result.fetchall()
            
            logger.info(f"Query returned {len(rows)} lawyers within {radius}m radius")
            
            # Convert to list of dictionaries
            lawyers = []
            for row in rows:
                lawyer_data = {
                    "id": row[0],
                    "name": row[1],
                    "specialization": row[2],
                    "experience_years": row[3],
                    "phone": row[4],
                    "distance": float(row[5])  # Distance in meters
                }
                lawyers.append(lawyer_data)
                
                logger.debug(
                    f"Found: {lawyer_data['name']} ({lawyer_data['specialization']}) "
                    f"at {lawyer_data['distance']}m"
                )
            
            if lawyers:
                nearest = lawyers[0]
                logger.info(
                    f"Nearest lawyer: {nearest['name']} "
                    f"({nearest['specialization']}) at {nearest['distance']}m"
                )
            else:
                logger.warning(
                    f"No lawyers found matching types {lawyer_types} "
                    f"within {radius}m of ({latitude}, {longitude})"
                )
            
            return lawyers
            
        except Exception as e:
            logger.error(
                f"Error during nearby lawyer search: {str(e)}",
                exc_info=True
            )
            raise
    
    def find_nearest_lawyer_by_type(
        self,
        latitude: float,
        longitude: float,
        lawyer_type: str,
        radius: int = 50000  # 50km default
    ) -> Optional[Dict]:
        """
        Find the single nearest lawyer of a specific type.
        
        Args:
            latitude: User's latitude
            longitude: User's longitude
            lawyer_type: Specific lawyer type to search for
            radius: Search radius in meters
            
        Returns:
            Dictionary with nearest lawyer info or None if not found
        """
        logger.info(f"Finding nearest {lawyer_type} within {radius}m")
        
        results = self.find_nearby_lawyers(
            latitude=latitude,
            longitude=longitude,
            lawyer_types=[lawyer_type],
            radius=radius,
            limit=1
        )
        
        return results[0] if results else None
    
    def get_lawyers_by_distance_tiers(
        self,
        latitude: float,
        longitude: float,
        lawyer_types: List[str]
    ) -> Dict[str, List[Dict]]:
        """
        Categorize lawyers by distance tiers (Near, Medium, Far).
        
        Args:
            latitude: User's latitude
            longitude: User's longitude
            lawyer_types: List of lawyer types to search
            
        Returns:
            Dictionary with distance categories
            
        Example:
            {
                "near": [...],      # < 5km
                "medium": [...],    # 5-15km
                "far": [...]        # 15-50km
            }
        """
        logger.info("Categorizing lawyers by distance tiers")
        
        # Get all lawyers within 50km
        all_lawyers = self.find_nearby_lawyers(
            latitude=latitude,
            longitude=longitude,
            lawyer_types=lawyer_types,
            radius=50000,
            limit=50
        )
        
        tiers = {
            "near": [],     # < 5km
            "medium": [],   # 5-15km
            "far": []       # 15-50km
        }
        
        for lawyer in all_lawyers:
            distance = lawyer["distance"]
            
            if distance < 5000:
                tiers["near"].append(lawyer)
            elif distance < 15000:
                tiers["medium"].append(lawyer)
            else:
                tiers["far"].append(lawyer)
        
        logger.info(
            f"Tier distribution: "
            f"Near={len(tiers['near'])}, "
            f"Medium={len(tiers['medium'])}, "
            f"Far={len(tiers['far'])}"
        )
        
        return tiers
    
    def count_lawyers_in_area(
        self,
        latitude: float,
        longitude: float,
        lawyer_types: List[str],
        radius: int = 10000
    ) -> Dict[str, int]:
        """
        Count how many lawyers of each type are in the area.
        
        Args:
            latitude: User's latitude
            longitude: User's longitude
            lawyer_types: List of lawyer types
            radius: Search radius in meters
            
        Returns:
            Dictionary mapping lawyer type to count
        """
        logger.info(f"Counting lawyers by type within {radius}m")
        
        user_point = f"POINT({longitude} {latitude})"
        
        try:
            query = text("""
                SELECT
                    specialization,
                    COUNT(*) as lawyer_count
                FROM lawyers
                WHERE specialization = ANY(:lawyer_types)
                AND ST_DWithin(
                    location::geography,
                    ST_GeogFromText(:user_point),
                    :radius
                )
                GROUP BY specialization
                ORDER BY lawyer_count DESC;
            """)
            
            result = self.session.execute(
                query,
                {
                    "user_point": user_point,
                    "lawyer_types": lawyer_types,
                    "radius": radius
                }
            )
            
            counts = {}
            for row in result:
                counts[row[0]] = row[1]
            
            logger.info(f"Lawyer type counts: {counts}")
            return counts
            
        except Exception as e:
            logger.error(f"Error counting lawyers: {str(e)}", exc_info=True)
            raise


def find_nearby_lawyers(
    latitude: float,
    longitude: float,
    lawyer_types: List[str],
    radius: int = 10000,
    limit: int = 10
) -> List[Dict]:
    """
    Convenience function for one-off nearby lawyer searches.
    
    Args:
        latitude: User's latitude
        longitude: User's longitude
        lawyer_types: List of recommended lawyer types
        radius: Search radius in meters
        limit: Maximum results
        
    Returns:
        List of nearby lawyers with distance
    """
    with LawyerLocator() as locator:
        return locator.find_nearby_lawyers(
            latitude=latitude,
            longitude=longitude,
            lawyer_types=lawyer_types,
            radius=radius,
            limit=limit
        )


# Example usage and testing
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='[%(levelname)s] [%(asctime)s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    print("Testing Lawyer Locator Service")
    print("=" * 60)
    
    # Test coordinates (Mumbai, India)
    test_lat = 19.0760
    test_lng = 72.8777
    test_types = ["Corporate Lawyer", "Contract Lawyer"]
    test_radius = 10000  # 10km
    
    print(f"\nSearching for lawyers near ({test_lat}, {test_lng})")
    print(f"Lawyer Types: {test_types}")
    print(f"Radius: {test_radius}m\n")
    
    try:
        results = find_nearby_lawyers(
            latitude=test_lat,
            longitude=test_lng,
            lawyer_types=test_types,
            radius=test_radius,
            limit=10
        )
        
        print(f"Found {len(results)} Nearby Lawyers:")
        print("=" * 60)
        
        for i, lawyer in enumerate(results, 1):
            print(f"\n{i}. {lawyer['name']}")
            print(f"   Specialization: {lawyer['specialization']}")
            print(f"   Experience: {lawyer['experience_years']} years")
            print(f"   Phone: {lawyer['phone']}")
            print(f"   Distance: {lawyer['distance']}m ({lawyer['distance']/1000:.2f}km)")
        
        # Test tier categorization
        print("\n" + "=" * 60)
        print("Testing Distance Tiers:")
        print("=" * 60)
        
        with LawyerLocator() as locator:
            tiers = locator.get_lawyers_by_distance_tiers(
                test_lat, test_lng, test_types
            )
            
            print(f"\nNear (< 5km): {len(tiers['near'])} lawyers")
            print(f"Medium (5-15km): {len(tiers['medium'])} lawyers")
            print(f"Far (15-50km): {len(tiers['far'])} lawyers")
        
    except Exception as e:
        print(f"\nError: {str(e)}")
