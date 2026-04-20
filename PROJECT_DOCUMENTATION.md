# 📋 HeartPredict - Dokumentasi Proyek Lengkap

## 📌 Ringkasan Eksekutif

**HeartPredict** adalah aplikasi web full-stack yang mengintegrasikan AI (Google Gemini) untuk memberikan:
- **Prediksi risiko penyakit jantung** berbasis machine learning
- **Konsultasi kesehatan jantung** dengan AI chatbot berkode etika
- **Manajemen konten edukatif** tentang kesehatan jantung
- **Dashboard admin** untuk pengelolaan sistem

---

## 🎯 Fitur-Fitur Utama

### 1️⃣ **Sistem Autentikasi & Otorisasi**

#### Fitur:
- ✅ Registrasi pengguna dengan validasi email
- ✅ Login aman dengan rate limiting (max 5 percobaan/60 detik)
- ✅ Password reset workflow (forgot → verify → reset)
- ✅ JWT tokens menggunakan Laravel Sanctum
- ✅ Role-based access control (User, Admin)

#### Alur Login:
```
1. User register → Assigned 'user' role
2. User login → Sanctum token issued
3. Token dikirim dengan setiap request → Middleware validasi
4. Token expired → User re-authenticate
```

---

### 2️⃣ **Sistem Prediksi Penyakit Jantung**

#### Input Prediksi:
- 👤 **Demografis:** Usia, Jenis Kelamin
- 🫀 **Vital Signs:** Tekanan Darah, Kolesterol, Detak Jantung
- 📋 **Riwayat Medis:** Kondisi kesehatan sebelumnya
- 🏥 **Data klinis:** Gejala yang dialami

#### Output:
- 📊 Skor risiko penyakit jantung (persentase)
- 💡 Interpretasi hasil
- 📈 Visualisasi data prediksi
- 💾 Riwayat semua prediksi pengguna

#### Teknologi:
- Backend prediction: Python ML script (terintegrasi)
- Real-time processing
- Result visualization di frontend

---

### 3️⃣ **AI Health Consultant (HeartGuard Assistant)**

#### Karakteristik:
- **AI Provider:** Google Generative AI (Gemini 2.5 Flash)
- **Model Temperature:** 0.4 (konsistensi tinggi)
- **Max Tokens:** 500 (jawaban lengkap)
- **Bahasa:** Indonesian
- **Respons Time:** Real-time

#### Fitur Keamanan AI:
```
✓ Disclaimer medis wajib (bukan diagnosis definitif)
✓ Boundary enforcement (hanya topik kesehatan jantung)
✓ Off-topic query redirection
✓ Persona konsisten: "HeartGuard Assistant"
✓ Input validation & sanitization
```

#### Chat History:
- 💾 Disimpan di MongoDB
- 📱 Dapat diakses kembali kapan saja
- 🔐 Private per user

---

### 4️⃣ **Manajemen Konten Edukatif**

#### Fitur:
- ✍️ Blog articles tentang kesehatan jantung
- 📝 Rich text editing dengan EditorJS
- 🏷️ Kategorisasi artikel
- 🔍 Slug-based URL untuk SEO
- 👤 Atribusi penulis
- 📸 Thumbnail/featured image

#### Status Artikel:
- Draft
- Published
- Archived

---

### 5️⃣ **Admin Dashboard**

#### Statistik & Analytics:
- 👥 Total users
- 📊 Prediksi hari ini
- 📈 Trend kesehatan
- 🔄 Activity overview

#### Manajemen User:
- 📋 List users dengan pagination
- ➕ Create/Edit/Delete user
- 🎭 Assign roles
- 🔒 Permission management

#### Manajemen Artikel:
- 📰 CRUD lengkap
- 🏷️ Category management
- 📅 Schedule publishing
- 👁️ View analytics

#### Manajemen Dataset:
- 📂 Upload ML datasets
- 📊 Versioning & accuracy tracking
- 🧹 Dataset cleanup
- 📈 Performance metrics

#### Manajemen Kategori:
- ✏️ Create/Edit/Delete
- 🔗 Hubungan dengan artikel
- 🏷️ Slug generation

---

### 6️⃣ **User Dashboard**

