from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timedelta
from models import *
from auth import AuthDependency, authenticate_admin, create_access_token, hash_password
from migration_data import LEGAL_PROCESSES_DATA, CALCULATOR_PARAMETERS_DATA, DOCUMENT_DESCRIPTIONS_DATA, BLOG_POSTS_DATA
import os

def create_admin_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api/admin", tags=["admin"])
    auth_dependency = AuthDependency(db)

    # Authentication endpoints
    @router.post("/login", response_model=LoginResponse)
    async def login(login_data: LoginRequest):
        """Admin login endpoint"""
        user = await authenticate_admin(db, login_data.username, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        access_token_expires = timedelta(minutes=24 * 60)  # 24 hours
        access_token = create_access_token(
            data={"sub": user.id}, expires_delta=access_token_expires
        )
        
        return LoginResponse(
            access_token=access_token,
            user_id=user.id,
            username=user.username
        )

    @router.get("/me", response_model=AdminUser)
    async def get_current_user(current_user: AdminUser = Depends(auth_dependency)):
        """Get current admin user info"""
        return current_user

    # Dashboard endpoint
    @router.get("/dashboard", response_model=SiteStatistics)
    async def get_dashboard_stats(current_user: AdminUser = Depends(auth_dependency)):
        """Get dashboard statistics"""
        total_processes = await db.legal_processes.count_documents({})
        total_blog_posts = await db.blog_posts.count_documents({})
        total_decisions = await db.supreme_court_decisions.count_documents({})
        
        # Mock calculator metrics for now
        calculator_usage = 342
        compensation_calculations = 198
        sentence_calculations = 144
        
        return SiteStatistics(
            total_processes=total_processes,
            total_blog_posts=total_blog_posts,
            total_decisions=total_decisions,
            total_visits=1250,  # Mock data
            calculator_usage=calculator_usage,
            compensation_calculations=compensation_calculations,
            sentence_calculations=sentence_calculations
        )

    # Legal Processes CRUD
    @router.get("/legal-processes", response_model=List[LegalProcess])
    async def get_legal_processes(current_user: AdminUser = Depends(auth_dependency)):
        """Get all legal processes"""
        processes = await db.legal_processes.find().to_list(length=None)
        return [LegalProcess(**process) for process in processes]

    @router.post("/legal-processes", response_model=LegalProcess)
    async def create_legal_process(
        process: LegalProcessCreate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Create a new legal process"""
        process_dict = process.dict()
        new_process = LegalProcess(**process_dict)
        await db.legal_processes.insert_one(new_process.dict())
        return new_process

    @router.get("/legal-processes/{process_id}", response_model=LegalProcess)
    async def get_legal_process(
        process_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Get a specific legal process"""
        process = await db.legal_processes.find_one({"id": process_id})
        if not process:
            raise HTTPException(status_code=404, detail="Legal process not found")
        return LegalProcess(**process)

    @router.put("/legal-processes/{process_id}", response_model=LegalProcess)
    async def update_legal_process(
        process_id: str,
        process_update: LegalProcessUpdate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update a legal process"""
        existing_process = await db.legal_processes.find_one({"id": process_id})
        if not existing_process:
            raise HTTPException(status_code=404, detail="Legal process not found")
        
        update_data = {k: v for k, v in process_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        await db.legal_processes.update_one(
            {"id": process_id},
            {"$set": update_data}
        )
        
        updated_process = await db.legal_processes.find_one({"id": process_id})
        return LegalProcess(**updated_process)

    @router.delete("/legal-processes/{process_id}")
    async def delete_legal_process(
        process_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Delete a legal process"""
        result = await db.legal_processes.delete_one({"id": process_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Legal process not found")
        return {"message": "Legal process deleted successfully"}

    # Calculator Parameters CRUD
    @router.get("/calculator-parameters", response_model=List[CalculatorParameter])
    async def get_calculator_parameters(current_user: AdminUser = Depends(auth_dependency)):
        """Get all calculator parameters"""
        parameters = await db.calculator_parameters.find().to_list(length=None)
        return [CalculatorParameter(**param) for param in parameters]

    @router.post("/calculator-parameters", response_model=CalculatorParameter)
    async def create_calculator_parameter(
        parameter: CalculatorParameterCreate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Create a new calculator parameter"""
        new_parameter = CalculatorParameter(**parameter.dict())
        await db.calculator_parameters.insert_one(new_parameter.dict())
        return new_parameter

    @router.put("/calculator-parameters/{param_id}", response_model=CalculatorParameter)
    async def update_calculator_parameter(
        param_id: str,
        parameter_update: CalculatorParameterUpdate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update a calculator parameter"""
        existing_param = await db.calculator_parameters.find_one({"id": param_id})
        if not existing_param:
            raise HTTPException(status_code=404, detail="Calculator parameter not found")
        
        update_data = {k: v for k, v in parameter_update.dict().items() if v is not None}
        
        await db.calculator_parameters.update_one(
            {"id": param_id},
            {"$set": update_data}
        )
        
        updated_param = await db.calculator_parameters.find_one({"id": param_id})
        return CalculatorParameter(**updated_param)

    @router.delete("/calculator-parameters/{param_id}")
    async def delete_calculator_parameter(
        param_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Delete a calculator parameter"""
        result = await db.calculator_parameters.delete_one({"id": param_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Calculator parameter not found")
        return {"message": "Calculator parameter deleted successfully"}

    # Content Pages CRUD
    @router.get("/content-pages", response_model=List[ContentPage])
    async def get_content_pages(current_user: AdminUser = Depends(auth_dependency)):
        """Get all content pages"""
        pages = await db.content_pages.find().to_list(length=None)
        return [ContentPage(**page) for page in pages]

    @router.post("/content-pages", response_model=ContentPage)
    async def create_content_page(
        page: ContentPageCreate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Create a new content page"""
        # Check if slug already exists
        existing_page = await db.content_pages.find_one({"slug": page.slug})
        if existing_page:
            raise HTTPException(status_code=400, detail="Page with this slug already exists")
        
        new_page = ContentPage(**page.dict())
        await db.content_pages.insert_one(new_page.dict())
        return new_page

    @router.put("/content-pages/{page_id}", response_model=ContentPage)
    async def update_content_page(
        page_id: str,
        page_update: ContentPageUpdate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update a content page"""
        existing_page = await db.content_pages.find_one({"id": page_id})
        if not existing_page:
            raise HTTPException(status_code=404, detail="Content page not found")
        
        update_data = {k: v for k, v in page_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        await db.content_pages.update_one(
            {"id": page_id},
            {"$set": update_data}
        )
        
        updated_page = await db.content_pages.find_one({"id": page_id})
        return ContentPage(**updated_page)

    @router.delete("/content-pages/{page_id}")
    async def delete_content_page(
        page_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Delete a content page"""
        result = await db.content_pages.delete_one({"id": page_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Content page not found")
        return {"message": "Content page deleted successfully"}

    # Blog Posts CRUD
    @router.get("/blog-posts", response_model=List[BlogPost])
    async def get_blog_posts(current_user: AdminUser = Depends(auth_dependency)):
        """Get all blog posts"""
        posts = await db.blog_posts.find().sort("created_at", -1).to_list(length=None)
        return [BlogPost(**post) for post in posts]

    @router.post("/blog-posts", response_model=BlogPost)
    async def create_blog_post(
        post: BlogPostCreate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Create a new blog post"""
        # Check if slug already exists
        existing_post = await db.blog_posts.find_one({"slug": post.slug})
        if existing_post:
            raise HTTPException(status_code=400, detail="Blog post with this slug already exists")
        
        post_dict = post.dict()
        if post.is_published and not post_dict.get('published_at'):
            post_dict['published_at'] = datetime.now()
        
        new_post = BlogPost(**post_dict)
        await db.blog_posts.insert_one(new_post.dict())
        return new_post

    @router.put("/blog-posts/{post_id}", response_model=BlogPost)
    async def update_blog_post(
        post_id: str,
        post_update: BlogPostUpdate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update a blog post"""
        existing_post = await db.blog_posts.find_one({"id": post_id})
        if not existing_post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        update_data = {k: v for k, v in post_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        # Set published_at if publishing for first time
        if (update_data.get('is_published') and 
            not existing_post.get('published_at') and 
            not update_data.get('published_at')):
            update_data['published_at'] = datetime.now()
        
        await db.blog_posts.update_one(
            {"id": post_id},
            {"$set": update_data}
        )
        
        updated_post = await db.blog_posts.find_one({"id": post_id})
        return BlogPost(**updated_post)

    @router.delete("/blog-posts/{post_id}")
    async def delete_blog_post(
        post_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Delete a blog post"""
        result = await db.blog_posts.delete_one({"id": post_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return {"message": "Blog post deleted successfully"}

    # Supreme Court Decisions CRUD
    @router.get("/supreme-court-decisions", response_model=List[SupremeCourtDecision])
    async def get_supreme_court_decisions(current_user: AdminUser = Depends(auth_dependency)):
        """Get all supreme court decisions"""
        decisions = await db.supreme_court_decisions.find().sort("created_at", -1).to_list(length=None)
        return [SupremeCourtDecision(**decision) for decision in decisions]

    @router.post("/supreme-court-decisions", response_model=SupremeCourtDecision)
    async def create_supreme_court_decision(
        decision: SupremeCourtDecisionCreate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Create a new supreme court decision"""
        new_decision = SupremeCourtDecision(**decision.dict())
        await db.supreme_court_decisions.insert_one(new_decision.dict())
        return new_decision

    @router.put("/supreme-court-decisions/{decision_id}", response_model=SupremeCourtDecision)
    async def update_supreme_court_decision(
        decision_id: str,
        decision_update: SupremeCourtDecisionUpdate,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update a supreme court decision"""
        existing_decision = await db.supreme_court_decisions.find_one({"id": decision_id})
        if not existing_decision:
            raise HTTPException(status_code=404, detail="Supreme court decision not found")
        
        # Build update data while ignoring empty strings/lists/dicts to avoid blanking fields
        raw_update = decision_update.dict()
        update_data = {}
        for k, v in raw_update.items():
            if v is None:
                continue
            # Skip empty string, empty list, empty dict
            if isinstance(v, str) and v.strip() == "":
                continue
            if isinstance(v, (list, dict)) and len(v) == 0:
                continue
            update_data[k] = v
        update_data["updated_at"] = datetime.now()
        
        await db.supreme_court_decisions.update_one(
            {"id": decision_id},
            {"$set": update_data}
        )
        
        updated_decision = await db.supreme_court_decisions.find_one({"id": decision_id})
        return SupremeCourtDecision(**updated_decision)

    @router.delete("/supreme-court-decisions/{decision_id}")
    async def delete_supreme_court_decision(
        decision_id: str,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Delete a supreme court decision"""
        result = await db.supreme_court_decisions.delete_one({"id": decision_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Supreme court decision not found")
        return {"message": "Supreme court decision deleted successfully"}

    # Legal Aid Info
    @router.get("/legal-aid-info", response_model=LegalAidInfo)
    async def get_legal_aid_info(current_user: AdminUser = Depends(auth_dependency)):
        """Get legal aid information"""
        info = await db.legal_aid_info.find_one()
        if not info:
            raise HTTPException(status_code=404, detail="Legal aid info not found")
        # Convert _id to id for Pydantic model
        info["id"] = str(info["_id"])
        return LegalAidInfo(**info)

    @router.put("/legal-aid-info", response_model=LegalAidInfo)
    async def update_legal_aid_info(
        info_update: dict,
        current_user: AdminUser = Depends(auth_dependency)
    ):
        """Update legal aid information"""
        print(f"Received info_update: {info_update}")  # Debug log
        
        # Ensure required fields exist
        if "baro_contacts" not in info_update:
            info_update["baro_contacts"] = []
        if "helplines" not in info_update:
            info_update["helplines"] = []
        if "sections" not in info_update:
            info_update["sections"] = []
        if "required_documents" not in info_update:
            info_update["required_documents"] = []
            
        existing_info = await db.legal_aid_info.find_one()
        
        if existing_info:
            # Add required fields for Pydantic model
            info_update["id"] = str(existing_info["_id"])
            info_update["created_at"] = existing_info.get("created_at", datetime.now())
            info_update["updated_at"] = datetime.now()
            info_update["title"] = existing_info.get("title", "Adli Yardım Bilgileri")
            info_update["description"] = existing_info.get("description", "Adli yardım hakkında bilgiler")
            
            await db.legal_aid_info.update_one(
                {"_id": existing_info["_id"]},
                {"$set": info_update}
            )
            updated_info = await db.legal_aid_info.find_one({"_id": existing_info["_id"]})
            # Convert _id to id for Pydantic model
            if updated_info:
                updated_info["id"] = str(updated_info["_id"])
        else:
            new_info = LegalAidInfo(**info_update)
            result = await db.legal_aid_info.insert_one(new_info.dict())
            updated_info = new_info.dict()
            updated_info["id"] = str(result.inserted_id)
        
        return LegalAidInfo(**updated_info)

    # Migration endpoint
    @router.post("/migrate-frontend-data")
    async def migrate_frontend_data(current_user: AdminUser = Depends(auth_dependency)):
        """Migrate data from frontend mock.js to database"""
        try:
            migration_results = {
                "legal_processes": 0,
                "calculator_parameters": 0,
                "document_descriptions": 0,
                "blog_posts": 0,
                "errors": []
            }

            # Migrate legal processes
            for process_data in LEGAL_PROCESSES_DATA:
                try:
                    # Check if process already exists
                    existing = await db.legal_processes.find_one({"title": process_data["title"]})
                    if not existing:
                        new_process = LegalProcess(**process_data)
                        await db.legal_processes.insert_one(new_process.dict())
                        migration_results["legal_processes"] += 1
                except Exception as e:
                    migration_results["errors"].append(f"Legal process '{process_data.get('title', 'unknown')}': {str(e)}")

            # Migrate calculator parameters
            for param_data in CALCULATOR_PARAMETERS_DATA:
                try:
                    existing = await db.calculator_parameters.find_one({"name": param_data["name"]})
                    if not existing:
                        new_param = CalculatorParameter(**param_data)
                        await db.calculator_parameters.insert_one(new_param.dict())
                        migration_results["calculator_parameters"] += 1
                except Exception as e:
                    migration_results["errors"].append(f"Calculator parameter '{param_data.get('name', 'unknown')}': {str(e)}")

            # Migrate document descriptions
            for doc_data in DOCUMENT_DESCRIPTIONS_DATA:
                try:
                    existing = await db.document_descriptions.find_one({"document_name": doc_data["document_name"]})
                    if not existing:
                        new_doc = DocumentDescription(**doc_data)
                        await db.document_descriptions.insert_one(new_doc.dict())
                        migration_results["document_descriptions"] += 1
                except Exception as e:
                    migration_results["errors"].append(f"Document description '{doc_data.get('document_name', 'unknown')}': {str(e)}")

            # Migrate blog posts
            for post_data in BLOG_POSTS_DATA:
                try:
                    existing = await db.blog_posts.find_one({"slug": post_data["slug"]})
                    if not existing:
                        post_data["published_at"] = datetime.now() if post_data["is_published"] else None
                        new_post = BlogPost(**post_data)
                        await db.blog_posts.insert_one(new_post.dict())
                        migration_results["blog_posts"] += 1
                except Exception as e:
                    migration_results["errors"].append(f"Blog post '{post_data.get('title', 'unknown')}': {str(e)}")

            return {
                "success": True,
                "message": "Migration completed",
                "results": migration_results
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")

    return router