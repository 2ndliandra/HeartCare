# User Dashboard Page Documentation# 06 — User Dashboard

**Route:** `/user/dashboard`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Navbar + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- **MASALAH TERBESAR:** Sidebar di-hardcode ulang di setiap halaman (duplikasi code)
- Header terlalu tinggi (h-20 = 80px) memakan space
- Warna tidak konsisten, ada indigo yang muncul
- Stat cards tidak punya ikon yang relevan
- Dekorasi rounded shapes tidak konsisten

**Solusi baru:**
- **WAJIB:** Sidebar menggunakan komponen Sidebar User dari `01_GLOBAL_COMPONENTS.md`
- Header dikurangi dari h-20 menjadi h-16 (64px) — lebih compact
- Semua warna action/brand menggunakan Primary Emerald (#059669)
- Setiap stat card punya ikon yang relevan dari Lucide
- Warna aksen per stat card boleh berbeda (emerald/purple/amber/blue) untuk visual variety — TAPI warna primary action tetap Emerald
- **PERTAHANKAN:** Dekorasi rounded corner shapes (rounded-bl-full, rounded-tr-full) sebagai identitas visual
- **PERTAHANKAN:** Status severity color (Rendah/Sedang/Tinggi) sesuai design tokens

---

## LAYOUT HALAMAN

```
Container:      min-h-screen bg-slate-50
Layout:         flex

Sidebar (fixed left):
  Komponen:     Sidebar User (dari 01_GLOBAL_COMPONENTS.md)
  Width:        w-64 (desktop), w-20 (tablet), drawer (mobile)
  Active item:  "Dashboard"

Main Content:
  Margin-left:  ml-64 (desktop), ml-20 (tablet), ml-0 (mobile)
  Width:        flex-1
  Layout:       flex flex-col
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│          │ HEADER (h-16)                                   │
│          │ Greeting + Search + Notification + Avatar       │
│ SIDEBAR  ├─────────────────────────────────────────────────┤
│ USER     │ MAIN CONTENT (p-8 bg-slate-50)                  │
│          │                                                  │
│ • Dashb. │ ┌────────────────────────────────────────────┐  │
│ • Cek    │ │ STAT CARDS GRID (4 kolom)                  │  │
│ • Riwayat│ │ [Card 1] [Card 2] [Card 3] [Card 4]        │  │
│ • Konsu  │ └────────────────────────────────────────────┘  │
│ • Profil │                                                  │
│          │ ┌──────────────────────┬──────────────────────┐ │
│ [User]   │ │ SECTION:             │ SECTION:             │ │
│          │ │ Prediksi Terakhir    │ Riwayat Konsultasi   │ │
│          │ │ [Hasil card besar]   │ [List chat items]    │ │
│          │ │ [CTA button]         │ [CTA button]         │ │
│          │ └──────────────────────┴──────────────────────┘ │
│          │                                                  │
│          │ ┌────────────────────────────────────────────┐  │
│          │ │ SECTION: Tips Kesehatan Hari Ini           │  │
│          │ │ [Card dengan icon + text]                  │  │
│          │ └────────────────────────────────────────────┘  │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Component: Sidebar

```
Komponen:       Sidebar User (dari 01_GLOBAL_COMPONENTS.md)
                WAJIB import dan gunakan komponen, JANGAN hardcode ulang!

Active menu:    "Dashboard"
                bg-emerald-600/10 border-l-4 border-emerald-500
                text-emerald-400 font-semibold

Referensi:      Lihat detail lengkap di 01_GLOBAL_COMPONENTS.md → SIDEBAR USER
```

---

### Section: Header

```
Height:         h-16 (64px) — DIKURANGI dari h-20
Background:     bg-white
Border:         border-b border-slate-200
Padding:        px-8
Layout:         flex items-center justify-between
Sticky:         sticky top-0 z-10

Content Left:
  Greeting:
    Layout:     flex flex-col
    Hello:      "Halo, [Nama User] 👋"
                text-xl font-bold text-slate-900 (Plus Jakarta Sans)
    Subtitle:   "Senin, 18 April 2026"
                text-sm text-slate-500

Content Center:
  Search (optional untuk future):
    (kosong dulu, atau search bar untuk quick nav)

Content Right:
  Notification Button:
    Komponen:   Icon button (dari 01_GLOBAL_COMPONENTS.md)
    Icon:       Lucide "Bell" w-5 h-5 text-slate-600
    Padding:    p-2.5
    Hover:      bg-slate-100
    Radius:     rounded-lg
    Badge:      (jika ada notif) w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2

  User Dropdown:
    Layout:     flex items-center gap-3 ml-4

    Avatar:
      Size:     w-9 h-9 rounded-full
      Background: bg-emerald-100
      Text:     text-emerald-700 text-sm font-semibold
      Content:  (inisial nama, e.g., "JD")

    Name (desktop only):
      Text:     text-sm font-medium text-slate-700
      Hidden:   hidden md:block

    Icon:
      Icon:     Lucide "ChevronDown" w-4 h-4 text-slate-500

    Dropdown Menu:
      (sama dengan Navbar dropdown di 01_GLOBAL_COMPONENTS.md)
      Items:    Profil, Pengaturan, Keluar
```

---

### Section: Stat Cards Grid

```
Container:
  Padding:      p-8
  Background:   bg-slate-50
  Layout:       grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
  Margin:       mb-8

Dekorasi Background (absolute, behind cards):
  Shape 1:
    Position:   absolute top-10 right-10
    Size:       w-64 h-64
    Background: bg-emerald-100/20
    Radius:     rounded-bl-full
    Z-index:    -10

  Shape 2:
    Position:   absolute bottom-20 left-20
    Size:       w-48 h-48
    Background: bg-purple-100/20
    Radius:     rounded-tr-full
    Z-index:    -10
```

---

### Stat Card 1: Total Prediksi

```
Komponen:       Stat Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Hover:          shadow-md -translate-y-1
Transition:     transition-all duration-200

Icon Container:
  Size:         w-12 h-12 bg-emerald-100 rounded-xl
                flex items-center justify-center
  Icon:         Lucide "Activity" w-6 h-6 text-emerald-600

Value:
  Text:         "12"
                text-3xl font-bold text-slate-900 mt-4 (Plus Jakarta Sans)

Label:
  Text:         "Total Prediksi"
                text-sm text-slate-500 mt-1

Trend (optional):
  Layout:       flex items-center gap-1 mt-2
  Icon:         Lucide "TrendingUp" w-4 h-4 text-emerald-600
  Text:         "+2 bulan ini"
                text-xs font-medium text-emerald-600
```

---

### Stat Card 2: Prediksi Terakhir

```
(Struktur sama dengan Card 1)

Icon Container:
  Background:   bg-purple-100
  Icon:         Lucide "Heart" w-6 h-6 text-purple-600

Value:
  Text:         "Rendah"
                text-3xl font-bold text-emerald-600 (warna sesuai severity)

Label:
  Text:         "Status Risiko"
                text-sm text-slate-500 mt-1

Badge (instead of trend):
  Komponen:     Badge (dari 01_GLOBAL_COMPONENTS.md)
  Variant:      success (bg-emerald-100 text-emerald-900)
  Text:         "Risiko Rendah"
  Margin:       mt-2
```

---

### Stat Card 3: Konsultasi AI

```
Icon Container:
  Background:   bg-blue-100
  Icon:         Lucide "MessageSquare" w-6 h-6 text-blue-600

Value:
  Text:         "8"
                text-3xl font-bold text-slate-900

Label:
  Text:         "Konsultasi AI"
                text-sm text-slate-500

Trend:
  Icon:         Lucide "TrendingUp" w-4 h-4 text-blue-600
  Text:         "+3 minggu ini"
                text-xs font-medium text-blue-600
```

---

### Stat Card 4: Artikel Dibaca

```
Icon Container:
  Background:   bg-amber-100
  Icon:         Lucide "BookOpen" w-6 h-6 text-amber-600

Value:
  Text:         "15"
                text-3xl font-bold text-slate-900

Label:
  Text:         "Artikel Dibaca"
                text-sm text-slate-500

Trend:
  Icon:         Lucide "TrendingUp" w-4 h-4 text-amber-600
  Text:         "+5 bulan ini"
                text-xs font-medium text-amber-600
```

---

### Section: Prediksi Terakhir & Riwayat Konsultasi

```
Container:
  Padding:      px-8 pb-8
  Layout:       grid grid-cols-1 lg:grid-cols-2 gap-6
```

---

### Card: Prediksi Terakhir

```
Komponen:       Base Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm

Header:
  Heading:      "Prediksi Terakhir"
                text-lg font-semibold text-slate-900 mb-4 (Plus Jakarta Sans)

Content:
  Date:
    Text:       "15 April 2026"
                text-xs text-slate-500 mb-3

  Risk Badge (large):
    Layout:     inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4
    Background: bg-emerald-100
    Icon:       Lucide "Heart" w-5 h-5 text-emerald-600
    Text:       "Risiko Rendah"
                text-base font-semibold text-emerald-900

  Score (optional gauge chart area):
    Layout:     flex items-center justify-center my-6
    Type:       Circular progress / semi-donut chart
    Value:      "25%" (risiko score)
    Color:      text-emerald-600 (sesuai severity)
    Size:       w-32 h-32

  Description:
    Text:       "Hasil prediksi menunjukkan risiko penyakit jantung Anda berada di level rendah. Pertahankan gaya hidup sehat Anda."
                text-sm text-slate-600 mb-6 leading-relaxed

  CTA Button:
    Komponen:   Button (dari 01_GLOBAL_COMPONENTS.md)
    Variant:    outline
    Size:       sm
    Width:      w-full
    Text:       "Lihat Detail Hasil"
    Icon:       Lucide "ArrowRight" (right)
    Route:      /user/prediction-result/[id]
```

---

### Card: Riwayat Konsultasi

```
Komponen:       Base Card
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm

Header:
  Layout:       flex items-center justify-between mb-4
  Heading:      "Riwayat Konsultasi"
                text-lg font-semibold text-slate-900 (Plus Jakarta Sans)
  Link:         "Lihat Semua →"
                text-sm font-medium text-emerald-600 hover:text-emerald-700
                Route: /user/history

Chat List:
  Layout:       flex flex-col gap-3

  Chat Item 1:
    Layout:     flex items-start gap-3 p-3 rounded-lg
                hover:bg-slate-50 cursor-pointer transition-colors
    Icon:       Lucide "MessageSquare" w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5
    Content:
      Title:    "Konsultasi tentang Kolesterol"
                text-sm font-medium text-slate-900 mb-1 line-clamp-1
      Preview:  "Dokter: Kolesterol Anda berada di..."
                text-xs text-slate-500 line-clamp-1 mb-1
      Meta:     "2 hari yang lalu"
                text-xs text-slate-400

  Chat Item 2:
    (struktur sama)
    Title:      "Tanya Diet untuk Jantung Sehat"
    Preview:    "AI: Saya rekomendasikan..."
    Meta:       "1 minggu yang lalu"

  Chat Item 3:
    (struktur sama)
    Title:      "Gejala Nyeri Dada"
    Preview:    "AI: Segera konsultasi dengan dokter..."
    Meta:       "2 minggu yang lalu"

Empty State (jika tidak ada chat):
  Komponen:     Empty State (dari 01_GLOBAL_COMPONENTS.md)
  Icon:         Lucide "MessageSquareOff" w-12 h-12 text-slate-300
  Text:         "Belum ada konsultasi"
                text-sm text-slate-500
  CTA:          Button "Mulai Konsultasi" variant=primary size=sm

CTA Button (jika ada chat):
  Komponen:   Button
  Variant:    outline
  Size:       sm
  Width:      w-full
  Text:       "Mulai Konsultasi Baru"
  Icon:       Lucide "Plus" (left)
  Route:      /user/consultation
  Margin:     mt-4
```

---

### Section: Tips Kesehatan Hari Ini

```
Container:
  Padding:      px-8 pb-8

Card:
  Komponen:     Base Card
  Background:   bg-gradient-to-br from-emerald-500 to-emerald-600
  Border:       none
  Radius:       rounded-2xl
  Padding:      p-6
  Shadow:       shadow-md

Layout:         flex items-start gap-4

Icon:
  Icon:         Lucide "Lightbulb" w-10 h-10 text-emerald-100

Content:
  Label:        "Tips Hari Ini"
                text-xs font-semibold uppercase tracking-wide text-emerald-100 mb-2

  Heading:      "Minum Air Putih yang Cukup"
                text-xl font-bold text-white mb-2 (Plus Jakarta Sans)

  Description:  "Pastikan Anda minum minimal 8 gelas air putih setiap hari untuk menjaga kesehatan jantung dan sirkulasi darah yang optimal."
                text-sm text-emerald-50 leading-relaxed
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:

1. **Sidebar User** → WAJIB gunakan komponen ini, jangan hardcode
2. **Button** → variant primary, outline, ghost | size sm, md
3. **Card** → Base card, Stat card
4. **Badge** → untuk status risiko
5. **Empty State** → jika tidak ada data konsultasi

Komponen custom halaman ini:
- Header dengan greeting + notification + avatar
- Stat cards dengan ikon dan trend indicator
- Chat list item
- Tips card dengan gradient background

---

## RESPONSIVE

### Mobile (<768px)

```
Sidebar:        Drawer (hidden by default, toggle dengan hamburger)
Margin-left:    ml-0
Header:
  Padding:      px-4
  Greeting:     text-lg (lebih kecil)
  Date:         hidden

Stat Cards:
  Grid:         grid-cols-1
  Gap:          gap-4

Prediksi & Konsultasi:
  Grid:         grid-cols-1
  Stack vertical

Content padding: px-4 py-6
```

### Tablet (768-1024px)

```
Sidebar:        w-20 (icon-only mode)
Margin-left:    ml-20
Stat Cards:
  Grid:         grid-cols-2
Header:
  Greeting:     text-lg

Prediksi & Konsultasi:
  Grid:         grid-cols-1 atau grid-cols-2 (tergantung ukuran tablet)
```

### Desktop (>1024px)

```
Sidebar:        w-64 (full sidebar with labels)
Margin-left:    ml-64
Stat Cards:
  Grid:         grid-cols-4
Header:
  Full layout dengan semua elemen visible
Prediksi & Konsultasi:
  Grid:         grid-cols-2
Content padding: px-8 py-8
```

---

## ANIMASI

```
Page Load:
  Stat cards:     fade-in + slide-up — 400ms staggered 80ms per card
  Sections:       fade-in + slide-up — 400ms staggered 100ms

Stat Card Hover:
  Shadow:         shadow-md
  Transform:      -translate-y-1
  Duration:       200ms ease-out

Chat Item Hover:
  Background:     bg-slate-50
  Duration:       150ms ease-in

Value Count-up (optional):
  Numbers:        Animate from 0 to actual value — 800ms ease-out
  Trigger:        On first viewport enter (Intersection Observer)

Sidebar Toggle (mobile):
  Slide-in:       translate-x-0 from -translate-x-full — 300ms ease-out
  Overlay:        fade-in — 200ms
```

---

## DATA LOADING

### Loading State

```
Stat Cards:
  Komponen:     Loading Skeleton — Stat Card variant (dari 01_GLOBAL_COMPONENTS.md)
  Count:        4 cards
  Animation:    animate-pulse

Prediksi Card:
  Skeleton:     Card dengan placeholder bars

Konsultasi List:
  Skeleton:     3 chat item skeletons
```

### Empty State

```
Jika belum ada prediksi:
  Komponen:     Empty State (dari 01_GLOBAL_COMPONENTS.md)
  Icon:         Lucide "HeartPulse" w-16 h-16 text-slate-300
  Heading:      "Belum Ada Prediksi"
  Description:  "Mulai cek kesehatan jantung Anda untuk mendapatkan prediksi risiko"
  CTA:          Button "Mulai Cek Kesehatan" variant=primary → route=/user/health-check
```

---

**Dashboard adalah halaman utama user. Harus informative, welcoming, dan memberikan overview lengkap status kesehatan user. Warna dan spacing harus konsisten dengan design tokens.**
