# 04 — Register Page

**Route:** `/register`  
**Role:** Public  
**Layout:** AuthLayout (Centered, tanpa navbar/sidebar)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Sama dengan halaman login: background polos, form plain, warna tidak konsisten
- Validasi password tidak jelas (requirement tidak ditampilkan)
- Tidak ada konfirmasi password

**Solusi baru:**
- Split layout desktop (sama dengan login): kiri = brand, kanan = form
- Background `bg-slate-50`
- Tombol submit Primary Emerald (`bg-emerald-600`)
- Tambahkan field konfirmasi password dengan validasi real-time
- Password strength indicator
- Checkbox persetujuan syarat & ketentuan

---

## LAYOUT HALAMAN

```
Container:      min-h-screen bg-slate-50
Layout:         grid grid-cols-1 lg:grid-cols-2
```

---

## WIREFRAME TEKSTUAL

```
┌───────────────────────────────────────────────────────────┐
│ Desktop (>1024px)                                          │
├────────────────────────────┬──────────────────────────────┤
│ LEFT PANEL (Brand)         │ RIGHT PANEL (Form)           │
│ [sama dengan login page]   │ ┌────────────────────────┐   │
│                            │ │ Card Register          │   │
│ [Logo + Ilustrasi]         │ │                        │   │
│                            │ │ Heading "Daftar"       │   │
│ [Tagline]                  │ │                        │   │
│                            │ │ Input Nama Lengkap     │   │
│ [Dekorasi Shapes]          │ │ Input Email            │   │
│                            │ │ Input Password         │   │
│                            │ │ Password Strength      │   │
│                            │ │ Input Confirm Password │   │
│                            │ │ Checkbox Terms         │   │
│                            │ │                        │   │
│                            │ │ Button "Daftar"        │   │
│                            │ │                        │   │
│                            │ │ Divider                │   │
│                            │ │ Link "Sudah punya...?" │   │
│                            │ └────────────────────────┘   │
└────────────────────────────┴──────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Left Panel (Brand)

```
SAMA PERSIS dengan halaman Login (03_PAGE_login.md)
Lihat detail di file 03_PAGE_login.md → Section: Left Panel

Hanya ubah tagline:
  Heading:    "Mulai Jaga Kesehatan Jantung Anda"
  Description: "Daftar gratis dan dapatkan prediksi risiko jantung dengan teknologi AI terkini"
```

---

### Section: Right Panel (Form)

```
Background:     bg-slate-50 (mobile) atau transparent (desktop)
Padding:        p-6 lg:p-12
Layout:         flex items-center justify-center min-h-screen

Logo (Mobile only):
  Display:      lg:hidden
  (sama dengan login page)
```

---

### Component: Register Card

```
Komponen:       Base Card (dari 01_GLOBAL_COMPONENTS.md)
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-2xl
Padding:        p-8
Shadow:         shadow-lg
Max-width:      max-w-md w-full

Header:
  Heading:
    Text:       "Daftar HeartPredict"
                text-2xl font-bold text-slate-900 mb-2 (Plus Jakarta Sans)

  Description:
    Text:       "Buat akun baru dan mulai prediksi kesehatan jantung Anda."
                text-sm text-slate-600 mb-8
```

---

### Component: Form

```
Submit ke:      POST /api/auth/register
Method:         POST
Encoding:       application/json

Fields:

  Nama Lengkap:
    Komponen:   Input Field (dari 01_GLOBAL_COMPONENTS.md)
    Label:      "Nama Lengkap" (required)
    Type:       text
    Placeholder: "John Doe"
    Icon:       Lucide "User" (left)
    Validasi:   Required, min 3 characters
    Error msg:  "Nama lengkap harus diisi" / "Nama minimal 3 karakter"
    Tailwind:   mb-4

  Email:
    Komponen:   Input Field
    Label:      "Email" (required)
    Type:       email
    Placeholder: "nama@email.com"
    Icon:       Lucide "Mail" (left)
    Validasi:   Required, valid email, unique (check dari API)
    Error msg:  "Email harus diisi" / "Format email tidak valid" / "Email sudah terdaftar"
    Tailwind:   mb-4

  Password:
    Komponen:   Input Field
    Label:      "Password" (required)
    Type:       password (toggleable)
    Placeholder: "Minimal 8 karakter"
    Icon Left:  Lucide "Lock"
    Icon Right: Lucide "Eye" / "EyeOff" (toggle)
    Validasi:   Required, min 8 characters, harus ada huruf & angka
    Error msg:  "Password harus diisi" / "Password minimal 8 karakter" / "Password harus kombinasi huruf dan angka"
    Tailwind:   mb-2 (tidak mb-4 karena ada strength indicator)

  Password Strength Indicator:
    Display:      (muncul saat user mulai mengetik password)
    Layout:       flex items-center gap-2 mb-4

    Progress Bar:
      Container:  h-1.5 bg-slate-200 rounded-full w-full flex gap-1
      Segments:   3 segments (weak, medium, strong)

    Weak (password < 6 chars):
      Segment 1:  bg-red-500
      Segment 2:  bg-slate-200
      Segment 3:  bg-slate-200
      Text:       "Lemah" text-xs text-red-600

    Medium (6-8 chars, or lacks combination):
      Segment 1:  bg-amber-500
      Segment 2:  bg-amber-500
      Segment 3:  bg-slate-200
      Text:       "Sedang" text-xs text-amber-600

    Strong (>8 chars, huruf + angka + symbol):
      Segment 1:  bg-emerald-500
      Segment 2:  bg-emerald-500
      Segment 3:  bg-emerald-500
      Text:       "Kuat" text-xs text-emerald-600

  Confirm Password:
    Komponen:   Input Field
    Label:      "Konfirmasi Password" (required)
    Type:       password (toggleable)
    Placeholder: "Ulangi password Anda"
    Icon Left:  Lucide "Lock"
    Icon Right: Lucide "Eye" / "EyeOff"
    Validasi:   Required, must match password
    Error msg:  "Konfirmasi password harus diisi" / "Password tidak cocok"
    Success:    (jika match) border-emerald-500 ring-emerald-500/10
                Icon "Check" hijau muncul di kanan
    Tailwind:   mb-4

  Terms Agreement:
    Layout:     flex items-start gap-3 mb-6

    Checkbox:
      Size:     w-4 h-4 mt-0.5
      Style:    rounded border-slate-300 text-emerald-600 focus:ring-emerald-600
      Required: true
      Error:    (jika tidak dicentang saat submit) border-red-500

    Label:
      Text:     text-sm text-slate-600
      Content:  "Saya setuju dengan "
      Link:     "Syarat & Ketentuan"
                text-emerald-600 hover:text-emerald-700 underline
                (opens modal atau route /terms)
      And:      " dan "
      Link:     "Kebijakan Privasi"
                text-emerald-600 hover:text-emerald-700 underline

  Submit Button:
    Komponen:   Button (dari 01_GLOBAL_COMPONENTS.md)
    Variant:    primary
    Size:       lg
    Width:      w-full
    Text:       "Daftar Sekarang"
    Icon:       Lucide "UserPlus" (right)
    Loading state:
      Disabled: true
      Text:     "Memproses..."
      Icon:     Lucide "Loader2" animate-spin

  Divider:
    (sama dengan login page)
    Text:       "atau"

  Sign In Link:
    Layout:     text-center text-sm text-slate-600
    Text:       "Sudah punya akun? "
    Link:       "Masuk di sini"
                font-medium text-emerald-600 hover:text-emerald-700
    Route:      /login
