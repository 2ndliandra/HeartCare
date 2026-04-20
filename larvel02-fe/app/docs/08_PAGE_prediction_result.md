# Prediction Result Page Documentation# 08 — Prediction Result

**Route:** `/user/prediction-result/:id`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Skor risiko ditampilkan dengan badge kecil yang tidak menonjol
- Tidak ada visualisasi gauge/chart yang menarik perhatian
- Interpretasi dan rekomendasi kurang jelas strukturnya

**Solusi baru:**
- **Gauge chart atau donut chart besar** di tengah untuk menampilkan skor risiko
- Warna gauge mengikuti severity (hijau/kuning/merah)
- **Risk badge BESAR** dan menonjol di bawah gauge
- Interpretasi dalam card terpisah dengan ikon dan teks panjang
- Rekomendasi sebagai list card dengan ikon per item
- CTA jelas: "Konsultasi dengan AI" dan "Simpan Hasil" (atau "Lihat di Riwayat")
- Print/Download option untuk hasil prediksi

---

## LAYOUT HALAMAN

```
Container:      UserLayout (Sidebar + Main Content)
Main Content:   max-w-5xl mx-auto px-8 py-8
Background:     bg-slate-50
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER                                          │
│ USER     │ "Hasil Prediksi" + Date + Download Button       │
│          ├─────────────────────────────────────────────────┤
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ RISK SCORE CARD (centered)                  │ │
│          │ │                                             │ │
│          │ │ [Gauge Chart 60% width]                     │ │
│          │ │ Score: 25%                                  │ │
│          │ │ [BADGE: RISIKO RENDAH (large)]              │ │
│          │ │                                             │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ INTERPRETATION CARD                         │ │
│          │ │ Icon + Heading                              │ │
│          │ │ Paragraf interpretasi panjang               │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ DATA SUMMARY CARD (grid 2 kolom)            │ │
│          │ │ [Field] [Value]  [Field] [Value]            │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ RECOMMENDATIONS SECTION                     │ │
│          │ │ [Recommendation Card 1]                     │ │
│          │ │ [Recommendation Card 2]                     │ │
│          │ │ [Recommendation Card 3]                     │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ CTA BUTTONS                                 │ │
│          │ │ [Konsultasi AI] [Simpan / Lihat Riwayat]    │ │
│          │ └─────────────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Page Header

```
Container:
  Layout:       flex items-center justify-between mb-8

Left Content:
  Breadcrumb:   "Dashboard" → "Hasil Prediksi"
                text-sm text-slate-500 mb-2

  Heading:      "Hasil Prediksi Risiko Jantung"
                text-3xl font-bold text-slate-900 mb-1 (Plus Jakarta Sans)

  Date:         "Dibuat pada: Senin, 18 April 2026 pukul 10:30"
                text-sm text-slate-600

Right Content:
  Button Group:
    Layout:     flex gap-3

    Download Button:
      Variant:  outline
      Size:     sm
      Icon:     Lucide "Download" (left)
      Text:     "Download PDF"
      Action:   Generate & download PDF hasil

    Print Button:
      Variant:  ghost
      Size:     sm
      Icon:     Lucide "Printer"
      Action:   window.print()
```

---

### Card: Risk Score Display

```
Komponen:       Base Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-10
Shadow:         shadow-md
Margin:         mb-6
Text-align:     text-center

Gauge Chart:
  Type:         Semi-donut chart atau circular progress
  Library:      Recharts (atau custom SVG)
  Size:         w-64 h-64 mx-auto (atau w-full max-w-xs)
  Value:        [risk_score]% (contoh: 25%)
  Color:        (dynamic based on risk_level)
                - Rendah (<30%): emerald-600
                - Sedang (30-60%): amber-500
                - Tinggi (>60%): red-500
  Track color:  slate-200
  Stroke width: thick (20-24)

  Center Content:
    Score:      "[value]%"
                text-5xl font-bold (Plus Jakarta Sans)
                (warna sesuai severity)
    Label:      "Skor Risiko"
                text-sm text-slate-600 mt-2

