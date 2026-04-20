# 01 — Global Components
# Komponen reusable yang dipakai di seluruh aplikasi HeartPredict

> Semua komponen di file ini merujuk ke design tokens di `00_DESIGN_TOKENS.md`

---

## NAVBAR

### Spesifikasi Desktop

```
Posisi:         sticky top-0 z-20
Tinggi:         h-16 (64px)
Background:     bg-white border-b border-slate-200
Backdrop:       -
Padding:        px-8
Layout:         flex items-center justify-between

Konten Kiri:
  Logo:
    Type:       Image + Text
    Image:      h-8 (32px)
    Text:       "HeartPredict"
              text-xl font-bold text-slate-900
              font-family: Plus Jakarta Sans

Konten Tengah:
  (kosong untuk user/admin pages)
  (navigasi menu untuk landing page: Beranda, Fitur, Artikel)
    Link:     text-sm font-medium text-slate-700 hover:text-emerald-600
              transition-colors duration-150

Konten Kanan:
  Unauthenticated (Public):
    Button "Masuk":      variant=ghost size=sm
    Button "Daftar":     variant=primary size=sm

  Authenticated (User/Admin):
    NotificationIcon:
      Icon:     Lucide "Bell" w-5 h-5 text-slate-600
      Badge:    Dot merah (w-2 h-2 bg-red-500 rounded-full absolute)
      Button:   p-2 rounded-lg hover:bg-slate-100

    UserDropdown:
      Trigger:
        Avatar:   w-8 h-8 rounded-full bg-emerald-100 text-emerald-700
                  text-sm font-semibold (inisial nama)
        Name:     text-sm font-medium text-slate-700 ml-3 hidden md:block
        Icon:     Lucide "ChevronDown" w-4 h-4 text-slate-500
      Menu:
        Background: bg-white rounded-xl shadow-md border border-slate-200
        Width:      w-56
        Padding:    py-2
        Items:
          - Icon "User" + "Profil Saya"
          - Icon "Settings" + "Pengaturan"
          - Divider (border-t border-slate-200 my-2)
          - Icon "LogOut" + "Keluar" (text-red-600)
        Item style:
          px-4 py-2.5 flex items-center gap-3
          text-sm text-slate-700 hover:bg-slate-50
          transition-colors duration-150
```

### Responsive Mobile (< 768px)

```
Padding:        px-4
Konten Tengah:  hidden
Logo Text:      hidden sm:block
User Name:      hidden
Hamburger:      (untuk mobile menu drawer bila ada navigasi)
```

---

## SIDEBAR USER

### Spesifikasi Desktop (>1024px)

```
Posisi:         fixed left-0 top-0 h-screen
Lebar:          w-64 (256px)
Background:     bg-slate-900
Padding:        py-6
Z-index:        z-30

Header (Logo Area):
  Padding:      px-6 mb-8
  Logo:         w-8 h-8 bg-emerald-500 rounded-lg
  Text:         "HeartPredict"
                text-lg font-bold text-white ml-3
                font-family: Plus Jakarta Sans

Navigation Menu:
  Padding:      px-3

  Menu Item (Default):
    Layout:     flex items-center gap-3 px-3 py-2.5 rounded-lg
    Icon:       w-5 h-5 text-slate-400 (Lucide icons)
    Text:       text-sm font-medium text-slate-300
    Transition: transition-all duration-150

  Menu Item (Hover):
    Background: bg-slate-800
    Icon:       text-slate-300
    Text:       text-white

  Menu Item (Active):
    Background: bg-emerald-600/10
    Border:     border-l-4 border-emerald-500 -ml-3 pl-3
    Icon:       text-emerald-400
    Text:       text-emerald-400 font-semibold

Menu Items (User Role):
  1. Dashboard
     Icon: Lucide "LayoutDashboard"
     Route: /user/dashboard

  2. Cek Kesehatan
     Icon: Lucide "HeartPulse"
     Route: /user/health-check

  3. Riwayat Prediksi
     Icon: Lucide "History"
     Route: /user/history

  4. Konsultasi AI
     Icon: Lucide "MessageSquare"
     Route: /user/consultation

  5. Profil
     Icon: Lucide "User"
     Route: /user/profile

Footer Sidebar:
  Position:     absolute bottom-0 left-0 w-full
  Padding:      p-6
  Border:       border-t border-slate-800

  User Card:
    Layout:     flex items-center gap-3
    Avatar:     w-10 h-10 rounded-full bg-emerald-100 (inisial)
    Name:       text-sm font-medium text-white
    Email:      text-xs text-slate-400 truncate
```

