import * as React from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Filter,
  Lock,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react"

import { adminService } from "~/lib/adminService"
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

type AdminUser = {
  id: number
  name: string
  email: string
  phone_number?: string | null
  roles: string[]
  created_at: string
}

type PaginationData = {
  current_page: number
  last_page: number
  total?: number
}

type UserFormState = {
  name: string
  email: string
  password: string
  phone_number: string
  role: string
}

type RoleFilter = "all" | "admin" | "user"

type UserModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  user: AdminUser | null
}

const defaultFormState: UserFormState = {
  name: "",
  email: "",
  password: "",
  phone_number: "",
  role: "user",
}

function buildFormState(user: AdminUser | null): UserFormState {
  if (!user) {
    return defaultFormState
  }

  return {
    name: user.name || "",
    email: user.email || "",
    password: "",
    phone_number: user.phone_number || "",
    role: user.roles?.[0] || "user",
  }
}

type UserModalPanelProps = Omit<UserModalProps, "isOpen">

function UserModalPanel({ onClose, onSuccess, user }: UserModalPanelProps) {
  const [formData, setFormData] = React.useState<UserFormState>(() =>
    buildFormState(user)
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (user) {
        await adminService.updateUser(user.id, formData)
      } else {
        await adminService.createUser(formData)
      }

      onSuccess()
      onClose()
    } catch (err) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message || null
          : null

      setError(message || "Terjadi kesalahan sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalContent size="lg" className="rounded-[1.75rem] border border-slate-200">
      <ModalHeader className="space-y-2 border-b border-slate-100 bg-slate-50/70">
        <ModalTitle className="text-2xl font-black tracking-tight">
          {user ? "Edit Pengguna" : "Tambah User Baru"}
        </ModalTitle>
        <ModalDescription className="text-sm leading-6 text-slate-500">
          Kelola data akun admin dan pasien dalam alur form yang lebih konsisten
          dengan komponen admin saat ini.
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

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label required>Nama lengkap</Label>
              <Input
                required
                value={formData.name}
                iconLeft={<UserCircle className="h-5 w-5" />}
                placeholder="Contoh: John Doe"
                className="h-12 rounded-2xl"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label required>Alamat email</Label>
              <Input
                required
                type="email"
                value={formData.email}
                iconLeft={<Mail className="h-5 w-5" />}
                placeholder="john@example.com"
                className="h-12 rounded-2xl"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>No. handphone</Label>
              <Input
                value={formData.phone_number}
                iconLeft={<Phone className="h-5 w-5" />}
                placeholder="0812..."
                className="h-12 rounded-2xl"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    phone_number: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Role</Label>
              <select
                value={formData.role}
                className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
              >
                <option value="user">User / Pasien</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label required={!user}>
                Kata sandi {user ? "(kosongkan jika tidak diubah)" : ""}
              </Label>
              <Input
                required={!user}
                type="password"
                passwordToggle
                value={formData.password}
                iconLeft={<Lock className="h-5 w-5" />}
                placeholder="********"
                className="h-12 rounded-2xl"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
              <HelperText>
                Password hanya perlu diisi saat membuat akun baru atau saat ingin
                mengganti password pengguna.
              </HelperText>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="gap-3 border-t border-slate-100 bg-slate-50/70 sm:justify-between sm:space-x-0">
          <p className="text-xs text-slate-500">
            Pastikan email dan role sudah benar sebelum menyimpan perubahan.
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
              isLoading={loading}
              className="h-11 rounded-xl"
            >
              {user ? "Simpan Perubahan" : "Daftarkan User"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      {isOpen ? (
        <UserModalPanel
          key={user ? `edit-${user.id}` : "create-user"}
          onClose={onClose}
          onSuccess={onSuccess}
          user={user}
        />
      ) : null}
    </Modal>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [pagination, setPagination] = React.useState<PaginationData | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("all")

  const fetchUsers = React.useCallback(async (targetPage: number) => {
    setLoading(true)
    try {
      const res = await adminService.getUsers(targetPage)
      setUsers((res.data ?? []) as AdminUser[])
      setPagination((res.pagination ?? null) as PaginationData | null)
    } catch (err) {
      console.error("Fetch users error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers(page)
  }, [fetchUsers, page])

  const handleDelete = async (user: AdminUser) => {
    if (
      window.confirm(
        `Hapus pengguna ${user.name}? Semua data terkait akan ikut dihapus.`
      )
    ) {
      try {
        await adminService.deleteUser(user.id)
        fetchUsers(page)
      } catch {
        alert("Gagal menghapus user.")
      }
    }
  }

  const filteredUsers = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesTerm =
        !term ||
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        (user.phone_number || "").toLowerCase().includes(term)

      const normalizedRole = user.roles?.[0] || "user"
      const matchesRole = roleFilter === "all" || normalizedRole === roleFilter

      return matchesTerm && matchesRole
    })
  }, [roleFilter, searchTerm, users])

  const totalAdmins = users.filter((user) => user.roles?.includes("admin")).length
  const totalPatients = users.filter((user) => !user.roles?.includes("admin")).length

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              User management
            </Badge>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Manajemen Pengguna
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Kelola akun pasien dan administrator dalam layout admin yang lebih
                konsisten dengan pola `shadcn` yang sekarang dipakai di sidebar dan
                dashboard.
              </p>
            </div>
          </div>

          <Button
            className="h-11 rounded-xl"
            onClick={() => {
              setSelectedUser(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah User Baru
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Total halaman ini
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {users.length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Administrator
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {totalAdmins}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.6rem] border-slate-200/90 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Pasien / User
            </p>
            <p className="font-display text-3xl font-black text-slate-950">
              {totalPatients}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardHeader className="flex-col items-start gap-4 border-b border-slate-100 px-6 py-5">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-black tracking-tight">
              Direktori Pengguna
            </CardTitle>
            <CardDescription>
              Cari cepat user di halaman ini dan saring berdasarkan role untuk
              menemukan akun yang ingin dikelola.
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <Input
                value={searchTerm}
                iconLeft={<Search className="h-4 w-4" />}
                placeholder="Cari nama, email, atau nomor telepon..."
                className="h-11 rounded-xl"
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as const, label: "Semua" },
                { value: "admin" as const, label: "Admin" },
                { value: "user" as const, label: "User" },
              ].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={roleFilter === item.value ? "primary" : "secondary"}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setRoleFilter(item.value)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Pengguna
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Bergabung
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-14 animate-pulse rounded-2xl bg-slate-50" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const role = user.roles?.[0] || "user"
                    const isAdmin = user.roles?.includes("admin")

                    return (
                      <motion.tr
                        key={user.id}
                        layout
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-xs font-black uppercase text-emerald-700">
                              {(user.name || "U").substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {user.name}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400">
                                ID: #{String(user.id).substring(0, 6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{user.phone_number || "-"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge
                            variant={isAdmin ? "warning" : "success"}
                            size="sm"
                            className="uppercase tracking-[0.14em]"
                          >
                            {role}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(user.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 rounded-xl"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => handleDelete(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <EmptyState
                        icon={Users}
                        title="Tidak ada pengguna ditemukan"
                        description="Coba ubah kata kunci pencarian atau filter role, atau tambahkan user baru bila memang belum ada akun."
                        actionLabel="Tambah User Baru"
                        onAction={() => {
                          setSelectedUser(null)
                          setIsModalOpen(true)
                        }}
                        className="max-w-none"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </CardContent>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchUsers(page)}
        user={selectedUser}
      />
    </div>
  )
}
