import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  MessageCircle, 
  Bookmark,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

import type { Article } from "~/types/shared";


export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/articles/${slug}`);
      setArticle(res.data.data);
      
      // Fetch related (random articles for now)
      const relatedRes = await api.get('/articles');
      setRelated(relatedRes.data.data.filter((a: any) => a.slug !== slug).slice(0, 3));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Artikel Tidak Ditemukan</h2>
        <Link to="/articles" className="text-primary font-bold flex items-center gap-2 hover:underline">
            <ArrowLeft size={18} /> Kembali ke Artikel
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/articles" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft size={16} /> Kembali
            </Link>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-primary transition-all"><Share2 size={20}/></button>
                <button className="p-2 text-slate-400 hover:text-primary transition-all"><Bookmark size={20}/></button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
            <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-8 border border-primary/10">
                {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tight">
                {article.title}
            </h1>

            <div className="flex items-center justify-between py-8 border-y border-slate-50 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary border border-slate-200 shadow-sm">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-wider">{article.author?.name || 'HeartPredict Team'}</p>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" /> {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-primary" /> 6 Menit Baca</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="reader" /></div>)}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+1.2k Pembaca</p>
                </div>
            </div>
        </motion.div>
      </header>

      {/* Featured Image */}
      {article.thumbnail && (
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10"
            >
                <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
            </motion.div>
          </div>
      )}

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 mb-32">
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-[2rem] prose-strong:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Tags / Interactions */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2">
                {['Kesehatan', 'Jantung', 'Lifestyle'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 cursor-pointer transition-all">#{tag}</span>
                ))}
            </div>
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold">
                    <MessageCircle size={20} /> <span className="text-xs uppercase tracking-widest">24 Komentar</span>
                </button>
            </div>
        </div>
      </main>

      {/* Related Articles */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">Rekomendasi</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mungkin Anda Suka.</h2>
                </div>
                <Link to="/articles" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all flex items-center gap-2 mb-2">Lihat Semua <ChevronRight size={16} /></Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {related.map((item) => (
                    <Link key={item.id} to={`/article/${(item as any).slug}`} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                        <div className="h-48 rounded-[1.5rem] overflow-hidden mb-6 relative">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm shadow-sm text-[10px] font-black uppercase text-primary rounded-lg">{item.category}</span>
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <h4 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-xl">
                <Heart className="w-7 h-7 text-primary" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">HeartPredict</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center mt-2">© 2026 HeartPredict. Dedicated to your heart's future.</p>
        </div>
      </footer>
    </div>
  );
}
