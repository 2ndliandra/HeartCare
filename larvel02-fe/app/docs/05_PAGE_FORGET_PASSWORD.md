# 05 — Forgot Password Page

**Route:** `/forgot-password`  
**Role:** Public  
**Layout:** AuthLayout (Centered, tanpa navbar/sidebar)

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama:**
- Halaman ini mungkin tidak ada di desain lama
- Atau jika ada, tidak konsisten dengan sistem desain

**Solusi baru:**
- Konsisten dengan login & register page (split layout desktop)
- Simple single-step: masukkan email, kirim link reset
- Feedback jelas setelah submit (email terkirim)
- Brand visual tetap ada di left panel

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
│ Desktop                                                    │
├────────────────────────────┬──────────────────────────────┤
│ LEFT PANEL (Brand)         │ RIGHT PANEL (Form)           │
│ [sama dengan login/register│ ┌────────────────────────┐   │
│  page]                     │ │ Card Forgot Password   │   │
│                            │ │                        │   │
│ [Logo + Ilustrasi]         │ │ Icon Mail (large)      │   │
│                            │ │                        │   │
│ [Tagline]                  │ │ Heading "Lupa Pass?"   │   │
│                            │ │ Description            │   │
│                            │ │                        │   │
│                            │ │ Input Email            │   │
│                            │ │                        │   │
│                            │ │ Button "Kirim Link"    │   │
│                            │ │                        │   │
│                            │ │ Link "Kembali"         │   │
│                            │ └────────────────────────┘   │
└────────────────────────────┴──────────────────────────────┘
```

---

## DETAIL SETIAP SECTION

### Section: Left Panel

```
SAMA dengan login/register page
Ubah tagline:
  Heading:    "Lupa Password?"
  Description: "Jangan khawatir, kami akan mengirimkan link reset password ke email Anda"
```

---

### Section: Right Panel & Card

```
Card:
  (sama dengan login/register)
  Max-width:    max-w-md w-full
  Padding:      p-8

Header:
  Icon (centered):
    Icon:       Lucide "Mail" w-16 h-16 text-emerald-600 mx-auto mb-4

  Heading:
    Text:       "Lupa Password?"
                text-2xl font-bold text-slate-900 mb-2 text-center (Plus Jakarta Sans)

  Description:
    Text:       "Masukkan email Anda dan kami akan mengirimkan link untuk mereset password."
                text-sm text-slate-600 mb-8 text-center
```

---

### Component: Form

```
Submit ke:      POST /api/auth/forgot-password
Method:         POST

Fields:

  Email:
    Komponen:   Input Field (dari 01_GLOBAL_COMPONENTS.md)
    Label:      "Email" (required)
    Type:       email
    Placeholder: "nama@email.com"
    Icon:       Lucide "Mail" (left)
    Validasi:   Required, valid email format
    Error msg:  "Email harus diisi" / "Format email tidak valid"
    Tailwind:   mb-6

  Submit Button:
    Komponen:   Button
    Variant:    primary
    Size:       lg
    Width:      w-full
    Text:       "Kirim Link Reset"
    Icon:       Lucide "Send" (right)
    Loading:    "Mengirim..." + spinner

  Back to Login Link:
    Layout:     text-center mt-6
    Icon:       Lucide "ArrowLeft" w-4 h-4 inline mr-1
    Text:       "Kembali ke halaman login"
                text-sm font-medium text-emerald-600 hover:text-emerald-700
    Route:      /login
```

---

### State: Success (Email Sent)

```
Tampilkan Success View (ganti form):

  Icon:
    Icon:       Lucide "CheckCircle" w-16 h-16 text-emerald-600 mx-auto mb-4

  Heading:
    Text:       "Email Terkirim!"
                text-2xl font-bold text-slate-900 mb-2 text-center

  Description:
    Text:       "Kami telah mengirimkan link reset password ke [email]. Silakan cek inbox atau folder spam Anda."
                text-sm text-slate-600 mb-8 text-center

  Action Buttons:
    Layout:     flex flex-col gap-3

    Button 1:
      Variant:  outline
      Size:     md
      Width:    w-full
      Text:     "Buka Email"
      Icon:     Lucide "ExternalLink" (right)
      Action:   window.open('mailto:') atau link ke webmail provider

    Button 2:
      Variant:  ghost
      Size:     md
      Width:    w-full
      Text:     "Kirim Ulang Email"
      Icon:     Lucide "RefreshCw" (left)
      Action:   Re-submit form (dengan cooldown 60s)

    Link:
      Text:     "Kembali ke login"
      Route:    /login
      Style:    text-sm text-center mt-4 text-emerald-600
```

---

### State: Error

```
Error Alert (di atas form):
  (sama dengan login page)
  Content:
    - "Email tidak ditemukan"
    - "Terjadi kesalahan. Silakan coba lagi."
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Input Field** → email
2. **Button** → primary, outline, ghost
3. **Card** → base card
4. **Toast** → (optional) untuk feedback tambahan

---

## RESPONSIVE

```
(SAMA dengan login/register page)
```

---

## ANIMASI

```
Form Submit Success:
  Form:           fade-out + slide-up — 300ms
  Success View:   fade-in + slide-down — 400ms (delay 200ms)

Icons:
  CheckCircle:    scale(0) → scale(1) — 400ms ease-out (bounce)
  Mail Icon:      subtle pulse animation (optional)
```

---

## API INTEGRATION

### Request

```typescript
POST /api/auth/forgot-password

Body:
{
  "email": "user@example.com"
}
```

### Response Success (200)

```typescript
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda"
}

Action:
1. Ganti form dengan success view
2. Tampilkan email yang diinput
3. Start cooldown timer untuk resend (60s)
```

### Response Error (404)

```typescript
{
  "success": false,
  "message": "Email tidak ditemukan"
}

Action:
Tampilkan error alert di atas form
```

---

**Halaman ini harus memberikan feedback yang reassuring. User yang lupa password sedang dalam kondisi stress, jadi UX harus calm dan helpful.**
