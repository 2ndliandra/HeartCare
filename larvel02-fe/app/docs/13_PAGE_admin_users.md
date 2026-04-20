# Admin Users Page Documentation# 13 — Admin: Manajemen User

**Route:** `/admin/users`  
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
│ SIDEBAR  │ HEADER: "Manajemen Pengguna" + Add User Button  │
│ ADMIN    ├─────────────────────────────────────────────────┤
│          │ FILTERS: [Search] [Status] [Role] [Date]        │
│ [active: ├─────────────────────────────────────────────────┤
│  Users]  │ ┌─────────────────────────────────────────────┐ │
│          │ │ DATA TABLE                                  │ │
│          │ │ ID | Nama | Email | Role | Status | Aksi    │ │
│          │ │ ───────────────────────────────────────────  │ │
│          │ │ 1  | John | john@ | User | Aktif  | [Edit]  │ │
│          │ │ 2  | Jane | jane@ | Admin| Aktif  | [Edit]  │ │
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
  Heading:      "Manajemen Pengguna"
                text-3xl font-bold text-slate-900
  Count:        "1,247 Total Pengguna"
                text-sm text-slate-600

Right:
  Button:       "Tambah Pengguna"
                variant=primary, size=md
                Icon: Lucide "UserPlus" (left)
                Action: Open modal add user
```

---

### Component: Filters

```
Container:
  Background:   bg-white border border-slate-200 rounded-xl
  Padding:      p-4 mb-6
  Layout:       grid grid-cols-1 md:grid-cols-4 gap-4

Search:
  Icon:         Lucide "Search"
  Placeholder:  "Cari nama atau email..."

Status Filter:
  Type:         Select
  Options:      Semua | Aktif | Nonaktif | Suspended

Role Filter:
  Type:         Select
  Options:      Semua | User | Admin

Date Filter:
  Type:         Date range picker
  Placeholder:  "Tanggal Bergabung"
```

---

### Component: Users Table

```
Komponen:       Data Table (dari 01_GLOBAL_COMPONENTS.md)

Columns:
  1. ID (sortable)
  2. Nama (sortable)
  3. Email
  4. Role (Badge: User/Admin)
  5. Status (Badge: Aktif/Nonaktif/Suspended)
  6. Bergabung (sortable)
  7. Aksi

Row Actions:
  Layout:       flex gap-2

  View Button:
    Icon:       Lucide "Eye"
    Tooltip:    "Lihat Detail"
    Action:     Open detail modal

  Edit Button:
    Icon:       Lucide "Edit"
    Tooltip:    "Edit"
    Action:     Open edit modal

  Delete Button:
    Icon:       Lucide "Trash2"
    Tooltip:    "Hapus"
    Color:      text-red-600
    Action:     Open delete confirmation modal

  Toggle Status:
    Icon:       Lucide "Ban" or "Check"
    Tooltip:    "Suspend/Aktifkan"
    Action:     Toggle user status with confirmation
```

---

### Modal: Add/Edit User

```
Header:         "Tambah Pengguna" / "Edit Pengguna"

Form Fields:
  - Nama Lengkap (required)
  - Email (required, unique)
  - Password (required for add, optional for edit)
  - Role (Select: User / Admin)
  - Status (Select: Aktif / Nonaktif)
  - Nomor Telepon

Footer:
  Cancel Button: variant=outline
  Save Button:   variant=primary, "Simpan"
```

---

### Modal: Delete Confirmation

```
Icon:           Lucide "AlertTriangle" w-12 h-12 text-red-600
Heading:        "Hapus Pengguna?"
Body:           "User [Name] dan semua data terkait akan dihapus permanen."
Footer:
  Cancel:       variant=outline
  Delete:       variant=danger, "Ya, Hapus"
```

---

## KOMPONEN YANG DIPAKAI

1. **Sidebar Admin** → active: Manajemen User
2. **Data Table** → users list
3. **Button** → primary, outline, danger, ghost
4. **Badge** → role, status
5. **Modal** → add, edit, delete
6. **Input Field** → search, form fields
7. **Pagination**

---

**Admin Users page untuk CRUD operations. Table harus sortable, filterable, dan paginatable. Actions harus clear dengan confirmation untuk destructive operations.**
