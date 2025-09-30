#!/usr/bin/env python3
"""
Focused test for Legal Process Detail API endpoint
Tests the specific endpoint used by ProcessFlowWithHeader.jsx
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://legalcms.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_process_detail_endpoint():
    """Test the legal process detail endpoint specifically for ProcessFlowWithHeader.jsx compatibility"""
    
    print("🔍 Testing Legal Process Detail API Endpoint")
    print(f"API Base: {API_BASE}")
    print("=" * 60)
    
    # First, get list of available processes
    try:
        response = requests.get(f"{API_BASE}/legal-processes", timeout=30)
        if response.status_code != 200:
            print(f"❌ Failed to get process list: HTTP {response.status_code}")
            return False
        
        processes = response.json()
        print(f"✅ Found {len(processes)} legal processes")
        
        if not processes:
            print("❌ No processes available to test")
            return False
        
        # Test each process detail endpoint
        all_passed = True
        
        for i, process in enumerate(processes[:3]):  # Test first 3 processes
            process_id = process.get('id')
            process_title = process.get('title', 'Unknown')
            
            print(f"\n--- Testing Process {i+1}: {process_title} (ID: {process_id}) ---")
            
            if not process_id:
                print(f"❌ Process has no ID field")
                all_passed = False
                continue
            
            # Test individual process detail
            try:
                detail_response = requests.get(f"{API_BASE}/legal-processes/{process_id}", timeout=30)
                
                if detail_response.status_code == 200:
                    process_detail = detail_response.json()
                    
                    # Check ProcessFlowWithHeader.jsx required fields
                    required_fields = {
                        'id': 'Process ID',
                        'title': 'Process title',
                        'description': 'Process description', 
                        'icon': 'Icon for display',
                        'gradient': 'CSS gradient class',
                        'duration': 'Estimated duration',
                        'difficulty': 'Difficulty level',
                        'steps': 'Process steps array',
                        'has_calculator': 'Calculator availability flag',
                        'category': 'Process category'
                    }
                    
                    missing_fields = []
                    for field, description in required_fields.items():
                        if field not in process_detail:
                            missing_fields.append(f"{field} ({description})")
                    
                    if missing_fields:
                        print(f"❌ Missing required fields:")
                        for field in missing_fields:
                            print(f"   - {field}")
                        all_passed = False
                    else:
                        print(f"✅ All required fields present")
                        
                        # Validate steps structure
                        steps = process_detail.get('steps', [])
                        if isinstance(steps, list) and len(steps) > 0:
                            print(f"✅ Process has {len(steps)} steps")
                            
                            # Check first step structure
                            first_step = steps[0]
                            step_fields = {
                                'id': 'Step ID',
                                'title': 'Step title',
                                'short_title': 'Short title for display',
                                'description': 'Step description',
                                'duration': 'Step duration',
                                'participants': 'Required participants',
                                'required_documents': 'Required documents',
                                'important_notes': 'Important notes'
                            }
                            
                            missing_step_fields = []
                            for field, description in step_fields.items():
                                if field not in first_step:
                                    missing_step_fields.append(f"{field} ({description})")
                            
                            if missing_step_fields:
                                print(f"❌ First step missing fields:")
                                for field in missing_step_fields:
                                    print(f"   - {field}")
                                all_passed = False
                            else:
                                print(f"✅ Step structure is valid")
                                
                                # Check data types
                                if isinstance(first_step.get('participants'), list):
                                    print(f"✅ Participants is array: {first_step['participants']}")
                                else:
                                    print(f"❌ Participants should be array, got: {type(first_step.get('participants'))}")
                                    all_passed = False
                                
                                if isinstance(first_step.get('required_documents'), list):
                                    print(f"✅ Required documents is array: {len(first_step['required_documents'])} items")
                                else:
                                    print(f"❌ Required documents should be array, got: {type(first_step.get('required_documents'))}")
                                    all_passed = False
                                
                                if isinstance(first_step.get('important_notes'), list):
                                    print(f"✅ Important notes is array: {len(first_step['important_notes'])} items")
                                else:
                                    print(f"❌ Important notes should be array, got: {type(first_step.get('important_notes'))}")
                                    all_passed = False
                        else:
                            print(f"❌ Steps field is empty or invalid")
                            all_passed = False
                        
                        # Check optional fields that ProcessFlowWithHeader.jsx uses
                        optional_fields = ['estimated_costs', 'calculator_type']
                        for field in optional_fields:
                            if field in process_detail:
                                print(f"✅ Optional field '{field}' present")
                            else:
                                print(f"ℹ️  Optional field '{field}' not present (OK)")
                
                elif detail_response.status_code == 404:
                    print(f"❌ Process not found (404)")
                    all_passed = False
                else:
                    print(f"❌ HTTP {detail_response.status_code}: {detail_response.text}")
                    all_passed = False
                    
            except Exception as e:
                print(f"❌ Error testing process detail: {str(e)}")
                all_passed = False
        
        # Test non-existent process ID
        print(f"\n--- Testing Non-existent Process ID ---")
        try:
            invalid_response = requests.get(f"{API_BASE}/legal-processes/invalid-id-12345", timeout=30)
            if invalid_response.status_code == 404:
                print(f"✅ Correctly returns 404 for non-existent process")
            else:
                print(f"❌ Expected 404 for non-existent process, got {invalid_response.status_code}")
                all_passed = False
        except Exception as e:
            print(f"❌ Error testing invalid process ID: {str(e)}")
            all_passed = False
        
        return all_passed
        
    except Exception as e:
        print(f"❌ Error getting process list: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_process_detail_endpoint()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 All legal process detail tests passed!")
        print("✅ ProcessFlowWithHeader.jsx should work correctly with the API")
        sys.exit(0)
    else:
        print("💥 Some tests failed!")
        print("❌ ProcessFlowWithHeader.jsx may have issues with the API")
        sys.exit(1)