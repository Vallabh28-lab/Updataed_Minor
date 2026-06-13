import os
import jwt
import bcrypt
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24


class AuthService:
    """Production-grade authentication service with JWT and bcrypt"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def create_token(user_id: int, email: str, role: str = 'user') -> str:
        """Create JWT token"""
        expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        
        payload = {
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': expiration,
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        logger.info(f"Token created for user {email}")
        return token
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None
    
    @staticmethod
    def register_user(email: str, password: str, full_name: str, phone: str = None) -> Dict:
        """Register new user"""
        session = SessionLocal()
        
        try:
            # Check if user exists
            result = session.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email}
            )
            
            if result.fetchone():
                logger.warning(f"Registration failed: {email} already exists")
                return {"success": False, "error": "Email already registered"}
            
            # Hash password
            password_hash = AuthService.hash_password(password)
            
            # Insert user
            result = session.execute(
                text("""
                    INSERT INTO users (email, password_hash, full_name, phone)
                    VALUES (:email, :password_hash, :full_name, :phone)
                    RETURNING id, email, full_name, role
                """),
                {
                    "email": email,
                    "password_hash": password_hash,
                    "full_name": full_name,
                    "phone": phone
                }
            )
            
            session.commit()
            user = result.fetchone()
            
            # Create token
            token = AuthService.create_token(user[0], user[1], user[3])
            
            logger.info(f"User registered successfully: {email}")
            
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user[0],
                    "email": user[1],
                    "full_name": user[2],
                    "role": user[3]
                }
            }
            
        except Exception as e:
            session.rollback()
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e)}
        finally:
            session.close()
    
    @staticmethod
    def login_user(email: str, password: str) -> Dict:
        """Authenticate user and return token"""
        session = SessionLocal()
        
        try:
            result = session.execute(
                text("""
                    SELECT id, email, password_hash, full_name, role, is_active
                    FROM users
                    WHERE email = :email
                """),
                {"email": email}
            )
            
            user = result.fetchone()
            
            if not user:
                logger.warning(f"Login failed: User not found - {email}")
                return {"success": False, "error": "Invalid credentials"}
            
            if not user[5]:  # is_active
                logger.warning(f"Login failed: Account inactive - {email}")
                return {"success": False, "error": "Account is inactive"}
            
            # Verify password
            if not AuthService.verify_password(password, user[2]):
                logger.warning(f"Login failed: Invalid password - {email}")
                return {"success": False, "error": "Invalid credentials"}
            
            # Create token
            token = AuthService.create_token(user[0], user[1], user[4])
            
            logger.info(f"User logged in successfully: {email}")
            
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user[0],
                    "email": user[1],
                    "full_name": user[3],
                    "role": user[4]
                }
            }
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e)}
        finally:
            session.close()
    
    @staticmethod
    def get_current_user(token: str) -> Optional[Dict]:
        """Get current user from token"""
        payload = AuthService.verify_token(token)
        
        if not payload:
            return None
        
        session = SessionLocal()
        
        try:
            result = session.execute(
                text("""
                    SELECT id, email, full_name, role, phone
                    FROM users
                    WHERE id = :user_id AND is_active = true
                """),
                {"user_id": payload['user_id']}
            )
            
            user = result.fetchone()
            
            if not user:
                return None
            
            return {
                "id": user[0],
                "email": user[1],
                "full_name": user[2],
                "role": user[3],
                "phone": user[4]
            }
            
        except Exception as e:
            logger.error(f"Get user error: {str(e)}", exc_info=True)
            return None
        finally:
            session.close()


# Convenience functions
def register(email: str, password: str, full_name: str, phone: str = None) -> Dict:
    return AuthService.register_user(email, password, full_name, phone)


def login(email: str, password: str) -> Dict:
    return AuthService.login_user(email, password)


def get_user_from_token(token: str) -> Optional[Dict]:
    return AuthService.get_current_user(token)


# Testing
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    print("Testing Auth Service")
    print("=" * 60)
    
    # Test registration
    print("\n1. Testing Registration:")
    result = register(
        email="test@example.com",
        password="SecurePass123",
        full_name="Test User",
        phone="9876543210"
    )
    print(f"Success: {result.get('success')}")
    if result.get('success'):
        print(f"Token: {result['token'][:50]}...")
        print(f"User: {result['user']}")
    
    # Test login
    print("\n2. Testing Login:")
    result = login(email="test@example.com", password="SecurePass123")
    print(f"Success: {result.get('success')}")
    if result.get('success'):
        token = result['token']
        print(f"Token: {token[:50]}...")
        
        # Test token verification
        print("\n3. Testing Token Verification:")
        user = get_user_from_token(token)
        print(f"User from token: {user}")
