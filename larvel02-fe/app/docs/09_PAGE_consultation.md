# Consultation Page Documentation# 09 — AI Consultation Chat

**Route:** `/user/consultation`  
**Role:** User (authenticated)  
**Layout:** UserLayout (Sidebar User + Content) — **layout khusus 3-panel untuk desktop**

---

## PERUBAHAN DARI DESAIN LAMA

**Masalah lama — PRIORITAS 2:**
- **MASALAH TERBESAR:** Bubble pesan user menggunakan `bg-indigo-600` (INKONSISTENSI WAJIB DIPERBAIKI!)
- Panel kanan info langsung `hidden xl:flex` tanpa fallback untuk tablet — bad UX
- Tidak ada welcome state saat chat kosong
- Input tidak auto-resize

**Solusi baru:**
- **WAJIB:** Bubble pesan USER ganti dari `bg-indigo-600` menjadi `bg-emerald-600` (atau `bg-primary-600`)
- **PERTAHANKAN:** Panel kanan info (desktop xl)
- **PERBAIKI:** Panel kanan HARUS ada fallback untuk tablet — collapse menjadi tombol toggle drawer, bukan langsung hidden
- **Chat input:** Auto-resize textarea, tombol kirim emerald, disabled saat kosong
- **Welcome state:** Tampilkan kartu selamat datang dengan panduan pertanyaan saat chat kosong
- Bubble AI menggunakan `bg-slate-100` (netral)

---

## LAYOUT HALAMAN

```
Container:      UserLayout
Main Content:   flex-1 flex flex-col h-screen
Background:     bg-slate-50

Layout Desktop (xl):
  3-panel layout:
    - Sidebar User (256px fixed left)
    - Chat Panel (flex-1 center)
    - Info Panel (320px fixed right)

Layout Tablet (md-lg):
  2-panel + drawer:
    - Sidebar User (80px icon-only)
    - Chat Panel (flex-1)
    - Info Panel (drawer toggle)

Layout Mobile:
  Single panel:
    - Sidebar (drawer)
    - Chat Panel (full-width)
    - Info Panel (drawer)
```

---

## WIREFRAME TEKSTUAL

```
┌──────────┬────────────────────────────────┬──────────────┐
│ SIDEBAR  │ CHAT PANEL                     │ INFO PANEL   │
│ USER     │ ┌─────────────────────────────┐│ (xl only)    │
│          │ │ CHAT HEADER                 ││              │
│ [active: │ │ "Konsultasi AI" + Info btn  ││ ┌──────────┐ │
│  Konsu]  │ └─────────────────────────────┘│ │ Profile  │ │
│          │ ┌─────────────────────────────┐│ │ AI Card  │ │
│          │ │ MESSAGES AREA (scrollable)  ││ └──────────┘ │
│          │ │                             ││              │
│          │ │ [Welcome State]             ││ ┌──────────┐ │
│          │ │ atau                        ││ │ Suggested│ │
│          │ │ [AI bubble]                 ││ │ Questions│ │
│          │ │ [User bubble]               ││ │ • Q1     │ │
│          │ │ [AI bubble]                 ││ │ • Q2     │ │
│          │ │ [User bubble]               ││ │ • Q3     │ │
│          │ │ [Typing indicator...]       ││ └──────────┘ │
│          │ │                             ││              │
│          │ │                             ││ ┌──────────┐ │
│          │ └─────────────────────────────┘│ │ Tips     │ │
│          │ ┌─────────────────────────────┐│ │ Kesehatan│ │
│          │ │ INPUT AREA (fixed bottom)   ││ └──────────┘ │
│          │ │ [Textarea] [Send Button]    ││              │
│          │ └─────────────────────────────┘│              │
└──────────┴────────────────────────────────┴──────────────┘
```

---

## DETAIL SETIAP SECTION

### Panel: Sidebar User

```
Komponen:       Sidebar User (dari 01_GLOBAL_COMPONENTS.md)
Active menu:    "Konsultasi AI"
```

---

### Panel: Chat Panel (Center)

```
Layout:         flex flex-col h-full
Background:     bg-white
Border:         border-l border-r border-slate-200 (desktop)
Width:          flex-1
Max-width:      max-w-4xl mx-auto (untuk readability)
```

---

### Component: Chat Header

