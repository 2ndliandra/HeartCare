# 🏗️ SYSTEM ARCHITECTURE DESIGN

## 📐 High-Level Architecture

### Layered Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                            │
│                   (React + TypeScript Frontend)                    │
│  • Pages (Landing, Auth, User Dashboard, Admin Panel)              │
│  • Components (UI, Forms, Charts)                                  │
│  • State Management (Context API, Stores)                          │
│  • API Integration Layer (Axios)                                   │
└────────────────────────────────────────────────────────────────────┘
                                 ⬇⬆
                        HTTP REST API (JSON)
                      Sanctum JWT Authentication
                                 ⬇⬆
┌────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                             │
│                    (Laravel REST API Server)                       │
│  • Route Handlers (Controllers)                                    │
│  • Business Logic (Services)                                       │
│  • Data Validation (Requests)                                      │
│  • Authorization (Middleware, Policies)                            │
│  • Exception Handling                                              │
└────────────────────────────────────────────────────────────────────┘
                                 ⬇⬆
┌────────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                                  │
│              (Models, Repositories, Services)                      │
│  • Entity Models (User, Article, Chat, etc)                       │
│  • Business Rules                                                  │
│  • Domain Services (AiService, PredictionService)                 │
│  • Event Handling                                                  │
└────────────────────────────────────────────────────────────────────┘
                                 ⬇⬆
┌────────────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER (DAL)                          │
│           (Eloquent ORM, MongoDB Driver, Queries)                 │
│  • Database Queries                                                │
│  • Query Optimization                                              │
│  • Migration Management                                            │
│  • Connection Pooling                                              │
└────────────────────────────────────────────────────────────────────┘
                                 ⬇⬆
┌────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                │
│  ┌──────────────────┐          ┌──────────────────┐               │
│  │   MySQL Server   │          │  MongoDB Server  │               │
│  │  (Relational)    │          │  (Document)      │               │
│  │                  │          │                  │               │
│  │ • Users          │          │ • Articles       │               │
│  │ • Roles/Perms    │          │ • Chats          │               │
│  │ • Categories     │          │ • Datasets       │               │
│  │ • Tokens         │          │ • History        │               │
│  └──────────────────┘          └──────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Interaction Diagram

### Request-Response Cycle

```
Frontend Request:
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       │ axios.post('/api/predict', data)
       │ Header: Authorization: Bearer {token}
       ▼
┌──────────────────────────────────────────┐
│       Laravel Route Handler               │
│  Route::post('/api/predict', [...])      │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    Authentication Middleware              │
│  • Sanctum token verification             │
│  • Set auth user context                  │
│  • Check token expiration                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    Authorization (Policy/Middleware)      │
│  • User role validation                   │
│  • Permission check                       │
│  • Resource ownership                     │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         Controller Action                 │
│  • Request object injection               │
│  • Input validation                       │
│  • Dependency resolution                  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Form Request Validation              │
│  • Input validation rules                 │
│  • Custom validation                      │
│  • Error response on fail                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Domain Service Logic                 │
│  • Business rule implementation           │
│  • External service calls                 │
│  • Transaction handling                   │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Database Operations (ORM)            │
│  • Query execution                        │
│  • Model hydration                        │
│  • Relationships loading                  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    Data Transformation / Serialization    │
│  • Model to DTO                           │
│  • Field filtering                        │
│  • Relationship inclusion                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│     HTTP Response (JSON)                  │
│  {                                        │
│    "success": true,                       │
│    "data": {...},                         │
│    "message": "..."                       │
│  }                                        │
└──────────────┬───────────────────────────┘
               │
               ▼ HTTP 200 OK + Headers
┌──────────────────────────────────────────┐
│        React Component                    │
│  • Parse JSON response                    │
│  • Update state                           │
│  • Trigger re-render                      │
│  • Display result to user                 │
└──────────────────────────────────────────┘
```

---

## 🗂️ Project Directory Structure

### Backend (Laravel)

