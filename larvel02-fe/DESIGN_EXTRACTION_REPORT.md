# DESIGN EXTRACTION REPORT — HeartPredict
## Dihasilkan oleh: Gemini Agent
## Tanggal: 18 April 2026
## Tujuan: Referensi redesign untuk Figma AI

---

## 1. INVENTARIS HALAMAN & KOMPONEN

**INVENTARIS HALAMAN:**
  /                        → app/pages/LandingPage/index.tsx
  /login                   → app/pages/Auth/Login.tsx
  /register                → app/pages/Auth/Register.tsx
  /forgot-password         → app/pages/Auth/ForgotPassword.tsx
  /reset-password          → app/pages/Auth/ResetPassword.tsx
  /articles                → app/pages/ArticlesPage/index.tsx
  /articles/:slug          → app/pages/ArticlesPage/ArticleDetail.tsx
  /user                    → app/pages/UserPage/index.tsx
  /user/profile            → app/pages/UserPage/Profil.tsx
  /user/cek-kesehatan      → app/pages/UserPage/CekKesehatan.tsx
  /user/konsultasi         → app/pages/UserPage/ChatConsultation.tsx
  /user/hasil-prediksi     → app/pages/UserPage/HasilPrediksi.tsx
  /user/riwayat            → app/pages/UserPage/RiwayatPemeriksaan.tsx
  /user/rekomendasi        → app/pages/UserPage/RekomendasiMedis.tsx
  /admin                   → app/pages/AdminPage/index.tsx
  [Halaman Admin spesifik lain seperti Users/Articles/Datasets tampaknya dirender melalui komponen di dalam AdminPage/index.tsx atau [FILE TIDAK ADA] secara eksplisit sebagai rute file terpisah]

**INVENTARIS KOMPONEN GLOBAL:**
  ProtectedRoute           → app/components/ProtectedRoute.tsx
  [TIDAK ADA KOMPONEN UI GLOBAL LAIN YANG DITEMUKAN PADA FOLDER `app/components/`. Navbar, Sidebar, Button, Input, dll di-hardcode di dalam halaman atau layout masing-masing.]

---

## 2. DESIGN TOKENS SAAT INI

**TAILWIND CUSTOM TOKENS (app/tailwind.config.js):**
  Colors:
    primary:               #064E3B
    primary.foreground:    #ffffff
    accent:                #E11D48
    background:            #ffffff
    foreground:            #0f172a
    muted:                 #f8fafc
    muted.foreground:      #64748b
    secondary:             #ecfdf5
    secondary.foreground:  #064e3b

  Font Family:
    sans:                  "Inter", sans-serif

**GLOBAL CSS (app/index.css & app/App.css):**
  - Font import: Google Fonts `Inter` (weights: 400-900)
  - Base body: `min-height: 100vh`, margin `0`, background default.
  - Reset utilities: Button custom reset (`bg-transparent`, `p-0`, `border-none`, hapus outline saat focus).
  - Custom classes: `.card` (padding 2em), animasi `.logo-spin`.

**WARNA DOMINAN (berdasarkan frekuensi pemakaian):**
  Background utama:        bg-white — ditemukan >15x
  Background header/kartu: bg-slate-50 — ditemukan >8x
  Background interaktif:   bg-slate-100 — ditemukan >4x
  Background secondary:    bg-emerald-50 — ditemukan >3x
  Teks heading utama:      text-slate-900 — ditemukan >10x
  Teks body:               text-slate-600 — ditemukan >5x
  Teks muted:              text-slate-400 & text-slate-500 — ditemukan >11x
  Primary action:          text-primary — ditemukan >5x
  Border standar:          border-slate-200 — ditemukan >8x
  Success:                 bg-emerald-100 text-emerald-700
  Warning:                 bg-amber-100 text-amber-700
  Danger/Error:            bg-red-100 text-red-600 bg-red-600

---

## 3. KOMPONEN GLOBAL — KONDISI SAAT INI

**KOMPONEN: ProtectedRoute**
File:     app/components/ProtectedRoute.tsx

PROPS / VARIANTS:
  - Tidak memiliki styling/properti presentasional. Hanya menerima rute dan role.

STYLING SAAT INI:
  - ZERO UI STYLING. Berfungsi murni sebagai Auth Wrapper (`<Navigate />` atau `<Outlet />`).

MASALAH / INKONSISTENSI YANG DITEMUKAN:
  - **KRITIKAL**: Proyek ini **tidak memisahkan komponen UI sama sekali** ke dalam folder komponen global. Tombol (Button), form input (Input), Navbar, Sidebar, Card, Badge, Modal, dan Toast semua dideklarasikan dan diulang secara inline (hardcode) di setiap halaman. Hal ini membuat inkonsistensi styling sangat tinggi.