```

---

### State: Loading

```
(sama dengan login page)
Form disabled, button loading state
```

---

### State: Error

```
Error Alert (di atas form):
  (sama dengan login page)
  Content examples:
    - "Email sudah terdaftar. Silakan gunakan email lain."
    - "Terjadi kesalahan. Silakan coba lagi."

Field-level errors:
  Ditampilkan di bawah masing-masing field yang error
  (komponen Input Field sudah support error state)
```

---

### State: Success

```
Setelah register berhasil:
  1. Tampilkan toast success:
     "Registrasi berhasil! Silakan login dengan akun Anda."
  2. Redirect ke /login setelah 2000ms
  3. (optional) Auto-fill email di halaman login
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:

1. **Input Field** → nama, email, password, confirm password
2. **Button** → variant primary, size lg
3. **Card** → Base card untuk form
4. **Toast** → success notification

Komponen custom halaman ini:
- Password strength indicator (progress bar 3 segments)
- Terms checkbox dengan link
- Error alert banner

---

## RESPONSIVE

```
(SAMA dengan login page — lihat 03_PAGE_login.md)

Mobile:       single column, logo visible, left panel hidden
Tablet:       single column, card centered
Desktop:      split layout, left panel visible
```

---

## ANIMASI

```
(SAMA dengan login page)

Tambahan:
Password Strength:
  Segments fill: transition-all duration-300 ease-out
  Color change:  transition-colors duration-200

Confirm Password Match Check Icon:
  Enter:         scale(0) → scale(1) + fade-in — 200ms ease-out (spring)
  Color:         text-emerald-500
```

---

## API INTEGRATION

### Request

```typescript
POST /api/auth/register

Headers:
  Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123"
}
```

### Response Success (201)

```typescript
{
  "success": true,
  "message": "Registrasi berhasil. Silakan login.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2026-04-18T10:00:00.000Z"
    }
  }
}

Action:
1. Tampilkan toast success
2. Redirect ke /login setelah 2s
3. (optional) Pre-fill email di login page via URL param atau localStorage
```

### Response Error (422) — Validation

```typescript
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah terdaftar"],
    "password": ["Password minimal 8 karakter"]
  }
}

Action:
1. Tampilkan error di bawah field yang bermasalah
2. Focus ke field pertama yang error
```

### Response Error (400)

```typescript
{
  "success": false,
  "message": "Data tidak lengkap"
}

Action:
Tampilkan error alert di atas form
```

---

## FORM VALIDATION (Client-side)

### Validasi Real-time

```
Nama Lengkap:
  - On blur: check if not empty, min 3 chars
  - Show error immediately if invalid

Email:
  - On blur: check format dengan regex
  - (optional) On blur: debounced API check untuk unique email

Password:
  - On input: update strength indicator real-time
  - On blur: check min 8 chars, kombinasi huruf & angka

Confirm Password:
  - On input: real-time compare dengan password field
  - Show green checkmark jika match
  - Show error jika tidak match

Terms Checkbox:
  - On submit: check if checked
  - Show error di border checkbox jika tidak checked
```

### Validasi saat Submit

```
1. Prevent submit jika ada field yang error
2. Scroll ke field pertama yang error
3. Highlight semua field yang error
4. Show error alert di atas form dengan daftar kesalahan
```

---

**Halaman Register harus memberikan feedback yang jelas untuk setiap input agar user tahu requirement sebelum submit. Password strength indicator adalah must-have untuk UX yang baik.**
