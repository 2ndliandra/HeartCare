## 📋 MISI UTAMA

Kamu adalah **Senior Frontend Engineer** yang bertugas melakukan refactor
menyeluruh aplikasi HeartPredict. Kamu memiliki dua sumber referensi utama:

1. **Kode lama** — ada di direktori `src/` (jangan dihapus dulu, jadikan referensi logika)
2. **Desain baru** — ada di direktori `docs/` (16 file .md + default_shadcn_theme.css dari Figma AI)

**Tugasmu:** Implementasikan desain baru dari folder `docs/` ke dalam kode React
yang bersih, konsisten, dan fully typed dengan TypeScript.

---

## 📂 LANGKAH 0 — BACA DULU SEBELUM MENULIS KODE

Sebelum menyentuh satu baris kode pun, baca file-file ini secara berurutan:

```
1. docs/00_DESIGN_TOKENS.md          ← Semua token warna, font, spacing
2. docs/01_GLOBAL_COMPONENTS.md      ← Spesifikasi semua komponen reusable
3. docs/default_shadcn_theme.css     ← CSS variables shadcn yang akan dipakai
4. docs/02_PAGE_landing.md           ← Baca satu halaman dulu sebagai orientasi
```

Setelah membaca keempat file itu, baru lanjut ke langkah berikutnya.

---

## 🏗️ LANGKAH 1 — SETUP FONDASI PROYEK

### 1A. Terapkan CSS Variables dari Figma

Buka file `src/index.css` (atau `src/globals.css`), ganti isinya dengan:

```css
/* Import dari docs/default_shadcn_theme.css */
/* Salin seluruh isi file docs/default_shadcn_theme.css ke sini */
/* Tambahkan font import di atasnya: */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* [salin isi default_shadcn_theme.css di sini] */
}
```

### 1B. Update `tailwind.config.ts`

Sesuaikan dengan token dari `docs/00_DESIGN_TOKENS.md`:
- Tambahkan semua custom color dari token
- Tambahkan `fontFamily` untuk Plus Jakarta Sans dan Inter
- Tambahkan custom `borderRadius`, `boxShadow` sesuai token
- Pastikan `content` path sudah benar

### 1C. Install Dependencies yang Dibutuhkan

Cek apakah library berikut sudah ada, install jika belum:
```bash
# shadcn/ui (jika belum di-setup)
npx shadcn@latest init

# Dependencies yang kemungkinan dibutuhkan
npm install framer-motion
npm install lucide-react
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query
npm install axios
npm install recharts         # untuk chart di dashboard
npm install clsx tailwind-merge   # untuk cn() utility
```

---

## 🏛️ LANGKAH 2 — BUAT STRUKTUR FOLDER BARU

Buat struktur folder berikut di dalam `src/`:

```
src/
├── components/
│   ├── ui/                    ← Komponen atom (dari shadcn + custom)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx          (dialog.tsx dari shadcn)
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── empty-state.tsx
│   │
│   ├── layout/                ← Layout wrappers
│   │   ├── PublicLayout.tsx   ← Untuk halaman /, /login, /register, dll
│   │   ├── UserLayout.tsx     ← Untuk semua /user/* (sidebar + navbar)
│   │   ├── AdminLayout.tsx    ← Untuk semua /admin/* (sidebar admin + navbar)
│   │   ├── Navbar.tsx
│   │   ├── UserSidebar.tsx
│   │   └── AdminSidebar.tsx
│   │
│   └── shared/                ← Komponen shared antar halaman
│       ├── RiskBadge.tsx      ← Badge risiko (Rendah/Sedang/Tinggi)
│       ├── StatCard.tsx       ← Kartu statistik dashboard
│       ├── ArticleCard.tsx    ← Kartu artikel
│       └── PageHeader.tsx     ← Header section halaman
│
├── pages/                     ← Salin struktur dari kode lama
│   ├── public/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── user/
│   │   ├── DashboardPage.tsx
│   │   ├── HealthCheckPage.tsx
│   │   ├── PredictionResultPage.tsx
│   │   ├── ConsultationPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── ProfilePage.tsx
│   └── admin/
│       ├── DashboardPage.tsx
│       ├── UsersPage.tsx
│       ├── ArticlesPage.tsx
│       └── DatasetsPage.tsx
│
├── hooks/                     ← Custom React hooks
│   ├── useAuth.ts
│   ├── useToast.ts
│   └── useMediaQuery.ts
│
├── services/                  ← Axios API calls
│   ├── api.ts                 ← Axios instance + interceptors
│   ├── auth.service.ts
│   ├── prediction.service.ts
│   ├── article.service.ts
│   └── chat.service.ts
│
├── types/                     ← TypeScript interfaces
│   ├── auth.types.ts
│   ├── prediction.types.ts
│   ├── article.types.ts
│   └── chat.types.ts
│
└── lib/
    └── utils.ts               ← cn() utility dan helper
```

