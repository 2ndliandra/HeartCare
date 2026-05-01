// @ts-nocheck
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HeartPulse, 
  Mail, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  KeyRound,
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";
import { authService } from "../../lib/authService";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input, Label } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<1 | 2 | 3>(1); // 1: Input Email, 2: Input OTP, 3: Success
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authService.forgotPassword({ email });
      if (res.success) {
        setStep(2);
        setCooldown(60);
        // Focus on first OTP input after transition
        setTimeout(() => otpRefs.current[0]?.focus(), 400);
      } else {
        setError(res.message || "Gagal mengirim email reset.");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.message || "Email tidak ditemukan atau terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Masukkan kode OTP 6 digit.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyToken({ email, token: otpValue });
      if (res.success) {
        // Navigate to reset password page with email and token
        navigate(`/reset-password?token=${otpValue}&email=${encodeURIComponent(email)}`);
      } else {
        setError(res.message || "Kode OTP tidak valid.");
      }
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      setError(err.response?.data?.message || "Kode OTP tidak valid atau sudah kedaluwarsa.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all 6 digits are filled
  React.useEffect(() => {
    if (step === 2 && otp.every(d => d !== "")) {
      handleVerifyOtp();
    }
  }, [otp, step]);

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden">
      {/* Left Panel: Brand Illustration */}
      <div className="hidden lg:flex bg-emerald-600 p-12 flex-col justify-center items-center relative overflow-hidden">
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
            <span className="text-3xl font-bold text-white font-display">HeartCare</span>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1581056316614-4235218d6ee9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Forgot Password Illustration" 
            className="w-full h-auto rounded-[2.0rem] shadow-2xl mb-12 border-4 border-emerald-500/30"
          />

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4 font-display leading-tight">Lupa Password?</h2>
            <p className="text-emerald-100/90 leading-relaxed font-medium">
              Jangan khawatir, kami akan membantu Anda kembali ke dashboard dengan cepat dan aman.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo (Mobile Only) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 font-display">HeartCare</span>
          </div>

          <Card className="p-8 sm:p-10 border-slate-200 shadow-xl rounded-[2.0rem] bg-white overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="w-16 h-16 text-emerald-600 mx-auto mb-6 opacity-80" />
                  
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Lupa Password?</h1>
                    <p className="text-slate-500 text-sm">Masukkan email Anda dan kami akan mengirimkan kode OTP untuk mereset password.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-xs font-semibold text-red-700 leading-normal">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSendEmail} className="space-y-6">
                    <div className="space-y-2">
                      <Label required>Email</Label>
                      <Input 
                        type="email"
                        placeholder="nama@email.com"
                        required
                        iconLeft={<Mail className="w-4 h-4" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Kode OTP <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link 
                        to="/login" 
                        className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                      >
                        <ArrowLeft className="w-3 h-3 mr-2" /> Kembali ke Login
                      </Link>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <KeyRound className="w-16 h-16 text-emerald-600 mx-auto mb-6 opacity-80" />
                  
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Masukkan Kode OTP</h1>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed px-2">
                    Kami telah mengirimkan kode 6 digit ke <span className="text-slate-900 font-bold">{email}</span>. Cek inbox atau folder spam Anda.
                  </p>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3 text-left">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-xs font-semibold text-red-700 leading-normal">{error}</p>
                    </div>
                  )}

                  {/* OTP Input */}
                  <form onSubmit={handleVerifyOtp}>
                    <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={cn(
                            "w-12 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all",
                            digit 
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                              : "border-slate-200 bg-slate-50 text-slate-900",
                            "focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                          )}
                        />
                      ))}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] mb-4"
                      disabled={loading || otp.join("").length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memverifikasi...
                        </>
                      ) : (
                        <>
                          Verifikasi Kode <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="space-y-3">
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 rounded-xl text-slate-600"
                      onClick={() => handleSendEmail()}
                      disabled={loading || cooldown > 0}
                    >
                      {cooldown > 0 ? (
                        `Kirim Ulang (${cooldown}s)`
                      ) : (
                        <>
                          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                          Kirim Ulang Kode
                        </>
                      )}
                    </Button>
                  </div>

                  <hr className="my-8 border-slate-100" />

                  <button 
                    onClick={() => { setStep(1); setError(null); setOtp(["", "", "", "", "", ""]); }}
                    className="text-sm font-bold text-emerald-600 hover:underline"
                  >
                    Ganti email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
