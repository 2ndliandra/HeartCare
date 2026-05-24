import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

import type { Article } from "~/types/shared";

import api from "../../lib/api";
import {
  ArticlePageFrame,
  ArticleSectionDivider,
  ArticleTextureHero,
} from "./article-page-shell";

function getArticleAuthor(article: Article) {
  const name = article.author?.name || "HeartCare Team";
  const initial = article.author?.initial || name.substring(0, 1).toUpperCase();

  return {
    name,
    initial,
    profilePicture: article.author?.profile_picture || "",
  };
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArticle = async () => {
      if (!slug) {
        setArticle(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/articles/${slug}`);
        const fetchedArticle = response.data.data as Article;
        setArticle(fetchedArticle);

        const token = localStorage.getItem("auth_token");
        if (token && fetchedArticle.id) {
          try {
            const readResponse = await api.post(`/articles/${fetchedArticle.id}/read`);
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...user,
                  read_article: readResponse.data?.data?.read_article ?? user.read_article ?? [],
                }),
              );
            }
          } catch (readError) {
            console.error("Mark article as read error:", readError);
          }
        }
      } catch (err) {
        console.error("Fetch article detail error:", err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <ArticlePageFrame
          page="07"
          label="Detail Artikel"
          footerDetail="HeartCare journal"
          contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
        >
          <div className="w-full">
            <ArticleTextureHero
              label="Artikel tidak ditemukan"
              title="Artikel yang Anda cari belum tersedia atau sudah dipindahkan."
              description={
                <p>
                  Silakan kembali ke halaman artikel untuk menjelajahi bacaan lain yang masih aktif.
                </p>
              }
              titleWrapClassName="max-w-[720px]"
              descriptionWrapClassName="mt-8 max-w-2xl text-[14px] leading-7 text-slate-600 md:text-[15px]"
              divider={null}
            >
              <div className="mt-10">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2 border border-slate-200 bg-slate-950 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
                >
                  <ArrowLeft size={16} />
                  Kembali ke artikel
                </Link>
              </div>
            </ArticleTextureHero>
          </div>
        </ArticlePageFrame>
      </div>
    );
  }

  const author = getArticleAuthor(article);
  const readingTimeLabel = `${article.reading_time || 1} Menit Baca`;
  const publishedDate = new Date(article.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <ArticlePageFrame
        page="07"
        label="Detail Artikel"
        footerDetail={article.category || "HeartCare journal"}
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="w-full">
          <Link
            to="/articles"
            className="mb-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Kembali ke artikel
          </Link>

          <ArticleTextureHero
            label={article.category || "Artikel"}
            title={article.title}
            titleTag="h1"
            description={
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#fcfcfa] px-3 py-2">
                  <Calendar size={14} className="text-emerald-700" />
                  {publishedDate}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                  <Clock size={14} className="text-emerald-700" />
                  {readingTimeLabel}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2">
                  Oleh {author.name}
                </span>
              </div>
            }
            titleWrapClassName="max-w-[860px]"
            descriptionWrapClassName="mt-8"
            divider={null}
          />
        </div>

        <div className="mt-14 w-full">
          <ArticleSectionDivider />
        </div>

        <div className="mt-14 w-full">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] xl:items-start">
            <div className="space-y-6">
              {article.thumbnail ? (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_-46px_rgba(15,23,42,0.4)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#eef6ef]">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_38%,transparent_88%)]" />
                  </div>
                </motion.div>
              ) : null}

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
                className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_-46px_rgba(15,23,42,0.35)]"
              >
                <div className="border-b border-slate-200 bg-[#fcfcfa] px-6 py-4 sm:px-8">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Isi artikel
                  </span>
                </div>
                <div className="px-6 py-8 sm:px-8 sm:py-10">
                  <div className="prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-a:text-emerald-700 prose-img:rounded-none prose-strong:text-slate-900 prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>
                </div>
              </motion.article>
            </div>

            <div className="space-y-4 xl:sticky xl:top-8">
              <motion.aside
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
                className="overflow-hidden border border-slate-200 bg-white shadow-[0_22px_54px_-44px_rgba(15,23,42,0.35)]"
              >
                <div className="border-b border-slate-200 bg-[#fcfcfa] px-5 py-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Penulis
                  </span>
                </div>
                <div className="space-y-5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100 text-base font-semibold uppercase text-slate-600">
                      {author.profilePicture ? (
                        <img
                          src={`http://localhost:8000/storage/${author.profilePicture}`}
                          alt={author.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        author.initial
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-950">{author.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        HeartCare journal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13px] leading-6 text-slate-600">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <span>Tanggal terbit</span>
                      <span className="font-medium text-slate-900">{publishedDate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <span>Estimasi baca</span>
                      <span className="font-medium text-slate-900">{readingTimeLabel}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Kategori</span>
                      <span className="font-medium text-slate-900">{article.category}</span>
                    </div>
                  </div>
                </div>
              </motion.aside>

              <motion.aside
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
                className="overflow-hidden border border-slate-200 bg-white shadow-[0_22px_54px_-44px_rgba(15,23,42,0.3)]"
              >
                <div className="border-b border-slate-200 bg-[#fcfcfa] px-5 py-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Lanjutkan eksplorasi
                  </span>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-[14px] leading-7 text-slate-600">
                    Kembali ke arsip artikel untuk membaca topik lain yang masih berhubungan dengan
                    edukasi jantung, kebiasaan sehat, dan rekomendasi tindak lanjut.
                  </p>
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 border border-slate-200 bg-slate-950 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
                  >
                    Lihat artikel lainnya
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </ArticlePageFrame>
    </div>
  );
}
