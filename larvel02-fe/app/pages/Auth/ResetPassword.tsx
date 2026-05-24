import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, HeartPulse, KeyRound, Loader2, Lock } from 'lucide-react';
import { authService } from '~/lib/authService';
import { Button } from '~/components/ui/button';
import { Input, Label } from '~/components/ui/input';

const resetHighlights = [
  'Tautan reset tetap terhubung dengan alur OTP dari halaman /forgot-password.',
  'Password baru langsung digunakan untuk kembali masuk ke dashboard HeartCare.',
  'Bahasa visual dibuat selaras dengan auth pages bernuansa clinical editorial.',
];

const resetSignals = [
  { label: 'Route aktif', value: '/reset-password' },
  { label: 'Input wajib', value: 'password + konfirmasi' },
  { label: 'Status alur', value: 'OTP terverifikasi' },
];

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = queryParams.get('token');
  const email = queryParams.get('email');
  const hasValidResetContext = Boolean(token && email);

  useEffect(() => {
    if (!hasValidResetContext) {
      setError('Link reset password tidak valid. Silakan minta tautan baru dari halaman lupa password.');
    }
  }, [hasValidResetContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError('Link reset password tidak valid.');
      return;
    }

    if (password.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password belum sama.');
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
        password_confirmation: passwordConfirmation,
      });

      if (response.success) {
        setSuccess('Password berhasil diperbarui. Anda akan diarahkan kembali ke halaman login.');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(response.message || 'Reset password gagal diproses.');
      }
    } catch (err: any) {
      console.error('Reset password error', err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.email?.[0] ||
          'Terjadi kesalahan saat memperbarui password.'
      );
    } finally {
      setLoading(false);
    }
  };

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
                  Password recovery
                </p>
                <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl xl:text-7xl">
                  Atur ulang akses
                  <br />
                  ke <span className="font-serif italic text-emerald-700">akun</span> Anda
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Halaman reset password ini diselaraskan dengan bahasa visual landing page dan auth flow baru:
                  lebih lapang, editorial, dan tetap fokus pada alur pemulihan akses yang jelas.
                </p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] xl:items-end">
              <div className="border-y border-slate-200 bg-white/70 py-6 backdrop-blur-sm">
                <div className="space-y-5">
                  {resetHighlights.map((point, index) => (
                    <div
                      key={point}
                      className="grid gap-2 border-b border-slate-200/80 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[52px_minmax(0,1fr)] md:items-start"
                    >
                      <span className="text-3xl font-light tracking-[-0.05em] text-emerald-700/75">0{index + 1}</span>
                      <p className="text-sm leading-7 text-slate-600 md:text-[15px]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden border border-emerald-950/10 bg-white p-6">
                <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_70%)]" />
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Recovery flow</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Reset password</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-700/20 text-emerald-700">
                    <KeyRound className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {resetSignals.map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Jika token atau email tidak tersedia pada URL, pengguna diarahkan untuk mengulang dari route /forgot-password.
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
                Secure reset
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                Buat password baru
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                Gunakan kombinasi password yang kuat agar akses ke riwayat checkup dan dashboard HeartCare tetap aman.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 border border-slate-200 bg-white p-6 md:p-8">
              <div>
                <Label htmlFor="reset-email" className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Email terverifikasi
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email || ''}
                  readOnly
                  disabled
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="password" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Password baru
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  iconLeft={<Lock className="h-4 w-4" />}
                  passwordToggle
                  disabled={!hasValidResetContext || !!success || loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="password-confirmation" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Konfirmasi password
                </Label>
                <Input
                  id="password-confirmation"
                  type="password"
                  placeholder="Ulangi password baru"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  iconLeft={<Lock className="h-4 w-4" />}
                  passwordToggle
                  disabled={!hasValidResetContext || !!success || loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div className="border-t border-slate-200 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
                  disabled={loading || !hasValidResetContext || !!success}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    <>
                      Simpan password baru
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col gap-3 pt-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/forgot-password" className="font-medium text-emerald-700 transition-colors hover:text-emerald-600">
                  Minta tautan baru
                </Link>
                <Link to="/login" className="font-medium text-slate-700 transition-colors hover:text-slate-950">
                  Kembali ke login
                </Link>
              </div>
            </form>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">
              Route reset aktif di /reset-password dan menerima token + email dari /forgot-password.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;
