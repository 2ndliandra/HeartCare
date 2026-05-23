import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
  Type,
  Upload,
  UserCircle2,
} from "lucide-react"
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import ImageTool from "@editorjs/image"
// @ts-expect-error editorjs embed package has no compatible type export here
import Embed from "@editorjs/embed"

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
  ModalContent,
  ModalDescription,
  ModalTitle,
} from "~/components/ui/modal"
import { Separator } from "~/components/ui/separator"
import type { Article, ArticleStatus, Category } from "~/types/shared"

interface EditorBlock {
  type: string
  data: {
    text?: string
    level?: number
    items?: string[]
    style?: "ordered" | "unordered"
  }
}

interface EditorContentData {
  blocks: EditorBlock[]
}

interface ArticleAuthorOption {
  id?: string
  name?: string
}

interface AdminArticle
  extends Omit<Article, "raw_content" | "author" | "thumbnail" | "status"> {
  raw_content?: string | EditorContentData
  author_id?: string
  author?: ArticleAuthorOption
  thumbnail?: string | null
  status: ArticleStatus
}

interface AdminUserOption {
  id: string
  name: string
}

interface AdminArticlesPagination {
  current_page: number
  last_page: number
  total?: number
}

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  article: AdminArticle | null
}

interface ArticleEditorPanelProps {
  onClose: () => void
  onSuccess: () => void
  article: AdminArticle | null
  surface?: "modal" | "page"
}

interface ArticleFormData {
  title: string
  category_id: string
  thumbnail: string
  status: ArticleStatus
  author_id: string
}

type StatusFilter = "all" | ArticleStatus

type ArticleStats = {
  total: number
  published: number
  draft: number
}

const articleFallbackThumbnail =
  "https://images.unsplash.com/photo-1505751172107-573225a912bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

const defaultArticleFormData: ArticleFormData = {
  title: "",
  category_id: "",
  thumbnail: "",
  status: "published",
  author_id: "",
}

const escapeHtml = (unsafe?: string): string => {
  if (!unsafe) return ""

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const parseEditorData = (
  rawContent?: string | EditorContentData
): EditorContentData | undefined => {
  if (!rawContent) {
    return undefined
  }

  const isValidEditorData = (value: unknown): value is EditorContentData => {
    return (
      typeof value === "object" &&
      value !== null &&
      Array.isArray((value as { blocks?: unknown }).blocks)
    )
  }

  if (typeof rawContent === "string") {
    try {
      const parsed = JSON.parse(rawContent) as unknown
      return isValidEditorData(parsed) ? parsed : undefined
    } catch {
      return {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: rawContent,
            },
          },
        ],
      }
    }
  }

  return isValidEditorData(rawContent) ? rawContent : undefined
}

function buildArticleFormData(article: AdminArticle | null): ArticleFormData {
  if (!article) {
    return defaultArticleFormData
  }

  return {
    title: article.title || "",
    category_id: article.category_data?.id || article.category_id || "",
    thumbnail: article.thumbnail || "",
    status: article.status || "published",
    author_id: article.author?.id || article.author_id || "",
  }
}

function renderArticleHtml(savedData?: EditorContentData) {
  return (
    savedData?.blocks
      .map((block) => {
        if (block.type === "paragraph") {
          return `<p>${escapeHtml(block.data.text)}</p>`
        }

        if (block.type === "header") {
          const safeLevel = Math.min(6, Math.max(1, Number(block.data.level || 2)))
          return `<h${safeLevel}>${escapeHtml(block.data.text)}</h${safeLevel}>`
        }

        if (block.type === "list") {
          const items = (block.data.items || [])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")

          return block.data.style === "ordered" ? `<ol>${items}</ol>` : `<ul>${items}</ul>`
        }

        return ""
      })
      .join("") || ""
  )
}

