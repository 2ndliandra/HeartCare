# 00 — Design Tokens
# HeartPredict Redesign 2026
# Dibaca oleh Gemini agent sebelum implementasi apapun

---

## COLORS

### Primary Brand Colors (Emerald Teal)

| Token Name | Hex | Tailwind Class | Digunakan untuk |
|------------|-----|----------------|-----------------|
| `--primary-600` | `#059669` | `emerald-600` | Tombol utama, link aktif, aksen brand, sidebar active item |
| `--primary-700` | `#047857` | `emerald-700` | Hover state tombol primary, link hover |
| `--primary-500` | `#10B981` | `emerald-500` | Lighter accent, border focus secondary |
| `--primary-50` | `#ECFDF5` | `emerald-50` | Background ringan, highlight area, badge brand |
| `--primary-100` | `#D1FAE5` | `emerald-100` | Badge background success/brand, hover light |

### Background Colors (Surface)

| Token Name | Hex | Tailwind Class | Digunakan untuk |
|------------|-----|----------------|-----------------|
| `--bg-base` | `#F8FAFC` | `slate-50` | Background seluruh halaman, body background |
| `--bg-card` | `#FFFFFF` | `white` | Background kartu & panel, modal, navbar |
| `--bg-sidebar` | `#0F172A` | `slate-900` | Sidebar gelap (user & admin) |
| `--bg-navbar` | `#FFFFFF` | `white` | Navbar putih dengan border bawah |
| `--bg-input` | `#FFFFFF` | `white` | Background input field default |
| `--bg-muted` | `#F1F5F9` | `slate-100` | Section yang lebih redup, disabled state |

### Text Colors

| Token Name | Hex | Tailwind Class | Digunakan untuk |
|------------|-----|----------------|-----------------|
| `--text-heading` | `#0F172A` | `slate-900` | Judul dan heading (H1-H6) |
| `--text-body` | `#334155` | `slate-700` | Teks paragraf, body text |
| `--text-muted` | `#64748B` | `slate-500` | Label sekunder, caption, helper text |
| `--text-placeholder` | `#94A3B8` | `slate-400` | Placeholder input, disabled text |
| `--text-inverse` | `#FFFFFF` | `white` | Teks di atas background gelap (sidebar, tombol primary) |

### Border Colors

| Token Name | Hex | Tailwind Class | Digunakan untuk |
|------------|-----|----------------|-----------------|
| `--border-default` | `#E2E8F0` | `slate-200` | Border kartu, input, table, divider |
| `--border-focus` | `#059669` | `emerald-600` | Focus ring input, active border |

### Status Colors (Severity)

| Status Level | Background | Background Hex | Text Color | Text Hex | Dot/Icon Color | Dot Hex |
|--------------|------------|----------------|------------|----------|----------------|---------|
| **RENDAH / Success** | `emerald-100` | `#D1FAE5` | `emerald-900` | `#065F46` | `emerald-500` | `#10B981` |
| **SEDANG / Warning** | `amber-100` | `#FEF3C7` | `amber-900` | `#92400E` | `amber-500` | `#F59E0B` |
| **TINGGI / Danger** | `red-100` | `#FEE2E2` | `red-900` | `#991B1B` | `red-500` | `#EF4444` |
| **INFO / Netral** | `blue-100` | `#DBEAFE` | `blue-900` | `#1E40AF` | `blue-500` | `#3B82F6` |

### Additional Accent Colors (untuk stat cards, charts)

| Token Name | Hex | Tailwind Class | Digunakan untuk |
|------------|-----|----------------|-----------------|
| `--accent-purple` | `#9333EA` | `purple-600` | Stat card accent 1 |
| `--accent-amber` | `#D97706` | `amber-600` | Stat card accent 2 |
| `--accent-blue` | `#2563EB` | `blue-600` | Stat card accent 3 |

---

## TYPOGRAPHY

### Font Families

| Type | Font Family | Import Source | Digunakan untuk |
|------|-------------|---------------|-----------------|
| **Display/Heading** | `"Plus Jakarta Sans"` | `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap` | Heading besar (H1, H2), hero headline |
| **Body** | `"Inter"` | Sudah ada di proyek | Semua teks umum, paragraf, UI text |

### Typography Scale

