import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Filter,
  Heart as HeartIcon,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";

import type { Article } from "~/types/shared";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published');
  }, [articles]);

  // Auto-change featured article timer
  useEffect(() => {
    if (publishedArticles.length <= 1) return;

    const timer = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % publishedArticles.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [publishedArticles]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        api.get('/articles'),
        api.get('/categories')
      ]);
      
      setArticles(articlesRes.data.data);
      
      const dynamicCats = categoriesRes.data.data.map((c: any) => c.name);
      setCategories(["Semua", ...dynamicCats]);
    } catch (err) {
      console.error('Fetch health data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = article.title?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = title.includes(term) || content.includes(term);
      const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;
      const isPublished = article.status === 'published';
      
      return matchesSearch && matchesCategory && isPublished;
    });
  }, [searchTerm, activeCategory, articles]);

  const featuredArticle = useMemo(() => {
    if (publishedArticles.length === 0) return null;
    return publishedArticles[featuredIndex % publishedArticles.length];
  }, [publishedArticles, featuredIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/10">
      {/* Search & Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8"
            >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pusat Informasi Kesehatan Jantung</span>
            </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[0.95] text-slate-900"
          >
            Pelajari <span className="text-primary italic">Detak</span> <br />Jantung Anda.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl group-focus-within:bg-primary/10 transition-all"></div>
            <div className="relative flex items-center bg-white border border-slate-200 p-2 rounded-2xl shadow-xl shadow-slate-200/50">
                <div className="p-4 text-slate-400">
                    <Search size={24} />
                </div>
                <input 
                    type="text" 
                    placeholder="Cari artikel, gejala, atau tips kesehatan..."
                    className="flex-1 bg-transparent py-4 outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="hidden md:block px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all">Cari</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 py-6">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-4 pr-4 border-r border-slate-100 shrink-0">
                    <Filter size={18} className="text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Filter</span>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeCategory === cat 
                            ? "bg-slate-900 text-white shadow-lg" 
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Featured Card Carousel */}
        <div className="relative mb-20">
            <AnimatePresence mode="wait">
                {featuredArticle && activeCategory === "Semua" && !searchTerm && (
                    <motion.div 
                        key={featuredArticle.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <Link to={`/article/${featuredArticle.slug}`} className="group relative block rounded-[2rem] overflow-hidden bg-slate-100 aspect-[21/9]">
                            <img 
                                src={featuredArticle.thumbnail || "https://images.unsplash.com/photo-1505751172107-160a0f9b5c2a?auto=format&fit=crop&q=80"} 
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                                alt="Featured"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Highlight Terbaru</span>
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">{featuredArticle.category}</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight group-hover:text-primary transition-colors">
                                    {featuredArticle.title}
                                </h2>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 font-bold uppercase transition-transform group-hover:scale-110">
                                            {featuredArticle.author?.name?.substring(0,1) || "A"}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-wide">{featuredArticle.author?.name || "Medical Team"}</p>
                                            <p className="text-white/50 text-[10px] uppercase font-black">{new Date(featuredArticle.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {publishedArticles.map((_, i) => (
                                            <button 
                                                key={i} 
                                                onClick={(e) => { e.preventDefault(); setFeaturedIndex(i); }}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === featuredIndex ? 'bg-primary w-6' : 'bg-white/30'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                    <motion.article 
                        key={article.id || article._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex flex-col"
                    >
                    <Link to={`/article/${article.slug}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-8 bg-slate-50 border border-slate-100">
                            {article.thumbnail ? (
                                <img 
                                    src={article.thumbnail} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-3xl" 
                                    alt={article.title}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <HeartIcon size={64} strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-[10px] font-black uppercase text-slate-900 rounded-xl shadow-lg border border-slate-100">{article.category}</span>
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">
                                <span className="flex items-center gap-1"><Clock size={12}/> {new Date(article.created_at).toLocaleDateString()}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                <span>5 Menit Baca</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-3 leading-tight group-hover:text-primary transition-colors">
                                {article.title}
                            </h3>
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                                        {article.author?.name?.substring(0,1) || "H"}
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{article.author?.name || "Medical Team"}</span>
                                </div>
                                <div className="p-2 bg-slate-50 group-hover:bg-primary group-hover:text-white rounded-lg transition-all">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    </Link>
                    </motion.article>
                ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Tidak Menemukan Artikel</h3>
                    <p className="text-slate-500 text-sm">Coba kata kunci lain atau ubah filter kategori Anda.</p>
                </div>
            )}
          </AnimatePresence>
        </div>

        {/* Newsletter / CTA */}
        {!searchTerm && (
            <section className="mt-32 p-10 md:p-20 bg-slate-900 rounded-[2rem] relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-primary/20 blur-[100px]"></div>
                <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8">
                            <Zap className="h-4 w-4 text-primary" fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Update Mingguan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-none">Wawasan Kesehatan <br /><span className="text-primary italic">di Inbox Anda.</span></h2>
                        <p className="text-slate-400 text-lg">Bergabunglah dengan ribuan orang lainnya untuk mendapatkan tips jantung sehat dari kardiolog terkemuka.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="email" 
                            placeholder="Alamat email Anda..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary transition-all"
                        />
                        <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">Langganan</button>
                    </div>
                </div>
            </section>
        )}
      </main>
    </div>
  );
}