---

## 4. LAPORAN PER HALAMAN

=================================================
HALAMAN: Landing Page
Route:   /
File:    app/pages/LandingPage/index.tsx
Role:    Public
=================================================

LAYOUT WRAPPER:
  Menggunakan layout: Tidak menggunakan komponen layout eksternal. (Semua layout dirakit inline).
  Struktur dasar:     Full-width dengan Navbar statis di atas.

STRUKTUR HALAMAN:
  1. Navbar — Header navigasi dengan background transparan/putih.
  2. Hero Section — Call to action utama.
  3. About / Features — Penjelasan fitur layanan.
  4. Articles Grid — Menampilkan kartu artikel terbaru.
  5. Contact & Footer — Informasi bagian bawah.

DETAIL SETIAP SECTION:
  --- Section: Navbar ---
  Tailwind classes: `bg-white/90 backdrop-blur-md border-b border-gray-100 fixed top-0 z-50`

  --- Section: Article Cards ---
  Tailwind classes: `bg-white rounded-xl shadow-md hover:shadow-2xl`
  Konten: Menampilkan image overlays dan text artikel.

INTERAKSI / EVENT HANDLER:
  - Animasi paralaks menggunakan library ekstrenal (Framer Motion).

=================================================
HALAMAN: Dashboard User Utama
Route:   /user
File:    app/pages/UserPage/index.tsx
Role:    User
=================================================

LAYOUT WRAPPER:
  Menggunakan layout: Dirakit secara inline (Sidebar + Header + Main Content).
  Struktur dasar:     Sidebar Kiri statis + Konten Utama di Kanan.

STRUKTUR HALAMAN:
  1. Sidebar — Navigasi menu utama (`w-72 fixed`).
  2. Mobile Overlay — Latar redup ketika sidebar dibuka di layar kecil (`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40`).
  3. Header — Bar navigasi atas profil & notifikasi (`h-20 bg-white border-b border-slate-200`).
  4. Main Status Cards — Grid status kesehatan (`bg-slate-50`).

DETAIL SETIAP SECTION:
  --- Section: Sidebar & Navigation ---
  Tailwind classes: Menu aktif menggunakan `bg-emerald-50 text-emerald-700`. Border kanan menggunakan `border-r border-slate-200`.
  
  --- Section: Main Status Cards ---
  Tailwind classes: `bg-white rounded-2xl p-6 border border-slate-200 shadow-sm`. Latar warna disesuaikan status risiko (`bg-amber-50`, `bg-primary/10`, `bg-indigo-50`).
  Dekorasi: Terdapat _shapes_ dekoratif sudut (`w-32 h-32 bg-amber-50 rounded-bl-full absolute`).

KONDISI & LOGIKA TAMPILAN:
  - Status Risiko (Severity):
    Risiko Tinggi -> badge diatur dengan `bg-red-100 text-red-700`
    Risiko Sedang -> badge `bg-amber-100 text-amber-700`
    Risiko Rendah -> badge `bg-emerald-100 text-emerald-700`

=================================================
HALAMAN: Konsultasi AI
Route:   /user/konsultasi
File:    app/pages/UserPage/ChatConsultation.tsx
Role:    User
=================================================

LAYOUT WRAPPER:
  Menggunakan layout: Dirakit secara inline dengan struktur Sidebar mirip Dashboard.
  Struktur dasar:     Sidebar Kiri + Area Chat + Info Panel Kanan (hanya untuk layar besar / xl).

DETAIL SETIAP SECTION:
  --- Section: Main Chat Area ---
  Tailwind classes (Pesan User): `bg-indigo-600 text-white rounded-tr-none`.
  Tailwind classes (Pesan AI): `bg-white border border-slate-200 rounded-tl-none`.

  --- Section: Right Info Panel (Desktop XL) ---
  Tailwind classes: `w-80 border-l border-slate-200 bg-white`. Kartu informasi di dalam menggunakan `bg-slate-50 rounded-2xl border border-slate-100`.
  Terdapat badge Online dengan warna solid `bg-emerald-500`.

MASALAH DESAIN YANG TERIDENTIFIKASI:
  - Penggunaan warna pesan user (indigo-600) bergeser dari skema tema utama aplikasi (Emerald Teal primary `#064E3B`).
  - Duplikasi struktur Sidebar yang sama dengan halaman UserPage secara manual tanpa ekstraksi komponen.