```
laravel02-be/
├── app/
│   ├── Console/
│   │   ├── Kernel.php              # Console command configuration
│   │   └── Commands/               # Custom artisan commands
│   │
│   ├── Exceptions/
│   │   └── Handler.php             # Global exception handling
│   │
│   ├── Http/
│   │   ├── Controllers/            # API request handlers
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PredictionController.php
│   │   │   │   ├── ChatController.php
│   │   │   │   ├── ArticleController.php
│   │   │   │   └── AdminController.php
│   │   │   └── ...
│   │   ├── Kernel.php              # HTTP middleware definition
│   │   ├── Middleware/             # Request middlewares
│   │   │   ├── Authenticate.php
│   │   │   ├── Admin.php
│   │   │   └── RateLimiting.php
│   │   └── Requests/               # Form request validation
│   │       ├── LoginRequest.php
│   │       ├── PredictionRequest.php
│   │       └── ...
│   │
│   ├── Models/                     # Eloquent models
│   │   ├── User.php
│   │   ├── Article.php
│   │   ├── Category.php
│   │   ├── Chat.php
│   │   ├── Dataset.php
│   │   ├── Role.php
│   │   ├── Permission.php
│   │   ├── PasswordReset.php
│   │   └── Sanctum/                # Sanctum models
│   │
│   ├── Services/                   # Business logic services
│   │   ├── AiService.php           # Gemini AI integration
│   │   ├── PredictionService.php
│   │   ├── AuthService.php
│   │   └── EmailService.php
│   │
│   ├── Traits/
│   │   └── HasRoles.php            # Role management trait
│   │
│   ├── Notifications/              # Email notifications
│   │   └── ResetPasswordNotification.php
│   │
│   └── Providers/                  # Service providers
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       ├── BroadcastServiceProvider.php
│       ├── EventServiceProvider.php
│       └── RouteServiceProvider.php
│
├── bootstrap/
│   ├── app.php                     # Application bootstrap
│   └── cache/                      # Bootstrap cache
│
├── config/                         # Configuration files
│   ├── app.php
│   ├── auth.php                    # Authentication config
│   ├── broadcasting.php            # WebSocket config
│   ├── cache.php                   # Cache drivers
│   ├── cors.php                    # CORS settings
│   ├── database.php                # Database connections
│   ├── filesystems.php             # Storage disks
│   ├── hashing.php                 # Password hashing
│   ├── logging.php                 # Logging channels
│   ├── mail.php                    # Email config
│   ├── permission.php              # Permission config
│   ├── queue.php                   # Queue drivers
│   ├── sanctum.php                 # Sanctum config
│   ├── services.php                # External services
│   ├── session.php                 # Session config
│   └── view.php                    # View paths
│
├── database/
│   ├── factories/                  # Model factories
│   ├── migrations/                 # Database migrations
│   │   ├── 2024_01_01_create_users_table.php
│   │   ├── 2024_01_02_create_roles_table.php
│   │   ├── 2024_01_03_create_permissions_table.php
│   │   └── ...
│   └── seeders/                    # Database seeders
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       └── ...
│
├── routes/
│   ├── api.php                     # API routes (RESTful)
│   ├── web.php                     # Web routes
│   ├── channels.php                # Broadcasting channels
│   └── console.php                 # Console routes
│
├── storage/
│   ├── app/                        # Application files
│   ├── framework/                  # Framework files
│   ├── logs/                       # Application logs
│   └── uploads/                    # User uploads
│
├── resources/
│   ├── css/                        # CSS files
│   ├── js/                         # JavaScript files
│   └── views/                      # Blade templates (if used)
│
├── tests/
│   ├── Feature/                    # Feature tests
│   ├── Unit/                       # Unit tests
│   ├── TestCase.php
│   └── CreatesApplication.php
│
├── vendor/                         # Composer dependencies
├── public/
│   ├── index.php                   # Application entry point
│   ├── storage                     # Symlink to storage
│   ├── robots.txt
│   └── build/                      # Front-end assets
│
├── .env                            # Environment variables
├── artisan                         # Artisan CLI
├── composer.json                   # PHP dependencies
├── phpunit.xml                     # PHPUnit configuration
└── README.md
```

