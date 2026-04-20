# 🚀 QUICK START GUIDE FOR DEVELOPERS

## 📖 Documentation Index

This project has comprehensive documentation in the following files:

1. **PROJECT_DOCUMENTATION.md** - Complete feature overview and system design
2. **SYSTEM_ARCHITECTURE.md** - Technical architecture, data flows, and component design
3. **API_DOCUMENTATION.md** - Complete API endpoint reference with examples
4. **DEVELOPMENT_SETUP.md** - This file - Getting started guide
5. **README.md** - Project overview (root level)

---

## 🏃 Quick Start - Local Development

### Prerequisites

```
✅ PHP 8.1+ (8.2 recommended)
✅ MySQL 8.0+
✅ MongoDB 5.0+
✅ Node.js 18+ (use nvm for version management)
✅ Composer (for PHP dependency management)
✅ Git
```

### Backend Setup (Laravel)

```bash
# 1. Navigate to backend directory
cd laravel02-be

# 2. Install PHP dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate app key
php artisan key:generate

# 5. Configure .env file
# Edit .env with your settings:
# - DB_DATABASE=heartpredict_dev
# - DB_USERNAME=root
# - DB_PASSWORD=
# - MONGODB_URI=mongodb://localhost:27017
# - GEMINI_API_KEY=your_key_here

# 6. Run database migrations
php artisan migrate

# 7. (Optional) Seed database with test data
php artisan db:seed

# 8. Start Laravel development server
php artisan serve

# Server runs at: http://localhost:8000
```

### Frontend Setup (React)

```bash
# 1. Navigate to frontend directory
cd larvel02-fe

# 2. Install npm dependencies
npm install

# 3. Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=HeartPredict
EOF

# 4. Start development server
npm run dev

# Server runs at: http://localhost:5173
```

### Access the Application

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000
MySQL DB:  localhost:3306
MongoDB:   localhost:27017

Test Login:
  Email: admin@example.com
  Password: (see seeders or set your own)
```

---

## 🗂️ Project Structure Overview

### Backend Structure

```
laravel02-be/
├── app/
│   ├── Http/Controllers/     ← API request handlers
│   ├── Models/               ← Database models (User, Article, etc)
│   ├── Services/             ← Business logic (AiService, etc)
│   └── Traits/               ← Reusable code (HasRoles)
├── routes/
│   └── api.php              ← API endpoints definition
├── database/
│   ├── migrations/          ← Database schema
│   └── seeders/             ← Test data
├── config/                  ← Configuration files
└── storage/
    └── logs/                ← Application logs

Key Files to Know:
  • routes/api.php            → All API endpoints
  • app/Http/Controllers/     → Request handlers
  • app/Services/AiService.php → Gemini integration
  • config/database.php       → Database setup
```

### Frontend Structure

```
larvel02-fe/
├── app/
│   ├── components/          ← Reusable React components
│   ├── pages/               ← Page components
│   ├── services/            ← API service calls
│   ├── hooks/               ← Custom React hooks
│   ├── context/             ← State management
│   ├── stores/              ← Global state
│   └── types/               ← TypeScript definitions
├── public/                  ← Static assets
└── vite.config.ts          ← Build configuration

Key Files to Know:
  • app/main.tsx              → Entry point
  • app/routes/Routes.tsx     → Route configuration
  • app/services/apiClient.ts → Axios setup
  • app/components/           → Reusable UI components
```

---

## 🔧 Common Development Tasks

### Running Tests

```bash
# Backend - PHPUnit tests
cd laravel02-be
php artisan test

# Backend - Specific test file
php artisan test tests/Feature/AuthTest.php

# Frontend - Jest tests
cd larvel02-fe
npm run test

# Frontend - Watch mode
npm run test:watch
```

### Database Operations

```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migrate (drops all tables and re-runs)
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Seed specific seeder
php artisan db:seed --class=UserSeeder
```

### Code Quality

```bash
# Backend - Code style check
cd laravel02-be
./vendor/bin/pint --check

# Backend - Auto-fix code style
./vendor/bin/pint

# Frontend - ESLint check
cd larvel02-fe
npm run lint

# Frontend - Auto-fix ESLint issues
npm run lint --fix
```

### Building for Production

```bash
# Backend - Already production-ready, just configure .env
cd laravel02-be
# Set APP_ENV=production in .env
# Run migrations on production server
# Set up queue workers