=================================================
HALAMAN: Auth (Login / Register / Passwords)
Route:   /login, /register, dll
File:    app/pages/Auth/*.tsx
Role:    Public
=================================================

LAYOUT WRAPPER:
  Struktur dasar: Centered card layout.
  
DETAIL SETIAP SECTION:
  Tailwind classes: Form dibungkus dalam kontainer putih polos (`bg-white shadow-md rounded-xl`). Layar belakang form tidak diketahui secara akurat, tapi diprediksi menggunakan `bg-slate-50`.

=================================================
HALAMAN: Dashboard Admin Utama
Route:   /admin
File:    app/pages/AdminPage/index.tsx
Role:    Admin
=================================================

MASALAH DESAIN YANG TERIDENTIFIKASI:
  - Halaman terduplikasi menjadi file monolit tunggal besar (`index.tsx`). File view untuk entitas Manajemen User/Article kemungkinan disatukan melalui _conditional rendering_ atau inner components tanpa abstraksi halaman routing yang baik.

---

## 5. DESIGN AUDIT — MASALAH & INKONSISTENSI

**INKONSISTENSI YANG DITEMUKAN:**

1. **Warna:**
   - Skema utama (Primary `#064E3B`) sering diganti dengan hardcode indigo/blue di area-area krusial seperti kotak percakapan konsultasi (menggunakan `bg-indigo-600`).
   - Warna teks abu-abu bervariasi luas tanpa standar hierarki baku, campur aduk antara `text-slate-400`, `text-slate-500`, dan `text-slate-600`.

2. **Tipografi:**
   - Tidak ada penetapan varian tipografi _heading_ sekunder di `tailwind.config`. Hierarki visual sangat bergantung pada gaya kelas sebarangan (misal: `<h1 className="text-xl font-bold...">`) yang dapat berbeda-beda di setiap halaman.

3. **Komponen (MASALAH TERBESAR):**
   - **TIDAK ADA KOMPONEN UI GLOBAL.** Tidak ada pemisahan Atomic Design (Button, Input, Card, Modal). Semua tampilan (termasuk Sidebar) disalin-tempel ke berbagai halaman (User Dashboard vs ChatConsultation). Hal ini menciptakan risiko _technical debt_ desain yang parah ketika UI ingin diperbarui.

4. **Responsive:**
   - Beberapa area membutuhkan panel ketiga (seperti di Layar ChatConsultation) namun dikunci secara _abrupt_ dengan modifier `hidden xl:flex`, menghilangkan fungsionalitas panel tersebut sepenuhnya di perangkat medium/tablet tanpa fallback yang transparan.

**HALAMAN YANG PERLU PERHATIAN KHUSUS:**
  Priority 1: `UserPage / Dashboard`. Sidebar Kiri perlu difaktorkan ulang ke layout parent agar tidak di-hardcode.
  Priority 2: `ChatConsultation`. Perbaikan skema warna agar sejalur dengan branding (mengganti Indigo).
  Priority 3: `AdminPage`. Kemungkinan _monolithic file_. Memisahkan admin layouts sehingga lebih konsisten dengan pola panel User.

**ASET YANG DITEMUKAN:**
  - Font yang dipakai saat ini: `Inter`
  - Ikon library: _Belum ada temuan konfirmatorik (kemungkinan react-icons/lucide-react)._
  - Animasi library: Framer Motion (pada Landing Page).

---

## 6. REKOMENDASI UNTUK FIGMA AI

1. **Sistem Komponen (Wajib Dibuat):**
   Figma AI harus segera membuat _Component Set_ untuk: `Button`, `Input Field`, `Card (Status & Article)`, `Sidebar Navigation`, dan `Top Header/Navbar`.

2. **Hierarki Warna:**
   Standardisasi palet _Slate_ untuk antarmuka. Buat gaya "Surface/Background" untuk Card dengan `bg-white`, border `slate-200`, dan "Background Utama" dengan `slate-50`.
   Bentuk _Color Styles_ untuk status (Severity): Merah (Alert/Tinggi), Kuning/Amber (Warning/Sedang), Hijau/Emerald (Success/Rendah).

3. **Redesign Konsultasi AI:**
   Ubah bubble percakapan pengguna agar menggunakan _Brand Colors_ kustom (Teal/Emerald Secondary `#ecfdf5` atau variasi Primary transparan) alih-alih warna Indigo default Tailwind.

4. **Pola Layout Standar:**
   Pertahankan bentuk _Card-based dashboard_ dengan dekorasi _rounded corner shapes_ (contoh `rounded-2xl` & `rounded-bl-full`), karena ini merupakan identitas visual antarmuka saat ini yang menarik.