#### Menu Pengguna:
```
/user/                    → Dashboard overview
/user/cek-kesehatan       → Health check (prediction form)
/user/hasil-prediksi      → Prediction results history
/user/konsultasi          → AI health consultant chat
/user/rekomendasi         → Medical recommendations
/user/riwayat             → Complete examination history
/user/profile             → Profile management
```

#### Fitur:
- 📊 Quick health check
- 📈 Historical data visualization
- 💬 AI consultation interface
- 👤 Profile editor
- 🔐 Password management

---

## 🛠 **Teknologi Stack**

### Backend
```
Framework       → Laravel 10.x
Language        → PHP 8.1+
API Protocol    → RESTful + WebSockets (Broadcasting)
Authentication  → Sanctum JWT Tokens
Database ORM    → Eloquent
Queue Jobs      → Database queue
```

### Frontend
```
Framework       → React 19.2
Language        → TypeScript 5.9
Routing         → React Router DOM v7
HTTP Client     → Axios
Build Tool      → Vite with Rolldown
Styling         → Tailwind CSS 3.4
Icons           → Lucide React
Animations      → Framer Motion
Rich Editor     → EditorJS
```

### Databases
```
Primary         → MySQL 8.0+ (Relational)
Secondary       → MongoDB (Document)
```

### External Services
```
AI Model        → Google Generative AI (Gemini 2.5 Flash)
Email Service   → SMTP (Gmail)
File Storage    → Local + Cloud (optional)
```

---

## 🗄️ **Arsitektur Database**

### MySQL (Relational Data)

```
├─ users
│  ├─ id (PK)
│  ├─ name
│  ├─ email (UNIQUE)
│  ├─ password (hashed)
│  ├─ phone_number
│  ├─ profile_picture
│  ├─ email_verified_at
│  └─ timestamps
│
├─ roles
│  ├─ id (PK)
│  ├─ name (UNIQUE)
│  ├─ guard_name
│  └─ timestamps
│
├─ permissions
│  ├─ id (PK)
│  ├─ name (UNIQUE)
│  ├─ guard_name
│  └─ timestamps
│
├─ model_has_roles (Pivot)
│  ├─ role_id (FK)
│  └─ model_id (FK to users)
│
├─ role_has_permissions (Pivot)
│  ├─ permission_id (FK)
│  └─ role_id (FK)
│
├─ categories
│  ├─ id (PK)
│  ├─ name
│  ├─ slug (UNIQUE)
│  └─ timestamps
│
├─ password_reset_tokens
│  ├─ email
│  ├─ token
│  └─ created_at
│
├─ personal_access_tokens (Sanctum)
│  ├─ id (PK)
│  ├─ tokenable_id
│  ├─ tokenable_type
│  ├─ name
│  ├─ token (hashed)
│  ├─ abilities
│  ├─ last_used_at
│  └─ timestamps
│
└─ jobs
   ├─ id (PK)
   ├─ queue
   ├─ payload (JSON)
   └─ timestamps
```

### MongoDB (Document Data)

```
├─ articles
│  ├─ _id (ObjectId)
│  ├─ title
│  ├─ slug (indexed)
│  ├─ content (HTML)
│  ├─ raw_content (EditorJS)
│  ├─ category_id
│  ├─ thumbnail (URL/path)
│  ├─ author_id
│  ├─ status (draft|published|archived)
│  ├─ view_count
│  ├─ created_at
│  ├─ updated_at
│  └─ published_at
│
├─ chats
│  ├─ _id (ObjectId)
│  ├─ user_id (indexed)
│  ├─ message
│  ├─ response
│  ├─ tokens_used
│  ├─ temperature
│  ├─ created_at
│  └─ updated_at
│
└─ datasets
   ├─ _id (ObjectId)
   ├─ name
   ├─ description
   ├─ file_path
   ├─ sample_count
   ├─ accuracy_score
   ├─ status (active|archived)
   ├─ version
   ├─ uploaded_by
   ├─ created_at
   └─ updated_at
```

---

## 🔌 **API Endpoints**

### Authentication (Public)

```
POST   /api/login
  Params: email, password
  Response: { token, user }

POST   /api/register
  Params: name, email, password, password_confirmation
  Response: { message, user }

POST   /api/forgot-password
  Params: email
  Response: { message }

POST   /api/verify-token
  Params: token
  Response: { valid: boolean }

POST   /api/reset-password
  Params: token, email, password, password_confirmation
  Response: { message }
```

