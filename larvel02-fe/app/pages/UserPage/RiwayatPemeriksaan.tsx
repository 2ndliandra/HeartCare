import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    Heart,
    BrainCircuit,
    Bot,
    ChevronRight,
    Search,
    Filter,
    FileText
} from 'lucide-react';
import { authService } from '../../lib/authService';

const RiwayatPemeriksaanPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
        { name: 'Beranda', icon: LayoutDashboard, href: '/user', current: false },
        { name: 'Cek Kesehatan', icon: Activity, href: '/user/cek-kesehatan', current: false, hasNotification: true },
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi', current: false },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi', current: false },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: true },
    ];

    const historyData = [
        {
            id: 1,
            date: '12 Okt 2026',
            time: '09:45 WIB',
            type: 'Penyakit Jantung Koroner',
            result: 'Risiko Tinggi',
            severity: 'High',
            params: { bp: '145/95', chol: '240', hr: '88' },
            doctorNote: 'Disarankan untuk segera konsultasi spesialis jantung karena indikasi hipertensi dan kolesterol tinggi.'
        },
        {
            id: 2,
            date: '10 Okt 2026',
            time: '14:20 WIB',
            type: 'Pemeriksaan Rutin',
            result: 'Sehat',
            severity: 'Normal',
            params: { bp: '118/78', chol: '180', hr: '72' },
            doctorNote: 'Kondisi stabil. Pertahankan pola makan seimbang dan olahraga teratur.'
        },
        {
            id: 3,
            date: '08 Okt 2026',
            time: '10:15 WIB',
            type: 'Hipertensi',
            result: 'Risiko Sedang',
            severity: 'Moderate',
            params: { bp: '135/88', chol: '210', hr: '80' },
            doctorNote: 'Waspadai asupan garam dan perbaiki manajemen stres.'
        },
        {
            id: 4,
            date: '01 Okt 2026',
            time: '08:30 WIB',
            type: 'Evaluasi Tahunan',
            result: 'Risiko Sedang',
            severity: 'Moderate',
            params: { bp: '140/90', chol: '225', hr: '85' },
            doctorNote: 'Terdapat peningkatan tekanan darah dibanding hasil tahun lalu. Perlu monitoring mingguan.'
        }
    ];

    const filteredHistory = historyData.filter(item => 
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

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
                        <h1 className="text-xl font-bold text-slate-900">Riwayat Pemeriksaan</h1>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                        
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Cari berdasarkan tanggal atau jenis keluhan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm transition-all"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-medium text-sm shadow-sm group">
                                <Filter size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                                Filter Lanjutan
                            </button>
                        </div>

                        {/* Stats Banner */}
                        <div className="bg-emerald-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Total Pemeriksaan Jantung</h2>
                                    <p className="text-emerald-100/80">Anda telah melakukan <strong>{historyData.length} kali</strong> pemeriksaan bulan ini.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 mb-1">Sehat</p>
                                        <p className="text-2xl font-bold">1</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 mb-1">Berisiko</p>
                                        <p className="text-2xl font-bold">3</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History Records List */}
                        <div className="space-y-4">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 hover:shadow-lg transition-all group">
                                        {/* Result Summary */}
                                        <div className="lg:w-1/4 flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-2xl ${
                                                    item.severity === 'High' ? 'bg-red-50 text-red-600' :
                                                    item.severity === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    <HeartPulse size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                                                    <p className="text-xs text-slate-400">{item.time}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{item.type}</h3>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    item.severity === 'High' ? 'bg-red-100 text-red-700' :
                                                    item.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {item.result}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Parameter Pills */}
                                        <div className="lg:flex-1 grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tekanan Darah</p>
                                                <p className="font-bold text-lg text-slate-800">{item.params.bp}</p>
                                                <p className="text-[10px] text-slate-500">mmHg</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Kolesterol</p>
                                                <p className="font-bold text-lg text-slate-800">{item.params.chol}</p>
                                                <p className="text-[10px] text-slate-500">mg/dL</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Detak Jantung</p>
                                                <p className="font-bold text-lg text-slate-800">{item.params.hr}</p>
                                                <p className="text-[10px] text-slate-500">BPM</p>
                                            </div>
                                        </div>

                                        {/* Notes & Action */}
                                        <div className="lg:w-1/3 flex flex-col justify-between pt-6 lg:pt-0 lg:pl-8 lg:border-l border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase">
                                                    <FileText size={14} /> Catatan Medis AI
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                                    {item.doctorNote}
                                                </p>
                                            </div>
                                            <button className="flex items-center gap-2 mt-6 text-sm font-bold text-primary hover:gap-3 transition-all">
                                                Lihat Rincian Laporan <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <ClipboardList size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Tidak ada riwayat ditemukan</h3>
                                    <p className="text-slate-500 text-sm">Coba sesuaikan kata kunci atau ganti filter pencarian.</p>
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="mt-8 text-center p-8 bg-blue-50 rounded-[2rem] border border-blue-100 border-dashed">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Ingin melakukan pemeriksaan lagi?</h3>
                            <p className="text-blue-700/70 text-sm mb-6 max-w-md mx-auto">Pantau kondisi Anda setiap hari untuk mendapatkan diagnosis yang lebih akurat dari AI kami.</p>
                            <button className="px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto">
                                <Activity size={18} /> Mulai Cek Kesehatan Baru
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default RiwayatPemeriksaanPage;
