# Profile Page Documentation# 11 — User Profile

**Route:** `/user/profile`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Content)

---

## PERUBAHAN DARI DESAIN LAMA

**Solusi baru:**
- Tab-based layout: Profile Info, Settings, Security
- Avatar upload dengan preview
- Form edit profile dengan validasi
- Password change form
- Delete account option (dengan confirmation modal)

---

## LAYOUT HALAMAN

```
Container:      UserLayout
Main Content:   max-w-4xl mx-auto px-8 py-8
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ HEADER                                          │
│ USER     │ "Profil Saya"                                   │
│          ├─────────────────────────────────────────────────┤
│ [active: │ ┌─────────────────────────────────────────────┐ │
│  Profil] │ │ PROFILE HEADER CARD                         │ │
│          │ │ [Avatar] [Name] [Email] [Edit Button]       │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ ┌─────────────────────────────────────────────┐ │
│          │ │ TABS: Informasi | Pengaturan | Keamanan     │ │
│          │ ├─────────────────────────────────────────────┤ │
│          │ │ TAB CONTENT                                 │ │
│          │ │                                             │ │
│          │ │ [Form Fields...]                            │ │
│          │ │                                             │ │
│          │ │ [Save Button]                               │ │
│          │ └─────────────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Card: Profile Header

```
Background:     bg-gradient-to-br from-emerald-500 to-emerald-600
Radius:         rounded-2xl
Padding:        p-8
Margin:         mb-6
Text:           text-white

Layout:         flex items-center gap-6

Avatar:
  Size:         w-24 h-24 rounded-full
  Border:       border-4 border-white/20
  Background:   (image atau inisial dengan bg-white text-emerald-600)
  Upload:       Hover overlay "Change Photo" (Icon "Camera")

Content:
  Name:         text-2xl font-bold text-white (Plus Jakarta Sans)
  Email:        text-emerald-100 text-sm mt-1
  Member Since: "Bergabung sejak April 2026"
                text-emerald-100 text-xs mt-2

Edit Button:
  Variant:      outline (custom: border-white text-white hover:bg-white/10)
  Size:         sm
  Icon:         Lucide "Edit" (left)
  Text:         "Edit Profil"
```

---

### Component: Tabs

```
Container:
  Background:   bg-white
  Border:       border border-slate-200
  Radius:       rounded-2xl
  Shadow:       shadow-sm

Tab List:
  Layout:       flex border-b border-slate-200
  Padding:      px-6

  Tab Item:
    Padding:    px-4 py-3
    Font:       text-sm font-medium
    Default:    text-slate-600 border-b-2 border-transparent
    Active:     text-emerald-600 border-b-2 border-emerald-600
    Hover:      text-slate-900

Tab Content:
  Padding:      p-6
```

---

### Tab 1: Informasi Pribadi

```
Form Fields:

  Nama Lengkap:
    Komponen:   Input Field
    Icon:       Lucide "User"
    Required:   true

  Email:
    Komponen:   Input Field
    Icon:       Lucide "Mail"
    Type:       email
    Required:   true
    Disabled:   true (tidak bisa diubah)
    Helper:     "Email tidak dapat diubah"

  Nomor Telepon:
    Komponen:   Input Field
    Icon:       Lucide "Phone"
    Type:       tel
    Placeholder: "+62 812 3456 7890"

  Tanggal Lahir:
    Komponen:   Input Field (date)
    Icon:       Lucide "Calendar"
    Type:       date

  Jenis Kelamin:
    Komponen:   Radio Group
    Options:    Laki-laki | Perempuan

  Alamat:
    Komponen:   Textarea
    Placeholder: "Alamat lengkap"
    Rows:       3

  Save Button:
    Variant:    primary
    Size:       md
    Icon:       Lucide "Save" (left)
    Text:       "Simpan Perubahan"
    Margin:     mt-6
