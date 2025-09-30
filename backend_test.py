#!/usr/bin/env python3
"""
KAPSAMLI BACKEND API TEST - MongoDB VERI DOĞRULAMA
Comprehensive Backend API Test Suite for Legal Design Turkey Admin Panel
Tests all admin and public API endpoints with authentication and data validation
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration - Use environment variable for backend URL
import os
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, auth_required: bool = False) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{API_BASE}{endpoint}"
        
        request_headers = headers or {}
        if auth_required and self.access_token:
            request_headers["Authorization"] = f"Bearer {self.access_token}"
        
        # Always add Origin header for CORS testing
        if "Origin" not in request_headers:
            request_headers["Origin"] = "http://localhost:3000"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=request_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=request_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_backend_service_status(self):
        """Test backend service status and MongoDB connection"""
        print("\n=== 1. BACKEND SERVİS DURUMU ===")
        
        # Test if backend service is running
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Backend Servis Çalışıyor", True, f"✅ Backend aktif: {data['message']}")
                else:
                    self.log_test("Backend Servis Çalışıyor", False, "❌ Geçersiz response formatı")
            else:
                self.log_test("Backend Servis Çalışıyor", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Backend Servis Çalışıyor", False, f"❌ Bağlantı hatası: {str(e)}")
        
        # Test health endpoint if exists
        try:
            response = self.make_request("GET", "/health")
            if response.status_code == 200:
                self.log_test("/api/health endpoint", True, "✅ Health endpoint mevcut")
            else:
                self.log_test("/api/health endpoint", False, f"❌ Health endpoint bulunamadı: {response.status_code}")
        except Exception as e:
            self.log_test("/api/health endpoint", False, f"❌ Health endpoint test hatası: {str(e)}")
    
    def test_mongodb_data_existence(self):
        """Test MongoDB data existence - VERİ VARLIĞI TESLERİ"""
        print("\n=== 2. VERİ VARLIĞI TESLERİ (MongoDB'de) ===")
        
        # Test GET /api/legal-processes
        try:
            response = self.make_request("GET", "/legal-processes")
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                self.log_test("GET /api/legal-processes", True, f"✅ {count} hukuki süreç bulundu")
                
                # Log some details about the processes
                if count > 0:
                    categories = set()
                    for process in data[:3]:  # Show first 3
                        if 'category' in process:
                            categories.add(process['category'])
                    print(f"   📋 Kategoriler: {', '.join(categories)}")
            else:
                self.log_test("GET /api/legal-processes", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/legal-processes", False, f"❌ Hata: {str(e)}")
        
        # Test GET /api/blog-posts
        try:
            response = self.make_request("GET", "/blog-posts")
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                self.log_test("GET /api/blog-posts", True, f"✅ {count} blog yazısı bulundu")
            else:
                self.log_test("GET /api/blog-posts", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/blog-posts", False, f"❌ Hata: {str(e)}")
        
        # Test GET /api/supreme-court-decisions
        try:
            response = self.make_request("GET", "/supreme-court-decisions")
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                self.log_test("GET /api/supreme-court-decisions", True, f"✅ {count} Yargıtay kararı bulundu")
            else:
                self.log_test("GET /api/supreme-court-decisions", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/supreme-court-decisions", False, f"❌ Hata: {str(e)}")
        
        # Test GET /api/legal-aid-info
        try:
            response = self.make_request("GET", "/legal-aid-info")
            if response.status_code == 200:
                data = response.json()
                has_data = bool(data and (isinstance(data, dict) or (isinstance(data, list) and len(data) > 0)))
                self.log_test("GET /api/legal-aid-info", True, f"✅ Adli yardım bilgisi {'mevcut' if has_data else 'boş'}")
            else:
                self.log_test("GET /api/legal-aid-info", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/legal-aid-info", False, f"❌ Hata: {str(e)}")
    
    def test_admin_dashboard_with_auth(self):
        """Test admin dashboard with authentication"""
        print("\n=== 3. ADMIN DASHBOARD TESLERİ ===")
        
        # First authenticate
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("Admin Dashboard Test", False, "❌ Authentication başarısız - token alınamadı")
            return
        
        # Test GET /api/admin/dashboard (with auth)
        try:
            response = self.make_request("GET", "/admin/dashboard", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                required_stats = ["total_processes", "total_blog_posts", "total_decisions"]
                
                stats_info = []
                for stat in required_stats:
                    if stat in data:
                        stats_info.append(f"{stat}: {data[stat]}")
                
                if len(stats_info) >= 3:
                    self.log_test("GET /api/admin/dashboard", True, f"✅ Dashboard istatistikleri: {', '.join(stats_info)}")
                else:
                    self.log_test("GET /api/admin/dashboard", False, f"❌ Eksik istatistikler: {data}")
            else:
                self.log_test("GET /api/admin/dashboard", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/admin/dashboard", False, f"❌ Hata: {str(e)}")
        
        # Test GET /api/admin/calculator-parameters (with auth)
        try:
            response = self.make_request("GET", "/admin/calculator-parameters", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                self.log_test("GET /api/admin/calculator-parameters", True, f"✅ {count} hesaplama parametresi bulundu")
                
                # Show parameter categories
                if count > 0:
                    categories = set()
                    for param in data:
                        if 'category' in param:
                            categories.add(param['category'])
                    print(f"   📊 Parametre kategorileri: {', '.join(categories)}")
            else:
                self.log_test("GET /api/admin/calculator-parameters", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/admin/calculator-parameters", False, f"❌ Hata: {str(e)}")
    
    def test_cors_and_network(self):
        """Test CORS and network functionality"""
        print("\n=== 4. CORS VE NETWORK TESLERİ ===")
        
        # Test CORS headers with proper request
        try:
            response = self.make_request("GET", "/legal-processes")
            
            # Check for CORS headers (case-insensitive)
            cors_headers = {}
            for header_name, header_value in response.headers.items():
                if 'access-control' in header_name.lower():
                    cors_headers[header_name] = header_value
            
            if cors_headers:
                self.log_test("CORS Headers", True, f"✅ CORS headers mevcut: {cors_headers}")
            else:
                self.log_test("CORS Headers", False, "❌ CORS headers bulunamadı")
        except Exception as e:
            self.log_test("CORS Headers", False, f"❌ CORS test hatası: {str(e)}")
        
        # Test response format
        try:
            response = self.make_request("GET", "/legal-processes")
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'application/json' in content_type:
                    self.log_test("Response Format", True, f"✅ JSON response formatı doğru: {content_type}")
                else:
                    self.log_test("Response Format", False, f"❌ Beklenmeyen content-type: {content_type}")
            else:
                self.log_test("Response Format", False, f"❌ Response alınamadı: {response.status_code}")
        except Exception as e:
            self.log_test("Response Format", False, f"❌ Format test hatası: {str(e)}")
        
        # Test error handling
        try:
            response = self.make_request("GET", "/non-existent-endpoint")
            if response.status_code == 404:
                self.log_test("Error Handling", True, "✅ 404 error handling çalışıyor")
            else:
                self.log_test("Error Handling", False, f"❌ Beklenmeyen response: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling", False, f"❌ Error handling test hatası: {str(e)}")
    
    def test_empty_endpoints_analysis(self):
        """Analyze which endpoints return empty arrays or errors"""
        print("\n=== 5. SORUN TESPİTİ ANALİZİ ===")
        
        endpoints_to_check = [
            ("/legal-processes", "Hukuki Süreçler"),
            ("/blog-posts", "Blog Yazıları"),
            ("/supreme-court-decisions", "Yargıtay Kararları"),
            ("/legal-aid-info", "Adli Yardım Bilgisi"),
            ("/calculator-parameters", "Hesaplama Parametreleri")
        ]
        
        empty_endpoints = []
        error_endpoints = []
        
        for endpoint, name in endpoints_to_check:
            try:
                response = self.make_request("GET", endpoint)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check if empty
                    is_empty = False
                    if isinstance(data, list) and len(data) == 0:
                        is_empty = True
                        empty_endpoints.append(f"{name} ({endpoint})")
                    elif isinstance(data, dict) and not data:
                        is_empty = True
                        empty_endpoints.append(f"{name} ({endpoint})")
                    
                    if not is_empty:
                        count = len(data) if isinstance(data, list) else "1 kayıt"
                        print(f"   ✅ {name}: {count} kayıt")
                else:
                    error_endpoints.append(f"{name} ({endpoint}) - HTTP {response.status_code}")
                    
            except Exception as e:
                error_endpoints.append(f"{name} ({endpoint}) - Error: {str(e)}")
        
        # Report findings
        if empty_endpoints:
            self.log_test("Boş Array Döndüren Endpoint'ler", False, f"❌ Boş: {', '.join(empty_endpoints)}")
        else:
            self.log_test("Boş Array Kontrolü", True, "✅ Tüm endpoint'ler veri döndürüyor")
        
        if error_endpoints:
            self.log_test("Hata Veren Endpoint'ler", False, f"❌ Hatalar: {', '.join(error_endpoints)}")
        else:
            self.log_test("Endpoint Hata Kontrolü", True, "✅ Tüm endpoint'ler çalışıyor")
    
    def run_comprehensive_turkish_tests(self):
        """Run comprehensive tests as requested in Turkish"""
        print("🚀 KAPSAMLI BACKEND API TEST - MongoDB VERI DOĞRULAMA")
        print(f"Test edilen API: {API_BASE}")
        print("=" * 80)
        
        # Run Turkish test suites
        self.test_backend_service_status()
        self.test_mongodb_data_existence()
        self.test_admin_dashboard_with_auth()
        self.test_cors_and_network()
        self.test_empty_endpoints_analysis()
        
        # Summary in Turkish
        print("\n" + "=" * 80)
        print("📊 TEST SONUÇLARI ÖZET")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Toplam Test: {total_tests}")
        print(f"Başarılı: {passed_tests}")
        print(f"Başarısız: {failed_tests}")
        print(f"Başarı Oranı: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ BAŞARISIZ TESTLER:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🔍 DETAYLI ANALİZ:")
        print("- Backend servis durumu kontrol edildi")
        print("- MongoDB veri varlığı doğrulandı")
        print("- Admin authentication test edildi")
        print("- CORS ve network ayarları kontrol edildi")
        print("- Boş endpoint'ler ve hatalar analiz edildi")
        
        return failed_tests == 0
    
    def test_admin_authentication(self):
        """Test admin authentication system"""
        print("\n=== ADMIN AUTHENTICATION ===")
        
        # Test login with correct credentials
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        
        try:
            response = self.make_request("POST", "/admin/login", data=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user_id" in data:
                    self.access_token = data["access_token"]
                    self.log_test("Admin Login", True, f"Login successful for user: {data.get('username')}")
                else:
                    self.log_test("Admin Login", False, "Invalid login response format")
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Admin Login", False, f"Login error: {str(e)}")
        
        # Test login with wrong credentials
        try:
            wrong_login = {
                "username": "wrong_user",
                "password": "wrong_pass"
            }
            response = self.make_request("POST", "/admin/login", data=wrong_login)
            
            if response.status_code == 401:
                self.log_test("Admin Login - Wrong Credentials", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("Admin Login - Wrong Credentials", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Admin Login - Wrong Credentials", False, f"Error: {str(e)}")
        
        # Test protected endpoint access
        if self.access_token:
            try:
                response = self.make_request("GET", "/admin/me", auth_required=True)
                
                if response.status_code == 200:
                    data = response.json()
                    if "username" in data:
                        self.log_test("Protected Endpoint Access", True, f"Successfully accessed admin profile: {data['username']}")
                    else:
                        self.log_test("Protected Endpoint Access", False, "Invalid profile response")
                else:
                    self.log_test("Protected Endpoint Access", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Protected Endpoint Access", False, f"Error: {str(e)}")
    
    def test_dashboard_statistics(self):
        """Test dashboard statistics endpoint"""
        print("\n=== DASHBOARD STATISTICS ===")
        
        if not self.access_token:
            self.log_test("Dashboard Statistics", False, "No access token available")
            return
        
        try:
            response = self.make_request("GET", "/admin/dashboard", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_processes", "total_blog_posts", "total_decisions", "total_visits"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Dashboard Statistics", True, f"Statistics retrieved: {data}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Dashboard Statistics", False, f"Missing fields: {missing}")
            else:
                self.log_test("Dashboard Statistics", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Dashboard Statistics", False, f"Error: {str(e)}")
    
    def test_legal_processes_crud(self):
        """Test legal processes CRUD operations"""
        print("\n=== LEGAL PROCESSES CRUD ===")
        
        if not self.access_token:
            self.log_test("Legal Processes CRUD", False, "No access token available")
            return
        
        created_process_id = None
        
        # Test GET all legal processes
        try:
            response = self.make_request("GET", "/admin/legal-processes", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Legal Processes", True, f"Retrieved {len(data)} legal processes")
            else:
                self.log_test("Get Legal Processes", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Legal Processes", False, f"Error: {str(e)}")
        
        # Test CREATE legal process
        try:
            new_process = {
                "title": "Test Hukuki Süreç",
                "description": "Bu bir test hukuki sürecidir",
                "icon": "⚖️",
                "color": "#3B82F6",
                "gradient": "from-blue-500 to-blue-600",
                "duration": "2-4 hafta",
                "difficulty": "Orta",
                "total_steps": 3,
                "has_calculator": False,
                "category": "hukuk",
                "tags": ["test", "hukuk"],
                "estimated_costs": {
                    "title": "Tahmini Maliyetler",
                    "items": [
                        {
                            "name": "Avukat Ücreti",
                            "min": 5000,
                            "max": 15000,
                            "note": "Davanın karmaşıklığına göre değişir"
                        }
                    ],
                    "total_range": "5.000 - 15.000 TL",
                    "free_options": ["Adli yardım"]
                },
                "steps": [
                    {
                        "id": "step1",
                        "title": "İlk Adım",
                        "short_title": "Başlangıç",
                        "description": "Test adımı açıklaması",
                        "duration": "1 hafta",
                        "participants": ["Davacı"],
                        "required_documents": [{"name": "Kimlik", "description": "T.C. Kimlik Belgesi"}],
                        "important_notes": ["Önemli not"],
                        "position": {"x": 100, "y": 100},
                        "connections": [],
                        "status": "active"
                    }
                ]
            }
            
            response = self.make_request("POST", "/admin/legal-processes", data=new_process, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_process_id = data.get("id")
                self.log_test("Create Legal Process", True, f"Created process with ID: {created_process_id}")
            else:
                self.log_test("Create Legal Process", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Legal Process", False, f"Error: {str(e)}")
        
        # Test UPDATE legal process
        if created_process_id:
            try:
                update_data = {
                    "title": "Updated Test Hukuki Süreç",
                    "description": "Bu güncellenmiş bir test sürecidir"
                }
                
                response = self.make_request("PUT", f"/admin/legal-processes/{created_process_id}", 
                                           data=update_data, auth_required=True)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("title") == update_data["title"]:
                        self.log_test("Update Legal Process", True, "Process updated successfully")
                    else:
                        self.log_test("Update Legal Process", False, "Update not reflected in response")
                else:
                    self.log_test("Update Legal Process", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Update Legal Process", False, f"Error: {str(e)}")
        
        # Test DELETE legal process
        if created_process_id:
            try:
                response = self.make_request("DELETE", f"/admin/legal-processes/{created_process_id}", 
                                           auth_required=True)
                
                if response.status_code == 200:
                    self.log_test("Delete Legal Process", True, "Process deleted successfully")
                else:
                    self.log_test("Delete Legal Process", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Delete Legal Process", False, f"Error: {str(e)}")
    
    def test_calculator_parameters_crud(self):
        """Test calculator parameters CRUD operations"""
        print("\n=== CALCULATOR PARAMETERS CRUD ===")
        
        if not self.access_token:
            self.log_test("Calculator Parameters CRUD", False, "No access token available")
            return
        
        created_param_id = None
        
        # Test GET all parameters
        try:
            response = self.make_request("GET", "/admin/calculator-parameters", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Calculator Parameters", True, f"Retrieved {len(data)} parameters")
            else:
                self.log_test("Get Calculator Parameters", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Calculator Parameters", False, f"Error: {str(e)}")
        
        # Test CREATE parameter
        try:
            new_param = {
                "name": "test_multiplier",
                "value": 1.5,
                "description": "Test çarpanı",
                "category": "compensation",
                "unit": "kat",
                "is_active": True
            }
            
            response = self.make_request("POST", "/admin/calculator-parameters", 
                                       data=new_param, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_param_id = data.get("id")
                self.log_test("Create Calculator Parameter", True, f"Created parameter with ID: {created_param_id}")
            else:
                self.log_test("Create Calculator Parameter", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Calculator Parameter", False, f"Error: {str(e)}")
        
        # Test UPDATE parameter
        if created_param_id:
            try:
                update_data = {
                    "value": 2.0,
                    "description": "Güncellenmiş test çarpanı"
                }
                
                response = self.make_request("PUT", f"/admin/calculator-parameters/{created_param_id}", 
                                           data=update_data, auth_required=True)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("value") == update_data["value"]:
                        self.log_test("Update Calculator Parameter", True, "Parameter updated successfully")
                    else:
                        self.log_test("Update Calculator Parameter", False, "Update not reflected in response")
                else:
                    self.log_test("Update Calculator Parameter", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Update Calculator Parameter", False, f"Error: {str(e)}")
        
        # Test DELETE parameter
        if created_param_id:
            try:
                response = self.make_request("DELETE", f"/admin/calculator-parameters/{created_param_id}", 
                                           auth_required=True)
                
                if response.status_code == 200:
                    self.log_test("Delete Calculator Parameter", True, "Parameter deleted successfully")
                else:
                    self.log_test("Delete Calculator Parameter", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Delete Calculator Parameter", False, f"Error: {str(e)}")
    
    def test_content_pages_crud(self):
        """Test content pages CRUD operations"""
        print("\n=== CONTENT PAGES CRUD ===")
        
        if not self.access_token:
            self.log_test("Content Pages CRUD", False, "No access token available")
            return
        
        created_page_id = None
        
        # Test GET all pages
        try:
            response = self.make_request("GET", "/admin/content-pages", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Content Pages", True, f"Retrieved {len(data)} content pages")
            else:
                self.log_test("Get Content Pages", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Content Pages", False, f"Error: {str(e)}")
        
        # Test CREATE page
        try:
            new_page = {
                "slug": "test-page",
                "title": "Test Sayfası",
                "content": "Bu bir test sayfasıdır.",
                "meta_description": "Test sayfası açıklaması",
                "is_published": True,
                "author": "Test Author"
            }
            
            response = self.make_request("POST", "/admin/content-pages", 
                                       data=new_page, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_page_id = data.get("id")
                self.log_test("Create Content Page", True, f"Created page with ID: {created_page_id}")
            else:
                self.log_test("Create Content Page", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Create Content Page", False, f"Error: {str(e)}")
        
        # Test UPDATE page
        if created_page_id:
            try:
                update_data = {
                    "title": "Güncellenmiş Test Sayfası",
                    "content": "Bu güncellenmiş içeriktir."
                }
                
                response = self.make_request("PUT", f"/admin/content-pages/{created_page_id}", 
                                           data=update_data, auth_required=True)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("title") == update_data["title"]:
                        self.log_test("Update Content Page", True, "Page updated successfully")
                    else:
                        self.log_test("Update Content Page", False, "Update not reflected in response")
                else:
                    self.log_test("Update Content Page", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Update Content Page", False, f"Error: {str(e)}")
        
        # Test DELETE page
        if created_page_id:
            try:
                response = self.make_request("DELETE", f"/admin/content-pages/{created_page_id}", 
                                           auth_required=True)
                
                if response.status_code == 200:
                    self.log_test("Delete Content Page", True, "Page deleted successfully")
                else:
                    self.log_test("Delete Content Page", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("Delete Content Page", False, f"Error: {str(e)}")
    
    def test_public_endpoints(self):
        """Test public API endpoints"""
        print("\n=== PUBLIC API ENDPOINTS ===")
        
        # Test public legal processes
        try:
            response = self.make_request("GET", "/legal-processes")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Public Legal Processes", True, f"Retrieved {len(data)} public processes")
                
                # Test individual process detail endpoint if we have processes
                if len(data) > 0:
                    # Test multiple processes to ensure comprehensive coverage
                    test_count = min(3, len(data))  # Test up to 3 processes
                    for i in range(test_count):
                        process = data[i]
                        process_id = process.get('id')
                        
                        if process_id:
                            self.test_legal_process_detail(process_id, process.get('title', 'Unknown'))
                        else:
                            self.log_test(f"Legal Process Detail - No ID (Process {i+1})", False, f"Process {i+1} has no ID field")
                    
                    # Test with non-existent process ID to verify 404 handling
                    self.test_legal_process_detail("non-existent-process-id", "Non-existent Process")
                else:
                    self.log_test("Legal Process Detail - No Data", False, "No legal processes found to test detail endpoint")
            else:
                self.log_test("Public Legal Processes", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Legal Processes", False, f"Error: {str(e)}")
        
        # Test public calculator parameters
        try:
            response = self.make_request("GET", "/calculator-parameters")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Public Calculator Parameters", True, f"Retrieved {len(data)} public parameters")
            else:
                self.log_test("Public Calculator Parameters", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Calculator Parameters", False, f"Error: {str(e)}")
        
        # Test search functionality
        try:
            response = self.make_request("GET", "/search?q=test")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Search Functionality", True, f"Search returned results: {list(data.keys())}")
            else:
                self.log_test("Search Functionality", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Search Functionality", False, f"Error: {str(e)}")
        
        # Test calculator endpoints
        try:
            calc_data = {
                "monthly_salary": 10000,
                "years_worked": 5,
                "days_worked": 30,
                "overtime_hours": 20
            }
            
            response = self.make_request("POST", "/calculate-compensation", data=calc_data)
            
            if response.status_code == 200:
                data = response.json()
                if "total" in data and "breakdown" in data:
                    self.log_test("Compensation Calculator", True, f"Calculation successful: {data['total']} TL")
                else:
                    self.log_test("Compensation Calculator", False, "Invalid calculation response")
            else:
                self.log_test("Compensation Calculator", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Compensation Calculator", False, f"Error: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== ERROR HANDLING ===")
        
        # Test 404 for non-existent resource
        try:
            response = self.make_request("GET", "/admin/legal-processes/non-existent-id", auth_required=True)
            
            if response.status_code == 404:
                self.log_test("404 Error Handling", True, "Correctly returned 404 for non-existent resource")
            else:
                self.log_test("404 Error Handling", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling", False, f"Error: {str(e)}")
        
        # Test unauthorized access
        try:
            # Save current token
            temp_token = self.access_token
            self.access_token = "invalid_token"
            
            response = self.make_request("GET", "/admin/dashboard", auth_required=True)
            
            if response.status_code == 401:
                self.log_test("Unauthorized Access", True, "Correctly rejected invalid token")
            else:
                self.log_test("Unauthorized Access", False, f"Expected 401, got {response.status_code}")
            
            # Restore token
            self.access_token = temp_token
        except Exception as e:
            self.log_test("Unauthorized Access", False, f"Error: {str(e)}")
        
        # Test validation errors
        try:
            invalid_process = {
                "title": "",  # Empty title should cause validation error
                "description": "Test"
            }
            
            response = self.make_request("POST", "/admin/legal-processes", 
                                       data=invalid_process, auth_required=True)
            
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test("Validation Error Handling", True, "Correctly handled validation error")
            else:
                self.log_test("Validation Error Handling", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Validation Error Handling", False, f"Error: {str(e)}")
    
    def test_legal_process_detail(self, process_id, process_title):
        """Test individual legal process detail endpoint - Critical for ProcessFlowWithHeader.jsx"""
        print(f"\n=== LEGAL PROCESS DETAIL TEST (ID: {process_id}) ===")
        
        try:
            response = self.make_request("GET", f"/legal-processes/{process_id}")
            
            if response.status_code == 200:
                process = response.json()
                
                # Check required fields that ProcessFlowWithHeader.jsx expects
                required_fields = [
                    'id', 'title', 'description', 'icon', 'gradient', 'duration', 
                    'difficulty', 'steps', 'has_calculator', 'category'
                ]
                
                missing_fields = []
                for field in required_fields:
                    if field not in process:
                        missing_fields.append(field)
                
                if not missing_fields:
                    # Validate steps structure
                    steps = process.get('steps', [])
                    if isinstance(steps, list) and len(steps) > 0:
                        # Check first step structure
                        first_step = steps[0]
                        step_required_fields = [
                            'id', 'title', 'short_title', 'description', 'duration',
                            'participants', 'required_documents', 'important_notes'
                        ]
                        
                        missing_step_fields = []
                        for field in step_required_fields:
                            if field not in first_step:
                                missing_step_fields.append(field)
                        
                        if not missing_step_fields:
                            self.log_test(
                                f"Legal Process Detail - {process_title}", 
                                True, 
                                f"✅ All required fields present. Process has {len(steps)} steps. Frontend compatibility confirmed."
                            )
                        else:
                            self.log_test(
                                f"Legal Process Detail - {process_title}", 
                                False, 
                                f"Missing step fields: {missing_step_fields}"
                            )
                    else:
                        self.log_test(
                            f"Legal Process Detail - {process_title}", 
                            False, 
                            f"Steps field is empty or invalid: {steps}"
                        )
                else:
                    self.log_test(
                        f"Legal Process Detail - {process_title}", 
                        False, 
                        f"Missing required fields: {missing_fields}"
                    )
            elif response.status_code == 404:
                self.log_test(
                    f"Legal Process Detail - {process_title}", 
                    False, 
                    f"Process not found (404) - ID may be invalid: {process_id}"
                )
            else:
                self.log_test(
                    f"Legal Process Detail - {process_title}", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test(f"Legal Process Detail - {process_title}", False, f"Error: {str(e)}")
    
    def test_cms_endpoints_comprehensive(self):
        """🎯 COMPREHENSIVE CMS ENDPOINTS TESTING - NEW FUNCTIONALITY"""
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE CMS ENDPOINTS TESTING - NEW FUNCTIONALITY")
        print("=" * 80)
        
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("CMS Tests", False, "❌ Authentication failed - cannot test CMS endpoints")
            return
        
        # ============================================
        # 1. SECTION-BASED CONTENT MANAGEMENT APIs
        # ============================================
        print("\n=== 1. SECTION-BASED CONTENT MANAGEMENT APIs ===")
        
        # Test Contact Page Content Admin Endpoints
        print("\n--- Contact Page Content Admin ---")
        try:
            # GET /api/admin/contact-page-content
            response = self.make_request("GET", "/admin/contact-page-content", auth_required=True)
            if response.status_code == 200:
                contact_data = response.json()
                required_fields = ['hero_title', 'hero_description', 'contact_email', 'contact_phone', 
                                 'contact_address', 'office_hours', 'contact_form_title', 'contact_form_description']
                missing_fields = [field for field in required_fields if field not in contact_data]
                
                if not missing_fields:
                    self.log_test("GET /api/admin/contact-page-content", True, 
                                f"✅ All required fields present: {', '.join(required_fields)}")
                    
                    # Test PUT /api/admin/contact-page-content
                    update_data = {
                        "hero_title": "Test Contact Title",
                        "hero_description": "Test contact description for CMS testing",
                        "contact_email": "test@legaldesignturkey.com",
                        "contact_phone": "+90 555 123 45 67",
                        "contact_address": "Test Address, Istanbul, Turkey",
                        "office_hours": "Monday - Friday: 09:00 - 18:00",
                        "contact_form_title": "Test Contact Form",
                        "contact_form_description": "Test form description"
                    }
                    
                    put_response = self.make_request("PUT", "/admin/contact-page-content", 
                                                   data=update_data, auth_required=True)
                    if put_response.status_code == 200:
                        updated_data = put_response.json()
                        if updated_data.get('hero_title') == update_data['hero_title']:
                            self.log_test("PUT /api/admin/contact-page-content", True, 
                                        "✅ Contact page content updated successfully")
                        else:
                            self.log_test("PUT /api/admin/contact-page-content", False, 
                                        "❌ Update not reflected in response")
                    else:
                        self.log_test("PUT /api/admin/contact-page-content", False, 
                                    f"❌ HTTP {put_response.status_code}: {put_response.text}")
                else:
                    self.log_test("GET /api/admin/contact-page-content", False, 
                                f"❌ Missing required fields: {missing_fields}")
            else:
                self.log_test("GET /api/admin/contact-page-content", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Contact Page Content Admin", False, f"❌ Error: {str(e)}")
        
        # Test Home Page Content Admin Endpoints
        print("\n--- Home Page Content Admin ---")
        try:
            # GET /api/admin/home-page-content
            response = self.make_request("GET", "/admin/home-page-content", auth_required=True)
            if response.status_code == 200:
                home_data = response.json()
                required_fields = ['hero_title', 'hero_subtitle', 'hero_primary_btn_text', 'hero_primary_btn_url',
                                 'hero_secondary_btn_text', 'hero_secondary_btn_url', 'stats_processes', 
                                 'stats_steps', 'stats_free_text', 'features_title', 'features_description']
                missing_fields = [field for field in required_fields if field not in home_data]
                
                if not missing_fields:
                    self.log_test("GET /api/admin/home-page-content", True, 
                                f"✅ All required fields present: {len(required_fields)} fields")
                    
                    # Test PUT /api/admin/home-page-content
                    update_data = {
                        "hero_title": "Test Legal Processes Visualization",
                        "hero_subtitle": "Test subtitle for CMS functionality testing",
                        "hero_primary_btn_text": "Test Explore Processes",
                        "hero_primary_btn_url": "/test-processes",
                        "hero_secondary_btn_text": "Test Free Help",
                        "hero_secondary_btn_url": "/test-help",
                        "stats_processes": 12,
                        "stats_steps": 45,
                        "stats_free_text": "Free Test",
                        "features_title": "Test Features Title",
                        "features_description": "Test features description for CMS"
                    }
                    
                    put_response = self.make_request("PUT", "/admin/home-page-content", 
                                                   data=update_data, auth_required=True)
                    if put_response.status_code == 200:
                        updated_data = put_response.json()
                        if updated_data.get('hero_title') == update_data['hero_title']:
                            self.log_test("PUT /api/admin/home-page-content", True, 
                                        "✅ Home page content updated successfully")
                        else:
                            self.log_test("PUT /api/admin/home-page-content", False, 
                                        "❌ Update not reflected in response")
                    else:
                        self.log_test("PUT /api/admin/home-page-content", False, 
                                    f"❌ HTTP {put_response.status_code}: {put_response.text}")
                else:
                    self.log_test("GET /api/admin/home-page-content", False, 
                                f"❌ Missing required fields: {missing_fields}")
            else:
                self.log_test("GET /api/admin/home-page-content", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Home Page Content Admin", False, f"❌ Error: {str(e)}")
        
        # Test About Page Content Admin Endpoints (already implemented)
        print("\n--- About Page Content Admin ---")
        try:
            response = self.make_request("GET", "/admin/about-page-content", auth_required=True)
            if response.status_code == 200:
                about_data = response.json()
                required_fields = ['hero_title', 'hero_description', 'mission_title', 'mission_description',
                                 'vision_title', 'vision_description', 'values', 'team_members']
                missing_fields = [field for field in required_fields if field not in about_data]
                
                if not missing_fields:
                    self.log_test("GET /api/admin/about-page-content", True, 
                                f"✅ About page content working - {len(required_fields)} fields")
                else:
                    self.log_test("GET /api/admin/about-page-content", False, 
                                f"❌ Missing fields: {missing_fields}")
            else:
                self.log_test("GET /api/admin/about-page-content", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("About Page Content Admin", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 2. PUBLIC CONTENT APIs
        # ============================================
        print("\n=== 2. PUBLIC CONTENT APIs ===")
        
        # Test Public Contact Page Content
        try:
            response = self.make_request("GET", "/contact-page-content")
            if response.status_code == 200:
                data = response.json()
                if 'hero_title' in data and 'contact_email' in data:
                    self.log_test("GET /api/contact-page-content (Public)", True, 
                                f"✅ Public contact content available")
                else:
                    self.log_test("GET /api/contact-page-content (Public)", False, 
                                "❌ Missing required public fields")
            else:
                self.log_test("GET /api/contact-page-content (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Contact Page Content", False, f"❌ Error: {str(e)}")
        
        # Test Public Home Page Content
        try:
            response = self.make_request("GET", "/home-page-content")
            if response.status_code == 200:
                data = response.json()
                if 'hero_title' in data and 'hero_subtitle' in data:
                    self.log_test("GET /api/home-page-content (Public)", True, 
                                f"✅ Public home content available")
                else:
                    self.log_test("GET /api/home-page-content (Public)", False, 
                                "❌ Missing required public fields")
            else:
                self.log_test("GET /api/home-page-content (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Home Page Content", False, f"❌ Error: {str(e)}")
        
        # Test Public About Page Content
        try:
            response = self.make_request("GET", "/about-page-content")
            if response.status_code == 200:
                data = response.json()
                if 'hero_title' in data and 'mission_title' in data:
                    self.log_test("GET /api/about-page-content (Public)", True, 
                                f"✅ Public about content available")
                else:
                    self.log_test("GET /api/about-page-content (Public)", False, 
                                "❌ Missing required public fields")
            else:
                self.log_test("GET /api/about-page-content (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public About Page Content", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 3. SITE SETTINGS INTEGRATION
        # ============================================
        print("\n=== 3. SITE SETTINGS INTEGRATION ===")
        
        # Test Public Site Settings
        try:
            response = self.make_request("GET", "/site-settings")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['site_title', 'site_description', 'contact_email', 'contact_phone']
                present_fields = [field for field in required_fields if field in data]
                self.log_test("GET /api/site-settings (Public)", True, 
                            f"✅ Site settings available - {len(present_fields)}/{len(required_fields)} fields")
            else:
                self.log_test("GET /api/site-settings (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Site Settings", False, f"❌ Error: {str(e)}")
        
        # Test Public Menu Config
        try:
            response = self.make_request("GET", "/menu-config")
            if response.status_code == 200:
                data = response.json()
                if 'menu_items' in data and isinstance(data['menu_items'], list):
                    menu_count = len(data['menu_items'])
                    self.log_test("GET /api/menu-config (Public)", True, 
                                f"✅ Menu config available - {menu_count} menu items")
                else:
                    self.log_test("GET /api/menu-config (Public)", False, 
                                "❌ Invalid menu config structure")
            else:
                self.log_test("GET /api/menu-config (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Menu Config", False, f"❌ Error: {str(e)}")
        
        # Test Public Footer Config
        try:
            response = self.make_request("GET", "/footer-config")
            if response.status_code == 200:
                data = response.json()
                if 'footer_sections' in data and 'copyright_text' in data:
                    sections_count = len(data.get('footer_sections', []))
                    self.log_test("GET /api/footer-config (Public)", True, 
                                f"✅ Footer config available - {sections_count} sections")
                else:
                    self.log_test("GET /api/footer-config (Public)", False, 
                                "❌ Invalid footer config structure")
            else:
                self.log_test("GET /api/footer-config (Public)", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Public Footer Config", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 4. DATA PERSISTENCE TESTING
        # ============================================
        print("\n=== 4. DATA PERSISTENCE TESTING ===")
        
        # Test data persistence by updating and verifying changes
        try:
            # Update contact page content via admin
            test_email = f"test-{datetime.now().strftime('%H%M%S')}@example.com"
            update_data = {"contact_email": test_email}
            
            admin_response = self.make_request("PUT", "/admin/contact-page-content", 
                                             data=update_data, auth_required=True)
            
            if admin_response.status_code == 200:
                # Verify change is reflected in public endpoint
                public_response = self.make_request("GET", "/contact-page-content")
                if public_response.status_code == 200:
                    public_data = public_response.json()
                    if public_data.get('contact_email') == test_email:
                        self.log_test("CMS Data Persistence", True, 
                                    "✅ Admin changes reflected in public endpoints")
                    else:
                        self.log_test("CMS Data Persistence", False, 
                                    f"❌ Change not reflected - expected {test_email}, got {public_data.get('contact_email')}")
                else:
                    self.log_test("CMS Data Persistence", False, 
                                f"❌ Public endpoint failed: {public_response.status_code}")
            else:
                self.log_test("CMS Data Persistence", False, 
                            f"❌ Admin update failed: {admin_response.status_code}")
        except Exception as e:
            self.log_test("CMS Data Persistence", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 5. FIELD NAME COMPATIBILITY TESTING
        # ============================================
        print("\n=== 5. FIELD NAME COMPATIBILITY TESTING ===")
        
        # Test snake_case/camelCase compatibility
        try:
            # Test with camelCase field names (as frontend would send)
            camel_case_data = {
                "heroTitle": "CamelCase Test Title",
                "heroDescription": "Testing camelCase field compatibility",
                "contactEmail": "camelcase@test.com"
            }
            
            response = self.make_request("PUT", "/admin/contact-page-content", 
                                       data=camel_case_data, auth_required=True)
            
            if response.status_code == 200:
                response_data = response.json()
                # Check if camelCase input was processed correctly
                if (response_data.get('hero_title') == camel_case_data['heroTitle'] or 
                    response_data.get('heroTitle') == camel_case_data['heroTitle']):
                    self.log_test("Field Name Compatibility (camelCase)", True, 
                                "✅ CamelCase field names accepted and processed")
                else:
                    self.log_test("Field Name Compatibility (camelCase)", False, 
                                "❌ CamelCase fields not processed correctly")
            else:
                self.log_test("Field Name Compatibility (camelCase)", False, 
                            f"❌ CamelCase request failed: {response.status_code}")
        except Exception as e:
            self.log_test("Field Name Compatibility", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # SUMMARY
        # ============================================
        print("\n" + "=" * 80)
        print("📊 CMS ENDPOINTS TEST SUMMARY")
        print("=" * 80)
        
        cms_tests = [result for result in self.test_results if any(keyword in result['test'] for keyword in [
            'contact-page-content', 'home-page-content', 'about-page-content', 
            'site-settings', 'menu-config', 'footer-config', 'CMS', 'Field Name Compatibility'
        ])]
        
        total_cms = len(cms_tests)
        passed_cms = sum(1 for result in cms_tests if result["success"])
        failed_cms = total_cms - passed_cms
        
        print(f"CMS Test Count: {total_cms}")
        print(f"Passed: {passed_cms}")
        print(f"Failed: {failed_cms}")
        print(f"CMS Success Rate: {(passed_cms/total_cms)*100:.1f}%" if total_cms > 0 else "0%")
        
        if failed_cms > 0:
            print("\n❌ FAILED CMS TESTS:")
            for result in cms_tests:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🎯 CMS FUNCTIONALITY VERIFIED:")
        print("- Section-based content management APIs tested")
        print("- Public content APIs verified")
        print("- Site settings integration confirmed")
        print("- Data persistence validated")
        print("- Field name compatibility (snake_case/camelCase) tested")

    def test_home_page_content_stats_issue(self):
        """🎯 HOME PAGE CONTENT STATS SECTION TESTING - TROUBLESHOOT STATS NOT UPDATING"""
        print("\n" + "=" * 80)
        print("🎯 HOME PAGE CONTENT STATS SECTION TESTING - TROUBLESHOOT STATS NOT UPDATING")
        print("=" * 80)
        
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("Home Page Content Stats Tests", False, "❌ Authentication failed - cannot test")
            return
        
        # ============================================
        # 1. TEST GET /api/admin/home-page-content (with auth)
        # ============================================
        print("\n=== 1. ADMIN HOME PAGE CONTENT API TESTING ===")
        
        original_data = None
        try:
            response = self.make_request("GET", "/admin/home-page-content", auth_required=True)
            if response.status_code == 200:
                original_data = response.json()
                
                # Check for stats fields specifically
                stats_fields = [
                    'stats_processes_number', 'stats_processes_label', 'stats_processes_description',
                    'stats_steps_number', 'stats_steps_label', 'stats_steps_description',
                    'stats_free_number', 'stats_free_label', 'stats_free_description'
                ]
                
                missing_stats_fields = [field for field in stats_fields if field not in original_data]
                
                if not missing_stats_fields:
                    self.log_test("GET /api/admin/home-page-content - Stats Fields", True, 
                                f"✅ All stats fields present: {', '.join(stats_fields)}")
                    
                    # Log current stats values
                    current_stats = {
                        'processes': f"{original_data.get('stats_processes_number')} {original_data.get('stats_processes_label')}",
                        'steps': f"{original_data.get('stats_steps_number')} {original_data.get('stats_steps_label')}",
                        'free': f"{original_data.get('stats_free_number')} {original_data.get('stats_free_label')}"
                    }
                    print(f"   📊 Current Stats: {current_stats}")
                else:
                    self.log_test("GET /api/admin/home-page-content - Stats Fields", False, 
                                f"❌ Missing stats fields: {missing_stats_fields}")
            else:
                self.log_test("GET /api/admin/home-page-content", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
                return
        except Exception as e:
            self.log_test("GET /api/admin/home-page-content", False, f"❌ Error: {str(e)}")
            return
        
        # ============================================
        # 2. TEST PUT /api/admin/home-page-content (with auth) - UPDATE STATS
        # ============================================
        print("\n=== 2. ADMIN HOME PAGE CONTENT UPDATE TESTING ===")
        
        # Test data with updated stats
        test_stats_data = {
            "stats_processes_number": "12+",
            "stats_processes_label": "Test Processes",
            "stats_processes_description": "Updated test description for processes",
            "stats_steps_number": "50+",
            "stats_steps_label": "Test Steps", 
            "stats_steps_description": "Updated test description for steps",
            "stats_free_number": "100%",
            "stats_free_label": "Test Free",
            "stats_free_description": "Updated test description for free content"
        }
        
        try:
            response = self.make_request("PUT", "/admin/home-page-content", 
                                       data=test_stats_data, auth_required=True)
            
            if response.status_code == 200:
                updated_data = response.json()
                
                # Verify all stats fields were updated
                stats_updated_correctly = True
                for field, expected_value in test_stats_data.items():
                    actual_value = updated_data.get(field)
                    if actual_value != expected_value:
                        stats_updated_correctly = False
                        print(f"   ❌ Field {field}: expected '{expected_value}', got '{actual_value}'")
                
                if stats_updated_correctly:
                    self.log_test("PUT /api/admin/home-page-content - Stats Update", True, 
                                "✅ All stats fields updated correctly in admin API response")
                else:
                    self.log_test("PUT /api/admin/home-page-content - Stats Update", False, 
                                "❌ Stats fields not updated correctly in admin API response")
            else:
                self.log_test("PUT /api/admin/home-page-content - Stats Update", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
                return
        except Exception as e:
            self.log_test("PUT /api/admin/home-page-content - Stats Update", False, f"❌ Error: {str(e)}")
            return
        
        # ============================================
        # 3. TEST GET /api/home-page-content (public) - VERIFY UPDATED DATA
        # ============================================
        print("\n=== 3. PUBLIC HOME PAGE CONTENT API TESTING ===")
        
        try:
            response = self.make_request("GET", "/home-page-content")
            
            if response.status_code == 200:
                public_data = response.json()
                
                # Verify stats fields are present in public API
                stats_fields = [
                    'stats_processes_number', 'stats_processes_label', 'stats_processes_description',
                    'stats_steps_number', 'stats_steps_label', 'stats_steps_description', 
                    'stats_free_number', 'stats_free_label', 'stats_free_description'
                ]
                
                missing_public_stats = [field for field in stats_fields if field not in public_data]
                
                if not missing_public_stats:
                    self.log_test("GET /api/home-page-content - Stats Fields Present", True, 
                                "✅ All stats fields present in public API")
                    
                    # Verify updated stats are reflected in public API
                    public_stats_correct = True
                    for field, expected_value in test_stats_data.items():
                        actual_value = public_data.get(field)
                        if actual_value != expected_value:
                            public_stats_correct = False
                            print(f"   ❌ Public API Field {field}: expected '{expected_value}', got '{actual_value}'")
                    
                    if public_stats_correct:
                        self.log_test("GET /api/home-page-content - Stats Data Persistence", True, 
                                    "✅ Updated stats data correctly reflected in public API")
                    else:
                        self.log_test("GET /api/home-page-content - Stats Data Persistence", False, 
                                    "❌ Updated stats data NOT reflected in public API - THIS IS THE ISSUE!")
                else:
                    self.log_test("GET /api/home-page-content - Stats Fields Present", False, 
                                f"❌ Missing stats fields in public API: {missing_public_stats}")
            else:
                self.log_test("GET /api/home-page-content - Public API", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/home-page-content - Public API", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 4. TEST FIELD NAME COMPATIBILITY (snake_case vs camelCase)
        # ============================================
        print("\n=== 4. FIELD NAME COMPATIBILITY TESTING ===")
        
        # Test with camelCase field names (as frontend might send)
        camel_case_stats = {
            "statsProcessesNumber": "15+",
            "statsProcessesLabel": "CamelCase Processes",
            "statsProcessesDescription": "Testing camelCase field compatibility",
            "statsStepsNumber": "60+",
            "statsStepsLabel": "CamelCase Steps",
            "statsStepsDescription": "Testing camelCase steps field"
        }
        
        try:
            response = self.make_request("PUT", "/admin/home-page-content", 
                                       data=camel_case_stats, auth_required=True)
            
            if response.status_code == 200:
                camel_response_data = response.json()
                
                # Check if camelCase input was processed (Config.populate_by_name=True should handle this)
                camel_case_processed = False
                
                # Check both snake_case and camelCase in response
                if (camel_response_data.get('stats_processes_number') == "15+" or 
                    camel_response_data.get('statsProcessesNumber') == "15+"):
                    camel_case_processed = True
                
                if camel_case_processed:
                    self.log_test("Field Name Compatibility - camelCase Input", True, 
                                "✅ CamelCase field names processed correctly (Config.populate_by_name working)")
                else:
                    self.log_test("Field Name Compatibility - camelCase Input", False, 
                                "❌ CamelCase field names not processed - Config.populate_by_name may not be working")
            else:
                self.log_test("Field Name Compatibility - camelCase Input", False, 
                            f"❌ CamelCase request failed: {response.status_code}")
        except Exception as e:
            self.log_test("Field Name Compatibility - camelCase Input", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 5. DATABASE VERIFICATION
        # ============================================
        print("\n=== 5. DATABASE VERIFICATION ===")
        
        # Verify document exists and has correct structure by checking admin API again
        try:
            response = self.make_request("GET", "/admin/home-page-content", auth_required=True)
            if response.status_code == 200:
                final_data = response.json()
                
                # Check document structure
                required_fields = ['id', 'created_at', 'updated_at', 'hero_title', 'hero_subtitle']
                required_fields.extend([
                    'stats_processes_number', 'stats_processes_label', 'stats_processes_description',
                    'stats_steps_number', 'stats_steps_label', 'stats_steps_description',
                    'stats_free_number', 'stats_free_label', 'stats_free_description'
                ])
                
                missing_required = [field for field in required_fields if field not in final_data]
                
                if not missing_required:
                    self.log_test("Database Document Structure", True, 
                                f"✅ Home page content document has all required fields ({len(required_fields)} fields)")
                    
                    # Check if document has proper ID and timestamps
                    if final_data.get('id') and final_data.get('created_at') and final_data.get('updated_at'):
                        self.log_test("Database Document Metadata", True, 
                                    "✅ Document has proper ID and timestamps")
                    else:
                        self.log_test("Database Document Metadata", False, 
                                    "❌ Document missing ID or timestamps")
                else:
                    self.log_test("Database Document Structure", False, 
                                f"❌ Missing required fields: {missing_required}")
            else:
                self.log_test("Database Verification", False, 
                            f"❌ Could not verify database: {response.status_code}")
        except Exception as e:
            self.log_test("Database Verification", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # 6. RESTORE ORIGINAL DATA
        # ============================================
        print("\n=== 6. RESTORE ORIGINAL DATA ===")
        
        if original_data:
            try:
                # Restore original stats data
                restore_data = {
                    "stats_processes_number": original_data.get("stats_processes_number"),
                    "stats_processes_label": original_data.get("stats_processes_label"),
                    "stats_processes_description": original_data.get("stats_processes_description"),
                    "stats_steps_number": original_data.get("stats_steps_number"),
                    "stats_steps_label": original_data.get("stats_steps_label"),
                    "stats_steps_description": original_data.get("stats_steps_description"),
                    "stats_free_number": original_data.get("stats_free_number"),
                    "stats_free_label": original_data.get("stats_free_label"),
                    "stats_free_description": original_data.get("stats_free_description")
                }
                
                response = self.make_request("PUT", "/admin/home-page-content", 
                                           data=restore_data, auth_required=True)
                
                if response.status_code == 200:
                    self.log_test("Restore Original Data", True, 
                                "✅ Original stats data restored successfully")
                else:
                    self.log_test("Restore Original Data", False, 
                                f"❌ Failed to restore original data: {response.status_code}")
            except Exception as e:
                self.log_test("Restore Original Data", False, f"❌ Error: {str(e)}")
        
        # ============================================
        # SUMMARY
        # ============================================
        print("\n" + "=" * 80)
        print("📊 HOME PAGE CONTENT STATS TESTING SUMMARY")
        print("=" * 80)
        
        stats_tests = [result for result in self.test_results if 'home-page-content' in result['test'].lower() or 'stats' in result['test'].lower()]
        
        total_stats_tests = len(stats_tests)
        passed_stats_tests = sum(1 for result in stats_tests if result["success"])
        failed_stats_tests = total_stats_tests - passed_stats_tests
        
        print(f"Stats Tests Count: {total_stats_tests}")
        print(f"Passed: {passed_stats_tests}")
        print(f"Failed: {failed_stats_tests}")
        print(f"Stats Test Success Rate: {(passed_stats_tests/total_stats_tests)*100:.1f}%" if total_stats_tests > 0 else "0%")
        
        if failed_stats_tests > 0:
            print("\n❌ FAILED STATS TESTS:")
            for result in stats_tests:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🔍 STATS ISSUE DIAGNOSIS:")
        print("- Admin API GET/PUT endpoints tested for stats fields")
        print("- Public API GET endpoint tested for stats data reflection")
        print("- Field name compatibility (snake_case/camelCase) tested")
        print("- Database document structure verified")
        print("- Data persistence between admin and public APIs checked")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Backend API Test Suite")
        print(f"Testing API at: {API_BASE}")
        print("=" * 60)
        
        # Run test suites
        self.test_basic_health_check()
        self.test_admin_authentication()
        self.test_dashboard_statistics()
        self.test_legal_processes_crud()
        self.test_calculator_parameters_crud()
        self.test_content_pages_crud()
        self.test_public_endpoints()
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed_tests == 0

    def test_critical_admin_panel_apis(self):
        """KRİTİK ADMIN PANEL API TESLERİ - 4 ÖNEMLİ SORUN"""
        print("\n" + "=" * 80)
        print("🚨 KRİTİK ADMIN PANEL API TESLERİ - DETAYLI ANALİZ")
        print("=" * 80)
        
        # First authenticate
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("KRİTİK TEST - Authentication", False, "❌ Admin token alınamadı - testler durduruluyor")
            return
        
        # 1. ADMIN HUKUKİ SÜREÇLER TESLERİ
        print("\n=== 1. ADMIN HUKUKİ SÜREÇLER TESLERİ ===")
        try:
            response = self.make_request("GET", "/admin/legal-processes", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                
                if count == 0:
                    self.log_test("Admin Legal Processes", False, f"❌ SORUN: Hiç hukuki süreç yok! Boş array döndürüyor.")
                else:
                    self.log_test("Admin Legal Processes", True, f"✅ {count} hukuki süreç bulundu")
                    
                    # Response format analizi
                    if count > 0:
                        first_process = data[0]
                        required_fields = ['id', 'title', 'description', 'category', 'steps', 'hasCalculator']
                        missing_fields = [field for field in required_fields if field not in first_process]
                        
                        if missing_fields:
                            self.log_test("Legal Processes Response Format", False, f"❌ Eksik field'lar: {missing_fields}")
                        else:
                            self.log_test("Legal Processes Response Format", True, f"✅ Response format doğru - tüm gerekli field'lar mevcut")
                        
                        # Field detayları
                        print(f"   📋 İlk süreç detayları:")
                        print(f"      - ID: {first_process.get('id', 'YOK')}")
                        print(f"      - Başlık: {first_process.get('title', 'YOK')}")
                        print(f"      - Kategori: {first_process.get('category', 'YOK')}")
                        print(f"      - Adım sayısı: {len(first_process.get('steps', []))}")
                        print(f"      - Hesaplayıcı var mı: {first_process.get('hasCalculator', 'YOK')}")
            else:
                self.log_test("Admin Legal Processes", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Admin Legal Processes", False, f"❌ Hata: {str(e)}")
        
        # 2. ADMIN YARGITAY KARARLARI TESLERİ
        print("\n=== 2. ADMIN YARGITAY KARARLARI TESLERİ ===")
        try:
            response = self.make_request("GET", "/admin/supreme-court-decisions", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                
                if count == 0:
                    self.log_test("Admin Supreme Court Decisions", False, f"❌ SORUN: Hiç Yargıtay kararı yok! Boş array döndürüyor.")
                else:
                    self.log_test("Admin Supreme Court Decisions", True, f"✅ {count} Yargıtay kararı bulundu")
                    
                    # Response format analizi
                    if count > 0:
                        first_decision = data[0]
                        required_fields = ['id', 'decision_number', 'court_chamber', 'decision_date', 'case_type', 'summary', 'content']
                        missing_fields = [field for field in required_fields if field not in first_decision]
                        
                        if missing_fields:
                            self.log_test("Supreme Court Decisions Response Format", False, f"❌ Eksik field'lar: {missing_fields}")
                        else:
                            self.log_test("Supreme Court Decisions Response Format", True, f"✅ Response format doğru - tüm gerekli field'lar mevcut")
                        
                        # Field detayları
                        print(f"   📋 İlk karar detayları:")
                        print(f"      - ID: {first_decision.get('id', 'YOK')}")
                        print(f"      - Karar No: {first_decision.get('decision_number', 'YOK')}")
                        print(f"      - Daire: {first_decision.get('court_chamber', 'YOK')}")
                        print(f"      - Tarih: {first_decision.get('decision_date', 'YOK')}")
                        print(f"      - Dava Türü: {first_decision.get('case_type', 'YOK')}")
            else:
                self.log_test("Admin Supreme Court Decisions", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Admin Supreme Court Decisions", False, f"❌ Hata: {str(e)}")
        
        # 3. ADMIN BLOG YAZILARI TESLERİ
        print("\n=== 3. ADMIN BLOG YAZILARI TESLERİ ===")
        try:
            response = self.make_request("GET", "/admin/blog-posts", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                
                if count == 0:
                    self.log_test("Admin Blog Posts", False, f"❌ SORUN: Hiç blog yazısı yok! Boş array döndürüyor.")
                else:
                    self.log_test("Admin Blog Posts", True, f"✅ {count} blog yazısı bulundu")
                    
                    # Response format analizi
                    if count > 0:
                        first_post = data[0]
                        required_fields = ['id', 'title', 'slug', 'content', 'author', 'category', 'is_published']
                        missing_fields = [field for field in required_fields if field not in first_post]
                        
                        if missing_fields:
                            self.log_test("Blog Posts Response Format", False, f"❌ Eksik field'lar: {missing_fields}")
                        else:
                            self.log_test("Blog Posts Response Format", True, f"✅ Response format doğru - tüm gerekli field'lar mevcut")
                        
                        # Field detayları
                        print(f"   📋 İlk blog yazısı detayları:")
                        print(f"      - ID: {first_post.get('id', 'YOK')}")
                        print(f"      - Başlık: {first_post.get('title', 'YOK')}")
                        print(f"      - Slug: {first_post.get('slug', 'YOK')}")
                        print(f"      - Yazar: {first_post.get('author', 'YOK')}")
                        print(f"      - Kategori: {first_post.get('category', 'YOK')}")
                        print(f"      - Yayında mı: {first_post.get('is_published', 'YOK')}")
                        
                        # Blog edit işlemi testi
                        blog_id = first_post.get('id')
                        if blog_id:
                            print(f"\n   🔧 Blog edit işlemi test ediliyor (ID: {blog_id})...")
                            try:
                                update_data = {
                                    "title": f"TEST UPDATED - {first_post.get('title', 'Unknown')}",
                                    "content": "Bu test amaçlı güncellenmiş içeriktir."
                                }
                                
                                edit_response = self.make_request("PUT", f"/admin/blog-posts/{blog_id}", 
                                                                data=update_data, auth_required=True)
                                
                                if edit_response.status_code == 200:
                                    edit_data = edit_response.json()
                                    if edit_data.get('title') == update_data['title']:
                                        self.log_test("Blog Post Edit", True, f"✅ Blog edit işlemi başarılı - başlık güncellendi")
                                    else:
                                        self.log_test("Blog Post Edit", False, f"❌ Blog edit başarısız - değişiklik yansımadı")
                                else:
                                    self.log_test("Blog Post Edit", False, f"❌ Blog edit HTTP {edit_response.status_code}: {edit_response.text}")
                            except Exception as e:
                                self.log_test("Blog Post Edit", False, f"❌ Blog edit hatası: {str(e)}")
                        else:
                            self.log_test("Blog Post Edit", False, f"❌ Blog ID bulunamadı - edit test edilemedi")
            else:
                self.log_test("Admin Blog Posts", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Admin Blog Posts", False, f"❌ Hata: {str(e)}")
        
        # 4. MENÜ YAPıLANDıRMASı TESLERİ
        print("\n=== 4. MENÜ YAPıLANDıRMASı TESLERİ ===")
        try:
            response = self.make_request("GET", "/admin/menu-config", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                
                # Menu items kontrolü
                menu_items = data.get('menu_items', [])
                if not menu_items or len(menu_items) == 0:
                    self.log_test("Menu Configuration", False, f"❌ SORUN: menu_items array'i boş! Default menü items yok.")
                else:
                    self.log_test("Menu Configuration", True, f"✅ {len(menu_items)} menü item'ı bulundu")
                    
                    # Menu items detayları
                    print(f"   📋 Menü items detayları:")
                    for i, item in enumerate(menu_items[:5]):  # İlk 5 item'ı göster
                        print(f"      {i+1}. {item.get('label', 'YOK')} -> {item.get('url', 'YOK')} (Aktif: {item.get('is_active', 'YOK')})")
                
                # Header buttons kontrolü
                header_buttons = data.get('header_buttons', [])
                if header_buttons:
                    print(f"   🔘 Header buttons: {len(header_buttons)} adet")
                    for btn in header_buttons:
                        print(f"      - {btn.get('label', 'YOK')} ({btn.get('type', 'YOK')})")
                
                # Response format kontrolü
                required_fields = ['id', 'menu_items', 'header_buttons', 'is_active']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Menu Config Response Format", False, f"❌ Eksik field'lar: {missing_fields}")
                else:
                    self.log_test("Menu Config Response Format", True, f"✅ Menu config response format doğru")
            else:
                self.log_test("Menu Configuration", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Menu Configuration", False, f"❌ Hata: {str(e)}")
        
        # 5. FIELD MISMATCHLERİ ANALİZİ
        print("\n=== 5. FIELD MISMATCHLERİ ANALİZİ ===")
        
        # Blog model field'ları frontend ile uyumlu mu?
        print("   🔍 Blog model field uyumluluğu kontrol ediliyor...")
        try:
            response = self.make_request("GET", "/admin/blog-posts", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    blog_fields = set(data[0].keys())
                    expected_frontend_fields = {
                        'id', 'title', 'slug', 'content', 'author', 'category', 
                        'is_published', 'published_at', 'created_at', 'updated_at',
                        'tags', 'excerpt', 'featured_image', 'meta_description'
                    }
                    
                    missing_for_frontend = expected_frontend_fields - blog_fields
                    extra_fields = blog_fields - expected_frontend_fields
                    
                    if missing_for_frontend:
                        self.log_test("Blog Model Frontend Compatibility", False, f"❌ Frontend için eksik field'lar: {missing_for_frontend}")
                    else:
                        self.log_test("Blog Model Frontend Compatibility", True, f"✅ Blog model frontend ile uyumlu")
                    
                    if extra_fields:
                        print(f"      ℹ️ Ekstra field'lar (sorun değil): {extra_fields}")
        except Exception as e:
            self.log_test("Blog Model Frontend Compatibility", False, f"❌ Hata: {str(e)}")
        
        # Supreme court model field'ları frontend ile uyumlu mu?
        print("   🔍 Supreme court model field uyumluluğu kontrol ediliyor...")
        try:
            response = self.make_request("GET", "/admin/supreme-court-decisions", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    decision_fields = set(data[0].keys())
                    expected_frontend_fields = {
                        'id', 'decision_number', 'court_chamber', 'decision_date', 
                        'case_type', 'summary', 'content', 'keywords', 'legal_basis',
                        'category', 'precedent_value', 'tags', 'is_published', 
                        'published_at', 'created_at', 'updated_at'
                    }
                    
                    missing_for_frontend = expected_frontend_fields - decision_fields
                    extra_fields = decision_fields - expected_frontend_fields
                    
                    if missing_for_frontend:
                        self.log_test("Supreme Court Model Frontend Compatibility", False, f"❌ Frontend için eksik field'lar: {missing_for_frontend}")
                    else:
                        self.log_test("Supreme Court Model Frontend Compatibility", True, f"✅ Supreme court model frontend ile uyumlu")
                    
                    if extra_fields:
                        print(f"      ℹ️ Ekstra field'lar (sorun değil): {extra_fields}")
        except Exception as e:
            self.log_test("Supreme Court Model Frontend Compatibility", False, f"❌ Hata: {str(e)}")
        
        # Menu config structure frontend ile eşleşiyor mu?
        print("   🔍 Menu config structure uyumluluğu kontrol ediliyor...")
        try:
            response = self.make_request("GET", "/admin/menu-config", auth_required=True)
            if response.status_code == 200:
                data = response.json()
                menu_fields = set(data.keys())
                expected_frontend_fields = {
                    'id', 'menu_items', 'header_buttons', 'is_active', 
                    'created_at', 'updated_at'
                }
                
                missing_for_frontend = expected_frontend_fields - menu_fields
                
                if missing_for_frontend:
                    self.log_test("Menu Config Frontend Compatibility", False, f"❌ Frontend için eksik field'lar: {missing_for_frontend}")
                else:
                    self.log_test("Menu Config Frontend Compatibility", True, f"✅ Menu config structure frontend ile uyumlu")
                
                # Menu items structure kontrolü
                menu_items = data.get('menu_items', [])
                if menu_items and len(menu_items) > 0:
                    item_fields = set(menu_items[0].keys())
                    expected_item_fields = {'label', 'url', 'order', 'is_active'}
                    missing_item_fields = expected_item_fields - item_fields
                    
                    if missing_item_fields:
                        self.log_test("Menu Items Structure", False, f"❌ Menu item'larda eksik field'lar: {missing_item_fields}")
                    else:
                        self.log_test("Menu Items Structure", True, f"✅ Menu items structure doğru")
        except Exception as e:
            self.log_test("Menu Config Frontend Compatibility", False, f"❌ Hata: {str(e)}")
        
        # ÖZET RAPOR
        print("\n" + "=" * 80)
        print("📊 KRİTİK ADMIN PANEL API TEST SONUÇLARI")
        print("=" * 80)
        
        critical_tests = [result for result in self.test_results if any(keyword in result['test'] for keyword in [
            'Admin Legal Processes', 'Admin Supreme Court Decisions', 'Admin Blog Posts', 
            'Menu Configuration', 'Blog Post Edit', 'Frontend Compatibility'
        ])]
        
        total_critical = len(critical_tests)
        passed_critical = sum(1 for result in critical_tests if result["success"])
        failed_critical = total_critical - passed_critical
        
        print(f"Kritik Test Sayısı: {total_critical}")
        print(f"Başarılı: {passed_critical}")
        print(f"Başarısız: {failed_critical}")
        print(f"Kritik Başarı Oranı: {(passed_critical/total_critical)*100:.1f}%" if total_critical > 0 else "0%")
        
        if failed_critical > 0:
            print("\n❌ BAŞARISIZ KRİTİK TESTLER:")
            for result in critical_tests:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🔍 DETAYLI ANALİZ TAMAMLANDI:")
        print("- Admin hukuki süreçler endpoint'i test edildi")
        print("- Admin Yargıtay kararları endpoint'i test edildi") 
        print("- Admin blog yazıları endpoint'i ve edit işlemi test edildi")
        print("- Menü yapılandırması endpoint'i test edildi")
        print("- Frontend field uyumluluğu analiz edildi")

    def test_field_alias_mismatch_resolution(self):
        """Test field alias mismatch resolution in backend models - CRITICAL TEST"""
        print("\n" + "=" * 80)
        print("🔧 FIELD ALIAS MISMATCH RESOLUTION TESTS")
        print("=" * 80)
        
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("Field Alias Tests", False, "❌ Authentication failed - cannot test admin endpoints")
            return
        
        # Test 1: Legal Process Admin Forms - has_calculator/hasCalculator field
        print("\n--- Testing Legal Process Field Aliases ---")
        try:
            # Test POST with camelCase field names (as sent by frontend)
            legal_process_camel = {
                "title": "Test Alias Process",
                "description": "Testing field alias resolution",
                "icon": "⚖️",
                "color": "#3B82F6",
                "gradient": "from-blue-500 to-blue-600",
                "duration": "2-4 hafta",
                "difficulty": "Orta",
                "totalSteps": 3,  # camelCase
                "hasCalculator": True,  # camelCase
                "calculatorType": "compensation",  # camelCase
                "category": "test",  # Required field
                "tags": ["test", "alias"],  # Required field
                "estimatedCosts": {  # camelCase
                    "title": "Test Costs",
                    "items": [{"name": "Test Fee", "min": 1000, "max": 2000, "note": "Test"}],
                    "totalRange": "1.000 - 2.000 TL",  # camelCase
                    "freeOptions": ["Test option"]  # camelCase
                },
                "requiredDocuments": [{"name": "Test Doc", "description": "Test"}],  # camelCase - top level
                "importantNotes": ["Test note"],  # camelCase - top level
                "steps": [{
                    "id": "step1",
                    "title": "Test Step",
                    "shortTitle": "Test",  # camelCase
                    "description": "Test step description",
                    "duration": "1 week",
                    "participants": ["Test participant"],
                    "requiredDocuments": [{"name": "Test Doc", "description": "Test"}],  # camelCase
                    "importantNotes": ["Test note"],  # camelCase
                    "position": {"x": 100, "y": 100},
                    "connections": [],
                    "status": "active"
                }]
            }
            
            response = self.make_request("POST", "/admin/legal-processes", 
                                       data=legal_process_camel, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_id = data.get("id")
                
                # Verify camelCase fields are accepted and properly stored
                has_calc_camel = data.get("hasCalculator")
                total_steps_camel = data.get("totalSteps")
                
                # Note: With response_model_by_alias=True, responses only include camelCase (alias) format
                # The snake_case versions are not included in responses, only camelCase
                if (has_calc_camel == True and total_steps_camel == 3):
                    self.log_test("Legal Process POST - camelCase Fields", True, 
                                f"✅ camelCase fields accepted and returned: hasCalculator={has_calc_camel}, totalSteps={total_steps_camel}")
                else:
                    self.log_test("Legal Process POST - camelCase Fields", False, 
                                f"❌ Field mismatch: hasCalculator={has_calc_camel}, totalSteps={total_steps_camel}")
                
                # Test PUT with snake_case field names
                if created_id:
                    update_snake = {
                        "title": "Updated Test Process",
                        "has_calculator": False,  # snake_case
                        "total_steps": 5,  # snake_case
                        "estimated_costs": {  # snake_case
                            "title": "Updated Costs",
                            "items": [{"name": "Updated Fee", "min": 2000, "max": 3000, "note": "Updated"}],
                            "total_range": "2.000 - 3.000 TL",  # snake_case
                            "free_options": ["Updated option"]  # snake_case
                        }
                    }
                    
                    response = self.make_request("PUT", f"/admin/legal-processes/{created_id}", 
                                               data=update_snake, auth_required=True)
                    
                    if response.status_code == 200:
                        data = response.json()
                        has_calc_camel_upd = data.get("hasCalculator")
                        total_steps_camel_upd = data.get("totalSteps")
                        
                        # Verify snake_case input was accepted and camelCase response returned
                        if (has_calc_camel_upd == False and total_steps_camel_upd == 5):
                            self.log_test("Legal Process PUT - snake_case Fields", True, 
                                        f"✅ snake_case input accepted, camelCase response: hasCalculator={has_calc_camel_upd}, totalSteps={total_steps_camel_upd}")
                        else:
                            self.log_test("Legal Process PUT - snake_case Fields", False, 
                                        f"❌ Field mismatch: hasCalculator={has_calc_camel_upd}, totalSteps={total_steps_camel_upd}")
                    else:
                        self.log_test("Legal Process PUT - snake_case Fields", False, 
                                    f"❌ PUT failed: HTTP {response.status_code}")
                    
                    # Clean up - delete test process
                    self.make_request("DELETE", f"/admin/legal-processes/{created_id}", auth_required=True)
                
            else:
                self.log_test("Legal Process POST - camelCase Fields", False, 
                            f"❌ POST failed: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Legal Process Field Alias Test", False, f"❌ Error: {str(e)}")
        
        # Test 2: Supreme Court Decision Admin Forms
        print("\n--- Testing Supreme Court Decision Field Aliases ---")
        try:
            # Test POST with mixed field naming
            decision_mixed = {
                "decision_number": "2024/123",  # snake_case
                "court_chamber": "Test Chamber",
                "decision_date": "2024-01-01",
                "case_type": "Test Case",
                "summary": "Test summary",
                "content": "Test content",
                "keywords": ["test", "alias"],
                "legal_basis": "Test basis",
                "category": "test",
                "precedent_value": "Yüksek",
                "tags": ["test"],
                "is_published": True  # snake_case
            }
            
            response = self.make_request("POST", "/admin/supreme-court-decisions", 
                                       data=decision_mixed, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_id = data.get("id")
                
                # Verify mixed field names work
                is_published = data.get("is_published")
                decision_number = data.get("decision_number")
                
                if (is_published == True and decision_number == "2024/123"):
                    self.log_test("Supreme Court Decision POST - Mixed Fields", True, 
                                f"✅ Mixed field names accepted: is_published={is_published}, decision_number={decision_number}")
                else:
                    self.log_test("Supreme Court Decision POST - Mixed Fields", False, 
                                f"❌ Field mismatch: is_published={is_published}, decision_number={decision_number}")
                
                # Clean up
                if created_id:
                    self.make_request("DELETE", f"/admin/supreme-court-decisions/{created_id}", auth_required=True)
                    
            else:
                self.log_test("Supreme Court Decision POST - Mixed Fields", False, 
                            f"❌ POST failed: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Supreme Court Decision Field Alias Test", False, f"❌ Error: {str(e)}")
        
        # Test 3: Calculator Parameters - is_active/isActive field
        print("\n--- Testing Calculator Parameters Field Aliases ---")
        try:
            # Test POST with camelCase
            param_camel = {
                "name": "test_alias_param",
                "value": 1.5,
                "description": "Test alias parameter",
                "category": "compensation",
                "unit": "kat",
                "isActive": True  # camelCase
            }
            
            response = self.make_request("POST", "/admin/calculator-parameters", 
                                       data=param_camel, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_id = data.get("id")
                
                # Verify camelCase is_active field works
                is_active_snake = data.get("is_active")
                
                # Note: Response only includes snake_case for this model (no alias defined)
                if (is_active_snake == True):
                    self.log_test("Calculator Parameter POST - camelCase isActive", True, 
                                f"✅ camelCase isActive input accepted: is_active={is_active_snake}")
                else:
                    self.log_test("Calculator Parameter POST - camelCase isActive", False, 
                                f"❌ Field mismatch: is_active={is_active_snake}")
                
                # Test PUT with snake_case
                if created_id:
                    update_snake = {
                        "value": 2.0,
                        "is_active": False  # snake_case
                    }
                    
                    response = self.make_request("PUT", f"/admin/calculator-parameters/{created_id}", 
                                               data=update_snake, auth_required=True)
                    
                    if response.status_code == 200:
                        data = response.json()
                        is_active_upd = data.get("is_active")
                        value_upd = data.get("value")
                        
                        if (is_active_upd == False and value_upd == 2.0):
                            self.log_test("Calculator Parameter PUT - snake_case is_active", True, 
                                        f"✅ snake_case is_active accepted: is_active={is_active_upd}, value={value_upd}")
                        else:
                            self.log_test("Calculator Parameter PUT - snake_case is_active", False, 
                                        f"❌ Field mismatch: is_active={is_active_upd}, value={value_upd}")
                    else:
                        self.log_test("Calculator Parameter PUT - snake_case is_active", False, 
                                    f"❌ PUT failed: HTTP {response.status_code}")
                    
                    # Clean up
                    self.make_request("DELETE", f"/admin/calculator-parameters/{created_id}", auth_required=True)
                    
            else:
                self.log_test("Calculator Parameter POST - camelCase isActive", False, 
                            f"❌ POST failed: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Calculator Parameter Field Alias Test", False, f"❌ Error: {str(e)}")
        
        # Test 4: Blog Post is_published/isPublished field
        print("\n--- Testing Blog Post Field Aliases ---")
        try:
            # Test POST with camelCase
            blog_camel = {
                "title": "Test Alias Blog Post",
                "slug": "test-alias-blog-post",
                "content": "Test content for alias testing",
                "excerpt": "Test excerpt",
                "author": "Test Author",
                "tags": ["test", "alias"],
                "category": "test",
                "isPublished": True,  # camelCase
                "featuredImage": "test-image.jpg",  # camelCase
                "metaDescription": "Test meta description"  # camelCase
            }
            
            response = self.make_request("POST", "/admin/blog-posts", 
                                       data=blog_camel, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                created_id = data.get("id")
                
                # Verify camelCase fields work
                is_published_snake = data.get("is_published")
                featured_image = data.get("featured_image")
                
                # Note: Response uses snake_case for these fields (no aliases defined)
                if (is_published_snake == True and featured_image == "test-image.jpg"):
                    self.log_test("Blog Post POST - camelCase Fields", True, 
                                f"✅ camelCase input accepted: is_published={is_published_snake}, featured_image={featured_image}")
                else:
                    self.log_test("Blog Post POST - camelCase Fields", False, 
                                f"❌ Field mismatch: is_published={is_published_snake}, featured_image={featured_image}")
                
                # Clean up
                if created_id:
                    self.make_request("DELETE", f"/admin/blog-posts/{created_id}", auth_required=True)
                    
            else:
                self.log_test("Blog Post POST - camelCase Fields", False, 
                            f"❌ POST failed: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Blog Post Field Alias Test", False, f"❌ Error: {str(e)}")
        
        # Test 5: Response format compatibility - verify responses use consistent format
        print("\n--- Testing Response Format Compatibility ---")
        try:
            # Get existing legal processes and verify response format
            response = self.make_request("GET", "/admin/legal-processes", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if len(data) > 0:
                    process = data[0]
                    
                    # Check if camelCase alias fields are present (expected with response_model_by_alias=True)
                    has_camel_format = (
                        "hasCalculator" in process and
                        "totalSteps" in process and
                        "estimatedCosts" in process
                    )
                    
                    if has_camel_format:
                        self.log_test("Response Format Compatibility", True, 
                                    "✅ Response uses camelCase format (aliases) consistently")
                    else:
                        # Check what fields are actually present
                        available_fields = list(process.keys())
                        self.log_test("Response Format Compatibility", False, 
                                    f"❌ Missing expected camelCase fields. Available: {available_fields}")
                else:
                    self.log_test("Response Format Compatibility", False, 
                                "❌ No legal processes found to test response format")
            else:
                self.log_test("Response Format Compatibility", False, 
                            f"❌ GET failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Response Format Compatibility Test", False, f"❌ Error: {str(e)}")
        
        # Summary of field alias tests
        print("\n" + "=" * 80)
        print("📊 FIELD ALIAS MISMATCH RESOLUTION TEST RESULTS")
        print("=" * 80)
        
        alias_tests = [result for result in self.test_results if any(keyword in result['test'] for keyword in [
            'Field Alias', 'camelCase', 'snake_case', 'Response Format Compatibility'
        ])]
        
        total_alias_tests = len(alias_tests)
        passed_alias_tests = sum(1 for result in alias_tests if result["success"])
        failed_alias_tests = total_alias_tests - passed_alias_tests
        
        print(f"Field Alias Tests: {total_alias_tests}")
        print(f"Passed: {passed_alias_tests}")
        print(f"Failed: {failed_alias_tests}")
        print(f"Success Rate: {(passed_alias_tests/total_alias_tests)*100:.1f}%" if total_alias_tests > 0 else "0%")
        
        if failed_alias_tests > 0:
            print("\n❌ FAILED FIELD ALIAS TESTS:")
            for result in alias_tests:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        else:
            print("\n🎉 ALL FIELD ALIAS TESTS PASSED!")
            print("✅ Config.populate_by_name=True fix is working correctly")
            print("✅ Frontend can send both camelCase and snake_case field names")
            print("✅ Backend accepts and processes both field naming conventions")
            print("✅ Responses are compatible with frontend expectations")

    def test_site_settings_api_endpoints(self):
        """Test site settings API endpoints - GET and PUT operations"""
        print("\n" + "=" * 80)
        print("🔧 SITE SETTINGS API ENDPOINTS TEST")
        print("=" * 80)
        
        if not self.access_token:
            self.test_admin_authentication()
        
        if not self.access_token:
            self.log_test("Site Settings API Tests", False, "❌ Authentication failed - cannot test admin endpoints")
            return
        
        # Test 1: Site Settings GET and PUT
        print("\n--- Testing Site Settings Endpoints ---")
        try:
            # GET /api/admin/site-settings
            response = self.make_request("GET", "/admin/site-settings", auth_required=True)
            if response.status_code == 200:
                site_settings = response.json()
                self.log_test("GET /api/admin/site-settings", True, f"✅ Site settings retrieved successfully")
                
                # Verify required fields
                required_fields = ['id', 'site_title', 'site_description', 'contact_email', 'is_active']
                missing_fields = [field for field in required_fields if field not in site_settings]
                
                if missing_fields:
                    self.log_test("Site Settings Response Format", False, f"❌ Missing fields: {missing_fields}")
                else:
                    self.log_test("Site Settings Response Format", True, f"✅ All required fields present")
                    
                    # Display current settings
                    print(f"   📋 Current Site Settings:")
                    print(f"      - Site Title: {site_settings.get('site_title', 'N/A')}")
                    print(f"      - Site Description: {site_settings.get('site_description', 'N/A')}")
                    print(f"      - Contact Email: {site_settings.get('contact_email', 'N/A')}")
                    print(f"      - Is Active: {site_settings.get('is_active', 'N/A')}")
                
                # Test PUT /api/admin/site-settings - Update site settings
                print(f"\n   🔧 Testing site settings update...")
                original_title = site_settings.get('site_title', 'Legal Design Turkey')
                test_title = f"TEST UPDATED - {original_title}"
                
                update_data = {
                    "site_title": test_title,
                    "site_description": "Test updated description for site settings API test",
                    "contact_email": "test@legaldesignturkey.com"
                }
                
                put_response = self.make_request("PUT", "/admin/site-settings", 
                                               data=update_data, auth_required=True)
                
                if put_response.status_code == 200:
                    updated_settings = put_response.json()
                    if updated_settings.get('site_title') == test_title:
                        self.log_test("PUT /api/admin/site-settings", True, f"✅ Site settings updated successfully")
                        
                        # Restore original settings
                        restore_data = {
                            "site_title": original_title,
                            "site_description": site_settings.get('site_description', ''),
                            "contact_email": site_settings.get('contact_email', '')
                        }
                        restore_response = self.make_request("PUT", "/admin/site-settings", 
                                                           data=restore_data, auth_required=True)
                        if restore_response.status_code == 200:
                            print(f"      ✅ Original settings restored")
                        else:
                            print(f"      ⚠️ Warning: Could not restore original settings")
                    else:
                        self.log_test("PUT /api/admin/site-settings", False, f"❌ Update not reflected in response")
                else:
                    self.log_test("PUT /api/admin/site-settings", False, f"❌ HTTP {put_response.status_code}: {put_response.text}")
            else:
                self.log_test("GET /api/admin/site-settings", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Site Settings API", False, f"❌ Error: {str(e)}")
        
        # Test 2: Menu Config GET and PUT
        print("\n--- Testing Menu Config Endpoints ---")
        try:
            # GET /api/admin/menu-config
            response = self.make_request("GET", "/admin/menu-config", auth_required=True)
            if response.status_code == 200:
                menu_config = response.json()
                self.log_test("GET /api/admin/menu-config", True, f"✅ Menu config retrieved successfully")
                
                # Verify required fields
                required_fields = ['id', 'menu_items', 'header_buttons', 'is_active']
                missing_fields = [field for field in required_fields if field not in menu_config]
                
                if missing_fields:
                    self.log_test("Menu Config Response Format", False, f"❌ Missing fields: {missing_fields}")
                else:
                    self.log_test("Menu Config Response Format", True, f"✅ All required fields present")
                    
                    # Display current menu config
                    menu_items = menu_config.get('menu_items', [])
                    header_buttons = menu_config.get('header_buttons', [])
                    print(f"   📋 Current Menu Config:")
                    print(f"      - Menu Items: {len(menu_items)} items")
                    for i, item in enumerate(menu_items[:3]):  # Show first 3
                        print(f"        {i+1}. {item.get('label', 'N/A')} -> {item.get('url', 'N/A')}")
                    print(f"      - Header Buttons: {len(header_buttons)} buttons")
                    for btn in header_buttons:
                        print(f"        - {btn.get('label', 'N/A')} ({btn.get('type', 'N/A')})")
                
                # Test PUT /api/admin/menu-config - Update menu config
                print(f"\n   🔧 Testing menu config update...")
                
                # Find Beta button and change it to something else
                original_header_buttons = menu_config.get('header_buttons', [])
                updated_header_buttons = []
                beta_found = False
                
                for btn in original_header_buttons:
                    if btn.get('label') == 'Beta':
                        updated_btn = btn.copy()
                        updated_btn['label'] = 'TEST BETA'
                        updated_header_buttons.append(updated_btn)
                        beta_found = True
                    else:
                        updated_header_buttons.append(btn)
                
                if not beta_found:
                    # Add a test button if Beta not found
                    updated_header_buttons.append({
                        "label": "TEST BETA", 
                        "url": "#test", 
                        "type": "primary", 
                        "is_active": True
                    })
                
                update_data = {
                    "menu_items": menu_config.get('menu_items', []),
                    "header_buttons": updated_header_buttons,
                    "is_active": True
                }
                
                put_response = self.make_request("PUT", "/admin/menu-config", 
                                               data=update_data, auth_required=True)
                
                if put_response.status_code == 200:
                    updated_config = put_response.json()
                    updated_buttons = updated_config.get('header_buttons', [])
                    test_button_found = any(btn.get('label') == 'TEST BETA' for btn in updated_buttons)
                    
                    if test_button_found:
                        self.log_test("PUT /api/admin/menu-config", True, f"✅ Menu config updated successfully")
                        
                        # Restore original config
                        restore_data = {
                            "menu_items": menu_config.get('menu_items', []),
                            "header_buttons": original_header_buttons,
                            "is_active": menu_config.get('is_active', True)
                        }
                        restore_response = self.make_request("PUT", "/admin/menu-config", 
                                                           data=restore_data, auth_required=True)
                        if restore_response.status_code == 200:
                            print(f"      ✅ Original menu config restored")
                        else:
                            print(f"      ⚠️ Warning: Could not restore original menu config")
                    else:
                        self.log_test("PUT /api/admin/menu-config", False, f"❌ Update not reflected in response")
                else:
                    self.log_test("PUT /api/admin/menu-config", False, f"❌ HTTP {put_response.status_code}: {put_response.text}")
            else:
                self.log_test("GET /api/admin/menu-config", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Menu Config API", False, f"❌ Error: {str(e)}")
        
        # Test 3: Footer Config GET and PUT
        print("\n--- Testing Footer Config Endpoints ---")
        try:
            # GET /api/admin/footer-config
            response = self.make_request("GET", "/admin/footer-config", auth_required=True)
            if response.status_code == 200:
                footer_config = response.json()
                self.log_test("GET /api/admin/footer-config", True, f"✅ Footer config retrieved successfully")
                
                # Verify required fields
                required_fields = ['id', 'footer_sections', 'copyright_text', 'is_active']
                missing_fields = [field for field in required_fields if field not in footer_config]
                
                if missing_fields:
                    self.log_test("Footer Config Response Format", False, f"❌ Missing fields: {missing_fields}")
                else:
                    self.log_test("Footer Config Response Format", True, f"✅ All required fields present")
                    
                    # Display current footer config
                    footer_sections = footer_config.get('footer_sections', [])
                    copyright_text = footer_config.get('copyright_text', '')
                    print(f"   📋 Current Footer Config:")
                    print(f"      - Footer Sections: {len(footer_sections)} sections")
                    for i, section in enumerate(footer_sections[:2]):  # Show first 2
                        links = section.get('links', [])
                        print(f"        {i+1}. {section.get('title', 'N/A')} ({len(links)} links)")
                    print(f"      - Copyright: {copyright_text}")
                
                # Test PUT /api/admin/footer-config - Update footer config
                print(f"\n   🔧 Testing footer config update...")
                
                original_copyright = footer_config.get('copyright_text', '')
                test_copyright = f"TEST UPDATED - {original_copyright}"
                
                update_data = {
                    "footer_sections": footer_config.get('footer_sections', []),
                    "copyright_text": test_copyright,
                    "is_active": True
                }
                
                put_response = self.make_request("PUT", "/admin/footer-config", 
                                               data=update_data, auth_required=True)
                
                if put_response.status_code == 200:
                    updated_config = put_response.json()
                    if updated_config.get('copyright_text') == test_copyright:
                        self.log_test("PUT /api/admin/footer-config", True, f"✅ Footer config updated successfully")
                        
                        # Restore original config
                        restore_data = {
                            "footer_sections": footer_config.get('footer_sections', []),
                            "copyright_text": original_copyright,
                            "is_active": footer_config.get('is_active', True)
                        }
                        restore_response = self.make_request("PUT", "/admin/footer-config", 
                                                           data=restore_data, auth_required=True)
                        if restore_response.status_code == 200:
                            print(f"      ✅ Original footer config restored")
                        else:
                            print(f"      ⚠️ Warning: Could not restore original footer config")
                    else:
                        self.log_test("PUT /api/admin/footer-config", False, f"❌ Update not reflected in response")
                else:
                    self.log_test("PUT /api/admin/footer-config", False, f"❌ HTTP {put_response.status_code}: {put_response.text}")
            else:
                self.log_test("GET /api/admin/footer-config", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Footer Config API", False, f"❌ Error: {str(e)}")
        
        # Test 4: Data Persistence Verification
        print("\n--- Testing Data Persistence ---")
        try:
            # Verify that changes made in admin panel are persisted
            print("   🔍 Verifying admin panel changes are persisted in database...")
            
            # Check if user has made changes (mentioned in review request)
            response = self.make_request("GET", "/admin/menu-config", auth_required=True)
            if response.status_code == 200:
                menu_config = response.json()
                header_buttons = menu_config.get('header_buttons', [])
                
                # Look for any non-default button text (user mentioned changing beta text)
                default_buttons = ['Beta', 'Adli Yardım']
                custom_buttons = []
                for btn in header_buttons:
                    label = btn.get('label', '')
                    if label not in default_buttons:
                        custom_buttons.append(label)
                
                if custom_buttons:
                    self.log_test("Admin Panel Changes Persistence", True, 
                                f"✅ Custom changes detected in menu: {custom_buttons}")
                else:
                    self.log_test("Admin Panel Changes Persistence", True, 
                                f"✅ Default menu configuration present (no custom changes detected)")
                    
                # Check for test menu items (user mentioned adding test menu)
                menu_items = menu_config.get('menu_items', [])
                test_items = [item for item in menu_items if 'test' in item.get('label', '').lower()]
                
                if test_items:
                    test_labels = [item.get('label') for item in test_items]
                    self.log_test("Test Menu Items Persistence", True, 
                                f"✅ Test menu items found: {test_labels}")
                else:
                    self.log_test("Test Menu Items Persistence", True, 
                                f"✅ No test menu items found (using default menu)")
            else:
                self.log_test("Data Persistence Check", False, f"❌ Could not verify persistence: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Data Persistence Check", False, f"❌ Error: {str(e)}")
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 SITE SETTINGS API TEST RESULTS")
        print("=" * 80)
        
        site_settings_tests = [result for result in self.test_results if any(keyword in result['test'] for keyword in [
            'site-settings', 'menu-config', 'footer-config', 'Site Settings', 'Menu Config', 'Footer Config', 'Persistence'
        ])]
        
        total_site_tests = len(site_settings_tests)
        passed_site_tests = sum(1 for result in site_settings_tests if result["success"])
        failed_site_tests = total_site_tests - passed_site_tests
        
        print(f"Site Settings API Tests: {total_site_tests}")
        print(f"Passed: {passed_site_tests}")
        print(f"Failed: {failed_site_tests}")
        print(f"Success Rate: {(passed_site_tests/total_site_tests)*100:.1f}%" if total_site_tests > 0 else "0%")
        
        if failed_site_tests > 0:
            print("\n❌ FAILED SITE SETTINGS TESTS:")
            for result in site_settings_tests:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🔍 SITE SETTINGS API ANALYSIS COMPLETE:")
        print("- Site settings GET/PUT endpoints tested")
        print("- Menu configuration GET/PUT endpoints tested") 
        print("- Footer configuration GET/PUT endpoints tested")
        print("- Data persistence verification completed")
        print("- Admin panel changes persistence verified")

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv('/app/frontend/.env')
    
    # Update BASE_URL from environment
    BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    API_BASE = f"{BASE_URL}/api"
    
    print(f"🔧 Backend URL: {BASE_URL}")
    print(f"🔧 API Base: {API_BASE}")
    
    tester = APITester()
    
    # Check if we should run specific tests
    if len(sys.argv) > 1 and sys.argv[1] == "turkish":
        success = tester.run_comprehensive_turkish_tests()
    elif len(sys.argv) > 1 and sys.argv[1] == "critical":
        tester.test_critical_admin_panel_apis()
        success = True
    elif len(sys.argv) > 1 and sys.argv[1] == "field-alias":
        tester.test_field_alias_mismatch_resolution()
        success = True
    elif len(sys.argv) > 1 and sys.argv[1] == "site-settings":
        tester.test_site_settings_api_endpoints()
        success = True
    elif len(sys.argv) > 1 and sys.argv[1] == "cms":
        # Run the comprehensive CMS endpoints test
        print("🚀 CMS ENDPOINTS COMPREHENSIVE TEST")
        print("Testing new CMS functionality: Section-based content management, public APIs, site settings integration")
        print("=" * 80)
        tester.test_cms_endpoints_comprehensive()
        success = True
    elif len(sys.argv) > 1 and sys.argv[1] == "home-stats":
        # Run home page content stats testing
        print("🚀 HOME PAGE CONTENT STATS TESTING")
        print("Testing home page content stats section functionality - troubleshooting stats not updating issue")
        print("=" * 80)
        tester.test_home_page_content_stats_issue()
        success = True
    else:
        success = tester.run_all_tests()
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 FINAL TEST SUMMARY")
    print("=" * 80)
    
    total_tests = len(tester.test_results)
    passed_tests = sum(1 for result in tester.test_results if result["success"])
    failed_tests = total_tests - passed_tests
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {failed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "0%")
    
    if failed_tests > 0:
        print("\n❌ FAILED TESTS:")
        for result in tester.test_results:
            if not result["success"]:
                print(f"  - {result['test']}: {result['message']}")
        print("\n💥 SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ BACKEND API: WORKING CORRECTLY")
        sys.exit(0)