Risk Badge (below chart):
  Komponen:     Badge (dari 01_GLOBAL_COMPONENTS.md)
  Size:         LARGE (custom sizing)
  Padding:      px-8 py-3
  Radius:       rounded-full
  Font:         text-lg font-bold
  Margin:       mt-8 mx-auto

  Variant Rendah:
    Background: bg-emerald-100
    Text:       text-emerald-900
    Dot:        w-3 h-3 bg-emerald-500
    Content:    "Risiko Rendah"

  Variant Sedang:
    Background: bg-amber-100
    Text:       text-amber-900
    Dot:        w-3 h-3 bg-amber-500
    Content:    "Risiko Sedang"

  Variant Tinggi:
    Background: bg-red-100
    Text:       text-red-900
    Dot:        w-3 h-3 bg-red-500
    Content:    "Risiko Tinggi"
```

---

### Card: Interpretation

```
Komponen:       Base Card
Background:     bg-gradient-to-br from-slate-50 to-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Margin:         mb-6

Layout:         flex items-start gap-4

Icon Container:
  Size:         w-12 h-12 flex-shrink-0
  Background:   (sesuai severity)
                - Rendah: bg-emerald-100
                - Sedang: bg-amber-100
                - Tinggi: bg-red-100
  Radius:       rounded-xl
  Icon:         Lucide "Info" w-6 h-6
                (warna sesuai severity)

Content:
  Heading:      "Interpretasi Hasil"
                text-lg font-semibold text-slate-900 mb-3 (Plus Jakarta Sans)

  Text (dynamic based on risk_level):
    RENDAH:
      "Selamat! Hasil prediksi menunjukkan bahwa risiko Anda terkena penyakit jantung berada di level rendah. Ini adalah kabar baik yang menunjukkan bahwa kondisi kesehatan jantung Anda saat ini dalam keadaan baik. Namun, tetap penting untuk menjaga pola hidup sehat dan melakukan pemeriksaan rutin untuk mempertahankan kondisi ini."

    SEDANG:
      "Hasil prediksi menunjukkan bahwa Anda memiliki risiko sedang untuk terkena penyakit jantung. Ini berarti ada beberapa faktor yang perlu Anda perhatikan dan perbaiki. Kami sangat menyarankan Anda untuk berkonsultasi dengan dokter dan mulai menerapkan gaya hidup yang lebih sehat sesuai rekomendasi di bawah."

    TINGGI:
      "Hasil prediksi menunjukkan bahwa risiko Anda terkena penyakit jantung berada di level tinggi. Kami sangat menyarankan Anda untuk segera berkonsultasi dengan dokter spesialis jantung untuk pemeriksaan lebih lanjut. Selain itu, penting untuk mulai menerapkan perubahan gaya hidup sesuai rekomendasi di bawah dan memantau kondisi kesehatan Anda secara rutin."

    Style:        text-sm text-slate-700 leading-relaxed
```

---

### Card: Data Summary

```
Komponen:       Base Card
Background:     bg-white
Border:         border border-slate-200
Radius:         rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Margin:         mb-6

Header:
  Heading:      "Ringkasan Data Kesehatan"
                text-lg font-semibold text-slate-900 mb-4 (Plus Jakarta Sans)

Grid Layout:
  Layout:       grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

Data Item (struktur):
  Layout:       flex flex-col p-3 bg-slate-50 rounded-lg

  Label:        text-xs text-slate-500 mb-1
  Value:        text-base font-semibold text-slate-900

