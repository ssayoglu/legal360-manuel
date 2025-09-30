from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our new modules
from models import *
from auth import create_default_admin_user
from admin_routes import create_admin_router
from public_routes import create_public_router
from migration_data import LEGAL_PROCESSES_DATA, CALCULATOR_PARAMETERS_DATA, LEGAL_AID_DATA, BLOG_POSTS_DATA, SUPREME_COURT_DECISIONS_DATA, CONTACT_PAGE_CONTENT_DATA, HOME_PAGE_CONTENT_DATA

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="Legal Design Turkey API", 
    version="1.0.0",
    # Configure response serialization to use camelCase for frontend compatibility
    response_model_by_alias=True
)

# Create a router with the /api prefix for legacy endpoints
api_router = APIRouter(prefix="/api")

# Import models
from models import StatusCheck, StatusCheckCreate

# Legacy routes
@api_router.get("/")
async def root():
    return {"message": "Legal Design Turkey API v1.0"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        await db.admin_users.count_documents({})
        return {
            "status": "healthy",
            "message": "API is running and database is connected",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0"
        }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include routers
app.include_router(api_router)
app.include_router(create_public_router(db))
app.include_router(create_admin_router(db))

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Use wildcard-friendly CORS for dev; credentials not needed (JWT via Authorization header)
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads folder
UPLOAD_DIR = ROOT_DIR.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Simple upload endpoint for admin (no auth here; admin router can proxy later if needed)
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    dest = UPLOAD_DIR / file.filename
    # Ensure unique filename
    counter = 1
    base = dest.stem
    ext = dest.suffix
    while dest.exists():
        dest = UPLOAD_DIR / f"{base}_{counter}{ext}"
        counter += 1
    content = await file.read()
    with open(dest, "wb") as f:
        f.write(content)
    url = f"/uploads/{dest.name}"
    return JSONResponse({"url": url, "filename": dest.name})

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def load_migration_data(db):
    """Load migration data into database"""
    try:
        # Load legal processes
        processes_collection = db.legal_processes
        existing_processes = await processes_collection.count_documents({})
        if existing_processes == 0:
            await processes_collection.insert_many(LEGAL_PROCESSES_DATA)
            logger.info(f"✅ Loaded {len(LEGAL_PROCESSES_DATA)} legal processes")
        
        # Load calculator parameters
        params_collection = db.calculator_parameters
        existing_params = await params_collection.count_documents({})
        if existing_params == 0:
            await params_collection.insert_many(CALCULATOR_PARAMETERS_DATA)
            logger.info(f"✅ Loaded {len(CALCULATOR_PARAMETERS_DATA)} calculator parameters")
        
        # Load legal aid info
        legal_aid_collection = db.legal_aid_info
        existing_legal_aid = await legal_aid_collection.count_documents({})
        if existing_legal_aid == 0:
            await legal_aid_collection.insert_one(LEGAL_AID_DATA)
            logger.info("✅ Loaded legal aid information")

        # Load blog posts
        blog_collection = db.blog_posts
        existing_blogs = await blog_collection.count_documents({})
        if existing_blogs == 0:
            # Add UUID and dates to blog posts
            import uuid
            from datetime import datetime
            blog_posts_with_meta = []
            for post in BLOG_POSTS_DATA:
                post_with_meta = post.copy()
                post_with_meta['id'] = str(uuid.uuid4())
                post_with_meta['created_at'] = datetime.utcnow()
                post_with_meta['updated_at'] = datetime.utcnow()
                post_with_meta['published_at'] = datetime.utcnow() if post.get('is_published') else None
                blog_posts_with_meta.append(post_with_meta)
            
            await blog_collection.insert_many(blog_posts_with_meta)
            logger.info(f"✅ Loaded {len(BLOG_POSTS_DATA)} blog posts")

        # Load supreme court decisions
        decisions_collection = db.supreme_court_decisions
        existing_decisions = await decisions_collection.count_documents({})
        if existing_decisions == 0:
            # Add UUID and dates to decisions
            decisions_with_meta = []
            for decision in SUPREME_COURT_DECISIONS_DATA:
                decision_with_meta = decision.copy()
                decision_with_meta['id'] = str(uuid.uuid4())
                decision_with_meta['created_at'] = datetime.utcnow()
                decision_with_meta['updated_at'] = datetime.utcnow()
                decision_with_meta['published_at'] = datetime.utcnow() if decision.get('is_published') else None
                decisions_with_meta.append(decision_with_meta)
            
            await decisions_collection.insert_many(decisions_with_meta)
            logger.info(f"✅ Loaded {len(SUPREME_COURT_DECISIONS_DATA)} supreme court decisions")

        # Ensure ad settings document exists
        ad_settings_collection = db.ad_settings
        existing_ad = await ad_settings_collection.count_documents({})
        if existing_ad == 0:
            default_ad = {
                "is_active": False,
                "horizontal_code": "",
                "square_code": "",
                "sidebar_code": "",
                "mobile_code": "",
                "infeed_code": "",
                "head_code": "",
                "body_top_code": "",
                "body_bottom_code": "",
            }
            await ad_settings_collection.insert_one(default_ad)
            logger.info("✅ Initialized default ad settings")

        # Load contact page content
        contact_content_collection = db.contact_page_content
        existing_contact_content = await contact_content_collection.count_documents({})
        if existing_contact_content == 0:
            import uuid
            from datetime import datetime
            contact_content_with_meta = CONTACT_PAGE_CONTENT_DATA.copy()
            contact_content_with_meta['id'] = str(uuid.uuid4())
            contact_content_with_meta['created_at'] = datetime.utcnow()
            contact_content_with_meta['updated_at'] = datetime.utcnow()
            await contact_content_collection.insert_one(contact_content_with_meta)
            logger.info("✅ Loaded contact page content")

        # Load home page content
        home_content_collection = db.home_page_content
        existing_home_content = await home_content_collection.count_documents({})
        if existing_home_content == 0:
            home_content_with_meta = HOME_PAGE_CONTENT_DATA.copy()
            home_content_with_meta['id'] = str(uuid.uuid4())
            home_content_with_meta['created_at'] = datetime.utcnow()
            home_content_with_meta['updated_at'] = datetime.utcnow()
            await home_content_collection.insert_one(home_content_with_meta)
            logger.info("✅ Loaded home page content")
        
    except Exception as e:
        logger.error(f"❌ Error loading migration data: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    logger.info("Starting up Legal Design Turkey API...")
    
    # Create default admin user
    await create_default_admin_user(db)
    
    # Load migration data
    await load_migration_data(db)
    
    logger.info("✅ Startup completed successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
