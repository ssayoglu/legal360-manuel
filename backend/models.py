from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        populate_by_name = True  # Accept both alias and field names

class StatusCheck(BaseDocument):
    client_name: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now())

class LegalProcessStep(BaseModel):
    id: str
    title: str
    short_title: str = Field(alias="shortTitle")
    description: str
    duration: str
    participants: List[str]
    required_documents: List[Dict[str, str]] = Field(alias="requiredDocuments")
    important_notes: List[str] = Field(alias="importantNotes")
    position: Dict[str, int]
    connections: List[str]
    status: str

    class Config:
        populate_by_name = True  # Allow both field name and alias

class EstimatedCosts(BaseModel):
    title: str
    items: List[Dict[str, Any]]
    total_range: str = Field(alias="totalRange")
    free_options: List[str] = Field(alias="freeOptions")

    class Config:
        populate_by_name = True  # Allow both field name and alias

class LegalProcess(BaseDocument):
    title: str
    description: str
    icon: str
    color: str
    gradient: str
    duration: str
    difficulty: str
    total_steps: int = Field(alias="totalSteps")
    has_calculator: bool = Field(alias="hasCalculator")
    calculator_type: str = Field(alias="calculatorType")
    category: str
    tags: List[str]
    estimated_costs: EstimatedCosts
    steps: List[LegalProcessStep]
    is_published: bool = True
    published_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True  # Allow both field name and alias

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
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    
    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
    
    def __init__(self, **data):
        # Handle meta_keywords field - convert list to string or None
        if 'meta_keywords' in data:
            meta_keywords = data['meta_keywords']
            if isinstance(meta_keywords, list):
                # Convert list to comma-separated string or None if empty
                data['meta_keywords'] = ', '.join(meta_keywords) if meta_keywords else None
        super().__init__(**data)

    class Config:
        populate_by_name = True

class CalculatorParameter(BaseDocument):
    name: str
    value: float
    description: str
    category: str  # 'compensation' or 'execution'
    unit: str
    is_active: bool = True

    class Config:
        populate_by_name = True

class LegalAidInfo(BaseDocument):
    title: str
    description: str
    sections: List[Dict[str, Any]]
    helplines: List[Dict[str, str]]
    baro_contacts: List[Dict[str, str]]
    required_documents: List[str]
    important_notes: List[str]
    eligibility_criteria: str
    application_process: str
    contact_info: Dict[str, str]
    is_active: bool = True

    class Config:
        populate_by_name = True

class AdSettings(BaseDocument):
    header_ad_code: str = ""
    sidebar_ad_code: str = ""
    footer_ad_code: str = ""
    body_top_code: str = ""
    body_bottom_code: str = ""
    is_active: bool = True

    class Config:
        populate_by_name = True

class SupremeCourtDecision(BaseDocument):
    decision_number: str
    court_chamber: str
    decision_date: str
    case_type: str
    summary: str
    content: str
    keywords: List[str]
    legal_basis: str
    category: str
    precedent_value: str  # 'Yüksek', 'Orta', 'Düşük'
    tags: List[str]
    is_published: bool = True
    published_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

# NEW CMS MODELS
class ContentPage(BaseDocument):
    """Ana sayfa, hakkımızda, iletişim gibi sayfa içerikleri"""
    slug: str  # 'home', 'about', 'contact'
    title: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    content: str  # HTML content
    sections: List[Dict[str, Any]] = []  # Hero, features, etc. sections
    is_published: bool = True
    published_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

class AboutPageContent(BaseDocument):
    """Hakkımızda sayfası için section-based content"""
    hero_title: str = "Hakkımızda"
    hero_description: str = "Legal Design Turkey olarak, karmaşık hukuki süreçleri vatandaşların kolayca anlayabileceği görsel formatlara dönüştürüyoruz."
    mission_title: str = "Misyonumuz"
    mission_description: str = "Hukuki süreçleri görselleştirerek, vatandaşların hukuki haklarını öğrenmesini ve adalete erişimini kolaylaştırmak."
    vision_title: str = "Vizyonumuz" 
    vision_description: str = "Türkiye'de hukuki bilgilere erişimde öncü platform olmak."
    values: List[Dict[str, str]] = []  # {"title": "Erişilebilirlik", "description": "...", "icon": "Users"}
    team_members: List[Dict[str, str]] = []  # {"name": "Ahmet Yılmaz", "role": "...", "description": "..."}
    is_active: bool = True

    class Config:
        populate_by_name = True

