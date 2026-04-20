# 📚 API DOCUMENTATION

## Base URL

```
Development:  http://localhost:8000/api
Production:   https://api.heartpredict.com/api
```

## Authentication

All endpoints except auth and public endpoints require:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 🔑 Authentication Endpoints

### Register New User

```
POST /register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "password_confirmation": "Password@123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-04-18T10:30:00Z"
  }
}

Error Response (422):
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Login

```
POST /login

Request Body:
{
  "email": "john@example.com",
  "password": "Password@123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Logout

```
POST /logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password

```
POST /forgot-password

Request Body:
{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Verify Reset Token

```
POST /verify-token

Request Body:
{
  "token": "abc123def456ghi..."
}

Response (200):
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "email": "john@example.com"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Token has expired or is invalid"
}
```

### Reset Password

```
POST /reset-password

Request Body:
{
  "token": "abc123def456ghi...",
  "email": "john@example.com",
  "password": "NewPassword@123",
  "password_confirmation": "NewPassword@123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 User Profile Endpoints

### Get Current User Profile

```
GET /me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+62812345678",
    "profile_picture": "https://...",
    "role": "user",
    "email_verified_at": "2024-04-18T09:00:00Z",
    "created_at": "2024-04-18T09:00:00Z",
    "updated_at": "2024-04-18T10:00:00Z"
  }
}
```

### Update User Profile

```
PUT /profile
Authorization: Bearer {token}

Request Body:
{
  "name": "John Updated",
  "phone_number": "+62812345679",
  "profile_picture": "base64_image_or_url"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "phone_number": "+62812345679",
    "profile_picture": "https://...",
    "updated_at": "2024-04-18T11:00:00Z"
  }
}
```

---

## 🫀 Prediction Endpoints

### Heart Disease Prediction

```
POST /predict
Authorization: Bearer {token} (optional for public testing)

Request Body:
{
  "age": 45,
  "gender": "male",                    // "male" | "female"
  "blood_pressure_systolic": 140,
  "blood_pressure_diastolic": 90,
  "cholesterol": 240,                   // mg/dL
  "fasting_blood_sugar": 110,           // mg/dL
  "heart_rate": 75,                     // bpm
  "exercise_induced_angina": false,
  "st_depression": 0.5,
  "st_slope": "upsloping",              // "upsloping" | "flat" | "downsloping"
  "chest_pain_type": "typical",         // "typical" | "atypical" | "non-anginal" | "asymptomatic"
  "max_heart_rate_achieved": 150,
  "old_peak": 1.0,
  "has_arrhythmia": false,
  "has_diabetes": false,
  "has_hypertension": true,
  "has_hyperlipidemia": false,
  "family_history": true,
  "smokes": false,
  "exercise_frequency": "moderate"      // "sedentary" | "light" | "moderate" | "vigorous"
}

Response (200):
{
  "success": true,
  "message": "Prediction completed",
  "data": {
    "prediction_id": "pred_abc123",
    "risk_score": 0.75,                 // 0 - 1 (probability)
    "risk_percentage": 75,               // 0 - 100
    "risk_level": "high",                // "low" | "moderate" | "high" | "very_high"
    "interpretation": "Berdasarkan data yang Anda berikan, risiko penyakit jantung Anda termasuk tinggi...",
    "recommendations": [
      "Segera berkonsultasi dengan dokter kardiologi",
      "Lakukan pemeriksaan ECG dan tes darah lengkap",
      "Kurangi konsumsi garam dan lemak jenuh",
      "Mulai program olahraga teratur minimal 30 menit/hari",
      "Kelola stres dengan meditasi atau aktivitas relaksasi"
    ],
    "risk_factors": [
      "Tekanan darah tinggi (140/90)",
      "Kolesterol tinggi (240 mg/dL)",
      "Riwayat keluarga dengan penyakit jantung"
    ],
    "created_at": "2024-04-18T12:00:00Z"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "age": ["Age must be between 18 and 120"],
    "cholesterol": ["Cholesterol must be a number"]
  }
}
```

### Get Prediction History

```
GET /predictions?page=1&per_page=10&sort=-created_at
Authorization: Bearer {token}

Query Parameters:
  page: int (default: 1)
  per_page: int (default: 10, max: 100)
  sort: string ("-created_at" | "created_at")
  date_from: ISO date string (optional)
  date_to: ISO date string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "risk_score": 0.75,
      "risk_level": "high",
      "risk_percentage": 75,
      "created_at": "2024-04-18T12:00:00Z"
    },
    {
      "id": 2,
      "risk_score": 0.35,
      "risk_level": "low",
      "risk_percentage": 35,
      "created_at": "2024-04-17T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 25,
      "per_page": 10,
      "current_page": 1,
      "last_page": 3,
      "from": 1,
      "to": 10
    }
  }
}
```

### Get Prediction Detail

```
GET /predictions/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "risk_score": 0.75,
    "risk_level": "high",
    "risk_percentage": 75,
    "input_data": {
      "age": 45,
      "gender": "male",
      "blood_pressure_systolic": 140,
      ...
    },
    "recommendations": [...],
    "risk_factors": [...],
    "created_at": "2024-04-18T12:00:00Z"
  }
}
```

---

## 💬 AI Chat Endpoints

### Send Chat Message

```
POST /chat
Authorization: Bearer {token}

