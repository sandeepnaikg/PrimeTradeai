# TaskFlow API Documentation

## Base URL
```
https://fullstack-intern-3.preview.emergentagent.com/api
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "created_at": "2026-01-01T12:00:00.000000+00:00"
  }
}
```

**Validation:**
- Name: Required, min 2 characters
- Email: Required, valid email format
- Password: Required, min 6 characters

**Error (400):**
```json
{
  "detail": "Email already registered"
}
```

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "created_at": "2026-01-01T12:00:00.000000+00:00"
  }
}
```

**Error (401):**
```json
{
  "detail": "Incorrect email or password"
}
```

---

### 3. Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "created_at": "2026-01-01T12:00:00.000000+00:00"
}
```

**Error (401):**
```json
{
  "detail": "Could not validate credentials"
}
```

---

### 4. Update Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Response (200):**
```json
{
  "email": "john@example.com",
  "name": "John Smith",
  "created_at": "2026-01-01T12:00:00.000000+00:00"
}
```

---

## Task Management Endpoints

### 5. Create Task
**POST** `/tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the full-stack assignment",
  "status": "pending",
  "priority": "high"
}
```

**Fields:**
- `title` (required): Task title
- `description` (optional): Task description
- `status` (optional): `pending` | `in-progress` | `completed` (default: `pending`)
- `priority` (optional): `low` | `medium` | `high` (default: `medium`)

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the full-stack assignment",
  "status": "pending",
  "priority": "high",
  "user_email": "john@example.com",
  "created_at": "2026-01-01T12:00:00.000000+00:00",
  "updated_at": "2026-01-01T12:00:00.000000+00:00"
}
```

---

### 6. Get All Tasks
**GET** `/tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (all optional):**
- `search` (string): Search in title and description
- `status` (string): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (string): Filter by priority (`low`, `medium`, `high`)

**Examples:**
```
GET /tasks
GET /tasks?search=project
GET /tasks?status=completed
GET /tasks?priority=high
GET /tasks?search=assignment&status=in-progress&priority=high
```

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project",
    "description": "Finish the full-stack assignment",
    "status": "in-progress",
    "priority": "high",
    "user_email": "john@example.com",
    "created_at": "2026-01-01T12:00:00.000000+00:00",
    "updated_at": "2026-01-01T12:05:00.000000+00:00"
  }
]
```

---

### 7. Get Single Task
**GET** `/tasks/{task_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the full-stack assignment",
  "status": "in-progress",
  "priority": "high",
  "user_email": "john@example.com",
  "created_at": "2026-01-01T12:00:00.000000+00:00",
  "updated_at": "2026-01-01T12:05:00.000000+00:00"
}
```

**Error (404):**
```json
{
  "detail": "Task not found"
}
```

---

### 8. Update Task
**PUT** `/tasks/{task_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "title": "Complete project - DONE",
  "description": "Finished the full-stack assignment",
  "status": "completed",
  "priority": "high"
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project - DONE",
  "description": "Finished the full-stack assignment",
  "status": "completed",
  "priority": "high",
  "user_email": "john@example.com",
  "created_at": "2026-01-01T12:00:00.000000+00:00",
  "updated_at": "2026-01-01T12:30:00.000000+00:00"
}
```

**Error (404):**
```json
{
  "detail": "Task not found"
}
```

---

### 9. Delete Task
**DELETE** `/tasks/{task_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error (404):**
```json
{
  "detail": "Task not found"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Tokens**: Tokens expire after 24 hours
3. **Authorization**: All task operations are user-specific (users can only access their own tasks)
4. **CORS**: Configured for secure cross-origin requests
5. **Input Validation**: Server-side validation using Pydantic models

---

## Testing with cURL

### Register and Login:
```bash
# Register
curl -X POST https://fullstack-intern-3.preview.emergentagent.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login and save token
TOKEN=$(curl -s -X POST https://fullstack-intern-3.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.access_token')
```

### Create and Manage Tasks:
```bash
# Create task
curl -X POST https://fullstack-intern-3.preview.emergentagent.com/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description","status":"pending","priority":"medium"}'

# Get all tasks
curl -X GET https://fullstack-intern-3.preview.emergentagent.com/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Search tasks
curl -X GET "https://fullstack-intern-3.preview.emergentagent.com/api/tasks?search=project" \
  -H "Authorization: Bearer $TOKEN"

# Update task (replace {task_id})
curl -X PUT https://fullstack-intern-3.preview.emergentagent.com/api/tasks/{task_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete task (replace {task_id})
curl -X DELETE https://fullstack-intern-3.preview.emergentagent.com/api/tasks/{task_id} \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting
Currently no rate limiting is implemented. For production, consider implementing rate limiting using:
- Redis-based rate limiting
- API Gateway rate limiting
- Application-level middleware

---

## Database Schema

### Users Collection
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "$2b$12$hashed_password...",
  "created_at": "2026-01-01T12:00:00.000000+00:00"
}
```

### Tasks Collection
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the assignment",
  "status": "in-progress",
  "priority": "high",
  "user_email": "john@example.com",
  "created_at": "2026-01-01T12:00:00.000000+00:00",
  "updated_at": "2026-01-01T12:05:00.000000+00:00"
}
```