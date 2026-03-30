import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
// Serving image directly from public folder
const mockupImg = '/assets/agritomat_hero_mockup.png';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-white" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-bl-[100px] -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <div data-aos="fade-right" data-aos-duration="1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            Platform Pertanian Presisi Jatim
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                            Agroinformatika Tomat Jatim
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                            Model Random Forest (RF) & Computer Vision untuk Stabilisasi Produksi di Tengah Perubahan Iklim Berbasis Mobile. Menjembatani petani tradisional dengan teknologi masa depan.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgb(6,78,59,0.3)] hover:-translate-y-1">
                                Mulai Bertani Cerdas
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <a href="#fitur" className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-semibold text-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>

                    <div className="relative lg:ml-auto" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                        <div className="relative max-w-[340px] mx-auto lg:max-w-none">
                            {/* Decorative elements behind phone */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-emerald-200 rounded-[3rem] transform rotate-3 scale-105 opacity-20 blur-lg"></div>

                            <img
                                src={mockupImg}
                                alt="AgriTomat App Interface Mockup held by Farmer"
                                className="relative z-10 w-full rounded-[2.5rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] lg:aspect-[3/4]"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