# Frontend - Build for production
cd larvel02-fe
npm run build
# Output in: dist/
# Deploy contents to CDN or static host
```

---

## 🔑 Important Configuration

### Environment Variables

**Backend (.env)**

```bash
APP_NAME=HeartPredict
APP_ENV=local              # development environment
APP_DEBUG=true             # show detailed errors
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=heartpredict_dev
DB_USERNAME=root
DB_PASSWORD=

# MongoDB
MONGODB_CONNECTION=mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=heartpredict

# Mail (for password reset emails)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls

# Gemini API (AI chatbot)
GEMINI_API_KEY=your-api-key-here

# Sanctum (API Authentication)
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

**Frontend (.env)**

```bash
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=HeartPredict
```

---

## 📝 Key APIs to Know

### Authentication

```
POST /api/login              → Login user
POST /api/register           → Register new account
POST /api/logout             → Logout user
GET  /api/me                 → Get current user
```

### Predictions

```
POST /api/predict            → Make prediction
GET  /api/predictions        → Get prediction history
GET  /api/predictions/{id}   → Get prediction detail
```

### Chat

```
POST /api/chat               → Send chat message
GET  /api/chats              → Get chat history
```

### Articles

```
GET  /api/articles           → Get articles list
GET  /api/articles/{slug}    → Get article detail
```

### Admin

```
GET  /api/admin/stats        → Dashboard stats
GET  /api/admin/users        → List users
POST /api/admin/articles     → Create article
```

For complete API documentation, see **API_DOCUMENTATION.md**

---

## 🐛 Debugging

### Backend Debugging

```bash
# View application logs
tail -f laravel02-be/storage/logs/laravel.log

# Clear logs
php artisan log:clear

# Test database connection
php artisan tinker
>>> DB::connection('mysql')->getPdo()
>>> DB::connection('mongodb')->getConnection()

# Debug routes
php artisan route:list

# Debug configuration
php artisan config:show
```

### Frontend Debugging

```bash
# Browser DevTools
- Open Chrome DevTools (F12)
- Console tab → See errors
- Network tab → See API calls
- Application tab → See localStorage/cookies

# Debug logs
- Check browser console for error messages
- Use React DevTools extension
- Check Network tab for API requests
```

### Common Issues

**Issue: 401 Unauthorized**
- Solution: Check JWT token is being sent in Authorization header
- Check token hasn't expired
- Verify token is stored in localStorage

**Issue: CORS errors**
- Solution: Check CORS config in config/cors.php
- Verify frontend URL is in allowed origins
- Check backend is running on correct port

**Issue: MongoDB connection fails**
- Solution: Ensure MongoDB service is running
- Check MONGODB_URI in .env is correct
- Test with: `mongo --uri "mongodb://localhost:27017"`

**Issue: AI responses are generic**
- Solution: Check GEMINI_API_KEY is valid
- Verify API quota hasn't been exceeded
- Check system prompt configuration in AiService

---

## 📊 Database Schema Quick Reference

### Main Tables (MySQL)

```
users
├─ id (int, PK)
├─ name (string)
├─ email (string, unique)
├─ password (hashed)
├─ phone_number (string, nullable)
└─ profile_picture (string, nullable)

articles (MongoDB)
├─ _id (ObjectId)
├─ title (string)
├─ slug (string, unique)
├─ content (HTML string)
├─ category_id (reference)
├─ author_id (reference)
└─ status (enum: draft, published, archived)

chats (MongoDB)
├─ _id (ObjectId)
├─ user_id (reference)
├─ message (string)
├─ response (string)
└─ created_at (timestamp)

predictions (MongoDB - if stored)
├─ _id (ObjectId)
├─ user_id (reference)
├─ input_data (object)
├─ risk_score (float)
├─ risk_level (string)
└─ created_at (timestamp)
```

---

## 🧪 Testing API Endpoints

### Using Thunder Client (VS Code Extension)

```
1. Install Thunder Client extension
2. Create new request
3. Set:
   - Method: POST
   - URL: http://localhost:8000/api/login
   - Body (JSON):
     {
       "email": "admin@example.com",
       "password": "password"
     }
4. Send and view response
5. Copy token from response
6. Use in other requests with:
   Authorization: Bearer {token}
```

### Using Postman