### Responsive Tablet (768-1024px)

```
Lebar:          w-20 (80px) — icon-only mode
Text Label:     hidden
Icon:           centered (mx-auto)
Footer:         Avatar only (no name/email)
Tooltip:        Tampilkan label saat hover (position: right)
```

### Responsive Mobile (<768px)

```
Default:        -translate-x-full (hidden)
Opened:         translate-x-0 (drawer)
Overlay:        bg-black/50 backdrop-blur-sm
Animation:      transition-transform duration-300 ease-in-out
Close Button:   Icon "X" absolute top-4 right-4
```

---

## SIDEBAR ADMIN

### Struktur sama dengan Sidebar User, dengan menu berbeda:

```
Menu Items (Admin Role):
  1. Dashboard
     Icon: Lucide "LayoutDashboard"
     Route: /admin/dashboard

  2. Manajemen User
     Icon: Lucide "Users"
     Route: /admin/users

  3. Manajemen Artikel
     Icon: Lucide "FileText"
     Route: /admin/articles

  4. Manajemen Dataset
     Icon: Lucide "Database"
     Route: /admin/datasets

  5. Kategori Artikel
     Icon: Lucide "Tag"
     Route: /admin/categories

Footer:
  Admin Badge:  "Admin" badge (bg-emerald-500 text-white rounded-full px-3 py-1 text-xs)
  (sisanya sama dengan user sidebar)
```

---

## BUTTON

### Variant: PRIMARY

```
Background:     bg-emerald-600
Text:           text-white
Border:         none
Border-radius:  rounded-xl
Font:           font-medium
Shadow:         shadow-sm
Transition:     transition-all duration-150

Hover:
  Background:   bg-emerald-700
  Shadow:       shadow-md
  Transform:    -translate-y-0.5

Active:
  Transform:    translate-y-0
  Scale:        scale-98

Disabled:
  Background:   bg-slate-200
  Text:         text-slate-400
  Cursor:       cursor-not-allowed
  Shadow:       none

Loading:
  Same as default + icon spinner (Lucide "Loader2" animate-spin)
```

### Variant: SECONDARY

```
Background:     bg-slate-100
Text:           text-slate-700
Border:         none
Border-radius:  rounded-xl
Font:           font-medium

Hover:
  Background:   bg-slate-200
  Text:         text-slate-900

Disabled:
  Background:   bg-slate-50
  Text:         text-slate-300
```

### Variant: OUTLINE

```
Background:     bg-transparent
Text:           text-emerald-600
Border:         border-2 border-emerald-600
Border-radius:  rounded-xl
Font:           font-medium

Hover:
  Background:   bg-emerald-50
  Border:       border-emerald-700
  Text:         text-emerald-700

Disabled:
  Border:       border-slate-200
  Text:         text-slate-300
```

### Variant: GHOST

```
Background:     bg-transparent
Text:           text-slate-700
Border:         none
Border-radius:  rounded-xl
Font:           font-medium

Hover:
  Background:   bg-slate-100
  Text:         text-slate-900

Active:
  Background:   bg-slate-200
```

### Variant: DANGER

```
Background:     bg-red-600
Text:           text-white
Border:         none
Border-radius:  rounded-xl
Font:           font-medium
Shadow:         shadow-sm

Hover:
  Background:   bg-red-700
  Shadow:       shadow-md

Disabled:
  Background:   bg-red-200
  Text:         text-red-400
```

### Size: SMALL (SM)

```
Padding:        px-4 py-2
Text:           text-sm
Icon size:      w-4 h-4
Height:         h-9
```

### Size: MEDIUM (MD) — Default

```
Padding:        px-5 py-2.5
Text:           text-sm
Icon size:      w-5 h-5
Height:         h-10
```

### Size: LARGE (LG)

```
Padding:        px-6 py-3
Text:           text-base
Icon size:      w-5 h-5
Height:         h-12
```

### Size: ICON-ONLY

