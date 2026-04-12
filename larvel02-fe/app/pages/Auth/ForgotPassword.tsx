import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { 
  Heart, 
  ArrowLeft, 
  KeyRound, 
  Mail, 
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: Token
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authService.forgotPassword({ email });
            if (response.success) {
                setSuccess('Kode verifikasi telah dikirim ke email Anda.');
                setStep(2);
            } else {
                setError(response.message || 'Gagal mengirim email reset.');
            }
        } catch (err: any) {
            console.error('Forgot password error', err);
            setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.verifyToken({ email, token });
            if (response.success) {
                navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
            } else {
                setError(response.message || 'Kode verifikasi tidak valid.');
            }
        } catch (err: any) {
            console.error('Verify token error', err);
            setError(err.response?.data?.message || 'Kode yang Anda masukkan salah atau kedaluwarsa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden">
            {/* Background Background matching Login/Register */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none" />

            {/* Wrapper Container */}
            <div className="w-full max-w-md mx-auto px-6 relative z-10 py-10">
                
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <Link to="/" className="flex items-center gap-2.5 bg-white px-3.5 py-2.5 rounded-xl shadow-md border border-gray-100 mb-8 transition-transform hover:scale-105">
                        <Heart className="w-6 h-6 text-primary" />
                        <span className="font-bold text-slate-900">HeartPredict</span>
                    </Link>
                </div>

                {/* Main Card Section */}
                <div className="bg-[#fcfcfc] rounded-lg shadow-xl p-6 sm:p-8 w-full border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
                            {step === 1 ? 'Forget Password' : 'Verify Identity'}
                        </h2>
                        <p className="text-gray-500 text-xs pb-5 border-b border-gray-200 leading-normal">
                            {step === 1 
                                ? 'Enter your registered email address below to receive a password reset verification code.'
                                : `We have sent a 6-digit security token to your email address. Please enter it below to continue.`
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-xs font-medium flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded mb-4 text-xs font-medium flex items-start gap-2">
                            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                            {success}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendEmail} className="space-y-5">
                            <div>
                                <label className="block text-gray-700 text-xs font-medium mb-1.5 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-[#f4f4f4] border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                        placeholder="yourname@email.com"
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                                
                                <Link to="/login" className="flex items-center justify-center gap-1.5 py-1 text-xs text-[#5294e2] hover:underline font-medium">
                                    <ArrowLeft size={14} /> Back to Sign In
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyToken} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-xs font-medium mb-1.5 uppercase tracking-wider text-center">Enter 6-Digit Token</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                    required
                                    className="w-full bg-[#f4f4f4] border border-gray-200 rounded px-4 py-4 text-2xl font-bold tracking-[0.5em] text-center text-slate-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all shadow-inner"
                                    placeholder="------"
                                />
                            </div>

                            <div className="flex flex-col gap-5 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || token.length !== 6}
                                    className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? 'Verifying Token...' : 'Verify & Continue'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                                
                                <div className="flex items-center justify-center gap-5 pt-1">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)} 
                                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium transition-colors"
                                    >
                                        <ArrowLeft size={14} /> Wrong Email?
                                    </button>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <button 
                                        type="button" 
                                        onClick={handleSendEmail} 
                                        className="text-xs text-[#5294e2] hover:underline flex items-center gap-1 font-medium transition-colors"
                                    >
                                        <RefreshCcw size={14} /> Resend Code
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-8 text-center text-[11px] text-gray-400">
                    © 2026 HeartPredict Digital Labs <br />
                    Secure AES-256 Medical Data Encryption
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
