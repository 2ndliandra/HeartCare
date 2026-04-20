# 03 — Login Page

**Route:** `/login`  
**Role:** Public  
**Layout:** AuthLayout (Centered, tanpa navbar/sidebar untuk clean focus)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Background halaman polos putih, kurang menarik
- Form terlalu plain tanpa ilustrasi atau visual branding
- Warna tombol submit tidak konsisten (kadang indigo)
- Tidak ada split layout untuk desktop yang memanfaatkan space

**Solusi baru:**
- Background halaman gunakan `bg-slate-50` (bukan putih polos)
- Tambahkan split layout desktop: kiri = brand illustration, kanan = form
- Ilustrasi/visual medis di sisi kiri untuk branding
- Tombol submit wajib Primary Emerald (`bg-emerald-600`)
- Card form dengan shadow dan rounded-2xl untuk tampilan modern
- Tambahkan dekorasi rounded shapes untuk konsistensi visual brand

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
│                            │                              │
│ LEFT PANEL (Brand)         │ RIGHT PANEL (Form)           │
│                            │                              │
│ [Logo HeartPredict]        │ ┌────────────────────────┐   │
│                            │ │ Card Login             │   │
│ [Ilustrasi / Visual]       │ │                        │   │
│                            │ │ Heading "Masuk"        │   │
│ [Tagline]                  │ │                        │   │
│                            │ │ Input Email            │   │
│ [Dekorasi Shapes]          │ │ Input Password         │   │
│                            │ │ [Remember] [Forgot?]   │   │
│                            │ │                        │   │
│                            │ │ Button "Masuk"         │   │
│                            │ │                        │   │
│                            │ │ Divider "atau"         │   │
│                            │ │                        │   │
│                            │ │ Link "Belum punya...?" │   │
│                            │ └────────────────────────┘   │
└────────────────────────────┴──────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ Mobile/Tablet (<1024px)                                    │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [Logo HeartPredict centered]                          │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │                                                        │ │
│ │ ┌────────────────────────────────────────────────┐     │ │
│ │ │ Card Login                                     │     │ │
│ │ │                                                │     │ │
│ │ │ Heading "Masuk"                                │     │ │
│ │ │ Input Email                                    │     │ │
│ │ │ Input Password                                 │     │ │
│ │ │ [Remember] [Forgot?]                           │     │ │
│ │ │ Button "Masuk"                                 │     │ │
│ │ │ Divider                                        │     │ │
│ │ │ Link "Belum punya akun?"                       │     │ │
│ │ └────────────────────────────────────────────────┘     │ │
│ └────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Left Panel (Brand) — Desktop Only

```
Display:        hidden lg:flex
Background:     bg-emerald-600
Padding:        p-12
Layout:         flex flex-col justify-center items-center relative
Overflow:       overflow-hidden

Dekorasi Background:
  Shape 1:
    Position:   absolute top-10 left-10
    Size:       w-40 h-40
    Background: bg-emerald-500/30
    Radius:     rounded-bl-full
    Z-index:    0

  Shape 2:
    Position:   absolute bottom-20 right-10
    Size:       w-56 h-56
    Background: bg-emerald-700/20
    Radius:     rounded-tr-full
    Z-index:    0

Content (z-10 relative):
  Logo Container:
    Layout:     flex items-center gap-3 mb-8
    Logo:       w-12 h-12 bg-white rounded-xl flex items-center justify-center
                (Icon "HeartPulse" text-emerald-600)
    Brand:      "HeartPredict"
                text-2xl font-bold text-white (Plus Jakarta Sans)

  Illustration:
    Type:       Image atau SVG
    Content:    Medical illustration / dashboard visual / doctor consultation
    Size:       w-full max-w-md
    Margin:     mb-8

  Tagline:
    Heading:    "Jaga Kesehatan Jantung Anda"
                text-3xl font-bold text-white mb-4 text-center (Plus Jakarta Sans)
    Description: "Platform prediksi risiko berbasis AI dengan akurasi tinggi dan konsultasi 24/7"
                text-emerald-100 text-center max-w-md
```

---

### Section: Right Panel (Form)

```
Background:     bg-slate-50 (mobile/tablet) atau transparent (desktop)
Padding:        p-6 lg:p-12
Layout:         flex items-center justify-center min-h-screen

Logo (Mobile only):
  Display:      lg:hidden
  Layout:       flex items-center justify-center gap-3 mb-8
  Logo Icon:    w-10 h-10 bg-emerald-600 rounded-xl
  Brand:        "HeartPredict" text-xl font-bold text-slate-900
```

---

### Component: Login Card

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
    Text:       "Masuk ke HeartPredict"
                text-2xl font-bold text-slate-900 mb-2 (Plus Jakarta Sans)

  Description:
    Text:       "Selamat datang kembali! Silakan masuk untuk melanjutkan."
                text-sm text-slate-600 mb-8
```

---

### Component: Form

```
Submit ke:      POST /api/auth/login
Method:         POST
Encoding:       application/json

