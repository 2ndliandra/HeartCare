import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "~/components/ui/button";
import type { Article, Category } from "~/types/shared";
import { articleService } from "~/lib/articleService";

import {
  ArticlePageFrame,
  ArticleSectionDivider,
  ArticleTextureHero,
} from "./article-page-shell";

const articleCardFallbackThumbnail =
  "https://images.unsplash.com/photo-1505751172107-573225a912bb?auto=format&fit=crop&w=1200&q=80";

const ITEMS_PER_PAGE = 6;

const featuredSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
  }),
};

function stripHtml(content: string | undefined) {
  return (content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getReadingTimeLabel(article: Article) {
  return `${article.reading_time || 1} Menit Baca`;
}

function getArticleAuthor(article: Article) {
  const name = article.author?.name || "HeartCare Team";
  const initial = article.author?.initial || name.substring(0, 1).toUpperCase();

  return {
    name,
    initial,
    profilePicture: article.author?.profile_picture || "",
  };
}

export default function ArticlesPage() {
  const categoryPanelRef = useRef<HTMLDivElement | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredDirection, setFeaturedDirection] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          articleService.getArticles(),
          articleService.getCategories(),
        ]);

        setArticles(articlesRes.data as Article[]);

        const dynamicCats = (categoriesRes.data as Category[]).map((category) => category.name);
        setCategories(["Semua", ...dynamicCats]);
      } catch (err) {
        console.error("Fetch article data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const publishedArticles = useMemo(
    () => articles.filter((article) => article.status === "published"),
    [articles],
  );

  useEffect(() => {
    if (publishedArticles.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setFeaturedDirection(1);
      setFeaturedIndex((prev) => (prev + 1) % publishedArticles.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [publishedArticles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      const title = article.title?.toLowerCase() || "";
      const content = stripHtml(article.content).toLowerCase();
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch = !term || title.includes(term) || content.includes(term);
      const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, publishedArticles, searchTerm]);

  const categoryCounts = useMemo(() => {
    return publishedArticles.reduce<Record<string, number>>((counts, article) => {
      const key = article.category || "Tanpa Kategori";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }, [publishedArticles]);

  const filteredCategoryOptions = useMemo(() => {
    const term = categorySearchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      if (category === "Semua") {
        return true;
      }

      return !term || category.toLowerCase().includes(term);
    });
  }, [categories, categorySearchTerm]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const featuredArticle = useMemo(() => {
    if (publishedArticles.length === 0) {
      return null;
    }

    return publishedArticles[featuredIndex % publishedArticles.length];
  }, [featuredIndex, publishedArticles]);

  const handleFeaturedSelect = (nextIndex: number) => {
    if (nextIndex === featuredIndex) {
      return;
    }

    setFeaturedDirection(nextIndex > featuredIndex ? 1 : -1);
    setFeaturedIndex(nextIndex);
  };

  const showPreviousFeatured = () => {
    setFeaturedDirection(-1);
    setFeaturedIndex((prev) => (prev === 0 ? publishedArticles.length - 1 : prev - 1));
  };

  const showNextFeatured = () => {
    setFeaturedDirection(1);
    setFeaturedIndex((prev) => (prev + 1) % publishedArticles.length);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setIsCategoryPanelOpen(false);
  };

  useEffect(() => {
    if (!isCategoryPanelOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!categoryPanelRef.current?.contains(event.target as Node)) {
        setIsCategoryPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isCategoryPanelOpen, categoryPanelRef]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-200/40">
      <ArticlePageFrame
        id="articles"
        page="06"
        label="Wawasan Terbaru"
        footerDetail="HeartCare journal"
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="w-full">
          <ArticleTextureHero
            label="Pusat artikel"
            title="Pelajari detak jantung Anda lewat artikel yang terasa menyatu dengan pengalaman HeartCare."
            description={
              <p>
                Temukan artikel kesehatan jantung yang disusun ringkas, jelas, dan relevan agar pengguna
                lebih mudah memahami risiko, pencegahan, serta langkah perawatan yang tepat.
              </p>
            }
            titleWrapClassName="max-w-[760px] text-left"
            descriptionWrapClassName="mt-10 max-w-3xl text-left text-[14px] leading-7 text-slate-600 md:text-[15px]"
            divider={null}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              className="mt-10 max-w-3xl"
            >
              <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_28px_70px_-54px_rgba(15,23,42,0.35)]">
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3 border border-slate-200 bg-[#fcfcfa] px-4 py-3">
                    <Search size={18} className="shrink-0 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari artikel, gejala, atau topik kesehatan jantung..."
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(event) => handleSearchChange(event.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700">
                      {publishedArticles.length} artikel
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2">
                      {categories.length - 1} kategori
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </ArticleTextureHero>
        </div>

        <div className="mt-14 w-full">
          <ArticleSectionDivider />
        </div>

        <div className="mt-10 w-full">
          <div className="sticky top-0 z-40 overflow-visible border border-slate-200 bg-white/90 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div ref={(node) => { categoryPanelRef.current = node; }} className="relative flex min-w-0 flex-1 items-center gap-3">
                <div className="mr-1 flex shrink-0 items-center gap-2 pr-2 text-slate-500">
                  <Filter size={16} className="text-emerald-700" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em]">Filter</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCategoryPanelOpen((current) => !current)}
                  className="flex min-h-[44px] min-w-[260px] items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                      Kategori artikel
                    </p>
                    <p className="truncate text-sm font-medium text-slate-900">
                      {activeCategory === "Semua" ? "Semua topik" : activeCategory}
                    </p>
                  </div>
                  <ChevronsUpDown size={16} className="shrink-0 text-slate-400" />
                </button>

                {isCategoryPanelOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-3 w-full max-w-[420px] border border-slate-200 bg-white shadow-[0_22px_50px_-36px_rgba(15,23,42,0.45)]">
                    <div className="border-b border-slate-200 p-3">
                      <div className="flex items-center gap-3 border border-slate-200 bg-[#fcfcfa] px-3 py-2.5">
                        <Search size={16} className="shrink-0 text-slate-400" />
                        <input
                          type="text"
                          value={categorySearchTerm}
                          onChange={(event) => setCategorySearchTerm(event.target.value)}
                          placeholder="Cari kategori..."
                          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto p-2">
                      {filteredCategoryOptions.map((category) => {
                        const isActive = activeCategory === category;
                        const count = category === "Semua" ? publishedArticles.length : (categoryCounts[category] || 0);

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryChange(category)}
                            className={[
                              "flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition",
                              isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{category}</p>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                {count} artikel
                              </p>
                            </div>
                            {isActive ? <Check size={16} className="shrink-0" /> : null}
                          </button>
                        );
                      })}

                      {filteredCategoryOptions.length === 0 ? (
                        <div className="px-3 py-6 text-sm text-slate-400">Kategori tidak ditemukan.</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                <span className="border border-slate-200 bg-[#fcfcfa] px-3 py-2">
                  {filteredArticles.length} hasil
                </span>
                <span className="border border-slate-200 bg-white px-3 py-2">
                  {activeCategory === "Semua" ? "Semua topik" : activeCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {featuredArticle && activeCategory === "Semua" && !searchTerm ? (
          <div className="mt-14 w-full">
            <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_28px_70px_-54px_rgba(15,23,42,0.4)]">
              <AnimatePresence mode="wait" initial={false} custom={featuredDirection}>
                <motion.div
                  key={featuredArticle.id || featuredArticle._id}
                  custom={featuredDirection}
                  variants={featuredSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="grid xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] xl:items-stretch">
                    <Link
                      to={`/article/${featuredArticle.slug}`}
                      className="relative block min-h-[320px] overflow-hidden bg-[#f6f0eb] sm:min-h-[380px] lg:min-h-[440px]"
                    >
                      <img
                        src={featuredArticle.thumbnail || articleCardFallbackThumbnail}
                        alt={featuredArticle.title}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.86)_18%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.26)_50%,rgba(255,255,255,0.08)_64%,transparent_78%)]" />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_left,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.10)_18%,transparent_40%)]" />
                      <div className="absolute left-6 top-6 border border-white/60 bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                        Sorotan
                      </div>
                      <div className="absolute right-6 top-6 border border-white/60 bg-white/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 backdrop-blur-sm">
                        {featuredArticle.category}
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_38%,transparent_88%)] sm:h-32 lg:h-36" />
                    </Link>

                    <div className="border-t border-slate-200 bg-white p-6 sm:p-7 xl:border-l xl:border-t-0">
                      <span className="inline-flex rounded-full bg-[#f6f0eb] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#712b13]">
                        Artikel unggulan
                      </span>
                      <h2 className="mt-4 max-w-xl text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[2.2rem]">
                        {featuredArticle.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-[14px] leading-7 text-slate-600 sm:text-[15px]">
                        {stripHtml(featuredArticle.content).slice(0, 190)}
                        {stripHtml(featuredArticle.content).length > 190 ? "..." : ""}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#fcfcfa] px-3 py-2">
                          <Clock size={14} className="text-emerald-700" />
                          {getReadingTimeLabel(featuredArticle)}
                        </span>
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2">
                          {new Date(featuredArticle.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100 text-sm font-semibold uppercase text-slate-600">
                            {getArticleAuthor(featuredArticle).profilePicture ? (
                              <img
                                src={`http://localhost:8000/storage/${getArticleAuthor(featuredArticle).profilePicture}`}
                                alt={getArticleAuthor(featuredArticle).name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getArticleAuthor(featuredArticle).initial
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {getArticleAuthor(featuredArticle).name}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                              HeartCare insight
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/article/${featuredArticle.slug}`}
                          className="inline-flex items-center gap-2 border border-slate-200 bg-slate-950 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
                        >
                          Baca artikel
                          <ArrowRight size={16} />
                        </Link>
                      </div>

                      {publishedArticles.length > 1 ? (
                        <div className="mt-6 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {publishedArticles.map((article, index) => (
                              <button
                                key={article.id || article._id || index}
                                type="button"
                                onClick={() => handleFeaturedSelect(index)}
                                className={[
                                  "h-[3px] transition-all duration-300",
                                  index === featuredIndex ? "w-14 bg-[#712b13]" : "w-6 bg-slate-200",
                                ].join(" ")}
                                aria-label={`Pilih artikel unggulan ${index + 1}`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={showPreviousFeatured}
                              className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              aria-label="Artikel unggulan sebelumnya"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={showNextFeatured}
                              className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              aria-label="Artikel unggulan berikutnya"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        <div className="mt-14 w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-emerald-700/80">
                Arsip artikel
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-[2.35rem]">
                Temukan bacaan yang paling relevan dengan kebutuhan pengguna.
              </h2>
            </div>
            <div className="text-[12px] uppercase tracking-[0.22em] text-slate-500">
              Halaman {currentPage} dari {Math.max(totalPages, 1)}
            </div>
          </div>

          <div className="mt-6 border border-transparent p-4 sm:p-5 lg:p-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article, index) => {
                    const author = getArticleAuthor(article);
                    const excerpt = stripHtml(article.content);

                    return (
                      <motion.article
                        key={article.id || article._id}
                        layout
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-[0_22px_54px_-44px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)]"
                      >
                        <Link to={`/article/${article.slug}`} className="flex h-full flex-col">
                          <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200 bg-[#eef6ef]">
                            <img
                              src={article.thumbnail || articleCardFallbackThumbnail}
                              alt={article.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/75 via-white/20 to-transparent" />
                            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                              {article.category}
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                              <span>{new Date(article.created_at).toLocaleDateString("id-ID")}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span>{getReadingTimeLabel(article)}</span>
                            </div>

                            <h3 className="mt-4 text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950">
                              {article.title}
                            </h3>

                            <p className="mt-4 text-[14px] leading-7 text-slate-600">
                              {excerpt.slice(0, 132)}
                              {excerpt.length > 132 ? "..." : ""}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100 text-xs font-semibold uppercase text-slate-600">
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
                                  <p className="text-sm font-medium text-slate-900">{author.name}</p>
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                    HeartCare
                                  </p>
                                </div>
                              </div>

                              <div className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-[#fcfcfa] text-slate-600 transition group-hover:border-slate-300 group-hover:text-slate-950">
                                <ArrowRight size={18} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="col-span-full border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_20px_50px_-42px_rgba(15,23,42,0.28)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-[#fcfcfa] text-slate-400">
                      <Search size={28} />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      Tidak menemukan artikel
                    </h3>
                    <p className="mt-3 text-[14px] leading-7 text-slate-600">
                      Coba kata kunci lain atau ubah kategori agar hasil yang tampil lebih luas.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  className="h-11 border-slate-200 px-4"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Sebelumnya
                </Button>
                <div className="border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
                  Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  className="h-11 border-slate-200 px-4"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </ArticlePageFrame>
    </div>
  );
}
