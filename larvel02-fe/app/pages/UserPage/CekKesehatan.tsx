import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  HeartPulse, 
  User, 
  Activity as ActivityIcon, 
  FileText, 
  Stethoscope, 
  Calendar, 
  Weight, 
  Ruler, 
  Droplet, 
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Loader2,
  ShieldCheck
} from "lucide-react";
import api from "../../lib/api";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input, Label, HelperText } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export default function CekKesehatanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    age: "",
    gender: "",
    systolic_bp: "",
    diastolic_bp: "",
    cholesterol: "",
    blood_sugar: "",
    heart_rate: "",
    weight: "",
    height: "",
    medical_history: [] as string[],
    symptoms: [] as string[],
    smoking: "",
    exercise: "",
    alcohol: ""
  });

  // Calculate completion percentage
  const totalRequiredFields = 9; // age, gender, systolic, diastolic, cholesterol, heart_rate, weight, height, smoking/exercise
  const filledRequiredFields = [
    formData.age, formData.gender, formData.systolic_bp, formData.diastolic_bp, 
    formData.cholesterol, formData.heart_rate, formData.weight, formData.height, 
    formData.smoking || formData.exercise
  ].filter(Boolean).length;
  
  const progress = Math.round((filledRequiredFields / totalRequiredFields) * 100);

  // BMI Calculation
  const bmi = React.useMemo(() => {
    if (formData.weight && formData.height) {
      const h = parseFloat(formData.height) / 100;
      const w = parseFloat(formData.weight);
      return (w / (h * h)).toFixed(1);
    }
    return null;
  }, [formData.weight, formData.height]);

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: "Kekurangan Berat", color: "text-blue-600" };
    if (val < 25) return { label: "Normal", color: "text-emerald-600" };
    if (val < 30) return { label: "Kelebihan Berat", color: "text-amber-600" };
    return { label: "Obesitas", color: "text-red-600" };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSelection = (field: 'medical_history' | 'symptoms', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        // If "Tidak Ada" is selected, clear everything else
        if (value.includes("Tidak Ada")) {
          return { ...prev, [field]: [value] };
        }
        // If something else is selected, remove "Tidak Ada"
        return { ...prev, [field]: [...current.filter(item => !item.includes("Tidak Ada")), value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate AI Processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await api.post("/predict", {
        ...formData,
        bmi: bmi ? parseFloat(bmi) : null
      });
      
      const predictionData = { 
        prediction: res.data.prediction,
        formData: formData,
        timestamp: new Date().toISOString()
      };

      // Save to local storage for persistence
      localStorage.setItem('last_prediction', JSON.stringify(predictionData));
      
      navigate(`/user/hasil-prediksi`, { 
        state: predictionData
      });
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Gagal melakukan analisis. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const medicalHistoryOptions = [
    "Diabetes", "Hipertensi", "Kolesterol Tinggi", 
    "Riwayat Serangan Jantung", "Riwayat Stroke", 
    "Penyakit Ginjal", "Tidak Ada Riwayat"
  ];

  // @ts-ignore
const symptomOptions = [
    "Nyeri Dada", "Sesak Napas", "Detak Jantung Tidak Teratur",
    "Mudah Lelah", "Pusing", "Pingsan", "Tidak Ada Gejala"
  ];

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
          Dashboard <ChevronRight className="w-4 h-4" /> <span className="text-slate-900">Cek Kesehatan</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">Cek Kesehatan Jantung</h1>
        <p className="text-slate-600">Lengkapi data kesehatan Anda untuk mendapatkan prediksi risiko penyakit jantung oleh AI.</p>
      </div>

      {/* Progress Indicator */}
      <Card className="mb-8 border-slate-200 shadow-sm">
        <div className="p-4 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Progres Pengisian</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-emerald-600">{progress}%</span>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          {/* Section 1: Demografis */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Data Demografis</h3>
                <p className="text-sm text-slate-500">Informasi dasar identitas Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label required>Usia</Label>
                <div className="relative">
                  <Input 
                    required
                    name="age"
                    type="number"
                    placeholder="Contoh: 35"
                    iconLeft={<Calendar />}
                    suffix="tahun"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                  <Tooltip text="Usia adalah faktor risiko utama penyakit jantung." />
                </div>
                <HelperText>Masukkan usia Anda saat ini.</HelperText>
              </div>

              <div className="space-y-2">
                <Label required>Jenis Kelamin</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-3 border-2 rounded-xl text-sm font-bold transition-all",
                      formData.gender === "male" 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-3 border-2 rounded-xl text-sm font-bold transition-all",
                      formData.gender === "female" 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    Perempuan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Vital */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <ActivityIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Data Vital</h3>
                <p className="text-sm text-slate-500">Parameter klinis kesehatan jantung Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-2">
                <Label required>Tekanan Darah Sistolik</Label>
                <div className="relative">
                  <Input 
                    required
                    name="systolic_bp"
                    type="number"
                    placeholder="Contoh: 120"
                    iconLeft={<HeartPulse />}
                    suffix="mmHg"
                    value={formData.systolic_bp}
                    onChange={handleInputChange}
                  />
                  <Tooltip text="Tekanan saat jantung berkontraksi (Normal: 90-120)." />
                </div>
              </div>

              <div className="space-y-2">
                <Label required>Tekanan Darah Diastolik</Label>
                <div className="relative">
                  <Input 
                    required
                    name="diastolic_bp"
                    type="number"
                    placeholder="Contoh: 80"
                    iconLeft={<HeartPulse />}
                    suffix="mmHg"
                    value={formData.diastolic_bp}
                    onChange={handleInputChange}
                  />
                  <Tooltip text="Tekanan saat jantung beristirahat (Normal: 60-80)." />
                </div>
              </div>

              <div className="space-y-2">
                <Label required>Kolesterol Total</Label>
                <div className="relative">
                  <Input 
                    required
                    name="cholesterol"
                    type="number"
                    placeholder="Contoh: 200"
                    iconLeft={<Droplet />}
                    suffix="mg/dL"
                    value={formData.cholesterol}
                    onChange={handleInputChange}
                  />
                  <Tooltip text="Jumlah total lemak dalam darah (Normal: < 200)." />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gula Darah Puasa (Opsional)</Label>
                <div className="relative">
                  <Input 
                    name="blood_sugar"
                    type="number"
                    placeholder="Contoh: 95"
                    iconLeft={<Droplet />}
                    suffix="mg/dL"
                    value={formData.blood_sugar}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label required>Detak Jantung</Label>
                    <Input 
                      required
                      name="heart_rate"
                      type="number"
                      placeholder="72"
                      suffix="bpm"
                      value={formData.heart_rate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label required>Berat Badan</Label>
                    <Input 
                      required
                      name="weight"
                      type="number"
                      placeholder="70"
                      iconLeft={<Weight />}
                      suffix="kg"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label required>Tinggi Badan</Label>
                    <Input 
                      required
                      name="height"
                      type="number"
                      placeholder="170"
                      iconLeft={<Ruler />}
                      suffix="cm"
                      value={formData.height}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {bmi && (
                  <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <span className="text-sm text-slate-500">Body Mass Index (BMI) Anda:</span>
                      <p className={cn("text-xl font-bold font-display", getBMICategory(parseFloat(bmi)).color)}>
                        {bmi} <span className="text-sm font-semibold opacity-80 h-5 inline-block align-middle ml-2">— {getBMICategory(parseFloat(bmi)).label}</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Riwayat Medis */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Riwayat Medis</h3>
                <p className="text-sm text-slate-500">Centang kondisi medis yang sedang atau pernah Anda alami</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {medicalHistoryOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleSelection('medical_history', opt)}
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-xl transition-all text-sm font-semibold",
                    formData.medical_history.includes(opt)
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-100 bg-white text-slate-600 hover:border-emerald-100"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                    formData.medical_history.includes(opt) ? "bg-emerald-600 border-emerald-600" : "border-slate-300"
                  )}>
                    {formData.medical_history.includes(opt) && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Gaya Hidup */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <ActivityIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Gaya Hidup</h3>
                <p className="text-sm text-slate-500">Informasi perilaku dan kebiasaan harian Anda</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label required>Kebiasaan Merokok</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {["Tidak", "Kadang", "Sering", "Sudah Berhenti"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, smoking: opt }))}
                      className={cn(
                        "px-4 py-3 border-2 rounded-xl text-xs font-bold transition-all",
                        formData.smoking === opt 
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                          : "border-slate-100 text-slate-600 hover:border-emerald-100"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label required>Aktivitas Fisik / Olahraga</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {["Jarang", "1-2x Seminggu", "3-4x Seminggu", "Setiap Hari"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, exercise: opt }))}
                      className={cn(
                        "px-4 py-3 border-2 rounded-xl text-xs font-bold transition-all",
                        formData.exercise === opt 
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                          : "border-slate-100 text-slate-600 hover:border-emerald-100"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-3 max-w-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Data kesehatan Anda akan tetap rahasia dan hanya digunakan untuk keperluan simulasi prediksi AI medis.
                </p>
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto px-12 h-14 rounded-2xl shadow-xl shadow-emerald-200/50"
                disabled={loading || progress < 70}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    AI Menganalisis...
                  </>
                ) : (
                  <>
                    Mulai Analisis AI <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

// Inline Tooltip Helper
function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute right-14 top-1/2 -translate-y-1/2 group">
      <HelpCircle className="w-4 h-4 text-slate-300 cursor-help hover:text-emerald-500 transition-colors" />
      <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none z-50">
        {text}
        <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}