### Prediction (Public)

```
POST   /api/predict
  Params: age, gender, blood_pressure, cholesterol, heart_rate, medical_history
  Response: { 
    risk_score: float,
    risk_level: string (low|medium|high),
    interpretation: string,
    recommendations: array
  }
```

### Articles (Public)

```
GET    /api/articles
  Query: page=1, per_page=10, category=id
  Response: { data: [], meta: { pagination } }

GET    /api/articles/{slug}
  Response: { 
    id, title, content, author, category,
    created_at, updated_at, view_count
  }
```

### Categories (Public)

```
GET    /api/categories
  Response: [ { id, name, slug, article_count } ]
```

### Health Consultant (Public)

```
POST   /api/test-ai
  Params: message
  Response: { response, tokens_used }
```

### User Authenticated

```
POST   /api/logout
  Headers: Authorization: Bearer {token}
  Response: { message }

GET    /api/me
  Headers: Authorization: Bearer {token}
  Response: { user object }

GET    /api/chats
  Headers: Authorization: Bearer {token}
  Query: page=1, per_page=20
  Response: { data: [], meta: {} }

POST   /api/chat
  Headers: Authorization: Bearer {token}
  Params: message
  Response: { id, message, response, created_at }

PUT    /api/profile
  Headers: Authorization: Bearer {token}
  Params: name, phone_number, profile_picture
  Response: { user object }
```

### Admin Endpoints (Admin Only)

```
GET    /api/admin/stats
  Response: { 
    total_users: int,
    predictions_today: int,
    active_chats: int,
    articles: int
  }

──── Users Management ────

GET    /api/admin/users
  Query: page=1, per_page=15, search=email
  Response: { data: [], meta: {} }

POST   /api/admin/users
  Params: name, email, password, phone_number, role_id
  Response: { user object }

PUT    /api/admin/users/{id}
  Params: name, email, phone_number, role_id
  Response: { user object }

DELETE /api/admin/users/{id}
  Response: { message }

──── Articles Management ────

GET    /api/admin/articles
  Query: page=1, per_page=15, status=published
  Response: { data: [], meta: {} }

POST   /api/admin/articles
  Params: title, content, category_id, thumbnail, status
  Response: { article object }

PUT    /api/admin/articles/{id}
  Params: title, content, category_id, thumbnail, status
  Response: { article object }

DELETE /api/admin/articles/{id}
  Response: { message }

──── Datasets Management ────

GET    /api/admin/datasets
  Response: [ { id, name, accuracy_score, status, version } ]

POST   /api/admin/datasets
  Params: name, description, file (CSV/JSON), sample_count
  Response: { dataset object }

PUT    /api/admin/datasets/{id}
  Params: name, description, accuracy_score, status
  Response: { dataset object }

DELETE /api/admin/datasets/{id}
  Response: { message }

──── Categories Management ────

POST   /api/admin/categories
  Params: name
  Response: { category object }

PUT    /api/admin/categories/{id}
  Params: name
  Response: { category object }

DELETE /api/admin/categories/{id}
  Response: { message }
```

---

## 🏗️ **Arsitektur Sistem**

### Diagram Alur Data

