from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


# Base model with common fields
class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())


# Document model for required documents with descriptions
class Document(BaseModel):
    name: str
    description: str = ""

# Process step models
class ProcessStep(BaseModel):
    id: str
    title: str
    short_title: str
    description: str
    duration: str
    participants: List[str]
    required_documents: List[Document]  # Changed to List[Document]
    important_notes: List[str]
    position: Dict[str, int]
    connections: List[str]
    status: str


class CostItem(BaseModel):
    name: str
    min: int
    max: int
    note: str


class EstimatedCosts(BaseModel):
    title: str
    items: List[CostItem]
    total_range: str
    free_options: List[str]


class CalculatorParameter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    value: float
    description: str
    category: str  # 'compensation' or 'execution'
    unit: str
    is_active: bool = True


class LegalProcess(BaseDocument):
    title: str
    description: str
    icon: str
    color: str
    gradient: str
    duration: str
    difficulty: str
    total_steps: int
    has_calculator: bool
    category: str  # 'hukuk' or 'ceza'
    tags: List[str]
    estimated_costs: EstimatedCosts
    steps: List[ProcessStep]


# Legal Aid Models
class BaroContact(BaseModel):
    city: str
    name: str
    phone: str
    address: str
    website: str


class Helpline(BaseModel):
    name: str
    description: str
    phone: str
    hours: str


class LegalAidSection(BaseModel):
    title: str
    icon: str
    content: str
    color: str


class LegalAidInfo(BaseDocument):
    title: str
    description: str
    sections: List[LegalAidSection]
    baro_contacts: List[BaroContact]
    helplines: List[Helpline]
    required_documents: List[str] = []
    eligibility_criteria: Optional[str] = ""
    application_process: Optional[str] = ""
    contact_info: Optional[Dict[str, str]] = {}
    is_active: bool = True


# Content Page Models
class ContentPage(BaseDocument):
    slug: str  # 'about', 'blog', 'contact', etc.
    title: str
    content: str
    meta_description: Optional[str] = None
    is_published: bool = True
    author: Optional[str] = None


# Blog Models
class BlogPost(BaseDocument):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    featured_image: Optional[str] = None
    tags: List[str]
    category: str
    is_published: bool = True
    published_at: Optional[datetime] = None
    meta_description: Optional[str] = None


# Supreme Court Decision Models
class SupremeCourtDecision(BaseDocument):
    title: str
    decision_number: str
    date: str
    court: str
    summary: str
    full_text: str
    category: str
    keywords: List[str]
    importance_level: str  # 'high', 'medium', 'low'


# Admin User Model
class AdminUser(BaseDocument):
    username: str
    password_hash: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool = True
    last_login: Optional[datetime] = None


# Document descriptions for tooltips
class DocumentDescription(BaseDocument):
    document_name: str
    description: str


# Statistics Model for Dashboard
class SiteStatistics(BaseModel):
    total_processes: int = 0
    total_blog_posts: int = 0
    total_decisions: int = 0
    total_visits: int = 0
    calculator_usage: int = 0
    compensation_calculations: int = 0
    sentence_calculations: int = 0
    last_updated: datetime = Field(default_factory=lambda: datetime.now())


# Create/Update Models (for API requests)
class LegalProcessCreate(BaseModel):
    title: str
    description: str
    icon: str
    color: str
    gradient: str
    duration: str
    difficulty: str
    total_steps: int
    has_calculator: bool
    category: str
    tags: List[str]
    estimated_costs: EstimatedCosts
    steps: List[ProcessStep]


class LegalProcessUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    gradient: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    total_steps: Optional[int] = None
    has_calculator: Optional[bool] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    estimated_costs: Optional[EstimatedCosts] = None
    steps: Optional[List[ProcessStep]] = None


class CalculatorParameterCreate(BaseModel):
    name: str
    value: float
    description: str
    category: str
    unit: str
    is_active: bool = True


class CalculatorParameterUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    is_active: Optional[bool] = None


class ContentPageCreate(BaseModel):
    slug: str
    title: str
    content: str
    meta_description: Optional[str] = None
    is_published: bool = True
    author: Optional[str] = None


class ContentPageUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: Optional[bool] = None
    author: Optional[str] = None


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    featured_image: Optional[str] = None
    tags: List[str]
    category: str
    is_published: bool = True
    meta_description: Optional[str] = None


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    featured_image: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    is_published: Optional[bool] = None
    meta_description: Optional[str] = None


class SupremeCourtDecisionCreate(BaseModel):
    title: str
    decision_number: str
    date: str
    court: str
    summary: str
    full_text: str
    category: str
    keywords: List[str]
    importance_level: str


class SupremeCourtDecisionUpdate(BaseModel):
    title: Optional[str] = None
    decision_number: Optional[str] = None
    date: Optional[str] = None
    court: Optional[str] = None
    summary: Optional[str] = None
    full_text: Optional[str] = None
    category: Optional[str] = None
    keywords: Optional[List[str]] = None
    importance_level: Optional[str] = None


class AdminUserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None


class AdminUserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str