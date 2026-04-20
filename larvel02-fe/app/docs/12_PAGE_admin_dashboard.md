# Admin Dashboard Page # 12 — Admin Dashboard

**Route:** `/admin/dashboard`  
**Role:** Admin  
**Layout:** AdminLayout (Sidebar Admin + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Admin dashboard mungkin digabung dengan user dashboard atau tidak ada sama sekali
- Tidak ada pemisahan jelas antara admin layout dan user layout

**Solusi baru:**
- **Sidebar Admin** terpisah dari Sidebar User (komponen berbeda dengan menu admin-specific)
- Stat cards untuk metrics admin: Total User, Prediksi Hari Ini, Artikel Published, Dataset Aktif
- Table atau list untuk recent activities
- Charts untuk analytics (user growth, prediction trends)
- Quick actions untuk admin tasks

---

## LAYOUT HALAMAN

```
Container:      AdminLayout
Sidebar:        Sidebar Admin (dari 01_GLOBAL_COMPONENTS.md)
Main Content:   max-w-7xl mx-auto px-8 py-8
Background:     bg-slate-50
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER                                          │
│ ADMIN    │ "Dashboard Admin" + Date                        │
│          ├─────────────────────────────────────────────────┤
│ • Dashb. │ ┌─────────────────────────────────────────────┐ │
│ • Users  │ │ STAT CARDS (4 kolom)                        │ │
│ • Article│ │ [Total User] [Prediksi] [Artikel] [Dataset] │ │
│ • Dataset│ └─────────────────────────────────────────────┘ │
│ • Categ  │                                                  │
│          │ ┌───────────────────┬──────────────────────────┐│
│ [Admin]  │ │ CHART: User Growth│ CHART: Predictions       ││
│          │ └───────────────────┴──────────────────────────┘│
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ TABLE: Recent Users                         │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ TABLE: Recent Predictions                   │ │
│          │ └─────────────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Component: Sidebar Admin

```
Komponen:       Sidebar Admin (dari 01_GLOBAL_COMPONENTS.md)
Active menu:    "Dashboard"

Menu Items:
  1. Dashboard       → /admin/dashboard
  2. Manajemen User  → /admin/users
  3. Manajemen Artikel → /admin/articles
  4. Manajemen Dataset → /admin/datasets
  5. Kategori Artikel  → /admin/categories

(Lihat detail lengkap di 01_GLOBAL_COMPONENTS.md → SIDEBAR ADMIN)
```

---

### Section: Header

```
(Sama struktur dengan User Dashboard Header)
Height:         h-16
Background:     bg-white border-b border-slate-200
Padding:        px-8

Greeting:       "Dashboard Admin"
                text-xl font-bold text-slate-900

Date:           "Senin, 18 April 2026"
                text-sm text-slate-500

Right:          Notification + Admin Avatar Dropdown
```

---

### Section: Stat Cards

```
Layout:         grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8

Card 1: Total User
  Icon BG:      bg-emerald-100
  Icon:         Lucide "Users" text-emerald-600
  Value:        "1,247"
  Label:        "Total Pengguna"
  Trend:        "+12% bulan ini" (emerald)

Card 2: Prediksi Hari Ini
  Icon BG:      bg-blue-100
  Icon:         Lucide "Activity" text-blue-600
  Value:        "34"
  Label:        "Prediksi Hari Ini"
  Trend:        "+5 dari kemarin" (blue)

Card 3: Artikel Published
  Icon BG:      bg-purple-100
  Icon:         Lucide "FileText" text-purple-600
  Value:        "89"
  Label:        "Artikel Published"
  Trend:        "+3 minggu ini" (purple)

Card 4: Dataset Aktif
  Icon BG:      bg-amber-100
  Icon:         Lucide "Database" text-amber-600
  Value:        "12"
  Label:        "Dataset Aktif"
  Trend:        "Semua terverifikasi" (amber)
```

---

### Section: Charts

```
Container:
  Layout:       grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8

Chart 1: User Growth
  Card:         Base Card bg-white p-6 rounded-2xl
  Header:       "Pertumbuhan Pengguna"
  Type:         Line chart atau Area chart
  X-Axis:       Bulan (Jan - Apr 2026)
  Y-Axis:       Jumlah user
  Color:        emerald-600

Chart 2: Prediction Trends
  Card:         Base Card
  Header:       "Tren Prediksi"
  Type:         Bar chart
  X-Axis:       Kategori Risiko (Rendah/Sedang/Tinggi)
  Y-Axis:       Jumlah prediksi
  Colors:       emerald-500, amber-500, red-500
```

---

### Section: Recent Users

```
Card:           Base Card bg-white p-6 rounded-2xl mb-6

Header:
  Layout:       flex items-center justify-between mb-4
  Title:        "Pengguna Terbaru"
                text-lg font-semibold text-slate-900
  Link:         "Lihat Semua →"
                text-sm font-medium text-emerald-600
                Route: /admin/users

Table:
  Komponen:     Data Table (dari 01_GLOBAL_COMPONENTS.md)

  Columns:
    - Nama
    - Email
    - Bergabung
    - Status
    - Aksi

  Rows (sample):
    Name:       "John Doe"
    Email:      "john@example.com"
    Joined:     "18 Apr 2026"
    Status:     Badge "Aktif" (success)
    Actions:    Button "Lihat" (ghost, sm)

  Max rows:     5 (show only recent)
```

---

### Section: Recent Predictions

```
Card:           Base Card

Header:
  Title:        "Prediksi Terbaru"
  Link:         "Lihat Semua →"

Table:
  Columns:
    - Pengguna
    - Tanggal
    - Risiko
    - Skor
    - Aksi

  Rows:
    User:       "John Doe"
    Date:       "18 Apr, 10:30"
    Risk:       Badge "Rendah" (success)
    Score:      "25%"
    Actions:    Button "Detail" (ghost, sm)

  Max rows:     5
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar Admin** → WAJIB gunakan, bukan Sidebar User
2. **Button**
3. **Card** → Stat cards, chart containers
4. **Badge** → status
5. **Data Table** → recent users, recent predictions

Komponen custom:
- Charts (Recharts)
- Admin header
- Stat cards dengan admin-specific metrics

---

## RESPONSIVE

```
Mobile:       Stat cards grid-cols-1, Charts stack vertical, Tables scroll horizontal
Tablet:       Stat cards grid-cols-2, Charts grid-cols-1
Desktop:      Stat cards grid-cols-4, Charts grid-cols-2
```

---

**Admin Dashboard harus memberikan overview lengkap tentang sistem: user metrics, prediction analytics, dan recent activities. Harus clear dan actionable untuk admin monitoring.**