```
Padding:        p-2.5
Icon size:      w-5 h-5
Width:          w-10
Height:         h-10
Border-radius:  rounded-lg
```

### Icon Position

```
Icon Left:
  Layout:       flex items-center justify-center gap-2
  Icon:         mr-0 (gap handles spacing)

Icon Right:
  Layout:       flex items-center justify-center gap-2
  Icon:         ml-0 (gap handles spacing)

Icon Only:
  Layout:       flex items-center justify-center
  No text
```

---

## INPUT FIELD

### Base Input (Text)

```
Height:         h-11 (44px)
Padding:        px-4 py-3
Border:         border border-slate-200
Border-radius:  rounded-lg
Background:     bg-white
Text:           text-sm text-slate-900
Placeholder:    placeholder:text-slate-400
Font:           font-normal
Transition:     transition-all duration-150

Focus:
  Border:       border-emerald-600
  Ring:         ring-4 ring-emerald-600/10
  Outline:      outline-none

Disabled:
  Background:   bg-slate-50
  Text:         text-slate-400
  Border:       border-slate-100
  Cursor:       cursor-not-allowed

Error State:
  Border:       border-red-500
  Ring:         ring-4 ring-red-500/10
  Background:   bg-red-50
```

### Label

```
Text:           text-[13px] font-medium text-slate-700
Margin:         mb-2
Required mark:  text-red-500 ml-1 (asterisk *)
```

### Helper Text

```
Text:           text-xs text-slate-500
Margin:         mt-1.5
```

### Error Message

```
Text:           text-xs text-red-600 font-medium
Margin:         mt-1.5
Icon:           Lucide "AlertCircle" w-3 h-3 inline mr-1
```

### Select / Dropdown

```
(Same as base input)
Icon:           Lucide "ChevronDown" w-4 h-4 absolute right-3 text-slate-400
Padding right:  pr-10 (to accommodate icon)

Dropdown Menu:
  Background:   bg-white
  Border:       border border-slate-200 rounded-lg
  Shadow:       shadow-md
  Max height:   max-h-60 overflow-y-auto
  Padding:      py-2

  Option:
    Padding:    px-4 py-2.5
    Text:       text-sm text-slate-700
    Hover:      bg-slate-50
    Selected:   bg-emerald-50 text-emerald-700 font-medium
    Checkmark:  Lucide "Check" w-4 h-4 (if selected)
```

### Textarea

```
(Same as base input)
Min height:     min-h-[120px]
Padding:        px-4 py-3
Resize:         resize-none (or resize-y)
```

### Input with Icon (Left)

```
Icon container: absolute left-3 top-1/2 -translate-y-1/2
Icon:           w-5 h-5 text-slate-400
Input padding:  pl-10 (to accommodate icon)
```

### Input with Icon (Right) — e.g., Password Toggle

```
Icon container: absolute right-3 top-1/2 -translate-y-1/2
Icon button:    w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer
Input padding:  pr-10 (to accommodate icon)
```

### Input Group (dengan prefix/suffix)

```
Container:      flex items-center border border-slate-200 rounded-lg
                focus-within:border-emerald-600 focus-within:ring-4
                focus-within:ring-emerald-600/10

Prefix:         px-3 bg-slate-50 border-r border-slate-200
                text-sm text-slate-500

Input:          border-none focus:ring-0 flex-1

Suffix:         px-3 bg-slate-50 border-l border-slate-200
                text-sm text-slate-500
```

---

## CARD

### Base Card

```
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Transition:     transition-all duration-200
```

### Stat Card (Dashboard)

```
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-2xl
Padding:        p-6
Shadow:         shadow-sm
Layout:         flex flex-col

Icon Container:
  Size:         w-12 h-12
  Border-radius: rounded-xl
  Background:   bg-emerald-100 (varies per card accent)
  Icon:         w-6 h-6 text-emerald-600 (varies)

Value:
  Text:         text-3xl font-bold text-slate-900
  Margin:       mt-4
  Font:         Plus Jakarta Sans

Label:
  Text:         text-sm text-slate-500
  Margin:       mt-1

Trend Indicator:
  Layout:       flex items-center gap-1 mt-2
  Icon:         Lucide "TrendingUp" or "TrendingDown" w-4 h-4
  Text:         text-xs font-medium
  Color:        text-emerald-600 (up) or text-red-600 (down)

Hover:
  Shadow:       shadow-md
  Transform:    -translate-y-1
```

