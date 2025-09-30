#!/usr/bin/env python3
import sys
import os
sys.path.append('/app/backend')

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from backend.migration_data import LEGAL_PROCESSES_DATA

# Load environment variables
load_dotenv(Path('/app/backend/.env'))

async def reset_legal_processes():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Delete existing legal processes
    deleted = await db.legal_processes.delete_many({})
    print(f'Deleted {deleted.deleted_count} existing legal processes')
    
    # Insert fresh data
    result = await db.legal_processes.insert_many(LEGAL_PROCESSES_DATA)
    print(f'Inserted {len(result.inserted_ids)} legal processes')
    
    # Check bosanma-sureci steps
    bosanma = await db.legal_processes.find_one({'id': 'bosanma-sureci'})
    if bosanma:
        print(f'Boşanma süreci steps count: {len(bosanma["steps"])}')
        for i, step in enumerate(bosanma["steps"]):
            print(f'  Step {i+1}: {step["title"]}')
    else:
        print('Boşanma süreci bulunamadı!')

if __name__ == "__main__":
    asyncio.run(reset_legal_processes())