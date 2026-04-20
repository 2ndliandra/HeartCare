// @ts-nocheck
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, 
  Printer, 
  Info, 
  MessageSquare, 
  History,
  ChevronRight,
  Apple,
  Dumbbell,
  Stethoscope,
  Brain,
  MinusCircle,
  ShieldCheck,
  AlertCircle,
  HeartPulse
} from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RiskBadge } from "~/components/shared/RiskBadge";
import type { RiskLevel } from "~/components/shared/RiskBadge";
import { cn } from "~/lib/utils";

export default function HasilPrediksiPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state or localStorage or use defaults
  const [data, setData] = React.useState(() => {
    if (location.state) return location.state;
    const stored = localStorage.getItem('last_prediction');
    if (stored) return JSON.parse(stored);
    return {
      prediction: { risk_level: "rendah", risk_score: 25 },
      formData: { 
        age: 35, gender: "male", systolic_bp: 120, diastolic_bp: 80, 
        cholesterol: 200, heart_rate: 72, weight: 70, height: 170,
        smoking: "Tidak", exercise: "3-4x Seminggu", medical_history: ["Diabetes"]
      }
    };
  });

  const { prediction, formData, timestamp } = data;

  let rawRisk = prediction.risk_level;
  if (typeof rawRisk === 'boolean') {
    rawRisk = rawRisk ? "TINGGI" : "RENDAH";
  } else if (rawRisk === "true" || rawRisk === "1") {
    rawRisk = "TINGGI";
  } else if (rawRisk === "false" || rawRisk === "0") {
    rawRisk = "RENDAH";
  }

  const riskLevel = (rawRisk?.toUpperCase() === "RENDAH" ? "RENDAH" : "TINGGI") as RiskLevel;
  const score = prediction.risk_score || (riskLevel === "TINGGI" ? 85 : 15);

  const getColorByLevel = (lvl: string) => {
    if (lvl === "RENDAH") return "text-emerald-600";
    return "text-red-500";
  };

  const getInterpretation = (lvl: string) => {
    switch (lvl) {
      case "RENDAH":
        return "Selamat! Hasil analisis menunjukkan bahwa Kondisi Terpantau Baik. Ini adalah kabar baik yang menunjukkan bahwa kondisi kesehatan jantung Anda saat ini dalam keadaan optimal. Namun, tetap penting untuk menjaga pola hidup sehat.";
      default:
        return "Hasil analisis menunjukkan bahwa Anda Perlu Perhatian Medis segera. Kami sangat menyarankan Anda untuk segera berkonsultasi dengan dokter spesialis jantung untuk pemeriksaan lebih lanjut.";
    }
  };

  const recommendations = [
    {
      category: "NUTRISI",
      title: "Jaga Pola Makan Sehat",
      desc: "Konsumsi makanan rendah lemak jenuh, tinggi serat seperti buah, sayur, dan biji-bijian. Kurangi garam dan gula.",
      icon: Apple,
      color: "emerald"
    },
    {
      category: "OLAHRAGA",
      title: "Tingkatkan Aktivitas Fisik",
      desc: "Lakukan olahraga aerobik minimal 150 menit per minggu. Pilihan: jalan cepat, jogging, atau berenang.",
      icon: Dumbbell,
      color: "blue"
    }
  ];

  // Dynamic recommendations based on data
  if (parseInt(formData.systolic_bp) >= 140 || parseInt(formData.diastolic_bp) >= 90) {
    recommendations.push({
      category: "HIPERTENSI",
      title: "Kontrol Tekanan Darah",
      desc: "Tekanan darah Anda terpantau tinggi. Kurangi asupan garam (maks 1 sdt/hari) dan kelola stres dengan baik.",
      icon: Stethoscope,
      color: "red"
    });
  }

  if (parseInt(formData.cholesterol) >= 240) {
    recommendations.push({
      category: "KOLESTEROL",
      title: "Turunkan Kadar Kolesterol",
      desc: "Kadar kolesterol Anda cukup tinggi. Hindari gorengan dan makanan bersantan. Tingkatkan konsumsi omega-3.",
      icon: Brain,
      color: "amber"
    });
  }

  const h = (parseFloat(formData.height) || 0) / 100;
  const w = parseFloat(formData.weight) || 0;
  const bmi = h > 0 ? (w / (h * h)) : 0;
  
  if (bmi >= 25) {
    recommendations.push({
      category: "BERAT BADAN",
      title: "Manajemen Berat Badan",
      desc: `BMI Anda ${bmi.toFixed(1)} (Overweight/Obesitas). Penurunan berat badan 5-10% dapat signifikan mengurangi beban jantung.`,
      icon: HeartPulse,
      color: "rose"
    });
  }

  if (formData.smoking && formData.smoking !== "Tidak") {
    recommendations.push({
      category: "GAYA HIDUP",
      title: "Hentikan Kebiasaan Merokok",
      desc: "Merokok adalah faktor risiko utama. Segera hentikan dan konsultasikan program berhenti merokok.",
      icon: MinusCircle,
      color: "red"
    });
  }

  // Calculate gauge dash offset
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const displayDate = timestamp ? new Date(timestamp) : new Date();

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            Dashboard <ChevronRight className="w-4 h-4" /> <span className="text-slate-900">Hasil Prediksi</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 font-display">Hasil Prediksi Risiko Jantung</h1>
          <p className="text-sm text-slate-600">Dibuat pada: {displayDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" /> PDF Hasil
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Cetak
          </Button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <Card className={cn(
        "p-12 mb-8 border-none shadow-2xl rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-500",
        riskLevel === "RENDAH" ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" : 
        "bg-gradient-to-br from-rose-500 to-rose-600 text-white"
      )}>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl opacity-20" />
        
        <div className="relative z-10 space-y-6">
           <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-white/30">
              {riskLevel === "RENDAH" ? <ShieldCheck className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
           </div>
           
           <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Status Kesehatan Jantung</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-tight">
                {riskLevel === "RENDAH" ? "Kondisi Terpantau Baik" : "Perlu Perhatian Medis"}
              </h2>
           </div>

           <p className="max-w-2xl mx-auto text-sm md:text-base font-medium opacity-90 leading-relaxed italic">
              &ldquo;{getInterpretation(riskLevel)}&rdquo;
           </p>
        </div>
      </Card>

      {/* Interpretation Section */}
       <div className={cn(
        "p-6 rounded-2xl mb-8 flex items-start gap-4 border",
        riskLevel === "RENDAH" ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"
      )}>
        <div className={cn(
          "w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center",
          riskLevel === "RENDAH" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
        )}>
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">Interpretasi Hasil</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {getInterpretation(riskLevel)}
          </p>
        </div>
      </div>

      {/* Data Summary Grid */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">Ringkasan Data Kesehatan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Usia", val: `${formData.age} tahun` },
            { label: "Tekanan Darah", val: `${formData.systolic_bp}/${formData.diastolic_bp} mmHg` },
            { label: "Kolesterol", val: `${formData.cholesterol} mg/dL` },
            { label: "Detak Jantung", val: `${formData.heart_rate} bpm` },
            { label: "Gaya Hidup", val: `${formData.exercise}` },
            { label: "Riwayat", val: formData.medical_history?.[0] || "Tidak Ada" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{item.label}</span>
              <span className="text-sm font-bold text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Rekomendasi untuk Anda</h3>
        <p className="text-sm text-slate-600 mb-8">Ikuti rekomendasi berikut untuk menjaga kesehatan jantung Anda secara optimal.</p>
        
        <div className="flex flex-col gap-4">
          {recommendations.map((rec, i) => (
            <Card key={i} className={cn(
              "p-6 border-l-4 transition-all hover:shadow-lg hover:-translate-y-1 group",
              rec.color === "emerald" ? "border-l-emerald-500" : 
              rec.color === "blue" ? "border-l-blue-500" : 
              rec.color === "purple" ? "border-l-purple-500" : "border-l-red-500"
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors",
                  rec.color === "emerald" ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : 
                  rec.color === "blue" ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : 
                  rec.color === "purple" ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" : 
                  "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                )}>
                  <rec.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className={cn(
                    "text-[10px] font-bold tracking-widest uppercase mb-1 block",
                    rec.color === "emerald" ? "text-emerald-600" : 
                    rec.color === "blue" ? "text-blue-600" : 
                    rec.color === "purple" ? "text-purple-600" : "text-red-600"
                  )}>
                    {rec.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2 font-display">{rec.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button size="lg" className="rounded-2xl h-14 font-bold" onClick={() => navigate('/user/konsultasi')}>
          <MessageSquare className="w-5 h-5 mr-3" /> Konsultasi AI Sekarang
        </Button>
        <Button variant="outline" size="lg" className="rounded-2xl h-14 font-bold" onClick={() => navigate('/user/riwayat')}>
          <History className="w-5 h-5 mr-3" /> Lihat Riwayat Prediksi
        </Button>
      </div>
    </div>
  );
}
