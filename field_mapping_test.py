#!/usr/bin/env python3
"""
Test to verify field name mapping between API and Frontend
Identifies camelCase vs snake_case mismatches
"""

import requests
import json

# Configuration
BASE_URL = "https://legalcms.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_field_mapping():
    """Test field name mapping between API response and frontend expectations"""
    
    print("🔍 Testing Field Name Mapping")
    print("=" * 60)
    
    # Get a sample process
    try:
        response = requests.get(f"{API_BASE}/legal-processes", timeout=30)
        if response.status_code != 200:
            print(f"❌ Failed to get process list: HTTP {response.status_code}")
            return False
        
        processes = response.json()
        if not processes:
            print("❌ No processes available")
            return False
        
        # Get detailed process
        process_id = processes[0]['id']
        detail_response = requests.get(f"{API_BASE}/legal-processes/{process_id}", timeout=30)
        
        if detail_response.status_code != 200:
            print(f"❌ Failed to get process detail: HTTP {detail_response.status_code}")
            return False
        
        process = detail_response.json()
        
        print(f"Testing process: {process.get('title', 'Unknown')}")
        print(f"Process ID: {process_id}")
        print()
        
        # Field mapping issues found in ProcessFlowWithHeader.jsx
        field_mappings = {
            # API field (snake_case) -> Frontend expected (camelCase)
            'has_calculator': 'hasCalculator',
            'estimated_costs': 'estimatedCosts',
        }
        
        step_field_mappings = {
            # API field (snake_case) -> Frontend expected (camelCase)  
            'short_title': 'shortTitle',
            'required_documents': 'requiredDocuments',
            'important_notes': 'importantNotes',
        }
        
        print("🔍 Checking main process fields:")
        issues_found = False
        
        for api_field, frontend_field in field_mappings.items():
            if api_field in process:
                if frontend_field not in process:
                    print(f"❌ MISMATCH: API has '{api_field}' but frontend expects '{frontend_field}'")
                    issues_found = True
                else:
                    print(f"✅ Both '{api_field}' and '{frontend_field}' present")
            else:
                print(f"ℹ️  Field '{api_field}' not present in API response")
        
        print("\n🔍 Checking step fields:")
        steps = process.get('steps', [])
        if steps:
            first_step = steps[0]
            
            for api_field, frontend_field in step_field_mappings.items():
                if api_field in first_step:
                    if frontend_field not in first_step:
                        print(f"❌ STEP MISMATCH: API has '{api_field}' but frontend expects '{frontend_field}'")
                        issues_found = True
                    else:
                        print(f"✅ Both '{api_field}' and '{frontend_field}' present in step")
                else:
                    print(f"ℹ️  Step field '{api_field}' not present in API response")
        
        print(f"\n📋 Full API Response Structure:")
        print("Main process fields:")
        for key in sorted(process.keys()):
            if key != 'steps':
                print(f"  - {key}: {type(process[key]).__name__}")
        
        if steps:
            print(f"\nFirst step fields:")
            for key in sorted(first_step.keys()):
                print(f"  - {key}: {type(first_step[key]).__name__}")
        
        return not issues_found
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_field_mapping()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 No field mapping issues found!")
    else:
        print("💥 Field mapping issues detected!")
        print("❌ ProcessFlowWithHeader.jsx may not display data correctly")