---

## 🧩 LANGKAH 3 — IMPLEMENTASI KOMPONEN GLOBAL

**Baca `docs/01_GLOBAL_COMPONENTS.md` terlebih dahulu.**

Implementasikan setiap komponen secara berurutan:

### Urutan pengerjaan komponen:

```
1. src/lib/utils.ts             ← cn() utility (WAJIB PERTAMA)
2. src/components/ui/button.tsx
3. src/components/ui/input.tsx
4. src/components/ui/card.tsx
5. src/components/ui/badge.tsx
6. src/components/ui/skeleton.tsx
7. src/components/ui/empty-state.tsx
8. src/components/ui/modal.tsx
9. src/components/ui/toast.tsx
10. src/components/layout/Navbar.tsx
11. src/components/layout/UserSidebar.tsx
12. src/components/layout/AdminSidebar.tsx
13. src/components/layout/UserLayout.tsx
14. src/components/layout/AdminLayout.tsx
15. src/components/layout/PublicLayout.tsx
16. src/components/shared/RiskBadge.tsx
17. src/components/shared/StatCard.tsx
18. src/components/shared/ArticleCard.tsx
```

### Aturan setiap komponen:

```typescript
// Setiap komponen UI WAJIB mengikuti pola ini:

// 1. Gunakan cn() untuk class merging
// 2. Definisikan variants dengan cva() atau object map
// 3. Gunakan forwardRef untuk semua form element
// 4. Export type Props-nya
// 5. Gunakan CSS variables dari default_shadcn_theme.css
//    bukan hardcode warna Tailwind langsung

// Contoh pola button:
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center ...",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground ...",
        // ...
      },
      size: { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6" }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
)
```

---

## 📄 LANGKAH 4 — IMPLEMENTASI HALAMAN

**Untuk setiap halaman, baca file .md-nya dulu dari folder docs/ sebelum menulis kode.**

### Urutan pengerjaan halaman:

```
Prioritas 1 (kerjakan duluan):
  1. docs/03_PAGE_login.md        → src/pages/public/LoginPage.tsx
  2. docs/06_PAGE_user_dashboard.md → src/pages/user/DashboardPage.tsx
  3. docs/09_PAGE_consultation.md → src/pages/user/ConsultationPage.tsx

Prioritas 2:
  4. docs/02_PAGE_landing.md      → src/pages/public/LandingPage.tsx
  5. docs/07_PAGE_health_check.md → src/pages/user/HealthCheckPage.tsx
  6. docs/08_PAGE_prediction_result.md → src/pages/user/PredictionResultPage.tsx

Prioritas 3:
  7. docs/04_PAGE_register.md     → src/pages/public/RegisterPage.tsx
  8. docs/05_PAGE_forgot_password.md → src/pages/public/ForgotPasswordPage.tsx
  9. docs/10_PAGE_history.md      → src/pages/user/HistoryPage.tsx
  10. docs/11_PAGE_profile.md     → src/pages/user/ProfilePage.tsx

Prioritas 4 (Admin):
  11. docs/12_PAGE_admin_dashboard.md → src/pages/admin/DashboardPage.tsx
  12. docs/13_PAGE_admin_users.md     → src/pages/admin/UsersPage.tsx
  13. docs/14_PAGE_admin_articles.md  → src/pages/admin/ArticlesPage.tsx
  14. docs/15_PAGE_admin_datasets.md  → src/pages/admin/DatasetsPage.tsx
```