Data Items:
  - Label: "Usia" | Value: "35 tahun"
  - Label: "Jenis Kelamin" | Value: "Laki-laki"
  - Label: "Tekanan Darah" | Value: "120/80 mmHg"
  - Label: "Kolesterol" | Value: "200 mg/dL"
  - Label: "Detak Jantung" | Value: "72 bpm"
  - Label: "BMI" | Value: "24.2 (Normal)"
  - Label: "Status Merokok" | Value: "Tidak Pernah"
  - Label: "Aktivitas Fisik" | Value: "3-4x/minggu"
  - Label: "Riwayat Medis" | Value: "Diabetes" (atau "Tidak Ada")
```

---

### Section: Recommendations

```
Container:
  Padding:      py-6

Header:
  Heading:      "Rekomendasi untuk Anda"
                text-2xl font-bold text-slate-900 mb-2 (Plus Jakarta Sans)
  Description:  "Ikuti rekomendasi berikut untuk menjaga kesehatan jantung Anda"
                text-sm text-slate-600 mb-6

List Layout:
  Layout:       flex flex-col gap-4

Recommendation Card (struktur):
  Komponen:     Base Card
  Background:   bg-white
  Border:       border-l-4 (warna sesuai kategori)
  Radius:       rounded-xl
  Padding:      p-5
  Shadow:       shadow-sm
  Hover:        shadow-md -translate-y-0.5
  Transition:   transition-all duration-200

  Layout:       flex items-start gap-4

  Icon Container:
    Size:       w-10 h-10 flex-shrink-0
    Background: (sesuai kategori)
    Radius:     rounded-lg
    Icon:       Lucide icon w-5 h-5

  Content:
    Category:   text-xs font-semibold uppercase tracking-wide
                (warna sesuai kategori) mb-1
    Title:      text-base font-semibold text-slate-900 mb-2
    Description: text-sm text-slate-600 leading-relaxed

Recommendations (dynamic based on risk_level & data):

  1. Kategori: NUTRISI
     Border:      border-emerald-500
     Icon BG:     bg-emerald-100
     Icon:        Lucide "Apple" text-emerald-600
     Category:    "NUTRISI" text-emerald-600
     Title:       "Jaga Pola Makan Sehat"
     Description: "Konsumsi makanan rendah lemak jenuh, tinggi serat seperti buah, sayur, dan biji-bijian. Kurangi garam, gula, dan makanan olahan. Pilih protein dari ikan, kacang-kacangan, dan daging tanpa lemak."

  2. Kategori: OLAHRAGA
     Border:      border-blue-500
     Icon BG:     bg-blue-100
     Icon:        Lucide "Dumbbell" text-blue-600 (atau "Activity")
     Category:    "OLAHRAGA" text-blue-600
     Title:       "Tingkatkan Aktivitas Fisik"
     Description: "Lakukan olahraga aerobik minimal 150 menit per minggu atau 30 menit sehari selama 5 hari. Pilihan: jalan cepat, jogging, bersepeda, atau berenang. Konsultasikan dengan dokter sebelum memulai program olahraga baru."

  3. Kategori: PEMERIKSAAN
     Border:      border-purple-500
     Icon BG:     bg-purple-100
     Icon:        Lucide "Stethoscope" text-purple-600
     Category:    "PEMERIKSAAN" text-purple-600
     Title:       "Cek Kesehatan Rutin"
     Description: "Lakukan pemeriksaan tekanan darah, kolesterol, dan gula darah secara rutin setiap 6 bulan. Konsultasi dengan dokter untuk monitoring kondisi kesehatan jantung Anda."

  4. Kategori: GAYA HIDUP (conditional — jika merokok)
     Border:      border-red-500
     Icon BG:     bg-red-100
     Icon:        Lucide "SmokingNo" text-red-600 (atau "Ban")
     Category:    "GAYA HIDUP" text-red-600
     Title:       "Hentikan Kebiasaan Merokok"
     Description: "Merokok adalah faktor risiko utama penyakit jantung. Segera hentikan kebiasaan merokok dan hindari paparan asap rokok. Konsultasi dengan dokter untuk program berhenti merokok yang efektif."

  5. Kategori: STRESS
     Border:      border-amber-500
     Icon BG:     bg-amber-100
     Icon:        Lucide "Brain" text-amber-600
     Category:    "KESEHATAN MENTAL" text-amber-600
     Title:       "Kelola Stres dengan Baik"
     Description: "Stres berkepanjangan dapat meningkatkan risiko penyakit jantung. Lakukan teknik relaksasi seperti meditasi, yoga, atau hobi yang Anda sukai. Pastikan tidur cukup 7-8 jam per malam."
