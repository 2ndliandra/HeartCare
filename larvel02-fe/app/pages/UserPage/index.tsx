import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    Bot,
    ScanLine,
    CloudSun,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    AlertTriangle,
    CheckCircle2,
    Sprout,
    BrainCircuit,
    ChevronRight,
    Leaf
} from 'lucide-react';
import { authService } from '../../lib/authService';

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock user
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const navigation = [
        { name: 'Beranda', icon: LayoutDashboard, href: '#', current: true },
        { name: 'Manajemen Lahan', icon: Map, href: '#', current: false },
        { name: 'Rekomendasi AI', icon: Bot, href: '#', current: false },
        { name: 'Diagnosa Penyakit', icon: ScanLine, href: '#', current: false, hasNotification: true },
        { name: 'Pantau Cuaca', icon: CloudSun, href: '#', current: false },
    ];

    const scanHistory = [
        { id: 1, date: '12 Okt 2026', status: 'Bercak Daun', severity: 'Tinggi', type: 'Late Blight' },
        { id: 2, date: '10 Okt 2026', status: 'Sehat', severity: 'Normal', type: 'Normal' },
        { id: 3, date: '08 Okt 2026', status: 'Kuning', severity: 'Sedang', type: 'Virus Kuning' },
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
                        <div className="bg-emerald-100 p-2 rounded-xl group-hover:bg-emerald-200 transition-colors">
                            <Leaf className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">Agri<span className="text-emerald-600">Tomat</span></span>
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
                            <a
                                key={item.name}
                                href={item.href}
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
                            </a>
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

                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg border border-sky-100">
                            <CloudSun size={18} className="text-sky-500" />
                            <span className="text-sm font-medium">Jember, 24°C <span className="opacity-60 font-normal px-1">•</span> Cerah Berawan</span>
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
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || 'Petani Cerdas'}</p>
                                <p className="text-xs text-slate-500">Premium Plan</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-100 border-2 border-emerald-50 flex items-center justify-center text-emerald-700 font-bold overflow-hidden shadow-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Stats & Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                        {/* Page Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Ringkasan Lahan Hari Ini</h1>
                            <p className="text-slate-500 text-sm mt-1">Pantau kondisi lahan dan hasil diagnosa AI Anda secara real-time.</p>
                        </div>

                        {/* Top Widgets */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Widget 1: Cuaca */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Status Iklim Area Lahan</p>
                                        <h3 className="text-2xl font-bold text-slate-900">Waspada</h3>
                                        <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1.5">
                                            <AlertTriangle size={14} /> Kelembapan &gt; 85% besok
                                        </p>
                                    </div>
                                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                        <CloudSun size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Widget 2: Lahan */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Jumlah Lahan Dikelola</p>
                                        <h3 className="text-2xl font-bold text-slate-900">3 Petak <span className="text-sm font-normal text-slate-400">/ 500m²</span></h3>
                                        <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1.5">
                                            <CheckCircle2 size={14} /> Semua sensor aktif
                                        </p>
                                    </div>
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <Sprout size={24} />
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
                                        <Bot size={24} />
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
                                    <h3 className="text-red-800 font-semibold mb-2">Risiko Penyakit Late Blight (Busuk Daun) Meningkat</h3>
                                    <p className="text-red-600 text-sm leading-relaxed mb-4">
                                        Sistem kami mendeteksi tren <strong>kelembapan tinggi (&gt;80%)</strong> berturut-turut pada malam hari dipadu dengan suhu 18-22°C di Petak Lahan A (varietas Victory F1). Kondisi ini sangat ideal bagi penyebaran patogen Phytophthora infestans.
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                                            Jadwalkan Penyemprotan
                                        </button>
                                        <button className="bg-white text-slate-700 border border-slate-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            Lihat Detail BMKG
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1.5"><BrainCircuit size={14} className="text-emerald-500" /> Dianalisis oleh AI 2 menit lalu</span>
                                    <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">Lihat semua insight</a>
                                </div>
                            </div>

                            {/* Riwayat Scan (Takes 1 column) */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[400px]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-slate-900">Riwayat Scan Daun</h2>
                                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                    {scanHistory.map((scan) => (
                                        <div key={scan.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {/* Placeholder for leaf photo */}
                                                <ScanLine size={24} className="text-slate-400 group-hover:scale-110 transition-transform" />
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
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl hover:bg-emerald-100 transition-colors">
                                        <ScanLine size={16} />
                                        Mulai Scan Baru
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPage;