```

---

### Tab 2: Pengaturan

```
Sections:

  Notifikasi:
    Heading:    "Pengaturan Notifikasi"
                text-base font-semibold text-slate-900 mb-4

    Toggle Items:
      1. Email untuk prediksi baru
      2. Email untuk hasil konsultasi
      3. Notifikasi tips kesehatan harian
      4. Newsletter bulanan

    Toggle (struktur):
      Layout:   flex items-center justify-between p-3 border border-slate-200 rounded-lg mb-3
      Label:    text-sm text-slate-700
      Switch:   Toggle switch (emerald saat ON)

  Bahasa:
    Heading:    "Bahasa"
                text-base font-semibold text-slate-900 mb-4 mt-6

    Select:
      Options:  Bahasa Indonesia | English
      Default:  Bahasa Indonesia

  Zona Waktu:
    Select:
      Options:  WIB | WITA | WIT
      Default:  WIB

  Save Button:
    (sama dengan Tab 1)
```

---

### Tab 3: Keamanan

```
Sections:

  Ubah Password:
    Heading:    "Ubah Password"
                text-base font-semibold text-slate-900 mb-4

    Fields:
      Password Lama:
        Type:   password
        Icon:   Lucide "Lock"
        Required: true

      Password Baru:
        Type:   password
        Icon:   Lucide "Lock"
        Required: true
        Helper: "Minimal 8 karakter"

      Konfirmasi Password:
        Type:   password
        Icon:   Lucide "Lock"
        Required: true

    Button:
      Variant:  primary
      Text:     "Update Password"

  Sesi Aktif:
    Heading:    "Sesi Login Aktif"
                text-base font-semibold text-slate-900 mb-4 mt-8

    List:
      Item (struktur):
        Layout: flex items-start gap-3 p-3 bg-slate-50 rounded-lg mb-2
        Icon:   Lucide "Monitor" atau "Smartphone" (sesuai device)
        Info:   Device name, Browser, Location, Last active
        Action: Button "Logout" variant=ghost size=sm (jika bukan current session)

  Hapus Akun:
    Heading:    "Zona Berbahaya"
                text-base font-semibold text-red-900 mb-4 mt-8

    Warning:
      Background: bg-red-50
      Border:   border-l-4 border-red-500
      Padding:  p-4
      Icon:     Lucide "AlertTriangle" text-red-600
      Text:     "Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan."
                text-sm text-red-700

    Button:
      Variant:  danger
      Size:     md
      Icon:     Lucide "Trash2" (left)
      Text:     "Hapus Akun"
      Action:   Open confirmation modal
      Margin:   mt-4
```

---

### Modal: Delete Account Confirmation

```
Komponen:       Modal (dari 01_GLOBAL_COMPONENTS.md)
Size:           medium

Header:
  Icon:         Lucide "AlertTriangle" w-12 h-12 text-red-600 mx-auto mb-4
  Title:        "Hapus Akun?"
                text-xl font-bold text-slate-900 text-center

Body:
  Text:         "Apakah Anda yakin ingin menghapus akun? Semua data prediksi, konsultasi, dan riwayat akan hilang permanen."
                text-sm text-slate-600 text-center mb-6

  Confirmation Input:
    Label:      "Ketik 'HAPUS AKUN' untuk konfirmasi"
                text-sm font-medium text-slate-700 mb-2
    Input:      Text input
    Validation: Must match "HAPUS AKUN" exactly

Footer:
  Layout:       flex gap-3 justify-end

  Cancel Button:
    Variant:    outline
    Text:       "Batal"

  Delete Button:
    Variant:    danger
    Text:       "Ya, Hapus Akun Saya"
    Disabled:   (jika input tidak match)
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar User** → active: Profil
2. **Button** → primary, outline, danger, ghost
3. **Card** → base card
4. **Input Field** → text, email, password, date, textarea
5. **Modal** → delete confirmation

Komponen custom:
- Tabs component
- Toggle switch
- Avatar upload
- Session list items

---

## RESPONSIVE

```
Mobile:         Stack vertical, tabs scroll horizontal jika sempit
Tablet/Desktop: Normal grid layout
```

---

**Profile page harus clean dan organized dengan tabs. Security features (password change, delete account) harus ada clear warnings.**
