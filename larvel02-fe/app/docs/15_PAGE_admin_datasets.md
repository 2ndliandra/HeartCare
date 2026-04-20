# Admin Datasets Page Documentation# 15 — Admin: Manajemen Dataset

**Route:** `/admin/datasets`  
**Role:** Admin  
**Layout:** AdminLayout (Sidebar Admin + Content)

---

## LAYOUT HALAMAN

```
Container:      AdminLayout
Main Content:   max-w-7xl mx-auto px-8 py-8
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER: "Manajemen Dataset" + Upload Button     │
│ ADMIN    ├─────────────────────────────────────────────────┤
│          │ STATS: [Total] [Active] [Pending] [Training]    │
│ [active: ├─────────────────────────────────────────────────┤
│  Dataset]│ FILTERS: [Search] [Status] [Type] [Date]        │
│          ├─────────────────────────────────────────────────┤
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ DATA TABLE                                  │ │
│          │ │ Nama | Rows | Type | Status | Upload | Aksi │ │
│          │ │ ───────────────────────────────────────────  │ │
│          │ │ Heart-2024 | 10K | CSV | Active | Apr 18    │ │
│          │ │ Training-V2 | 5K | JSON | Pending | Apr 15  │ │
│          │ │ ...                                         │ │
│          │ └─────────────────────────────────────────────┘ │
│          │ [Pagination]                                     │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Header

```
Layout:         flex items-center justify-between mb-6

Left:
  Heading:      "Manajemen Dataset"
                text-3xl font-bold text-slate-900
  Description:  "Dataset untuk training model prediksi AI"
                text-sm text-slate-600

Right:
  Button Group:
    Upload Button:
      variant:  primary, size=md
      Icon:     Lucide "Upload" (left)
      Text:     "Upload Dataset"
      Action:   Open upload modal

    Train Button:
      variant:  outline, size=md
      Icon:     Lucide "Cpu" (left)
      Text:     "Train Model"
      Action:   Open training modal
```

---

### Section: Stats Cards

```
Layout:         grid grid-cols-1 md:grid-cols-4 gap-4 mb-6

Card 1: Total Dataset
  Icon:         Lucide "Database" bg-blue-100 text-blue-600
  Value:        "12"
  Label:        "Total Dataset"

Card 2: Active
  Icon:         Lucide "CheckCircle" bg-emerald-100 text-emerald-600
  Value:        "8"
  Label:        "Aktif Digunakan"

Card 3: Pending Review
  Icon:         Lucide "Clock" bg-amber-100 text-amber-600
  Value:        "2"
  Label:        "Menunggu Review"

Card 4: In Training
  Icon:         Lucide "Cpu" bg-purple-100 text-purple-600
  Value:        "1"
  Label:        "Sedang Training"
```

---

### Component: Filters

```
Grid:           grid-cols-1 md:grid-cols-4 gap-4 mb-6

Search:         "Cari nama dataset..."
Status:         Semua | Active | Pending | Training | Archived
Type:           Semua | CSV | JSON | Excel
Date:           Upload date range
```

---

### Component: Datasets Table

```
Columns:
  1. Nama Dataset (sortable)
  2. Jumlah Rows (sortable)
  3. File Size (sortable)
  4. Type (Badge: CSV/JSON/Excel)
  5. Status (Badge: Active/Pending/Training/Archived)
  6. Upload Date (sortable)
  7. Uploaded By
  8. Aksi

Row Structure:
  Name:         "Heart-Disease-2024.csv"
                text-sm font-medium text-slate-900
  Rows:         "10,247"
  Size:         "2.4 MB"
  Type:         Badge "CSV" (bg-blue-100 text-blue-700)
  Status:       Badge (dynamic color)
  Date:         "18 Apr 2026, 10:30"
  User:         "Admin Name"
  Actions:      [View][Download][Delete][Activate]

Row Actions:
  View:         Icon "Eye" → preview data sample
  Download:     Icon "Download" → download file
  Delete:       Icon "Trash2" text-red-600
  Activate:     Icon "Check" → set as active dataset
  Archive:      Icon "Archive" → archive dataset
```

---

### Modal: Upload Dataset

```
Header:         "Upload Dataset Baru"

Form:
  File Upload:
    Type:       File input (drag & drop zone)
    Accept:     .csv, .json, .xlsx
    Max Size:   10MB
    Preview:    Show filename, size, type

  Dataset Name:
    Type:       Input text
    Placeholder: "Contoh: Heart-Disease-2024"
    Helper:     "Nama untuk identifikasi dataset"

  Description:
    Type:       Textarea
    Placeholder: "Deskripsi dataset (opsional)"

  Type:
    Type:       Auto-detected dari file extension
    Display:    Read-only badge

  Auto-Activate:
    Type:       Checkbox
    Label:      "Aktifkan sebagai dataset training setelah upload"

Footer:
  Cancel:       variant=outline
  Upload:       variant=primary, "Upload Dataset"
                (dengan progress bar saat upload)

