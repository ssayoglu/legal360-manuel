import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import AdminUser
import os

# JWT settings
# Prefer JWT_SECRET, fall back to JWT_SECRET_KEY for backward compatibility
SECRET_KEY = (
    os.environ.get('JWT_SECRET')
    or os.environ.get('JWT_SECRET_KEY')
    or secrets.token_urlsafe(32)
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60  # 24 hours

security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return hash_password(password) == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


async def get_current_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = None
) -> AdminUser:
    """Get current authenticated admin user"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not credentials:
        raise credentials_exception
    
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    if db is None:
        raise credentials_exception
    
    user_data = await db.admin_users.find_one({"id": user_id})
    if user_data is None:
        raise credentials_exception
    
    user = AdminUser(**user_data)
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )
    
    return user


class AuthDependency:
    """Dependency class for authentication"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def __call__(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> AdminUser:
        return await get_current_admin_user(credentials, self.db)


async def create_default_admin_user(db: AsyncIOMotorDatabase):
    """Create default admin user if none exists"""
    existing_admin = await db.admin_users.find_one({"username": "admin"})
    
    if not existing_admin:
        default_admin = AdminUser(
            username="admin",
            password_hash=hash_password("admin123"),
            email="admin@legaldesign.com.tr",
            full_name="Admin User",
            is_active=True
        )
        
        await db.admin_users.insert_one(default_admin.dict())
        print("✅ Default admin user created: username=admin, password=admin123")


async def authenticate_admin(db: AsyncIOMotorDatabase, username: str, password: str) -> Optional[AdminUser]:
    """Authenticate an admin user"""
    user_data = await db.admin_users.find_one({"username": username})
    if not user_data:
        return None
    
    user = AdminUser(**user_data)
    if not verify_password(password, user.password_hash):
        return None
    
    if not user.is_active:
        return None
    
    # Update last login
    await db.admin_users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return user