Request Body:
{
  "message": "Bagaimana cara mencegah penyakit jantung?"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "chat_abc123",
    "user_id": 1,
    "message": "Bagaimana cara mencegah penyakit jantung?",
    "response": "Mencegah penyakit jantung dapat dilakukan melalui berbagai cara berikut...",
    "tokens_used": 245,
    "created_at": "2024-04-18T13:00:00Z"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Message is required"
}
```

### Get Chat History

```
GET /chats?page=1&per_page=20&sort=-created_at
Authorization: Bearer {token}

Query Parameters:
  page: int (default: 1)
  per_page: int (default: 20, max: 100)
  sort: string ("-created_at" | "created_at")
  date_from: ISO date string (optional)
  date_to: ISO date string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "chat_abc123",
      "message": "Bagaimana cara mencegah penyakit jantung?",
      "response": "Mencegah penyakit jantung...",
      "created_at": "2024-04-18T13:00:00Z"
    },
    {
      "id": "chat_def456",
      "message": "Apa itu hipertensi?",
      "response": "Hipertensi adalah...",
      "created_at": "2024-04-18T12:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 50,
      "per_page": 20,
      "current_page": 1,
      "last_page": 3
    }
  }
}
```

### Test AI Endpoint (Public)

```
POST /test-ai

Request Body:
{
  "message": "Hello, how are you?"
}

Response (200):
{
  "success": true,
  "data": {
    "response": "Hello! I'm HeartGuard Assistant...",
    "tokens_used": 120
  }
}
```

---

## 📰 Articles Endpoints

### Get All Articles (Public)

```
GET /articles?page=1&per_page=10&category_id=1&search=diet
Authorization: Optional

Query Parameters:
  page: int (default: 1)
  per_page: int (default: 10, max: 50)
  category_id: int (optional)
  search: string (search in title and content)
  sort: string ("-created_at" | "created_at" | "view_count")
  status: string ("published" | default: "published")

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "10 Cara Menjaga Kesehatan Jantung",
      "slug": "10-cara-menjaga-kesehatan-jantung",
      "excerpt": "Pelajari cara-cara efektif untuk menjaga kesehatan jantung Anda...",
      "thumbnail": "https://...",
      "category": {
        "id": 1,
        "name": "Pencegahan",
        "slug": "pencegahan"
      },
      "author": {
        "id": 1,
        "name": "Dr. John Doe"
      },
      "view_count": 1250,
      "created_at": "2024-04-18T09:00:00Z",
      "published_at": "2024-04-18T09:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 45,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5
    }
  }
}
```

### Get Article by Slug (Public)

```
GET /articles/{slug}
Authorization: Optional

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "10 Cara Menjaga Kesehatan Jantung",
    "slug": "10-cara-menjaga-kesehatan-jantung",
    "content": "<h1>10 Cara Menjaga Kesehatan Jantung</h1><p>Pelajari cara-cara...</p>",
    "raw_content": {
      "blocks": [
        {
          "type": "header",
          "data": {
            "text": "10 Cara Menjaga Kesehatan Jantung",
            "level": 1
          }
        }
      ]
    },
    "category": {
      "id": 1,
      "name": "Pencegahan"
    },
    "author": {
      "id": 1,
      "name": "Dr. John Doe"
    },
    "thumbnail": "https://...",
    "view_count": 1250,
    "created_at": "2024-04-18T09:00:00Z",
    "updated_at": "2024-04-18T10:00:00Z",
    "published_at": "2024-04-18T09:00:00Z"
  }
}

Error Response (404):
{
  "success": false,
  "message": "Article not found"
}
```

### Get Categories (Public)

```
GET /categories
Authorization: Optional

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pencegahan",
      "slug": "pencegahan",
      "article_count": 15
    },
    {
      "id": 2,
      "name": "Gejala",
      "slug": "gejala",
      "article_count": 8
    },
    {
      "id": 3,
      "name": "Pengobatan",
      "slug": "pengobatan",
      "article_count": 12
    }
  ]
}
```

---

## 🛠️ Admin Endpoints

**All admin endpoints require: `Authorization: Bearer {token}` with admin role**

### Dashboard Statistics

```
GET /admin/stats
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "data": {
    "total_users": 250,
    "total_articles": 45,
    "total_predictions_today": 156,
    "total_active_chats": 32,
    "predictions_this_week": 890,
    "predictions_this_month": 3450,
    "average_risk_score": 0.42,
    "recent_predictions": [
      {
        "user": "John Doe",
        "risk_level": "high",
        "created_at": "2024-04-18T13:45:00Z"
      }
    ],
    "top_categories": [
      { "name": "Pencegahan", "count": 15 },
      { "name": "Gejala", "count": 8 }
    ]
  }
}
```

### User Management - List Users

```
GET /admin/users?page=1&per_page=15&search=john&sort=-created_at&role=user
Authorization: Bearer {token} (admin only)

