# HeartCare

HeartCare adalah aplikasi prediksi risiko penyakit kardiovaskular yang terdiri dari frontend web, backend API, server prediksi Flask, dan aplikasi mobile Flutter.

## Struktur Projek

| Folder | Fungsi | Teknologi utama |
| --- | --- | --- |
| `larvel02-fe` | Frontend web | React, TypeScript, Vite, Tailwind CSS, Axios |
| `laravel02-be` | Backend API | Laravel 10, Sanctum, MongoDB |
| `flask_ml` | Server prediksi machine learning | Flask, Pandas, scikit-learn, Joblib |
| `cardio_mobile` | Aplikasi mobile | Flutter, Dio, BLoC |

Untuk mobile, disarankan clone langsung dari repository mobile:

```bash
git clone https://github.com/imrozahh/cardio_mobile.git
```

## Prasyarat

Pastikan perangkat sudah memiliki:

- Git
- Node.js dan npm
- PHP 8.1 atau lebih baru
- Composer
- MongoDB
- Ekstensi PHP MongoDB (`ext-mongodb`)
- Python 3.10 atau 3.11
- Flutter SDK dan Android Studio jika menjalankan mobile

## Library Utama

Frontend web menggunakan React, TypeScript, Vite, Tailwind CSS, Axios, Framer Motion, Recharts, Lucide React, dan Editor.js.

Backend Laravel menggunakan Laravel 10, Laravel Sanctum, Guzzle HTTP, MongoDB Laravel driver, Jenssegers MongoDB, dan Google Generative AI package.

Server Flask menggunakan Flask, Flask-CORS, Waitress, NumPy, Pandas, scikit-learn, dan Joblib.

Mobile Flutter menggunakan Flutter SDK, go_router untuk routing, flutter_bloc untuk state management, equatable, dio, flutter_secure_storage, dartz, get_it, google_fonts, intl, dan flutter_svg.

## Clone Repository Utama

```bash
git clone https://github.com/2ndliandra/HeartCare.git
cd HeartCare
```

## Setup Backend Laravel

Masuk ke folder backend:

```bash
cd laravel02-be
```

Install dependency PHP:

```bash
composer install
```

Jika backend membutuhkan package JavaScript Laravel/Vite, install juga dependency npm:

```bash
npm install
```

Buat file `.env` di folder `laravel02-be`. Jika belum ada `.env.example`, buat manual dengan isi dasar seperti berikut:

```env
APP_NAME=HeartCare
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mongodb
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=belajar_mongo

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost

GEMINI_API_KEY=
```

Jika MongoDB menggunakan username dan password, sesuaikan `MONGODB_URI`, contoh:

```env
MONGODB_URI=mongodb://username:password@127.0.0.1:27017/?authSource=admin
```

Generate application key:

```bash
php artisan key:generate
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Buat symbolic link storage jika aplikasi menggunakan upload file:

```bash
php artisan storage:link
```

Jalankan backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend API akan berjalan di:

```text
http://localhost:8000/api
```

## Setup Server Flask Machine Learning

Masuk ke folder Flask:

```bash
cd flask_ml
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan virtual environment di Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Aktifkan virtual environment di Linux atau macOS:

```bash
source venv/bin/activate
```

Install dependency Python:

```bash
pip install -r requirements.txt
```

Pastikan file model berikut tersedia di folder `flask_ml`:

```text
pipeline_cardio.pkl
```

Jalankan server Flask:

```bash
python app.py
```

Server Flask akan berjalan di:

```text
http://localhost:5000
```

Cek health endpoint:

```text
http://localhost:5000/health
```

Backend Laravel mengirim request prediksi ke:

```text
http://localhost:5000/predict
```

## Setup Frontend Web

Masuk ke folder frontend:

```bash
cd larvel02-fe
```

Install dependency:

```bash
npm install
```

Buat file `.env` di folder `larvel02-fe`:

```env
VITE_API_URL=http://localhost:8000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend biasanya berjalan di:

```text
http://localhost:5173
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Setup Mobile Flutter

Mobile disarankan dijalankan dari repository berikut:

```bash
git clone https://github.com/imrozahh/cardio_mobile.git
cd cardio_mobile
```

Install dependency Flutter:

```bash
flutter pub get
```

Routing mobile menggunakan `go_router`. Konfigurasi route utama ada di:

```text
lib/core/router/app_router.dart
```

Pastikan konfigurasi base URL API mobile mengarah ke backend Laravel.

Jika menjalankan mobile di emulator Android, biasanya backend lokal dapat diakses melalui:

```text
http://10.0.2.2:8000/api
```

Jika menjalankan mobile di perangkat fisik, gunakan IP lokal komputer, contoh:

```text
http://192.168.1.10:8000/api
```

Jalankan aplikasi mobile:

```bash
flutter run
```

## Urutan Menjalankan Aplikasi

1. Jalankan MongoDB.
2. Jalankan backend Laravel di port `8000`.
3. Jalankan server Flask di port `5000`.
4. Jalankan frontend web di port `5173`.
5. Jalankan mobile Flutter jika diperlukan.

## Perintah Validasi

Backend Laravel:

```bash
php artisan test
```

Frontend web:

```bash
npm run build
```

Flask:

```bash
python app.py
```

Mobile:

```bash
flutter analyze
flutter test
```

## Troubleshooting

Jika frontend tidak bisa menghubungi backend, cek nilai `VITE_API_URL`, pastikan Laravel berjalan di port `8000`, dan pastikan endpoint memakai prefix `/api`.
Jika prediksi gagal, pastikan server Flask berjalan di port `5000` dan file `pipeline_cardio.pkl` tersedia di folder `flask_ml`.
Jika Laravel gagal terhubung ke database, pastikan MongoDB aktif, `MONGODB_URI` benar, dan ekstensi PHP MongoDB sudah aktif.
Jika mobile tidak bisa akses API saat memakai perangkat fisik, jangan gunakan `localhost`. Gunakan IP lokal komputer yang menjalankan backend Laravel.
Jika `php artisan migrate --seed` gagal karena data sudah ada, cek isi database MongoDB atau jalankan migrasi sesuai kondisi database lokal.
