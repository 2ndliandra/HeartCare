# Health Check Page Documentation# 07 — Health Check Form

**Route:** `/user/health-check`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Form mungkin menggunakan multi-step wizard yang kompleks
- Tidak ada tooltip penjelasan untuk field medis
- Validasi tidak jelas

**Solusi baru:**
- **Form multi-section** (bukan multi-step wizard) — semua dalam satu halaman dengan scroll
- Setiap section punya heading dan description
- Setiap field medis ada ikon "?" dengan tooltip penjelasan
- Validasi real-time dengan error message yang jelas
- Progress indicator di top untuk menunjukkan completion
- Tombol submit full-width, primary, dengan loading state

---

## LAYOUT HALAMAN

```
Container:      UserLayout (Sidebar + Main Content)
Main Content:   max-w-4xl mx-auto px-8 py-8
Background:     bg-slate-50
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER                                          │
│ USER     │ "Cek Kesehatan Jantung" + Breadcrumb            │
│          ├─────────────────────────────────────────────────┤
│          │ PROGRESS INDICATOR (0-100%)                     │
│          ├─────────────────────────────────────────────────┤
│          │ ┌─────────────────────────────────────────────┐ │
│ [active: │ │ FORM CARD                                   │ │
│  Cek     │ │                                             │ │
│  Kesehat]│ │ Section 1: Data Demografis                  │ │
│          │ │ [Usia] [Jenis Kelamin]                      │ │
│          │ │                                             │ │
│          │ │ Section 2: Data Vital                       │ │
│          │ │ [Tekanan Darah] [Kolesterol] [Gula Darah]   │ │
│          │ │ [Detak Jantung] [BMI]                       │ │
│          │ │                                             │ │
│          │ │ Section 3: Riwayat Medis                    │ │
│          │ │ [Checkboxes kondisi]                        │ │
│          │ │                                             │ │
│          │ │ Section 4: Gejala & Gaya Hidup              │ │
│          │ │ [Checkboxes gejala]                         │ │
│          │ │ [Radio buttons: merokok, olahraga, dll]     │ │
│          │ │                                             │ │
│          │ │ [Submit Button Full-width]                  │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Page Header

```
Container:
  Padding:      pb-6 border-b border-slate-200 mb-6

Breadcrumb:
  Layout:       flex items-center gap-2 text-sm text-slate-500 mb-3
  Items:        "Dashboard" → "Cek Kesehatan"
  Separator:    Lucide "ChevronRight" w-4 h-4
  Active:       text-slate-900 font-medium

Heading:
  Text:         "Cek Kesehatan Jantung"
                text-3xl font-bold text-slate-900 mb-2 (Plus Jakarta Sans)

Description:
  Text:         "Lengkapi data kesehatan Anda untuk mendapatkan prediksi risiko penyakit jantung"
                text-base text-slate-600
```

---

### Component: Progress Indicator

```
Container:
  Background:   bg-white
  Border:       border border-slate-200
  Radius:       rounded-xl
  Padding:      p-4
  Margin:       mb-6
  Shadow:       shadow-sm

Layout:         flex items-center gap-4

Label:
  Text:         "Progres Pengisian"
                text-sm font-medium text-slate-700

Progress Bar:
  Container:    h-2 bg-slate-200 rounded-full flex-1
  Fill:         h-2 bg-emerald-600 rounded-full transition-all duration-300
                (width berdasarkan jumlah field terisi)

Percentage:
  Text:         "0%"
                text-sm font-semibold text-emerald-600
                (update real-time saat user mengisi)
```

---

### Component: Form Card

```
Komponen:       Base Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-8
Shadow:         shadow-sm
```

---

### Form Section 1: Data Demografis

```
Section Header:
  Layout:       flex items-center gap-3 mb-6 pb-4 border-b border-slate-200

  Icon:
    Icon:       Lucide "User" w-6 h-6 text-emerald-600
    Container:  w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center

  Heading:
    Text:       "Data Demografis"
                text-xl font-semibold text-slate-900 (Plus Jakarta Sans)