```
┌──────────────────────────────────────────────────────────────┐
│                Frontend (React + TypeScript)                 │
│  ┌────────────────┬────────────────┬───────────────────────┐ │
│  │  Auth Pages    │   User Pages   │  Admin Dashboard      │ │
│  │ • Login        │ • Dashboard    │ • Statistics          │ │
│  │ • Register     │ • Health Check │ • User Management     │ │
│  │ • Forgot Pass  │ • Results      │ • Article Management  │ │
│  │ • Reset Pass   │ • Chat        │ • Dataset Management  │ │
│  │                │ • History      │ • Category Mgmt       │ │
│  └────────────────┴────────────────┴───────────────────────┘ │
│                                                               │
│         ⬇⬆ Axios + Sanctum JWT Tokens ⬇⬆                     │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────────┐  ┌───────▼──────────┐  ┌──────▼──────────┐
│  Laravel REST    │  │   External APIs  │  │  Background     │
│  API Server      │  │                  │  │  Processing     │
│                  │  │ • Gemini API     │  │                 │
│ ┌──────────────┐ │  │ • Gmail SMTP     │  │ • Queue Jobs    │
│ │ Controllers  │ │  │ • Python ML      │  │ • Predictions   │
│ │ Services     │ │  │                  │  │ • Notifications │
│ │ Middleware   │ │  └──────────────────┘  └─────────────────┘
│ │ Validators   │ │
│ └──────────────┘ │
└───────┬──────────┘
        │
        ├──────────────────┬──────────────────┬──────────────────┐
        │                  │                  │                  │
        ▼                  ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────────┐
│    MySQL     │   │   MongoDB    │   │ Python ML    │   │  Storage   │
│              │   │              │   │  Service     │   │  (Local)   │
│ • Users      │   │ • Articles   │   │              │   │            │
│ • Roles      │   │ • Chats      │   │ • Training   │   │ • Profile  │
│ • Perms      │   │ • Datasets   │   │ • Prediction │   │ • Images   │
│ • Categories │   │ • History    │   │              │   │ • Uploads  │
│ • Tokens     │   │              │   │              │   │            │
└──────────────┘   └──────────────┘   └──────────────┘   └────────────┘
```

### Alur Prediksi

```
┌─────────────┐
│   User      │
│ Input Form  │
└──────┬──────┘
       │ (age, gender, vitals, etc)
       ▼
┌──────────────────────┐
│ Frontend Validation  │
│ (TypeScript)         │
└──────┬───────────────┘
       │ POST /api/predict
       ▼
┌──────────────────────┐
│ Laravel Controller   │
│ • Validate data      │
│ • Normalize inputs   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Python ML Service    │
│ • Load model         │
│ • Process features   │
│ • Generate score     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Store Result         │
│ • Save to MongoDB    │
│ • Update user stats  │
└──────┬───────────────┘
       │ Response with score & interpretation
       ▼
┌──────────────────────┐
│ Frontend             │
│ Display Results      │
│ + Visualization      │
└──────────────────────┘
```

### Alur AI Chat

```
┌─────────────┐
│   User      │
│ Chat Input  │
└──────┬──────┘
       │ "Saya sakit dada"
       ▼
┌──────────────────────┐
│ Frontend Validation  │
│ • Input sanitization │
│ • Length check       │
└──────┬───────────────┘
       │ POST /api/chat
       ▼
┌──────────────────────┐
│ AiService            │
│ • Build context      │
│ • Include history    │
│ • Set system prompt  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Gemini API Call      │
│ • Send prompt        │
│ • Generate response  │
│ • Temp: 0.4         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Validate Response    │
│ • Check boundaries   │
│ • Ensure disclaimer  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Store in MongoDB     │
│ • Save message       │
│ • Save response      │
│ • Store timestamp    │
└──────┬───────────────┘
       │ Return response
       ▼
┌──────────────────────┐
│ Frontend             │
│ Display Chat         │
│ + Formatting         │
└──────────────────────┘
```

---

## 🔐 **Sistem Keamanan**

### Authentication
- ✅ **JWT Tokens** via Laravel Sanctum
- ✅ **Password Hashing** dengan bcrypt
- ✅ **Rate Limiting** pada login (5 attempts/60 sec)
- ✅ **Email Verification** workflow
- ✅ **Token Expiration** & refresh mechanism

### Authorization
- ✅ **Role-Based Access Control (RBAC)**
  - User → Standard features
  - Admin → All management features
- ✅ **Permission System**
  - Fine-grained permissions
  - Dynamic role assignment
- ✅ **Middleware Protection**
  - Routes validation
  - Admin middleware check
- ✅ **Policy-Based Authorization** (per resource)

### API Security
- ✅ **CORS Configuration** (controlled origins)
- ✅ **CSRF Protection** (middleware)
- ✅ **Input Validation** (all controllers)
- ✅ **SQL Injection Prevention** (prepared statements)
- ✅ **XSS Prevention** (output encoding)
- ✅ **Request Throttling** (global limits)

### Data Protection
- ✅ **HTTPS Encryption** (SSL/TLS)
- ✅ **Sensitive Field Hashing** (passwords, tokens)
- ✅ **PII Protection** (profile pictures, phone numbers)
- ✅ **Chat History Encryption** (optional)