Upload Progress:
  Bar:          h-2 bg-emerald-600 rounded-full
  Text:         "Uploading... 45%"
  Cancel:       Button untuk cancel upload
```

---

### Modal: Preview Dataset

```
Header:         "Preview: [Dataset Name]"

Tabs:
  1. Sample Data (Table preview 10 rows)
  2. Statistics (Summary stats: rows, columns, missing values, etc)
  3. Columns Info (List columns dengan type dan sample values)

Sample Data Table:
  Scrollable:   horizontal & vertical
  Max rows:     10 (first rows)
  Style:        Fixed header, zebra striping

Stats:
  Grid:         2 columns
  Items:
    - Total Rows: 10,247
    - Total Columns: 15
    - Missing Values: 2.3%
    - Duplicate Rows: 5
    - File Size: 2.4 MB
    - Upload Date: 18 Apr 2026

Footer:
  Close:        variant=outline
  Download:     variant=primary, "Download Full Dataset"
```

---

### Modal: Train Model

```
Header:         "Train AI Model"

Form:
  Select Dataset:
    Type:       Select dropdown
    Options:    List active datasets
    Required:   true

  Model Version:
    Type:       Input text
    Placeholder: "v1.2"
    Helper:     "Version identifier untuk model"

  Training Parameters:
    Epochs:     Number input (default: 100)
    Batch Size: Number input (default: 32)
    Learning Rate: Number input (default: 0.001)

  Advanced Options (Collapsible):
    - Validation Split: 20%
    - Early Stopping: Checkbox
    - Save Best Model: Checkbox

  Notes:
    Type:       Textarea
    Placeholder: "Catatan training (opsional)"

Footer:
  Cancel:       outline
  Start Training: primary, "Mulai Training"
                  (disabled jika dataset sedang digunakan)

Training Progress (after start):
  Replace modal content dengan:
    Progress Bar: animated
    Status:       "Training... Epoch 15/100"
    Metrics:      Accuracy, Loss (realtime update via WebSocket/SSE)
    Logs:         Scrollable console logs
    Cancel:       Button "Hentikan Training"
```

---

### Modal: Delete Confirmation

```
Icon:           Lucide "AlertTriangle" w-12 h-12 text-red-600
Heading:        "Hapus Dataset?"
Body:           "Dataset '[Name]' akan dihapus permanen. Model yang menggunakan dataset ini mungkin terpengaruh."
Warning:        (jika dataset is_active)
                "⚠️ Dataset ini sedang aktif digunakan!"
Footer:
  Cancel:       outline
  Delete:       danger, "Ya, Hapus Dataset"
```

---

## KOMPONEN YANG DIPAKAI

1. **Sidebar Admin** → active: Manajemen Dataset
2. **Data Table** → datasets list
3. **Card** → Stat cards
4. **Button**
5. **Badge** → type, status
6. **Modal** → upload, preview, train, delete
7. **File Upload** → drag & drop zone
8. **Progress Bar** → upload & training progress

Komponen custom:
- Dataset preview table
- Training progress display
- Statistics dashboard

---

## RESPONSIVE

```
Mobile:       Stats grid-cols-1, Table scroll horizontal, Modals full-screen
Tablet:       Stats grid-cols-2, Table scroll, Modals max-w-2xl
Desktop:      Stats grid-cols-4, Full table, Modals max-w-4xl
```

---

## API INTEGRATION

### Upload Dataset

```typescript
POST /api/admin/datasets/upload

Headers:
  Authorization: Bearer [token]
  Content-Type: multipart/form-data

Body (FormData):
  file: [File]
  name: "Heart-Disease-2024"
  description: "..."
  auto_activate: true

Response:
{
  "success": true,
  "message": "Dataset berhasil diupload",
  "data": {
    "id": 13,
    "name": "Heart-Disease-2024",
    "rows": 10247,
    "file_size": 2457600,
    "type": "csv",
    "status": "active",
    "uploaded_at": "2026-04-18T10:30:00Z"
  }
}
```

### Start Training

```typescript
POST /api/admin/models/train

Body:
{
  "dataset_id": 13,
  "version": "v1.2",
  "epochs": 100,
  "batch_size": 32,
  "learning_rate": 0.001
}

Response:
{
  "success": true,
  "message": "Training dimulai",
  "data": {
    "training_id": "uuid-xxx",
    "status": "running"
  }
}

WebSocket/SSE untuk realtime progress:
ws://api/models/train/uuid-xxx/progress

Events:
{
  "epoch": 15,
  "total_epochs": 100,
  "accuracy": 0.85,
  "loss": 0.32,
  "status": "running"
}
```

---

**Dataset management adalah critical untuk AI system. Upload harus smooth dengan progress indicator. Preview data penting untuk validasi. Training interface harus real-time dengan progress tracking.**

---

**Semua nilai konkret, semua warna konsisten (Emerald, BUKAN Indigo), semua komponen reusable, semua halaman responsive, semua animasi didefinisikan.**
