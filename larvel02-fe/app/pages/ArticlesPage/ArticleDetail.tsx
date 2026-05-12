import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

import type { Article, CurrentUserProfile } from "~/types/shared";

export default function ArticleDetail() {
  const { slug } = useParams();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile | null>(null);

  useEffect(() => {
    const loadCurrentUser = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setCurrentUser(null);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const userName = user.name || "HeartCare Team";

        setCurrentUser({
          name: userName,
          initial: user.initial || userName.substring(0, 1).toUpperCase(),
          profile_picture: user.profile_picture || "",
        });
      } catch (error) {
        console.error("Failed to parse current user", error);
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
    window.addEventListener("storage", loadCurrentUser);
    window.addEventListener("profileUpdated", loadCurrentUser);

    return () => {
      window.removeEventListener("storage", loadCurrentUser);
      window.removeEventListener("profileUpdated", loadCurrentUser);
    };
  }, []);

  const fetchArticle = useCallback(async () => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/articles/${slug}`);
      const fetchedArticle = res.data.data as Article;
      setArticle(fetchedArticle);

      const token = localStorage.getItem('auth_token');
      if (token && fetchedArticle.id) {
        try {
          const readResponse = await api.post(`/articles/${fetchedArticle.id}/read`);
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            localStorage.setItem('user', JSON.stringify({
              ...user,
              read_article: readResponse.data?.data?.read_article ?? user.read_article ?? [],
            }));
          }
        } catch (readError) {
          console.error('Mark article as read error:', readError);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [fetchArticle]);

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

  const authorName = currentUser?.name || article.author?.name || "HeartCare Team";
  const authorInitial = currentUser?.initial || article.author?.initial || authorName.substring(0, 1).toUpperCase();
  const authorProfilePicture = currentUser?.profile_picture || article.author?.profile_picture;
  const readingTimeLabel = `${article.reading_time || 1} Menit Baca`;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-6 pt-10 md:pt-14">
        <Link to="/articles" className="inline-flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">
            <ArrowLeft size={16} /> Kembali
        </Link>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
            <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-8 border border-primary/10">
                {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tight">
                {article.title}
            </h1>

            <div className="flex items-center justify-between py-8 border-y border-slate-200 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-primary border border-slate-200 overflow-hidden">
                        {authorProfilePicture ? (
                          <img
                            src={`http://localhost:8000/storage/${authorProfilePicture}`}
                            alt={authorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-black uppercase">{authorInitial}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-wider">{authorName}</p>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" /> {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-primary" /> {readingTimeLabel}</span>
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
               className="aspect-video rounded-xl overflow-hidden border border-slate-200"
            >
                <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
            </motion.div>
          </div>
      )}

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 mb-32">
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none border border-slate-200 rounded-xl px-6 py-8 md:px-10 md:py-12 prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-strong:text-slate-900 prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </main>
    </div>
  );
}