Fields:

  Email:
    Komponen:   Input Field (dari 01_GLOBAL_COMPONENTS.md)
    Label:      "Email" (required)
    Type:       email
    Placeholder: "nama@email.com"
    Icon:       Lucide "Mail" (left icon)
    Validasi:   Required, valid email format
    Error msg:  "Email harus diisi" / "Format email tidak valid"
    Tailwind:   mb-4

  Password:
    Komponen:   Input Field (dari 01_GLOBAL_COMPONENTS.md)
    Label:      "Password" (required)
    Type:       password (toggleable)
    Placeholder: "Masukkan password Anda"
    Icon Left:  Lucide "Lock"
    Icon Right: Lucide "Eye" / "EyeOff" (toggle visibility)
    Validasi:   Required, min 6 characters
    Error msg:  "Password harus diisi" / "Password minimal 6 karakter"
    Tailwind:   mb-4

  Options Row:
    Layout:     flex items-center justify-between mb-6

    Remember Me (Left):
      Layout:   flex items-center gap-2
      Checkbox: w-4 h-4 rounded border-slate-300 text-emerald-600
                focus:ring-emerald-600
      Label:    "Ingat saya"
                text-sm text-slate-600

    Forgot Password (Right):
      Link:     "Lupa password?"
                text-sm font-medium text-emerald-600 hover:text-emerald-700
      Route:    /forgot-password

  Submit Button:
    Komponen:   Button (dari 01_GLOBAL_COMPONENTS.md)
    Variant:    primary
    Size:       lg
    Width:      w-full
    Text:       "Masuk"
    Icon:       Lucide "LogIn" (right)
    Loading state:
      Disabled: true
      Text:     "Memproses..."
      Icon:     Lucide "Loader2" animate-spin (right)

  Divider:
    Layout:     relative flex items-center justify-center my-6
    Line:       border-t border-slate-200 w-full
    Text:       "atau"
                absolute bg-white px-4 text-xs text-slate-500 uppercase

  Sign Up Link:
    Layout:     text-center text-sm text-slate-600
    Text:       "Belum punya akun? "
    Link:       "Daftar sekarang"
                font-medium text-emerald-600 hover:text-emerald-700
    Route:      /register
```

---

### State: Loading

```
Form:           disabled (all inputs)
Button:         Loading state (spinner + "Memproses...")
Overlay:        (optional) bg-white/50 absolute inset-0 (prevent double submit)
```

---

### State: Error (dari API)

```
Error Alert (di atas form):
  Background:   bg-red-50
  Border:       border-l-4 border-red-500
  Padding:      p-4
  Radius:       rounded-lg
  Margin:       mb-6
  Layout:       flex items-start gap-3

  Icon:         Lucide "AlertCircle" w-5 h-5 text-red-500
  Text:         text-sm text-red-700 font-medium
  Content:      "Email atau password salah. Silakan coba lagi."

  Close button:
    Icon:       Lucide "X" w-4 h-4 text-red-400 hover:text-red-600
    Position:   absolute top-4 right-4
```

---

### State: Success (redirect)

```
Setelah login berhasil:
  1. Tampilkan toast success (komponen Toast dari 01_GLOBAL_COMPONENTS.md)
     Text: "Login berhasil! Mengalihkan ke dashboard..."
  2. Redirect ke:
     - /user/dashboard (jika role = user)
     - /admin/dashboard (jika role = admin)
  3. Durasi: 1000ms sebelum redirect
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:

1. **Input Field** → email, password (dengan icon left & right)
2. **Button** → variant primary, size lg, full-width
3. **Card** → Base card untuk form container
4. **Toast** → untuk notifikasi success/error

Komponen custom halaman ini:
- Left panel brand illustration container
- Form layout dengan divider
- Remember me checkbox
- Error alert banner

---

## RESPONSIVE

### Mobile (<768px)

```
Layout:         grid-cols-1 (single column)
Left Panel:     hidden
Logo:           visible (centered, mb-8)
Card:           mx-4 (margin horizontal untuk spacing)
Padding:        p-6
Font sizes:     Heading text-xl (sedikit lebih kecil)
```

### Tablet (768-1024px)

```
Layout:         grid-cols-1
Left Panel:     hidden
Card:           max-w-md mx-auto
Padding:        p-8
```

### Desktop (>1024px)

```
Layout:         grid-cols-2 (split layout)
Left Panel:     visible (brand + illustration)
Right Panel:    form centered
Logo (mobile):  hidden
Card:           max-w-md
```

---

## ANIMASI

```
Page Load:
  Left Panel:     fade-in + slide-in from left — 500ms ease-out
  Login Card:     fade-in + slide-in from right — 500ms ease-out (delay 100ms)

Form Interactions:
  Input focus:    border-emerald-600 + ring-4 ring-emerald-600/10 — 150ms
  Button hover:   bg-emerald-700 + shadow-md + -translate-y-0.5 — 150ms
  Button active:  translate-y-0 + scale(0.98) — 100ms

Error Alert:
  Enter:          slide-down + fade-in — 300ms ease-out
  Exit:           slide-up + fade-out — 200ms ease-in

Loading State:
  Spinner:        rotate 360deg continuous — 1000ms linear infinite

Success Toast:
  Enter:          slide-in from right + fade-in — 300ms
  Exit:           slide-out to right + fade-out — 200ms (after 3s)
```

---

## API INTEGRATION

### Request

```typescript
POST /api/auth/login

Headers:
  Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Success (200)

```typescript
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user" | "admin"
    }
  }
}

Action:
1. Simpan token ke localStorage.setItem('token', data.token)
2. Simpan user data ke localStorage.setItem('user', JSON.stringify(data.user))
3. Redirect berdasarkan role
```

### Response Error (401)

```typescript
{
  "success": false,
  "message": "Email atau password salah"
}

Action:
1. Tampilkan error alert di atas form
2. Clear password field
3. Focus ke input email
```

### Response Error (400)

```typescript
{
  "success": false,
  "message": "Email dan password harus diisi"
}

Action:
Tampilkan error message di bawah field yang bermasalah
```

---

**Halaman Login harus simple, clean, dan fast. UX harus seamless dengan feedback yang jelas untuk setiap action.**
