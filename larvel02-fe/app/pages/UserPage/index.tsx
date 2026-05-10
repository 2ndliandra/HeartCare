import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip
} from "recharts";
import {
  Heart,
  MessageSquare,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Plus,
  ChevronRight,
  Clock,
  HeartPulse
} from "lucide-react";
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RiskBadge } from "~/components/shared/RiskBadge";
import type { Prediction } from "~/types/UserPage/User";
import { cn } from "~/lib/utils";
import type { Article } from "~/types/shared";

interface ChatItem {
  id?: string;
  _id?: string;
  message: string;
  response: string;
  created_at?: string;
}

interface ChartDataItem {
  id: string;
  date: string | null;
  label: string | null;
  score: number;
  risk_level: string;
}

interface UserDashboardPayload {
  stats?: {
    total_checkups: number;
    checkups_trend: string;
    total_consultations: number;
    consultations_trend: string;
    total_articles_read: number;
  };
  predictions: Prediction[];
  articles?: Article[];
  chart_data: ChartDataItem[];
}

interface RadarMetricConfig {
  key: keyof Prediction["input_data"];
  label: string;
  max: number;
  unit: string;
}

interface RadarChartItem {
  metric: string;
  latest: number;
  previous: number;
  latestRaw: string;
  previousRaw: string;
}

interface RecommendedArticleCardProps {
  article: Article;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  colorClass: string;
  delay?: number;
  variant?: "default" | "risk";
}

const statCardTheme = {
  "bg-emerald-600": {
    tint: "bg-emerald-50",
    icon: "text-emerald-600",
    ring: "ring-emerald-100",
    trend: "bg-emerald-50 text-emerald-600",
  },
  "bg-purple-600": {
    tint: "bg-purple-50",
    icon: "text-purple-600",
    ring: "ring-purple-100",
    trend: "bg-purple-50 text-purple-600",
  },
  "bg-blue-600": {
    tint: "bg-blue-50",
    icon: "text-blue-600",
    ring: "ring-blue-100",
    trend: "bg-blue-50 text-blue-600",
  },
  "bg-amber-600": {
    tint: "bg-amber-50",
    icon: "text-amber-600",
    ring: "ring-amber-100",
    trend: "bg-amber-50 text-amber-600",
  },
} as const;

const riskBadgeTheme = {
  RENDAH: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  TINGGI: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  "-": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
} as const;