### Aturan setiap halaman:

```
1. BACA file .md-nya dulu dari docs/
2. WRAP dengan layout yang sesuai:
   - PublicLayout  → halaman /, /login, /register, /forgot-password
   - UserLayout    → semua /user/*
   - AdminLayout   → semua /admin/*
3. GUNAKAN komponen dari src/components/ — jangan buat inline
4. IMPLEMENTASIKAN semua state: loading, empty, error
5. IMPLEMENTASIKAN responsive sesuai spesifikasi di file .md
6. SAMBUNGKAN ke API sesuai endpoint yang ada di kode lama
   (jangan ubah logika API, hanya ubah tampilannya)
7. PERTAHANKAN semua logika auth dan routing dari kode lama
```

---

## 🚨 ATURAN KRITIS — WAJIB DIPATUHI

### Yang HARUS dilakukan:
```
✅ Baca file .md dari docs/ sebelum mengerjakan setiap bagian
✅ Gunakan CSS variables (--primary, --background, dll) bukan hardcode hex
✅ Gunakan komponen dari src/components/ui/ — tidak boleh buat button baru
   di dalam file halaman
✅ Semua props harus typed dengan TypeScript interface
✅ Sidebar User dan Sidebar Admin HARUS komponen terpisah yang di-import,
   bukan ditulis ulang di setiap halaman
✅ Warna bubble chat User HARUS bg-primary (Emerald), bukan bg-indigo-*
✅ Setiap halaman loading state HARUS pakai Skeleton, bukan spinner saja
✅ cn() HARUS dipakai untuk semua conditional className
```

### Yang DILARANG:
```
❌ Hardcode warna hex langsung di JSX (gunakan token/CSS var)
❌ Tulis ulang komponen Button/Input/Card di dalam file halaman
❌ Copy-paste struktur Sidebar ke setiap halaman
❌ Gunakan bg-indigo-* sebagai warna brand/action utama
❌ Buat halaman tanpa wrapping Layout component
❌ Skip implementasi responsive (mobile harus berfungsi)
❌ Ubah logika API/auth dari kode lama tanpa alasan
❌ Buat komponen tanpa TypeScript types
```

---

## 🔄 CARA KERJA PER SESI

Karena refactor ini besar, kerjakan per bagian. Setiap sesi ikuti pola:

```
SESI 1: Setup + Komponen UI dasar (Langkah 1 + 2 + awal Langkah 3)
SESI 2: Layout components (Navbar, Sidebar, Layout wrappers)
SESI 3: Halaman Prioritas 1 (Login, User Dashboard, Chat)
SESI 4: Halaman Prioritas 2 (Landing, Health Check, Result)
SESI 5: Halaman Prioritas 3 (Register, Forgot, History, Profile)
SESI 6: Halaman Admin (Dashboard, Users, Articles, Datasets)
SESI 7: Polish (animasi, responsive check, empty states)
```

Setelah setiap sesi, lakukan:
```bash
# Pastikan tidak ada TypeScript error
npx tsc --noEmit

# Pastikan build berhasil
npm run build
```

---

## 🚀 MULAI SEKARANG

```
Langkah pertama yang harus dikerjakan SEKARANG:

1. Baca docs/00_DESIGN_TOKENS.md
2. Baca docs/01_GLOBAL_COMPONENTS.md
3. Baca docs/default_shadcn_theme.css
4. Terapkan CSS variables ke src/index.css
5. Update tailwind.config.ts
6. Buat src/lib/utils.ts dengan fungsi cn()
7. Mulai buat src/components/ui/button.tsx

Setelah button selesai dan verified, lanjut ke komponen berikutnya.
Jangan loncat-loncat — kerjakan berurutan.
```