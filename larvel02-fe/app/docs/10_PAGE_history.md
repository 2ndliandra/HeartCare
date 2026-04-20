# History Page Documentation# 10 — Riwayat Prediksi

**Route:** `/user/history`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Riwayat mungkin ditampilkan sebagai tabel biasa tanpa filter
- Tidak ada visualisasi trend risiko dari waktu ke waktu
- Detail prediksi mungkin tidak accessible

**Solusi baru:**
- Timeline view dengan kartu per prediksi (lebih visual daripada tabel)
- Filter dan search untuk mencari riwayat spesifik
- Chart trend risiko dari waktu ke waktu (line chart)
- Setiap kartu bisa di-klik untuk lihat detail lengkap
- Badge status risiko dengan warna konsisten
- Export riwayat sebagai PDF/CSV

---

## LAYOUT HALAMAN

```
Container:      UserLayout
Main Content:   max-w-6xl mx-auto px-8 py-8
Background:     bg-slate-50
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER                                          │
│ USER     │ "Riwayat Prediksi" + Filter + Export            │
│          ├─────────────────────────────────────────────────┤
│          │ ┌─────────────────────────────────────────────┐ │
│ [active: │ │ TREND CHART CARD                            │ │
│  Riwayat]│ │ [Line chart showing risk over time]         │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ FILTERS BAR                                 │ │
│          │ │ [Search] [Date Range] [Risk Level Filter]   │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ TIMELINE / LIST                             │ │
│          │ │                                             │ │
│          │ │ Apr 2026                                    │ │
│          │ │ ├─ [Prediction Card 18 Apr]                 │ │
│          │ │ ├─ [Prediction Card 10 Apr]                 │ │
│          │ │                                             │ │
│          │ │ Mar 2026                                    │ │
│          │ │ ├─ [Prediction Card 28 Mar]                 │ │
│          │ │ └─ [Prediction Card 15 Mar]                 │ │
│          │ │                                             │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ [Pagination atau Load More]                     │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Page Header

```
Container:
  Layout:       flex items-center justify-between mb-6

Left Content:
  Breadcrumb:   "Dashboard" → "Riwayat"
                text-sm text-slate-500 mb-2

  Heading:      "Riwayat Prediksi"
                text-3xl font-bold text-slate-900 mb-1 (Plus Jakarta Sans)

  Count:        "12 Total Prediksi"
                text-sm text-slate-600

Right Content:
  Export Button:
    Variant:    outline
    Size:       sm
    Icon:       Lucide "Download" (left)
    Text:       "Export PDF"
    Dropdown:   (optional) PDF / CSV options
```

---

### Card: Trend Chart

```
Komponen:       Base Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Margin:         mb-6

Header:
  Layout:       flex items-center justify-between mb-6

  Title:        "Trend Risiko Kesehatan"
                text-lg font-semibold text-slate-900 (Plus Jakarta Sans)

  Period Select:
    Type:       Select dropdown
    Options:    "3 Bulan Terakhir" | "6 Bulan Terakhir" | "1 Tahun" | "Semua"
    Style:      text-sm border border-slate-200 rounded-lg px-3 py-2

Chart:
  Type:         Line Chart (Recharts)
  Height:       h-64
  X-Axis:       Tanggal prediksi
  Y-Axis:       Risk score (0-100%)
  Line:         stroke-emerald-600 (atau multi-color sesuai severity range)
  Data Points:  Dots pada setiap prediksi
  Tooltip:      Show date, score, risk level
  Grid:         Light background grid
  Area:         (optional) Fill gradient dari line ke axis

  Color Logic:
    Score 0-30%:    emerald-600 (Rendah)
    Score 30-60%:   amber-500 (Sedang)
    Score >60%:     red-500 (Tinggi)

Empty State:
  (jika belum ada cukup data untuk chart)
  Icon:         Lucide "TrendingUp" w-12 h-12 text-slate-300
  Text:         "Belum cukup data untuk menampilkan trend"
                text-sm text-slate-500 text-center
```

---

### Component: Filters Bar

```
Container:
  Background:   bg-white
  Border:       border border-slate-200
  Radius:       rounded-xl
  Padding:      p-4
  Shadow:       shadow-sm
  Margin:       mb-6
  Layout:       grid grid-cols-1 md:grid-cols-3 gap-4

Search Input:
  Komponen:     Input Field (dari 01_GLOBAL_COMPONENTS.md)
  Placeholder:  "Cari berdasarkan tanggal atau catatan..."
  Icon:         Lucide "Search" (left)
  Type:         text
  Width:        w-full

Date Range Picker:
  Type:         Date input atau custom date range picker
  Placeholder:  "Pilih Rentang Tanggal"
  Icon:         Lucide "Calendar" (left)
  Default:      (kosong — show all)

Risk Level Filter:
  Type:         Select dropdown
  Placeholder:  "Semua Tingkat Risiko"
  Icon:         Lucide "Filter" (left)
  Options:
    - "Semua"
    - "Risiko Rendah"
    - "Risiko Sedang"
    - "Risiko Tinggi"
```

---

### Component: Timeline List

```
Container:
  Background:   transparent
  Layout:       flex flex-col gap-8

Month Section (struktur):
  Month Header:
    Text:       "April 2026"
                text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4
```

---

### Component: Prediction Card (in timeline)

```
Komponen:       Base Card
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Hover:          shadow-md border-emerald-200 -translate-y-0.5
Cursor:         cursor-pointer
Transition:     transition-all duration-200
Margin:         mb-4

