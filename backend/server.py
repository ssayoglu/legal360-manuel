from fastapi import FastAPI, APIRouter
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
from migration_data import LEGAL_PROCESSES_DATA, CALCULATOR_PARAMETERS_DATA, LEGAL_AID_DATA

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

# Legacy StatusCheck models (keeping for backward compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Legacy routes
@api_router.get("/")
async def root():
    return {"message": "Legal Design Turkey API v1.0"}

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
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

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
