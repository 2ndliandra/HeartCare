// @ts-nocheck
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  Camera,
  Save,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Lock,
  RefreshCw,
  MoreVertical,
  Monitor,
  Smartphone,
  Check,
  ChevronRight,
  Loader2
} from "lucide-react";
import { authService } from "../../lib/authService";
import api from "../../lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input, Label } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { useToast } from "../../hooks/useToast";

type TabType = "info" | "security";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<TabType>("info");
  const [loading, setLoading] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

  // Data State
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    user?.profile_picture ? `http://localhost:8000/storage/${user.profile_picture}` : null
  );

  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    gender: user?.gender || "L",
    address: user?.address || "",
    birth_date: user?.birth_date || "",
  });

  // @ts-ignore
  const [passwordData, setPasswordData] = React.useState({
    current: "",
    new: "",
    confirm: ""
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone_number || "",
          gender: userData.gender || "L",
          address: userData.address || "",
          birth_date: userData.birth_date || "",
        });
        if (userData.profile_picture) {
          setPreviewUrl(`http://localhost:8000/storage/${userData.profile_picture}`);
        }
        // Update local storage to keep it in sync
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (err: any) {
      console.error("Failed to fetch profile", err);
      toast({
        title: "Gagal memuat profil",
        description: err.response?.data?.message || "Terjadi kesalahan koneksi",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone_number', formData.phone);
      data.append('gender', formData.gender);
      data.append('address', formData.address);
      data.append('birth_date', formData.birth_date);

      if (fileInputRef.current?.files?.[0]) {
        data.append('profile_picture', fileInputRef.current.files[0]);
      }

      const response = await api.post('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast({
          title: "Berhasil",
          description: "Profil Anda telah diperbarui",
          variant: "success"
        });
        // Refresh profile data
        fetchProfile();
      }
    } catch (err: any) {
      toast({
        title: "Gagal memperbarui profil",
        description: err.response?.data?.message || "Terjadi kesalahan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password tidak cocok",
        description: "Konfirmasi password baru tidak sesuai",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/profile', {
        name: formData.name, // backend requires name
        password: passwordData.new,
        password_confirmation: passwordData.confirm
      });

      if (response.data.success) {
        toast({
          title: "Password berhasil diperbarui",
          description: "Gunakan password baru Anda untuk login berikutnya",
          variant: "success"
        });
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (err: any) {
      toast({
        title: "Gagal memperbarui password",
        description: err.response?.data?.message || "Terjadi kesalahan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "HAPUS AKUN") {
      // Handle delete
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Profile Header Card */}
      <Card className="p-8 mb-8 border-none bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-[2.0rem] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full -ml-24 -mb-24 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.0rem] bg-white p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover rounded-[1.8rem]" />
              ) : (
                <div className="w-full h-full bg-emerald-50 rounded-[1.8rem] flex items-center justify-center text-emerald-600 font-black text-4xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <button
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-900 border-4 border-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-5 h-5" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black font-display mb-1">{formData.name}</h1>
            <p className="text-emerald-100/80 font-medium mb-3">{formData.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                Member Sejak Apr 2026
              </span>
              <span className="px-4 py-1.5 bg-emerald-400 text-emerald-900 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Check className="w-3 h-3" /> Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: "info", label: "Informasi Pribadi", icon: User },
            { id: "security", label: "Keamanan", icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "info" && (
              <Card className="p-8 sm:p-10 border-slate-100 rounded-[2.0rem] shadow-sm bg-white">
                <form onSubmit={handleSaveInfo} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          iconLeft={<User className="w-4 h-4" />}
                          className="rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nomor Telepon</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          iconLeft={<Phone className="w-4 h-4" />}
                          className="rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Tanggal Lahir</Label>
                        <Input
                          name="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          iconLeft={<Calendar className="w-4 h-4" />}
                          className="rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Jenis Kelamin</Label>
                        <div className="flex gap-4">
                          {[
                            { id: "L", label: "Laki-laki" },
                            { id: "P", label: "Perempuan" }
                          ].map(g => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, gender: g.id }))}
                              className={cn(
                                "flex-1 py-3 px-4 rounded-2xl border text-sm font-bold transition-all",
                                formData.gender === g.id
                                  ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                                  : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                              )}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alamat Lengkap</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none text-sm font-medium transition-all"
                        placeholder="Masukkan alamat domisili Anda"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-emerald-200" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Simpan Perubahan</>}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="p-8 sm:p-10 border-slate-100 rounded-[2.0rem] shadow-sm bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-8 font-display">Ubah Password</h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <Label>Password Baru</Label>
                      <Input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        iconLeft={<Lock className="w-4 h-4" />}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Konfirmasi Password Baru</Label>
                      <Input
                        type="password"
                        placeholder="Ulangi password baru"
                        iconLeft={<Lock className="w-4 h-4" />}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="rounded-2xl px-10 h-14 font-black" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                    </Button>
                  </form>
                </Card>

                <Card className="p-8 sm:p-10 border-red-50 bg-red-50/30 rounded-[2.0rem] shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-bold text-red-900 mb-2 font-display">Hapus Akun</h3>
                      <p className="text-sm text-red-700/70 font-medium max-w-sm">
                        Menghapus akun akan menghapus semua data riwayat dan preferensi Anda secara permanen.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-2xl h-14 px-10 border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-black"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="w-5 h-5 mr-3" /> Hapus Akun Saya
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2.0rem] shadow-2xl p-10 text-center overflow-hidden relative"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3 font-display">Hapus Akun?</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Anda akan kehilangan seluruh data riwayat pemeriksaan dan analisis kesehatan.
              </p>

              <div className="space-y-4 text-left mb-8">
                <Label className="text-red-900">Ketik <span className="font-black">HAPUS AKUN</span> untuk konfirmasi</Label>
                <Input
                  placeholder="HAPUS AKUN"
                  className="rounded-2xl border-red-200 focus:ring-red-500/10 focus:border-red-600 text-center font-black"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="flex-1 h-14 rounded-2xl font-bold"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-bold"
                  disabled={deleteConfirmText !== "HAPUS AKUN"}
                  onClick={handleDeleteAccount}
                >
                  Hapus Permanen
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