class ContactPageContent(BaseDocument):
    """İletişim sayfası için section-based content"""
    hero_title: str = "İletişim"
    hero_description: str = "Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız."
    contact_email: str = "info@legaldesignturkey.com"
    contact_phone: str = "0212 XXX XX XX"
    contact_address: str = "İstanbul, Türkiye"
    office_hours: str = "Pazartesi - Cuma, 09:00 - 18:00"
    contact_form_title: str = "Bize Mesaj Gönderin"
    contact_form_description: str = "Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz."
    faq_title: str = "Sık Sorulan Sorular"
    faq_description: str = "En çok merak edilen sorular ve cevapları"
    faq_items: List[Dict[str, str]] = [
        {
            "question": "Platform tamamen ücretsiz mi?",
            "answer": "Evet, Legal Design Turkey platformundaki tüm içerikler tamamen ücretsizdir. Amacımız hukuki bilgilere herkesin eşit erişimini sağlamaktır."
        },
        {
            "question": "Verdiğiniz bilgiler hukuki tavsiye niteliğinde mi?",
            "answer": "Hayır, platformumuz sadece bilgilendirme amaçlıdır. Kesin hukuki tavsiye için mutlaka bir avukatla görüşmelisiniz."
        },
        {
            "question": "Yeni süreçler ekleniyor mu?",
            "answer": "Evet, sürekli olarak yeni hukuki süreçler ekliyoruz. Blog sayfamızdan güncellemeleri takip edebilirsiniz."
        },
        {
            "question": "Mobil uygulamanız var mı?",
            "answer": "Şu anda web sitesi tamamen mobile uyumlu. Yakın gelecekte mobil uygulama geliştirmeyi planlıyoruz."
        }
    ]
    is_active: bool = True

    class Config:
        populate_by_name = True

class HomePageContent(BaseDocument):
    """Ana sayfa için section-based content"""
    # Hero Section
    hero_title: str = "Hukuki Süreçleri"
    hero_title_highlight: str = "Görselleştiriyoruz"
    hero_subtitle: str = "Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin. Vatandaşların hukuki haklarını öğrenmesi için tasarlanmış interaktif platform."
    
    # CTA Buttons
    hero_primary_btn_text: str = "Süreçleri Keşfedin"
    hero_primary_btn_url: str = "/hukuki-surecler"
    hero_secondary_btn_text: str = "Ücretsiz Yardım Al"
    hero_secondary_btn_url: str = "/adli-yardim-hizmetleri"
    
    # Stats Section
    stats_processes_number: str = "8+"
    stats_processes_label: str = "Hukuki Süreç"
    stats_processes_description: str = "Boşanma, Miras, İş Davası ve daha fazlası"
    
    stats_steps_number: str = "35+"
    stats_steps_label: str = "Detaylı Adım"
    stats_steps_description: str = "Her süreç için kapsamlı açıklamalar"
    
    stats_free_number: str = "100%"
    stats_free_label: str = "Ücretsiz"
    stats_free_description: str = "Tüm içerikler tamamen ücretsiz"
    
    # Features Section
    features_title: str = "Neden Legal Design Turkey?"
    features_description: str = "Hukuki süreçleri herkesin anlayabileceği şekilde görselleştiriyoruz"
    features_items: List[Dict[str, str]] = [
        {
            "icon": "Smartphone",
            "title": "Mobil Uyumlu",
            "description": "Her cihazda kolayca kullanabileceğiniz responsive tasarım"
        },
        {
            "icon": "Scale",
            "title": "Görsel İçerik",
            "description": "Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin"
        },
        {
            "icon": "Users",
            "title": "Vatandaş Odaklı",
            "description": "Hukukçu olmayan vatandaşlar için tasarlandı"
        },
        {
            "icon": "BookOpen",
            "title": "Adım Adım Rehber",
            "description": "Her sürecin detaylı açıklaması ve yol haritası"
        }
    ]
    
    # Bottom CTA Section
    bottom_cta_title: str = "Hukuki Süreçlerinizi Bugün Öğrenin"
    bottom_cta_description: str = "Boşanma, miras, iş davası ve ceza yargılaması süreçlerini interaktif görsellerle keşfedin."
    bottom_cta_primary_btn_text: str = "Hemen Başlayın"
    bottom_cta_primary_btn_url: str = "/hukuki-surecler"
    bottom_cta_secondary_btn_text: str = "Ücretsiz Yardım"
    bottom_cta_secondary_btn_url: str = "/adli-yardim-hizmetleri"
    
    is_active: bool = True

    class Config:
        populate_by_name = True

