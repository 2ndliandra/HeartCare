import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
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
import { cn } from "~/lib/utils"
import { useToast } from "~/hooks/useToast"
import type { UserProfile } from "~/types/UserPage/User"

type TabType = "info" | "security"

interface ProfileFormData {
  name: string
  email: string
  phone: string
  gender: string
  address: string
  birth_date: string
}

interface PasswordFormData {
  current: string
  new: string
  confirm: string
}

interface ProfileResponse {
  success?: boolean
  data?: UserProfile
}

const defaultProfileFormData: ProfileFormData = {
  name: "",
  email: "",
  phone: "",
  gender: "L",
  address: "",
  birth_date: "",
}

const defaultPasswordFormData: PasswordFormData = {
  current: "",
  new: "",
  confirm: "",
}

const allowedProfileImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]

function parseStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem("user")
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch (error) {
    console.error("Failed to parse stored user", error)
    return null
  }
}

function buildProfileFormData(user: UserProfile | null): ProfileFormData {
  if (!user) {
    return defaultProfileFormData
  }

  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone_number || "",
    gender: user.gender || "L",
    address: user.address || "",
    birth_date: user.birth_date || "",
  }
}

function getProfilePictureUrl(profilePicture?: string) {
  if (!profilePicture) {
    return null
  }

  if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) {
    return profilePicture
  }

  return `http://localhost:8000/storage/${profilePicture}`
}