Fields Layout:
  Layout:       grid grid-cols-1 md:grid-cols-2 gap-6 mb-8

  Field: Usia
    Komponen:   Input Field (dari 01_GLOBAL_COMPONENTS.md)
    Label:      "Usia" (required)
    Type:       number
    Placeholder: "Contoh: 35"
    Icon:       Lucide "Calendar" (left)
    Suffix:     "tahun"
    Validasi:   Required, min 18, max 120
    Error:      "Usia harus antara 18-120 tahun"
    Helper:     "Masukkan usia Anda saat ini"

    Tooltip Info:
      Icon:       Lucide "HelpCircle" w-4 h-4 text-slate-400 absolute right-3 top-11
                  cursor-help
      Tooltip:    "Usia adalah faktor risiko penting untuk penyakit jantung"
                  (position: top, bg-slate-900, text-white)

  Field: Jenis Kelamin
    Komponen:   Radio Group
    Label:      "Jenis Kelamin" (required)
    Options:
      Layout:   flex gap-4

      Option 1:
        Input:  radio value="male"
        Label:  "Laki-laki"
                flex items-center gap-2 px-4 py-3 border-2 border-slate-200
                rounded-lg cursor-pointer hover:border-emerald-300
        Checked: border-emerald-600 bg-emerald-50

      Option 2:
        Input:  radio value="female"
        Label:  "Perempuan"
        (style sama)

    Tooltip:    "Jenis kelamin mempengaruhi risiko penyakit jantung"
```

---

### Form Section 2: Data Vital

```
Section Header:
  Icon:       Lucide "Activity" w-6 h-6 text-purple-600
  Container:  bg-purple-100
  Heading:    "Data Vital"

Fields Layout:
  Grid:       grid grid-cols-1 md:grid-cols-2 gap-6 mb-8

  Field: Tekanan Darah Sistolik
    Label:      "Tekanan Darah Sistolik" (required)
    Type:       number
    Placeholder: "Contoh: 120"
    Icon:       Lucide "HeartPulse"
    Suffix:     "mmHg"
    Validasi:   Required, min 70, max 250
    Helper:     "Angka atas saat mengukur tekanan darah"
    Tooltip:    "Tekanan darah sistolik normal: 90-120 mmHg"

  Field: Tekanan Darah Diastolik
    Label:      "Tekanan Darah Diastolik" (required)
    Type:       number
    Placeholder: "Contoh: 80"
    Icon:       Lucide "HeartPulse"
    Suffix:     "mmHg"
    Validasi:   Required, min 40, max 150
    Helper:     "Angka bawah saat mengukur tekanan darah"
    Tooltip:    "Tekanan darah diastolik normal: 60-80 mmHg"

  Field: Kolesterol Total
    Label:      "Kolesterol Total" (required)
    Type:       number
    Placeholder: "Contoh: 200"
    Icon:       Lucide "Droplet"
    Suffix:     "mg/dL"
    Validasi:   Required, min 100, max 400
    Helper:     "Total kolesterol dalam darah"
    Tooltip:    "Kolesterol normal: < 200 mg/dL"

  Field: Gula Darah Puasa
    Label:      "Gula Darah Puasa"
    Type:       number
    Placeholder: "Contoh: 100"
    Icon:       Lucide "Droplet"
    Suffix:     "mg/dL"
    Validasi:   Optional, min 50, max 300
    Helper:     "(Opsional) Gula darah saat puasa"
    Tooltip:    "Gula darah puasa normal: 70-100 mg/dL"

  Field: Detak Jantung
    Label:      "Detak Jantung Istirahat" (required)
    Type:       number
    Placeholder: "Contoh: 72"
    Icon:       Lucide "Heart"
    Suffix:     "bpm"
    Validasi:   Required, min 40, max 150
    Helper:     "Detak jantung saat istirahat"
    Tooltip:    "Detak jantung normal: 60-100 bpm"

  Field: Berat Badan
    Label:      "Berat Badan" (required)
    Type:       number
    Placeholder: "Contoh: 70"
    Icon:       Lucide "Weight"
    Suffix:     "kg"
    Validasi:   Required, min 30, max 300

  Field: Tinggi Badan
    Label:      "Tinggi Badan" (required)
    Type:       number
    Placeholder: "Contoh: 170"
    Icon:       Lucide "Ruler"
    Suffix:     "cm"
    Validasi:   Required, min 100, max 250

  BMI Indicator (calculated, read-only):
    Label:      "Body Mass Index (BMI)"
    Display:    (auto-calculated dari Berat / (Tinggi/100)^2)
    Layout:     px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg
    Text:       "BMI Anda: [value]"
                text-sm font-medium
    Color:      (sesuai kategori BMI — hijau/kuning/merah)
    Category:   "Normal" / "Kelebihan Berat" / "Obesitas"
                text-xs text-slate-500