### Article Card (Landing Page)

```
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-2xl
Padding:        -
Shadow:         shadow
Transition:     transition-all duration-200
Overflow:       overflow-hidden

Image:
  Width:        w-full
  Height:       h-48
  Object-fit:   object-cover

Content:
  Padding:      p-6

Category Badge:
  Position:     absolute top-4 left-4
  Background:   bg-emerald-100
  Text:         text-emerald-700 text-xs font-semibold
  Padding:      px-3 py-1
  Border-radius: rounded-full

Title:
  Text:         text-lg font-semibold text-slate-900
  Line-clamp:   line-clamp-2
  Margin:       mb-2

Excerpt:
  Text:         text-sm text-slate-600
  Line-clamp:   line-clamp-3
  Margin:       mb-4

Meta:
  Layout:       flex items-center gap-4
  Author:       text-xs text-slate-500
  Date:         text-xs text-slate-500
  Separator:    • (bullet)

Hover:
  Shadow:       shadow-lg
  Transform:    -translate-y-2
  Border:       border-emerald-200
```

### Card dengan Header

```
Header:
  Padding:      px-6 pt-6 pb-4
  Border:       border-b border-slate-200
  Title:        text-lg font-semibold text-slate-900
  Action:       Button (variant ghost, size sm)

Body:
  Padding:      p-6
  Content:      (varies)

Footer:
  Padding:      px-6 pb-6 pt-4
  Border:       border-t border-slate-200
  Layout:       flex justify-between items-center
```

### Clickable Card (Interactive)

```
(Same as base card)
Cursor:         cursor-pointer
Hover:
  Border:       border-emerald-200
  Shadow:       shadow-md
  Transform:    -translate-y-0.5
Active:
  Transform:    translate-y-0
  Scale:        scale-[0.98]
```

---

## BADGE / STATUS TAG

### Base Badge

```
Layout:         inline-flex items-center gap-1.5
Padding:        px-3 py-1
Border-radius:  rounded-full
Font:           text-xs font-semibold
```

### Variant: SUCCESS (Risiko Rendah)

```
Background:     bg-emerald-100
Text:           text-emerald-900
Dot:            w-1.5 h-1.5 rounded-full bg-emerald-500
```

### Variant: WARNING (Risiko Sedang)

```
Background:     bg-amber-100
Text:           text-amber-900
Dot:            w-1.5 h-1.5 rounded-full bg-amber-500
```

### Variant: DANGER (Risiko Tinggi)

```
Background:     bg-red-100
Text:           text-red-900
Dot:            w-1.5 h-1.5 rounded-full bg-red-500
```

### Variant: INFO

```
Background:     bg-blue-100
Text:           text-blue-900
Dot:            w-1.5 h-1.5 rounded-full bg-blue-500
```

### Variant: NEUTRAL (Draft, Pending, etc.)

```
Background:     bg-slate-100
Text:           text-slate-700
Dot:            w-1.5 h-1.5 rounded-full bg-slate-500
```

### Size: Small

```
Padding:        px-2 py-0.5
Text:           text-[10px]
Dot:            w-1 h-1
```

### Size: Large

```
Padding:        px-4 py-1.5
Text:           text-sm
Dot:            w-2 h-2
```

---

## DATA TABLE

### Table Container

```
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-2xl
Overflow:       overflow-hidden (or overflow-x-auto for responsive)
Shadow:         shadow-sm
```

### Table Header (thead)

```
Background:     bg-slate-50
Border:         border-b border-slate-200

Header Cell (th):
  Padding:      px-6 py-4
  Text:         text-xs font-semibold text-slate-600 uppercase tracking-wide
  Text-align:   text-left
```

### Table Row (tbody tr)

```
Border:         border-b border-slate-200 last:border-0

Default:
  Background:   bg-white

Hover:
  Background:   bg-slate-50
  Transition:   transition-colors duration-150

Clickable Row:
  Cursor:       cursor-pointer
  Hover:        bg-emerald-50
```

### Table Cell (td)

```
Padding:        px-6 py-4
Text:           text-sm text-slate-700
Text-align:     text-left
Whitespace:     whitespace-nowrap (untuk cell yang tidak boleh wrap)
```

### Pagination