### Frontend (React)

```
larvel02-fe/
├── app/
│   ├── components/                 # Reusable React components
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   ├── Dashboard/
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── Prediction/
│   │   │   ├── PredictionForm.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── HistoryChart.tsx
│   │   ├── Chat/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── InputField.tsx
│   │   ├── Articles/
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   └── ArticleDetail.tsx
│   │   ├── Admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── ArticleManagement.tsx
│   │   │   └── DatasetManagement.tsx
│   │   ├── Common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── Layout/
│   │       ├── MainLayout.tsx
│   │       ├── AuthLayout.tsx
│   │       └── AdminLayout.tsx
│   │
│   ├── pages/                      # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── UserDashboardPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── ArticlesPage.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── PredictionPage.tsx
│   │   ├── ResultsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── context/                    # React Context for state
│   │   ├── AuthContext.tsx         # Authentication context
│   │   ├── UserContext.tsx         # User data context
│   │   └── NotificationContext.tsx # Notifications
│   │
│   ├── stores/                     # State management
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── chatStore.ts
│   │   └── articleStore.ts
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   └── useNotification.ts
│   │
│   ├── routes/                     # Route configuration
│   │   ├── Routes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   │
│   ├── services/                   # API services
│   │   ├── authService.ts          # Auth API calls
│   │   ├── apiClient.ts            # Axios instance
│   │   ├── predictionService.ts
│   │   ├── chatService.ts
│   │   ├── articleService.ts
│   │   └── adminService.ts
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── User.ts
│   │   ├── Article.ts
│   │   ├── Prediction.ts
│   │   ├── Chat.ts
│   │   ├── ApiResponse.ts
│   │   └── index.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts           # Data formatting
│   │   ├── validators.ts           # Input validation
│   │   ├── dates.ts                # Date utilities
│   │   ├── errors.ts               # Error handling
│   │   └── constants.ts
│   │
│   ├── lib/                        # Library integrations
│   │   └── axios.ts                # HTTP client setup
│   │
│   ├── welcome/                    # Welcome/onboarding
│   │   └── WelcomeGuide.tsx
│   │
│   ├── App.tsx                     # Main App component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Root styles
│   └── main.tsx                    # Entry point
│
├── public/
│   └── assets/                     # Static assets
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── node_modules/                   # npm dependencies
├── .eslintrc.js                    # ESLint configuration
├── eslint.config.js
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                  # Vite configuration
├── postcss.config.js               # PostCSS config
├── tailwind.config.js              # Tailwind CSS config
├── index.html                      # HTML entry point
├── package.json                    # npm dependencies
└── README.md
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌──────────────────────────────────────────────────────┐
│                 Frontend (Browser)                   │
│  ┌──────────────────────────────────────────────────┐│
│  │ Local Storage / Session Storage                   ││
│  │ ├─ JWT Token                                      ││
│  │ ├─ Refresh Token (optional)                       ││
│  │ ├─ User ID                                        ││
│  │ └─ User Role                                      ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │ Request Interceptor                               ││
│  │ └─ Add Authorization header                       ││
│  │    Authorization: Bearer {token}                  ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
                         ⬇⬆
┌──────────────────────────────────────────────────────┐
│            Laravel Backend (API Server)             │
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │ HTTP Request Handler                              ││
│  │  • Parse headers                                  ││
│  │  • Extract token from Authorization header        ││
│  └─────────────────────────┬──────────────────────── ┘│
│                            ⬇                         │
│  ┌──────────────────────────────────────────────────┐│
│  │ Sanctum Middleware: auth:sanctum                  ││
│  │  • Verify token signature                         ││
│  │  • Check token expiration                         ││
│  │  • Validate token in personal_access_tokens table││
│  │  • Load authenticated user                        ││
│  └─────────────────────────┬──────────────────────── ┘│
│                            ⬇                         │
│  ┌──────────────────────────────────────────────────┐│
│  │ Authorization Middleware (Admin/User)             ││
│  │  • Check user role                                ││
│  │  • Validate permissions                           ││
│  │  • Resource ownership (if applicable)             ││
│  └─────────────────────────┬──────────────────────── ┘│
│                            ⬇                         │
│  ┌──────────────────────────────────────────────────┐│
│  │ Route Handler (Controller)                        ││
│  │  • Execute business logic                         ││
│  │  • Access Auth::user()                            ││
│  │  • Perform operation                              ││
│  └─────────────────────────┬──────────────────────── ┘│
│                            ⬇                         │
│  ┌──────────────────────────────────────────────────┐│
│  │ Response with Sensitive Headers                   ││
│  │  • X-CSRF-Token                                   ││
│  │  • Set-Cookie (session)                           ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
                         ⬇⬆
┌──────────────────────────────────────────────────────┐
│              Database Layer (MySQL)                 │
│  ┌──────────────────────────────────────────────────┐│
│  │ personal_access_tokens                            ││
│  │ ├─ id                                             ││
│  │ ├─ tokenable_id (user id)                         ││
│  │ ├─ name ("API Token")                             ││
│  │ ├─ token (hashed)                                 ││
│  │ ├─ abilities (permissions)                        ││
│  │ ├─ last_used_at                                   ││
│  │ └─ expires_at                                     ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### Authorization/RBAC

```
Database:
  users table
    ├─ id
    ├─ name
    ├─ email
    └─ ...

  roles table
    ├─ id
    ├─ name (user | admin | moderator)
    └─ guard_name

  permissions table
    ├─ id
    ├─ name (create-article | delete-user | etc)
    └─ guard_name

  model_has_roles (Pivot)
    ├─ user_id (FK)
    └─ role_id (FK)

  role_has_permissions (Pivot)
    ├─ role_id (FK)
    └─ permission_id (FK)

