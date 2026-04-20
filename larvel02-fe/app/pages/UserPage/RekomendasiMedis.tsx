// @ts-nocheck
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  BrainCircuit, 
  HeartPulse, 
  Activity, 
  BookOpen, 
  ChevronRight, 
  ArrowUpRight, 
  Info, 
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  Star,
  Download
} from "lucide-react";
import api from "../../lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function RekomendasiMedis() {
  const navigate = useNavigate();
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/articles');
      const published = res.data.data
        .filter((a: any) => a.status === 'published')
        .slice(0, 6);
      setArticles(published);
    } catch (err) {
      console.error('Fetch recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = {
    title: "Panduan Pemulihan & Pencegahan Jantung Koroner",
    description: "Berdasarkan rincian pemeriksaan terakhir Anda, sistem AI kami menyarankan panduan berikut untuk menurunkan risiko kardiovaskular secara bertahap.",
    priority: [
      { 
        id: 1, 
        title: "Kontrol Tekanan Darah", 
        icon: HeartPulse, 
        colorClass: "bg-red-50 text-red-600 border-red-100", 
        content: "Targetkan tekanan darah di bawah 120/80 mmHg melalui diet rendah garam dan konsultasi medis rutin." 
      },
      { 
        id: 2, 
        title: "Manajemen Kolesterol", 
        icon: Activity, 
        colorClass: "bg-amber-50 text-amber-600 border-amber-100", 
        content: "Fokus pada penurunan LDL hingga < 70 mg/dL untuk mencegah pembentukan plak baru pada pembuluh darah." 
      },
      { 
        id: 3, 
        title: "Aktivitas Fisik Teratur", 
        icon: Zap, 
        colorClass: "bg-blue-50 text-blue-600 border-blue-100", 
        content: "Lakukan jalan santai 30 menit setiap hari untuk meningkatkan efisiensi kerja otot jantung Anda." 
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 font-sans">
      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-none bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160550-217359f4ecf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 backdrop-blur-md">
                <BrainCircuit size={12} /> AI-Powered Analysis
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-display leading-[1.1]">{recommendations.title}</h1>
              <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-xl">
                {recommendations.description}
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black shadow-xl shadow-emerald-900/40">
                  <Download className="w-5 h-5 mr-3" /> Unduh PDF Lengkap
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/10 text-white font-black">
                   Bagikan ke Keluarga
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-72 aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center gap-4">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-inner">
                <Stethoscope size={40} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Status Keanggotaan</p>
                <p className="text-xl font-bold">Premium Patient</p>
              </div>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Priority Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Rekomendasi Utama</h2>
          <div className="h-px bg-slate-100 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.priority.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="p-8 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white h-full flex flex-col group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", item.colorClass.split(' ')[0])}>
                  <item.icon className={cn("w-7 h-7", item.colorClass.split(' ')[1])} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 font-display">{item.title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed flex-1">
                  {item.content}
                </p>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-all">
                  Pelajari <ChevronRight className="w-3 h-3" />
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">Tingkatkan Pengetahuan</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Edukasi khusus yang dipilih AI sesuai profil Anda</p>
          </div>
          <Link to="/articles" className="group text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            Lihat Semua <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="bg-slate-50 h-80 rounded-[2.5rem] animate-pulse" />
             ))
          ) : (
            articles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="rounded-[2.5rem] border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group h-full">
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={article.thumbnail || "https://images.unsplash.com/photo-1505751172107-573225a912bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-lg">
                        {article.category || "Kesehatan"}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 mb-4 font-display leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">5 Menit</span>
                      </div>
                      <Link to={`/article/${article.slug}`} className="text-xs font-black text-emerald-600 hover:underline">
                        Buka Artikel
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Disclaimer / Secure Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 flex items-start sm:items-center gap-6">
          <div className="w-14 h-14 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-1">Informasi & Penyangkalan</h4>
            <p className="text-xs font-medium text-indigo-700/70 leading-relaxed">
              Rekomendasi ini disusun secara otomatis oleh HeartPredict AI berdasarkan dataset medis global. Harap selalu konsultasikan hasil diagnosa dan panduan edukasi ini dengan dokter spesialis jantung Anda untuk penanganan yang tepat dan akurat sesuai riwayat klinis Anda.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
