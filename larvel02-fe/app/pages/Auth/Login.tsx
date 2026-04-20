import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, HeartPulse, Loader2, LogIn, AlertCircle, X } from 'lucide-react';
import { authService } from '~/lib/authService';
import { Button } from '~/components/ui/button';
import { Input, Label } from '~/components/ui/input';
import { Card } from '~/components/ui/card';
import { useToast } from '~/hooks/useToast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.roles && user.roles.includes('admin')) {
                        navigate('/admin');
                    } else {
                        navigate('/user');
                    }
                }
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email || !password) {
            setError("Email dan password harus diisi");
            setLoading(false);
            return;
        }

        try {
            const response = await authService.login({ email, password });
            
            if (response && response.success) {
                // Determine user data and token structure
                // Backend AuthController.php returns (UserResource)->additional([... 'data' => ['token' => $token]])
                // This might cause response.data to be just {token: ...} or it might be merged.
                // Based on UserResource, the user data is also there.
                
                const token = response.data?.token || response.token;
                
                if (token) {
                    // Save token
                    localStorage.setItem('auth_token', token);
                    localStorage.setItem('auth_token_set_at', Date.now().toString());
                    
                    // The user data might be in response.data or merged into response
                    // In Laravel resources, the resource is usually in 'data'
                    // If 'additional' was used, they might be siblings.
                    
                    // Let's store the whole response.data for roles check in ProtectedRoute
                    const userData = {
                        ...response.data,
                        ...response // fallback check
                    };
                    
                    // Extract roles properly
                    const roles = userData.roles || (response.data && response.data.roles) || [];
                    
                    localStorage.setItem('user', JSON.stringify({
                        ...userData,
                        roles: roles
                    }));

                    toast({
                        title: "Login berhasil!",
                        description: `Selamat datang kembali, ${userData.name || 'User'}!`,
                        variant: "success",
                        duration: 2000
                    });

                    setTimeout(() => {
                        if (roles.includes('admin')) {
                            navigate('/admin');
                        } else {
                            navigate('/user');
                        }
                    }, 1000);
                } else {
                    setError("Token tidak ditemukan dalam respon server");
                }
            } else {
                setError(response.message || "Email atau password salah. Silakan coba lagi.");
            }
        } catch (err: any) {
            console.error('Login error', err);
            setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mencoba masuk.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2 font-sans">
            {/* Left Panel (Brand) - Desktop Only */}
            <div className="hidden lg:flex bg-emerald-600 p-12 flex-col justify-center items-center relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-500/30 rounded-bl-full z-0" />
                <div className="absolute bottom-20 right-10 w-56 h-56 bg-emerald-700/20 rounded-tr-full z-0" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-left duration-500 fade-in">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <HeartPulse className="w-7 h-7 text-emerald-600" />
                        </div>
                        <span className="text-2xl font-bold text-white font-display">
                            HeartPredict
                        </span>
                    </div>

                    <div className="mb-8 animate-in slide-in-from-left duration-500 fade-in delay-100 fill-mode-both">
                        {/* Placeholder for illustration. Reusing HeartPulse as giant visual if no SVG available */}
                        <div className="w-64 h-64 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <HeartPulse className="w-32 h-32 text-emerald-100 opacity-80" />
                        </div>
                    </div>

                    <div className="text-center max-w-md animate-in slide-in-from-left duration-500 fade-in delay-200 fill-mode-both">
                        <h2 className="text-3xl font-bold text-white mb-4 font-display">
                            Jaga Kesehatan Jantung Anda
                        </h2>
                        <p className="text-emerald-100 leading-relaxed">
                            Platform prediksi risiko berbasis AI dengan akurasi tinggi dan konsultasi 24/7
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 lg:bg-transparent p-6 lg:p-12 relative animate-in slide-in-from-right duration-500 fade-in">
                {/* Logo Mobile */}
                <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 font-display">HeartPredict</span>
                </div>

                <Card className="w-full max-w-md shadow-lg border-slate-200">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
                            Masuk ke HeartPredict
                        </h1>
                        <p className="text-sm text-slate-600 mb-8">
                            Selamat datang kembali! Silakan masuk untuk melanjutkan.
                        </p>

                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span className="text-sm text-red-700 font-medium">{error}</span>
                                <button 
                                    onClick={() => setError(null)}
                                    className="ml-auto absolute top-4 right-4"
                                >
                                    <X className="w-4 h-4 text-red-400 hover:text-red-600 focus:outline-none" />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Label htmlFor="email" required>Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    iconLeft={<Mail />}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="password" required>Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan password Anda"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    iconLeft={<Lock />}
                                    passwordToggle
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0 transition-colors cursor-pointer"
                                    />
                                    <Label htmlFor="remember" className="mb-0 text-sm font-normal cursor-pointer select-none">
                                        Ingat saya
                                    </Label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full flex items-center justify-center group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Memproses...
                                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Masuk
                                        <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <div className="relative flex items-center justify-center my-6">
                                <div className="border-t border-slate-200 w-full"></div>
                                <span className="absolute bg-white px-4 text-xs font-semibold text-slate-500 uppercase">
                                    ATAU
                                </span>
                            </div>

                            <div className="text-center text-sm text-slate-600">
                                Belum punya akun?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    Daftar sekarang
                                </Link>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