```

---

### Form Section 3: Riwayat Medis

```
Section Header:
  Icon:       Lucide "FileText" w-6 h-6 text-blue-600
  Container:  bg-blue-100
  Heading:    "Riwayat Medis"
  Description: "Centang kondisi yang pernah atau sedang Anda alami"
              text-sm text-slate-600 mt-2

Checkbox Group:
  Layout:     grid grid-cols-1 md:grid-cols-2 gap-4 mb-8

  Checkbox Item (struktur):
    Layout:   flex items-start gap-3 p-3 border border-slate-200 rounded-lg
              cursor-pointer hover:bg-slate-50 transition-colors
    Checked:  border-emerald-600 bg-emerald-50

    Checkbox: w-5 h-5 rounded border-slate-300 text-emerald-600
              focus:ring-emerald-600 mt-0.5

    Label:    text-sm font-medium text-slate-700

  Conditions:
    - "Diabetes"
    - "Hipertensi (Tekanan Darah Tinggi)"
    - "Kolesterol Tinggi"
    - "Riwayat Serangan Jantung"
    - "Riwayat Stroke"
    - "Penyakit Ginjal"
    - "Penyakit Liver"
    - "Tidak Ada Riwayat" (eksklusif — jika dicentang, yang lain uncheck)
```

---

### Form Section 4: Gejala & Gaya Hidup

```
Section Header:
  Icon:       Lucide "Stethoscope" w-6 h-6 text-amber-600
  Container:  bg-amber-100
  Heading:    "Gejala & Gaya Hidup"

Sub-section: Gejala yang Dirasakan
  Description: "Centang gejala yang Anda rasakan dalam 6 bulan terakhir"
                text-sm text-slate-600 mb-4

  Checkbox Group:
    Layout:   grid grid-cols-1 md:grid-cols-2 gap-4 mb-6
    (struktur sama dengan Riwayat Medis)

    Symptoms:
      - "Nyeri Dada"
      - "Sesak Napas"
      - "Detak Jantung Tidak Teratur"
      - "Mudah Lelah"
      - "Pusing"
      - "Pingsan"
      - "Pembengkakan Kaki/Tangan"
      - "Tidak Ada Gejala"

Sub-section: Kebiasaan
  Layout:     flex flex-col gap-6 mb-8

  Field: Status Merokok
    Label:    "Apakah Anda merokok?" (required)
    Type:     Radio Group
    Options:
      Layout: flex flex-col gap-3

      - "Tidak Pernah"
      - "Dulu Pernah, Sekarang Berhenti"
      - "Ya, Kadang-kadang (< 10 batang/hari)"
      - "Ya, Rutin (≥ 10 batang/hari)"

    Style:    Radio items dengan border, rounded-lg, hover effect
              (sama dengan Jenis Kelamin)

  Field: Aktivitas Fisik
    Label:    "Seberapa sering Anda berolahraga?" (required)
    Type:     Radio Group
    Options:
      - "Tidak Pernah"
      - "1-2 kali per minggu"
      - "3-4 kali per minggu"
      - "Hampir Setiap Hari (≥ 5 kali per minggu)"

  Field: Konsumsi Alkohol
    Label:    "Apakah Anda mengonsumsi alkohol?" (required)
    Type:     Radio Group
    Options:
      - "Tidak Pernah"
      - "Jarang (< 1 kali per bulan)"
      - "Kadang (1-3 kali per bulan)"
      - "Sering (≥ 1 kali per minggu)"
