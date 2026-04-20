import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  TrendingUp,
  HeartPulse,
  Eye,
  FileText
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RiskBadge } from "~/components/shared/RiskBadge";
import type { RiskLevel } from "~/components/shared/RiskBadge";
import { cn } from "~/lib/utils";

import api from "~/lib/api";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterLevel, setFilterLevel] = React.useState("ALL");
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/predictions');
        if (res.data?.success) {
          setPredictions(res.data.data);
        }
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('id-ID', { month: 'short' }),
      year: d.getFullYear(),
      fullMonth: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      chart: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    };
  };

  const filteredHistory = predictions.filter(item => {
    const dateStr = item.created_at;
    const matchesSearch = dateStr.includes(searchTerm);
    const matchesLevel = filterLevel === "ALL" || item.result_level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const chartData = [...predictions].reverse().map(item => ({
    date: formatDate(item.created_at).chart,
    score: item.result_level === "TINGGI" ? 80 : 20,
    level: item.result_level
  }));

  // Group by Month
  const groupedHistory = filteredHistory.reduce((acc: any, item) => {
    const { fullMonth } = formatDate(item.created_at);
    if (!acc[fullMonth]) acc[fullMonth] = [];
    acc[fullMonth].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="h-96 flex items-center justify-center font-bold text-slate-400 font-display animate-pulse">Memuat riwayat pemeriksaan...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            Dashboard <ChevronRight className="w-4 h-4" /> <span className="text-slate-900">Riwayat</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 font-display">Riwayat Prediksi</h1>
          <p className="text-sm text-slate-600">{predictions.length} Total pemeriksaan terdaftar</p>
        </div>
        <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" /> Export Riwayat (PDF)
        </Button>
      </div>

      {/* Trend Chart Card */}
      <Card className="p-8 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Trend Status Kesehatan</h3>
          </div>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#64748b'}}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationBegin={300}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 font-medium">Belum ada data visualisasi</div>
          )}
        </div>
      </Card>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Input 
            placeholder="Cari riwayat..." 
            iconLeft={<Search className="w-4 h-4" />}
            className="rounded-2xl bg-white border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 appearance-none transition-all"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="RENDAH">Kondisi Baik</option>
            <option value="TINGGI">Perlu Atensi Medis</option>
          </select>
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-12">
        {Object.keys(groupedHistory).length > 0 ? (
          Object.keys(groupedHistory).map((month) => (
            <div key={month} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">{month}</span>
                <div className="h-px bg-slate-100 w-full" />
              </div>

              <div className="grid gap-4">
                {groupedHistory[month].map((item: any) => {
                  const date = formatDate(item.created_at);
                  const input = item.input_data || {};
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => navigate(`/user/hasil-prediksi`, { 
                        state: { 
                           prediction: { risk_level: item.result_level, risk_score: item.result_score }, 
                           formData: input,
                           timestamp: item.created_at 
                        } 
                      })}
                    >
                      <Card className="p-6 border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group rounded-3xl bg-white">
                        <div className="flex items-center gap-6">
                          {/* Date Badge */}
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-slate-900 leading-none mb-1 font-display">{date.day}</span>
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none">{date.month}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-1">
                              <RiskBadge level={item.result_level as RiskLevel} className="mb-2" />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-l border-slate-100 pl-6 h-full py-1">
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">TD</span>
                                <span className="text-sm font-bold text-slate-700">{input.systolic_bp || '0'}/{input.diastolic_bp || '0'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">KLS</span>
                                <span className="text-sm font-bold text-slate-700">{input.cholesterol || '0'}</span>
                              </div>
                              <div className="hidden sm:block">
                                <span className="text-[10px] font-black text-slate-400 uppercase mb-0.5 block">DETAK</span>
                                <span className="text-sm font-bold text-slate-700">{input.heart_rate || '0'}</span>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 p-2">
                                <ChevronRight className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-[2.5rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <History className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1 font-display">Belum ada riwayat ditemukan</h4>
            <p className="text-sm text-slate-500">Mulai konsultasi pertama Anda hari ini!</p>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="py-10 text-center">
        <p className="text-slate-500 mb-6 font-medium">Ingin melakukan pemeriksaan lagi?</p>
        <Button size="lg" className="px-10 rounded-2xl h-14 font-bold shadow-xl shadow-emerald-200" onClick={() => navigate('/user/cek-kesehatan')}>
          <HeartPulse className="w-5 h-5 mr-3" /> Mulai Cek Kesehatan Baru
        </Button>
      </div>
    </div>
  );
}
