import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  Activity, 
  Users, 
  Target, 
  MessageSquare, 
  Brain, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  ArrowRight,
  MessageSquareText
} from "lucide-react";
import api from "../../lib/api";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ArticleCard } from "~/components/shared/ArticleCard";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  created_at: string;
  status: string;
  category?: string;
  author_name?: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('auth_token'));
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(true);

  React.useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('auth_token'));
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await api.get('/articles');
      const latest = res.data.data
        .filter((a: Article) => a.status === 'published')
        .slice(0, 3);
      setArticles(latest);
    } catch (err) {
      console.error('Fetch landing articles error:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // If admin, go to admin dashboard, if user, go to their module
          const route = user.roles?.includes('admin') ? '/admin/dashboard' : '/user/dashboard';
          navigate(route);
        } catch (e) {
          navigate('/user/dashboard');
        }
      } else {
        navigate('/user/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section id="hero" className="relative bg-white pt-24 pb-20 md:pt-32 md:pb-32 px-6 overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-100/30 rounded-bl-full -z-10 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-50/50 rounded-tr-full -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 mb-4 block">
              PREDIKSI RISIKO PENYAKIT JANTUNG
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 font-display">
              Jaga Jantung Anda dengan Teknologi <span className="text-emerald-600">AI Terpercaya</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              HeartPredict membantu Anda mendeteksi risiko penyakit jantung secara dini menggunakan kecerdasan buatan. Dapatkan prediksi akurat dan konsultasi AI kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="rounded-xl px-8" 
                onClick={handleCtaClick}
              >
                <HeartPulse className="w-5 h-5 mr-2" />
                Mulai Cek Kesehatan
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl px-8"
                onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=1350&q=80" 
              alt="Medical Dashboard" 
              className="rounded-3xl shadow-2xl relative z-10 w-full"
            />
            {/* Clinical Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl flex items-center gap-4 z-20 border border-slate-100/50 group hover:shadow-emerald-200/50 transition-all">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Teknologi Terverifikasi</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">Dukungan Keputusan<br/>Klinis Digital</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clinical Focus Section (Replacement for Stats) */}
      <section className="bg-emerald-600 py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="text-white md:max-w-xs text-center md:text-left">
              <h4 className="text-2xl font-black font-display leading-tight">Fokus Kami Untuk Kesehatan Anda</h4>
           </div>
           
           <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {[
                { label: "Tekanan Darah", icon: Activity },
                { label: "Kadar Kolesterol", icon: TrendingUp },
                { label: "Gaya Hidup", icon: HeartPulse },
                { label: "Deteksi Dini", icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 group hover:bg-white/20 transition-all">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-sm font-bold text-white tracking-wide">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase mb-3 block">
              FITUR UNGGULAN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              Kenapa Memilih HeartPredict?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Platform prediksi risiko jantung berbasis AI dengan fitur lengkap untuk kesehatan jantung Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Prediksi AI Akurat", desc: "Algoritma machine learning terlatih dengan ribuan data medis untuk hasil prediksi yang presisi." },
              { icon: MessageSquareText, title: "Konsultasi AI 24/7", desc: "Tanyakan apapun seputar kesehatan jantung Anda kepada chatbot AI yang responsif." },
              { icon: FileText, title: "Riwayat Lengkap", desc: "Simpan dan pantau semua hasil prediksi dan konsultasi Anda dalam satu dashboard." },
              { icon: ShieldCheck, title: "Data Aman & Privat", desc: "Semua data kesehatan Anda terenkripsi dan dijamin kerahasiaannya." },
              { icon: BookOpen, title: "Artikel Kesehatan", desc: "Akses ratusan artikel tentang kesehatan jantung yang ditulis oleh ahli kesehatan." },
              { icon: TrendingUp, title: "Rekomendasi Personal", desc: "Dapatkan saran gaya hidup sehat yang disesuaikan dengan kondisi medis Anda." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-8 h-full border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Cara Kerja HeartPredict</h2>
            <p className="text-slate-600">Prediksi risiko jantung Anda hanya dalam 3 langkah mudah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-6 left-1/3 w-1/3 border-t-2 border-dashed border-emerald-100 -z-10" />
            <div className="hidden md:block absolute top-6 left-2/3 w-1/3 border-t-2 border-dashed border-emerald-100 -z-10" />

            {[
              { step: 1, title: "Daftar Gratis", desc: "Buat akun dengan email Anda dalam hitungan detik." },
              { step: 2, title: "Isi Data Kesehatan", desc: "Masukkan data vital seperti tekanan darah dan kolesterol." },
              { step: 3, title: "Dapatkan Hasil", desc: "AI menganalisis dan memberikan hasil prediksi serta saran." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold font-display shadow-lg shadow-emerald-200">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">{item.title}</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 font-display">Artikel Kesehatan Terbaru</h2>
              <p className="text-slate-600 mt-2">Dapatkan wawasan seputar kesehatan jantung dari para ahli</p>
            </div>
            <Link to="/articles" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-2 group">
              Lihat Semua Artikel 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingArticles ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
              ))
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={stripHtml(article.content)}
                  imageUrl={article.thumbnail || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                  category={article.category || "Kesehatan"}
                  author={article.author_name || "Admin"}
                  date={formatDate(article.created_at)}
                  slug={article.slug}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                Belum ada artikel yang dipublikasikan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-emerald-600 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
            Mulai Jaga Kesehatan Jantung Anda Hari Ini
          </h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah mempercayai HeartPredict untuk kesehatan jantung mereka.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            onClick={handleCtaClick}
          >
            Daftar Sekarang Gratis
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>
    </div>
  );
}
