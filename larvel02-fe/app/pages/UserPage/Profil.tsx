import React, { useState, useEffect, useRef } from 'react';
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
    Camera,
    Save,
    Lock,
    Phone,
    Mail,
    Loader2
} from 'lucide-react';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: ''
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get user from localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                password: '',
                password_confirmation: ''
            });
            if (user.profile_picture) {
                setPreviewUrl(`http://localhost:8000/storage/${user.profile_picture}`);
            }
        }
    }, []);

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
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi', current: false },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi', current: false },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone_number', formData.phone_number);
        if (profilePicture) {
            data.append('profile_picture', profilePicture);
        }
        if (formData.password) {
            data.append('password', formData.password);
            data.append('password_confirmation', formData.password_confirmation);
        }

        try {
            const response = await api.post('profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // Update local storage user data
                localStorage.setItem('user', JSON.stringify(response.data.user));
                alert('Profil berhasil diperbarui!');
            }
        } catch (error: any) {
            console.error('Update error:', error);
            alert(error.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setIsLoading(false);
        }
    };

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
                        <span className="font-bold text-xl tracking-tight text-slate-900">Heart<span className="text-primary">Predict</span></span>
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
                    <div className="h-px bg-slate-100 my-4 mx-4"></div>
                    <Link to="/user/profile" className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all bg-emerald-50 text-emerald-700">
                        <User className="mr-3 h-5 w-5 text-emerald-600" />
                        Profil Saya
                    </Link>
                </div>
                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-blue-400" /> Keluar Akun
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">Pengaturan Profil</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Profile Header Card */}
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                                <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={48} className="text-slate-300" />
                                            )}
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all scale-90 sm:scale-100"
                                        >
                                            <Camera size={20} />
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left space-y-1">
                                        <h2 className="text-2xl font-bold text-slate-900">{formData.name || 'User Name'}</h2>
                                        <p className="text-slate-500 font-medium">{formData.email}</p>
                                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Member Terverifikasi</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Side: Personal Info */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                                            <User size={18} className="text-primary" /> Identitas Diri
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                        <input 
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                                            placeholder="Nama Lengkap"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                        <input 
                                                            name="phone_number"
                                                            value={formData.phone_number}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                                            placeholder="08xx..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                                <div className="relative opacity-60">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input 
                                                        value={formData.email}
                                                        readOnly
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl cursor-not-allowed text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                                            <Lock size={18} className="text-primary" /> Keamanan Akun
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password Baru (Opsional)</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                    <input 
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Konfirmasi Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                    <input 
                                                        type="password"
                                                        name="password_confirmation"
                                                        value={formData.password_confirmation}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions */}
                                <div className="space-y-6">
                                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 space-y-4">
                                        <h4 className="font-bold text-primary flex items-center gap-2">
                                            <Activity size={18} /> Konsultasi Anda
                                        </h4>
                                        <p className="text-xs text-primary/70 leading-relaxed">Pastikan data Anda akurat demi hasil diagnosa AI yang optimal dan rekomendasi kesehatan yang tepat.</p>
                                        <div className="pt-2">
                                            <div className="flex justify-between items-center text-xs font-bold text-primary mb-1">
                                                <span>Kelengkapan Data</span>
                                                <span>{formData.name && formData.phone_number ? '100' : '70'}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-500" 
                                                    style={{ width: formData.name && formData.phone_number ? '100%' : '70%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
