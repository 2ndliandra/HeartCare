import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    ShieldCheck,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

const CekKesehatanPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        bloodPressure: '',
        cholesterol: '',
        heartRate: '',
        history: [] as string[]
    });

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
        { name: 'Cek Kesehatan', icon: Activity, href: '/user/cek-kesehatan', current: true },
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi', current: false },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi', current: false },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
        { name: 'Profil Saya', icon: User, href: '/user/profile', current: false },
    ];

    const toggleHistory = (item: string) => {
        setFormData(prev => ({
            ...prev,
            history: prev.history.includes(item)
                ? prev.history.filter(h => h !== item)
                : [...prev.history, item]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            // Give 2 seconds of "AI Processing" feeling
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await api.post('/predict', formData);

            setIsAnalyzing(false);
            navigate('/user/hasil-prediksi', {
                state: {
                    prediction: response.data,
                    formData: formData
                }
            });
        } catch (error) {
            console.error('Prediction error:', error);
            setIsAnalyzing(false);
            alert('Gagal melakukan analisis AI. Pastikan server backend dan Python terkonfigurasi dengan benar.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar (same as UserPage) */}
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
                        <h1 className="text-xl font-bold text-slate-900">Pemeriksaan Jantung AI</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">

                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                            <div className="bg-primary p-8 md:p-12 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold mb-4">Mulai Diagnosa Baru</h2>
                                    <p className="text-emerald-100/80 max-w-xl">Lengkapi data kesehatan Anda di bawah ini. AI kami akan menganalisis parameter tersebut dan memberikan prediksi risiko penyakit jantung dalam hitungan detik.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Informasi Dasar
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Usia (Tahun)</label>
                                            <input
                                                required
                                                type="number"
                                                placeholder="Contoh: 45"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Jenis Kelamin</label>
                                            <select
                                                required
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                            >
                                                <option value="">Pilih Jenis Kelamin</option>
                                                <option value="male">Laki-laki</option>
                                                <option value="female">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Parameter Kesehatan (Vitals)
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Tekanan Darah (Systolic)</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="120"
                                                    value={formData.bloodPressure}
                                                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all pr-12"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mmHg</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Kadar Kolesterol</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="200"
                                                    value={formData.cholesterol}
                                                    onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })}
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all pr-12"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mg/dL</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Detak Jantung</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="75"
                                                    value={formData.heartRate}
                                                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all pr-12"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">BPM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                        Riwayat Penyakit & Kebiasaan
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['Hipertensi', 'Diabetes', 'Merokok', 'Kurang Olahraga', 'Stres', 'Gemuk (Obese)', 'Keturunan', 'Lainnya'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => toggleHistory(item)}
                                                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${formData.history.includes(item)
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-primary/30'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Footer */}
                                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 text-slate-500 max-w-xs">
                                        <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                                        <p className="text-[10px] leading-relaxed italic">Data Anda dienkripsi dan hanya digunakan untuk keperluan analisis AI prediktif oleh HeartPredict.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAnalyzing}
                                        className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Menganalisis...
                                            </>
                                        ) : (
                                            <>
                                                Mulai Analisis AI <BrainCircuit size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Panduan Pengisian</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Gunakan alat ukur tensi digital dan pastikan Anda dalam kondisi istirahat (rileks) sebelum mengambil data vitals agar diagnosa AI lebih akurat.</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex gap-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Mekanisme Kerja AI</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Kami menggunakan model <strong>Random Forest Classifier</strong> yang telah dilatih pada puluhan ribu dataset klinis untuk mendeteksi pola risiko tinggi penyakit jantung.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default CekKesehatanPage;
