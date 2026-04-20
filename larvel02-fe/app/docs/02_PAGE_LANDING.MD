# 02 — Landing Page

**Route:** `/`  
**Role:** Public  
**Layout:** PublicLayout (Navbar + Content + Footer, tanpa sidebar)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Navbar tidak konsisten dengan sistem komponen global
- Hero section kurang kuat, tidak ada visual yang menarik perhatian
- Tidak ada section statistik yang membangun kepercayaan
- Warna tombol CTA tidak konsisten (kadang indigo, kadang emerald)

**Solusi baru:**
- Navbar menggunakan komponen Navbar global dari `01_GLOBAL_COMPONENTS.md`
- Hero section diperkuat dengan headline besar (Display typography), subtitle, dan ilustrasi visual risiko jantung
- Tambahkan section statistik/social proof (1000+ pengguna, 95% akurasi, dll.)
- Semua tombol CTA menggunakan warna brand Primary Emerald (#059669)
- Article cards menggunakan komponen Card global dengan shadow hover yang dramatis (shadow → shadow-lg)
- Pertahankan elemen dekorasi rounded shapes (rounded-bl-full, rounded-tr-full)

---

## LAYOUT HALAMAN

```
Container:      Full-width background
Max-width:      max-w-7xl mx-auto (untuk konten)
Background:     bg-slate-50
Navbar:         Sticky top, bg-white
Footer:         bg-slate-900 text-white
```

---

## WIREFRAME TEKSTUAL

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR (sticky)                                              │
│ Logo HeartPredict | Beranda Fitur Artikel | Masuk Daftar   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ HERO SECTION                                            │ │
│ │ [Headline Display + Subtitle + 2 CTA Buttons]           │ │
│ │ [Ilustrasi / Hero Image di sebelah kanan]              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ STATS SECTION (Social Proof)                            │ │
│ │ [1000+ Pengguna] [95% Akurasi] [24/7 Konsultasi AI]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ FITUR SECTION                                            │ │
│ │ [Card 1: Prediksi AI] [Card 2: Konsultasi] [Card 3: ...]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CARA KERJA SECTION                                       │ │
│ │ Step 1 → Step 2 → Step 3                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ARTIKEL TERBARU SECTION                                  │ │
│ │ [Article Card] [Article Card] [Article Card]            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CTA SECTION                                              │ │
│ │ "Mulai Cek Kesehatan Jantung Anda Sekarang"            │ │
│ │ [Tombol CTA Besar]                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ FOOTER                                                   │ │
│ │ Logo | Link | Sosmed | Copyright                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Navbar

```
Komponen:       Navbar (dari 01_GLOBAL_COMPONENTS.md)
Variant:        Public (unauthenticated)
Konten Tengah:  Menu navigasi
  Items:
    - "Beranda" (active) → scroll to #hero
    - "Fitur" → scroll to #features
    - "Artikel" → scroll to #articles atau /articles
Konten Kanan:
  - Button "Masuk" → variant=ghost, size=sm, route=/login
  - Button "Daftar" → variant=primary, size=sm, route=/register
```

---

### Section: Hero

```
Background:     bg-white
Padding:        py-20 px-8 (desktop), py-12 px-4 (mobile)
Layout:         grid grid-cols-1 lg:grid-cols-2 gap-12 items-center

Dekorasi Background:
  Shape 1:
    Position:   absolute top-20 right-10
    Size:       w-64 h-64
    Background: bg-emerald-100/30
    Radius:     rounded-bl-full
    Z-index:    -10

  Shape 2:
    Position:   absolute bottom-10 left-10
    Size:       w-48 h-48
    Background: bg-emerald-50/50
    Radius:     rounded-tr-full
    Z-index:    -10

Content Kiri:
  Overline:
    Tipe:       Overline typography (11px, semibold, uppercase, tracking-wide)
    Konten:     "PREDIKSI RISIKO PENYAKIT JANTUNG"
    Tailwind:   text-[11px] font-semibold uppercase tracking-wide text-emerald-600
    Margin:     mb-4

  Headline:
    Tipe:       Display typography (48px, 800, lh 1.1)
    Konten:     "Jaga Jantung Anda dengan Teknologi AI Terpercaya"
    Tailwind:   text-5xl font-extrabold leading-tight text-slate-900
    Font:       Plus Jakarta Sans
    Margin:     mb-6

  Subtitle:
    Tipe:       Body-LG (16px, 400, lh 1.6)
    Konten:     "HeartPredict membantu Anda mendeteksi risiko penyakit jantung secara dini menggunakan kecerdasan buatan. Dapatkan prediksi akurat dan konsultasi AI kapan saja."
    Tailwind:   text-base leading-relaxed text-slate-600
    Margin:     mb-8
    Max-width:  max-w-lg

  CTA Buttons:
    Layout:     flex flex-col sm:flex-row gap-4

    Button 1 "Mulai Cek Kesehatan":
      Variant:  primary
      Size:     lg
      Icon:     Lucide "HeartPulse" (left)
      Route:    /register (atau /health-check jika sudah login)

    Button 2 "Pelajari Lebih Lanjut":
      Variant:  outline
      Size:     lg
      Icon:     Lucide "ArrowRight" (right)
      Scroll:   smooth scroll to #features

Content Kanan:
  Illustration:
    Type:       Image atau SVG illustration
    Content:    Ilustrasi dokter dengan data visualisasi jantung / medical dashboard
    Tailwind:   w-full h-auto
    Alt:        "HeartPredict AI Prediction"
```

---

### Section: Stats (Social Proof)

```
Background:     bg-emerald-600
Text:           text-white
Padding:        py-12 px-8
Layout:         grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center

Stat Item 1:
  Icon:         Lucide "Users" w-10 h-10 text-emerald-200 mx-auto mb-3
  Value:        "1.000+"
                text-4xl font-bold text-white (Plus Jakarta Sans)
  Label:        "Pengguna Aktif"
                text-sm text-emerald-100

Stat Item 2:
  Icon:         Lucide "Target" w-10 h-10 text-emerald-200 mx-auto mb-3
  Value:        "95%"
                text-4xl font-bold text-white
  Label:        "Akurasi Prediksi"
                text-sm text-emerald-100

Stat Item 3:
  Icon:         Lucide "MessageSquare" w-10 h-10 text-emerald-200 mx-auto mb-3
  Value:        "24/7"
                text-4xl font-bold text-white
  Label:        "Konsultasi AI"
                text-sm text-emerald-100
```

---

### Section: Fitur

```
Background:     bg-slate-50
Padding:        py-16 px-8
Max-width:      max-w-7xl mx-auto

Section Header:
  Overline:
    Konten:     "FITUR UNGGULAN"
    Tailwind:   text-[11px] font-semibold uppercase tracking-wide text-emerald-600 text-center mb-3

  Heading:
    Tipe:       H2 (28px, 700, lh 1.3)
    Konten:     "Kenapa Memilih HeartPredict?"
    Tailwind:   text-3xl font-bold leading-snug text-slate-900 text-center mb-4
    Font:       Plus Jakarta Sans

  Description:
    Konten:     "Platform prediksi risiko jantung berbasis AI dengan fitur lengkap untuk kesehatan jantung Anda"
    Tailwind:   text-base text-slate-600 text-center mb-12 max-w-2xl mx-auto

Grid Features:
  Layout:       grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

  Feature Card (Komponen: Base Card dari 01_GLOBAL_COMPONENTS.md):
    Background: bg-white
    Padding:    p-6
    Border:     border border-slate-200
    Radius:     rounded-2xl
    Shadow:     shadow-sm
    Hover:      shadow-md -translate-y-1
    Transition: transition-all duration-200

  Feature 1:
    Icon Container:
      Size:     w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4
      Icon:     Lucide "Brain" w-7 h-7 text-emerald-600
    Title:      "Prediksi AI Akurat"
                text-lg font-semibold text-slate-900 mb-2 (Plus Jakarta Sans)
    Description: "Algoritma machine learning terlatih dengan ribuan data medis untuk hasil prediksi yang presisi"
                text-sm text-slate-600 leading-relaxed

  Feature 2:
    Icon:       Lucide "MessageSquareText" (emerald-600)
    Title:      "Konsultasi AI 24/7"
    Description: "Tanyakan apapun seputar kesehatan jantung Anda kepada chatbot AI yang responsif"

  Feature 3:
    Icon:       Lucide "FileText" (emerald-600)
    Title:      "Riwayat Lengkap"
    Description: "Simpan dan pantau semua hasil prediksi dan konsultasi Anda dalam satu dashboard"

  Feature 4:
    Icon:       Lucide "ShieldCheck" (emerald-600)
    Title:      "Data Aman & Privat"
    Description: "Semua data kesehatan Anda terenkripsi dan dijamin kerahasiaannya"

  Feature 5:
    Icon:       Lucide "BookOpen" (emerald-600)
    Title:      "Artikel Kesehatan"
    Description: "Akses ratusan artikel tentang kesehatan jantung yang ditulis oleh ahli"

  Feature 6:
    Icon:       Lucide "TrendingUp" (emerald-600)
    Title:      "Rekomendasi Personal"
    Description: "Dapatkan saran gaya hidup sehat yang disesuaikan dengan kondisi Anda"
```

---

### Section: Cara Kerja

```
Background:     bg-white
Padding:        py-16 px-8
Max-width:      max-w-6xl mx-auto

Section Header:
  Heading:      "Cara Kerja HeartPredict"
                text-3xl font-bold text-slate-900 text-center mb-4 (Plus Jakarta Sans)
  Description:  "Prediksi risiko jantung Anda hanya dalam 3 langkah mudah"
                text-base text-slate-600 text-center mb-12

Steps:
  Layout:       grid grid-cols-1 md:grid-cols-3 gap-8

  Step Item (structure):
    Number Badge:
      Size:     w-12 h-12 rounded-full bg-emerald-600 text-white
                flex items-center justify-center mx-auto mb-4
      Font:     text-xl font-bold (Plus Jakarta Sans)

    Title:      text-lg font-semibold text-slate-900 text-center mb-2
    Description: text-sm text-slate-600 text-center

  Step 1:
    Number:     "1"
    Title:      "Daftar Gratis"
    Description: "Buat akun HeartPredict dengan email Anda dalam hitungan detik"

  Step 2:
    Number:     "2"
    Title:      "Isi Data Kesehatan"
    Description: "Masukkan data vital seperti tekanan darah, kolesterol, dan riwayat medis Anda"

  Step 3:
    Number:     "3"
    Title:      "Dapatkan Hasil Prediksi"
    Description: "AI kami akan menganalisis dan memberikan hasil prediksi risiko jantung beserta rekomendasi"

  Connector (between steps, desktop only):
    Type:       Arrow icon atau garis putus-putus
    Icon:       Lucide "ArrowRight" text-emerald-300 (positioned between cards)
    Class:      hidden md:block absolute top-6 left-1/2 -translate-x-1/2
```

---

### Section: Artikel Terbaru

```
Background:     bg-slate-50
Padding:        py-16 px-8
Max-width:      max-w-7xl mx-auto

Section Header:
  Layout:       flex justify-between items-center mb-10

  Left:
    Heading:    "Artikel Kesehatan Terbaru"
                text-3xl font-bold text-slate-900 (Plus Jakarta Sans)

  Right:
    Link:       "Lihat Semua Artikel →"
                text-sm font-medium text-emerald-600 hover:text-emerald-700
                Route: /articles

Grid Articles:
  Layout:       grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

  Article Card (Komponen: Article Card dari 01_GLOBAL_COMPONENTS.md):
    Background:   bg-white
    Border:       border border-slate-200
    Radius:       rounded-2xl
    Shadow:       shadow (default) → shadow-lg (hover)
    Hover:        -translate-y-2, border-emerald-200
    Transition:   transition-all duration-200
    Overflow:     overflow-hidden

  Content per Card:
    Image:
      Width:      w-full h-48 object-cover
      Src:        (Article thumbnail)

    Category Badge (absolute top-4 left-4):
      Background: bg-emerald-100
      Text:       text-emerald-700 text-xs font-semibold
      Padding:    px-3 py-1
      Radius:     rounded-full
      Content:    "Nutrisi" / "Olahraga" / "Pencegahan"

    Content Padding: p-6

    Title:
      Text:       text-lg font-semibold text-slate-900
      Line-clamp: line-clamp-2
      Margin:     mb-2
      Content:    "10 Makanan Terbaik untuk Kesehatan Jantung"

    Excerpt:
      Text:       text-sm text-slate-600
      Line-clamp: line-clamp-3
      Margin:     mb-4
      Content:    (Article excerpt...)

    Meta:
      Layout:     flex items-center gap-4 text-xs text-slate-500
      Author:     "Dr. Ahmad Fauzi"
      Separator:  "•"
      Date:       "2 hari yang lalu"
```

---

### Section: CTA Final

```
Background:     bg-emerald-600
Padding:        py-16 px-8
Text:           text-white
Max-width:      max-w-4xl mx-auto text-center

Heading:
  Text:         "Mulai Jaga Kesehatan Jantung Anda Hari Ini"
                text-4xl font-bold text-white mb-4 (Plus Jakarta Sans)

Description:
  Text:         "Bergabunglah dengan ribuan pengguna yang telah mempercayai HeartPredict untuk kesehatan jantung mereka"
                text-lg text-emerald-100 mb-8 max-w-2xl mx-auto

CTA Button:
  Variant:      primary (tapi background putih untuk kontras)
  Custom:       bg-white text-emerald-600 hover:bg-emerald-50
  Size:         lg
  Icon:         Lucide "ArrowRight" (right)
  Text:         "Daftar Sekarang Gratis"
  Route:        /register
```

---

### Section: Footer

```
Background:     bg-slate-900
Text:           text-white
Padding:        py-12 px-8
Border:         border-t border-slate-800

Container:      max-w-7xl mx-auto

Layout:         grid grid-cols-1 md:grid-cols-4 gap-8 mb-8

Column 1 (Brand):
  Logo:         w-10 h-10 bg-emerald-500 rounded-lg mb-4
  Brand:        "HeartPredict"
                text-lg font-bold text-white mb-2 (Plus Jakarta Sans)
  Tagline:      "Platform prediksi risiko jantung berbasis AI terpercaya"
                text-sm text-slate-400 max-w-xs

Column 2 (Produk):
  Heading:      "Produk"
                text-sm font-semibold text-white mb-4
  Links:        (list, text-sm text-slate-400 hover:text-emerald-400)
    - Prediksi AI
    - Konsultasi
    - Artikel
    - Tentang Kami

Column 3 (Bantuan):
  Heading:      "Bantuan"
                text-sm font-semibold text-white mb-4
  Links:
    - FAQ
    - Kontak
    - Kebijakan Privasi
    - Syarat & Ketentuan

Column 4 (Ikuti Kami):
  Heading:      "Ikuti Kami"
                text-sm font-semibold text-white mb-4
  Social Icons:
    Layout:     flex gap-3
    Icon Size:  w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center
                hover:bg-emerald-600 transition-colors
    Icons:      Lucide "Facebook", "Twitter", "Instagram", "Linkedin"

Bottom Copyright:
  Border:       border-t border-slate-800 pt-8
  Text:         text-sm text-slate-500 text-center
  Content:      "© 2026 HeartPredict. All rights reserved."
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:

1. **Navbar** → variant Public (unauthenticated)
2. **Button** → variant primary, outline, ghost | size sm, md, lg
3. **Card** → Base card untuk feature cards, Article card untuk artikel
4. **Badge** → untuk category badge di article card

Komponen custom halaman ini:
- Hero illustration container
- Stats grid item
- Feature card (base card + custom icon container)
- Step number badge
- Footer column layout

---

## RESPONSIVE

### Mobile (<768px)

```
Hero:
  Layout:       grid-cols-1 (stack vertical)
  Illustration: order-first atau hidden (tergantung ukuran)
  Padding:      py-12 px-4
  Headline:     text-4xl (sedikit lebih kecil)
  Buttons:      flex-col (stack vertical) w-full

Stats:
  Grid:         grid-cols-1 (stack)
  Gap:          gap-6

Features:
  Grid:         grid-cols-1
  Gap:          gap-6

Cara Kerja:
  Grid:         grid-cols-1
  Connector:    hidden

Articles:
  Grid:         grid-cols-1
  Gap:          gap-6

Footer:
  Grid:         grid-cols-1 text-center
  Social:       justify-center
```

### Tablet (768-1024px)

```
Hero:
  Layout:       grid-cols-1 atau 2 (tergantung breakpoint md)
  Headline:     text-5xl

Stats:
  Grid:         grid-cols-3 (sudah 3 kolom di md)

Features:
  Grid:         grid-cols-2

Cara Kerja:
  Grid:         grid-cols-3
  Connector:    visible

Articles:
  Grid:         grid-cols-2

Footer:
  Grid:         grid-cols-2
```

### Desktop (>1024px)

```
Semua elemen tampil penuh sesuai wireframe
Max-width container: max-w-7xl
Features grid: grid-cols-3
Articles grid: grid-cols-3
Footer: grid-cols-4
```

---

## ANIMASI

```
Scroll Animations (optional dengan Framer Motion atau Intersection Observer):
  Hero content:       fade-in + slide-up from bottom — 500ms ease-out
  Stats items:        fade-in + count-up animation — 800ms staggered 100ms
  Feature cards:      fade-in + slide-up — 400ms staggered 80ms
  Step items:         fade-in + scale(0.9 → 1) — 400ms staggered 100ms
  Article cards:      fade-in + slide-up — 400ms staggered 100ms

Hover Animations:
  Article card:       shadow-lg + -translate-y-2 — 200ms ease-out
  Feature card:       shadow-md + -translate-y-1 — 200ms ease-out
  Social icons:       bg-emerald-600 — 150ms ease-in
  Links:              text-emerald-400 — 150ms ease-in

CTA Button:
  Hover:              bg-emerald-50 + shadow-md — 150ms
  Active:             scale(0.97) — 100ms
```

---

**Halaman Landing Page ini adalah first impression pengguna. Harus clean, modern, trustworthy, dan fast loading.**
