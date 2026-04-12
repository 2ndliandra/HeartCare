import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Activity,
    Stethoscope,
    HeartPulse,
    ClipboardList,
    Heart,
    BrainCircuit,
    ChevronRight,
    BookOpen,
    ArrowUpRight,
    Info,
    FileText
} from 'lucide-react';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

const RekomendasiMedisPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/articles');
            // Take top 6 published articles for recommendation
            const published = res.data.data
                .filter((a: any) => a.status === 'published')
                .slice(0, 6);
            setArticles(published);
        } catch (err) {
            console.error('Fetch recommendations error:', err);
        } finally {
            setLoading(false);
        }
    };

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
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: true },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
    ];

    const recommendations = {
        title: "Panduan Pemulihan & Pencegahan Jantung Koroner",
        description: "Berdasarkan rincian pemeriksaan terakhir Anda, sistem kami menyarankan panduan berikut untuk menurunkan risiko kardiovaskular secara bertahap.",
        priority: [
            { id: 1, title: "Kontrol Tekanan Darah", icon: HeartPulse, color: "text-red-600", bg: "bg-red-50", content: "Targetkan tekanan darah di bawah 120/80 mmHg melalui diet rendah garam dan konsultasi medis rutin." },
            { id: 2, title: "Manajemen Kolesterol", icon: Activity, color: "text-amber-600", bg: "bg-amber-50", content: "Fokus pada penurunan LDL hingga < 70 mg/dL untuk mencegah pembentukan plak baru pada pembuluh darah." },
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
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

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                        <h1 className="text-xl font-bold text-slate-900">Rekomendasi Medis</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm shadow-slate-100 flex flex-col md:flex-row">
                            <div className="p-8 md:p-12 md:w-2/3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg mb-4">
                                    <BrainCircuit size={12} /> AI Tailored Guide
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">{recommendations.title}</h1>
                                <p className="text-slate-500 leading-relaxed mb-8">{recommendations.description}</p>
                                
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {recommendations.priority.map(item => (
                                        <div key={item.id} className={`${item.bg} p-5 rounded-2xl border border-transparent hover:border-slate-100 transition-all group`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <item.icon size={20} className={item.color} />
                                                <h3 className={`text-sm font-bold ${item.color.replace('text-', 'text-opacity-80 text-')}`}>{item.title}</h3>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-100 p-8 flex items-center justify-center md:w-1/3 border-l border-slate-50">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-slate-200/50 flex items-center justify-center mx-auto mb-4">
                                        <Stethoscope size={40} className="text-primary" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Partner</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-slate-900">Edukasi Pilihan Anda</h2>
                                <Link to="/articles" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Lihat Selengkapnya <ChevronRight size={18} />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="bg-white h-72 rounded-3xl border border-slate-100 animate-pulse"></div>
                                    ))
                                ) : articles.length > 0 ? (
                                    articles.map(article => (
                                        <div key={article.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                                            <div className="h-44 overflow-hidden relative bg-slate-50">
                                                {article.thumbnail ? (
                                                    <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200"><FileText size={48} /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                     <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-primary shadow-lg"><ArrowUpRight size={20} /></div>
                                                </div>
                                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-primary uppercase shadow-sm">
                                                    {article.category}
                                                </div>
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-4 line-clamp-2 min-h-[3rem]">{article.title}</h3>
                                                <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                                    <span className="flex items-center gap-1"><BookOpen size={12} /> {new Date(article.created_at).toLocaleDateString()}</span>
                                                    <Link to={`/article/${article.slug}`} className="text-slate-900 font-bold hover:text-primary underline decoration-primary/20 hover:decoration-primary transition-all underline-offset-4">Buka Detail</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-slate-400 py-12">Belum ada konten edukasi tersedia.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600 flex-shrink-0"><Info size={20} /></div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Informasi & Penyangkalan</h4>
                                <p className="text-blue-700/70 text-xs leading-relaxed">Rekomendasi ini disusun secara otomatis oleh HeartPredict AI berdasarkan dataset medis global. Harap selalu konsultasikan hasil diagnosa dan panduan edukasi ini dengan dokter spesialis jantung Anda untuk penanganan yang tepat.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RekomendasiMedisPage;
