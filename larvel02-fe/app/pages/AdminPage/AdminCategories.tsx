import * as React from "react"
import {
  AlertTriangle,
  Edit,
  FolderTree,
  Hash,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react"

import api from "~/lib/api"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { EmptyState } from "~/components/ui/empty-state"
import { HelperText, Input, Label } from "~/components/ui/input"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "~/components/ui/modal"
import { Separator } from "~/components/ui/separator"
import type { Category } from "~/types/shared"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category: Category | null
}

interface CategoryFormData {
  name: string
}

const defaultCategoryFormData: CategoryFormData = {
  name: "",
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

function buildCategoryFormData(category: Category | null): CategoryFormData {
  if (!category) {
    return defaultCategoryFormData
  }

  return {
    name: category.name || "",
  }
}

type CategoryModalPanelProps = Omit<CategoryModalProps, "isOpen">

function CategoryModalPanel({
  onClose,
  onSuccess,
  category,
}: CategoryModalPanelProps) {
  const [formData, setFormData] = React.useState<CategoryFormData>(() =>
    buildCategoryFormData(category)
  )
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()

    if (!formData.name.trim()) {
      setError("Nama kategori wajib diisi.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (category) {
        await api.put(`/admin/categories/${category.id}`, {
          name: formData.name.trim(),
        })
      } else {
        await api.post("/admin/categories", {
          name: formData.name.trim(),
        })
      }

      onSuccess()
      onClose()
    } catch (submitError: unknown) {
      const apiErrorMessage =
        typeof submitError === "object" &&
        submitError !== null &&
        "response" in submitError
          ? (submitError as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined

      setError(apiErrorMessage || "Gagal menyimpan kategori.")
    } finally {
      setSubmitting(false)
    }
  }

  const slugPreview = slugify(formData.name)

  return (
    <ModalContent
      size="md"
      className="max-w-2xl rounded-[1.75rem] border border-slate-200"
    >
      <ModalHeader className="space-y-2 border-b border-slate-100 bg-slate-50/70">
        <ModalTitle className="text-2xl font-black tracking-tight">
          {category ? "Edit Kategori Artikel" : "Tambah Kategori Baru"}
        </ModalTitle>
        <ModalDescription className="text-sm leading-6 text-slate-500">
          Susun klasifikasi konten edukasi agar artikel lebih mudah
          dikelompokkan dan dicari dari panel admin.
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          {error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label required>Nama kategori</Label>
            <Input
              required
              autoFocus
              value={formData.name}
              iconLeft={<Tag className="h-4 w-4" />}
              placeholder="Contoh: Nutrisi Jantung"
              className="h-12 rounded-2xl"
              onChange={(event) =>
                setFormData({
                  name: event.target.value,
                })
              }
            />
            <HelperText>
              Gunakan nama yang singkat dan jelas agar konsisten di daftar
              artikel publik maupun admin.
            </HelperText>
          </div>

          <Card className="rounded-[1.4rem] border-slate-200/90 bg-slate-50/60 shadow-none">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Hash className="h-4 w-4 text-slate-400" />
                Preview slug
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
                {slugPreview || "slug-akan-muncul-di-sini"}
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Slug membantu penyusunan URL dan identitas kategori secara lebih
                rapi bila backend membutuhkannya.
              </p>
            </CardContent>
          </Card>
        </ModalBody>

        <ModalFooter className="gap-3 border-t border-slate-100 bg-slate-50/70 sm:justify-between sm:space-x-0">
          <p className="text-xs text-slate-500">
            Perubahan kategori akan langsung memengaruhi pilihan kategori di
            form artikel.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {category ? "Update Kategori" : "Simpan Kategori"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      {isOpen ? (
        <CategoryModalPanel
          key={category ? `edit-${category.id}` : "create-category"}
          onClose={onClose}
          onSuccess={onSuccess}
          category={category}
        />
      ) : null}
    </Modal>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(
    null
  )
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchCategories = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get("/categories")
      setCategories(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch (error) {
      console.error("Fetch categories error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [fetchCategories])

  const handleDelete = async (category: Category) => {
    if (
      window.confirm(
        `Hapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      try {
        await api.delete(`/admin/categories/${category.id}`)
        fetchCategories()
      } catch (error) {
        console.error("Delete category error:", error)
        alert("Gagal menghapus kategori.")
      }
    }
  }

  const filteredCategories = React.useMemo(() => {
    const term = searchQuery.trim().toLowerCase()

    return categories
      .filter((category) => category.name.toLowerCase().includes(term))
      .sort((first, second) => first.name.localeCompare(second.name))
  }, [categories, searchQuery])

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              Category control
            </Badge>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Manajemen Kategori Artikel
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Kelola klasifikasi konten edukasi supaya struktur artikel lebih
                mudah dirawat, dicari, dan dipetakan dari panel admin.
              </p>
            </div>
          </div>

          <Button
            className="h-11 rounded-xl"
            onClick={() => {
              setSelectedCategory(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Total kategori
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {categories.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Hasil pencarian
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {filteredCategories.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardHeader className="flex-col items-start gap-4 border-b border-slate-100 px-6 py-5">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-black tracking-tight">
              Direktori Kategori
            </CardTitle>
            <CardDescription>
              Cari, ubah, atau hapus kategori artikel dari satu panel yang
              lebih konsisten dengan sistem komponen admin.
            </CardDescription>
          </div>

          <div className="w-full xl:max-w-xl">
            <Input
              value={searchQuery}
              iconLeft={<Search className="h-4 w-4" />}
              placeholder="Cari kategori..."
              className="h-11 rounded-xl"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-[1.5rem] bg-slate-50"
                />
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid gap-4">
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="rounded-[1.5rem] border-slate-200/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <FolderTree className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-black text-slate-950">
                            {category.name}
                          </h3>
                          <Badge variant="neutral" size="sm">
                            {category.slug || slugify(category.name)}
                          </Badge>
                        </div>
                        <p className="text-sm leading-6 text-slate-500">
                          Kategori ini siap digunakan di form artikel admin dan
                          tampilan daftar artikel publik.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end md:self-auto">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Tag}
              title="Kategori belum ditemukan"
              description="Coba ubah kata kunci pencarian atau tambahkan kategori baru agar pengelompokan artikel lebih rapi."
              actionLabel="Tambah Kategori"
              onAction={() => {
                setSelectedCategory(null)
                setIsModalOpen(true)
              }}
              className="max-w-none"
            />
          )}
        </CardContent>

        {!loading && categories.length > 0 ? (
          <>
            <Separator />
            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {filteredCategories.length === categories.length
                  ? "Semua kategori ditampilkan."
                  : `${filteredCategories.length} dari ${categories.length} kategori sedang ditampilkan.`}
              </p>
              <Badge variant="neutral" size="sm">
                Sinkron dengan editor artikel
              </Badge>
            </div>
          </>
        ) : null}
      </Card>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        category={selectedCategory}
      />
    </div>
  )
}