```

---

### Section: CTA Buttons

```
Container:
  Padding:      pt-8 border-t border-slate-200 mt-8
  Layout:       grid grid-cols-1 md:grid-cols-2 gap-4

Button 1: Konsultasi dengan AI
  Komponen:     Button (dari 01_GLOBAL_COMPONENTS.md)
  Variant:      primary
  Size:         lg
  Width:        w-full
  Icon:         Lucide "MessageSquare" (left)
  Text:         "Konsultasi dengan AI"
  Route:        /user/consultation

Button 2: Lihat Riwayat Prediksi
  Komponen:     Button
  Variant:      outline
  Size:         lg
  Width:        w-full
  Icon:         Lucide "History" (left)
  Text:         "Lihat Riwayat Prediksi"
  Route:        /user/history
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar User**
2. **Button** → primary, outline, ghost
3. **Card** → base card
4. **Badge** → risk status (custom large size)

Komponen custom:
- Gauge chart (Recharts atau custom SVG)
- Data summary grid
- Recommendation cards dengan category color coding

---

## RESPONSIVE

### Mobile (<768px)

```
Gauge chart:    Sedikit lebih kecil (w-48 h-48)
Risk badge:     text-base (dari text-lg)
Data summary:   grid-cols-1
Recommendations: stack vertical
CTA buttons:    grid-cols-1 (stack)
```

### Tablet & Desktop

```
Gauge chart:    w-64 h-64
Data summary:   grid-cols-2 atau grid-cols-3
Recommendations: full width per card
CTA buttons:    grid-cols-2
```

---

## ANIMASI

```
Page Load:
  Gauge chart:    Animate fill dari 0 → [value]% — 1000ms ease-out
  Risk badge:     fade-in + scale(0.95 → 1) — 400ms (delay 800ms)
  Cards:          fade-in + slide-up — 400ms staggered 80ms

Gauge Animation:
  Arc stroke:     strokeDashoffset transition
  Center value:   Count-up dari 0 ke [value]

Recommendation Card Hover:
  Shadow:         shadow-md
  Transform:      -translate-y-0.5
  Duration:       200ms ease-out

Print Mode:
  @media print:   Hide sidebar, buttons, navbar
                  Show only content
                  Adjust colors for print
```

---

## API INTEGRATION

### Request

```typescript
GET /api/predictions/:id

Headers:
  Authorization: Bearer [token]
```

### Response

```typescript
{
  "success": true,
  "data": {
    "id": 123,
    "risk_level": "rendah", // "rendah" | "sedang" | "tinggi"
    "risk_score": 25,       // 0-100
    "created_at": "2026-04-18T10:30:00Z",
    "user_data": {
      "age": 35,
      "gender": "male",
      "systolic_bp": 120,
      "diastolic_bp": 80,
      "cholesterol": 200,
      "heart_rate": 72,
      "bmi": 24.2,
      "smoking": "never",
      "exercise": "3-4-times-week",
      "medical_history": ["diabetes"]
    },
    "recommendations": [
      {
        "category": "nutrition",
        "title": "Jaga Pola Makan Sehat",
        "description": "..."
      },
      // ... other recommendations
    ]
  }
}
```

---

**Halaman ini adalah hasil akhir dari health check. Harus clear, informative, dan actionable. Gauge chart harus eye-catching, interpretasi harus mudah dipahami awam, dan rekomendasi harus konkret & actionable.**
