[![API Docs](https://img.shields.io/badge/API-Documentation-blue)](https://drive.google.com/file/d/1AzKx0_uN_ZgOejBKmKd71A354vDmbe6I/view)
[![Schema](https://img.shields.io/badge/Database-Schema-green)](https://drive.google.com/file/d/1GCI1B-328aEcyr8KcmwdNvXgJcMlQW6E/view)

### 🔐 AUTHENTICATION APIS
1. Sign Up POST /auth/sign-up
Create a new user account.

Endpoint:

### POST http://localhost:5000/api/v1/auth/sign-up
Content-Type: application/json
Request Body:

***{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // Optional, defaults to "user"
}***
Success Response (201 Created):

***{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "65abc123def4567890123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}***

Error Responses:
Status	Message	Description
400	"User Already Exists"	Email already registered
400	"All fields are required"	Missing required fields
401	"Something went wrong"	Server error


2. Sign In POST /auth/sign-in
Login to existing account.

Endpoint:

http
POST http://localhost:5000/api/v1/auth/sign-in
Content-Type: application/json
Request Body:

{
  "email": "john@example.com",
  "password": "password123"
}
Success Response (200 OK):

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "65abc123def4567890123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
Error Responses:

Status	Message	Description
401	"Invalid credentials"	Wrong email/password
403	"Account is deactivated"	User account disabled
3. Sign Out POST /auth/sign-out
Logout user and clear session.

Endpoint:

http
POST http://localhost:5000/api/v1/auth/sign-out
Authorization: Bearer <token>
Success Response (200 OK):

{
  "success": true,
  "message": "User signed out successfully"
}
✅ TASK APIS
Authentication Required for All Task APIs
text
Authorization: Bearer <your-jwt-token>
1. Create Task POST /task
Create a new task.

Endpoint:

http
POST http://localhost:5000/api/v1/task
Authorization: Bearer <token>
Content-Type: application/json
Request Body:

{
  "title": "Complete project documentation",
  "description": "Write API docs and README",
  "status": "pending",        // Optional: pending, in-progress, completed
  "priority": "high",         // Optional: low, medium, high
  "dueDate": "2024-12-31"    // Optional: YYYY-MM-DD
}
Success Response (201 Created):

{
  "success": true,
  "data": {
    "_id": "65def789abc1234567890",
    "title": "Complete project documentation",
    "description": "Write API docs and README",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": {
      "_id": "65abc123def4567890123456",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
2. Get All Tasks GET /task
Retrieve tasks with optional filters.

Endpoint:

http
GET http://localhost:5000/api/v1/task
Authorization: Bearer <token>
Query Parameters (Optional):

Parameter	Type	Description	Example
status	string	Filter by status	?status=pending
priority	string	Filter by priority	?priority=high
Access Control:

Regular Users: Only see their own tasks

Admins: See all tasks

Success Response (200 OK):

{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65def789abc1234567890",
      "title": "Complete project documentation",
      "status": "pending",
      "priority": "high",
      "user": {
        "_id": "65abc123def4567890123456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
3. Get Single Task GET /task/:id
Retrieve a specific task by ID.

Endpoint:

http
GET http://localhost:5000/api/v1/task/65def789abc1234567890
Authorization: Bearer <token>
Success Response (200 OK):

{
  "success": true,
  "data": {
    "_id": "65def789abc1234567890",
    "title": "Complete project documentation",
    "description": "Write API docs and README",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": {
      "_id": "65abc123def4567890123456",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
Error Responses:

Status	Message	Description
404	"Task not found"	Invalid task ID
403	"Not authorized"	Cannot access others' tasks (non-admin)
4. Update Task PUT /task/:id
Update an existing task.

Endpoint:

http
PUT http://localhost:5000/api/v1/task/65def789abc1234567890
Authorization: Bearer <token>
Content-Type: application/json
Request Body (Partial updates allowed):

{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "medium"
}
Success Response (200 OK):

{
  "success": true,
  "data": {
    "_id": "65def789abc1234567890",
    "title": "Updated task title",
    "status": "in-progress",
    "priority": "medium",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "message": "Task updated successfully"
}
5. Delete Task DELETE /task/:id
Delete a task.

Endpoint:

http
DELETE http://localhost:5000/api/v1/task/65def789abc1234567890
Authorization: Bearer <token>
Success Response (200 OK):

{
  "success": true,
  "message": "Task deleted successfully"
}
6. Get Task Statistics GET /task/stats/summary
Get task statistics (count by status and priority).

Endpoint:

http
GET http://localhost:5000/api/v1/task/stats/summary
Authorization: Bearer <token>
Access Control:

Regular Users: Stats only for their tasks

Admins: Stats for all tasks

Success Response (200 OK):

{
  "success": true,
  "data": {
    "byStatus": [
      { "_id": "pending", "count": 5 },
      { "_id": "in-progress", "count": 3 },
      { "_id": "completed", "count": 2 }
    ],
    "byPriority": [
      { "_id": "high", "count": 4 },
      { "_id": "medium", "count": 3 },
      { "_id": "low", "count": 3 }
    ],
    "total": 10
  }
}


### Postman Collection


{
  "info": {
    "name": "TaskFlow API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/auth/sign-up",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "sign-up"]
            },
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "name": "John Doe",
                "email": "john@example.com",
                "password": "password123",
                "role": "user"
              }, null, 2)
            }
          }
        },
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/auth/sign-in",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "sign-in"]
            },
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "email": "john@example.com",
                "password": "password123"
              }, null, 2)
            }
          }
        },
        {
          "name": "Sign Out",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/auth/sign-out",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "sign-out"]
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task",
              "host": ["{{baseUrl}}"],
              "path": ["task"]
            },
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "title": "New Task",
                "description": "Task description",
                "priority": "high",
                "status": "pending"
              }, null, 2)
            }
          }
        },
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task",
              "host": ["{{baseUrl}}"],
              "path": ["task"]
            }
          }
        },
        {
          "name": "Get Task by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task/{{taskId}}",
              "host": ["{{baseUrl}}"],
              "path": ["task", "{{taskId}}"]
            }
          }
        },
        {
          "name": "Update Task",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task/{{taskId}}",
              "host": ["{{baseUrl}}"],
              "path": ["task", "{{taskId}}"]
            },
            "body": {
              "mode": "raw",
              "raw": JSON.stringify({
                "status": "completed",
                "priority": "medium"
              }, null, 2)
            }
          }
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task/{{taskId}}",
              "host": ["{{baseUrl}}"],
              "path": ["task", "{{taskId}}"]
            }
          }
        },
        {
          "name": "Get Task Statistics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/task/stats/summary",
              "host": ["{{baseUrl}}"],
              "path": ["task", "stats", "summary"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    },
    {
      "key": "taskId",
      "value": "",
      "type": "string"
    }
  ]
}