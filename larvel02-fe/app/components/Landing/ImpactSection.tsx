import { TrendingUp, Zap, Target } from 'lucide-react';

export default function ImpactSection() {
    return (
        <section id="dampak" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="lg:w-1/2" data-aos="fade-right">
                        <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Dampak Strategis</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Mentransformasi Ekosistem Pertanian Jawa Timur</h3>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Teknologi kami bukan sekadar alat, namun sebuah ekosistem yang mengubah cara bertani menjadi lebih obyektif, presisi, dan modern.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Mitigasi Risiko Gagal Panen</h4>
                                    <p className="text-slate-600">Menekan angka kegagalan panen hingga 20-30% melalui keputusan yang tepat berdasarkan data AI yang obyektif dari awal masa pra-tanam hingga pascapanen.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                                        <Target className="w-5 h-5 text-rose-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Presisi Perawatan & Kepastian Ekologis</h4>
                                    <p className="text-slate-600">Mengurangi penggunaan fungisida dan pestisida yang berlebihan berkat diagnosis Computer Vision yang spesifik untuk penanganan efisien.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-sky-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Modernisasi Penuh</h4>
                                    <p className="text-slate-600">Mentransformasi cara kerja petani lokal menjadi sebuah ekosistem yang tanggap TI dan adaptif terhadap ketidakpastian iklim global.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2" data-aos="fade-left">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h4 className="text-2xl font-bold text-slate-900 mb-6">Alur Kerja Sistem (Flow Logic)</h4>

                            <div className="relative border-l-2 border-emerald-100 ml-4 space-y-8 pb-4">

                                <div className="relative pl-8">
                                    <div className="absolute -left-3 top-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
                                    <h5 className="font-bold text-slate-900 text-lg">1. Profil Lahan (Input)</h5>
                                    <p className="text-slate-600 mt-1">Daftar koordinat & deteksi elevasi / cuaca.</p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-3 top-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
                                    <h5 className="font-bold text-slate-900 text-lg">2. Analisis AI (Pra-Tanam)</h5>
                                    <p className="text-slate-600 mt-1">Algoritma Random Forest rekomendasi varietas benih.</p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-3 top-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
                                    <h5 className="font-bold text-slate-900 text-lg">3. Proteksi Aktif (Masa Tanam)</h5>
                                    <p className="text-slate-600 mt-1">Warning cuaca BMKG & pemotretan daun via Kamera CV.</p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-3 top-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
                                    <h5 className="font-bold text-slate-900 text-lg">4. Panduan Solusi (Tindakan)</h5>
                                    <p className="text-slate-600 mt-1">Langkah teknis penanganan penyakit untuk cegah wabah.</p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
