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

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  colorClass: string;
  delay?: number;
}

const statCardTheme = {
  "bg-emerald-600": {
    tint: "bg-emerald-50",
    icon: "text-emerald-600",
    ring: "ring-emerald-100",
    trend: "bg-emerald-50 text-emerald-600",
  },
  "bg-blue-600": {
    tint: "bg-blue-50",
    icon: "text-blue-600",
    ring: "ring-blue-100",
    trend: "bg-blue-50 text-blue-600",
  },
  "bg-purple-600": {
    tint: "bg-purple-50",
    icon: "text-purple-600",
    ring: "ring-purple-100",
    trend: "bg-purple-50 text-purple-600",
  },
} as const;

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0 }: StatCardProps) => {
  const theme = statCardTheme[colorClass as keyof typeof statCardTheme] ?? statCardTheme["bg-emerald-600"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className={cn("absolute inset-x-0 top-0 h-1", colorClass)} />
        <div className="absolute right-0 top-0 h-28 w-28 -translate-y-10 translate-x-10 rounded-full bg-slate-100/70 blur-2xl" />

        <div className="relative flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-[1.35rem] ring-1", theme.tint, theme.ring)}>
              <Icon className={cn("h-7 w-7", theme.icon)} />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Ringkasan
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{title}</p>
            <h3 className="text-4xl font-black leading-none text-slate-900 font-display">{value}</h3>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            {trend ? (
              <div className="flex items-center gap-2">
                <div className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black", theme.trend)}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{trend}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">vs bulan lalu</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">Terakumulasi hingga hari ini</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any>(null);
  const [predStats, setPredStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res, predRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/predictions/stats')
        ]);
        setStats(res.data.data);
        setPredStats(predRes.data.data);
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

  const predictionTrends = predStats?.trends || [
    { name: 'Rendah', value: 45, color: '#10b981' },
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={stats?.total_users ?? "1.247"} 
          icon={Users} 
          trend="+12%" 
          colorClass="bg-emerald-600"
          delay={0.1}
        />
        <StatCard 
          title="Prediksi Hari Ini" 
          value={predStats?.today_predictions ?? "34"} 
          icon={Activity} 
          trend="+5" 
          colorClass="bg-blue-600"
          delay={0.2}
        />
        <StatCard 
          title="Artikel Published" 
          value={stats?.total_articles ?? "89"} 
          icon={FileText} 
          trend="+3" 
          colorClass="bg-purple-600"
          delay={0.3}
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
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.0rem] bg-white h-[400px] flex flex-col">
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
          <Card className="p-8 border-slate-200 shadow-sm rounded-[2.0rem] bg-white h-[400px] flex flex-col">
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
                  <span className="font-black text-slate-900">{predStats?.total_predictions ?? "1.492"}</span>
               </div>
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${predStats?.total_predictions ? ((predStats.trends[0].value / predStats.total_predictions) * 100) : 75}%` }} />
                  <div className="h-full bg-rose-500" style={{ width: `${predStats?.total_predictions ? ((predStats.trends[1].value / predStats.total_predictions) * 100) : 25}%` }} />
               </div>
            </div>
          </Card>
        </motion.div>
      </div>


    </div>
  );
}