```
Container:
  Layout:       flex items-center justify-between
  Padding:      px-6 py-4
  Border:       border-t border-slate-200

Info Text:
  Text:         text-sm text-slate-600
  Example:      "Menampilkan 1-10 dari 50 data"

Button Group:
  Layout:       flex items-center gap-2

  Page Button:
    Size:       w-9 h-9
    Border:     border border-slate-200
    Radius:     rounded-lg
    Text:       text-sm font-medium text-slate-700
    Hover:      bg-slate-50

  Active Page:
    Background: bg-emerald-600
    Text:       text-white
    Border:     border-emerald-600

  Prev/Next:
    Icon:       Lucide "ChevronLeft" / "ChevronRight" w-4 h-4
    (Same style as page button)
```

### Empty State (No Data)

```
Container:
  Padding:      py-12
  Text-align:   text-center

Icon:           Lucide "Inbox" w-12 h-12 text-slate-300 mx-auto mb-4
Text:           text-sm text-slate-500
                "Belum ada data"
```

---

## MODAL

### Overlay (Backdrop)

```
Position:       fixed inset-0 z-40
Background:     bg-black/50
Backdrop:       backdrop-blur-sm
Animation:      fade-in (opacity 0 → 1, duration-300)
```

### Modal Panel

```
Position:       fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
Background:     bg-white
Border-radius:  rounded-2xl
Shadow:         shadow-xl
Max-width:      max-w-lg w-full
Max-height:     max-h-[90vh]
Overflow:       overflow-y-auto
Animation:      scale(0.95) → scale(1) + fade-in (duration-300)
```

### Modal Header

```
Padding:        px-6 pt-6 pb-4
Border:         border-b border-slate-200

Title:
  Text:         text-xl font-semibold text-slate-900
  Font:         Plus Jakarta Sans

Close Button:
  Position:     absolute top-4 right-4
  Icon:         Lucide "X" w-5 h-5 text-slate-400
  Padding:      p-2
  Hover:        bg-slate-100 text-slate-600
  Border-radius: rounded-lg
```

### Modal Body

```
Padding:        px-6 py-6
Content:        (varies — form, text, list, etc.)
```

### Modal Footer

```
Padding:        px-6 pb-6 pt-4
Border:         border-t border-slate-200
Layout:         flex justify-end gap-3 (or justify-between if cancel is left-aligned)

Buttons:
  Cancel:       variant=ghost or outline, size=md
  Confirm:      variant=primary (or danger), size=md
```

### Modal Sizes

```
Small:          max-w-sm
Medium:         max-w-lg (default)
Large:          max-w-2xl
Extra Large:    max-w-4xl
```

---

## TOAST / NOTIFICATION

### Container

```
Position:       fixed top-4 right-4 z-60
Layout:         flex flex-col gap-3
Max-width:      max-w-md
```

### Toast Item

```
Background:     bg-white
Border:         border border-slate-200
Border-radius:  rounded-xl
Shadow:         shadow-lg
Padding:        p-4
Layout:         flex items-start gap-3
Animation:      slide-in from right + fade-in (duration-300)
Auto-dismiss:   5000ms (5 detik)
```

### Variant: SUCCESS

```
Icon:           Lucide "CheckCircle" w-5 h-5 text-emerald-500
Border-left:    border-l-4 border-emerald-500
```

### Variant: ERROR

```
Icon:           Lucide "XCircle" w-5 h-5 text-red-500
Border-left:    border-l-4 border-red-500
```

### Variant: WARNING

```
Icon:           Lucide "AlertTriangle" w-5 h-5 text-amber-500
Border-left:    border-l-4 border-amber-500
```

### Variant: INFO

```
Icon:           Lucide "Info" w-5 h-5 text-blue-500
Border-left:    border-l-4 border-blue-500
```

### Content

```
Title:
  Text:         text-sm font-semibold text-slate-900
  Margin:       mb-1

Message:
  Text:         text-sm text-slate-600
  Line-clamp:   line-clamp-2

Close Button:
  Position:     absolute top-2 right-2
  Icon:         Lucide "X" w-4 h-4 text-slate-400
  Padding:      p-1
  Hover:        text-slate-600
  Border-radius: rounded
```

---

## EMPTY STATE

### Container

