import * as React from "react"
import { Link } from "react-router-dom"
import {
  Activity,
  ArrowUpRight,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { adminService } from "~/lib/adminService"
import { cn } from "~/lib/utils"
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
import { Skeleton } from "~/components/ui/skeleton"

type GrowthPoint = {
  day: string
  users: number
}

type AdminStats = {
  total_users?: number
  total_articles?: number
  growth?: GrowthPoint[]
}

type PredictionTrend = {
  name: string
  value: number
  color: string
}

type PredictionStats = {
  today_predictions?: number
  total_predictions?: number
  trends?: PredictionTrend[]
}

type MetricCardProps = {
  title: string
  value: string
  description: string
  icon: React.ElementType
  accentClassName: string
  badgeLabel: string
  footerLabel: string
}

const fallbackGrowthData: GrowthPoint[] = [
  { day: "Sen", users: 12 },
  { day: "Sel", users: 18 },
  { day: "Rab", users: 15 },
  { day: "Kam", users: 25 },
  { day: "Jum", users: 22 },
  { day: "Sab", users: 30 },
  { day: "Min", users: 34 },
]

const fallbackPredictionTrends: PredictionTrend[] = [
  { name: "Rendah", value: 45, color: "#10b981" },
  { name: "Tinggi", value: 15, color: "#ef4444" },
]

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat("id-ID").format(value ?? 0)
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  accentClassName,
  badgeLabel,
  footerLabel,
}: MetricCardProps) {
  return (
    <Card className="rounded-[1.75rem] border-slate-200/90 shadow-sm">
      <CardHeader className="items-start gap-4 border-b-0 px-6 pb-0 pt-6">
        <div className="flex w-full items-start justify-between gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset",
              accentClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="neutral" size="sm" className="uppercase tracking-[0.18em]">
            {badgeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-5 pt-5">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {title}
          </p>
          <p className="font-display text-4xl font-black leading-none text-slate-950">
            {value}
          </p>
        </div>
        <CardDescription className="text-sm leading-6 text-slate-500">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span>{footerLabel}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border-slate-200/90">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-10 w-72 rounded-2xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded-full" />
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-[1.75rem] border-slate-200/90">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-2xl" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.95fr)]">
        <Card className="rounded-[1.75rem] border-slate-200/90">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-44 rounded-2xl" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-[280px] w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200/90">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 rounded-2xl" />
              <Skeleton className="h-4 w-28 rounded-full" />
            </div>
            <Skeleton className="h-[280px] w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<AdminStats | null>(null)
  const [predStats, setPredStats] = React.useState<PredictionStats | null>(null)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res, predRes] = await Promise.all([
          adminService.getStats(),
          adminService.getPredictionStats(),
        ])

        setStats((res.data ?? null) as AdminStats | null)
        setPredStats((predRes.data ?? null) as PredictionStats | null)
      } catch (err) {
        console.error("Fetch stats error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const growthData = React.useMemo(() => {
    return Array.isArray(stats?.growth) && stats.growth.length > 0
      ? stats.growth
      : fallbackGrowthData
  }, [stats])

  const predictionTrends = React.useMemo(() => {
    return Array.isArray(predStats?.trends) && predStats.trends.length > 0
      ? predStats.trends
      : fallbackPredictionTrends
  }, [predStats])

  const totalPredictions = predStats?.total_predictions ?? 0
  const averageDailyUsers = Math.round(
    growthData.reduce((sum, item) => sum + item.users, 0) / growthData.length
  )
  const highestPredictionBucket = [...predictionTrends].sort(
    (a, b) => b.value - a.value
  )[0]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.9rem] border-slate-200/90 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" size="sm" className="uppercase tracking-[0.18em]">
              Admin overview
            </Badge>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
                Ringkasan Sistem HeartCare
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Pantau pertumbuhan pengguna, intensitas prediksi, dan status konten
                edukasi dari satu dashboard yang lebih rapi dan konsisten dengan sistem
                komponen yang sekarang dipakai di admin area.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/admin/users">
                Kelola user
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/admin/articles">
                Kelola artikel
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Pengguna"
          value={formatNumber(stats?.total_users)}
          description="Jumlah akun yang sudah aktif di ekosistem HeartCare hingga saat ini."
          icon={Users}
          accentClassName="bg-emerald-50 text-emerald-700 ring-emerald-100"
          badgeLabel="User base"
          footerLabel={`${averageDailyUsers} pengguna rata-rata per hari`}
        />
        <MetricCard
          title="Prediksi Hari Ini"
          value={formatNumber(predStats?.today_predictions)}
          description="Prediksi risiko yang masuk hari ini untuk dipantau oleh tim admin."
          icon={Activity}
          accentClassName="bg-blue-50 text-blue-700 ring-blue-100"
          badgeLabel="Realtime"
          footerLabel={`${formatNumber(totalPredictions)} total prediksi tersimpan`}
        />
        <MetricCard
          title="Artikel Published"
          value={formatNumber(stats?.total_articles)}
          description="Konten edukasi yang sudah tayang dan tersedia bagi pengguna."
          icon={FileText}
          accentClassName="bg-violet-50 text-violet-700 ring-violet-100"
          badgeLabel="Content"
          footerLabel="Siap dipakai untuk kanal edukasi pengguna"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.95fr)]">
        <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
          <CardHeader className="items-start gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-black tracking-tight">
                Pertumbuhan Pengguna
              </CardTitle>
              <CardDescription>
                Distribusi pendaftaran user dalam 7 hari terakhir.
              </CardDescription>
            </div>
            <Badge variant="success" size="sm" className="uppercase tracking-[0.18em]">
              7 hari terakhir
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Rata-rata
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {formatNumber(averageDailyUsers)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Puncak harian
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {formatNumber(Math.max(...growthData.map((item) => item.users)))}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Total mingguan
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {formatNumber(growthData.reduce((sum, item) => sum + item.users, 0))}
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="adminGrowthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ stroke: "#10b981", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#adminGrowthFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
          <CardHeader className="border-b border-slate-100 px-6 py-5">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-black tracking-tight">
                Distribusi Prediksi
              </CardTitle>
              <CardDescription>
                Snapshot hasil prediksi terbaru yang tercatat di sistem.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Dominan saat ini
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {highestPredictionBucket?.name ?? "Belum ada data"}
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  {formatNumber(highestPredictionBucket?.value)}
                </Badge>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionTrends} barGap={18}>
                  <CartesianGrid vertical={false} stroke="#eef2f7" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={52}>
                    {predictionTrends.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500">Total prediksi</span>
                <span className="font-bold text-slate-950">
                  {formatNumber(totalPredictions)}
                </span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                {predictionTrends.map((entry) => {
                  const width =
                    totalPredictions > 0 ? (entry.value / totalPredictions) * 100 : 0

                  return (
                    <div
                      key={entry.name}
                      className="h-full first:rounded-l-full last:rounded-r-full"
                      style={{ width: `${width}%`, backgroundColor: entry.color }}
                    />
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
          <CardHeader className="border-b border-slate-100 px-6 py-5">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-black tracking-tight">
                Fokus Operasional
              </CardTitle>
              <CardDescription>
                Tiga area utama yang paling cepat dibutuhkan admin hari ini.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {[
              {
                icon: ShieldCheck,
                title: "Validasi aktivitas",
                description:
                  "Pastikan lonjakan prediksi harian selaras dengan traffic pengguna yang masuk.",
                badge: "Monitoring",
                tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
              },
              {
                icon: FileText,
                title: "Audit konten edukasi",
                description:
                  "Cek kembali artikel published dan siapkan batch berikutnya bila engagement meningkat.",
                badge: "Editorial",
                tone: "bg-blue-50 text-blue-700 ring-blue-100",
              },
              {
                icon: Activity,
                title: "Pantau distribusi risiko",
                description:
                  "Gunakan tren prediksi untuk melihat apakah bucket berisiko tinggi mulai meningkat.",
                badge: "Clinical signal",
                tone: "bg-violet-50 text-violet-700 ring-violet-100",
              },
            ].map((item, index) => (
              <div key={item.title}>
                <div className="flex items-start gap-4 rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
                      item.tone
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <Badge variant="neutral" size="sm">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < 2 ? <Separator className="my-4" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.9rem] border-slate-200/90 shadow-sm">
          <CardHeader className="border-b border-slate-100 px-6 py-5">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-black tracking-tight">
                Health Check
              </CardTitle>
              <CardDescription>
                Ringkasan cepat kondisi data dan konten saat ini.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Total user
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatNumber(stats?.total_users)}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Prediksi hari ini
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatNumber(predStats?.today_predictions)}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Artikel aktif
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatNumber(stats?.total_articles)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
