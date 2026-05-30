import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Heart,
  HeartPulse,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react"
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import api from "~/lib/api"
import { saveLastPrediction } from "~/lib/lastPrediction"
import { cn } from "~/lib/utils"
import { RiskBadge } from "~/components/shared/RiskBadge"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import type { Article } from "~/types/shared"
import type { Prediction } from "~/types/UserPage/User"

interface ChatItem {
  id?: string
  _id?: string
  message: string
  response: string
  created_at?: string
}

interface UserDashboardPayload {
  stats?: {
    total_checkups: number
    checkups_trend: string
    total_consultations: number
    consultations_trend: string
    total_articles_read: number
  }
  predictions?: Prediction[]
  articles?: Article[]
}

interface RadarMetricConfig {
  key: keyof Prediction["input_data"]
  label: string
  max: number
  unit: string
}

interface RadarChartItem {
  metric: string
  latest: number
  previous: number
  latestRaw: string
  previousRaw: string
}

interface RecommendedArticleCardProps {
  article: Article
}

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  colorClass: keyof typeof statCardTheme
  delay?: number
  variant?: "default" | "risk"
}

const statCardTheme = {
  "bg-emerald-600": {
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    badge: "success",
    footer: "text-emerald-700",
  },
  "bg-purple-600": {
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
    badge: "info",
    footer: "text-violet-700",
  },
  "bg-blue-600": {
    accent: "bg-blue-50 text-blue-700 ring-blue-100",
    badge: "info",
    footer: "text-blue-700",
  },
  "bg-amber-600": {
    accent: "bg-amber-50 text-amber-700 ring-amber-100",
    badge: "warning",
    footer: "text-amber-700",
  },
} as const

const riskBadgeTheme = {
  RENDAH: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  SEDANG: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  TINGGI: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  "-": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
} as const

const latestCheckupTheme = {
  RENDAH: {
    card: "border-emerald-100 bg-emerald-50",
    label: "text-emerald-700",
    date: "text-slate-950",
    text: "text-emerald-900/75",
    value: "text-emerald-800",
  },
  SEDANG: {
    card: "border-amber-100 bg-amber-50",
    label: "text-amber-700",
    date: "text-slate-950",
    text: "text-amber-900/75",
    value: "text-amber-800",
  },
  TINGGI: {
    card: "border-rose-100 bg-rose-50",
    label: "text-rose-700",
    date: "text-slate-950",
    text: "text-rose-900/75",
    value: "text-rose-800",
  },
  "-": {
    card: "border-slate-200/80 bg-slate-50",
    label: "text-slate-400",
    date: "text-slate-950",
    text: "text-slate-500",
    value: "text-slate-950",
  },
} as const

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat("id-ID").format(value ?? 0)
}

function formatLifestyleValue(type: "gender" | "exercise" | "smoking" | "alcohol", value?: string | null) {
  if (!value) {
    return "-"
  }

  const normalized = value.toString().trim().toLowerCase()
  const lifestyleMap = {
    gender: {
      male: "Laki-laki",
      female: "Perempuan",
      "laki-laki": "Laki-laki",
      pria: "Laki-laki",
      perempuan: "Perempuan",
      wanita: "Perempuan",
    },
    exercise: {
      yes: "Aktif",
      no: "Jarang",
      true: "Aktif",
      false: "Jarang",
      jarang: "Jarang",
      "1-2x seminggu": "1-2x seminggu",
      "3-4x seminggu": "3-4x seminggu",
      "setiap hari": "Setiap hari",
    },
    smoking: {
      yes: "Ya",
      no: "Tidak",
      true: "Ya",
      false: "Tidak",
      tidak: "Tidak",
      kadang: "Kadang",
      sering: "Sering",
      "sudah berhenti": "Sudah berhenti",
    },
    alcohol: {
      yes: "Ya",
      no: "Tidak",
      true: "Ya",
      false: "Tidak",
      tidak: "Tidak",
      ya: "Ya",
      kadang: "Kadang",
      sering: "Sering",
    },
  } as const

  const mappedValue = lifestyleMap[type][normalized as keyof (typeof lifestyleMap)[typeof type]]

  if (mappedValue) {
    return mappedValue
  }

  return value.toString()
}

