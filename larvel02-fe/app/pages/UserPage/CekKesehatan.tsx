import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  HeartPulse, 
  User, 
  Activity as ActivityIcon, 
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
import { saveLastPrediction } from "~/lib/lastPrediction";
import { cn } from "~/lib/utils";

const normalizeSmokingForApi = (value: string) => {
  if (value === "Kadang" || value === "Sering") {
    return "yes";
  }

  return "no";
};

const normalizeExerciseForApi = (value: string) => {
  if (value === "Jarang" || !value) {
    return "no";
  }

  return "yes";
};

const normalizeAlcoholForApi = (value: string) => {
  const normalized = value.toLowerCase();
  return ["yes", "ya", "true", "1", "kadang", "sering"].includes(normalized) ? "yes" : "no";
};

const numericRules = [
  { field: "age", label: "Usia", min: 1, max: 120, unit: "tahun" },
  { field: "systolic_bp", label: "Tekanan darah sistolik", min: 70, max: 250, unit: "mmHg" },
  { field: "diastolic_bp", label: "Tekanan darah diastolik", min: 40, max: 150, unit: "mmHg" },
  { field: "cholesterol", label: "Kolesterol total", min: 80, max: 400, unit: "mg/dL" },
  { field: "blood_sugar", label: "Gula darah puasa", min: 50, max: 500, unit: "mg/dL", optional: true },
  { field: "weight", label: "Berat badan", min: 25, max: 250, unit: "kg" },
  { field: "height", label: "Tinggi badan", min: 100, max: 230, unit: "cm" }
] as const;

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
    weight: "",
    height: "",
    smoking: "",
    exercise: "",
    alcohol: ""
  });

  // Calculate completion percentage
  const totalRequiredFields = 9; // age, gender, vitals, body metrics, smoking, exercise
  const filledRequiredFields = [
    formData.age, formData.gender, formData.systolic_bp, formData.diastolic_bp, 
    formData.cholesterol, formData.weight, formData.height,
    formData.smoking, formData.exercise
  ].filter(Boolean).length;
  
  const progress = Math.round((filledRequiredFields / totalRequiredFields) * 100);
  const isFormComplete = filledRequiredFields === totalRequiredFields;

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

  const validateInputRanges = () => {
    const errors: string[] = [];

    numericRules.forEach((rule) => {
      const rawValue = formData[rule.field];

      if ("optional" in rule && rule.optional && rawValue === "") {
        return;
      }

      const value = Number(rawValue);
      if (!Number.isFinite(value) || value < rule.min || value > rule.max) {
        errors.push(`${rule.label} harus berada pada rentang ${rule.min}-${rule.max} ${rule.unit}.`);
      }
    });

    const systolic = Number(formData.systolic_bp);
    const diastolic = Number(formData.diastolic_bp);
    if (Number.isFinite(systolic) && Number.isFinite(diastolic) && systolic <= diastolic) {
      errors.push("Tekanan darah sistolik harus lebih besar dari diastolik.");
    }

    return errors;
  };

  const getPredictionErrorMessage = (err: unknown) => {
    const error = err as { response?: { data?: { message?: string; error?: string; errors?: Record<string, string[]> } } };
    const data = error.response?.data;
    const firstFieldError = data?.errors ? Object.values(data.errors).flat()[0] : null;

    return firstFieldError || data?.message || data?.error || "Gagal melakukan analisis. Silakan periksa koneksi Anda.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      alert("Lengkapi semua data wajib sebelum menjalankan analisis.");
      return;
    }

    const inputErrors = validateInputRanges();
    if (inputErrors.length > 0) {
      alert(inputErrors[0]);
      return;
    }

    setLoading(true);
    try {
      // Simulate AI Processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const payload = {
        age: Number(formData.age),
        gender: formData.gender,
        systolic_bp: Number(formData.systolic_bp),
        diastolic_bp: Number(formData.diastolic_bp),
        cholesterol: Number(formData.cholesterol),
        blood_sugar: Number(formData.blood_sugar || 90),
        weight: Number(formData.weight),
        height: Number(formData.height),
        smoking: normalizeSmokingForApi(formData.smoking),
        alcohol: normalizeAlcoholForApi(formData.alcohol),
        exercise: normalizeExerciseForApi(formData.exercise)
      };

      const res = await api.post("/predict", payload);
      
      const predictionData = { 
        prediction: res.data.prediction,
        formData: formData,
        timestamp: new Date().toISOString()
      };

      // Save to local storage for persistence
      saveLastPrediction(predictionData);
      
      navigate(`/user/hasil-prediksi`, { 
        state: predictionData
      });
    } catch (err) {
      console.error("Prediction error:", err);
      alert(getPredictionErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
                    min={1}
                    max={120}
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
                    min={70}
                    max={250}
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
                    min={40}
                    max={150}
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
                    min={80}
                    max={400}
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
                    min={50}
                    max={500}
                    placeholder="Contoh: 95"
                    iconLeft={<Droplet />}
                    suffix="mg/dL"
                    value={formData.blood_sugar}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label required>Berat Badan</Label>
                    <Input 
                      required
                      name="weight"
                      type="number"
                      min={25}
                      max={250}
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
                      min={100}
                      max={230}
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

          {/* Section 3: Gaya Hidup */}
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
                disabled={loading || !isFormComplete}
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