| Level | Size | Weight | Line Height | Font Family | Tailwind Classes | Digunakan untuk |
|-------|------|--------|-------------|-------------|------------------|-----------------|
| **Display** | 48px | 800 | 1.1 (53px) | Plus Jakarta Sans | `text-5xl font-extrabold leading-tight` | Hero headline landing page |
| **H1** | 36px | 700 | 1.2 (43px) | Plus Jakarta Sans | `text-4xl font-bold leading-tight` | Judul halaman utama |
| **H2** | 28px | 700 | 1.3 (36px) | Plus Jakarta Sans | `text-3xl font-bold leading-snug` | Judul section |
| **H3** | 22px | 600 | 1.4 (31px) | Plus Jakarta Sans | `text-2xl font-semibold leading-normal` | Judul kartu, sub-section |
| **H4** | 18px | 600 | 1.4 (25px) | Inter | `text-lg font-semibold leading-normal` | Label kelompok |
| **Body-LG** | 16px | 400 | 1.6 (26px) | Inter | `text-base font-normal leading-relaxed` | Paragraf utama |
| **Body** | 14px | 400 | 1.6 (22px) | Inter | `text-sm font-normal leading-relaxed` | Teks umum, default |
| **Body-SM** | 13px | 400 | 1.5 (20px) | Inter | `text-[13px] font-normal leading-normal` | Teks compact |
| **Caption** | 12px | 400 | 1.5 (18px) | Inter | `text-xs font-normal leading-normal` | Timestamp, label kecil |
| **Label** | 13px | 500 | 1.4 (18px) | Inter | `text-[13px] font-medium leading-snug` | Form label |
| **Overline** | 11px | 600 | 1.4 (15px) | Inter | `text-[11px] font-semibold uppercase tracking-wide leading-snug` | Grup menu, kategori |

---

## SPACING

### Spacing Scale

| Name | Value (px) | Tailwind Class | Konteks Penggunaan |
|------|------------|----------------|--------------------|
| **xs** | 4px | `1` | Gap kecil antar elemen inline, padding badge |
| **sm** | 8px | `2` | Gap antar ikon dan teks, padding kecil |
| **md** | 12px | `3` | Padding input vertical, gap dalam button |
| **base** | 16px | `4` | Padding kartu kecil, gap default |
| **lg** | 20px | `5` | Padding kartu medium |
| **xl** | 24px | `6` | Padding kartu besar, gap grid cards |
| **2xl** | 32px | `8` | Padding section, margin antar section |
| **3xl** | 40px | `10` | Padding halaman, container padding |
| **4xl** | 48px | `12` | Padding hero section |
| **5xl** | 64px | `16` | Margin besar antar section landing page |

### Common Layout Spacing

| Context | Tailwind Class | Value |
|---------|----------------|-------|
| Padding halaman (desktop) | `px-8 py-6` | 32px horizontal, 24px vertical |
| Padding halaman (mobile) | `px-4 py-4` | 16px horizontal, 16px vertical |
| Padding kartu | `p-6` | 24px |
| Padding kartu kecil | `p-4` | 16px |
| Gap grid cards | `gap-6` | 24px |
| Margin antar section | `mb-8` | 32px |
| Padding dalam input | `px-4 py-3` | 16px horizontal, 12px vertical |
| Padding button medium | `px-5 py-2.5` | 20px horizontal, 10px vertical |

---

## BORDER RADIUS

| Name | Value (px) | Tailwind Class | Digunakan untuk |
|------|------------|----------------|-----------------|
| **sm** | 6px | `rounded-md` | Badge kecil, tag |
| **base** | 8px | `rounded-lg` | Input field, select dropdown |
| **md** | 10px | `rounded-lg` | Tombol kecil, checkbox custom |
| **lg** | 12px | `rounded-xl` | Tombol (default), modal |
| **xl** | 16px | `rounded-2xl` | Kartu/panel, container |
| **full** | 9999px | `rounded-full` | Badge pill, avatar, dot indicator |
| **decorative-bl** | varies | `rounded-bl-full` | Elemen dekorasi kiri bawah |
| **decorative-tr** | varies | `rounded-tr-full` | Elemen dekorasi kanan atas |

---

## SHADOWS

| Name | CSS Value | Tailwind Class | Digunakan untuk |
|------|-----------|----------------|-----------------|
| **xs** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `shadow-xs` | Border subtle, separator |
| **sm** | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | `shadow-sm` | Kartu ringan, input focus |
| **base** | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | `shadow` | Kartu default |
| **md** | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | `shadow-md` | Kartu hover, dropdown |
| **lg** | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | `shadow-lg` | Modal, drawer, popup |
| **xl** | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `shadow-xl` | Modal besar, overlay panel |

### Shadow Usage Context

| Element | Default Shadow | Hover Shadow |
|---------|----------------|--------------|
| Card article (landing) | `shadow` | `shadow-lg` |
| Card stat (dashboard) | `shadow-sm` | `shadow-md` |
| Modal | `shadow-xl` | N/A |
| Dropdown menu | `shadow-md` | N/A |
| Button | `shadow-sm` | `shadow-md` |
| Input focus | `shadow-sm` | N/A |

---

## STATUS COLORS (Detail Lengkap)

### Risiko RENDAH / Success

