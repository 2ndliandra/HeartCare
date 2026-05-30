import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Check, HeartPulse, Lock, Mail, User } from 'lucide-react';
import { authService } from '~/lib/authService';
import { Button } from '~/components/ui/button';
import { Input, Label } from '~/components/ui/input';
import { clearLegacyLastPrediction } from '~/lib/lastPrediction';
import { cn } from '~/lib/utils';

const registerPoints = [
  'Daftar cepat dengan email aktif untuk mulai asesmen risiko jantung.',
  'Data akun langsung terhubung dengan riwayat checkup dan rekomendasi medis.',
  'Alur registrasi dibuat ringkas dengan validasi dasar yang jelas.',
];

const registerSignals = [
  { label: 'Akses awal', value: '/register' },
  { label: 'Lanjutan login', value: '/login' },
  { label: 'Visual style', value: 'Clinical editorial' },
];

type PasswordStrength = {
  score: number;
  label: 'Kosong' | 'Lemah' | 'Sedang' | 'Kuat';
  color: string;
};

const passwordMeta: PasswordStrength[] = [
  { score: 0, label: 'Kosong', color: 'bg-slate-200' },
  { score: 1, label: 'Lemah', color: 'bg-red-500' },
  { score: 2, label: 'Sedang', color: 'bg-amber-500' },
  { score: 3, label: 'Kuat', color: 'bg-emerald-500' },
];

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const passwordStrength = useMemo<PasswordStrength>(() => {
    const pass = formData.password;
    let score = 0;
    if (pass.length > 0) score = 1;
    if (pass.length >= 6) score = 2;
    if (pass.length >= 8 && /[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score = 3;
    return passwordMeta[score];
  }, [formData.password]);

  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan.');
      return;
    }

    if (!passwordsMatch) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_set_at');
        localStorage.removeItem('user');
        clearLegacyLastPrediction();
        navigate('/login', { state: { message: 'Registrasi berhasil! Silakan masuk.' } });
      } else {
        setError(res.message || 'Gagal melakukan registrasi.');
      }
    } catch (err: unknown) {
      const error = err as ApiError
      console.error('Register error:', err);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
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
                  Account onboarding
                </p>
                <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl xl:text-7xl">
                  Buat akun untuk mulai
                  <br />
                  asesmen <span className="font-serif italic text-emerald-700">risiko</span> jantung
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Buat akun HeartCare untuk mulai menyimpan hasil pemeriksaan, memantau perkembangan kesehatan,
                  dan mengakses fitur prediksi risiko jantung secara personal.
                </p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] xl:items-end">
              <div className="border-y border-slate-200 bg-white/70 py-6 backdrop-blur-sm">
                <div className="space-y-5">
                  {registerPoints.map((point, index) => (
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
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Registrasi</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Portal Akun Baru</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-700/20 text-emerald-700">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {registerSignals.map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Setelah registrasi berhasil, pengguna diarahkan ke route login untuk autentikasi awal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-14 md:px-8 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-700/80">Create account</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                Daftar akun HeartCare
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                Lengkapi data dasar berikut untuk membuka akses checkup, prediksi, dan rekomendasi kesehatan.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 border border-slate-200 bg-white p-6 md:p-8">
              <div>
                <Label htmlFor="name" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Nama lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  iconLeft={<User className="h-4 w-4" />}
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="email" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  iconLeft={<Mail className="h-4 w-4" />}
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  required
                  passwordToggle
                  iconLeft={<Lock className="h-4 w-4" />}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />

                <div className="pt-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kekuatan password</span>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider',
                        passwordStrength.label !== 'Kosong'
                          ? passwordStrength.color.replace('bg-', 'text-')
                          : 'text-slate-400'
                      )}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
                    {[1, 2, 3].map((seg) => (
                      <div
                        key={seg}
                        className={cn(
                          'h-full flex-1 transition-all duration-300',
                          passwordStrength.score >= seg ? passwordStrength.color : 'bg-slate-200/50'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" required className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Konfirmasi password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Ulangi password Anda"
                  required
                  passwordToggle
                  iconLeft={<Lock className="h-4 w-4" />}
                  iconRight={
                    passwordsMatch ? (
                      <div className="rounded-full bg-emerald-100 p-1">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                    ) : undefined
                  }
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={formData.confirmPassword && !passwordsMatch ? 'Password tidak cocok' : undefined}
                  className="h-12 rounded-none border-x-0 border-b-0 border-t-0 px-0 pl-8 text-[15px] shadow-none focus-visible:ring-0"
                />
              </div>

              <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                />
                <label htmlFor="agreeTerms" className="text-xs leading-normal text-slate-500">
                  Saya setuju dengan{' '}
                  <Link to="/terms" className="font-semibold text-emerald-700 hover:underline">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">
                    Kebijakan Privasi
                  </Link>{' '}
                  HeartCare.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Daftar sekarang'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </Button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-medium text-emerald-700 transition-colors hover:text-emerald-600">
                  Masuk di sini
                </Link>
              </p>
            </form>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">
              Route daftar aktif di /register dan tetap terhubung dengan /login.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