class SiteSettings(BaseDocument):
    """Site geneli ayarları"""
    site_title: str = "Legal Design Turkey"
    site_description: str = "Hukuki süreçleri görselleştiriyoruz"
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    contact_email: str = ""
    contact_phone: str = ""
    contact_address: str = ""
    social_links: Dict[str, str] = {}  # {"facebook": "url", "twitter": "url"}
    ga_tracking_id: Optional[str] = None
    is_active: bool = True

    class Config:
        populate_by_name = True

class MenuConfig(BaseDocument):
    """Header menü yapılandırması"""
    menu_items: List[Dict[str, Any]] = [
        {"label": "Ana Sayfa", "url": "/", "order": 1, "is_active": True},
        {"label": "Hukuki Süreçler", "url": "/hukuki-surecler", "order": 2, "is_active": True},
        {"label": "Blog", "url": "/blog", "order": 3, "is_active": True},
        {"label": "Yargıtay Kararları", "url": "/yargitay-kararlari", "order": 4, "is_active": True},
        {"label": "İletişim", "url": "/iletisim", "order": 5, "is_active": True}
    ]
    header_buttons: List[Dict[str, Any]] = [
        {"label": "Adli Yardım", "url": "/adli-yardim", "type": "secondary", "is_active": True},
        {"label": "Beta", "url": "#", "type": "primary", "is_active": True}
    ]
    is_active: bool = True

    class Config:
        populate_by_name = True

class FooterConfig(BaseDocument):
    """Footer yapılandırması"""
    footer_sections: List[Dict[str, Any]] = [
        {
            "title": "Hukuki Süreçler",
            "links": [
                {"label": "Boşanma Süreci", "url": "/hukuki-surec/bosanma-sureci"},
                {"label": "İş Davası", "url": "/hukuki-surec/is-davasi-sureci"},
                {"label": "Ceza Yargılaması", "url": "/hukuki-surec/ceza-yargisi-sureci"}
            ]
        },
        {
            "title": "Bilgi",
            "links": [
                {"label": "Hakkımızda", "url": "/hakkimizda"},
                {"label": "İletişim", "url": "/iletisim"},
                {"label": "Blog", "url": "/blog"}
            ]
        }
    ]
    copyright_text: str = "© 2024 Legal Design Turkey. Tüm hakları saklıdır."
    is_active: bool = True

    class Config:
        populate_by_name = True

# Admin User Model
class AdminUser(BaseDocument):
    username: str
    password_hash: str
    email: Optional[str] = None
    is_active: bool = True

# Form validation models
class StatusCheckCreate(BaseModel):
    client_name: str

# Authentication models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    user_id: str
    username: str

# Statistics model
class SiteStatistics(BaseModel):
    total_processes: int
    total_blog_posts: int
    total_decisions: int
    total_visits: int
    calculator_usage: int
    compensation_calculations: int
    sentence_calculations: int

# Create/Update models for CRUD operations
class LegalProcessCreate(BaseModel):
    title: str
    description: str
    icon: str
    color: str
    gradient: str
    duration: str
    difficulty: str
    total_steps: int = Field(alias="totalSteps")
    has_calculator: bool = Field(alias="hasCalculator")
    calculator_type: str = Field(alias="calculatorType")
    category: str  # Missing field - required by LegalProcess
    tags: List[str]  # Missing field - required by LegalProcess
    steps: List[LegalProcessStep]
    estimated_costs: EstimatedCosts
    required_documents: List[Dict[str, str]] = Field(alias="requiredDocuments")
    important_notes: List[str] = Field(alias="importantNotes")
    is_active: bool = Field(default=True, alias="isActive")

    class Config:
        populate_by_name = True

class LegalProcessUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    gradient: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    total_steps: Optional[int] = Field(None, alias="totalSteps")
    has_calculator: Optional[bool] = Field(None, alias="hasCalculator")
    calculator_type: Optional[str] = Field(None, alias="calculatorType")
    category: Optional[str] = None  # Missing field - should be optional for updates
    tags: Optional[List[str]] = None  # Missing field - should be optional for updates
    steps: Optional[List[LegalProcessStep]] = None
    estimated_costs: Optional[EstimatedCosts] = Field(None, alias="estimatedCosts")
    required_documents: Optional[List[Dict[str, str]]] = Field(None, alias="requiredDocuments")
    important_notes: Optional[List[str]] = Field(None, alias="importantNotes")
    is_active: Optional[bool] = Field(None, alias="isActive")

    class Config:
        populate_by_name = True

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    author: str
    tags: List[str] = []
    category: str
    is_published: bool = Field(default=False, alias="isPublished")
    featured_image: Optional[str] = Field(None, alias="featuredImage")
    meta_description: Optional[str] = Field(None, alias="metaDescription")

    class Config:
        populate_by_name = True

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    is_published: Optional[bool] = Field(None, alias="isPublished")
    featured_image: Optional[str] = Field(None, alias="featuredImage")
    meta_description: Optional[str] = Field(None, alias="metaDescription")

    class Config:
        populate_by_name = True

class CalculatorParameterCreate(BaseModel):
    name: str
    value: float
    description: str
    category: str
    unit: Optional[str] = None
    is_active: bool = Field(default=True, alias="isActive")

    class Config:
        populate_by_name = True

class CalculatorParameterUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    is_active: Optional[bool] = Field(None, alias="isActive")

    class Config:
        populate_by_name = True

class ContentPageCreate(BaseModel):
    title: str
    slug: str
    content: str
    sections: List[Dict[str, Any]] = []
    is_published: bool = Field(default=False, alias="isPublished")
    meta_description: Optional[str] = Field(None, alias="metaDescription")
    template: str = "default"

    class Config:
        populate_by_name = True

class ContentPageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    sections: Optional[List[Dict[str, Any]]] = None
    is_published: Optional[bool] = Field(None, alias="isPublished")
    meta_description: Optional[str] = Field(None, alias="metaDescription")
    template: Optional[str] = None

    class Config:
        populate_by_name = True

class AdSettingsUpdate(BaseModel):
    google_ads_enabled: Optional[bool] = Field(None, alias="googleAdsEnabled")
    google_ads_client_id: Optional[str] = Field(None, alias="googleAdsClientId")
    google_ads_slot_id: Optional[str] = Field(None, alias="googleAdsSlotId")
    banner_ads_enabled: Optional[bool] = Field(None, alias="bannerAdsEnabled")
    sidebar_ads_enabled: Optional[bool] = Field(None, alias="sidebarAdsEnabled")
    popup_ads_enabled: Optional[bool] = Field(None, alias="popupAdsEnabled")
    ad_frequency: Optional[int] = Field(None, alias="adFrequency")

    class Config:
        populate_by_name = True

class SupremeCourtDecisionCreate(BaseModel):
    decision_number: str
    court_chamber: str
    decision_date: str
    case_type: str
    summary: str
    content: str
    keywords: List[str] = []
    legal_basis: str = ""
    category: str
    precedent_value: str = "Orta"
    tags: List[str] = []
    is_published: bool = True

    class Config:
        populate_by_name = True

class SupremeCourtDecisionUpdate(BaseModel):
    decision_number: Optional[str] = None
    court_chamber: Optional[str] = None
    decision_date: Optional[str] = None
    case_type: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    keywords: Optional[List[str]] = None
    legal_basis: Optional[str] = None
    category: Optional[str] = None
    precedent_value: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None

    class Config:
        populate_by_name = True

class DocumentDescription(BaseDocument):
    document_name: str
    description: str
    required_for: List[str]
    where_to_get: str
    cost: Optional[str] = None
    validity_period: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        populate_by_name = True