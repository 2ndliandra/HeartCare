# HeartCare: Sistem Prediksi Dini Penyakit Cardiovascular dengan Metode Random Forest Berbasis Website Terintegrasi Mobile

HeartCare Team

## Anggota Kelompok

1. Mochammad Novaliandra Saktiaji [Ketua] - (E31240122)
2. Elyazid Maulana Akbar - (E31240335)
3. Febbry Chandra Wijayanti - (E31241250)
4. Imro'atul Azizah - (E31240337)

## HeartCare

HeartCare merupakan sistem deteksi dini risiko penyakit cardiovascular berbasis web dan mobile yang dikembangkan untuk membantu masyarakat dalam melakukan pemantauan kondisi kesehatan secara lebih mudah dan cepat. Sistem ini memanfaatkan teknologi machine learning menggunakan algoritma Random Forest untuk menganalisis berbagai parameter kesehatan pengguna, seperti usia, tekanan darah, kadar kolesterol, gula darah, indeks massa tubuh (BMI), dan faktor kesehatan lainnya guna menghasilkan prediksi risiko penyakit jantung.

Sistem HeartCare terdiri dari aplikasi mobile berbasis Flutter, aplikasi web berbasis React TypeScript, Backend API berbasis Laravel, database MongoDB, serta Flask API yang menjalankan model machine learning. Selain fitur prediksi, sistem juga menyediakan histori pemeriksaan, artikel kesehatan, serta fitur konsultasi AI yang bertujuan membantu pengguna memperoleh informasi kesehatan secara lebih interaktif. Seluruh komponen sistem terintegrasi untuk mendukung proses deteksi dini, pemantauan kesehatan, dan penyajian informasi kesehatan secara realtime.

## Sistem Arsitektur

![Dashboard HeartCare](assets/images/ars.jpg.jpeg)

## Penjelasan Alur Sistem

Sistem HeartCare dimulai ketika pengguna mengakses aplikasi melalui web atau mobile dan melakukan proses registrasi maupun login. Setelah berhasil masuk ke sistem, pengguna dapat melakukan checkup kesehatan dengan mengisi data yang diperlukan untuk proses prediksi penyakit jantung.

Data kesehatan yang dimasukkan pengguna akan dikirim ke Backend Laravel API, kemudian diteruskan ke Flask API yang menjalankan model machine learning Random Forest. Model akan memproses data kesehatan pengguna dan menghasilkan prediksi risiko penyakit jantung. Hasil prediksi tersebut kemudian disimpan ke database MongoDB dan ditampilkan kembali kepada pengguna melalui aplikasi.

Selain fitur prediksi, pengguna juga dapat melihat histori pemeriksaan, membaca artikel kesehatan, menggunakan fitur konsultasi AI, mengelola profil, serta melakukan logout. Untuk fitur konsultasi AI, Backend Laravel akan meneruskan pertanyaan pengguna ke Gemini AI dan mengembalikan respons yang dihasilkan ke aplikasi.

Pada sisi admin, sistem menyediakan fitur untuk mengelola data pengguna, artikel kesehatan, kategori artikel, serta data pendukung lainnya. Seluruh data yang dikelola akan disimpan ke MongoDB sehingga dapat digunakan oleh aplikasi web maupun mobile secara terintegrasi.

## Fitur Utama

### User Features

- **Login & Register**  
  Memungkinkan pengguna membuat akun dan masuk ke dalam sistem secara aman.
- **Dashboard Kesehatan**  
  Menampilkan ringkasan informasi kesehatan pengguna, hasil prediksi terbaru, dan statistik pemeriksaan.
- **Prediksi Risiko Penyakit Jantung**  
  Melakukan analisis risiko penyakit jantung menggunakan algoritma Random Forest berdasarkan data kesehatan yang diinput pengguna.
- **Hasil Prediksi**  
  Menampilkan hasil klasifikasi risiko penyakit jantung beserta informasi pendukung dan rekomendasi kesehatan.
- **Riwayat Prediksi**  
  Menyimpan dan menampilkan seluruh hasil pemeriksaan yang pernah dilakukan pengguna.
- **Konsultasi AI**  
  Menyediakan layanan chatbot berbasis Gemini AI untuk membantu pengguna memperoleh informasi kesehatan secara interaktif.
- **Artikel Kesehatan**  
  Menyediakan berbagai artikel edukatif mengenai kesehatan jantung dan pola hidup sehat.
- **Profil Pengguna**  
  Memungkinkan pengguna mengelola informasi akun dan data pribadi.

### Admin Features

- **Manajemen Pengguna**  
  Mengelola data pengguna yang terdaftar dalam sistem.
- **Manajemen Artikel**  
  Menambah, mengubah, dan menghapus artikel kesehatan yang ditampilkan kepada pengguna.
- **Manajemen Kategori Artikel**  
  Mengelola kategori artikel untuk mempermudah pengelompokan informasi.
- **Monitoring Data Prediksi**  
  Memantau data hasil prediksi yang tersimpan dalam sistem.
- **Profil Admin**  
  Mengelola informasi akun administrator.

## Struktur Projek

| Folder | Fungsi | Teknologi utama |
| --- | --- | --- |
| `larvel02-fe` | Frontend web | React, TypeScript, Vite, Tailwind CSS, Axios |
| `laravel02-be` | Backend API | Laravel 10, Sanctum, MongoDB, Laravel HTTP Client | 
| `flask_ml` | Server prediksi machine learning | Flask, Pandas, scikit-learn |
| `cardio_mobile` | Aplikasi mobile | Dart, Flutter, Dio, BLoC, GoRouter |

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

Frontend web menggunakan React, TypeScript, Vite, Tailwind CSS, Axios, Recharts, Lucide React, dan Editor.js.

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

1. Jalankan MongoDB:

```bash
mongosh
```

2. Jalankan Backend:

```bash
php artisan serve
```

3. Jalankan Flask:

```bash
python app.py
```

4. Jalankan Frontend:

```bash
npm run dev
```
5. Jalankan Mobile Jika Diperlukan:

```bash
Flutter run
```

## Troubleshooting

Jika frontend tidak bisa menghubungi backend, cek nilai `VITE_API_URL`, pastikan Laravel berjalan di port `8000`, dan pastikan endpoint memakai prefix `/api`.
Jika prediksi gagal, pastikan server Flask berjalan di port `5000` dan file `pipeline_cardio.pkl` tersedia di folder `flask_ml`.
Jika Laravel gagal terhubung ke database, pastikan MongoDB aktif, `MONGODB_URI` benar, dan ekstensi PHP MongoDB sudah aktif.
Jika mobile tidak bisa akses API saat memakai perangkat fisik, jangan gunakan `localhost`. Gunakan IP lokal komputer yang menjalankan backend Laravel.
Jika `php artisan migrate --seed` gagal karena data sudah ada, cek isi database MongoDB atau jalankan migrasi sesuai kondisi database lokal.
