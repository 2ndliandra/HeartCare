import { Activity, Leaf, CloudRain, ShieldCheck, ThermometerSun, Smartphone } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <section id="fitur" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                    <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Fitur Utama & Spesifikasi Teknis</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Teknologi Cerdas untuk Hasil Panen Optimal</h3>
                    <p className="text-lg text-slate-600">
                        Platform kami menyediakan panduan teknis yang komprehensif, dari pemilihan bibit hingga perlindungan tanaman.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-slate-100 group" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
                            <Activity className="w-7 h-7 text-emerald-600 group-hover:text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4">Rekomendasi Varietas Pintar</h4>
                        <p className="text-slate-600 mb-4">
                            Mekanisme analisis variabel suhu, curah hujan, dan elevasi (mdpl) menggunakan model <strong>Random Forest</strong> AI.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <ThermometerSun className="w-4 h-4 text-emerald-500 mt-0.5" />
                                <span>Analisis Suhu & Elevasi otomatis</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                                <span>Database Varietas (Victory F1, Permata F1, 51-74 ton/ha)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-slate-100 group" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-300">
                            <Smartphone className="w-7 h-7 text-rose-600 group-hover:text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4">Identifikasi Penyakit Daun</h4>
                        <p className="text-slate-600 mb-4">
                            Diagnosa patogen instan (Early/Late Blight, Virus Kuning) melalui pemindaian kamera <strong>Computer Vision</strong>.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <Leaf className="w-4 h-4 text-rose-500 mt-0.5" />
                                <span>Smart Diagnostic Instan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-rose-500 mt-0.5" />
                                <span>Protokol penanganan BioProtection Portal</span>
                            </li>
                        </ul>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-slate-100 group" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-500 transition-all duration-300">
                            <CloudRain className="w-7 h-7 text-sky-600 group-hover:text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4">Monitoring & Early Warning</h4>
                        <p className="text-slate-600 mb-4">
                            Sinkronisasi data iklim & notifikasi real-time jika lingkungan kritis memicu patogen penyakit.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <CloudRain className="w-4 h-4 text-sky-500 mt-0.5" />
                                <span>Integrasi data BMKG 2025-2026</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-sky-500 mt-0.5" />
                                <span>Peringatan dini perubahan iklim ekstrem</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
