import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, HeartPulse, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '~/lib/authService';
import { Button } from '~/components/ui/button';
import { Input, Label } from '~/components/ui/input';
import { useToast } from '~/hooks/useToast';

const carePoints = [
  'Analisis faktor risiko jantung dalam satu alur yang lebih tenang.',
  'Riwayat checkup dan edukasi kesehatan tetap terhubung setelah Anda masuk.',
  'Akses cepat ke dashboard pengguna maupun admin sesuai peran akun.',
];

const loginSignals = [
  { label: 'Status sistem', value: 'Siap digunakan' },
  { label: 'Akses akun', value: 'User & Admin' },
  { label: 'Pendekatan', value: 'Clinical editorial' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      if (user.roles && user.roles.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch {
      navigate('/user');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email dan password harus diisi');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });

      if (response && response.success) {
        const token = response.access_token || response.token || response.data?.token || response.data?.access_token;

        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_token_set_at', Date.now().toString());

          const userData = {
            ...response.data,
            ...response.user,
            ...(response.user?.data || {}),
            ...response,
          };

          const roles = userData.roles || [];

          localStorage.setItem(
            'user',
            JSON.stringify({
              ...userData,
              roles,
              rememberMe,
            })
          );

          toast({
            title: 'Login berhasil!',
            description: `Selamat datang kembali, ${userData.name || 'User'}!`,
            variant: 'success',
            duration: 2000,
          });

          setTimeout(() => {
            if (roles.includes('admin')) {
              navigate('/admin');
            } else {
              navigate('/user');
            }
          }, 1000);
        } else {
          setError('Token tidak ditemukan dalam respon server');
        }
      } else {
        setError(response.message || 'Email atau password salah. Silakan coba lagi.');
      }
    } catch (err: any) {
      console.error('Login error', err);
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mencoba masuk.');
    } finally {
      setLoading(false);
    }
  };

  const registerMessage = (location.state as { message?: string } | null)?.message;

  return (
    <div className="min-h-screen bg-[#f8fbf8] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <section className="relative overflow-hidden border-b border-slate-200 px-6 py-14 md:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-16 xl:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.08),_transparent_32%)]" />
          <div className="relative mx-auto flex h-full max-w-3xl flex-col justify-between gap-12">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 text-slate-950 transition-opacity hover:opacity-80">
                <HeartPulse className="h-6 w-6 text-emerald-700" />
                <span className="font-display text-2xl font-bold tracking-[-0.03em]">HeartCare</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </Link>

              <div className="mt-14 max-w-2xl">
                <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-700/80">
                  Secure account access
                </p>
                <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl xl:text-7xl">
                  Masuk untuk lanjut
                  <br />
                  ke <span className="font-serif italic text-emerald-700">dashboard</span> kesehatan Anda
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Masuk ke akun HeartCare untuk melanjutkan pemantauan kesehatan, melihat riwayat prediksi,
                  dan mengakses rekomendasi yang sesuai dengan kondisi Anda.
                </p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] xl:items-end">
              <div className="border-y border-slate-200 bg-white/70 py-6 backdrop-blur-sm">
                <div className="space-y-5">
                  {carePoints.map((point, index) => (
                    <div key={point} className="grid gap-2 border-b border-slate-200/80 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[52px_minmax(0,1fr)] md:items-start">
                      <span className="text-3xl font-light tracking-[-0.05em] text-emerald-700/75">
                        0{index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-600 md:text-[15px]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden border border-emerald-950/10 bg-white p-6">
                <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_70%)]" />
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Akses akun</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Portal Masuk</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-700/20 text-emerald-700">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {loginSignals.map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Setelah autentikasi berhasil, sistem akan mengarahkan Anda ke route yang sesuai dengan peran akun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-14 md:px-8 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-700/80">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                Masuk ke akun HeartCare
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                Gunakan email dan password Anda untuk membuka riwayat checkup, hasil prediksi, dan rekomendasi berikutnya.
              </p>
            </div>

            {registerMessage && (
              <div className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {registerMessage}
              </div>
            )}

            {error && (
              <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 border border-slate-200 bg-white p-6 md:p-8">
              <div>
                <Label htmlFor="email" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  iconLeft={<Mail className="h-4 w-4" />}
                  disabled={loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="password" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  iconLeft={<Lock className="h-4 w-4" />}
                  passwordToggle
                  disabled={loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="remember" className="inline-flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                  />
                  Ingat saya
                </label>
                <Link
                  to="/forgot-password"
                  className="inline-flex w-fit items-center gap-2 border-b border-emerald-700 pb-1 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-600"
                >
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke akun
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Belum punya akun?{' '}
                <Link to="/register" className="font-medium text-emerald-700 transition-colors hover:text-emerald-600">
                  Daftar sekarang
                </Link>
              </p>
            </form>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">
              Route masuk aktif di /login dan tetap terhubung dengan /forgot-password serta /register.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
