import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { authService } from '~/lib/authService';
import { Button } from '~/components/ui/button';
import { Input, Label } from '~/components/ui/input';
import { cn } from '~/lib/utils';

const recoveryPoints = [
  'Kirim tautan pemulihan dari email yang terhubung ke akun HeartCare.',
  'Verifikasi kode OTP 6 digit sebelum melanjutkan ke route reset password.',
  'Gunakan alur yang sama tenangnya dengan halaman auth bernuansa clinical editorial.',
];

const recoverySignals = [
  { label: 'Route aktif', value: '/forgot-password' },
  { label: 'Lanjutan', value: '/reset-password' },
  { label: 'Verifikasi', value: 'OTP email' },
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const focusFirstOtp = () => {
    window.setTimeout(() => otpRefs.current[0]?.focus(), 250);
  };

  const handleSendEmail = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (cooldown > 0 || !email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authService.forgotPassword({ email });
      if (res.success) {
        setStep(2);
        setCooldown(60);
        setOtp(['', '', '', '', '', '']);
        focusFirstOtp();
      } else {
        setError(res.message || 'Gagal mengirim email reset.');
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Email tidak ditemukan atau terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedOtp = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedOtp.length !== 6) return;

    const nextOtp = pastedOtp.split('');
    setOtp(nextOtp);
    otpRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Masukkan kode OTP 6 digit.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyToken({ email, token: otpValue });
      if (res.success) {
        navigate(`/reset-password?token=${otpValue}&email=${encodeURIComponent(email)}`);
      } else {
        setError(res.message || 'Kode OTP tidak valid.');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.response?.data?.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && otp.every((digit) => digit !== '') && !loading) {
      void handleVerifyOtp();
    }
  }, [otp, step]);

  const resetToEmailStep = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    setCooldown(0);
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
                  Account recovery
                </p>
                <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl xl:text-7xl">
                  Pulihkan akses ke
                  <br />
                  akun <span className="font-serif italic text-emerald-700">HeartCare</span> Anda
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Halaman forgot password kini mengikuti bahasa visual landing page: lebih lapang,
                  editorial, dan tetap jelas dalam memandu pengguna menuju alur reset password.
                </p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] xl:items-end">
              <div className="border-y border-slate-200 bg-white/70 py-6 backdrop-blur-sm">
                <div className="space-y-5">
                  {recoveryPoints.map((point, index) => (
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
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Pemulihan akun</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Portal Reset Akses</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-700/20 text-emerald-700">
                    <KeyRound className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {recoverySignals.map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Setelah OTP tervalidasi, pengguna diteruskan ke route reset password dengan email dan token yang sama.
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
                {step === 1 ? 'Recover access' : 'Verify your code'}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                {step === 1 ? 'Lupa password akun HeartCare' : 'Masukkan kode OTP'}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                {step === 1
                  ? 'Masukkan email aktif Anda untuk menerima kode OTP pemulihan akun.'
                  : (
                    <>
                      Kami telah mengirim kode 6 digit ke{' '}
                      <span className="font-medium text-slate-900">{email}</span>. Cek inbox atau folder spam Anda.
                    </>
                  )}
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendEmail} className="space-y-5 border border-slate-200 bg-white p-6 md:p-8">
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
                    required
                    className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <p>Kami hanya mengirim kode pemulihan ke email yang terdaftar pada sistem HeartCare.</p>
                  <Link
                    to="/login"
                    className="inline-flex w-fit items-center gap-2 border-b border-emerald-700 pb-1 font-medium text-emerald-800 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke login
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Mengirim kode...
                    </>
                  ) : (
                    <>
                      Kirim kode OTP
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-5 border border-slate-200 bg-white p-6 md:p-8">
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div onPaste={handleOtpPaste} className="flex justify-between gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={cn(
                          'h-14 w-11 border-b bg-transparent text-center text-xl font-semibold text-slate-950 outline-none transition-all sm:w-12',
                          digit ? 'border-emerald-700' : 'border-slate-300',
                          'focus:border-emerald-700'
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
                    disabled={loading || otp.join('').length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        Verifikasi kode
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="space-y-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => void handleSendEmail()}
                      disabled={loading || cooldown > 0}
                      className="inline-flex items-center gap-2 font-medium text-emerald-800 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                      {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : 'Kirim ulang kode'}
                    </button>
                    <button
                      type="button"
                      onClick={resetToEmailStep}
                      className="inline-flex w-fit items-center gap-2 border-b border-slate-300 pb-1 text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Ganti email
                    </button>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex w-fit items-center gap-2 border-b border-emerald-700 pb-1 font-medium text-emerald-800 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke login
                  </Link>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">
              Route pemulihan aktif di /forgot-password dan diteruskan ke /reset-password setelah OTP tervalidasi.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
