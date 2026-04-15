import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Activity,
    Stethoscope,
    ClipboardList,
    Heart,
    BrainCircuit,
    Bot,
    User,
    ChevronRight,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Share2,
    Download,
    BookOpen
} from 'lucide-react';
import { authService } from '../../lib/authService';

const HasilPrediksiPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Get prediction result from navigation state
    const { prediction, formData } = location.state || {
        prediction: { risk: 'Sedang', message: 'Hipertensi Terdeteksi', accuracy: 92.1 },
        formData: { age: 45, bloodPressure: 135, cholesterol: 210, heartRate: 80 }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigation = [
        { name: 'Beranda', icon: LayoutDashboard, href: '/user', current: false },
        { name: 'Cek Kesehatan', icon: Activity, href: '/user/cek-kesehatan', current: false },
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi', current: true },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi', current: false },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
        { name: 'Profil Saya', icon: User, href: '/user/profile', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
    ];

    const getRiskStyles = () => {
        switch (prediction.risk) {
            case 'Tinggi': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle };
            case 'Sedang': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertTriangle };
            default: return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 };
        }
    };

    const styles = getRiskStyles();
    const RiskIcon = styles.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">HeartPredict</span>
                    </Link>
                    <button className="lg:hidden ml-auto text-slate-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu Utama</div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.name} to={item.href} className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${item.current ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-emerald-600' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-blue-400" /> Keluar Akun
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                        <Link to="/user/cek-kesehatan" className="text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft size={24} /></Link>
                        <h1 className="text-xl font-bold text-slate-900">Hasil Analisis AI</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-8">

                        {/* Status Hero Card */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:shadow-2xl">
                            <div className={`p-8 md:p-12 text-center border-b ${styles.border} ${styles.bg}`}>
                                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 ${styles.border.replace('border-', 'border-opacity-50 border-')} flex items-center justify-center mx-auto mb-6 bg-white shadow-xl`}>
                                    <RiskIcon className={`w-12 h-12 sm:w-16 sm:h-16 ${styles.color} animate-pulse`} />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Diagnosa Risiko</p>
                                <h2 className={`text-4xl sm:text-5xl font-black ${styles.color} mb-3`}>{prediction.risk}</h2>
                                <h3 className="text-xl font-semibold text-slate-800 mb-6">{prediction.message}</h3>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 text-xs font-bold text-slate-500">
                                    <BrainCircuit size={14} className="text-primary" /> Akurasi Model: {prediction.accuracy}%
                                </div>
                            </div>

                            {/* Metrics Breakdown */}
                            <div className="p-8 md:p-12 bg-white">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Tekanan Darah</p>
                                        <p className="text-xl font-bold text-slate-900">{formData.bloodPressure} <span className="text-xs font-normal text-slate-400">mmHg</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Kolesterol</p>
                                        <p className="text-xl font-bold text-slate-900">{formData.cholesterol} <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Detak Jantung</p>
                                        <p className="text-xl font-bold text-slate-900">{formData.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Usia Pasien</p>
                                        <p className="text-xl font-bold text-slate-900">{formData.age} <span className="text-xs font-normal text-slate-400">Tahun</span></p>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-slate-50 pt-8">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-emerald-500" size={24} />
                                        <p className="text-xs text-slate-500 leading-relaxed italic max-w-sm">Data ini telah disimpan secara aman dalam riwayat medis Anda. Selalu gunakan rincian ini sebagai referensi awal saat berkonsultasi dengan profesional medis.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><Share2 size={20} /></button>
                                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all text-sm font-bold flex items-center gap-2">
                                            <Download size={20} /> Unduh PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Preview Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-bold text-slate-900">Rekomendasi Pintar</h3>
                                <Link to="/user/rekomendasi" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Lihat Selengkapnya <ChevronRight size={18} />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Link to="/user/rekomendasi" className="group bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        <Stethoscope size={30} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Panduan Medis Tailored</h4>
                                        <p className="text-xs text-slate-500">Lihat instruksi medis berdasarkan hasil diagnosa Anda.</p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                                </Link>

                                <Link to="/articles" className="group bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <BookOpen size={30} className="text-indigo-600 group-hover:text-white transition-all" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Artikel Nutrisi & Diet</h4>
                                        <p className="text-xs text-slate-500">Baca artikel pencegahan terpilih untuk kondisi Anda.</p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Back to Home CTA */}
                        <div className="text-center">
                            <Link to="/user" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                                <LayoutDashboard size={18} /> Kembali ke Beranda Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HasilPrediksiPage;
