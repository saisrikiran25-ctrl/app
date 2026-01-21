#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class BizBuddyAPITester:
    def __init__(self, base_url="https://prompt-forge-28.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
            self.failed_tests.append(f"{name}: {details}")

    def test_api_root(self):
        """Test the API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_generate_prompt(self, mode, test_name):
        """Test prompt generation for a specific mode"""
        # Sample business data as specified in the request
        test_data = {
            "mode": mode,
            "product": "AI-powered fitness tracking app",
            "offer": "Get personalized workout plans for 50% off first month",
            "audience": "Health-conscious millennials aged 25-35",
            "brand_voice": "Motivational, data-driven, friendly",
            "channel": "Meta, Instagram",
            "objective": "CTR optimization",
            "market": "United States",
            "language": "English",
            "constraints": "",
            "competitive_angle": "",
            "references": ""
        }

        # Add mode-specific fields
        if mode == "visual_ad":
            test_data.update({
                "asset_type": "image",
                "video_len": 30,
                "overlay_char_limit": 18
            })
        elif mode == "landing_page_copy":
            test_data.update({
                "funnel_stage": "conversion"
            })

        try:
            response = requests.post(
                f"{self.api_url}/generate-prompt",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                # Verify response structure
                required_fields = ['id', 'mode', 'generated_prompt', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
                else:
                    # Check if prompt has the required delimiters
                    prompt = data.get('generated_prompt', '')
                    has_begin = '>>>BEGIN-PASTE-PROMPT' in prompt
                    has_end = '>>>END-PASTE-PROMPT' in prompt
                    
                    if not (has_begin and has_end):
                        success = False
                        details += ", Missing required prompt delimiters"
                    else:
                        details += f", Prompt length: {len(prompt)} chars"
                        # Verify mode matches
                        if data.get('mode') != mode:
                            success = False
                            details += f", Mode mismatch: expected {mode}, got {data.get('mode')}"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_test(test_name, success, details)
            return success, response.json() if success else {}
            
        except Exception as e:
            self.log_test(test_name, False, str(e))
            return False, {}

    def test_get_prompts(self):
        """Test getting all prompts"""
        try:
            response = requests.get(f"{self.api_url}/prompts", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} prompts"
                
            self.log_test("Get All Prompts", success, details)
            return success
        except Exception as e:
            self.log_test("Get All Prompts", False, str(e))
            return False

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating a status check
        try:
            status_data = {"client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"}
            response = requests.post(
                f"{self.api_url}/status",
                json=status_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
                    
            self.log_test("Create Status Check", success, details)
            
            # Test getting status checks
            response = requests.get(f"{self.api_url}/status", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} status checks"
                
            self.log_test("Get Status Checks", success, details)
            
        except Exception as e:
            self.log_test("Status Endpoints", False, str(e))

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting BizBuddy Backend API Tests")
        print("=" * 50)
        
        # Test API availability
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return False
            
        print("\n📝 Testing Prompt Generation for All Modes:")
        print("-" * 40)
        
        # Test all 4 modes
        modes = [
            ("short_ad_copy", "Short Ad Copy Generation"),
            ("visual_ad", "Visual Ad Generation"),
            ("landing_page_copy", "Landing Page Copy Generation"),
            ("headlines", "Headlines Generation")
        ]
        
        mode_results = []
        for mode, test_name in modes:
            success, data = self.test_generate_prompt(mode, test_name)
            mode_results.append((mode, success))
            
            # Print a sample of the generated prompt for verification
            if success and data:
                prompt = data.get('generated_prompt', '')
                print(f"   📄 Sample from {mode}:")
                # Show first 200 characters of the prompt
                sample = prompt[:200] + "..." if len(prompt) > 200 else prompt
                print(f"   {sample}")
                print()
        
        print("\n🔍 Testing Other Endpoints:")
        print("-" * 30)
        
        # Test other endpoints
        self.test_get_prompts()
        self.test_status_endpoints()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"   • {failure}")
        
        # Check mode-specific results
        failed_modes = [mode for mode, success in mode_results if not success]
        if failed_modes:
            print(f"\n⚠️  Failed Modes: {', '.join(failed_modes)}")
            return False
        else:
            print("\n✅ All prompt generation modes working correctly!")
            
        return self.tests_passed == self.tests_run

def main():
    tester = BizBuddyAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All backend tests passed! Ready for frontend testing.")
        return 0
    else:
        print("\n💥 Some backend tests failed. Please fix backend issues first.")
        return 1

if __name__ == "__main__":
    sys.exit(main())