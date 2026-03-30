import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { Leaf, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authService.forgotPassword({ email });
            if (response.success) {
                setSuccess('Password reset link has been sent to your email.');
                setEmail('');
            } else {
                setError(response.message || 'Failed to send reset link.');
            }
        } catch (err: any) {
            console.error('Forgot password error', err);
            setError(err.response?.data?.message || err.response?.data?.email?.[0] || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50">
            {/* Background gradients matching landing page */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-md mx-auto px-6 relative z-10 py-8">
                
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="group flex items-center justify-center">
                        <div className="bg-white p-2.5 rounded-xl shadow-md border border-gray-100 group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Leaf className="w-6 h-6 text-emerald-600" />
                            <span className="font-bold text-lg text-slate-900 hidden sm:block">Agri<span className="text-emerald-600">Tomat</span></span>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-[#fcfcfc] rounded-lg shadow-xl p-6 sm:p-8 w-full border border-gray-100">
                    <div>
                        <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-1.5" /> Back to Login
                        </Link>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">Forgot Password?</h2>
                        <p className="text-gray-500 text-xs mb-5 pb-5 border-b border-gray-200 leading-relaxed">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded mb-4 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-xs font-medium mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#f4f4f4] border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                                    placeholder="Enter your registered email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white text-sm font-medium py-3 rounded hover:bg-gray-800 transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                        © 2026 AgriTomat • Privacy Policy • Terms of Service
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
