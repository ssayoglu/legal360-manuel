#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Legal Design Turkey Admin Panel
Tests all admin and public API endpoints with authentication
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://b29c9c3b-1354-4bd8-8179-b55b03ffc23f.preview.emergentagent.com"
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
    
    def test_basic_health_check(self):
        """Test basic API health check"""
        print("\n=== BASIC API HEALTH CHECK ===")
        
        try:
            # Test root endpoint
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("API Root Endpoint", True, f"API is running: {data['message']}")
                else:
                    self.log_test("API Root Endpoint", False, "Invalid response format")
            else:
                self.log_test("API Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Connection error: {str(e)}")
    
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

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n💥 Some tests failed!")
        sys.exit(1)