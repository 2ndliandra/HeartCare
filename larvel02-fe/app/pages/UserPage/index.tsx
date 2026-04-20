import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Lightbulb, 
  ChevronRight,
  Clock,
  MoreVertical,
  HeartPulse
} from "lucide-react";
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RiskBadge } from "~/components/shared/RiskBadge";
import { cn } from "~/lib/utils";

// Custom Stat Card for more control
const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group rounded-[2rem] bg-white overflow-hidden relative">
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-[0.03]", colorClass)} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", colorClass.replace('bg-', 'bg-').replace('-600', '-100'))}>
          <Icon className={cn("w-6 h-6", colorClass.replace('bg-', 'text-'))} />
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-black text-slate-900 font-display">{value}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] font-black">{trend}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs bulan lalu</span>
        </div>
      )}
    </Card>
  </motion.div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const [chats, setChats] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const chatRes = await api.get('chats');
        if (chatRes.data?.success) setChats(chatRes.data.data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Background Decorations */}
      <div className="fixed top-40 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Prediksi" 
          value="12" 
          icon={HeartPulse} 
          trend="+2" 
          colorClass="bg-emerald-600" 
          delay={0.1}
        />
        <StatCard 
          title="Status Risiko" 
          value="RENDAH" 
          icon={Heart} 
          colorClass="bg-purple-600" 
          delay={0.2}
        />
        <StatCard 
          title="Konsultasi AI" 
          value={chats.length > 0 ? chats.length : "8"} 
          icon={MessageSquare} 
          trend="+3" 
          colorClass="bg-blue-600" 
          delay={0.3}
        />
        <StatCard 
          title="Artikel Dibaca" 
          value="15" 
          icon={BookOpen} 
          trend="+5" 
          colorClass="bg-amber-600" 
          delay={0.4}
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Last Prediction Result */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem] bg-white h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Prediksi Terakhir</h2>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-widest">15 April 2026 • 10:30 WIB</span>
                </div>
              </div>
              <RiskBadge level="RENDAH" className="scale-110" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-10">
               <div className="w-full max-w-md text-center">
                 <p className="text-slate-600 text-base leading-relaxed font-semibold italic">
                   "Hasil analisis menunjukkan Kondisi Terpantau Baik. Anda berada dalam kondisi optimal, pertahankan pola hidup sehat."
                 </p>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-2xl border-slate-200 font-bold"
                onClick={() => navigate('/user/riwayat')}
              >
                Lihat Riwayat
              </Button>
              <Button 
                className="flex-1 h-12 rounded-2xl shadow-xl shadow-emerald-100 font-bold"
                onClick={() => navigate('/user/hasil-prediksi')}
              >
                Detail Hasil <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Recent Consultations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem] bg-white h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 font-display">Konsultasi Terakhir</h2>
              <Link to="/user/konsultasi" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline px-3 py-1 bg-emerald-50 rounded-lg transition-all">
                Lihat Semua
              </Link>
            </div>

            <div className="flex-1 space-y-4">
              {chats.length > 0 ? (
                chats.slice(0, 3).map((chat: any, idx: number) => (
                  <motion.div 
                    key={chat.id || idx}
                    whileHover={{ x: 4 }}
                    className="p-4 rounded-3xl border border-slate-50 hover:border-emerald-100 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{chat.message}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">AI: {chat.response}</p>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">2 Hari Lalu</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada konsultasi</p>
                </div>
              )}
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl mt-8 border-dashed border-2 border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 transition-all font-bold"
              onClick={() => navigate('/user/konsultasi')}
            >
              <Plus className="w-4 h-4 mr-2" /> Mulai Konsultasi Baru
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Health Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="p-8 border-none bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-lg">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Tips Kesehatan Hari Ini</span>
              <h3 className="text-2xl font-black font-display mt-1 mb-2">Minum Air Putih & Istirahat Cukup</h3>
              <p className="text-emerald-50/80 text-sm font-medium leading-relaxed max-w-2xl">
                Pastikan Anda minum minimal 8 gelas air putih dan tidur 7-8 jam per hari. Hidrasi yang baik dan istirahat yang cukup sangat krusial untuk menjaga kerja jantung tetap stabil dan sirkulasi darah yang optimal.
              </p>
            </div>
            <Button 
              className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl h-14 px-8 font-black shadow-xl shrink-0"
              onClick={() => navigate('/user/artikel')}
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