User Object:
  User::with('roles', 'permissions')
    ├─ roles()
    │   └─ BelongsToMany(Role)
    │       └─ permissions()
    │           └─ BelongsToMany(Permission)
    │
    └─ Methods:
        ├─ hasRole('admin')         → boolean
        ├─ hasPermission('edit-article') → boolean
        ├─ assignRole('user')       → void
        ├─ givePermissionTo('create-article') → void
        └─ can('manage-users')      → boolean (via policies)

Middleware Protection:
  Route::middleware(['auth:sanctum', 'role:admin'])
    ├─ Only admin users can access
    └─ Returns 403 if unauthorized
```

---

## 🔄 Data Flow Examples

### Example 1: User Login

```
1. Frontend: POST /api/login
   {
     "email": "user@example.com",
     "password": "secret123"
   }

2. Backend: AuthController@login
   ├─ Validate input (email, password format)
   ├─ Query: User::where('email', $email)->first()
   ├─ Verify password: Hash::check($password, $user->password)
   ├─ If valid:
   │   ├─ Generate token: $user->createToken('api-token')
   │   ├─ Store in personal_access_tokens
   │   └─ Return: { token, user, roles, permissions }
   └─ If invalid: Return 401 Unauthorized

3. Frontend: Store response
   ├─ localStorage.setItem('auth_token', token)
   ├─ localStorage.setItem('user', JSON.stringify(user))
   ├─ Update AuthContext
   └─ Redirect to /user dashboard

4. Subsequent requests:
   ├─ Axios interceptor: Add Authorization header
   ├─ Server: Sanctum verifies token
   └─ Allows access to protected routes
```

### Example 2: Prediction Request

```
1. Frontend: User fills prediction form
   ├─ Age: 45
   ├─ Gender: Male
   ├─ Blood Pressure: 140/90
   ├─ Cholesterol: 240
   ├─ Heart Rate: 75
   └─ Client-side validation passes