export default function ProfilePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const storedUser = React.useMemo(() => parseStoredUser(), [])
  const isAdminProfile = location.pathname.startsWith("/admin")
  const [activeTab, setActiveTab] = React.useState<TabType>("info")
  const [loadingInfo, setLoadingInfo] = React.useState(false)
  const [loadingPassword, setLoadingPassword] = React.useState(false)
  const [loadingProfile, setLoadingProfile] = React.useState(true)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("")
  const [profile, setProfile] = React.useState<UserProfile | null>(storedUser)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    getProfilePictureUrl(storedUser?.profile_picture)
  )
  const [formData, setFormData] = React.useState<ProfileFormData>(() =>
    buildProfileFormData(storedUser)
  )
  const [passwordData, setPasswordData] =
    React.useState<PasswordFormData>(defaultPasswordFormData)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = React.useRef<string | null>(null)

  const fetchProfile = React.useCallback(async () => {
    setLoadingProfile(true)

    try {
      const response = await api.get<ProfileResponse>("/profile")

      if (response.data?.success && response.data.data) {
        const userData = response.data.data
        setProfile(userData)
        setFormData(buildProfileFormData(userData))
        setPreviewUrl(getProfilePictureUrl(userData.profile_picture))
        localStorage.setItem("user", JSON.stringify(userData))
        window.dispatchEvent(new Event("profileUpdated"))
      }
    } catch (error: unknown) {
      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined

      console.error("Failed to fetch profile", error)
      toast({
        title: "Gagal memuat profil",
        description: apiMessage || "Terjadi kesalahan koneksi",
        variant: "error",
      })
    } finally {
      setLoadingProfile(false)
    }
  }, [toast])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile()

    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [fetchProfile])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!allowedProfileImageTypes.includes(file.type)) {
      event.target.value = ""
      toast({
        title: "Format foto tidak didukung",
        description: "Gunakan file gambar JPG, JPEG, PNG, atau GIF.",
        variant: "error",
      })
      return
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = objectUrl
    setPreviewUrl(objectUrl)
  }

  const handleSaveInfo = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoadingInfo(true)

    try {
      const data = new FormData()
      data.append("_method", "PUT")
      data.append("name", formData.name)
      data.append("phone_number", formData.phone)
      data.append("gender", formData.gender)
      data.append("address", formData.address)
      data.append("birth_date", formData.birth_date)

      if (fileInputRef.current?.files?.[0]) {
        data.append("profile_picture", fileInputRef.current.files[0])
      }

      const response = await api.post<ProfileResponse>("/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data?.success) {
        toast({
          title: "Berhasil",
          description: "Profil Anda telah diperbarui",
          variant: "success",
        })
        fetchProfile()
      }
    } catch (error: unknown) {
      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined

      toast({
        title: "Gagal memperbarui profil",
        description: apiMessage || "Terjadi kesalahan",
        variant: "error",
      })
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault()

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password tidak cocok",
        description: "Konfirmasi password baru tidak sesuai",
        variant: "error",
      })
      return
    }

    setLoadingPassword(true)

    try {
      const response = await api.patch<ProfileResponse>("/profile/password", {
        password: passwordData.new,
        password_confirmation: passwordData.confirm,
      })

      if (response.data?.success) {
        toast({
          title: "Password berhasil diperbarui",
          description: "Gunakan password baru Anda untuk login berikutnya",
          variant: "success",
        })
        setPasswordData(defaultPasswordFormData)
      }
    } catch (error: unknown) {
      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined

      toast({
        title: "Gagal memperbarui password",
        description: apiMessage || "Terjadi kesalahan",
        variant: "error",
      })
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "HAPUS AKUN") {
      return
    }

    localStorage.clear()
    navigate("/login")
  }

  const roleLabel = isAdminProfile ? "Admin profile" : "User profile"
  const avatarInitial =
    formData.name?.trim().charAt(0).toUpperCase() ||
    profile?.name?.trim().charAt(0).toUpperCase() ||
    "U"

  return (
    <div className="space-y-6 pb-10">
      <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              {roleLabel}
            </Badge>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Profil & Keamanan Akun
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Kelola identitas akun, foto profil, dan pengaturan keamanan
                dari satu panel yang lebih konsisten dengan sistem admin saat ini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "info" ? "primary" : "secondary"}
              className="h-11 rounded-xl"
              onClick={() => setActiveTab("info")}
            >
              <User className="mr-2 h-4 w-4" />
              Informasi
            </Button>
            <Button
              variant={activeTab === "security" ? "primary" : "secondary"}
              className="h-11 rounded-xl"
              onClick={() => setActiveTab("security")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Keamanan
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="space-y-6">
          <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
            <CardHeader className="border-b border-slate-100 px-6 py-5">
              <CardTitle className="text-xl font-black tracking-tight">
                Ringkasan Akun
              </CardTitle>
              <CardDescription>
                Data utama profil Anda ditampilkan di sini dan akan sinkron ke
                area layout ketika diperbarui.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50 text-3xl font-black text-emerald-700 shadow-sm">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Avatar profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarInitial
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-black text-slate-950">
                      {formData.name || "Nama belum diisi"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {formData.email || "Email belum tersedia"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="success" size="sm">
                      Profil aktif
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {formData.gender === "P" ? "Perempuan" : "Laki-laki"}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {isAdminProfile ? "Akses admin" : "Akses user"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTab === "info" ? (
            <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-6 py-5">
                <CardTitle className="text-xl font-black tracking-tight">
                  Informasi Pribadi
                </CardTitle>
                <CardDescription>
                  Perbarui data utama yang digunakan untuk identitas akun dan
                  tampilan profil di seluruh aplikasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSaveInfo} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label required>Nama lengkap</Label>
                      <Input
                        required
                        name="name"
                        value={formData.name}
                        iconLeft={<User className="h-4 w-4" />}
                        className="h-12 rounded-2xl"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        disabled
                        name="email"
                        value={formData.email}
                        iconLeft={<Mail className="h-4 w-4" />}
                        className="h-12 rounded-2xl"
                        onChange={handleInputChange}
                      />
                      <HelperText>Email ditampilkan sebagai referensi akun aktif.</HelperText>
                    </div>

                    <div className="space-y-2">
                      <Label>Nomor telepon</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        iconLeft={<Phone className="h-4 w-4" />}
                        placeholder="08xxxxxxxxxx"
                        className="h-12 rounded-2xl"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tanggal lahir</Label>
                      <Input
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        iconLeft={<Calendar className="h-4 w-4" />}
                        className="h-12 rounded-2xl"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Jenis kelamin</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { id: "L", label: "Laki-laki" },
                        { id: "P", label: "Perempuan" },
                      ].map((gender) => (
                        <button
                          key={gender.id}
                          type="button"
                          onClick={() =>
                            setFormData((current) => ({
                              ...current,
                              gender: gender.id,
                            }))
                          }
                          className={cn(
                            "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                            formData.gender === gender.id
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          )}
                        >
                          <span className="text-sm font-semibold">{gender.label}</span>
                          {formData.gender === gender.id ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alamat lengkap</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        rows={4}
                        className="min-h-[120px] w-full rounded-[1.35rem] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                        placeholder="Masukkan alamat domisili Anda"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loadingInfo}
                      className="h-11 rounded-xl"
                    >
                      {loadingInfo ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-6 py-5">
                <CardTitle className="text-xl font-black tracking-tight">
                  Pengaturan Password
                </CardTitle>
                <CardDescription>
                  Gunakan password yang kuat agar akses akun tetap aman.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label>Password baru</Label>
                    <Input
                      required
                      type="password"
                      passwordToggle
                      value={passwordData.new}
                      iconLeft={<Lock className="h-4 w-4" />}
                      placeholder="Minimal 8 karakter"
                      className="h-12 rounded-2xl"
                      onChange={(event) =>
                        setPasswordData((current) => ({
                          ...current,
                          new: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Konfirmasi password baru</Label>
                    <Input
                      required
                      type="password"
                      passwordToggle
                      value={passwordData.confirm}
                      iconLeft={<KeyRound className="h-4 w-4" />}
                      placeholder="Ulangi password baru"
                      className="h-12 rounded-2xl"
                      onChange={(event) =>
                        setPasswordData((current) => ({
                          ...current,
                          confirm: event.target.value,
                        }))
                      }
                    />
                    <HelperText>
                      Password lama saat ini belum diminta oleh form ini dan tetap
                      mengikuti kontrak endpoint backend yang sudah ada.
                    </HelperText>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loadingPassword}
                      className="h-11 rounded-xl"
                    >
                      {loadingPassword ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Shield className="mr-2 h-4 w-4" />
                      )}
                      Update Password
                    </Button>
                  </div>
                </form>

                <Separator />

                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-black text-rose-900">
                        Zona Berisiko
                      </h3>
                      <p className="max-w-xl text-sm leading-6 text-rose-700/80">
                        Hapus akun akan mengakhiri sesi Anda di perangkat ini.
                        Flow backend penghapusan permanen belum tersedia di halaman ini,
                        jadi aksi sekarang tetap mengikuti perilaku lokal yang sudah ada.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="h-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Akun
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
            <CardHeader className="border-b border-slate-100 px-6 py-5">
              <CardTitle className="text-xl font-black tracking-tight">
                Status Profil
              </CardTitle>
              <CardDescription>
                Snapshot singkat untuk melihat data akun yang sedang aktif.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {loadingProfile ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-14 animate-pulse rounded-2xl bg-slate-50"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Nama akun
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formData.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Email
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formData.email || "-"}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Telepon
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formData.phone || "-"}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Tanggal lahir
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formData.birth_date || "-"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
            <CardHeader className="border-b border-slate-100 px-6 py-5">
              <CardTitle className="text-xl font-black tracking-tight">
                Catatan
              </CardTitle>
              <CardDescription>
                Beberapa hal penting terkait pengelolaan akun di halaman ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>Email saat ini tampil sebagai field referensi dan belum diedit dari form ini.</p>
              </div>
              <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                <Camera className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>Foto profil bisa diganti langsung dari kartu ringkasan tanpa keluar dari halaman.</p>
              </div>
              <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>Pembaruan password mengikuti endpoint backend yang sekarang hanya meminta password baru dan konfirmasi.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open)
          if (!open) {
            setDeleteConfirmText("")
          }
        }}
      >
        {showDeleteModal ? (
          <ModalContent
            size="md"
            className="max-w-xl rounded-[1.75rem] border border-slate-200"
          >
            <ModalHeader className="space-y-2 border-b border-slate-100 bg-rose-50/70">
              <ModalTitle className="text-2xl font-black tracking-tight text-rose-900">
                Konfirmasi Hapus Akun
              </ModalTitle>
              <ModalDescription className="text-sm leading-6 text-rose-700/80">
                Ketik <span className="font-semibold">HAPUS AKUN</span> untuk
                melanjutkan aksi sesuai flow lokal yang saat ini tersedia.
              </ModalDescription>
            </ModalHeader>

            <ModalBody className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Tindakan ini akan menghapus sesi lokal dan mengarahkan Anda ke
                  halaman login. Integrasi penghapusan permanen ke backend belum
                  tersedia di halaman ini.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Ketik HAPUS AKUN</Label>
                <Input
                  value={deleteConfirmText}
                  placeholder="HAPUS AKUN"
                  className="h-12 rounded-2xl border-rose-200 text-center font-semibold uppercase focus:border-rose-500 focus:ring-rose-500/10"
                  onChange={(event) =>
                    setDeleteConfirmText(event.target.value.toUpperCase())
                  }
                />
              </div>
            </ModalBody>

            <ModalFooter className="gap-3 border-t border-slate-100 bg-slate-50/70 sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-xl"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText("")
                }}
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={deleteConfirmText !== "HAPUS AKUN"}
                className="h-11 rounded-xl bg-rose-600 hover:bg-rose-700"
                onClick={handleDeleteAccount}
              >
                Hapus Permanen
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : null}
      </Modal>
    </div>
  )
}
