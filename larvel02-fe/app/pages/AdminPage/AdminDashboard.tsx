// @ts-nocheck
import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Activity, 
  Database, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  MoreVertical,
  Plus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group rounded-[2rem] bg-white overflow-hidden relative">
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-[0.03]", colorClass)} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", colorClass.replace('text-', 'bg-').replace('-600', '-100'))}>
          <Icon className={cn("w-6 h-6", colorClass)} />
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-black text-slate-900 font-display">{value}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">{title}</p>
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

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Fetch stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mock charts data if stats.growth not available
  const growthData = stats?.growth || [
    { day: 'Sen', users: 12 },
    { day: 'Sel', users: 18 },
    { day: 'Rab', users: 15 },
    { day: 'Kam', users: 25 },
    { day: 'Jum', users: 22 },
    { day: 'Sab', users: 30 },
    { day: 'Min', users: 34 },
  ];

  const predictionTrends = [
    { name: 'Rendah', value: 45, color: '#10b981' },
    { name: 'Sedang', value: 30, color: '#f59e0b' },
    { name: 'Tinggi', value: 15, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">Ringkasan Sistem</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Pantau performa platform dan aktivitas pengguna secara berkala.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs h-10">
              <Clock className="w-4 h-4 mr-2" /> Live logs
           </Button>
           <Button className="rounded-xl font-bold text-xs h-10 shadow-lg shadow-emerald-100">
              <Plus className="w-4 h-4 mr-2" /> Export report
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={stats?.total_users || "1.247"} 
          icon={Users} 
          trend="+12%" 
          colorClass="text-emerald-600" 
          delay={0.1}
        />
        <StatCard 
          title="Prediksi Hari Ini" 
          value="34" 
          icon={Activity} 
          trend="+5" 
          colorClass="text-blue-600" 
          delay={0.2}
        />
        <StatCard 
          title="Artikel Published" 
          value={stats?.total_articles || "89"} 
          icon={FileText} 
          trend="+3" 
          colorClass="text-purple-600" 
          delay={0.3}
        />
        <StatCard 
          title="Dataset Aktif" 
          value={stats?.active_datasets || "12"} 
          icon={Database} 
          colorClass="text-amber-600" 
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Growth Chart */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem] bg-white h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">Pertumbuhan Pengguna</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">7 Hari Terakhir</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tight">
                <TrendingUp className="w-3 h-3" /> Average +15%
              </div>
            </div>

            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Prediction Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem] bg-white h-[400px] flex flex-col">
            <h3 className="text-lg font-black text-slate-900 font-display mb-8">Hasil Prediksi Terbaru</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionTrends}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                    {predictionTrends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-col gap-2">
               <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Total Prediksi</span>
                  <span className="font-black text-slate-900">1.492</span>
               </div>
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                  <div className="h-full bg-amber-500" style={{ width: '30%' }} />
                  <div className="h-full bg-rose-500" style={{ width: '25%' }} />
               </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* System Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem] bg-white overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 font-display">System Activities</h3>
              <ArrowUpRight className="w-5 h-5 text-slate-300" />
            </div>

            <div className="space-y-6">
              {[
                { title: 'Database Synced', time: '2m ago', desc: 'HeartModel_V2 updated successfully', type: 'success', icon: ShieldCheck },
                { title: 'New Admin Access', time: '1h ago', desc: 'dr. Sarah provided high clearance', type: 'info', icon: Users },
                { title: 'API Throttling', time: '3h ago', desc: 'Detected unusual request volume', type: 'warning', icon: AlertCircle },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start group cursor-pointer">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    act.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                    act.type === 'warning' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  )}>
                    <act.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800 tracking-tight">{act.title}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8 }}
        >
           <Card className="p-8 border-none bg-slate-900 text-white rounded-[2.5rem] shadow-xl h-full flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110" />
              
              <div>
                <h3 className="text-2xl font-black font-display mb-2">Pusat Kendali Admin</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                  Akses cepat untuk manajemen sistem dan pemeliharaan platform.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                 <Button className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold flex flex-col items-center justify-center gap-1">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Users</span>
                 </Button>
                 <Button className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold flex flex-col items-center justify-center gap-1">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Datasets</span>
                 </Button>
                 <Button className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold flex flex-col items-center justify-center gap-1">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Articles</span>
                 </Button>
                 <Button className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-900/40 border-none">
                    <Activity className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Re-train</span>
                 </Button>
              </div>
           </Card>
        </motion.div>
      </div>
    </div>
  );
}
