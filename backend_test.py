import requests
import sys
import json
from datetime import datetime

class TaskManagementAPITester:
    def __init__(self, base_url="https://fullstack-intern-3.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_detail = response.json().get('detail', 'No error detail')
                    details += f", Error: {error_detail}"
                except:
                    details += f", Response: {response.text[:100]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration with various scenarios"""
        print("\n🔐 Testing User Registration...")
        
        # Test valid registration
        test_user = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "Valid User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response['user']
            self.log_test("Registration Token Received", True, "JWT token obtained")
        else:
            self.log_test("Registration Token Received", False, "No token in response")
        
        # Test duplicate email registration
        self.run_test(
            "Duplicate Email Registration",
            "POST", 
            "auth/register",
            400,
            data=test_user
        )
        
        # Test invalid email format
        invalid_user = test_user.copy()
        invalid_user["email"] = "invalid-email"
        self.run_test(
            "Invalid Email Format",
            "POST",
            "auth/register", 
            422,
            data=invalid_user
        )
        
        # Test missing required fields
        incomplete_user = {"email": "test@example.com"}
        self.run_test(
            "Missing Required Fields",
            "POST",
            "auth/register",
            422,
            data=incomplete_user
        )

    def test_user_login(self):
        """Test user login functionality"""
        print("\n🔑 Testing User Login...")
        
        if not self.user_data:
            self.log_test("Login Test Setup", False, "No user data from registration")
            return
        
        # Test valid login
        login_data = {
            "email": self.user_data["email"],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "Valid User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log_test("Login Token Received", True, "JWT token obtained")
        
        # Test invalid credentials
        invalid_login = login_data.copy()
        invalid_login["password"] = "wrongpassword"
        self.run_test(
            "Invalid Password",
            "POST",
            "auth/login",
            401,
            data=invalid_login
        )
        
        # Test non-existent user
        nonexistent_login = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        self.run_test(
            "Non-existent User Login",
            "POST",
            "auth/login",
            401,
            data=nonexistent_login
        )

    def test_protected_routes(self):
        """Test protected route access"""
        print("\n🛡️ Testing Protected Routes...")
        
        # Test profile access with valid token
        if self.token:
            self.run_test(
                "Profile Access with Token",
                "GET",
                "auth/profile",
                200
            )
        
        # Test profile access without token
        old_token = self.token
        self.token = None
        self.run_test(
            "Profile Access without Token",
            "GET", 
            "auth/profile",
            401
        )
        
        # Test with invalid token
        self.token = "invalid_token"
        self.run_test(
            "Profile Access with Invalid Token",
            "GET",
            "auth/profile", 
            401
        )
        
        # Restore valid token
        self.token = old_token

    def test_profile_management(self):
        """Test profile update functionality"""
        print("\n👤 Testing Profile Management...")
        
        if not self.token:
            self.log_test("Profile Management Setup", False, "No valid token")
            return
        
        # Test profile update
        update_data = {"name": "Updated Test User"}
        success, response = self.run_test(
            "Profile Name Update",
            "PUT",
            "auth/profile",
            200,
            data=update_data
        )
        
        if success and response.get('name') == "Updated Test User":
            self.log_test("Profile Update Verification", True, "Name updated correctly")
        else:
            self.log_test("Profile Update Verification", False, "Name not updated")

    def test_task_crud_operations(self):
        """Test complete CRUD operations for tasks"""
        print("\n📝 Testing Task CRUD Operations...")
        
        if not self.token:
            self.log_test("Task CRUD Setup", False, "No valid token")
            return
        
        # Test task creation
        task_data = {
            "title": "Test Task",
            "description": "This is a test task",
            "status": "pending",
            "priority": "high"
        }
        
        success, response = self.run_test(
            "Task Creation",
            "POST",
            "tasks",
            200,
            data=task_data
        )
        
        task_id = None
        if success and 'id' in response:
            task_id = response['id']
            self.log_test("Task ID Retrieved", True, f"Task ID: {task_id}")
        else:
            self.log_test("Task ID Retrieved", False, "No task ID in response")
            return
        
        # Test task retrieval
        self.run_test(
            "Single Task Retrieval",
            "GET",
            f"tasks/{task_id}",
            200
        )
        
        # Test all tasks retrieval
        self.run_test(
            "All Tasks Retrieval",
            "GET",
            "tasks",
            200
        )
        
        # Test task update
        update_data = {
            "title": "Updated Test Task",
            "status": "in-progress",
            "priority": "medium"
        }
        
        self.run_test(
            "Task Update",
            "PUT",
            f"tasks/{task_id}",
            200,
            data=update_data
        )
        
        # Test task deletion
        self.run_test(
            "Task Deletion",
            "DELETE",
            f"tasks/{task_id}",
            200
        )
        
        # Test accessing deleted task
        self.run_test(
            "Deleted Task Access",
            "GET",
            f"tasks/{task_id}",
            404
        )

    def test_task_search_and_filter(self):
        """Test task search and filtering functionality"""
        print("\n🔍 Testing Task Search and Filter...")
        
        if not self.token:
            self.log_test("Search/Filter Setup", False, "No valid token")
            return
        
        # Create multiple test tasks
        test_tasks = [
            {"title": "Search Test 1", "description": "Important task", "status": "pending", "priority": "high"},
            {"title": "Search Test 2", "description": "Regular task", "status": "in-progress", "priority": "medium"},
            {"title": "Filter Test", "description": "Low priority task", "status": "completed", "priority": "low"}
        ]
        
        created_task_ids = []
        for i, task in enumerate(test_tasks):
            success, response = self.run_test(
                f"Create Search Test Task {i+1}",
                "POST",
                "tasks",
                200,
                data=task
            )
            if success and 'id' in response:
                created_task_ids.append(response['id'])
        
        # Test search by title
        self.run_test(
            "Search by Title",
            "GET",
            "tasks?search=Search",
            200
        )
        
        # Test search by description
        self.run_test(
            "Search by Description", 
            "GET",
            "tasks?search=Important",
            200
        )
        
        # Test filter by status
        self.run_test(
            "Filter by Status",
            "GET",
            "tasks?status=pending",
            200
        )
        
        # Test filter by priority
        self.run_test(
            "Filter by Priority",
            "GET", 
            "tasks?priority=high",
            200
        )
        
        # Test combined search and filter
        self.run_test(
            "Combined Search and Filter",
            "GET",
            "tasks?search=Test&status=pending&priority=high",
            200
        )
        
        # Clean up test tasks
        for task_id in created_task_ids:
            self.run_test(
                f"Cleanup Task {task_id[:8]}",
                "DELETE",
                f"tasks/{task_id}",
                200
            )

    def test_error_handling(self):
        """Test various error scenarios"""
        print("\n⚠️ Testing Error Handling...")
        
        # Test invalid task creation
        invalid_task = {"description": "Task without title"}
        self.run_test(
            "Task Creation without Title",
            "POST",
            "tasks",
            422,
            data=invalid_task
        )
        
        # Test accessing non-existent task
        self.run_test(
            "Non-existent Task Access",
            "GET",
            "tasks/non-existent-id",
            404
        )
        
        # Test updating non-existent task
        self.run_test(
            "Non-existent Task Update",
            "PUT",
            "tasks/non-existent-id",
            404,
            data={"title": "Updated"}
        )

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Comprehensive API Testing...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        try:
            self.test_user_registration()
            self.test_user_login()
            self.test_protected_routes()
            self.test_profile_management()
            self.test_task_crud_operations()
            self.test_task_search_and_filter()
            self.test_error_handling()
        except Exception as e:
            print(f"❌ Test suite failed with exception: {str(e)}")
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = TaskManagementAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())