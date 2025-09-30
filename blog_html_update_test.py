#!/usr/bin/env python3
"""
BLOG HTML UPDATE TEST
Test updating a blog post with HTML content to see how it's stored and retrieved
"""

import requests
import json
import sys
import re
from datetime import datetime
from typing import Dict, Any, Optional, List
import os

# Configuration
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class BlogHTMLUpdateTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, auth_required: bool = False) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{API_BASE}{endpoint}"
        
        request_headers = headers or {}
        if auth_required and self.access_token:
            request_headers["Authorization"] = f"Bearer {self.access_token}"
        
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
        print("🔐 Authenticating...")
        
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
                    print(f"✅ Authenticated as {data.get('username')}")
                    return True
                else:
                    print("❌ Invalid login response format")
                    return False
            else:
                print(f"❌ HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Authentication error: {str(e)}")
            return False
    
    def test_html_content_update(self):
        """Test updating a blog post with rich HTML content"""
        print("\n🧪 TESTING HTML CONTENT UPDATE")
        print("=" * 50)
        
        # First, get existing blog posts
        response = self.make_request("GET", "/admin/blog-posts", auth_required=True)
        
        if response.status_code != 200:
            print(f"❌ Failed to get blog posts: {response.status_code}")
            return
        
        blog_posts = response.json()
        if not blog_posts:
            print("❌ No blog posts found")
            return
        
        # Use the first blog post for testing
        test_post = blog_posts[0]
        post_id = test_post['id']
        original_title = test_post['title']
        
        print(f"📝 Testing with post: {original_title}")
        print(f"   Post ID: {post_id}")
        
        # Create rich HTML content with various heading levels
        rich_html_content = """
<h1>Ana Başlık - H1 Etiketi</h1>
<p>Bu bir paragraf metnidir. Blog editöründe H1, H2, H3 formatlamaları test ediliyor.</p>

<h2>İkinci Seviye Başlık - H2 Etiketi</h2>
<p>Bu bölümde <strong>kalın metin</strong> ve <em>italik metin</em> örnekleri bulunmaktadır.</p>

<h3>Üçüncü Seviye Başlık - H3 Etiketi</h3>
<ul>
    <li>Liste öğesi 1</li>
    <li>Liste öğesi 2 - <a href="#">bağlantı örneği</a></li>
    <li>Liste öğesi 3</li>
</ul>

<h4>Dördüncü Seviye Başlık - H4 Etiketi</h4>
<p>Bu paragrafta <code>kod örneği</code> ve <mark>vurgulanan metin</mark> bulunmaktadır.</p>

<h5>Beşinci Seviye Başlık - H5 Etiketi</h5>
<blockquote>
    <p>Bu bir alıntı örneğidir. Blog editöründe HTML formatlamanın nasıl çalıştığını test ediyoruz.</p>
</blockquote>

<h6>Altıncı Seviye Başlık - H6 Etiketi</h6>
<p>Son paragraf. Tüm HTML etiketlerinin doğru şekilde saklandığını ve görüntülendiğini kontrol ediyoruz.</p>
        """.strip()
        
        # Update the blog post with rich HTML content
        update_data = {
            "content": rich_html_content,
            "title": f"HTML TEST - {original_title}"
        }
        
        print(f"\n📤 Updating blog post with rich HTML content...")
        print(f"   Content length: {len(rich_html_content)} characters")
        print(f"   HTML tags included: H1, H2, H3, H4, H5, H6, P, UL, LI, STRONG, EM, CODE, MARK, BLOCKQUOTE, A")
        
        update_response = self.make_request("PUT", f"/admin/blog-posts/{post_id}", data=update_data, auth_required=True)
        
        if update_response.status_code == 200:
            print("✅ Blog post updated successfully")
            
            # Verify the update by fetching the post again
            print("\n📥 Fetching updated post to verify HTML content...")
            
            verify_response = self.make_request("GET", f"/admin/blog-posts", auth_required=True)
            if verify_response.status_code == 200:
                updated_posts = verify_response.json()
                updated_post = next((p for p in updated_posts if p['id'] == post_id), None)
                
                if updated_post:
                    stored_content = updated_post['content']
                    
                    print(f"\n📊 VERIFICATION RESULTS:")
                    print(f"   Stored content length: {len(stored_content)} characters")
                    print(f"   Original content length: {len(rich_html_content)} characters")
                    print(f"   Content match: {'✅ Yes' if stored_content == rich_html_content else '❌ No'}")
                    
                    # Analyze HTML tags in stored content
                    html_tag_pattern = r'<([^>]+)>'
                    stored_tags = re.findall(html_tag_pattern, stored_content)
                    original_tags = re.findall(html_tag_pattern, rich_html_content)
                    
                    print(f"   Original HTML tags count: {len(original_tags)}")
                    print(f"   Stored HTML tags count: {len(stored_tags)}")
                    
                    # Check for specific heading tags
                    heading_pattern = r'<(h[1-6])[^>]*>'
                    stored_headings = re.findall(heading_pattern, stored_content, re.IGNORECASE)
                    original_headings = re.findall(heading_pattern, rich_html_content, re.IGNORECASE)
                    
                    print(f"   Original heading tags: {original_headings}")
                    print(f"   Stored heading tags: {stored_headings}")
                    
                    if stored_headings == original_headings:
                        print("   ✅ All heading tags preserved correctly")
                    else:
                        print("   ❌ Heading tags were modified or lost")
                    
                    # Show first 200 characters of stored content
                    print(f"\n📄 STORED CONTENT PREVIEW:")
                    print(f"   '{stored_content[:200]}{'...' if len(stored_content) > 200 else ''}'")
                    
                    # Test public API as well
                    print(f"\n🌐 Testing public API consistency...")
                    public_response = self.make_request("GET", "/blog-posts")
                    if public_response.status_code == 200:
                        public_posts = public_response.json()
                        public_post = next((p for p in public_posts if p['id'] == post_id), None)
                        
                        if public_post:
                            public_content = public_post['content']
                            print(f"   Public API content length: {len(public_content)} characters")
                            print(f"   Admin/Public consistency: {'✅ Yes' if public_content == stored_content else '❌ No'}")
                            
                            if public_content != stored_content:
                                print(f"   ⚠️  Content differs between admin and public APIs")
                                print(f"   Public content preview: '{public_content[:200]}...'")
                        else:
                            print("   ❌ Post not found in public API")
                    else:
                        print(f"   ❌ Public API request failed: {public_response.status_code}")
                    
                else:
                    print("❌ Updated post not found in verification")
            else:
                print(f"❌ Verification request failed: {verify_response.status_code}")
        else:
            print(f"❌ Update failed: {update_response.status_code}")
            print(f"   Response: {update_response.text}")
    
    def run_test(self):
        """Run the HTML update test"""
        print("🔍 BLOG HTML CONTENT UPDATE TEST")
        print(f"Testing API: {API_BASE}")
        print("=" * 80)
        
        if not self.authenticate():
            print("❌ Authentication failed. Cannot proceed.")
            return False
        
        self.test_html_content_update()
        
        print("\n" + "=" * 80)
        print("✅ HTML UPDATE TEST COMPLETED")
        print("=" * 80)
        
        return True

if __name__ == "__main__":
    tester = BlogHTMLUpdateTester()
    success = tester.run_test()
    sys.exit(0 if success else 1)