Layout:         flex items-start gap-6

Left: Date Badge
  Container:
    Width:      w-16 flex-shrink-0 text-center
    Padding:    py-2 px-3
    Background: bg-slate-50
    Border:     border border-slate-200
    Radius:     rounded-xl

  Day:          "18"
                text-2xl font-bold text-slate-900 (Plus Jakarta Sans)
  Month:        "Apr"
                text-xs text-slate-500 uppercase

Center: Content
  Layout:       flex-1

  Header:
    Layout:     flex items-center justify-between mb-3

    Risk Badge:
      Komponen: Badge (dari 01_GLOBAL_COMPONENTS.md)
      Variant:  (sesuai risk_level)
                success (Rendah) | warning (Sedang) | danger (Tinggi)
      Size:     normal

    Score:
      Text:     "25%"
                text-sm font-semibold (warna sesuai severity)

  Details Grid:
    Layout:     grid grid-cols-2 gap-x-6 gap-y-2 mb-3

    Item (struktur):
      Label:    text-xs text-slate-500
      Value:    text-sm font-medium text-slate-900

    Items:
      - Label: "Tekanan Darah" | Value: "120/80 mmHg"
      - Label: "Kolesterol" | Value: "200 mg/dL"
      - Label: "Detak Jantung" | Value: "72 bpm"
      - Label: "BMI" | Value: "24.2"

  Notes (optional):
    Text:       "Catatan: Kondisi stabil, lanjutkan pola hidup sehat"
                text-xs text-slate-600 italic
                line-clamp-2

Right: Actions
  Layout:       flex flex-col gap-2

  View Button:
    Variant:    outline
    Size:       sm
    Icon:       Lucide "Eye" (left)
    Text:       "Lihat Detail"
    Route:      /user/prediction-result/:id

  Download Button:
    Variant:    ghost
    Size:       sm
    Icon:       Lucide "Download"
    Text:       "PDF"
```

---

### Component: Empty State

```
(jika tidak ada riwayat prediksi)

Komponen:       Empty State (dari 01_GLOBAL_COMPONENTS.md)
Icon:           Lucide "History" w-16 h-16 text-slate-300
Heading:        "Belum Ada Riwayat Prediksi"
Description:    "Mulai cek kesehatan jantung Anda untuk melihat riwayat prediksi"
CTA:
  Button:       "Mulai Cek Kesehatan"
  Variant:      primary
  Route:        /user/health-check
```

---

### Component: Pagination

```
(jika data banyak)

Container:
  Layout:       flex items-center justify-between
  Padding:      py-6
  Border:       border-t border-slate-200 mt-6

Info:
  Text:         "Menampilkan 1-10 dari 12 prediksi"
                text-sm text-slate-600

Buttons:
  (sama dengan Data Table pagination di 01_GLOBAL_COMPONENTS.md)
  Prev/Next buttons + page numbers
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar User** → active: Riwayat
2. **Button** → outline, ghost, sm
3. **Card** → base card, prediction cards
4. **Badge** → risk status
5. **Input Field** → search, filters
6. **Empty State** → jika tidak ada data
7. **Pagination** → jika data banyak

Komponen custom:
- Trend line chart (Recharts)
- Timeline layout dengan month sections
- Prediction card dengan date badge
- Filters bar

---

## RESPONSIVE

### Mobile (<768px)

```
Filters:        grid-cols-1 (stack vertical)
Prediction Card:
  Layout:       flex-col (stack vertical)
  Date Badge:   w-full justify-start flex-row
  Actions:      flex-row gap-2 w-full

Chart:          h-48 (sedikit lebih pendek)
```

### Tablet & Desktop

```
Filters:        grid-cols-3
Prediction Card: flex-row (horizontal layout)
Chart:          h-64
Actions:        flex-col
```

---

## ANIMASI

```
Chart Load:
  Line draw:      Animate path dari kiri ke kanan — 1000ms ease-out
  Data points:    fade-in + scale — staggered per point

Card Hover:
  Shadow:         shadow-md
  Border:         border-emerald-200
  Transform:      -translate-y-0.5
  Duration:       200ms ease-out

Filter Change:
  List refresh:   fade-out → fade-in — 300ms

Pagination:
  Page change:    fade content — 200ms
```

---

## API INTEGRATION

### Request

```typescript
GET /api/predictions/history

Headers:
  Authorization: Bearer [token]

Query Params:
  ?page=1
  &limit=10
  &risk_level=rendah  // optional filter
  &date_from=2026-01-01  // optional
  &date_to=2026-04-18    // optional
  &search=...            // optional

Response:
{
  "success": true,
  "data": {
    "predictions": [
      {
        "id": 123,
        "risk_level": "rendah",
        "risk_score": 25,
        "created_at": "2026-04-18T10:30:00Z",
        "data_summary": {
          "systolic_bp": 120,
          "diastolic_bp": 80,
          "cholesterol": 200,
          "heart_rate": 72,
          "bmi": 24.2
        },
        "notes": "Kondisi stabil"
      },
      // ... more predictions
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 12,
      "per_page": 10
    },
    "chart_data": [
      {
        "date": "2026-04-18",
        "score": 25,
        "risk_level": "rendah"
      },
      // ... more data points for chart
    ]
  }
}
```

---

**Halaman Riwayat harus memberikan overview yang jelas terhadap perjalanan kesehatan user. Chart trend adalah key feature untuk melihat progress. Filter harus mudah digunakan untuk mencari prediksi spesifik.**