2. Frontend: POST /api/predict
   ├─ Headers: Authorization: Bearer {token}
   └─ Body: { age, gender, blood_pressure, cholesterol, heart_rate, ... }

3. Backend: PredictionController@predict
   ├─ Auth check: User authenticated? ✓
   ├─ Validate request: PredictionRequest validates inputs
   ├─ Call PredictionService:
   │   ├─ Format data for Python script
   │   ├─ Call Python ML service: python predict.py
   │   ├─ Parse output: { risk_score: 0.75, level: 'high' }
   │   └─ Generate recommendations
   ├─ Store in MongoDB:
   │   └─ db.predictions.insertOne({
   │       user_id: auth()->id(),
   │       input_data: { ... },
   │       risk_score: 0.75,
   │       level: 'high',
   │       created_at: now()
   │     })
   └─ Return response:
       {
         "risk_score": 0.75,
         "level": "high",
         "interpretation": "...",
         "recommendations": ["..."]
       }

4. Frontend:
   ├─ Parse response
   ├─ Update component state
   ├─ Display chart/visualization
   └─ Show to user
```

### Example 3: AI Chat Request

```
1. Frontend: User inputs "Apa itu hipertensi?"

2. Frontend: POST /api/chat
   ├─ Headers: Authorization: Bearer {token}
   └─ Body: { message: "Apa itu hipertensi?" }

3. Backend: ChatController@send
   ├─ Auth check ✓
   ├─ Validate message (not empty, length check)
   ├─ Call AiService:
   │   ├─ Get previous chat history (for context)
   │   ├─ Build system prompt:
   │   │   "Anda adalah HeartGuard Assistant..."
   │   ├─ Build conversation:
   │   │   ├─ [system]: System instructions
   │   │   ├─ [previous messages]: Chat history
   │   │   └─ [user]: "Apa itu hipertensi?"
   │   │
   │   ├─ Call Gemini API:
   │   │   POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
   │   │   ├─ Model: gemini-2.5-flash
   │   │   ├─ Temperature: 0.4
   │   │   ├─ MaxTokens: 500
   │   │   └─ systemInstruction: {...}
   │   │
   │   ├─ Receive response: "Hipertensi adalah..."
   │   └─ Validate response (check boundaries, terms)
   │
   ├─ Store in MongoDB:
   │   └─ db.chats.insertOne({
   │       user_id: auth()->id(),
   │       message: "Apa itu hipertensi?",
   │       response: "Hipertensi adalah...",
   │       tokens_used: 150,
   │       created_at: now()
   │     })
   │
   └─ Return response:
       {
         "id": "...",
         "message": "Apa itu hipertensi?",
         "response": "Hipertensi adalah...",
         "created_at": "..."
       }

4. Frontend:
   ├─ Display message in chat
   ├─ Display AI response
   ├─ Store in local state
   └─ Ready for next message
```

---

## 📊 Database Relationships

### MySQL Relationships

```
Users (1) ──→ (M) Model_has_roles ←─ (M) Roles
Users (1) ──→ (M) Personal_access_tokens
Users (1) ──→ (M) Articles (author_id)
Users (1) ──→ (M) Password_reset_tokens

Roles (1) ──→ (M) Role_has_permissions ←─ (M) Permissions

Categories (1) ──→ (M) Articles

---

Users          Roles           Permissions
─────────      ─────────       ───────────
id             id              id
name           name            name
email          guard_name      guard_name
password

               model_has_roles          role_has_permissions
               ──────────────          ────────────────────
               model_id (FK)           permission_id (FK)
               model_type              role_id (FK)
               role_id (FK)