const RecommendedArticleCard = ({ article }: RecommendedArticleCardProps) => (
  <Link
    to={`/article/${article.slug}`}
    className="group flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm"
  >
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
      {article.thumbnail ? (
        <img src={article.thumbnail} alt={article.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <BookOpen className="h-5 w-5" />
        </div>
      )}
    </div>
    <div className="min-w-0 space-y-1">
      <p className="line-clamp-2 text-sm font-bold leading-tight text-slate-800 transition-colors group-hover:text-emerald-600">
        {article.title}
      </p>
      <p className="text-[11px] font-medium text-slate-400">
        {article.author_name || article.author?.name || "HeartCare"}
      </p>
      <p className="text-[11px] text-slate-400">
        {new Date(article.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  </Link>
);

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0, variant = "default" }: StatCardProps) => {
  const theme = statCardTheme[colorClass as keyof typeof statCardTheme] ?? statCardTheme["bg-emerald-600"];
  const normalizedValue = value.toUpperCase();
  const riskBadgeClass = riskBadgeTheme[normalizedValue as keyof typeof riskBadgeTheme] ?? riskBadgeTheme["-"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className={cn("absolute inset-x-0 top-0 h-1", colorClass)} />
        <div className="absolute right-0 top-0 h-28 w-28 -translate-y-10 translate-x-10 rounded-full bg-slate-100/70 blur-2xl" />

        <div className="relative flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-[1.2rem] ring-1", theme.tint, theme.ring)}>
              <Icon className={cn("h-6 w-6", theme.icon)} />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Ringkasan
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{title}</p>
            {variant === "risk" ? (
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.18em]", riskBadgeClass)}>
                  {value}
                </span>
              </div>
            ) : (
              <h3 className="text-3xl font-black leading-none text-slate-900 font-display">{value}</h3>
            )}
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
              <span className="text-[11px] font-medium text-slate-400">
                {variant === "risk" ? "Berdasarkan prediksi terakhir" : "Terakumulasi hingga hari ini"}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [chats, setChats] = React.useState<ChatItem[]>([]);
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [currentTimestamp] = React.useState(() => Date.now());
  const [dashboardStats, setDashboardStats] = React.useState({
    total_checkups: 0,
    checkups_trend: "0",
    total_consultations: 0,
    consultations_trend: "0",
    total_articles_read: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRes, dashboardRes] = await Promise.all([
          api.get('chats').catch(() => null),
          api.get('user/dashboard').catch(() => null)
        ]);

        if (chatRes?.data?.success) {
          setChats(Array.isArray(chatRes.data.data) ? chatRes.data.data : []);
        }

        if (dashboardRes?.data?.success) {
          const dashboardData = dashboardRes.data.data as Partial<UserDashboardPayload>;
          if (dashboardData.stats) {
            setDashboardStats({
              total_checkups: dashboardData.stats.total_checkups ?? 0,
              checkups_trend: dashboardData.stats.checkups_trend ?? "0",
              total_consultations: dashboardData.stats.total_consultations ?? 0,
              consultations_trend: dashboardData.stats.consultations_trend ?? "0",
              total_articles_read: dashboardData.stats.total_articles_read ?? 0,
            });
          }
          setPredictions(Array.isArray(dashboardData.predictions) ? dashboardData.predictions : []);
          setArticles(Array.isArray(dashboardData.articles) ? dashboardData.articles : []);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null;

  const previousComparisonPrediction = React.useMemo(
    () => (predictions.length > 1 ? predictions[predictions.length - 2] : null),
    [predictions]
  );

  const radarMetricConfig = React.useMemo<RadarMetricConfig[]>(() => ([
    { key: "age", label: "Usia", max: 100, unit: "th" },
    { key: "systolic_bp", label: "Sistolik", max: 200, unit: "mmHg" },
    { key: "diastolic_bp", label: "Diastolik", max: 120, unit: "mmHg" },
    { key: "cholesterol", label: "Kolesterol", max: 300, unit: "mg/dL" },
    { key: "heart_rate", label: "Detak", max: 200, unit: "bpm" },
    { key: "weight", label: "Berat", max: 150, unit: "kg" },
    { key: "height", label: "Tinggi", max: 220, unit: "cm" },
    { key: "blood_sugar", label: "Gula Darah", max: 200, unit: "mg/dL" }
  ]), []);

  const radarData = React.useMemo<RadarChartItem[]>(() => {
    if (!latestPrediction) {
      return [];
    }

    return radarMetricConfig.map((metric) => {
      const latestRawValue = latestPrediction.input_data?.[metric.key];
      const previousRawValue = previousComparisonPrediction?.input_data?.[metric.key];
      const latestValue = Number(latestRawValue ?? 0);
      const previousValue = Number(previousRawValue ?? 0);

      return {
        metric: metric.label,
        latest: Math.min((latestValue / metric.max) * 100, 100),
        previous: Math.min((previousValue / metric.max) * 100, 100),
        latestRaw: latestRawValue !== undefined && latestRawValue !== null && latestRawValue !== "" ? `${latestRawValue} ${metric.unit}` : "-",
        previousRaw: previousRawValue !== undefined && previousRawValue !== null && previousRawValue !== "" ? `${previousRawValue} ${metric.unit}` : "-",
      };
    });
  }, [latestPrediction, previousComparisonPrediction, radarMetricConfig]);

  const latestLifestyleSummary = latestPrediction?.input_data;
  const comparisonPeriodLabel = previousComparisonPrediction
    ? new Date(previousComparisonPrediction.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Belum ada pembanding";
  const latestPeriodLabel = latestPrediction
    ? new Date(latestPrediction.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Belum ada data";

  const latestVitals = latestPrediction ? [
    { label: "Sistolik", value: `${latestPrediction.input_data?.systolic_bp ?? "-"}` },
    { label: "Diastolik", value: `${latestPrediction.input_data?.diastolic_bp ?? "-"}` },
    { label: "Kolesterol", value: `${latestPrediction.input_data?.cholesterol ?? "-"}` },
    { label: "Detak", value: `${latestPrediction.input_data?.heart_rate ?? "-"}` },
  ] : [];

  const getRelativeTimeLabel = (dateString?: string) => {
    if (!dateString) {
      return "Baru saja";
    }

    const diffMs = currentTimestamp - new Date(dateString).getTime();
    const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} hari lalu`;
    }

    if (diffHours > 0) {
      return `${diffHours} jam lalu`;
    }

    return "Baru saja";
  };

  const getRiskDescription = (level: string) => {
    if (level === 'TINGGI') return "Hasil analisis menunjukkan Indikasi Risiko Tinggi. Segera konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.";
    if (level === 'SEDANG') return "Hasil analisis menunjukkan Indikasi Risiko Sedang. Perhatikan pola makan dan mulailah rutinitas olahraga ringan.";
    return "Hasil analisis menunjukkan Kondisi Terpantau Baik. Anda berada dalam kondisi optimal, pertahankan pola hidup sehat.";
  };

  return (
    <div className="space-y-8 relative max-w-[1600px] mx-auto">
      {/* Background Decorations */}
      <div className="fixed top-40 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Prediksi"
          value={dashboardStats.total_checkups.toString()}
          icon={HeartPulse}
          trend={dashboardStats.checkups_trend}
          colorClass="bg-emerald-600"
          delay={0.1}
        />
        <StatCard
          title="Status Risiko"
          value={latestPrediction ? latestPrediction.result_level : "-"}
          icon={Heart}
          colorClass="bg-purple-600"
          delay={0.2}
          variant="risk"
        />
        <StatCard
          title="Konsultasi AI"
          value={dashboardStats.total_consultations.toString()}
          icon={MessageSquare}
          trend={dashboardStats.consultations_trend}
          colorClass="bg-blue-600"
          delay={0.3}
        />
        <StatCard
          title="Artikel Dibaca"
          value={dashboardStats.total_articles_read.toString()}
          icon={BookOpen}
          colorClass="bg-amber-600"
          delay={0.4}
        />
      </div>

      {/* Checkup Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card className="p-8 border-slate-200 shadow-sm rounded-[2.0rem] bg-white overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Perbandingan Checkup</span>
              <h2 className="text-2xl font-black text-slate-900 font-display mt-2">Radar Kondisi Tubuh Saat Ini vs Checkup Sebelumnya</h2>
              <p className="text-sm text-slate-500 mt-2">
                Radar chart ini membandingkan metrik tubuh utama dari hasil checkup terbaru dengan hasil checkup tepat sebelumnya. Skala radar dinormalisasi agar perubahan antar-metrik lebih mudah dibaca.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 font-bold"
              onClick={() => navigate('/user/riwayat')}
            >
              Lihat Riwayat Lengkap <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.85fr_0.8fr] gap-6 items-stretch">
            {radarData.length > 0 ? (
              <>
                <div className="min-h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="72%">
                      <PolarGrid stroke="#dbe4ee" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: "#475569", fontSize: 12, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)"
                        }}
                        formatter={(_value: number, name: string, item: { payload?: RadarChartItem }) => {
                          const payload = item.payload;

                          return [
                            name === "latest" ? payload?.latestRaw ?? "-" : payload?.previousRaw ?? "-",
                            name === "latest" ? "Checkup Terbaru" : "Pembanding"
                          ];
                        }}
                      />
                      <Legend
                        formatter={(value: string) => value === "latest" ? "Checkup Terbaru" : "Checkup Sebelumnya"}
                      />
                      <Radar
                        name="latest"
                        dataKey="latest"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.28}
                        strokeWidth={3}
                      />
                      <Radar
                        name="previous"
                        dataKey="previous"
                        stroke="#0f172a"
                        fill="#0f172a"
                        fillOpacity={0.08}
                        strokeWidth={2}
                        strokeDasharray="6 4"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                    <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Checkup Terbaru</span>
                      <h3 className="text-lg font-black text-slate-900 mt-2 font-display">{latestPeriodLabel}</h3>
                      <p className="text-sm text-slate-600 mt-2">
                        Risiko terakhir: <span className="font-bold text-slate-900">{latestPrediction?.result_level ?? "-"}</span>
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data Pembanding</span>
                      <h3 className="text-lg font-black text-slate-900 mt-2 font-display">{comparisonPeriodLabel}</h3>
                      <p className="text-sm text-slate-600 mt-2">
                        {previousComparisonPrediction ? "Menggunakan hasil checkup tepat sebelumnya sebagai pembanding." : "Belum ada checkup pembanding, jadi chart hanya menonjolkan kondisi terbaru."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 p-5">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.18em] mb-4">Ringkasan Perilaku & Riwayat</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gender</span>
                        <p className="text-sm font-bold text-slate-900 mt-2">{latestLifestyleSummary?.gender ?? "-"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Olahraga</span>
                        <p className="text-sm font-bold text-slate-900 mt-2">{latestLifestyleSummary?.exercise ?? "-"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merokok</span>
                        <p className="text-sm font-bold text-slate-900 mt-2">{latestLifestyleSummary?.smoking ?? "-"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alkohol</span>
                        <p className="text-sm font-bold text-slate-900 mt-2">{latestLifestyleSummary?.alcohol ?? "Tidak ada data"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Riwayat Medis</span>
                        <p className="text-sm font-bold text-slate-900 mt-2">
                          {latestLifestyleSummary?.history?.join(", ") || latestLifestyleSummary?.medical_history?.join(", ") || "Tidak ada riwayat"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm h-full">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Bacaan Pilihan</span>
                        <h3 className="mt-2 text-lg font-black text-slate-900 font-display">Rekomendasi Artikel</h3>
                        <p className="mt-1 text-xs text-slate-500">Artikel terbaru yang relevan untuk user baca setelah melihat kondisi tubuh.</p>
                      </div>
                      <Link to="/articles" className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600 transition hover:bg-emerald-100">
                        Lihat Semua
                      </Link>
                    </div>

                    {articles.length > 0 ? (
                      <div className="space-y-3">
                        {articles.slice(0, 3).map((article) => (
                          <RecommendedArticleCard key={article.id} article={article} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 text-center">
                        <BookOpen className="h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm font-bold text-slate-500">Belum ada artikel rekomendasi</p>
                        <p className="mt-1 max-w-[220px] text-xs text-slate-400">Artikel terbaru yang dipublikasikan akan tampil di sini.</p>
                      </div>
                    )}
                  </div>
                </div>

              </>
            ) : (
              <div className="col-span-full min-h-[320px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Belum ada data checkup</p>
                <p className="text-xs text-slate-400 mt-2">Radar chart akan muncul setelah user memiliki riwayat prediksi.</p>
              </div>
            )}
          </div>

          {radarData.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {radarData.map((item) => (
                <div key={item.metric} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.metric}</span>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-emerald-600">Terbaru</span>
                      <span className="text-sm font-black text-slate-900">{item.latestRaw}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-500">Pembanding</span>
                      <span className="text-sm font-black text-slate-700">{item.previousRaw}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Last Prediction Result */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="xl:col-span-7"
        >
          <Card className="p-8 border-none shadow-xl rounded-[2.0rem] bg-gradient-to-br from-emerald-600 to-emerald-700 text-white h-full flex flex-col relative overflow-hidden group min-h-[560px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

            <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-white font-display">Prediksi Terakhir</h2>
                <div className="flex items-center gap-2 text-emerald-100 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {latestPrediction ? new Date(latestPrediction.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' WIB' : 'Belum ada data'}
                  </span>
                </div>
              </div>
              {latestPrediction && <RiskBadge level={latestPrediction.result_level} className="scale-110" />}
            </div>

            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center py-4">
              <div className="space-y-6">
                {latestPrediction ? (
                  <>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-50">
                      Snapshot Kondisi Terkini
                    </div>
                    <p className="text-emerald-50 text-lg leading-relaxed font-semibold">
                      {getRiskDescription(latestPrediction.result_level)}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {latestVitals.map((item) => (
                        <div key={item.label} className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">{item.label}</span>
                          <p className="text-2xl font-black text-white mt-2 font-display">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-start justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-4">
                      <HeartPulse className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Belum ada prediksi</p>
                    <Button variant="ghost" className="mt-2 text-white font-bold hover:bg-white/10" onClick={() => navigate('/user/cek-kesehatan')}>Mulai Cek Kesehatan</Button>
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-md p-6 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100">Catatan Pendukung</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.25rem] bg-white/10 p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">Usia</span>
                    <p className="text-xl font-black text-white mt-2">{latestLifestyleSummary?.age ?? "-"}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-white/10 p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">Gula Darah</span>
                    <p className="text-xl font-black text-white mt-2">{latestLifestyleSummary?.blood_sugar ?? "-"}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-white/10 p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">Olahraga</span>
                    <p className="text-sm font-bold text-white mt-2">{latestLifestyleSummary?.exercise ?? "-"}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-white/10 p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">Merokok</span>
                    <p className="text-sm font-bold text-white mt-2">{latestLifestyleSummary?.smoking ?? "-"}</p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">Ringkas</span>
                  <p className="text-sm text-emerald-50/90 mt-2 leading-relaxed">
                    {latestLifestyleSummary?.history?.join(", ") || latestLifestyleSummary?.medical_history?.join(", ") || "Belum ada riwayat medis yang dicatat pada checkup terakhir."}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-8 border-t border-emerald-500/50 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 font-bold"
                onClick={() => navigate('/user/riwayat')}
              >
                Lihat Riwayat
              </Button>
              <Button
                className="flex-1 h-12 rounded-2xl border-none bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-lg"
                onClick={() => navigate('/user/hasil-prediksi')}
              >
                Detail Hasil <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="xl:col-span-5 grid gap-8">
          {/* Recent Consultations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-8 border-slate-200 shadow-sm rounded-[2.0rem] bg-white h-full flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 font-display">Konsultasi Terakhir</h2>
                <Link to="/user/konsultasi" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline px-3 py-1 bg-emerald-50 rounded-lg transition-all">
                  Lihat Semua
                </Link>
              </div>

              <div className="flex-1 space-y-4">
                {chats.length > 0 ? (
                  chats.slice(0, 3).map((chat: ChatItem, idx: number) => (
                    <motion.div
                      key={chat.id || idx}
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-[2.0rem] border border-slate-50 hover:border-emerald-100 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex gap-4 items-start"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{chat.message}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">AI: {chat.response}</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{getRelativeTimeLabel(chat.created_at)}</span>
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
      </div>
    </div>
  );
}