```
Position:       sticky top-0 z-10
Background:     bg-white
Border:         border-b border-slate-200
Padding:        px-6 py-4
Layout:         flex items-center justify-between

Left Content:
  Icon:         Lucide "MessageSquare" w-6 h-6 text-emerald-600
  Heading:      "Konsultasi AI"
                text-lg font-semibold text-slate-900 ml-3 (Plus Jakarta Sans)
  Status:       "● Online"
                text-xs text-emerald-600 ml-2 (dot indicator)

Right Content:
  Info Toggle Button (md & lg only — untuk toggle drawer):
    Display:    hidden xl:hidden md:flex lg:flex
    Variant:    ghost
    Size:       icon
    Icon:       Lucide "Info" w-5 h-5 text-slate-600
    Action:     Toggle info panel drawer

  New Chat Button:
    Variant:    outline
    Size:       sm
    Icon:       Lucide "Plus" (left)
    Text:       "Chat Baru"
    Action:     Clear chat, start new conversation
```

---

### Component: Messages Area

```
Container:
  Padding:      p-6
  Height:       flex-1
  Overflow:     overflow-y-auto
  Background:   bg-slate-50
  Scroll:       smooth-scroll

Scroll Behavior:
  Auto-scroll:  ke bottom saat ada message baru
  Scroll to:    smooth
```

---

### State: Welcome (saat chat kosong)

```
Container:
  Layout:       flex flex-col items-center justify-center h-full
  Padding:      p-8
  Text-align:   text-center

Icon:
  Icon:         Lucide "Bot" w-20 h-20 text-emerald-600 mb-6

Heading:
  Text:         "Selamat Datang di Konsultasi AI"
                text-2xl font-bold text-slate-900 mb-2 (Plus Jakarta Sans)

Description:
  Text:         "Tanyakan apapun seputar kesehatan jantung Anda. AI kami siap membantu 24/7."
                text-base text-slate-600 mb-8 max-w-md mx-auto

Suggested Questions:
  Heading:      "Contoh Pertanyaan:"
                text-sm font-semibold text-slate-700 mb-4

  Button Grid:
    Layout:     grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl

    Question Button (struktur):
      Komponen:   Button variant=outline size=sm
      Padding:    px-4 py-3 text-left
      Layout:     flex items-start gap-3
      Icon:       Lucide "MessageCircle" w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5
      Text:       (question text) text-sm text-slate-700
      Hover:      border-emerald-300 bg-emerald-50
      Action:     Fill textarea dengan question dan submit

    Questions:
      1. "Apa saja gejala penyakit jantung yang harus saya waspadai?"
      2. "Bagaimana cara menurunkan kolesterol secara alami?"
      3. "Makanan apa yang baik untuk kesehatan jantung?"
      4. "Berapa kali saya harus berolahraga dalam seminggu?"
      5. "Apa yang harus saya lakukan jika hasil prediksi saya Risiko Tinggi?"
      6. "Bagaimana cara mengukur tekanan darah dengan benar?"
```

---

### Component: Message Bubble — AI

```
Container:
  Layout:       flex items-start gap-3 mb-4

Avatar:
  Size:         w-8 h-8 flex-shrink-0
  Background:   bg-emerald-600 rounded-full
  Icon:         Lucide "Bot" w-4 h-4 text-white

Message:
  Background:   bg-slate-100
  Text:         text-slate-900
  Padding:      px-4 py-3
  Radius:       rounded-2xl rounded-tl-sm
  Max-width:    max-w-2xl
  Font:         text-sm leading-relaxed
  Shadow:       shadow-sm

  Formatting:
    Paragraphs: mb-3 (jika multi-paragraph)
    Lists:      ul/ol dengan proper spacing
    Bold:       font-semibold (untuk emphasis)

Timestamp:
  Text:         "10:30"
                text-xs text-slate-400 mt-1 ml-11 (aligned with message)
```

---

### Component: Message Bubble — User

```
Container:
  Layout:       flex items-start gap-3 mb-4 flex-row-reverse (reversed)

Avatar:
  Size:         w-8 h-8 flex-shrink-0
  Background:   bg-emerald-100 rounded-full
  Text:         text-emerald-700 text-sm font-semibold
                (inisial user)

Message:
  Background:   bg-emerald-600    ← WAJIB EMERALD, BUKAN INDIGO!
  Text:         text-white
  Padding:      px-4 py-3
  Radius:       rounded-2xl rounded-tr-sm
  Max-width:    max-w-2xl
  Font:         text-sm leading-relaxed
  Shadow:       shadow-sm

Timestamp:
  Text:         "10:31"
                text-xs text-slate-400 mt-1 mr-11 text-right
```

---

### Component: Typing Indicator