```
1. Create new Postman collection
2. Set up environment variables:
   - base_url = http://localhost:8000/api
   - token = (empty initially)
3. Create login request
4. In Tests tab add:
   pm.environment.set("token", pm.response.json().data.token);
5. Use {{token}} in Authorization header for other requests
```

### Using cURL

```bash
# Login
TOKEN=$(curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.data.token')

# Use token
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] Run all tests: `npm test` + `php artisan test`
- [ ] Check environment variables are set correctly
- [ ] Run migrations: `php artisan migrate`
- [ ] Clear cache: `php artisan cache:clear`
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally

### Deployment

- [ ] Deploy backend code
- [ ] Set APP_ENV=production
- [ ] Run migrations on production
- [ ] Deploy frontend build
- [ ] Set up SSL/HTTPS
- [ ] Configure domain
- [ ] Test all features
- [ ] Monitor logs

### Post-deployment

- [ ] Check application logs
- [ ] Test login functionality
- [ ] Test predictions
- [ ] Test AI chat
- [ ] Monitor error rates
- [ ] Set up backups

---

## 📞 Common Commands

### Laravel Artisan

```bash
# Application
php artisan serve                    # Start dev server
php artisan tinker                   # Interactive shell
php artisan config:cache            # Cache config
php artisan cache:clear             # Clear cache

# Database
php artisan migrate                 # Run migrations
php artisan migrate:refresh         # Refresh migrations
php artisan db:seed                 # Seed database

# Testing
php artisan test                    # Run all tests
php artisan test --filter=Test      # Run specific test

# Optimization
php artisan optimize                # Optimize app
php artisan route:cache             # Cache routes
```

### NPM Commands

```bash
npm install                         # Install dependencies
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build
npm run lint                        # Check code style
npm test                            # Run tests
npm run format                      # Format code
```

---

## 🎓 Learning Resources

### Laravel Documentation
- Routes: https://laravel.com/docs/routing
- Eloquent ORM: https://laravel.com/docs/eloquent
- Sanctum: https://laravel.com/docs/sanctum
- MongoDB: https://www.mongodb.com/docs/

### React Documentation
- Getting Started: https://react.dev
- Hooks: https://react.dev/reference/react
- Context API: https://react.dev/reference/react/useContext
- TypeScript: https://www.typescriptlang.org/docs

### Tailwind CSS
- Documentation: https://tailwindcss.com/docs

### Testing
- PHPUnit: https://phpunit.de/
- Jest: https://jestjs.io/
- React Testing Library: https://testing-library.com/

---

## 🆘 Support & Troubleshooting

### Need Help?

1. **Check the logs** → Check `laravel02-be/storage/logs/laravel.log`
2. **Read the docs** → Check PROJECT_DOCUMENTATION.md or SYSTEM_ARCHITECTURE.md
3. **Google the error** → Copy full error message and search
4. **Ask the team** → Ask on team chat/Slack

### Useful Debugging Tools

- **Laravel Debugbar** - Add `laravel/debugbar` for detailed profiling
- **React DevTools** - Chrome extension for React debugging
- **MongoDB Compass** - GUI for MongoDB management
- **Postman** - API testing tool
- **Thunder Client** - VS Code extension for API testing

---

## 📋 Checklist for New Developers

- [ ] Clone the repository
- [ ] Install PHP dependencies: `composer install`
- [ ] Install Node dependencies: `npm install`
- [ ] Copy .env files
- [ ] Set up databases (MySQL & MongoDB)
- [ ] Run migrations: `php artisan migrate`
- [ ] Seed database: `php artisan db:seed`
- [ ] Start backend: `php artisan serve`
- [ ] Start frontend: `npm run dev`
- [ ] Test login with seeded credentials
- [ ] Read PROJECT_DOCUMENTATION.md
- [ ] Read SYSTEM_ARCHITECTURE.md
- [ ] Review API_DOCUMENTATION.md
- [ ] Make your first change to familiarize yourself

---

## 📚 Additional Resources

- **Postman Collection** - Request samples for all APIs
- **Database Diagram** - Visual schema (see SYSTEM_ARCHITECTURE.md)
- **Component Library** - Storybook for UI components (if set up)
- **Swagger/OpenAPI** - API spec (if API docs are auto-generated)

---

*For detailed information about features, architecture, and API endpoints, please refer to the documentation files.*

**Happy Coding! 🎉**

*Last Updated: 2026-04-18*
