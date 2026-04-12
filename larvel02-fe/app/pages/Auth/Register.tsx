import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { Eye, EyeOff, Heart } from 'lucide-react';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            title: "Deteksi Dini",
            description: "Sistem prediksi penyakit jantung berbasis AI untuk membantu Anda mendeteksi risiko lebih awal dan mengambil tindakan preventif yang tepat."
        },
        {
            title: "Pemantauan Mandiri",
            description: "Membantu Anda dalam memantau kondisi kesehatan secara mandiri dengan antarmuka yang mudah digunakan dan hasil yang akurat."
        },
        {
            title: "Rekomendasi Cerdas",
            description: "Memberikan saran tindak lanjut dan rekomendasi kesehatan berdasarkan analisis data medis Anda secara menyeluruh dan personal."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authService.register({ name, email, password });
            if (response.success) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/login');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            console.error('Registration error', err);
            setError(err.response?.data?.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center overflow-hidden bg-slate-50">
            {/* Background gradients matching landing page */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-16 relative z-10 py-8 lg:py-10">

                {/* Left Side: Logo and Form Card */}
                <div className="flex flex-col relative h-full">
                    {/* Logo */}
                    <Link to="/" className="absolute -top-10 lg:-top-5 -left-2 z-20 group">
                        <div className="bg-white p-2.5 rounded-xl shadow-md border border-gray-100 group-hover:shadow-lg transition-all flex items-center gap-2">
                            <Heart className="w-6 h-6 text-primary" />
                            <span className="font-bold text-slate-900 hidden sm:block">HeartPredict</span>
                        </div>
                    </Link>

                    {/* Card */}
                    <div className="bg-[#fcfcfc] rounded-lg shadow-xl p-6 sm:p-8 w-full mt-4 lg:mt-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">Sign Up</h2>
                            <p className="text-gray-500 text-xs mb-5 pb-5 border-b border-gray-200">
                                Create an account to start using the system and manage your data securely.
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full bg-[#f4f4f4] border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-[#f4f4f4] border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-[#f4f4f4] border border-gray-200 rounded pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none hover:bg-transparent hover:border-transparent focus:outline-none shadow-none"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full bg-[#f4f4f4] border border-gray-200 rounded pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none hover:bg-transparent hover:border-transparent focus:outline-none shadow-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded hover:bg-primary/90 transition-colors mt-4"
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-300 text-sm text-gray-500">
                                Already have an account? <Link to="/login" className="text-[#5294e2] font-medium hover:underline">Sign In</Link> to start using the system
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            © 2026 HeartPredict Privacy Policy • Terms of Service
                        </div>
                    </div>
                </div>

                {/* Right Side: Text Highlights */}
                <div className="hidden lg:flex flex-col justify-center text-gray-900 relative">
                    <div className="mb-6">
                        <Link to="/" className="text-base font-medium text-gray-900 hover:underline">Home</Link>
                        <div className="w-full h-px bg-gray-900 mt-3 mb-12 opacity-80"></div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
                        Start your <br />
                        <span className="text-primary">New Journey</span>
                    </h1>

                    <div className="w-full h-px bg-gray-900 my-6 opacity-80"></div>

                    <div className="flex justify-between items-center mb-3 transition-all duration-500">
                        <h3 className="text-2xl font-medium text-gray-900 h-8 flex items-center">{slides[currentSlide].title}</h3>
                        <div className="flex gap-1.5 opacity-50">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentSlide(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`h-2 rounded-full bg-slate-800 transition-all duration-300 ${currentSlide === idx ? 'w-5 opacity-100' : 'w-2 opacity-50 hover:opacity-100'}`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <div className="h-24">
                        <p className="text-gray-900 text-sm leading-relaxed max-w-xl text-justify font-medium opacity-80 backdrop-blur-sm transition-opacity duration-300 fade-in">
                            {slides[currentSlide].description}
                        </p>
                    </div>

                    <div className="w-full h-px bg-gray-900 mt-8 opacity-80"></div>
                </div>
            </div>
        </div>
    );
};

export default Register;