```
Container:
  (sama dengan AI bubble container)
  Layout:       flex items-start gap-3 mb-4

Avatar:
  (sama dengan AI avatar)

Bubble:
  Background:   bg-slate-100
  Padding:      px-4 py-3
  Radius:       rounded-2xl rounded-tl-sm

  Dots:
    Layout:     flex gap-1
    Dot:        w-2 h-2 bg-slate-400 rounded-full
                animate-pulse (staggered animation)

  Animation:
    Dot 1:      animation-delay: 0ms
    Dot 2:      animation-delay: 150ms
    Dot 3:      animation-delay: 300ms
```

---

### Component: Input Area

```
Position:       sticky bottom-0
Background:     bg-white
Border:         border-t border-slate-200
Padding:        p-4
Shadow:         shadow-lg (subtle)

Container:
  Layout:       flex items-end gap-3
  Max-width:    max-w-4xl mx-auto w-full

Textarea:
  Komponen:     Textarea (dari 01_GLOBAL_COMPONENTS.md)
  Placeholder:  "Ketik pertanyaan Anda..."
  Rows:         1 (min)
  Max-rows:     6
  Auto-resize:  true
  Resize:       resize-none
  Border:       border border-slate-200 rounded-xl
  Padding:      px-4 py-3
  Font:         text-sm
  Focus:        border-emerald-600 ring-4 ring-emerald-600/10

  Disabled:     (saat AI typing)
                bg-slate-50 cursor-not-allowed

Send Button:
  Komponen:     Button (dari 01_GLOBAL_COMPONENTS.md)
  Variant:      primary (bg-emerald-600)    ← WAJIB EMERALD
  Size:         icon-only (md)
  Icon:         Lucide "Send" w-5 h-5
  Padding:      p-3
  Radius:       rounded-xl
  Disabled:     (jika textarea kosong atau AI typing)
                bg-slate-200 text-slate-400 cursor-not-allowed

  Active State:
    Enabled:    bg-emerald-600 hover:bg-emerald-700
    Disabled:   bg-slate-200 cursor-not-allowed

Keyboard Shortcut:
  Enter:        Submit (jika tidak Shift+Enter)
  Shift+Enter:  New line
```

---

### Panel: Info Panel (Right Side)

```
Display:        hidden xl:block (desktop xl)
Position:       fixed right-0 top-0 h-screen
Width:          w-80 (320px)
Background:     bg-white
Border:         border-l border-slate-200
Padding:        p-6
Overflow:       overflow-y-auto
Z-index:        z-10

Mobile/Tablet Drawer:
  Display:      (saat button Info di header diklik)
  Position:     fixed right-0 top-0 h-screen
  Width:        w-80
  Background:   bg-white
  Shadow:       shadow-2xl
  Transform:    translate-x-0 (open) / translate-x-full (closed)
  Transition:   transition-transform duration-300

  Overlay:
    Background: bg-black/30 backdrop-blur-sm
    Position:   fixed inset-0 z-20
    Click:      Close drawer

  Close Button:
    Position:   absolute top-4 right-4
    Icon:       Lucide "X" w-5 h-5
    Padding:    p-2 rounded-lg hover:bg-slate-100
```

---

### Component: AI Profile Card (dalam Info Panel)

```
Card:
  Background:   bg-gradient-to-br from-emerald-500 to-emerald-600
  Radius:       rounded-2xl
  Padding:      p-6
  Margin:       mb-6
  Text:         text-white
  Shadow:       shadow-md

Icon:
  Icon:         Lucide "Bot" w-12 h-12 text-emerald-100 mb-3

Name:
  Text:         "HeartPredict AI"
                text-xl font-bold mb-2 (Plus Jakarta Sans)

Description:
  Text:         "Asisten kesehatan jantung berbasis AI yang siap membantu Anda 24/7"
                text-sm text-emerald-50

Status:
  Layout:       flex items-center gap-2 mt-4
  Dot:          w-2 h-2 bg-emerald-200 rounded-full animate-pulse
  Text:         "Online & Siap Membantu"
                text-xs text-emerald-100
```

---

### Component: Suggested Questions (dalam Info Panel)

```
Section:
  Heading:      "Pertanyaan Populer"
                text-sm font-semibold text-slate-900 mb-4

List:
  Layout:       flex flex-col gap-2

  Item (struktur):
    Layout:     flex items-start gap-2 p-3 rounded-lg
                bg-slate-50 hover:bg-emerald-50 cursor-pointer
                border border-transparent hover:border-emerald-200
                transition-all duration-150

    Icon:       Lucide "MessageCircle" w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5
    Text:       text-sm text-slate-700
                line-clamp-2

    Action:     Fill textarea dengan question dan auto-focus

  Questions:
    (sama dengan welcome state questions — random 5 questions)
```

