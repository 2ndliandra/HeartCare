import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Bell,
    Activity,
    Stethoscope,
    HeartPulse,
    ClipboardList,
    AlertTriangle,
    CheckCircle2,
    Heart,
    BrainCircuit,
    Bot,
    User,
    ChevronRight
} from 'lucide-react';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [loadingChat, setLoadingChat] = useState(true);

    // Mock user
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const baseNavigation = [
        { name: 'Beranda', icon: LayoutDashboard, href: '/user' },
        { name: 'Cek Kesehatan', icon: Activity, href: '/user/cek-kesehatan', hasNotification: true },
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi' },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi' },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi' },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat' },
        { name: 'Profil Saya', icon: User, href: '/user/profile' },
    ];

    // Update navigation based on current location
    const navigation = baseNavigation.map(item => ({
        ...item,
        current: location.pathname === item.href
    }));

    React.useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await api.get('chats');
            if (response.data.success) {
                setChats(response.data.data);
            }
        } catch (error) {
            console.error('Fetch chats error:', error);
        } finally {
            setLoadingChat(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth-related data
            localStorage.clear();
            // Also clear any cached data
            sessionStorage.clear();
            // Force navigate and reload to ensure fresh session
            window.location.href = '/login';
        }
    };
    { id: 1, date: '12 Okt 2026', status: 'Risiko Tinggi', severity: 'Tinggi', type: 'Penyakit Jantung Koroner' },
    { id: 2, date: '10 Okt 2026', status: 'Sehat', severity: 'Normal', type: 'Normal' },
    { id: 3, date: '08 Okt 2026', status: 'Risiko Sedang', severity: 'Sedang', type: 'Hipertensi' },
    ];

