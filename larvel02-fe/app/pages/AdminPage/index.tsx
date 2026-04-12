import React, { useState, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    Database, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    Heart, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronRight, 
    Activity, 
    MoreVertical,
    Download,
    Phone,
    Mail,
    Lock,
    UserCircle,
    ChevronLeft,
    Image as ImageIcon,
    Tag,
    Clock,
    Type,
    Upload,
    PlusCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

// @ts-ignore
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';
// @ts-ignore
import Embed from '@editorjs/embed';

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    
    // Data States
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [datasets, setDatasets] = useState<any[]>([]);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    useEffect(() => {
        setPage(1); 
        fetchData(1);
    }, [activeTab]);

    const fetchData = async (targetPage: number = page) => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } else if (activeTab === 'users') {
                const res = await api.get(`/admin/users?page=${targetPage}`);
                setUsers(res.data.data);
                setPagination(res.data.pagination);
            } else if (activeTab === 'articles') {
                const res = await api.get(`/admin/articles?page=${targetPage}`);
                setArticles(res.data.data);
                setPagination(res.data.pagination);
            } else if (activeTab === 'datasets') {
                const res = await api.get('/admin/datasets');
                setDatasets(res.data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchData(newPage);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error('Logout API error:', e);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('roles');
            localStorage.removeItem('auth_token_set_at');
            navigate('/login');
        }
    };

    const menuItems = [
        { id: 'dashboard', name: 'Ringkasan', icon: LayoutDashboard },
        { id: 'users', name: 'Kelola Pengguna', icon: Users },
        { id: 'articles', name: 'Kelola Artikel', icon: FileText },
        { id: 'datasets', name: 'Manajemen Dataset', icon: Database },
        { id: 'settings', name: 'Pengaturan', icon: Settings },
    ];

    const renderContent = () => {
        if (loading && !stats && activeTab === 'dashboard') return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

        switch (activeTab) {
            case 'dashboard':
                return <DashboardView stats={stats} />;
            case 'users':
                return (
                    <>
                        <UserManagementView users={users} onRefresh={() => fetchData(page)} />
                        <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
                    </>
                );
            case 'articles':
                return (
                    <>
                        <ArticleManagementView articles={articles} onRefresh={() => fetchData(page)} />
                        <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
                    </>
                );
            case 'datasets':
                return <DatasetManagementView datasets={datasets} onRefresh={() => fetchData(page)} />;
            default:
                return <div className="p-8 text-center text-slate-500">Fitur ini akan segera hadir.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">AdminPanel</span>
                    </Link>
                    <button className="lg:hidden ml-auto text-slate-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu Admin</div>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                                {item.name}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-red-400" /> Keluar Sistem
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                        <h1 className="text-xl font-bold text-slate-900">
                            {menuItems.find(i => i.id === activeTab)?.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 font-bold">A</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// --- Shared Components ---

const PaginationControls: React.FC<{ pagination: any, onPageChange: (page: number) => void }> = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
        <div className="mt-8 flex items-center justify-between bg-white px-8 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Halaman {pagination.current_page} dari {pagination.last_page}
            </div>
            <div className="flex items-center gap-2">
                <button 
                    disabled={pagination.current_page === 1}
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => i + 1).map(p => (
                    <button 
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${pagination.current_page === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        {p}
                    </button>
                ))}
                <button 
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => onPageChange(pagination.current_page + 1)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

// --- Sub-Views ---

const DashboardView: React.FC<{ stats: any }> = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        { name: 'Total Pengguna', value: stats.total_users, change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Artikel Aktif', value: stats.total_articles, change: '+2', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Akurasi AI', value: `${stats.avg_accuracy}%`, change: '+0.5%', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
        { name: 'Dataset Aktif', value: stats.active_datasets, change: 'Stable', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.bg} ${card.color} p-3 rounded-2xl`}>
                                <card.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                {card.change}
                            </span >
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{card.name}</p>
                        <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pertumbuhan Pengguna</h3>
                            <p className="text-xs text-slate-500">Aktivitas pendaftaran dalam 7 hari terakhir</p>
                        </div>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-4 pt-4">
                        {stats.growth.map((d: any) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                                <div 
                                    className="w-full bg-primary/10 group-hover:bg-primary/30 transition-all rounded-t-xl relative flex items-end"
                                    style={{ height: `${(d.users / 40) * 100}%` }}
                                >
                                    <div className="absolute top-0 left-0 right-0 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-primary text-center pb-1">
                                        {d.users}
                                    </div>
                                    <div className="w-full bg-primary h-1 rounded-t-xl"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Sistem Log AI</h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Dataset Update', time: '2m ago', desc: 'HeartModel_V2 trained', type: 'success' },
                            { title: 'New Admin added', time: '1h ago', desc: 'dr. Sarah created', type: 'info' },
                            { title: 'Prediction Alert', time: '3h ago', desc: 'High risk detected', type: 'warning' },
                        ].map((act, i) => (
                             <div key={i} className="flex gap-4">
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${act.type === 'success' ? 'bg-emerald-500' : act.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{act.title}</p>
                                    <p className="text-xs text-slate-500 mb-1">{act.desc}</p>
                                    <p className="text-[10px] text-slate-300 font-medium">{act.time}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-3 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all">Lihat Semua Log</button>
                </div>
            </div>
        </div>
    );
};

// --- User Management Shared Components ---

const UserModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    onSuccess: () => void, 
    user?: any 
}> = ({ isOpen, onClose, onSuccess, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{user ? 'Edit Pengguna' : 'Tambah User Baru'}</h3>
                        <p className="text-xs text-slate-500">{user ? 'Perbarui data akun pengguna yang sudah ada' : 'Daftarkan pengguna baru ke sistem'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-2">
                             <Lock size={14} /> {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    required 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary transition-all"
                                    placeholder="aji"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    required 
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary transition-all"
                                    placeholder="aji@heartpredict.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. Handphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary transition-all"
                                        placeholder="0812..."
                                        value={formData.phone_number}
                                        onChange={e => setFormData({...formData, phone_number: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hak Akses (Role)</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="user">User / Pasien</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password {user && '(Kosongkan jika tidak diubah)'}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    required={!user}
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                        <button 
                            disabled={loading}
                            type="submit" 
                            className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {user ? 'Simpan Perubahan' : 'Daftarkan User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagementView: React.FC<{ users: any[], onRefresh: () => void }> = ({ users, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                onRefresh();
            } catch (err) {
                alert('Gagal menghapus user.');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Cari nama atau email..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm shadow-sm" />
                </div>
                <button 
                    onClick={handleAdd}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} /> Tambah User
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-8 py-5">Nama Pengguna</th>
                                <th className="px-6 py-5">Informasi Kontak</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5">Tgl Bergabung</th>
                                <th className="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {user.name.substring(0, 2)}
                                            </div>
                                            <span className="font-bold text-slate-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 font-medium">{user.email}</span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Phone size={10} /> {user.phone_number || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.roles.includes('admin') ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {user.roles[0] || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 text-xs">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={onRefresh} 
                user={selectedUser} 
            />
        </div>
    );
};

// --- Article Management Shared Components ---

const ArticleModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    onSuccess: () => void, 
    article?: any 
}> = ({ isOpen, onClose, onSuccess, article }) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        thumbnail: '',
        status: 'published'
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            initEditor();
            fetchCategories();
        }
        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title || '',
                category: article.category || '',
                thumbnail: article.thumbnail || '',
                status: article.status || 'published'
            });
            setPreviewUrl(article.thumbnail || null);
        } else {
            setFormData({
                title: '',
                category: '',
                thumbnail: '',
                status: 'published'
            });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [article, isOpen]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
            if (!article && res.data.data.length > 0 && !formData.category) {
                setFormData(prev => ({ ...prev, category: res.data.data[0].name }));
            }
        } catch (err) {
            console.error('Fetch categories error:', err);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setLoading(true);
        try {
            const res = await api.post('/admin/categories', { name: newCategoryName });
            setCategories(prev => [...prev, res.data.data]);
            setFormData(prev => ({ ...prev, category: res.data.data.name }));
            setNewCategoryName('');
            setIsAddingCategory(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal menambah kategori');
        } finally {
            setLoading(false);
        }
    };

    const initEditor = () => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: Header,
                    list: List,
                    image: ImageTool,
                    embed: Embed,
                },
                placeholder: 'Tulis konten edukasi kesehatan yang mendalam di sini...',
                data: article ? JSON.parse(article.raw_content || '{}') : undefined,
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const savedData = await editorInstance.current?.save();
            
            const htmlContent = savedData?.blocks.map(block => {
                if (block.type === 'paragraph') {
                    return block.data.text
                        .split('\n')
                        .filter((p: string) => p.trim() !== '')
                        .map((p: string) => `<p>${p}</p>`)
                        .join('');
                }
                if (block.type === 'header') return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                if (block.type === 'list') {
                    const items = block.data.items.map((i: string) => `<li>${i}</li>`).join('');
                    return block.data.style === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
                }
                return '';
            }).join('');

            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('status', formData.status);
            data.append('content', htmlContent || '');
            data.append('raw_content', JSON.stringify(savedData));
            
            if (selectedFile) {
                data.append('thumbnail', selectedFile);
            } else if (formData.thumbnail) {
                data.append('thumbnail', formData.thumbnail);
            }

            if (article) {
                data.append('_method', 'PUT');
                await api.post(`/admin/articles/${article.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/articles', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan artikel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900">
                    <div>
                        <h3 className="text-2xl font-black">{article ? 'Edit Research Paper' : 'Draft New Education Content'}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Standard Medical Writing Editor</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"><X size={24}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 space-y-8">
                        {error && <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-100">{error}</div>}
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2 italic"> <Type size={14}/> Academic Title </label>
                            <input 
                                required 
                                className="w-full px-0 py-4 bg-white border-b-2 border-slate-100 text-3xl font-black text-slate-900 focus:outline-none focus:border-primary transition-all placeholder:text-slate-200"
                                placeholder="Pentingnya Deteksi Dini Gejala Kardiovaskular..."
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div className="min-h-[400px] prose prose-slate max-w-none">
                            <div id="editorjs" className="bg-slate-50/30 p-8 rounded-[2rem] border border-slate-100 min-h-[500px]"></div>
                        </div>
                    </div>

                    <div className="w-full lg:w-80 space-y-8">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <Tag size={14}/> Medical Field </label>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                                        className="text-primary hover:scale-110 transition-transform"
                                    >
                                        <PlusCircle size={18} />
                                    </button>
                                </div>
                                {isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <input 
                                            autoFocus
                                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                                            placeholder="Nama Bidang..."
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                                        />
                                        <button 
                                            onClick={handleAddCategory}
                                            className="p-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <select 
                                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:border-primary transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="" disabled>Pilih Bidang...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <Activity size={14}/> Visibility </label>
                                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, status: 'published'})}
                                        className={`flex-1 py-3 text-[10px] font-black transition-all rounded-xl ${formData.status === 'published' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400'}`}
                                    >
                                        PUBLISHED
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, status: 'draft'})}
                                        className={`flex-1 py-3 text-[10px] font-black transition-all rounded-xl ${formData.status === 'draft' ? 'bg-slate-200 text-slate-700' : 'text-slate-400'}`}
                                    >
                                        DRAFT
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <ImageIcon size={14}/> Hero Image </label>
                                <div className="space-y-4">
                                     <input 
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 bg-white border border-dashed border-slate-300 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary transition-all group"
                                    >
                                        <Upload size={16} className="group-hover:bounce" /> IMPORT IMAGE
                                    </button>
                                    
                                    {previewUrl && (
                                        <div className="relative group/preview w-full h-40 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            <button 
                                                type="button"
                                                onClick={() => { setPreviewUrl(null); setSelectedFile(null); setFormData({...formData, thumbnail: ''}) }}
                                                className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button 
                                disabled={loading}
                                onClick={handleSubmit}
                                className="w-full py-5 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-[2rem] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                            >
                                {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : article ? <Edit size={20}/> : <Plus size={20}/>}
                                {article ? 'Save Changes' : 'Publish Content'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArticleManagementView: React.FC<{ articles: any[], onRefresh: () => void }> = ({ articles, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    const handleEdit = (article: any) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedArticle(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Hapus artikel ini secara permanen?')) {
            try {
                await api.delete(`/admin/articles/${id}`);
                onRefresh();
            } catch (err) {
                alert('Gagal menghapus konten.');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h2 className="text-lg font-bold text-slate-900 hidden sm:block">Konten Edukasi</h2>
                <button 
                    onClick={handleAdd}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} /> Buat Artikel Baru
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:shadow-xl transition-all shadow-sm flex flex-col">
                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                            {article.thumbnail ? (
                                <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm shadow-sm text-[10px] font-black uppercase text-primary rounded-lg">{article.category}</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${article.status === 'published' ? 'text-emerald-500' : 'text-slate-400'}`}>{article.status}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                                    <Clock size={10} /> {new Date(article.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-6 text-lg line-clamp-2 min-h-[3.5rem] leading-snug group-hover:text-primary transition-colors">{article.title}</h4>
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 gap-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(article)} className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(article.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                                <Link to={`/article/${article.slug}`} className="px-5 py-2.5 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all">Preview</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ArticleModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={onRefresh} 
                article={selectedArticle} 
            />
        </div>
    );
};

const DatasetManagementView: React.FC<{ datasets: any[], onRefresh: () => void }> = ({ datasets }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shrink-0">
                    <Database size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Pusat Dataset Diagnosa AI</h2>
                    <p className="text-sm text-slate-500 max-w-xl leading-relaxed">Kelola data pelatihan model kesehatan jantung di sini. Unggah dataset baru untuk meningkatkan tingkat akurasi prediksi model AI HeartPredict.</p>
                </div>
                <button className="ml-auto w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <Plus size={18} /> Unggah Dataset 
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets.map((dataset) => (
                    <div key={dataset.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${dataset.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {dataset.status}
                            </span>
                            <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={20} /></button>
                        </div>
                        <h4 className="font-bold text-xl text-slate-900 mb-2">{dataset.name}</h4>
                        <p className="text-xs text-slate-500 mb-6 line-clamp-2">{dataset.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Samples</p>
                                <p className="text-lg font-black text-slate-800">{dataset.sample_count.toLocaleString()}</p>
                            </div>
                             <div className="p-4 bg-emerald-50 rounded-2xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Accuracy</p>
                                <p className="text-lg font-black text-emerald-600">{dataset.accuracy_score}%</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex-1 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <Activity size={16} /> Latih Model
                            </button>
                            <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