---

### Component: Tips Card (dalam Info Panel)

```
Section:
  Heading:      "Tips Kesehatan"
                text-sm font-semibold text-slate-900 mb-4 mt-6

Card:
  Background:   bg-blue-50
  Border:       border border-blue-100
  Radius:       rounded-xl
  Padding:      p-4

  Icon:         Lucide "Lightbulb" w-5 h-5 text-blue-600 mb-2

  Title:        "Jaga Hidrasi"
                text-sm font-semibold text-slate-900 mb-1

  Description:  "Minum air putih minimal 8 gelas sehari untuk menjaga kesehatan jantung"
                text-xs text-slate-600 leading-relaxed

(Tips bisa random atau daily tip)
```

---

## KOMPONEN YANG DIPAKAI

Dari `01_GLOBAL_COMPONENTS.md`:
1. **Sidebar User** → active: Konsultasi AI
2. **Button** → primary (EMERALD!), outline, ghost, icon-only
3. **Textarea** → auto-resize input
4. **Card** → untuk info panel components

Komponen custom:
- Message bubbles (AI & User)
- Typing indicator
- Welcome state
- 3-panel layout
- Info panel drawer (responsive)

---

## RESPONSIVE

### Mobile (<768px)

```
Sidebar:        Drawer (hidden default)
Chat Panel:     Full-width
Info Panel:     Drawer (toggle dari header button)
Input:          Full-width, button di kanan
Messages:       max-w-full (tidak max-w-2xl)
```

### Tablet (768-1024px)

```
Sidebar:        Icon-only (w-20)
Chat Panel:     flex-1
Info Panel:     Drawer (toggle button visible di header)
```

### Desktop XL (>1280px)

```
Sidebar:        Full w-64
Chat Panel:     flex-1 center max-w-4xl
Info Panel:     Fixed right w-80 (always visible)
Info toggle:    hidden
```

---

## ANIMASI

```
Message Enter:
  New message:    slide-up + fade-in — 300ms ease-out
  Scroll:         smooth-scroll to bottom — 200ms

Typing Indicator:
  Dots:           scale(1 → 1.2 → 1) — 600ms infinite staggered

Input Focus:
  Border:         border-emerald-600
  Ring:           ring-4 ring-emerald-600/10
  Duration:       150ms

Send Button:
  Hover:          bg-emerald-700 + scale(1.05) — 150ms
  Active:         scale(0.95) — 100ms
  Disabled:       opacity-50 (no animation)

Info Panel Drawer:
  Open:           translate-x-0 from translate-x-full — 300ms ease-out
  Close:          translate-x-full — 250ms ease-in
  Overlay:        fade-in/out — 200ms

Suggested Question Click:
  Fill textarea:  smooth type effect (optional)
  Focus:          auto-focus textarea
```

---

## CHAT FUNCTIONALITY

### Send Message Flow

```
1. User types message
2. Press Enter atau klik Send button
3. User message muncul di chat (bg-emerald-600)
4. Textarea cleared & disabled
5. Typing indicator muncul
6. API call POST /api/chat
7. AI response stream atau complete
8. AI message muncul di chat (bg-slate-100)
9. Textarea enabled kembali
10. Auto-scroll to bottom
```

### API Integration

```typescript
POST /api/chat

Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Body:
{
  "message": "Apa saja gejala penyakit jantung?",
  "conversation_id": "uuid-xxx" // atau null untuk new chat
}

Response:
{
  "success": true,
  "data": {
    "conversation_id": "uuid-xxx",
    "message": {
      "id": 123,
      "role": "assistant",
      "content": "Gejala penyakit jantung yang umum meliputi...",
      "created_at": "2026-04-18T10:30:00Z"
    }
  }
}

Alternative: Streaming Response (SSE)
Event stream dengan chunk-by-chunk AI response
```

---

## ERROR HANDLING

### Network Error

```
Error Message (in chat):
  Layout:       flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg
                mx-11 mb-4
  Icon:         Lucide "AlertCircle" w-4 h-4 text-red-600
  Text:         "Gagal mengirim pesan. Coba lagi."
                text-sm text-red-700
  Retry Button: "Kirim Ulang" text-xs text-red-600 hover:underline
```

---

**Chat consultation adalah fitur interaktif utama. Warna bubble USER WAJIB emerald (bukan indigo). UX harus smooth dengan typing indicator, auto-scroll, dan responsive layout yang baik. Info panel harus accessible di tablet dengan drawer.**
