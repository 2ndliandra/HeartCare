# 💚 HeartPredict - Complete Documentation

![HeartPredict](https://img.shields.io/badge/Status-Active%20Development-blue)
![Laravel](https://img.shields.io/badge/Laravel-10.x-red)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 What is HeartPredict?

**HeartPredict** is an innovative AI-powered web application designed for **early detection and monitoring of heart disease risk**. It combines machine learning predictions with an intelligent health consultant powered by Google Gemini AI, providing users with comprehensive cardiac health insights.

### Key Highlights

✨ **AI-Powered Predictions** - Machine learning model predicts heart disease risk based on medical parameters
🤖 **AI Health Consultant** - Google Gemini chatbot provides cardiac health guidance
📚 **Educational Content** - Curated articles about heart health and prevention
👨‍⚕️ **Admin Dashboard** - Complete system management for administrators
🔐 **Secure & Private** - Enterprise-grade security with role-based access control
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 📚 Documentation Files

### Quick Navigation

| Document | Purpose | For Whom |
|----------|---------|----------|
| **[DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)** | Getting started guide & common commands | 👨‍💻 Developers |
| **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** | Complete feature overview & system design | 📋 Everyone |
| **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** | Technical architecture & data flows | 🏗️ Architects & Senior Devs |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API endpoint reference | 📡 API Users & Frontend Devs |

### Documentation Overview

#### 🚀 [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) - START HERE
Quick start guide for local development:
- Prerequisites and installation steps
- Backend (Laravel) setup
- Frontend (React) setup
- Common development tasks
- Debugging tips
- Testing instructions

**Best for:** New developers, quick setup

#### 📋 [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) - FEATURES & DESIGN
Comprehensive feature documentation:
- Project overview and technology stack
- All major features explained
- Database architecture (MySQL + MongoDB)
- API endpoint summary
- System design diagrams
- Security implementation
- Business workflows
- Deployment information

**Best for:** Understanding what the app does, stakeholders, product managers

#### 🏗️ [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) - TECHNICAL DEEP DIVE
Technical architecture and system design:
- Layered architecture pattern
- Component interaction flows
- Request-response cycle
- Complete directory structure (backend & frontend)
- Security architecture (authentication, authorization, RBAC)
- Data flow examples with diagrams
- Database relationships
- Performance optimization strategies
- Deployment architecture

**Best for:** Technical architects, senior developers, code reviewers

#### 📡 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API REFERENCE
Complete API endpoint documentation:
- All REST endpoints with examples
- Request/response formats
- Query parameters and filtering
- Error handling
- Rate limiting
- Pagination and sorting
- Testing examples with cURL/Postman
- Authentication flows

**Best for:** Frontend developers, API integration, testing

---

## 🎯 Features at a Glance

### 1. User Authentication
- ✅ Register & Login
- ✅ Email verification
- ✅ Password reset workflow
- ✅ JWT token authentication (Sanctum)
- ✅ Rate limiting

### 2. Heart Disease Prediction
- ✅ Input form for medical parameters
- ✅ ML-based risk prediction
- ✅ Prediction history tracking
- ✅ Risk score visualization
- ✅ Personalized recommendations

### 3. AI Health Consultant
- ✅ Google Gemini integration
- ✅ Natural language cardiac health advice
- ✅ Medical disclaimer enforcement
- ✅ Chat history storage
- ✅ Indonesian language support

### 4. Educational Content
- ✅ Blog articles about heart health
- ✅ Rich text editing (EditorJS)
- ✅ Category organization
- ✅ SEO-friendly URLs
- ✅ Author attribution

### 5. Admin Dashboard
- ✅ System statistics
- ✅ User management (CRUD)
- ✅ Article management (CRUD)
- ✅ Dataset versioning
- ✅ Category management

### 6. User Dashboard
- ✅ Quick health check
- ✅ Prediction results history
- ✅ AI consultation access
- ✅ Medical recommendations
- ✅ Profile management

---

## 🛠 Technology Stack

### Backend
```
Framework:     Laravel 10.x (PHP 8.1+)
API:           RESTful + Sanctum JWT
Databases:     MySQL 8.0+ (relational)
               MongoDB 5.0+ (documents)
External APIs: Google Generative AI (Gemini 2.5 Flash)
Queue:         Database-backed queue
```

### Frontend
```
Framework:     React 19.2
Language:      TypeScript 5.9
Routing:       React Router v7
Styling:       Tailwind CSS 3.4
HTTP Client:   Axios
Build Tool:    Vite with Rolldown
Icons:         Lucide React
Animation:     Framer Motion
Rich Editor:   EditorJS
```

### Databases
```
MySQL:         User authentication, roles, permissions
MongoDB:       Articles, chats, datasets, history
```

---

## 🏃 Quick Start

### For Developers

```bash
# 1. Clone repository
git clone <repo-url>
cd Projek01

# 2. Backend setup
cd laravel02-be
composer install
cp .env.example .env
php artisan key:generate
# Configure .env (DB, MongoDB, Gemini API key)
php artisan migrate
php artisan serve  # Runs on localhost:8000

# 3. Frontend setup (new terminal)
cd larvel02-fe
npm install
npm run dev  # Runs on localhost:5173

# 4. Access application
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
```

**See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for detailed instructions**

---

## 📊 Database Overview

### MySQL (Relational)
```
users, roles, permissions, categories,
personal_access_tokens, password_reset_tokens,
model_has_roles (pivot), role_has_permissions (pivot)
```

### MongoDB (Document)
```
articles     - Blog posts with rich content
chats        - AI consultation history
datasets     - ML model datasets with versioning
```

**See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for complete schema**

---

## 🔌 Main API Endpoints

### Authentication
```
POST   /api/login              Login user
POST   /api/register           Create account
POST   /api/logout             Logout user
GET    /api/me                 Get current user
```

### Predictions
```
POST   /api/predict            Make prediction
GET    /api/predictions        Get history
GET    /api/predictions/{id}   Get detail
```

### Chat
```
POST   /api/chat               Send message
GET    /api/chats              Get history
```

### Articles
```
GET    /api/articles           List articles
GET    /api/articles/{slug}    Get article
GET    /api/categories         List categories
```

### Admin
```
GET    /api/admin/stats        Dashboard stats
GET    /api/admin/users        List users
GET    /api/admin/articles     List articles
```

**See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference**

---

## 🏗 Project Structure

```
Projek01/
├── laravel02-be/              ← Backend (Laravel)
│   ├── app/
│   │   ├── Http/Controllers/  ← API handlers
│   │   ├── Models/            ← Database models
│   │   └── Services/          ← Business logic
│   ├── routes/api.php         ← API routes
│   ├── database/              ← Migrations & seeds
│   └── config/                ← Configuration
│
├── larvel02-fe/               ← Frontend (React)
│   ├── app/
│   │   ├── components/        ← Reusable components
│   │   ├── pages/             ← Page components
│   │   ├── services/          ← API calls
│   │   ├── hooks/             ← Custom hooks
│   │   └── routes/            ← Route configuration
│   └── vite.config.ts        ← Build config
│
├── PROJECT_DOCUMENTATION.md   ← THIS YOU ARE READING
├── SYSTEM_ARCHITECTURE.md     ← Technical design
├── API_DOCUMENTATION.md       ← API reference
├── DEVELOPMENT_SETUP.md       ← Getting started
└── README.md                  ← Original project README
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** via Sanctum
- ✅ **Password Hashing** with bcrypt
- ✅ **Role-Based Access Control** (RBAC)
- ✅ **Rate Limiting** on sensitive endpoints
- ✅ **CORS Protection** with configuration
- ✅ **CSRF Protection** middleware
- ✅ **Input Validation** on all endpoints
- ✅ **SQL Injection Prevention** via ORM
- ✅ **AI Guardrails** for medical compliance
- ✅ **Data Encryption** for sensitive fields

---

## 📈 Performance & Scaling

### Current Architecture
- Single server deployment
- Local file storage
- Database on same server

### For Production Scale
- **Frontend:** CDN, load balancing, caching
- **Backend:** Multiple instances, queue workers
- **Databases:** Master-slave replication, replica sets
- **Caching:** Redis for sessions/cache
- **Storage:** Cloud storage (S3/Azure)

**See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for scaling details**

---

## 🧪 Testing

### Backend Tests
```bash
php artisan test                    # Run all tests
php artisan test --filter=LoginTest # Run specific test
```

### Frontend Tests
```bash
npm test                            # Run all tests
npm run test:watch                 # Watch mode
```

---

## 🚀 Deployment

### Prerequisites
- Configure environment variables
- Set up MySQL and MongoDB databases
- Obtain Gemini API key
- Set up email service (Gmail SMTP)

### Deployment Steps
```bash
# Backend
git pull
composer install
php artisan migrate --force
php artisan cache:clear
php artisan config:cache

# Frontend
npm install
npm run build
# Deploy dist/ contents to CDN
```

**See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for deployment checklist**

---

## 🎓 For Different Roles

### 👨‍💻 Developers
1. Read [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) first
2. Set up local environment
3. Review [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for code structure
4. Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference

### 🏗️ Architects/Tech Leads
1. Start with [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
2. Deep dive into [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
3. Review security architecture
4. Plan for scaling

### 📋 Product Managers
1. Read [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for features
2. Review user workflows and flows
3. Check roadmap section for future features

### 🔗 API Integrators
1. Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Check endpoint examples
3. Set up authentication
4. Test with provided samples

### 🧪 QA/Testers
1. Review [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for features
2. Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for testing endpoints
3. Check [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for local setup
4. Test all user workflows

---

## 🐛 Troubleshooting

### Setup Issues

**Issue:** MySQL connection fails
```
Solution: 
- Check MySQL service is running
- Verify credentials in .env
- Check database exists
```

**Issue:** MongoDB connection fails
```
Solution:
- Ensure MongoDB service is running
- Check MONGODB_URI in .env
- Verify port is correct
```

**Issue:** CORS errors in frontend
```
Solution:
- Check frontend URL in CORS config
- Verify backend is running on correct port
- Check Authorization header is being sent
```

**Issue:** Gemini API returns errors
```
Solution:
- Verify API key is correct
- Check API quota hasn't been exceeded
- Verify request format is correct
```

For more troubleshooting tips, see [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)

---

## 📞 Common Commands

### Laravel
```bash
php artisan serve              # Start dev server
php artisan migrate            # Run migrations
php artisan tinker             # Interactive shell
php artisan test               # Run tests
```

### NPM/Node
```bash
npm run dev                    # Start dev server
npm run build                  # Build for production
npm test                       # Run tests
npm run lint                   # Check code style
```

### Database
```bash
mysql -u root -p heartpredict_dev  # Access MySQL
mongo heartpredict_dev              # Access MongoDB
```

---

## 🎯 Next Steps

1. **New Developer?**
   - Go to [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
   - Set up local environment
   - Make your first commit!

2. **Exploring the Code?**
   - Read [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
   - Review directory structure
   - Check key files

3. **Building API Integration?**
   - Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
   - Test with Postman/cURL
   - Check authentication

4. **Understanding Features?**
   - Read [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
   - Review user workflows
   - Check business requirements

---

## 📅 Document Maintenance

- **Last Updated:** 2026-04-18
- **Maintained By:** Development Team
- **Update Frequency:** As features are added or changed
- **Version:** 1.0

---

## 📄 License

HeartPredict is open source software licensed under the MIT license.

---

## 🤝 Contributing

Please follow these guidelines:
1. Create feature branch from `develop`
2. Follow code style guidelines
3. Write tests for new features
4. Update documentation
5. Submit pull request for review

---

## 📧 Support

- **Questions?** Check the relevant documentation file
- **Found a bug?** Open an issue on GitHub
- **Need help?** Ask the development team

---

## 🙏 Acknowledgments

Built with ❤️ using:
- Laravel & Eloquent
- React & TypeScript
- Tailwind CSS
- Google Generative AI (Gemini)
- MongoDB & MySQL

---

## 🚀 Quick Links

- [Development Setup Guide](DEVELOPMENT_SETUP.md)
- [Project Features & Design](PROJECT_DOCUMENTATION.md)
- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [API Reference](API_DOCUMENTATION.md)

---

**Happy coding! 💚**

*For detailed information about specific topics, please refer to the documentation files above.*