Query Parameters:
  page: int
  per_page: int (max: 100)
  search: string (search in name, email, phone)
  sort: string ("-created_at" | "created_at" | "name")
  role: string ("user" | "admin")

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+62812345678",
      "role": "user",
      "email_verified_at": "2024-04-18T09:00:00Z",
      "last_login_at": "2024-04-18T13:00:00Z",
      "prediction_count": 12,
      "created_at": "2024-04-18T09:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 250,
      "per_page": 15,
      "current_page": 1,
      "last_page": 17
    }
  }
}
```

### User Management - Create User

```
POST /admin/users
Authorization: Bearer {token} (admin only)

Request Body:
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password@123",
  "phone_number": "+62812345679",
  "role": "user"  // "user" | "admin"
}

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 251,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone_number": "+62812345679",
    "role": "user",
    "created_at": "2024-04-18T14:00:00Z"
  }
}
```

### User Management - Update User

```
PUT /admin/users/{id}
Authorization: Bearer {token} (admin only)

Request Body:
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone_number": "+62812345680",
  "role": "admin"
}

Response (200):
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 251,
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone_number": "+62812345680",
    "role": "admin"
  }
}
```

### User Management - Delete User

```
DELETE /admin/users/{id}
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Article Management - List Articles

```
GET /admin/articles?page=1&per_page=15&status=published&search=kesehatan
Authorization: Bearer {token} (admin only)

Query Parameters:
  page: int
  per_page: int
  status: string ("published" | "draft" | "archived")
  search: string
  sort: string ("-created_at" | "created_at" | "view_count")

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "10 Cara Menjaga Kesehatan Jantung",
      "slug": "10-cara-menjaga-kesehatan-jantung",
      "category": {
        "id": 1,
        "name": "Pencegahan"
      },
      "author": {
        "id": 1,
        "name": "Dr. John Doe"
      },
      "status": "published",
      "view_count": 1250,
      "created_at": "2024-04-18T09:00:00Z",
      "published_at": "2024-04-18T09:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 45,
      "per_page": 15,
      "current_page": 1
    }
  }
}
```

### Article Management - Create Article

```
POST /admin/articles
Authorization: Bearer {token} (admin only)

Request Body:
{
  "title": "Cara Menurunkan Tekanan Darah",
  "slug": "cara-menurunkan-tekanan-darah",
  "content": "<h1>Cara Menurunkan Tekanan Darah</h1><p>...</p>",
  "raw_content": {
    "blocks": [...]
  },
  "category_id": 1,
  "thumbnail": "https://...",
  "status": "published"
}

Response (201):
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 46,
    "title": "Cara Menurunkan Tekanan Darah",
    "slug": "cara-menurunkan-tekanan-darah",
    "status": "published",
    "created_at": "2024-04-18T14:00:00Z"
  }
}
```

### Article Management - Update Article

```
PUT /admin/articles/{id}
Authorization: Bearer {token} (admin only)

Request Body:
{
  "title": "Cara Menurunkan Tekanan Darah - Update",
  "content": "<h1>Cara Menurunkan Tekanan Darah</h1><p>Updated content...</p>",
  "status": "published"
}

Response (200):
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "id": 46,
    "title": "Cara Menurunkan Tekanan Darah - Update",
    "updated_at": "2024-04-18T15:00:00Z"
  }
}
```

### Article Management - Delete Article

```
DELETE /admin/articles/{id}
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "message": "Article deleted successfully"
}
```

---

### Dataset Management - List Datasets

```
GET /admin/datasets?page=1&per_page=10
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Heart Disease Dataset v2.0",
      "description": "Enhanced dataset with 5000 samples",
      "sample_count": 5000,
      "accuracy_score": 0.92,
      "status": "active",
      "version": "2.0",
      "uploaded_by": {
        "id": 1,
        "name": "Dr. Admin"
      },
      "created_at": "2024-04-18T09:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 5,
      "per_page": 10,
      "current_page": 1
    }
  }
}
```

### Dataset Management - Upload Dataset