function ArticleModalPanel({
  onClose,
  onSuccess,
  article,
  surface = "modal",
}: ArticleEditorPanelProps) {
  const editorInstance = React.useRef<EditorJS | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = React.useRef<string | null>(null)
  const [formData, setFormData] = React.useState<ArticleFormData>(() =>
    buildArticleFormData(article)
  )
  const [categories, setCategories] = React.useState<Category[]>([])
  const [users, setUsers] = React.useState<AdminUserOption[]>([])
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    article?.thumbnail || null
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<string[]>([])
  const editorHolderId = React.useId().replace(/:/g, "-")

  React.useEffect(() => {
    let active = true

    const instance = new EditorJS({
      holder: editorHolderId,
      tools: {
        header: Header,
        list: List,
        image: ImageTool,
        embed: Embed,
      },
      placeholder: "Tulis konten edukasi kesehatan yang mendalam di sini...",
      data: parseEditorData(article?.raw_content),
    })

    editorInstance.current = instance

    const loadOptions = async () => {
      try {
        const [categoriesRes, usersRes] = await Promise.all([
          api.get("/categories"),
          api.get("/admin/users"),
        ])

        if (!active) {
          return
        }

        setCategories(
          Array.isArray(categoriesRes.data?.data) ? categoriesRes.data.data : []
        )
        setUsers(Array.isArray(usersRes.data?.data) ? usersRes.data.data : [])
      } catch (loadError) {
        console.error("Fetch article modal options error:", loadError)
      }
    }

    loadOptions()

    return () => {
      active = false
      const editor = editorInstance.current as (EditorJS & { destroy?: () => void }) | null
      if (typeof editor?.destroy === "function") {
        editor.destroy()
      }
      editorInstance.current = null

      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }
    }
  }, [article, editorHolderId])

  React.useEffect(() => {
    if (!article || formData.category_id || categories.length === 0 || !article.category) {
      return
    }

    const matchedCategory = categories.find(
      (category) =>
        category.name === article.category || category.slug === article.category
    )

    if (!matchedCategory) {
      return
    }

    setFormData((current) => ({
      ...current,
      category_id: matchedCategory.id,
    }))
  }, [article, categories, formData.category_id])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = objectUrl
    setSelectedFile(file)
    setPreviewUrl(objectUrl)
  }

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors([])

    try {
      const savedData = (await editorInstance.current?.save()) as
        | EditorContentData
        | undefined
      const renderedContent = renderArticleHtml(savedData)
      const validationMessages = [
        !formData.title.trim() ? "Judul artikel wajib diisi." : null,
        !formData.category_id.trim() ? "Kategori artikel wajib dipilih." : null,
        !formData.status ? "Status publikasi wajib dipilih." : null,
        !renderedContent.replace(/<[^>]*>/g, "").trim() ? "Konten artikel wajib diisi." : null,
      ].filter(Boolean) as string[]

      if (validationMessages.length > 0) {
        setFieldErrors(validationMessages)
        setError("Lengkapi semua atribut artikel sebelum menyimpan.")
        setLoading(false)
        return
      }

      const data = new FormData()

      data.append("title", formData.title)
      data.append("category_id", formData.category_id)
      data.append("status", formData.status)
      data.append("content", renderedContent)
      data.append("raw_content", JSON.stringify(savedData))

      if (formData.author_id) {
        data.append("author_id", formData.author_id)
      }

      if (selectedFile) {
        data.append("thumbnail", selectedFile)
      } else if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail)
      }

      if (article) {
        data.append("_method", "PUT")
        await api.post(`/admin/articles/${article.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await api.post("/admin/articles", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      onSuccess()
      onClose()
    } catch (submitError: unknown) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan artikel."
      const responseData =
        typeof submitError === "object" &&
        submitError !== null &&
        "response" in submitError
          ? (submitError as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response
              ?.data
          : undefined
      const validationMessages = responseData?.errors
        ? Object.values(responseData.errors).flat()
        : []

      setFieldErrors(validationMessages)
      setError(responseData?.message || (validationMessages.length > 0 ? "Lengkapi semua atribut artikel sebelum menyimpan." : errorMessage))
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <>
      <div className="space-y-2 border-b border-slate-100 bg-slate-50/70 px-6 py-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-950">
          {article ? "Update Artikel Edukasi" : "Tulis Artikel Baru"}
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          Editor konten kesehatan dengan struktur yang lebih rapi dan konsisten
          dengan sistem komponen admin saat ini.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 p-6 xl:grid-cols-[minmax(0,1.6fr)_320px]">
          <div className="space-y-6">
            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold">{error}</p>
                  {fieldErrors.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4">
                      {fieldErrors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label required>Judul artikel</Label>
              <Input
                required
                value={formData.title}
                iconLeft={<Type className="h-5 w-5" />}
                placeholder="Contoh: Hubungan Diet Garam dengan Hipertensi"
                className="h-12 rounded-2xl"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-6 py-5">
                <CardTitle className="text-lg font-black tracking-tight">
                  Konten artikel
                </CardTitle>
                <CardDescription>
                  Gunakan blok editor untuk menyusun struktur artikel yang mudah
                  dibaca dan siap dipublikasikan.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  id={editorHolderId}
                  className="min-h-[460px] rounded-[1.4rem] border border-slate-200 bg-slate-50/50 p-6"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm xl:sticky xl:top-0">
              <CardHeader className="border-b border-slate-100 px-6 py-5">
                <CardTitle className="text-lg font-black tracking-tight">
                  Pengaturan artikel
                </CardTitle>
                <CardDescription>
                  Atur metadata publikasi, kategori, penulis, dan thumbnail.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select
                    value={formData.category_id}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                          category_id: event.target.value,
                      }))
                    }
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                          value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status publikasi</Label>
                  <select
                    value={formData.status}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        status: event.target.value as ArticleStatus,
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Author</Label>
                  <select
                    value={formData.author_id}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        author_id: event.target.value,
                      }))
                    }
                  >
                    <option value="">Default (Anda)</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Thumbnail artikel</Label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex aspect-video w-full items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-500"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Thumbnail artikel"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Upload className="h-7 w-7" />
                        <span className="text-xs font-medium">
                          Klik untuk upload thumbnail
                        </span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <HelperText>
                    Gunakan gambar pendukung agar artikel lebih mudah dikenali dari
                    daftar konten publik.
                  </HelperText>
                </div>

                <div className="grid gap-3 rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <span>Kategori dan status menentukan visibilitas artikel.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-slate-400" />
                    <span>Author bisa dibiarkan default bila tidak perlu override.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <span>Thumbnail lama tetap dipakai bila tidak upload file baru.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Pastikan isi artikel dan metadata sudah sesuai sebelum disimpan.
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
              disabled={loading}
              className="h-11 rounded-xl"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {article ? "Update Artikel" : "Publish Artikel"}
            </Button>
          </div>
        </div>
      </form>
    </>
  )

  if (surface === "page") {
    return (
      <Card className="overflow-hidden rounded-[1.9rem] border-slate-200/90 shadow-sm">
        {formContent}
      </Card>
    )
  }

  return (
    <ModalContent
      size="xl"
      className="max-w-6xl rounded-[1.75rem] border border-slate-200"
    >
      <ModalTitle className="sr-only">
        {article ? "Update Artikel Edukasi" : "Tulis Artikel Baru"}
      </ModalTitle>
      <ModalDescription className="sr-only">
        Form editor artikel untuk menulis konten, mengatur metadata, dan publikasi.
      </ModalDescription>
      {formContent}
    </ModalContent>
  )
}

function ArticleModal({ isOpen, onClose, onSuccess, article }: ArticleModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      {isOpen ? (
        <ArticleModalPanel
          key={article ? `edit-${article.id}` : "create-article"}
          onClose={onClose}
          onSuccess={onSuccess}
          article={article}
        />
      ) : null}
    </Modal>
  )
}

export function AdminArticleCreate() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              Article editor
            </Badge>
            <div>
              <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Tulis Artikel Baru
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Halaman khusus untuk menulis dan mengatur metadata artikel sebelum dipublikasikan.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="h-11 rounded-xl"
            onClick={() => navigate("/admin/articles")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </CardContent>
      </Card>

      <ArticleModalPanel
        key="create-article-page"
        article={null}
        surface="page"
        onClose={() => navigate("/admin/articles")}
        onSuccess={() => navigate("/admin/articles")}
      />
    </div>
  )
}

export default function AdminArticles() {
  const navigate = useNavigate()
  const [articles, setArticles] = React.useState<AdminArticle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [pagination, setPagination] =
    React.useState<AdminArticlesPagination | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedArticle, setSelectedArticle] =
    React.useState<AdminArticle | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [articleStats, setArticleStats] = React.useState<ArticleStats>({
    total: 0,
    published: 0,
    draft: 0,
  })

  const fetchArticles = React.useCallback(async (targetPage: number) => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/articles?page=${targetPage}`)
      const pageArticles = Array.isArray(res.data?.data) ? (res.data.data as AdminArticle[]) : []
      const nextPagination = res.data?.pagination as AdminArticlesPagination | undefined

      setArticles(pageArticles)
      if (nextPagination) {
        setPagination(nextPagination)
      }

      let allArticles = [...pageArticles]

      if (nextPagination && nextPagination.last_page > 1) {
        const pageRequests = Array.from({ length: nextPagination.last_page }, (_, index) => index + 1)
          .filter((pageNumber) => pageNumber !== targetPage)
          .map((pageNumber) => api.get(`/admin/articles?page=${pageNumber}`))

        const pageResponses = await Promise.all(pageRequests)
        const restArticles = pageResponses.flatMap((response) =>
          Array.isArray(response.data?.data) ? (response.data.data as AdminArticle[]) : []
        )
        allArticles = [...pageArticles, ...restArticles]
      }

      setArticleStats({
        total: nextPagination?.total ?? allArticles.length,
        published: allArticles.filter((article) => article.status === "published").length,
        draft: allArticles.filter((article) => article.status === "draft").length,
      })
    } catch (error) {
      console.error("Fetch articles error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles(page)
  }, [fetchArticles, page])

  const handleDelete = async (article: AdminArticle) => {
    if (
      window.confirm(
        `Hapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      try {
        await api.delete(`/admin/articles/${article.id}`)
        fetchArticles(page)
      } catch (error) {
        console.error("Delete article error:", error)
        alert("Gagal menghapus artikel.")
      }
    }
  }

  const filteredArticles = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesTerm =
        !term ||
        article.title?.toLowerCase().includes(term) ||
        article.category?.toLowerCase().includes(term) ||
        article.author?.name?.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "all" || article.status === statusFilter

      return matchesTerm && matchesStatus
    })
  }, [articles, searchTerm, statusFilter])

  const publishedCount = articleStats.published
  const draftCount = articleStats.draft

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              Article management
            </Badge>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Manajemen Konten Edukasi
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Tulis, review, dan publikasikan artikel kesehatan jantung dengan
                panel admin yang sekarang konsisten dengan pola `shadcn`.
              </p>
            </div>
          </div>

          <Button
            className="h-11 rounded-xl"
            onClick={() => {
              setSelectedArticle(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tulis Artikel Baru
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Total artikel
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {articleStats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Published
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {publishedCount}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Draft
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {draftCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardHeader className="flex-col items-start gap-4 border-b border-slate-100 px-6 py-5">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-black tracking-tight">
              Direktori Artikel
            </CardTitle>
            <CardDescription>
              Cari cepat artikel berdasarkan judul, kategori, atau author lalu
              saring berdasarkan status publikasinya.
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <Input
                value={searchTerm}
                iconLeft={<Search className="h-4 w-4" />}
                placeholder="Cari judul, kategori, atau author..."
                className="h-11 rounded-xl"
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as const, label: "Semua" },
                { value: "published" as const, label: "Published" },
                { value: "draft" as const, label: "Draft" },
              ].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={statusFilter === item.value ? "primary" : "secondary"}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setStatusFilter(item.value)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-[1.6rem] bg-slate-50"
                />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="group overflow-hidden rounded-[1.75rem] border-slate-200/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.thumbnail || articleFallbackThumbnail}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge variant="neutral" size="sm" className="bg-white/90">
                        {article.category || "Kategori"}
                      </Badge>
                      <Badge
                        variant={article.status === "published" ? "success" : "warning"}
                        size="sm"
                        className="bg-white/90 uppercase tracking-[0.14em]"
                      >
                        {article.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                      <h3 className="line-clamp-2 font-display text-xl font-black leading-tight text-slate-950">
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(article.created_at).toLocaleDateString("id-ID")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <UserCircle2 className="h-3.5 w-3.5" />
                          {article.author?.name || "Default author"}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-xl"
                          onClick={() => {
                            setSelectedArticle(article)
                            setIsModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => handleDelete(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        className="h-9 rounded-xl"
                        onClick={() => navigate(`/article/${article.slug}`)}
                      >
                        Preview
                        <Eye className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="Belum ada artikel yang cocok"
              description="Coba ubah kata kunci pencarian atau status filter, atau mulai buat artikel edukasi baru."
              actionLabel="Tulis Artikel Baru"
              onAction={() => {
                setSelectedArticle(null)
                setIsModalOpen(true)
              }}
              className="max-w-none"
            />
          )}
        </CardContent>

        {pagination && pagination.last_page > 1 ? (
          <>
            <Separator />
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Halaman <span className="font-semibold text-slate-900">{page}</span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-900">
                  {pagination.last_page}
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="h-10 rounded-xl"
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(page - 1, 1))}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Sebelumnya
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 rounded-xl"
                  disabled={page === pagination.last_page}
                  onClick={() => setPage(Math.min(page + 1, pagination.last_page))}
                >
                  Selanjutnya
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </Card>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchArticles(page)}
        article={selectedArticle}
      />
    </div>
  )
}
