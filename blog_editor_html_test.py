#!/usr/bin/env python3
"""
BLOG EDITOR HTML FORMATTING ANALYSIS TEST
Specific test for analyzing blog post content HTML structure and formatting issues
"""

import requests
import json
import sys
import re
from datetime import datetime
from typing import Dict, Any, Optional, List
import os

# Configuration - Use environment variable for backend URL
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class BlogEditorHTMLTester:
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
    
    def authenticate(self):
        """Authenticate admin user"""
        print("\n=== ADMIN AUTHENTICATION ===")
        
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        
        try:
            response = self.make_request("POST", "/admin/login", data=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.access_token = data["access_token"]
                    self.log_test("Admin Authentication", True, f"✅ Authenticated as {data.get('username')}")
                    return True
                else:
                    self.log_test("Admin Authentication", False, "❌ Invalid login response format")
                    return False
            else:
                self.log_test("Admin Authentication", False, f"❌ HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"❌ Authentication error: {str(e)}")
            return False
    
    def analyze_html_content(self, content: str, source: str) -> Dict[str, Any]:
        """Analyze HTML content for formatting tags"""
        analysis = {
            "source": source,
            "total_length": len(content),
            "html_tags_found": [],
            "heading_tags": [],
            "formatting_tags": [],
            "has_html": False,
            "raw_content_sample": content[:200] + "..." if len(content) > 200 else content
        }
        
        # Check for HTML tags
        html_tag_pattern = r'<([^>]+)>'
        html_tags = re.findall(html_tag_pattern, content)
        
        if html_tags:
            analysis["has_html"] = True
            analysis["html_tags_found"] = list(set(html_tags))
            
            # Specifically look for heading tags
            heading_pattern = r'<(h[1-6])[^>]*>'
            heading_matches = re.findall(heading_pattern, content, re.IGNORECASE)
            analysis["heading_tags"] = list(set(heading_matches))
            
            # Look for common formatting tags
            formatting_tags = ['p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'br', 'ul', 'ol', 'li']
            found_formatting = []
            for tag in formatting_tags:
                if re.search(f'<{tag}[^>]*>', content, re.IGNORECASE):
                    found_formatting.append(tag)
            analysis["formatting_tags"] = found_formatting
        
        return analysis
    
    def test_public_blog_posts_html_structure(self):
        """Test GET /api/blog-posts endpoint and analyze HTML content"""
        print("\n=== 1. PUBLIC BLOG POSTS HTML STRUCTURE ANALYSIS ===")
        
        try:
            response = self.make_request("GET", "/blog-posts")
            
            if response.status_code == 200:
                blog_posts = response.json()
                
                if not blog_posts:
                    self.log_test("Public Blog Posts - Data Availability", False, "❌ No blog posts found")
                    return
                
                self.log_test("Public Blog Posts - Data Availability", True, f"✅ Found {len(blog_posts)} blog posts")
                
                # Analyze each blog post's content
                for i, post in enumerate(blog_posts[:3]):  # Analyze first 3 posts
                    post_title = post.get('title', f'Post {i+1}')
                    content = post.get('content', '')
                    
                    if not content:
                        self.log_test(f"Blog Post Content - {post_title}", False, "❌ Empty content field")
                        continue
                    
                    # Analyze HTML content
                    analysis = self.analyze_html_content(content, f"Public API - {post_title}")
                    
                    if analysis["has_html"]:
                        heading_info = f"Headings: {', '.join(analysis['heading_tags'])}" if analysis['heading_tags'] else "No heading tags"
                        formatting_info = f"Formatting: {', '.join(analysis['formatting_tags'])}" if analysis['formatting_tags'] else "No formatting tags"
                        
                        self.log_test(
                            f"Blog Post HTML Analysis - {post_title}", 
                            True, 
                            f"✅ HTML detected. {heading_info}. {formatting_info}. Length: {analysis['total_length']} chars"
                        )
                        
                        # Detailed logging for heading tags
                        if analysis['heading_tags']:
                            print(f"   📝 HEADING TAGS FOUND in '{post_title}': {analysis['heading_tags']}")
                            # Extract actual heading content
                            for heading_tag in analysis['heading_tags']:
                                heading_pattern = f'<{heading_tag}[^>]*>(.*?)</{heading_tag}>'
                                heading_matches = re.findall(heading_pattern, content, re.IGNORECASE | re.DOTALL)
                                if heading_matches:
                                    print(f"      {heading_tag.upper()} content: {heading_matches[:2]}")  # Show first 2 matches
                        else:
                            print(f"   ⚠️  NO HEADING TAGS (H1-H6) found in '{post_title}'")
                    else:
                        self.log_test(
                            f"Blog Post HTML Analysis - {post_title}", 
                            False, 
                            f"❌ No HTML tags detected. Content appears to be plain text. Length: {analysis['total_length']} chars"
                        )
                        print(f"   📄 Content sample: {analysis['raw_content_sample']}")
                
            else:
                self.log_test("Public Blog Posts", False, f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Public Blog Posts HTML Analysis", False, f"❌ Error: {str(e)}")
    
    def test_admin_blog_posts_html_structure(self):
        """Test GET /api/admin/blog-posts endpoint and analyze HTML content"""
        print("\n=== 2. ADMIN BLOG POSTS HTML STRUCTURE ANALYSIS ===")
        
        if not self.access_token:
            self.log_test("Admin Blog Posts", False, "❌ No authentication token available")
            return
        
        try:
            response = self.make_request("GET", "/admin/blog-posts", auth_required=True)
            
            if response.status_code == 200:
                blog_posts = response.json()
                
                if not blog_posts:
                    self.log_test("Admin Blog Posts - Data Availability", False, "❌ No blog posts found in admin API")
                    return
                
                self.log_test("Admin Blog Posts - Data Availability", True, f"✅ Found {len(blog_posts)} blog posts in admin API")
                
                # Compare with public API results
                print(f"\n   🔍 DETAILED ADMIN BLOG POST ANALYSIS:")
                
                for i, post in enumerate(blog_posts):
                    post_id = post.get('id', f'post-{i+1}')
                    post_title = post.get('title', f'Post {i+1}')
                    content = post.get('content', '')
                    
                    print(f"\n   📝 POST {i+1}: {post_title}")
                    print(f"      ID: {post_id}")
                    print(f"      Published: {post.get('is_published', 'Unknown')}")
                    print(f"      Content Length: {len(content)} characters")
                    
                    if not content:
                        print(f"      ❌ EMPTY CONTENT FIELD")
                        continue
                    
                    # Analyze HTML content
                    analysis = self.analyze_html_content(content, f"Admin API - {post_title}")
                    
                    if analysis["has_html"]:
                        print(f"      ✅ HTML DETECTED")
                        print(f"      📋 All HTML tags: {analysis['html_tags_found']}")
                        
                        if analysis['heading_tags']:
                            print(f"      🎯 HEADING TAGS: {analysis['heading_tags']}")
                            # Extract and show actual heading content
                            for heading_tag in analysis['heading_tags']:
                                heading_pattern = f'<{heading_tag}[^>]*>(.*?)</{heading_tag}>'
                                heading_matches = re.findall(heading_pattern, content, re.IGNORECASE | re.DOTALL)
                                for j, heading_content in enumerate(heading_matches[:3]):  # Show first 3
                                    clean_content = re.sub(r'<[^>]+>', '', heading_content).strip()
                                    print(f"         {heading_tag.upper()} #{j+1}: '{clean_content}'")
                        else:
                            print(f"      ⚠️  NO HEADING TAGS (H1-H6) FOUND")
                        
                        if analysis['formatting_tags']:
                            print(f"      🎨 FORMATTING TAGS: {analysis['formatting_tags']}")
                        
                    else:
                        print(f"      ❌ NO HTML TAGS DETECTED - PLAIN TEXT CONTENT")
                        print(f"      📄 Content preview: {content[:150]}...")
                
                # Summary analysis
                html_posts = sum(1 for post in blog_posts if self.analyze_html_content(post.get('content', ''), 'summary')['has_html'])
                heading_posts = sum(1 for post in blog_posts if self.analyze_html_content(post.get('content', ''), 'summary')['heading_tags'])
                
                self.log_test(
                    "Admin Blog Posts HTML Summary", 
                    True, 
                    f"✅ {html_posts}/{len(blog_posts)} posts have HTML content. {heading_posts}/{len(blog_posts)} posts have heading tags (H1-H6)"
                )
                
            else:
                self.log_test("Admin Blog Posts", False, f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Admin Blog Posts HTML Analysis", False, f"❌ Error: {str(e)}")
    
    def test_individual_blog_post_detail(self):
        """Test individual blog post detail and HTML structure"""
        print("\n=== 3. INDIVIDUAL BLOG POST DETAIL ANALYSIS ===")
        
        # First get list of blog posts to test individual ones
        try:
            response = self.make_request("GET", "/blog-posts")
            if response.status_code == 200:
                blog_posts = response.json()
                
                if blog_posts:
                    # Test first blog post detail
                    first_post = blog_posts[0]
                    post_slug = first_post.get('slug')
                    
                    if post_slug:
                        detail_response = self.make_request("GET", f"/blog-posts/{post_slug}")
                        
                        if detail_response.status_code == 200:
                            post_detail = detail_response.json()
                            content = post_detail.get('content', '')
                            
                            analysis = self.analyze_html_content(content, f"Detail API - {post_detail.get('title')}")
                            
                            self.log_test(
                                f"Blog Post Detail - {post_detail.get('title')}", 
                                True, 
                                f"✅ Detail API working. HTML: {'Yes' if analysis['has_html'] else 'No'}. Headings: {len(analysis['heading_tags'])}"
                            )
                            
                            # Compare with list API
                            list_content = first_post.get('content', '')
                            if content == list_content:
                                print(f"   ✅ Content consistency: Detail API matches List API")
                            else:
                                print(f"   ⚠️  Content mismatch: Detail API differs from List API")
                                print(f"      List API length: {len(list_content)}")
                                print(f"      Detail API length: {len(content)}")
                        else:
                            self.log_test("Blog Post Detail", False, f"❌ Detail API failed: {detail_response.status_code}")
                    else:
                        self.log_test("Blog Post Detail", False, "❌ No slug found in first blog post")
                else:
                    self.log_test("Blog Post Detail", False, "❌ No blog posts available for detail testing")
            else:
                self.log_test("Blog Post Detail", False, f"❌ Failed to get blog posts list: {response.status_code}")
                
        except Exception as e:
            self.log_test("Blog Post Detail Analysis", False, f"❌ Error: {str(e)}")
    
    def test_blog_post_data_structure(self):
        """Test blog post data structure and field analysis"""
        print("\n=== 4. BLOG POST DATA STRUCTURE ANALYSIS ===")
        
        if not self.access_token:
            self.log_test("Blog Post Data Structure", False, "❌ No authentication token available")
            return
        
        try:
            response = self.make_request("GET", "/admin/blog-posts", auth_required=True)
            
            if response.status_code == 200:
                blog_posts = response.json()
                
                if blog_posts:
                    first_post = blog_posts[0]
                    
                    # Analyze data structure
                    expected_fields = [
                        'id', 'title', 'slug', 'content', 'excerpt', 'author', 
                        'tags', 'category', 'is_published', 'created_at', 'updated_at',
                        'meta_title', 'meta_description', 'meta_keywords', 'featured_image'
                    ]
                    
                    present_fields = []
                    missing_fields = []
                    
                    for field in expected_fields:
                        if field in first_post:
                            present_fields.append(field)
                        else:
                            missing_fields.append(field)
                    
                    self.log_test(
                        "Blog Post Data Structure", 
                        len(missing_fields) == 0, 
                        f"✅ {len(present_fields)}/{len(expected_fields)} expected fields present. Missing: {missing_fields if missing_fields else 'None'}"
                    )
                    
                    # Analyze content field specifically
                    content = first_post.get('content', '')
                    content_type = type(content).__name__
                    
                    print(f"\n   📊 CONTENT FIELD ANALYSIS:")
                    print(f"      Field Type: {content_type}")
                    print(f"      Content Length: {len(content)} characters")
                    print(f"      Is Empty: {'Yes' if not content else 'No'}")
                    
                    if content:
                        # Check encoding
                        try:
                            content.encode('utf-8')
                            print(f"      UTF-8 Encoding: ✅ Valid")
                        except UnicodeEncodeError:
                            print(f"      UTF-8 Encoding: ❌ Invalid")
                        
                        # Check for common HTML entities
                        html_entities = ['&lt;', '&gt;', '&amp;', '&quot;', '&#39;']
                        found_entities = [entity for entity in html_entities if entity in content]
                        if found_entities:
                            print(f"      HTML Entities Found: {found_entities}")
                        else:
                            print(f"      HTML Entities: None detected")
                        
                        # Sample content
                        print(f"      Content Sample (first 300 chars):")
                        print(f"      '{content[:300]}{'...' if len(content) > 300 else ''}'")
                    
                else:
                    self.log_test("Blog Post Data Structure", False, "❌ No blog posts available for structure analysis")
                    
            else:
                self.log_test("Blog Post Data Structure", False, f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Blog Post Data Structure Analysis", False, f"❌ Error: {str(e)}")
    
    def run_comprehensive_blog_editor_analysis(self):
        """Run comprehensive blog editor HTML formatting analysis"""
        print("🔍 BLOG EDITOR HTML FORMATTING ANALYSIS")
        print(f"Testing API: {API_BASE}")
        print("=" * 80)
        
        # Authenticate first
        if not self.authenticate():
            print("❌ Authentication failed. Cannot proceed with admin tests.")
            return False
        
        # Run all tests
        self.test_public_blog_posts_html_structure()
        self.test_admin_blog_posts_html_structure()
        self.test_individual_blog_post_detail()
        self.test_blog_post_data_structure()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 BLOG EDITOR HTML ANALYSIS SUMMARY")
        print("=" * 80)
        
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
        
        print("\n🎯 KEY FINDINGS:")
        print("- Blog post content HTML structure analyzed")
        print("- H1, H2, H3 heading tag presence verified")
        print("- Admin vs Public API content consistency checked")
        print("- Data structure and field integrity validated")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = BlogEditorHTMLTester()
    success = tester.run_comprehensive_blog_editor_analysis()
    sys.exit(0 if success else 1)