### AI Guardrails
- ✅ **Medical Disclaimer** enforcement
- ✅ **Topic Boundary Enforcement** (cardiac only)
- ✅ **Input Content Filtering**
- ✅ **Response Validation**
- ✅ **Personality Consistency** (HeartGuard persona)

---

## 🔧 **Konfigurasi Penting**

### Environment Variables (.env)

```bash
# APP
APP_NAME=HeartPredict
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=http://localhost:8000

# DATABASE
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=heartpredict
DB_USERNAME=root
DB_PASSWORD=

# MONGODB
MONGODB_CONNECTION=mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=heartpredict

# MAIL
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@heartpredict.com

# GEMINI API
GEMINI_API_KEY=your_gemini_api_key

# SANCTUM
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
SESSION_DOMAIN=localhost
```

### Broadcasting & WebSockets
- Real-time updates untuk chat
- Push notifications untuk hasil prediksi
- Status live untuk admin dashboard

---

## 📊 **Alur Bisnis Utama**

### 1. User Registration & Onboarding

```
Register (Email) → Verify Email → Auto-assigned 'user' role → Ready to use app
```

### 2. Health Prediction Journey

```
Fill Form → Validate Input → Send to Python ML → Get Score → Store Result → Display to User
```

### 3. AI Consultation

```
Ask Question → Validate Input → Call Gemini API → Store Chat → Display Response
```

### 4. Content Discovery

```
Browse Articles → Filter by Category → Read Article → Comment/Share
```

### 5. Admin Content Management

```
Create Article → Add Metadata → Set Category → Publish → Monitor Views
```

---

## 💾 **Backup & Recovery**

### Database Backup Strategy
```
MySQL:
  • Daily incremental backups
  • Weekly full backups
  • 30-day retention

MongoDB:
  • Daily backups
  • Cloud backup (AWS S3/Azure)
  • Replication enabled
```

### Recovery Procedures
```
• Database restoration from backups
• Chat history recovery
• File asset recovery
• Configuration rollback
```

---

## 📈 **Scaling Considerations**

### Current Architecture
- Single server deployment
- Local file storage
- Database on same server

### For Production Scale

```
Frontend:
  • CDN for static assets
  • Load balancing (Nginx)
  • Caching layer (Redis)

Backend:
  • Multiple Laravel instances
  • Queue workers (separate servers)
  • Database replication

Databases:
  • MySQL: Master-slave replication
  • MongoDB: Replica set
  • Read replicas for analytics

Caching:
  • Redis for session/cache
  • Query caching
  • API response caching

Storage:
  • Cloud storage (S3/Azure Blob)
  • CDN for media
  • Backup to cloud
```

---

## 🚀 **Deployment**

### Local Development
```bash
# Backend
composer install
php artisan migrate
php artisan serve (port 8000)

# Frontend
npm install
npm run dev (port 5173)
```

### Production Deployment

```
1. Backend Setup
   - Deploy to server
   - Configure .env
   - Run migrations
   - Set up queue workers
   - Configure SSL

2. Frontend Build
   - npm run build
   - Deploy to CDN/static server
   - Configure CORS

3. Services
   - Configure email service
   - Setup Gemini API
   - Initialize MongoDB
   - Setup file storage
```

---

## 📝 **Fitur Mendatang (Roadmap)**

- [ ] Mobile app (React Native)
- [ ] Predictive analytics dashboard
- [ ] Integration dengan electronic medical records (EMR)
- [ ] Appointment scheduling dengan dokter
- [ ] Video consultation feature
- [ ] Wearable device integration
- [ ] Multi-language support
- [ ] Advanced reporting untuk admin

---

## 📞 **Support & Maintenance**

### Monitoring
```
• Server uptime (24/7)
• Database performance
• API response times
• Error tracking (Sentry)
• User analytics
```

### Regular Maintenance
```
• Security patches (weekly)
• Dependency updates (monthly)
• Database optimization (monthly)
• Log rotation (daily)
• Cache cleanup (weekly)
```

---

**Dokumentasi ini akan diperbarui seiring dengan evolusi proyek.** 📚

*Last Updated: 2026-04-18*
