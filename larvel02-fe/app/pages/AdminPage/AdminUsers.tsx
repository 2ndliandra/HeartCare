import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  X,
  UserCircle,
  Lock,
  Loader2,
  AlertTriangle,
  Clock
} from "lucide-react";
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

// Modal Component for Add/Edit
const UserModal = ({ isOpen, onClose, onSuccess, user }: any) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'user'
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone_number: user.phone_number || '',
        role: user.roles?.[0] || 'user'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'user'
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (user) {
        await api.put(`/admin/users/${user.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">{user ? 'Edit Pengguna' : 'Tambah User Baru'}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Portal v2.0</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-100 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
              <Input
                required
                iconLeft={<UserCircle className="w-5 h-5" />}
                placeholder="Ex: John Doe"
                className="h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat Email</label>
              <Input
                required
                type="email"
                iconLeft={<Mail className="w-5 h-5" />}
                placeholder="john@example.com"
                className="h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. Handphone</label>
                <Input
                  iconLeft={<Phone className="w-5 h-5" />}
                  placeholder="0812..."
                  className="h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white"
                  value={formData.phone_number}
                  onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hak Akses (Role)</label>
                <select
                  className="w-full h-12 px-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User / Pasien</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kata Sandi {user && '(Kosongkan jika tidak diubah)'}</label>
              <Input
                required={!user}
                type="password"
                iconLeft={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                className="h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
        </form>

        <div className="p-8 pt-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200">Batal</Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (user ? 'Simpan Perubahan' : 'Daftarkan User')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function AdminUsers() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  React.useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${targetPage}`);
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: any) => {
    if (window.confirm(`Hapus pengguna ${user.name}? Semua data terkait akan ikut dihapus.`)) {
      try {
        await api.delete(`/admin/users/${user.id}`);
        fetchUsers(page);
      } catch (err) {
        alert('Gagal menghapus user.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600" /> Manajemen Pengguna
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Kelola data pasien dan administrator sistem di sini.</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="h-12 px-6 rounded-2xl shadow-xl shadow-emerald-100 font-black text-xs uppercase tracking-widest">
          <Plus className="w-5 h-5 mr-2" /> Tambah User Baru
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border-slate-200 shadow-sm rounded-3xl bg-white flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="Cari nama, email, atau no. telepon..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl text-sm font-medium transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-12 px-4 rounded-xl border-slate-200">
              <Filter className="w-5 h-5 mr-2 text-slate-400" /> <span className="text-xs font-bold">Filter</span>
           </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border-slate-200 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient / Admin</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan={5} className="px-8 py-4"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    layout
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm border border-emerald-100/50 uppercase">
                          {(user.name || "U").substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 leading-none">{user.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: #{String(user.id).substring(0, 6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Mail className="w-3 h-3 text-slate-300" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Phone className="w-3 h-3 text-slate-300" /> {user.phone_number || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={user.roles.includes('admin') ? 'warning' : 'success'} className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        {user.roles[0] || 'User'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                            className="w-9 h-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(user)}
                            className="w-9 h-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-slate-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Users className="w-8 h-8" />
                       </div>
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tidak ada pengguna ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {page} of {pagination.last_page}</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border-slate-200 h-9"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                 {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => i + 1).map(p => (
                   <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-xs font-black transition-all",
                      page === p ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-105" : "text-slate-400 hover:bg-white border border-transparent hover:border-slate-200"
                    )}
                   >
                     {p}
                   </button>
                 ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === pagination.last_page}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border-slate-200 h-9"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchUsers(page)}
        user={selectedUser}
      />
    </div>
  );
}