```

### MongoDB Collections

```
articles
┌─────────────────────────────────┐
├─ _id (ObjectId)                 │
├─ title: String                  │
├─ slug: String (indexed)         │
├─ content: String (HTML)         │
├─ raw_content: Object (EditorJS) │
├─ category_id: String            │
├─ thumbnail: String (URL)        │
├─ author_id: Number (FK to MySQL)│
├─ status: String (enum)          │
├─ view_count: Number             │
├─ created_at: Date               │
├─ updated_at: Date               │
└─ published_at: Date             │
└─────────────────────────────────┘

chats
┌─────────────────────────────────┐
├─ _id (ObjectId)                 │
├─ user_id: Number (FK)           │
├─ message: String                │
├─ response: String               │
├─ tokens_used: Number            │
├─ temperature: Number            │
├─ created_at: Date               │
└─ updated_at: Date               │
└─────────────────────────────────┘

datasets
┌─────────────────────────────────┐
├─ _id (ObjectId)                 │
├─ name: String                   │
├─ description: String            │
├─ file_path: String              │
├─ sample_count: Number           │
├─ accuracy_score: Number         │
├─ status: String (enum)          │
├─ version: Number                │
├─ uploaded_by: Number (FK)       │
├─ created_at: Date               │
└─ updated_at: Date               │
└─────────────────────────────────┘
```

---

## 🎯 Performance Optimization

### Caching Strategy

```
Level 1: Frontend Caching
  ├─ localStorage: Auth tokens, user preferences
  ├─ sessionStorage: Temporary data
  ├─ React Query: API response caching
  └─ Memory cache: Component state

Level 2: HTTP Caching
  ├─ Browser cache headers (Cache-Control)
  ├─ ETags for conditional requests
  └─ 304 Not Modified responses

Level 3: Backend Caching
  ├─ Route cache: Config values
  ├─ Query caching: Frequently accessed data
  ├─ Redis cache:
  │   ├─ User authentication sessions
  │   ├─ Article list caches
  │   └─ Rate limiting counters
  └─ Database query optimization:
      ├─ Indexing on frequently queried columns
      ├─ Eager loading (with()) to avoid N+1
      └─ Query result caching
```

### Database Indexes

```
MySQL:
  users
    ├─ PRIMARY KEY (id)
    ├─ UNIQUE INDEX (email)
    └─ INDEX (created_at)

  articles (MongoDB)
    ├─ INDEX (_id)
    ├─ UNIQUE INDEX (slug)
    └─ INDEX (created_at, status)

  chats (MongoDB)
    ├─ INDEX (user_id)
    └─ INDEX (created_at)
```

---

## 🚀 Deployment Architecture

### Development Environment

```
localhost:5173 (Frontend Dev Server)
       ⬇
Vite dev server with HMR

localhost:8000 (Backend Dev Server)
       ⬇
Laravel artisan serve

MySQL on localhost:3306
MongoDB on localhost:27017
```

### Production Environment

```
┌─────────────────────────────────────────┐
│          CDN / Static Host              │
│  (Frontend built assets)                │
│  ├─ index.html                          │
│  ├─ assets/ (JS, CSS, images)           │
│  └─ Cache-Control: max-age              │
└─────────────────────────────────────────┘
                 ⬇⬆
┌─────────────────────────────────────────┐
│   Load Balancer (Nginx)                 │
│  ├─ HTTPS/TLS termination               │
│  ├─ Route to backend servers            │
│  ├─ Compression (gzip)                  │
│  └─ Rate limiting                       │
└─────────────────────────────────────────┘
                 ⬇⬆
┌─────────────────────────────────────────┐
│   Backend Servers (Laravel) [x3]        │
│  ├─ Application instances               │
│  ├─ Session management                  │
│  └─ Shared storage                      │
└─────────────────────────────────────────┘
         ⬇⬆        ⬇⬆        ⬇⬆
┌──────────────┐ ┌──────────────┐
│  MySQL       │ │  MongoDB     │
│  (Primary-   │ │  (Replica    │
│   Replica)   │ │   Set)       │
└──────────────┘ └──────────────┘
```

---

*This architecture design ensures scalability, security, and maintainability of the HeartPredict application.*