const RecommendedArticleCard = ({ article }: RecommendedArticleCardProps) => (
  <Link
    to={`/article/${article.slug}`}
    className="group flex items-start gap-3 rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-3 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-sm"
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
      <p className="line-clamp-2 text-sm font-bold leading-tight text-slate-800 transition-colors group-hover:text-emerald-700">
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
)

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  colorClass,
  delay = 0,
  variant = "default",
}: StatCardProps) {
  const theme = statCardTheme[colorClass]
  const normalizedValue = value.toUpperCase()
  const riskBadgeClass =
    riskBadgeTheme[normalizedValue as keyof typeof riskBadgeTheme] ?? riskBadgeTheme["-"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="h-full"
    >
      <Card className="flex h-full flex-col rounded-[1.75rem] border-slate-200/90 shadow-sm">
        <CardHeader className="items-start gap-4 border-b-0 px-6 pb-0 pt-6">
          <div className="flex w-full items-start justify-between gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset",
                theme.accent
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <Badge
              variant={theme.badge as "success" | "warning" | "danger" | "info" | "neutral"}
              size="sm"
              className="uppercase tracking-[0.18em]"
            >
              Ringkasan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 px-6 pb-5 pt-5">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {title}
            </p>
            {variant === "risk" ? (
              <span
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.18em]",
                  riskBadgeClass
                )}
              >
                {value}
              </span>
            ) : (
              <p className="font-display text-4xl font-black leading-none text-slate-950">
                {value}
              </p>
            )}
          </div>
          <CardDescription className="text-sm leading-6 text-slate-500">
            {variant === "risk"
              ? "Status dari hasil prediksi terakhir yang tersimpan."
              : "Terakumulasi dari aktivitas pengguna sampai hari ini."}
          </CardDescription>
        </CardContent>
        <CardFooter className="border-t border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <TrendingUp className={cn("h-3.5 w-3.5", theme.footer)} />
            <span>{trend ? `${trend} vs bulan lalu` : "Snapshot dashboard user"}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const [chats, setChats] = React.useState<ChatItem[]>([])
  const [predictions, setPredictions] = React.useState<Prediction[]>([])
  const [articles, setArticles] = React.useState<Article[]>([])
  const [currentTimestamp] = React.useState(() => Date.now())
  const [dashboardStats, setDashboardStats] = React.useState({
    total_checkups: 0,
    checkups_trend: "0",
    total_consultations: 0,
    consultations_trend: "0",
    total_articles_read: 0,
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRes, dashboardRes] = await Promise.all([
          api.get("chats").catch(() => null),
          api.get("user/dashboard").catch(() => null),
        ])

        if (chatRes?.data?.success) {
          setChats(Array.isArray(chatRes.data.data) ? chatRes.data.data : [])
        }

        if (dashboardRes?.data?.success) {
          const dashboardData = dashboardRes.data.data as Partial<UserDashboardPayload>
          if (dashboardData.stats) {
            setDashboardStats({
              total_checkups: dashboardData.stats.total_checkups ?? 0,
              checkups_trend: dashboardData.stats.checkups_trend ?? "0",
              total_consultations: dashboardData.stats.total_consultations ?? 0,
              consultations_trend: dashboardData.stats.consultations_trend ?? "0",
              total_articles_read: dashboardData.stats.total_articles_read ?? 0,
            })
          }
          setPredictions(Array.isArray(dashboardData.predictions) ? dashboardData.predictions : [])
          setArticles(Array.isArray(dashboardData.articles) ? dashboardData.articles : [])
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e)
      }
    }
    fetchData()
  }, [])

  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  const previousComparisonPrediction = React.useMemo(
    () => (predictions.length > 1 ? predictions[predictions.length - 2] : null),
    [predictions]
  )

  const latestPredictionDetailState = React.useMemo(() => {
    if (!latestPrediction) {
      return null
    }

    return {
      prediction: {
        id: latestPrediction.id,
        risk_level: latestPrediction.result_level,
        risk_score: latestPrediction.result_score,
        created_at: latestPrediction.created_at,
      },
      formData: latestPrediction.input_data,
      timestamp: latestPrediction.created_at,
    }
  }, [latestPrediction])

  const radarMetricConfig = React.useMemo<RadarMetricConfig[]>(() => ([
    { key: "age", label: "Usia", max: 100, unit: "th" },
    { key: "systolic_bp", label: "Sistolik", max: 200, unit: "mmHg" },
    { key: "diastolic_bp", label: "Diastolik", max: 120, unit: "mmHg" },
    { key: "cholesterol", label: "Kolesterol", max: 300, unit: "mg/dL" },
    { key: "weight", label: "Berat", max: 150, unit: "kg" },
    { key: "height", label: "Tinggi", max: 220, unit: "cm" },
    { key: "blood_sugar", label: "Gula Darah", max: 200, unit: "mg/dL" },
  ]), [])

  const radarData = React.useMemo<RadarChartItem[]>(() => {
    if (!latestPrediction) {
      return []
    }

    return radarMetricConfig.map((metric) => {
      const latestRawValue = latestPrediction.input_data?.[metric.key]
      const previousRawValue = previousComparisonPrediction?.input_data?.[metric.key]
      const latestValue = Number(latestRawValue ?? 0)
      const previousValue = Number(previousRawValue ?? 0)

      return {
        metric: metric.label,
        latest: Math.min((latestValue / metric.max) * 100, 100),
        previous: Math.min((previousValue / metric.max) * 100, 100),
        latestRaw:
          latestRawValue !== undefined && latestRawValue !== null && latestRawValue !== ""
            ? `${latestRawValue} ${metric.unit}`
            : "-",
        previousRaw:
          previousRawValue !== undefined && previousRawValue !== null && previousRawValue !== ""
            ? `${previousRawValue} ${metric.unit}`
            : "-",
      }
    })
  }, [latestPrediction, previousComparisonPrediction, radarMetricConfig])

  const latestLifestyleSummary = latestPrediction?.input_data
  const comparisonPeriodLabel = previousComparisonPrediction
    ? new Date(previousComparisonPrediction.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Belum ada pembanding"
  const latestPeriodLabel = latestPrediction
    ? new Date(latestPrediction.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Belum ada data"
  const latestRiskLevel = latestPrediction?.result_level?.toUpperCase() ?? "-"
  const latestCheckupCardTheme =
    latestCheckupTheme[latestRiskLevel as keyof typeof latestCheckupTheme] ?? latestCheckupTheme["-"]

  const latestVitals = latestPrediction ? [
    { label: "Sistolik", value: `${latestPrediction.input_data?.systolic_bp ?? "-"}` },
    { label: "Diastolik", value: `${latestPrediction.input_data?.diastolic_bp ?? "-"}` },
    { label: "Kolesterol", value: `${latestPrediction.input_data?.cholesterol ?? "-"}` },
  ] : []

  const getRelativeTimeLabel = (dateString?: string) => {
    if (!dateString) {
      return "Baru saja"
    }

    const diffMs = currentTimestamp - new Date(dateString).getTime()
    const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} hari lalu`
    }

    if (diffHours > 0) {
      return `${diffHours} jam lalu`
    }

    return "Baru saja"
  }

  const getRiskDescription = (level: string) => {
    if (level === "TINGGI") {
      return "Hasil analisis menunjukkan Indikasi Risiko Tinggi. Segera konsultasikan dengan dokter untuk pemeriksaan lebih lanjut."
    }
    if (level === "SEDANG") {
      return "Hasil analisis menunjukkan Indikasi Risiko Sedang. Perhatikan pola makan dan mulailah rutinitas olahraga ringan."
    }
    return "Hasil analisis menunjukkan Kondisi Terpantau Baik. Anda berada dalam kondisi optimal, pertahankan pola hidup sehat."
  }

  const handleOpenLatestPredictionDetail = () => {
    if (!latestPredictionDetailState) {
      navigate("/user/cek-kesehatan")
      return
    }

    saveLastPrediction(latestPredictionDetailState)
    navigate("/user/hasil-prediksi", { state: latestPredictionDetailState })
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Prediksi"
          value={formatNumber(dashboardStats.total_checkups)}
          icon={HeartPulse}
          trend={dashboardStats.checkups_trend}
          colorClass="bg-emerald-600"
          delay={0.05}
        />
        <StatCard
          title="Status Risiko"
          value={latestPrediction ? latestPrediction.result_level : "-"}
          icon={Heart}
          colorClass="bg-purple-600"
          delay={0.1}
          variant="risk"
        />
        <StatCard
          title="Konsultasi AI"
          value={formatNumber(dashboardStats.total_consultations)}
          icon={MessageSquare}
          trend={dashboardStats.consultations_trend}
          colorClass="bg-blue-600"
          delay={0.15}
        />
        <StatCard
          title="Artikel Dibaca"
          value={formatNumber(dashboardStats.total_articles_read)}
          icon={BookOpen}
          colorClass="bg-amber-600"
          delay={0.2}
        />
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
            <CardHeader className="items-start gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-xl font-black tracking-tight">
                  Perbandingan Checkup
                </CardTitle>
                <CardDescription>
                  Radar kondisi tubuh saat ini dibandingkan checkup tepat sebelumnya.
                </CardDescription>
              </div>
              <Badge variant="success" size="sm" className="uppercase tracking-[0.18em]">
                Terbaru vs sebelumnya
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-6">
              {radarData.length > 0 ? (
                <>
                  <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
                    <div className="min-h-[320px] rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-3 sm:min-h-[360px] sm:p-4 xl:h-full">
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
                              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                            }}
                            formatter={(
                              _value: unknown,
                              name: unknown,
                              item: { payload?: RadarChartItem }
                            ) => {
                              const payload = item.payload

                              return [
                                name === "latest"
                                  ? payload?.latestRaw ?? "-"
                                  : payload?.previousRaw ?? "-",
                                name === "latest" ? "Checkup Terbaru" : "Pembanding",
                              ]
                            }}
                          />
                          <Legend
                            formatter={(value: string) =>
                              value === "latest" ? "Checkup Terbaru" : "Checkup Sebelumnya"
                            }
                          />
                          <Radar
                            name="latest"
                            dataKey="latest"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.25}
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

                    <div className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div
                        className={cn(
                          "rounded-[1.25rem] border p-4 transition-colors",
                          latestCheckupCardTheme.card
                        )}
                      >
                        <p
                          className={cn(
                            "text-[11px] font-semibold uppercase tracking-[0.2em]",
                            latestCheckupCardTheme.label
                          )}
                        >
                          Checkup terbaru
                        </p>
                        <p className={cn("mt-2 text-lg font-black", latestCheckupCardTheme.date)}>
                          {latestPeriodLabel}
                        </p>
                        <p className={cn("mt-2 text-sm leading-6", latestCheckupCardTheme.text)}>
                          Risiko terakhir:{" "}
                          <span className={cn("font-bold", latestCheckupCardTheme.value)}>
                            {latestPrediction?.result_level ?? "-"}
                          </span>
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Data pembanding
                        </p>
                        <p className="mt-2 text-lg font-black text-slate-950">
                          {comparisonPeriodLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {previousComparisonPrediction
                            ? "Menggunakan hasil checkup tepat sebelumnya sebagai pembanding."
                            : "Belum ada checkup pembanding, jadi chart hanya menonjolkan kondisi terbaru."}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Ringkasan perilaku
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {[
                            {
                              label: "Jenis kelamin",
                              value: formatLifestyleValue("gender", latestLifestyleSummary?.gender),
                            },
                            {
                              label: "Olahraga",
                              value: formatLifestyleValue("exercise", latestLifestyleSummary?.exercise),
                            },
                            {
                              label: "Merokok",
                              value: formatLifestyleValue("smoking", latestLifestyleSummary?.smoking),
                            },
                            {
                              label: "Alkohol",
                              value: formatLifestyleValue("alcohol", latestLifestyleSummary?.alcohol),
                            },
                          ].map((item) => (
                            <div key={item.label} className="rounded-xl bg-white px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                {item.label}
                              </p>
                              <p className="mt-1 truncate text-xs font-bold text-slate-950">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="h-11 w-full rounded-xl sm:col-span-2 xl:col-span-1"
                        onClick={() => navigate("/user/riwayat")}
                      >
                        Lihat riwayat lengkap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {radarData.map((item) => (
                        <div
                          key={item.metric}
                          className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-4"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {item.metric}
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-emerald-700">Terbaru</span>
                              <span className="text-sm font-black text-slate-950">
                                {item.latestRaw}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-slate-500">Pembanding</span>
                              <span className="text-sm font-black text-slate-700">
                                {item.previousRaw}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Bacaan pilihan
                          </p>
                          <p className="text-lg font-black text-slate-950">
                            Rekomendasi Artikel
                          </p>
                        </div>
                        <Button asChild variant="secondary" size="sm" className="rounded-xl">
                          <Link to="/articles">Lihat semua</Link>
                        </Button>
                      </div>

                      {articles.length > 0 ? (
                        <div className="space-y-3">
                          {articles.slice(0, 3).map((article, index) => (
                            <div key={article.id}>
                              <RecommendedArticleCard article={article} />
                              {index < Math.min(articles.length, 3) - 1 ? (
                                <Separator className="my-3 bg-slate-200/80" />
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-white text-center">
                          <BookOpen className="h-8 w-8 text-slate-300" />
                          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                            Belum ada artikel rekomendasi
                          </p>
                          <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-400">
                            Artikel terbaru yang dipublikasikan akan tampil di sini.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                    Belum ada data checkup
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Radar chart akan muncul setelah user memiliki riwayat prediksi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-6 py-5">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl font-black tracking-tight">
                    Prediksi Terakhir
                  </CardTitle>
                  <CardDescription>
                    Snapshot hasil analisis kesehatan terbaru.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                {latestPrediction ? (
                  <>
                    <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Status risiko
                          </p>
                          <RiskBadge level={latestPrediction.result_level} />
                        </div>
                        <Badge variant="neutral" size="sm" className="uppercase tracking-[0.18em]">
                          Skor {latestPrediction.result_score ?? "-"}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-emerald-700" />
                        <span>
                          {new Date(latestPrediction.created_at)
                            .toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            .replace(".", ":")}{" "}
                          WIB
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-slate-500">
                      {getRiskDescription(latestPrediction.result_level)}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {latestVitals.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50 p-4"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 text-2xl font-black text-slate-950">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button className="h-11 w-full rounded-xl" onClick={handleOpenLatestPredictionDetail}>
                      Detail hasil
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                      Belum ada prediksi
                    </p>
                    <Button className="mt-4 rounded-xl" onClick={() => navigate("/user/cek-kesehatan")}>
                      Mulai cek kesehatan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="h-full rounded-[1.9rem] border-slate-200/90 shadow-sm">
              <CardHeader className="items-start gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl font-black tracking-tight">
                    Konsultasi Terakhir
                  </CardTitle>
                  <CardDescription>
                    Percakapan AI terbaru dari akun pengguna.
                  </CardDescription>
                </div>
                <Button asChild variant="secondary" size="sm" className="rounded-xl">
                  <Link to="/user/konsultasi">Lihat semua</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {chats.length > 0 ? (
                  chats.slice(0, 3).map((chat: ChatItem, idx: number) => (
                    <div key={chat.id || chat._id || idx}>
                      <Link
                        to="/user/konsultasi"
                        className="flex min-h-[104px] items-start gap-4 rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4 transition-colors hover:border-emerald-200 hover:bg-white"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/80">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-slate-950">
                            {chat.message}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            AI: {chat.response}
                          </p>
                          <span className="mt-2 inline-flex text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                            {getRelativeTimeLabel(chat.created_at)}
                          </span>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                      </Link>
                      {idx < Math.min(chats.length, 3) - 1 ? (
                        <Separator className="my-4 bg-slate-100" />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50 text-center">
                    <MessageSquare className="h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                      Belum ada konsultasi
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-slate-100 px-6 py-5">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-dashed"
                  onClick={() => navigate("/user/konsultasi")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Mulai konsultasi baru
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
