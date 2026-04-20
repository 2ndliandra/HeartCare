# Admin Articles Page Documentation# 14 — Admin: Manajemen Artikel

**Route:** `/admin/articles`  
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
│ SIDEBAR  │ HEADER: "Manajemen Artikel" + Add Article Button│
│ ADMIN    ├─────────────────────────────────────────────────┤
│          │ FILTERS: [Search] [Category] [Status] [Date]    │
│ [active: ├─────────────────────────────────────────────────┤
│  Article]│ ┌─────────────────────────────────────────────┐ │
│          │ │ DATA TABLE                                  │ │
│          │ │ Thumbnail | Title | Category | Status | Aksi│ │
│          │ │ ───────────────────────────────────────────  │ │
│          │ │ [img] | 10 Makanan... | Nutrisi | Publish   │ │
│          │ │ [img] | Cara Olahraga | Olahraga | Draft    │ │
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
  Heading:      "Manajemen Artikel"
                text-3xl font-bold text-slate-900
  Count:        "89 Total Artikel"
                text-sm text-slate-600

Right:
  Button:       "Tulis Artikel Baru"
                variant=primary, size=md
                Icon: Lucide "Plus" (left)
                Route: /admin/articles/create
```

---

### Component: Filters

```
Grid:           grid-cols-1 md:grid-cols-4 gap-4

Search:         "Cari judul artikel..."
Category:       Select (Semua | Nutrisi | Olahraga | Pencegahan | dll)
Status:         Select (Semua | Published | Draft | Archived)
Date:           Date range "Tanggal Publish"
```

---

### Component: Articles Table

```
Columns:
  1. Thumbnail (Image 60x60 rounded-lg)
  2. Judul (max 2 lines, line-clamp-2)
  3. Kategori (Badge)
  4. Penulis
  5. Status (Badge: Published/Draft/Archived)
  6. Tanggal (sortable)
  7. Views
  8. Aksi

Row Actions:
  View:         Icon "Eye" → preview article
  Edit:         Icon "Edit" → /admin/articles/edit/:id
  Delete:       Icon "Trash2" text-red-600
  Publish/Unpublish: Icon "Send" / "Archive"
```

---

### Modal: Delete Confirmation

```
Heading:        "Hapus Artikel?"
Body:           "Artikel '[Title]' akan dihapus permanen."
Footer:
  Cancel:       outline
  Delete:       danger, "Ya, Hapus"
```

---

### Page: Create/Edit Article

```
Layout:         max-w-4xl mx-auto

Sections:
  1. Judul (Input, required)
  2. Slug (Auto-generated dari judul, editable)
  3. Kategori (Select, required)
  4. Thumbnail (Image upload with preview)
  5. Konten (Rich text editor — Quill/TinyMCE/Tiptap)
  6. Excerpt (Textarea, max 200 chars)
  7. Status (Select: Draft/Published)
  8. Meta Keywords (Tags input)

Footer:
  Save Draft:   variant=outline
  Publish:      variant=primary
```

---

## KOMPONEN YANG DIPAKAI

1. **Sidebar Admin** → active: Manajemen Artikel
2. **Data Table** → articles list
3. **Button**
4. **Badge** → category, status
5. **Modal** → delete confirmation
6. **Image Upload**
7. **Rich Text Editor** (external library)

---

**Articles management dengan WYSIWYG editor. Preview sebelum publish. Image upload untuk thumbnail. SEO-friendly dengan slug dan meta.**