```
Background:     bg-emerald-100    (#D1FAE5)
Text:           text-emerald-900  (#065F46)
Border:         border-emerald-200 (#A7F3D0)
Dot/Icon:       text-emerald-500  (#10B981)
```

**Digunakan untuk:** Badge "Risiko Rendah", status success, konfirmasi positif

### Risiko SEDANG / Warning

```
Background:     bg-amber-100      (#FEF3C7)
Text:           text-amber-900    (#92400E)
Border:         border-amber-200  (#FDE68A)
Dot/Icon:       text-amber-500    (#F59E0B)
```

**Digunakan untuk:** Badge "Risiko Sedang", peringatan, perlu perhatian

### Risiko TINGGI / Danger

```
Background:     bg-red-100        (#FEE2E2)
Text:           text-red-900      (#991B1B)
Border:         border-red-200    (#FECACA)
Dot/Icon:       text-red-500      (#EF4444)
```

**Digunakan untuk:** Badge "Risiko Tinggi", error, danger action

### INFO / Netral

```
Background:     bg-blue-100       (#DBEAFE)
Text:           text-blue-900     (#1E40AF)
Border:         border-blue-200   (#BFDBFE)
Dot/Icon:       text-blue-500     (#3B82F6)
```

**Digunakan untuk:** Info notification, status netral, tips

---

## BREAKPOINTS

| Device | Range | Tailwind Prefix | Container Max Width | Sidebar Behavior |
|--------|-------|-----------------|---------------------|------------------|
| **Mobile** | < 768px | `default (no prefix)` | Full width (`w-full px-4`) | Hidden (drawer toggle) |
| **Tablet** | 768px – 1024px | `md:` | 720px (`max-w-screen-md`) | Icon-only sidebar (64px) atau collapsible |
| **Desktop** | > 1024px | `lg:` dan `xl:` | 1280px (`max-w-7xl`) | Full sidebar (256px) |

### Responsive Grid Columns

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Stat cards | 1 column | 2 columns | 4 columns |
| Article grid | 1 column | 2 columns | 3 columns |
| Form layout | 1 column | 1 column | 2 columns (bila sesuai) |
| Data table | Scroll horizontal | Scroll horizontal | Full visible |

---

## Z-INDEX SCALE

| Layer | Z-Index | Digunakan untuk |
|-------|---------|-----------------|
| **base** | 0 | Default content |
| **dropdown** | 10 | Dropdown menu, select options |
| **sticky** | 20 | Sticky header, navbar |
| **sidebar** | 30 | Sidebar fixed/sticky |
| **modal-backdrop** | 40 | Modal overlay background |
| **modal** | 50 | Modal content |
| **toast** | 60 | Toast notification |
| **tooltip** | 70 | Tooltip |

---

## ANIMATION DURATIONS

| Name | Value (ms) | Tailwind Class | Digunakan untuk |
|------|------------|----------------|-----------------|
| **fast** | 150ms | `duration-150` | Hover state, button press |
| **base** | 200ms | `duration-200` | Default transition |
| **moderate** | 300ms | `duration-300` | Modal fade, drawer slide |
| **slow** | 500ms | `duration-500` | Page transition, chart animation |

---

## ICON SIZES

| Name | Size (px) | Tailwind Class | Digunakan untuk |
|------|-----------|----------------|-----------------|
| **xs** | 12px | `w-3 h-3` | Inline icon, badge icon |
| **sm** | 16px | `w-4 h-4` | Icon dalam teks, label |
| **base** | 20px | `w-5 h-5` | Icon button, menu icon |
| **md** | 24px | `w-6 h-6` | Icon besar, stat card icon |
| **lg** | 32px | `w-8 h-8` | Feature icon, empty state icon |
| **xl** | 48px | `w-12 h-12` | Hero icon, illustration |

---

## CATATAN PENTING

### ⛔ DILARANG KERAS

1. **Warna INDIGO** (`#4F46E5`, `indigo-600`, dsb.) **DILARANG** digunakan sebagai warna brand atau action button. Ini inkonsistensi desain lama yang harus dihapus total.
2. Ganti semua penggunaan indigo dengan **PRIMARY EMERALD** (`#059669` / `emerald-600`)

### ✅ WAJIB DITERAPKAN

1. Semua warna harus merujuk ke token di atas — tidak ada warna hardcode
2. Semua komponen harus konsisten menggunakan spacing scale di atas
3. Font heading HARUS Plus Jakarta Sans, font body HARUS Inter
4. Status severity color HARUS konsisten di seluruh aplikasi
5. Responsive breakpoint HARUS diikuti untuk setiap halaman

---

**File ini adalah sumber kebenaran (single source of truth) untuk semua keputusan desain.**
**Semua file berikutnya (01–15) HARUS merujuk ke token yang didefinisikan di sini.**
