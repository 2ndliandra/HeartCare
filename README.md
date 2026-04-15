# HeartPredict - Health Heart Disease Detection System

A comprehensive AI-powered web application for early detection and monitoring of heart disease risk. The system includes both a Laravel backend API and a React TypeScript frontend.

## 📋 Project Structure

```
Projek01/
├── laravel02-be/        # Backend API (Laravel)
├── larvel02-fe/         # Frontend Application (React + TypeScript)
├── document/            # Documentation files
└── README.md           # This file
```

## 🚀 Quick Start - Clone & Setup

### Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v16+) and **npm** or **pnpm**
- **PHP** (v8.1+)
- **Composer** (PHP package manager)
- **MySQL/MariaDB** (v5.7+)
- **Git**
- **Laragon** or similar local development environment (optional)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/2ndliandra/HeartCare.git
cd HeartCare

# Or if using the old repository URL
git clone https://github.com/2ndliandra/SEL.git
cd SEL
```

---

## 💻 Backend Setup (Laravel API)

### Step 2: Install Backend Dependencies

```bash
cd laravel02-be
composer install
```

### Step 3: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure Database

Edit `.env` file and update database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=heartpredict_db
DB_USERNAME=root
DB_PASSWORD=
```

### Step 5: Create Database & Run Migrations

```bash
# Create database (if using MySQL client)
mysql -u root -e "CREATE DATABASE heartpredict_db;"

# Run migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed
```

### Step 6: Generate Sanctum Token (for API authentication)

```bash
php artisan install:api
```

### Step 7: Start Backend Server

```bash
php artisan serve
```

The backend API will run on: `http://localhost:8000`

---

## 🎨 Frontend Setup (React)

### Step 8: Install Frontend Dependencies

Open a new terminal and navigate to the frontend directory:

```bash
cd larvel02-fe

# Using npm
npm install

# Or using pnpm (faster)
pnpm install
```

### Step 9: Configure Environment Variables

Create a `.env` file in the `larvel02-fe` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### Step 10: Start Frontend Development Server

```bash
# Using npm
npm run dev

# Or using pnpm
pnpm dev
```

The frontend will run on: `http://localhost:5173` (or similar port shown in terminal)

---

## 🔍 API Configuration

Make sure the frontend can communicate with the backend. Update `larvel02-fe/app/lib/api.ts` if needed:

```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
```

---

## 📚 Available Routes

### Backend API (Laravel)

- **Authentication Routes** (`/api/auth/`)
  - `POST /login` - User login
  - `POST /register` - User registration
  - `POST /logout` - User logout
  - `POST /forgot-password` - Request password reset
  - `POST /reset-password` - Reset password with token

- **User Routes** (`/api/user/`)
  - `GET /me` - Get current user profile
  - `GET /profile` - Get user profile details
  - `PUT /profile` - Update user profile

- **Health Check Routes** (`/api/`)
  - `POST /cek-kesehatan` - Submit health check data
  - `GET /hasil-prediksi` - Get health prediction results
  - `GET /rekomendasi` - Get medical recommendations

### Frontend Routes (React)

- **Public Routes**
  - `/` - Landing page
  - `/login` - Login page
  - `/register` - Registration page
  - `/forgot-password` - Forgot password page
  - `/articles` - Articles listing

- **User Routes** (Protected)
  - `/user` - User dashboard
  - `/user/cek-kesehatan` - Health check form
  - `/user/hasil-prediksi` - Prediction results
  - `/user/konsultasi` - AI consultation
  - `/user/rekomendasi` - Medical recommendations
  - `/user/riwayat` - Examination history
  - `/user/profile` - User profile

---

## 🔐 Authentication & Security

### Session Management

- **Token Storage**: JWT tokens are stored in `localStorage` as `auth_token`
- **Session Duration**: 1 hour (configurable in `larvel02-fe/app/lib/api.ts`)
- **Automatic Logout**: After 1 hour of inactivity or on logout

### Recent Bug Fixes

✅ **Fixed logout session clearing** - Sessions now properly clear on logout
✅ **Fixed navigation consistency** - "Profil Saya" button now always renders correctly

---

## 🐛 Known Issues & Fixes

### Issue 1: Logout Not Clearing Session
**Status**: ✅ FIXED

**Solution**: Logout now uses `localStorage.clear()` and `sessionStorage.clear()`, forcing a fresh page reload.

### Issue 2: Profile Button Disappearing
**Status**: ✅ FIXED

**Solution**: Navigation now dynamically updates based on current route using `useLocation()` hook.

---

## 📦 Build for Production

### Backend

```bash
cd laravel02-be

# Build for production
php artisan optimize

# Create storage link for file uploads
php artisan storage:link
```

### Frontend

```bash
cd larvel02-fe

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Running Tests

### Backend (Laravel)

```bash
cd laravel02-be

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php
```

### Frontend

```bash
cd larvel02-fe

# Run unit tests (if configured)
npm run test
```

---

## 📝 Database Schema

### Main Tables

- **users** - User accounts and profiles
- **articles** - News and health articles
- **categories** - Article categories
- **datasets** - Health data for AI training
- **chats** - AI consultation messages
- **roles** - User role definitions
- **permissions** - Permission management
- **password_resets** - Password reset tokens

Run migrations to create all tables:

```bash
php artisan migrate
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `SQLSTATE[HY000] [2002] No such file or directory`
- **Solution**: Ensure MySQL is running and DB credentials in `.env` are correct

**Problem**: `Class not found` errors
- **Solution**: Run `composer install` and `php artisan key:generate`

### Frontend Issues

**Problem**: `VITE_API_URL is not defined`
- **Solution**: Create `.env` file with `VITE_API_URL=http://localhost:8000/api`

**Problem**: API calls failing with 401/403
- **Solution**: Ensure backend is running and token is properly stored in localStorage

**Problem**: "Profil Saya" button not showing
- **Solution**: This is fixed in latest version. Run `git pull` and rebuild

---

## 📖 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

---

## 📄 License

This project is private and distributed under internal use only.

---

## 👥 Team & Support

For issues, questions, or contributions, please contact the development team.

**Last Updated**: April 15, 2026
**Latest Changes**: Fixed authentication session management and navigation consistency

---

## 🎯 Development Workflow

### For Development

1. Keep two terminals open:
   - Terminal 1: `cd laravel02-be && php artisan serve`
   - Terminal 2: `cd larvel02-fe && npm run dev`

2. Frontend will auto-reload on file changes
3. Backend needs manual restart for PHP changes

### For Database Changes

```bash
# Create new migration
php artisan make:migration migration_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback
```

### Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to remote
git push origin main
```

---

## ✅ Final Checklist for New Setup

- [ ] Cloned repository successfully
- [ ] Backend dependencies installed (`composer install`)
- [ ] Backend `.env` configured with database credentials
- [ ] Database created and migrations run
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend dependencies installed (`npm install` or `pnpm install`)
- [ ] Frontend `.env` configured with API URL
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can access login page
- [ ] Can successfully login with test credentials
- [ ] Navigation menu shows all items including "Profil Saya"

**Ready to develop!** 🚀
