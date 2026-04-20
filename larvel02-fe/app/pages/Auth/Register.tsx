// @ts-nocheck
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HeartPulse, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Check, 
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { authService } from "../../lib/authService";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input, Label } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [passwordStrength, setPasswordStrength] = React.useState({
    score: 0,
    label: "Kosong",
    color: "bg-slate-200"
  });

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 0) score = 1; // Weak
    if (pass.length >= 6) score = 2; // Medium
    if (pass.length >= 8 && /[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score = 3; // Strong

    const labels = ["Kosong", "Lemah", "Sedang", "Kuat"];
    const colors = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-emerald-500"];
    const textColors = ["text-slate-400", "text-red-600", "text-amber-600", "text-emerald-600"];

    setPasswordStrength({
      score,
      label: labels[score],
      color: colors[score]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newVal }));
    
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }
    if (!passwordsMatch) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (res.success) {
        // Show success toast or similar and redirect
        navigate("/login", { state: { message: "Registrasi berhasil! Silakan masuk." } });
      } else {
        setError(res.message || "Gagal melakukan registrasi.");
      }
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden">
      {/* Left Panel: Brand Illustration (Desktop Only) */}
      <div className="hidden lg:flex bg-emerald-600 p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-500/30 rounded-bl-full z-0" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-emerald-700/20 rounded-tr-full z-0" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <HeartPulse className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight font-display">
              HeartPredict
            </span>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Register Illustration" 
            className="w-full h-auto rounded-3xl shadow-2xl mb-12 border-4 border-emerald-500/30"
          />

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4 font-display leading-tight">Mulai Jaga Kesehatan Jantung Anda</h2>
            <p className="text-emerald-100/90 leading-relaxed font-medium">
              Daftar gratis dan dapatkan prediksi risiko jantung dengan teknologi AI terkini untuk hidup yang lebih tenang.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Logo (Mobile Only) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 font-display">HeartPredict</span>
          </div>

          <Card className="p-8 sm:p-10 border-slate-200 shadow-xl rounded-3xl bg-white">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 font-display">Daftar HeartPredict</h1>
              <p className="text-slate-500 text-sm">Buat akun baru dan mulai prediksi kesehatan jantung Anda.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-700 leading-normal">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label required>Nama Lengkap</Label>
                <Input 
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  iconLeft={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label required>Email</Label>
                <Input 
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  iconLeft={<Mail className="w-4 h-4" />}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label required>Password</Label>
                <Input 
                  name="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  required
                  passwordToggle
                  iconLeft={<Lock className="w-4 h-4" />}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                
                {/* Password Strength */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kekuatan Password</span>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", passwordStrength.label !== "Kosong" ? passwordStrength.color.replace('bg-', 'text-') : "text-slate-400")}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full flex gap-1 overflow-hidden">
                    {[1, 2, 3].map((seg) => (
                      <div 
                        key={seg}
                        className={cn(
                          "h-full flex-1 transition-all duration-300",
                          passwordStrength.score >= seg ? passwordStrength.color : "bg-slate-200/50"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label required>Konfirmasi Password</Label>
                <div className="relative">
                  <Input 
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password Anda"
                    required
                    passwordToggle
                    iconLeft={<Lock className="w-4 h-4" />}
                    iconRight={passwordsMatch ? <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div> : undefined}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={formData.confirmPassword && !passwordsMatch ? "Password tidak cocok" : undefined}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-2">
                <div className="relative flex items-center h-5">
                   <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-normal cursor-pointer">
                  Saya setuju dengan <Link to="/terms" className="text-emerald-600 font-bold hover:underline">Syarat & Ketentuan</Link> dan <Link to="/privacy" className="text-emerald-600 font-bold hover:underline">Kebijakan Privasi</Link> HeartPredict.
                </label>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 ring-offset-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Daftar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="relative flex items-center justify-center my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">atau</span>
              </div>

              <p className="text-center text-sm text-slate-500 font-medium font-display">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-emerald-600 font-bold hover:underline">Masuk di sini</Link>
              </p>
            </form>
          </Card>

          <footer className="mt-12 text-center text-[11px] text-slate-400 font-medium">
            © 2026 HeartPredict. All rights reserved. <br/>
            Secure AES-256 Medical Data Encryption System.
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