```
POST /admin/datasets
Authorization: Bearer {token} (admin only)
Content-Type: multipart/form-data

Request Body:
{
  "name": "Heart Disease Dataset v3.0",
  "description": "New improved dataset",
  "file": <CSV/JSON file>,
  "sample_count": 6000,
  "accuracy_score": 0.94,
  "status": "active"
}

Response (201):
{
  "success": true,
  "message": "Dataset uploaded successfully",
  "data": {
    "id": 6,
    "name": "Heart Disease Dataset v3.0",
    "file_path": "datasets/dataset_v3_abc123.csv",
    "sample_count": 6000,
    "accuracy_score": 0.94,
    "created_at": "2024-04-18T15:00:00Z"
  }
}
```

### Dataset Management - Delete Dataset

```
DELETE /admin/datasets/{id}
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "message": "Dataset deleted successfully"
}
```

---

### Category Management - Create Category

```
POST /admin/categories
Authorization: Bearer {token} (admin only)

Request Body:
{
  "name": "Nutrisi"
}

Response (201):
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 4,
    "name": "Nutrisi",
    "slug": "nutrisi",
    "created_at": "2024-04-18T15:00:00Z"
  }
}
```

### Category Management - Update Category

```
PUT /admin/categories/{id}
Authorization: Bearer {token} (admin only)

Request Body:
{
  "name": "Nutrisi & Diet"
}

Response (200):
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 4,
    "name": "Nutrisi & Diet",
    "slug": "nutrisi-diet"
  }
}
```

### Category Management - Delete Category

```
DELETE /admin/categories/{id}
Authorization: Bearer {token} (admin only)

Response (200):
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Error Responses

### Standard Error Response Format

```
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### Common HTTP Status Codes

```
200 OK               - Request successful
201 Created          - Resource created successfully
204 No Content       - Request successful, no content to return
400 Bad Request      - Invalid request data
401 Unauthorized     - Authentication required or failed
403 Forbidden        - Authenticated but not authorized
404 Not Found        - Resource not found
409 Conflict         - Resource conflict (e.g., duplicate email)
422 Unprocessable    - Validation failed
429 Too Many         - Rate limit exceeded
500 Server Error     - Internal server error
503 Unavailable      - Service temporarily unavailable
```

### Validation Error Response

```
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "Email is required",
      "Email must be a valid email address"
    ],
    "password": [
      "Password must be at least 8 characters"
    ]
  }
}
```

### Unauthorized Response

```
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Forbidden Response

```
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

---

## Rate Limiting

```
Global Limits:
  • 60 requests per minute per IP
  • 1000 requests per hour per IP

Auth Endpoints:
  • 5 login attempts per minute per email
  • 3 password reset attempts per hour per email

AI Chat:
  • 100 messages per day per user
  • 10 messages per minute per user
```

---

## Pagination

All list endpoints support pagination with:

```
Query Parameters:
  page: int (default: 1)
  per_page: int (default varies by endpoint)

Response Metadata:
{
  "meta": {
    "pagination": {
      "total": 250,           // Total items
      "per_page": 15,         // Items per page
      "current_page": 1,      // Current page
      "last_page": 17,        // Total pages
      "from": 1,              // First item on this page
      "to": 15,               // Last item on this page
      "path": "/api/users"
    }
  }
}
```

---

## Sorting

Endpoints that support sorting use the `sort` query parameter:

```
sort=created_at     // Ascending (oldest first)
sort=-created_at    // Descending (newest first)
sort=name           // A-Z
sort=-name          // Z-A
```

---

## Filtering

Available filters depend on the endpoint. Common filters:

```
search=keyword              // Search in multiple fields
status=published            // Filter by status
category_id=1               // Filter by category
role=admin                  // Filter by role
date_from=2024-04-01        // Filter from date
date_to=2024-04-30          // Filter to date
```

---

## API Response Structure

### Success Response

```
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### List Response

```
{
  "success": true,
  "message": "Data retrieved",
  "data": [
    // Array of items
  ],
  "meta": {
    "pagination": { }
  }
}
```

---

## Testing API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password@123"}'

# Get current user
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create prediction
curl -X POST http://localhost:8000/api/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age":45,"gender":"male",...}'
```

### Using Postman

1. Import this API documentation
2. Set environment variables:
   - `base_url`: http://localhost:8000/api
   - `token`: Your JWT token
3. Use the pre-configured requests

### Using Thunder Client / REST Client

```
@base_url = http://localhost:8000/api
@token = YOUR_JWT_TOKEN

### Register
POST {{base_url}}/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "password_confirmation": "Password@123"
}

### Login
POST {{base_url}}/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}

### Get current user
GET {{base_url}}/me
Authorization: Bearer {{token}}
```

---

*Last Updated: 2026-04-18*
*For questions or issues, please refer to the main PROJECT_DOCUMENTATION.md file.*
