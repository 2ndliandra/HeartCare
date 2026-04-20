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
  ExternalLink, 
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
  const [step, setStep] = React.useState<1 | 2>(1); // 1: Input Email, 2: Success/Sent
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);

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
            <span className="text-3xl font-bold text-white font-display">HeartPredict</span>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1581056316614-4235218d6ee9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Forgot Password Illustration" 
            className="w-full h-auto rounded-3xl shadow-2xl mb-12 border-4 border-emerald-500/30"
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
            <span className="text-2xl font-bold text-slate-900 font-display">HeartPredict</span>
          </div>

          <Card className="p-8 sm:p-10 border-slate-200 shadow-xl rounded-3xl bg-white overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 ? (
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
                    <p className="text-slate-500 text-sm">Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.</p>
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
                          Kirim Link Reset <Send className="w-4 h-4 ml-2" />
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
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Email Terkirim!</h1>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed px-2">
                    Kami telah mengirimkan instruksi reset password ke <span className="text-slate-900 font-bold">{email}</span>. Silakan cek inbox atau folder spam Anda.
                  </p>

                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl border-slate-200"
                      onClick={() => navigate(`/reset-password?token=dummy-token-123&email=${email}`)}
                    >
                      Buka Email <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    
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
                          Kirim Ulang Email
                        </>
                      )}
                    </Button>
                  </div>

                  <hr className="my-8 border-slate-100" />

                  <Link 
                    to="/login" 
                    className="text-sm font-bold text-emerald-600 hover:underline"
                  >
                    Kembali ke halaman login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