return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
            <div className="h-20 flex items-center px-8 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">Heart<span className="text-primary">Predict</span></span>
                </Link>
                <button
                    className="lg:hidden ml-auto text-slate-500 hover:text-slate-700"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu Utama</div>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative
                                    ${item.current
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }
                                `}
                        >
                            <Icon className={`
                                    mr-3 h-5 w-5 flex-shrink-0 transition-colors
                                    ${item.current ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}
                                `} />
                            {item.name}

                            {item.hasNotification && (
                                <span className="absolute right-4 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50"></span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-blue-400 group-hover:text-blue-600 transition-colors" />
                    Keluar Akun
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                        <HeartPulse size={18} className="text-blue-500" />
                        <span className="text-sm font-medium">BPM Normal <span className="opacity-60 font-normal px-1">•</span> 72 detak/menit</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || 'Pasien Cerdas'}</p>
                            <p className="text-xs text-slate-500">Member Aktif</p>
                        </div>
                        <Link to="/user/profile" className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm hover:border-primary/30 transition-all">
                            {user?.profile_picture ? (
                                <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.name ? user.name.charAt(0).toUpperCase() : 'P'
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Dashboard Stats & Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Page Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Kesehatan Hari Ini</h1>
                        <p className="text-slate-500 text-sm mt-1">Pantau kondisi jantung dan hasil diagnosa AI Anda secara real-time.</p>
                    </div>

                    {/* Top Widgets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Widget 1: Risiko */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Status Risiko Medis</p>
                                    <h3 className="text-2xl font-bold text-slate-900">Perhatikan</h3>
                                    <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> Tekanan darah tinggi
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                    <Activity size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Widget 2: Kondisi */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Pemantauan Terakhir</p>
                                    <h3 className="text-2xl font-bold text-slate-900">Normal <span className="text-sm font-normal text-slate-400">/ 1 Hari lalu</span></h3>
                                    <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> Semua indikator stabil
                                    </p>
                                </div>
                                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                    <HeartPulse size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Widget 3: AI */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Akurasi Prediksi AI</p>
                                    <h3 className="text-2xl font-bold text-slate-900">94.8%</h3>
                                    <p className="text-xs text-indigo-600 font-medium mt-2 flex items-center gap-1.5">
                                        <BrainCircuit size={14} /> Random Forest Model
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <BrainCircuit size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Insight Cerdas (Takes 2 columns on large screens) */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-1 bg-red-500 h-full"></div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                                    <AlertTriangle size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Insight Cerdas: Peringatan Dini</h2>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
                                <h3 className="text-red-800 font-semibold mb-2">Risiko Hipertensi & Kardiovaskular Meningkat</h3>
                                <p className="text-red-600 text-sm leading-relaxed mb-4">
                                    Sistem kami mendeteksi tren <strong>tekanan darah tinggi (&gt;130/80 mmHg)</strong> dipadu dengan kolesterol LDL tinggi. Kondisi ini secara signifikan meningkatkan risiko serangan jantung atau stroke.
                                </p>
                                <div className="flex gap-3">
                                    <button className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                                        Jadwalkan Konsultasi Medis
                                    </button>
                                    <button className="bg-white text-slate-700 border border-slate-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        Lihat Anjuran Diet
                                    </button>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><BrainCircuit size={14} className="text-primary" /> Dianalisis oleh AI 2 menit lalu</span>
                                <Link to="/user/hasil-prediksi" className="font-medium text-primary hover:text-primary/80">Lihat semua insight</Link>
                            </div>
                        </div>

                        {/* Riwayat Scan (Takes 1 column) */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-900">Riwayat Pengecekan</h2>
                                <Link to="/user/riwayat" className="text-slate-400 hover:text-primary transition-colors">
                                    <ChevronRight size={20} />
                                </Link>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                {scanHistory.map((scan) => (
                                    <div key={scan.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden">
                                            <HeartPulse size={24} className="text-slate-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-semibold text-slate-900 truncate pr-2">{scan.type}</h4>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{scan.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${scan.severity === 'Tinggi' ? 'bg-red-100 text-red-700' :
                                                    scan.severity === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {scan.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <Link to="/user/cek-kesehatan" className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary text-sm font-medium rounded-xl hover:bg-primary/20 transition-colors">
                                    <Activity size={16} />
                                    Masukkan Data Baru
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* AI Chat Interaction Widget */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Konsultasi AI Terakhir</h2>
                                    <p className="text-xs text-slate-500">Bantuan cerdas untuk kesehatan jantung Anda</p>
                                </div>
                            </div>
                            <Link to="/user/konsultasi" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                Buka Chat <ChevronRight size={18} />
                            </Link>
                        </div>

                        {loadingChat ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                <div className="h-10 bg-slate-50 rounded-2xl w-full"></div>
                            </div>
                        ) : chats.length > 0 ? (
                            <div className="relative min-h-[180px]">
                                {chats.slice(0, 3).map((chat, index) => (
                                    <div
                                        key={chat._id || chat.id}
                                        className="absolute w-full transition-all duration-300 hover:translate-y-[-8px] cursor-pointer"
                                        style={{
                                            top: `${index * 24}px`,
                                            zIndex: 30 - index,
                                            transform: `scale(${1 - index * 0.05})`,
                                            opacity: 1 - index * 0.2
                                        }}
                                        onClick={() => navigate('/user/konsultasi')}
                                    >
                                        <div className={`bg-white border ${index === 0 ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-slate-200 shadow-sm'} rounded-2xl p-5 space-y-3`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${index === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Bot size={12} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Penyelesaian AI #{chats.length - index}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(chat.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 italic line-clamp-1 mb-2">"{chat.message}"</p>
                                                <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                                                    {chat.response}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {chats.length > 3 && (
                                    <div className="absolute bottom-[-10px] left-0 right-0 text-center">
                                        <p className="text-[10px] font-medium text-slate-400">+{chats.length - 3} percakapan lainnya</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-500 mb-4">Belum ada percakapan AI sebelumnya.</p>
                                <Link to="/user/konsultasi" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                    Mulai Konsultasi Pertama <Bot size={14} />
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    </div>
);
};

export default UserPage;
