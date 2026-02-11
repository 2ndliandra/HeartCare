import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                const { token, user, roles } = response.data;
                localStorage.setItem('auth_token', token);
                // Store roles in user object if not present or separately if needed
                // But typically response.data.user might not have roles if it's from the user model directly without append
                // So let's store roles separately or merge them
                const userWithRoles = { ...user, roles };
                localStorage.setItem('user', JSON.stringify(userWithRoles));

                if (roles && roles.includes('admin')) {
                    navigate('/admin');
                } else if (roles && roles.includes('user')) {
                    navigate('/user');
                } else {
                    // Fallback if no specific role or unexpected role
                    navigate('/');
                }
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            console.error('Login error', err);
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
            {/* Decorative Geometric Shapes */}
            <div className="absolute top-10 right-20 w-16 h-16 bg-blue-500 rounded-lg transform rotate-12 opacity-20"></div>
            <div className="absolute top-32 right-40 w-12 h-12 bg-blue-500 opacity-15"></div>
            <div className="absolute bottom-20 right-32 w-20 h-20 bg-blue-500 rounded-lg opacity-10"></div>
            <div className="absolute top-20 right-10">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 0L24.5 15.5L40 20L24.5 24.5L20 40L15.5 24.5L0 20L15.5 15.5L20 0Z" fill="#4F7CFF" opacity="0.3" />
                </svg>
            </div>

            {/* Decorative Circles - Left Side */}
            <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20">
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full border-[20px] border-blue-400"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full border-[15px] border-blue-200"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-white"></div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side - Branding */}
                <div className="text-gray-900 space-y-8 hidden lg:block">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold italic text-gray-900">ENGLISH LEARNER</span>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                            MASTER<br />
                            <span className="text-[#4F7CFF]">ENGLISH</span><br />
                            WITH EASE
                        </h1>
                        <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                            Join over 1 million learners worldwide and start your journey to fluency today. High-energy, high-impact learning.
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">WELCOME BACK</h2>
                            <p className="text-gray-600 text-sm">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-[#4F7CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 transition-all"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-[#4F7CFF] hover:text-[#6B8FFF] transition-colors">
                                        FORGOT PASSWORD?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-[#4F7CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 pl-2 flex items-center text-gray-600 hover:text-[#4F7CFF] transition-colors focus:outline-none focus:ring-0 focus:shadow-none active:shadow-none bg-transparent border-0"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#4F7CFF] focus:ring-[#4F7CFF]"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-700 font-medium">
                                    REMEMBER ME
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4F7CFF] hover:bg-[#6B8FFF] text-white font-bold py-3.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#4F7CFF]/30 flex items-center justify-center gap-2"
                            >
                                {loading ? 'SIGNING IN...' : 'SIGN IN'}
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white text-gray-500 uppercase tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-[#4F7CFF] hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-[#4F7CFF] hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all">
                                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-medium">Facebook</span>
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-[#4F7CFF] hover:text-[#6B8FFF] transition-colors">
                                SIGN UP FOR FREE
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Back to Home Link */}
            <Link
                to="/"
                className="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:text-gray-900 hover:border-[#4F7CFF] transition-all z-20 shadow-md"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-semibold">Back to Home</span>
            </Link>
        </div>
    );
};

export default Login;