```
Padding:        py-16 px-6
Text-align:     text-center
Max-width:      max-w-sm mx-auto
```

### Icon/Illustration

```
Size:           w-24 h-24 (or w-32 h-32 for larger)
Color:          text-slate-300
Margin:         mx-auto mb-6
Icon:           Lucide icons (Inbox, FileX, SearchX, etc.)
```

### Heading

```
Text:           text-lg font-semibold text-slate-900
Margin:         mb-2
Font:           Plus Jakarta Sans
```

### Description

```
Text:           text-sm text-slate-500
Margin:         mb-6
Max-width:      max-w-xs mx-auto
```

### CTA Button

```
Variant:        primary
Size:           md
Layout:         mx-auto (centered)
```

---

## LOADING SKELETON

### Skeleton Base

```
Background:     bg-slate-200
Animation:      animate-pulse (Tailwind built-in)
Border-radius:  (matches target element)
```

### Card Skeleton

```
Container:      bg-white border border-slate-200 rounded-2xl p-6

Image area:     h-48 bg-slate-200 rounded-xl mb-4
Title:          h-5 bg-slate-200 rounded-lg w-3/4 mb-3
Line 1:         h-4 bg-slate-200 rounded-lg w-full mb-2
Line 2:         h-4 bg-slate-200 rounded-lg w-5/6 mb-2
Line 3:         h-4 bg-slate-200 rounded-lg w-4/6 mb-4
Meta:           h-3 bg-slate-200 rounded w-1/3
```

### Table Row Skeleton

```
Row:            flex items-center gap-4 px-6 py-4 border-b border-slate-200

Cell 1:         h-4 bg-slate-200 rounded w-32
Cell 2:         h-4 bg-slate-200 rounded w-48
Cell 3:         h-4 bg-slate-200 rounded w-24
Cell 4:         h-4 bg-slate-200 rounded w-20
Cell 5:         h-4 bg-slate-200 rounded w-16
```

### Chat Bubble Skeleton

```
Container:      flex items-start gap-3 mb-4

Avatar:         w-8 h-8 bg-slate-200 rounded-full flex-shrink-0

Bubble:
  Container:    bg-slate-100 rounded-2xl p-4 max-w-md
  Line 1:       h-4 bg-slate-200 rounded w-full mb-2
  Line 2:       h-4 bg-slate-200 rounded w-5/6 mb-2
  Line 3:       h-4 bg-slate-200 rounded w-3/4
```

### Stat Card Skeleton

```
Container:      bg-white border border-slate-200 rounded-2xl p-6

Icon:           w-12 h-12 bg-slate-200 rounded-xl mb-4
Value:          h-8 bg-slate-200 rounded-lg w-24 mb-2
Label:          h-4 bg-slate-200 rounded w-32
```

---

## DIVIDER

### Horizontal Divider

```
Element:        <div>
Height:         h-px
Background:     bg-slate-200
Margin:         my-6 (or custom)
```

### Vertical Divider

```
Element:        <div>
Width:          w-px
Background:     bg-slate-200
Margin:         mx-4 (or custom)
Height:         h-full or h-[custom]
```

### Divider with Text

```
Container:      relative flex items-center justify-center my-6

Line:           absolute inset-0 flex items-center
                <span class="w-full border-t border-slate-200"></span>

Text:           relative bg-white px-4 text-xs text-slate-500 font-medium uppercase
```

---

## TOOLTIP

### Container

```
Position:       absolute z-70
Background:     bg-slate-900
Text:           text-white text-xs
Padding:        px-3 py-1.5
Border-radius:  rounded-lg
Shadow:         shadow-lg
Whitespace:     whitespace-nowrap
Animation:      fade-in scale(0.95) → scale(1) duration-150

Arrow:          (pseudo-element triangle, warna matches bg)
```

### Positions

```
Top:            bottom-full mb-2 left-1/2 -translate-x-1/2
Bottom:         top-full mt-2 left-1/2 -translate-x-1/2
Left:           right-full mr-2 top-1/2 -translate-y-1/2
Right:          left-full ml-2 top-1/2 -translate-y-1/2
```

---

**Semua komponen di atas adalah komponen reusable yang WAJIB dipakai di halaman-halaman.**
**Tidak ada duplikasi kode — setiap halaman harus mengimpor dan memakai komponen ini.**
