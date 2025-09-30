from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional, Dict, Any
from models import *

def to_camel_case(snake_str: str) -> str:
    """Convert snake_case to camelCase"""
    components = snake_str.split('_')
    return components[0] + ''.join(x.capitalize() for x in components[1:])

def convert_keys_to_camel_case(data: Any) -> Any:
    """Recursively convert all keys in a dict/list structure from snake_case to camelCase"""
    from bson import ObjectId
    
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            # Skip MongoDB internal fields
            if key.startswith('_'):
                continue
            # Convert key to camelCase
            camel_key = to_camel_case(key)
            # Keep both snake_case and camelCase for compatibility
            new_dict[key] = convert_keys_to_camel_case(value)
            if camel_key != key:
                new_dict[camel_key] = convert_keys_to_camel_case(value)
        return new_dict
    elif isinstance(data, list):
        return [convert_keys_to_camel_case(item) for item in data]
    else:
        return data

def create_public_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api", tags=["public"])

    # Legal Processes
    @router.get("/legal-processes")
    async def get_legal_processes(
        category: Optional[str] = Query(None, description="Filter by category: hukuk or ceza"),
        search: Optional[str] = Query(None, description="Search in title and description")
    ):
        """Get all published legal processes with optional filtering"""
        filter_query = {}
        
        if category:
            filter_query["category"] = category
        
        if search:
            filter_query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]
        
        processes = await db.legal_processes.find(filter_query).to_list(length=None)
        # Convert to camelCase for frontend compatibility while keeping snake_case
        return [convert_keys_to_camel_case(process) for process in processes]

    @router.get("/legal-processes/{process_id}")
    async def get_legal_process(process_id: str):
        """Get a specific legal process"""
        process = await db.legal_processes.find_one({"id": process_id})
        if not process:
            raise HTTPException(status_code=404, detail="Legal process not found")
        
        # Convert to camelCase for frontend compatibility while keeping snake_case
        process_with_camel_case = convert_keys_to_camel_case(process)
        return process_with_camel_case

    # Calculator Parameters
    @router.get("/calculator-parameters", response_model=List[CalculatorParameter])
    async def get_calculator_parameters(category: Optional[str] = Query(None)):
        """Get calculator parameters"""
        filter_query = {"is_active": True}
        if category:
            filter_query["category"] = category
        
        parameters = await db.calculator_parameters.find(filter_query).to_list(length=None)
        return [CalculatorParameter(**param) for param in parameters]

    # Calculator endpoints
    @router.post("/calculate-compensation")
    async def calculate_compensation(request: dict):
        """Calculate compensation based on parameters"""
        # Get active compensation parameters
        parameters = await db.calculator_parameters.find({
            "category": "compensation",
            "is_active": True
        }).to_list(length=None)
        
        # Convert to dict for easy access
        param_dict = {param["name"]: param["value"] for param in parameters}
        
        # Extract request data
        monthly_salary = request.get("monthly_salary", 0)
        years_worked = request.get("years_worked", 0)
        days_worked = request.get("days_worked", 0)
        overtime_hours = request.get("overtime_hours", 0)
        
        # Calculate compensation (example logic)
        severance_pay = monthly_salary * years_worked * param_dict.get("severance_multiplier", 1.0)
        notice_pay = monthly_salary * param_dict.get("notice_period_months", 1.0)
        overtime_pay = overtime_hours * param_dict.get("overtime_hourly_rate", 50.0)
        
        total = severance_pay + notice_pay + overtime_pay
        
        return {
            "severance_pay": round(severance_pay, 2),
            "notice_pay": round(notice_pay, 2),
            "overtime_pay": round(overtime_pay, 2),
            "total": round(total, 2),
            "breakdown": {
                "monthly_salary": monthly_salary,
                "years_worked": years_worked,
                "days_worked": days_worked,
                "overtime_hours": overtime_hours
            }
        }

    @router.post("/calculate-execution")
    async def calculate_execution(request: dict):
        """Calculate execution time based on parameters"""
        # Get active execution parameters
        parameters = await db.calculator_parameters.find({
            "category": "execution",
            "is_active": True
        }).to_list(length=None)
        
        # Convert to dict for easy access
        param_dict = {param["name"]: param["value"] for param in parameters}
        
        # Extract request data
        sentence_months = request.get("sentence_months", 0)
        good_behavior_reduction = request.get("good_behavior_reduction", 0)
        
        # Calculate execution time (example logic)
        base_time = sentence_months
        good_behavior_months = (good_behavior_reduction / 100) * base_time * param_dict.get("good_behavior_multiplier", 0.33)
        actual_time = base_time - good_behavior_months
        
        return {
            "original_sentence_months": sentence_months,
            "good_behavior_reduction_months": round(good_behavior_months, 1),
            "actual_execution_months": round(actual_time, 1),
            "actual_execution_years": round(actual_time / 12, 1),
            "breakdown": {
                "sentence_months": sentence_months,
                "good_behavior_percentage": good_behavior_reduction,
                "good_behavior_months": round(good_behavior_months, 1)
            }
        }

    # Content Pages
    @router.get("/content-pages", response_model=List[ContentPage])
    async def get_content_pages():
        """Get all published content pages"""
        pages = await db.content_pages.find({"is_published": True}).to_list(length=None)
        return [ContentPage(**page) for page in pages]

    @router.get("/content-pages/{slug}", response_model=ContentPage)
    async def get_content_page(slug: str):
        """Get a specific content page by slug"""
        page = await db.content_pages.find_one({"slug": slug, "is_published": True})
        if not page:
            raise HTTPException(status_code=404, detail="Content page not found")
        return ContentPage(**page)

    # Blog Posts
    @router.get("/blog-posts", response_model=List[BlogPost])
    async def get_blog_posts(
        category: Optional[str] = Query(None),
        limit: int = Query(10, le=50)
    ):
        """Get published blog posts"""
        filter_query = {"is_published": True}
        if category:
            filter_query["category"] = category
        
        posts = await db.blog_posts.find(filter_query).sort("published_at", -1).limit(limit).to_list(length=limit)
        return [BlogPost(**post) for post in posts]

    @router.get("/blog-posts/{slug}", response_model=BlogPost)
    async def get_blog_post(slug: str):
        """Get a specific blog post by slug"""
        post = await db.blog_posts.find_one({"slug": slug, "is_published": True})
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return BlogPost(**post)

    # Supreme Court Decisions
    @router.get("/supreme-court-decisions", response_model=List[SupremeCourtDecision])
    async def get_supreme_court_decisions(
        category: Optional[str] = Query(None),
        importance: Optional[str] = Query(None),
        limit: int = Query(20, le=100)
    ):
        """Get published supreme court decisions (missing is_published treated as published)"""
        filter_query = {
            "$or": [
                {"is_published": True},
                {"is_published": {"$exists": False}}
            ]
        }
        if category:
            filter_query["category"] = category
        if importance:
            filter_query["importance_level"] = importance
        # Prefer published_at for ordering, then created_at
        decisions = await db.supreme_court_decisions.find(filter_query).sort([
            ("published_at", -1),
            ("created_at", -1)
        ]).limit(limit).to_list(length=limit)
        return [SupremeCourtDecision(**decision) for decision in decisions]

    @router.get("/supreme-court-decisions/{decision_id}", response_model=SupremeCourtDecision)
    async def get_supreme_court_decision(decision_id: str):
        """Get a specific supreme court decision"""
        decision = await db.supreme_court_decisions.find_one({"id": decision_id})
        if not decision:
            raise HTTPException(status_code=404, detail="Supreme court decision not found")
        return SupremeCourtDecision(**decision)

    # Legal Aid Info
    @router.get("/legal-aid-info", response_model=LegalAidInfo)
    async def get_legal_aid_info():
        """Get legal aid information"""
        info = await db.legal_aid_info.find_one()
        if not info:
            raise HTTPException(status_code=404, detail="Legal aid info not found")
        return LegalAidInfo(**info)

    # Ad Settings (public)
    @router.get("/ad-settings", response_model=Dict[str, Any])
    async def get_ad_settings():
        """Get current ad settings for rendering ads on frontend"""
        settings = await db.ad_settings.find_one()
        if not settings:
            return {
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
        # Strip Mongo internal fields
        settings.pop("_id", None)
        settings.pop("id", None)
        return settings

    # Search endpoint
    @router.get("/search")
    async def search_content(
        q: str = Query(..., min_length=2, description="Search query"),
        type: Optional[str] = Query(None, description="Content type: processes, blog, decisions")
    ):
        """Search across all content types"""
        results = {}
        
        if not type or type == "processes":
            processes = await db.legal_processes.find({
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"description": {"$regex": q, "$options": "i"}},
                    {"tags": {"$regex": q, "$options": "i"}}
                ]
            }).limit(5).to_list(length=5)
            results["processes"] = [LegalProcess(**p) for p in processes]
        
        if not type or type == "blog":
            blog_posts = await db.blog_posts.find({
                "is_published": True,
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"excerpt": {"$regex": q, "$options": "i"}},
                    {"content": {"$regex": q, "$options": "i"}},
                    {"tags": {"$regex": q, "$options": "i"}}
                ]
            }).limit(5).to_list(length=5)
            results["blog_posts"] = [BlogPost(**p) for p in blog_posts]
        
        if not type or type == "decisions":
            decisions = await db.supreme_court_decisions.find({
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"summary": {"$regex": q, "$options": "i"}},
                    {"keywords": {"$regex": q, "$options": "i"}}
                ]
            }).limit(5).to_list(length=5)
            results["decisions"] = [SupremeCourtDecision(**d) for d in decisions]
        
        return results

    # ============================================
    # SECTION-BASED CONTENT - PUBLIC ACCESS
    # ============================================
    
    @router.get("/about-page-content", response_model=AboutPageContent)
    async def get_public_about_page_content():
        """Get about page content for public"""
        content = await db.about_page_content.find_one()
        if not content:
            # Return default content
            default_content = AboutPageContent()
            return default_content
        content["id"] = str(content["_id"])
        return AboutPageContent(**content)

    @router.get("/contact-page-content", response_model=ContactPageContent)
    async def get_public_contact_page_content():
        """Get contact page content for public"""
        content = await db.contact_page_content.find_one()
        if not content:
            # Return default content
            default_content = ContactPageContent()
            return default_content
        content["id"] = str(content["_id"])
        return ContactPageContent(**content)

    @router.get("/home-page-content", response_model=HomePageContent)
    async def get_public_home_page_content():
        """Get home page content for public"""
        content = await db.home_page_content.find_one()
        if not content:
            # Return default content
            default_content = HomePageContent()
            return default_content
        content["id"] = str(content["_id"])
        return HomePageContent(**content)

    # ============================================
    # SITE SETTINGS - PUBLIC ACCESS
    # ============================================
    
    @router.get("/site-settings", response_model=SiteSettings)
    async def get_public_site_settings():
        """Get site settings for public"""
        settings = await db.site_settings.find_one()
        if not settings:
            # Return default settings
            default_settings = SiteSettings()
            return default_settings
        settings["id"] = str(settings["_id"])
        return SiteSettings(**settings)
    
    @router.get("/menu-config", response_model=MenuConfig)
    async def get_public_menu_config():
        """Get menu configuration for public"""
        config = await db.menu_config.find_one()
        if not config:
            # Return default menu config
            default_config = MenuConfig()
            return default_config
        config["id"] = str(config["_id"])
        return MenuConfig(**config)
    
    @router.get("/footer-config", response_model=FooterConfig)
    async def get_public_footer_config():
        """Get footer configuration for public"""
        config = await db.footer_config.find_one()
        if not config:
            # Return default footer config
            default_config = FooterConfig()
            return default_config
        config["id"] = str(config["_id"])
        return FooterConfig(**config)

    return router