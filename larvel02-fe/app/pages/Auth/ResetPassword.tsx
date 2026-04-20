// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Extract token and email from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid password reset link. Please request a new one.');
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !email) {
            setError('Invalid reset link.');
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords don't match!");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authService.resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            if (response.success) {
                setSuccess('Password has been successfully reset. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.message || 'Failed to reset password.');
            }
        } catch (err: any) {
            console.error('Reset password error', err);
            setError(err.response?.data?.message || err.response?.data?.email?.[0] || 'An error occurred during password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50">
            {/* Background gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-md mx-auto px-6 relative z-10 py-8">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="group flex items-center justify-center">
                        <div className="bg-white p-2.5 rounded-xl shadow-md border border-gray-100 group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Heart className="w-6 h-6 text-primary" />
                            <span className="font-bold text-lg text-slate-900 hidden sm:block">HeartPredict</span>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <Card className="mt-4 shadow-xl border-none">
                    <CardContent className="p-6 sm:p-8 sm:pb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">Create New Password</h2>
                        <p className="text-gray-500 text-xs mb-5 pb-5 border-b border-gray-200 leading-relaxed">
                            Your new password must be securely chosen and at least 6 characters long.
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg mb-4 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={!token || !email || !!success}
                                placeholder="Enter new password"
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />

                            <Input
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                disabled={!token || !email || !!success}
                                placeholder="Confirm new password"
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />

                            <Button
                                type="submit"
                                disabled={loading || !token || !email || !!success}
                                isLoading={loading}
                                className="w-full mt-4"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                            <Link to="/login" className="text-primary hover:underline font-medium block mb-2">
                                Return to Login
                            </Link>
                            © 2026 HeartPredict
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