```

---

### Component: Submit Button

```
Container:
  Padding:    pt-8 border-t border-slate-200 mt-8

Button:
  Komponen:   Button (dari 01_GLOBAL_COMPONENTS.md)
  Variant:    primary
  Size:       lg
  Width:      w-full
  Text:       "Analisis Risiko Sekarang"
  Icon:       Lucide "ArrowRight" (right)

  Loading State:
    Disabled:   true
    Text:       "Menganalisis..."
    Icon:       Lucide "Loader2" animate-spin

  Disabled State (jika form belum valid):
    Background: bg-slate-200
    Text:       text-slate-400
    Cursor:     cursor-not-allowed
    Tooltip:    "Lengkapi semua data yang diperlukan"
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar User** → active: Cek Kesehatan
2. **Input Field** → untuk semua input number
3. **Button** → submit button
4. **Card** → form container
5. **Tooltip** → untuk penjelasan field

Komponen custom:
- Progress indicator bar
- Radio group dengan border styling
- Checkbox group dengan border styling
- Section headers dengan icon
- BMI calculator & indicator

---

## RESPONSIVE

### Mobile (<768px)

```
Grid columns:   grid-cols-1 (semua field stack vertical)
Padding:        px-4 py-6
Radio/Checkbox: stack vertical jika terlalu sempit
```

### Tablet & Desktop (≥768px)

```
Grid columns:   grid-cols-2 (untuk fields yang sesuai)
Padding:        px-8 py-8
Max-width:      max-w-4xl mx-auto
```

---

## ANIMASI

```
Progress Bar:
  Width:        transition-all duration-300 ease-out
  Color:        (bisa change color berdasarkan percentage)

Field Focus:
  Border:       border-emerald-600
  Ring:         ring-4 ring-emerald-600/10
  Duration:     150ms

Radio/Checkbox Checked:
  Border:       border-emerald-600
  Background:   bg-emerald-50
  Duration:     200ms ease-out

Tooltip:
  Enter:        fade-in + scale(0.95 → 1) — 150ms
  Exit:         fade-out — 100ms

Submit Button:
  Hover:        bg-emerald-700 + shadow-md — 150ms
  Disabled:     opacity-50 (no hover effect)
```

---

## FORM VALIDATION

### Client-side Validation

```
Real-time:
  - Setiap field: validasi on blur
  - Progress bar: update on change
  - BMI: calculate on change (Berat atau Tinggi)
  - Submit button: disabled jika required fields kosong

On Submit:
  - Check semua required fields
  - Validate range untuk number inputs
  - Scroll to first error field
  - Highlight error fields dengan red border
```

### API Request

```typescript
POST /api/predictions

Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Body:
{
  "age": 35,
  "gender": "male",
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "cholesterol": 200,
  "blood_sugar": 100,
  "heart_rate": 72,
  "weight": 70,
  "height": 170,
  "bmi": 24.2,
  "medical_history": ["diabetes", "hypertension"],
  "symptoms": ["chest_pain"],
  "smoking": "never",
  "exercise": "3-4-times-week",
  "alcohol": "never"
}
```

### Success Response

```typescript
{
  "success": true,
  "message": "Prediksi berhasil dibuat",
  "data": {
    "prediction_id": 123,
    "risk_level": "rendah",
    "risk_score": 25,
    "created_at": "2026-04-18T10:00:00Z"
  }
}

Action:
1. Tampilkan toast success: "Analisis selesai!"
2. Redirect ke /user/prediction-result/123 setelah 1s
```

---

**Form ini adalah critical path untuk mendapatkan prediksi. Harus user-friendly dengan helper text dan tooltip yang jelas untuk setiap field medis. Validasi harus strict tapi error message harus helpful.**
