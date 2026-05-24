import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Droplets,
  FileText,
  Leaf,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import api from "../../lib/api";
import { Button } from "~/components/ui/button";
import { HeroSectionOne } from "~/components/blocks/hero-section-1";
import type { Article } from "~/types/shared";

type FeatureItem = {
  id: number;
  number: string;
  tag: string;
  tagStyle: React.CSSProperties;
  assetSrc: string;
  assetAlt: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  surface: string;
  progressColor: string;
  stageBg: string;
  illustration: React.ComponentType<{ className?: string }>;
};

type FocusItem = {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  surface: string;
};

const featureItems: FeatureItem[] = [
  {
    id: 0,
    number: "01",
    tag: "Prediksi",
    tagStyle: { background: "#E1F5EE", color: "#085041" },
    assetSrc: "/assets/HasilPrediksi.png",
    assetAlt: "Tampilan hasil prediksi HeartCare",
    title: "Analisis Risiko Berbasis AI",
    shortDescription: "Bantu pahami faktor risiko jantung melalui analisis data yang cepat.",
    description:
      "Masukkan data kesehatanmu dan AI akan menganalisis faktor risiko jantung secara cepat, dari tekanan darah, kolesterol, hingga gaya hidup, lalu merangkumnya dalam laporan yang mudah dipahami.",
    icon: Brain,
    accent: "text-emerald-700",
    surface: "bg-emerald-50",
    progressColor: "#0F6E56",
    stageBg: "#E1F5EE",
    illustration: IllusAnalysis,
  },
  {
    id: 1,
    number: "02",
    tag: "Chatbot",
    tagStyle: { background: "#E6F1FB", color: "#0C447C" },
    assetSrc: "/assets/Chatbot.png",
    assetAlt: "Tampilan chatbot HeartCare",
    title: "Konsultasi AI Responsif",
    shortDescription: "Tanyakan hal penting kapan pun, dijawab seketika oleh AI.",
    description:
      "Tanyakan apa pun seputar kesehatan jantung kapan saja. Chatbot AI siap memberikan jawaban berbasis data medis yang terpercaya dalam bahasa yang tetap mudah dimengerti.",
    icon: MessageSquareText,
    accent: "text-cyan-700",
    surface: "bg-cyan-50",
    progressColor: "#185FA5",
    stageBg: "#E6F1FB",
    illustration: IllusChat,
  },
  {
    id: 2,
    number: "03",
    tag: "Riwayat",
    tagStyle: { background: "#EEEDFE", color: "#3C3489" },
    assetSrc: "/assets/RiwayatPrediksi.png",
    assetAlt: "Tampilan riwayat prediksi HeartCare",
    title: "Riwayat Prediksi Tersimpan",
    shortDescription: "Pantau hasil checkup dalam satu timeline yang rapi.",
    description:
      "Semua hasil checkup dan konsultasi tersimpan otomatis dalam satu timeline. Pantau perkembangan kesehatanmu dari waktu ke waktu dan bagikan kembali ke dokter dengan lebih mudah.",
    icon: FileText,
    accent: "text-violet-700",
    surface: "bg-violet-50",
    progressColor: "#534AB7",
    stageBg: "#EEEDFE",
    illustration: IllusHistory,
  },
  {
    id: 3,
    number: "04",
    tag: "Privasi",
    tagStyle: { background: "#FAEEDA", color: "#633806" },
    assetSrc: "/assets/content3.png",
    assetAlt: "Tampilan formulir dan data kesehatan HeartCare",
    title: "Pengelolaan Data Pribadi",
    shortDescription: "Data kesehatanmu, aman dan terstruktur dalam satu tempat.",
    description:
      "Kelola dan perbarui informasi kesehatanmu, mulai dari tekanan darah, berat badan, hingga riwayat obat, dalam satu dashboard yang terstruktur dan tetap terasa aman.",
    icon: ShieldCheck,
    accent: "text-amber-700",
    surface: "bg-amber-50",
    progressColor: "#854F0B",
    stageBg: "#FAEEDA",
    illustration: IllusPrivacy,
  },
  {
    id: 4,
    number: "05",
    tag: "Edukasi",
    tagStyle: { background: "#FAECE7", color: "#712B13" },
    assetSrc: "/assets/Banner.png",
    assetAlt: "Banner edukasi kesehatan HeartCare",
    title: "Artikel Kesehatan Terpilih",
    shortDescription: "Edukasi jantung dari sumber terpercaya, kurasi tim medis.",
    description:
      "Akses artikel dan panduan kesehatan jantung yang dikurasi dengan rapi, dari tips gaya hidup hingga penjelasan kondisi medis, semuanya disusun agar mudah dipahami pengguna.",
    icon: BookOpen,
    accent: "text-rose-700",
    surface: "bg-rose-50",
    progressColor: "#993C1D",
    stageBg: "#FAECE7",
    illustration: IllusArticle,
  },
  {
    id: 5,
    number: "06",
    tag: "Personal",
    tagStyle: { background: "#EAF3DE", color: "#27500A" },
    assetSrc: "/assets/RekomendasiPersonal.png",
    assetAlt: "Tampilan rekomendasi personal HeartCare",
    title: "Rekomendasi Personal",
    shortDescription: "Saran gaya hidup sesuai kondisi dan hasil prediksimu.",
    description:
      "Dapatkan saran gaya hidup yang disesuaikan dengan kondisi dan hasil prediksi risiko jantungmu, mulai dari pola makan, olahraga, hingga momen yang tepat untuk kontrol lanjutan.",
    icon: TrendingUp,
    accent: "text-sky-700",
    surface: "bg-sky-50",
    progressColor: "#3B6D11",
    stageBg: "#EAF3DE",
    illustration: IllusRecommend,
  },
];

const FEATURE_BENTO_DURATION = 6500;

function IllusAnalysis({ className }: { className?: string }) {
  return <img src="/assets/HasilPrediksi.png" alt="Tampilan hasil prediksi HeartCare" className={className} />;
}

function IllusChat({ className }: { className?: string }) {
  return <img src="/assets/Chatbot.png" alt="Tampilan chatbot HeartCare" className={className} />;
}

function IllusHistory({ className }: { className?: string }) {
  return <img src="/assets/RiwayatPrediksi.png" alt="Tampilan riwayat prediksi HeartCare" className={className} />;
}

function IllusPrivacy({ className }: { className?: string }) {
  return <img src="/assets/content3.png" alt="Tampilan formulir dan data kesehatan HeartCare" className={className} />;
}

function IllusArticle({ className }: { className?: string }) {
  return <img src="/assets/Banner.png" alt="Banner edukasi kesehatan HeartCare" className={className} />;
}

function IllusRecommend({ className }: { className?: string }) {
  return <img src="/assets/RekomendasiPersonal.png" alt="Tampilan rekomendasi personal HeartCare" className={className} />;
}

const focusItems: FocusItem[] = [
  {
    number: "01",
    label: "Tekanan Darah",
    icon: Activity,
    accent: "text-rose-700",
    surface: "from-rose-100 via-white to-rose-50",
  },
  {
    number: "02",
    label: "Kadar Kolesterol",
    icon: Droplets,
    accent: "text-amber-700",
    surface: "from-amber-100 via-white to-yellow-50",
  },
  {
    number: "03",
    label: "Gaya Hidup",
    icon: Leaf,
    accent: "text-emerald-700",
    surface: "from-emerald-100 via-white to-lime-50",
  },
  {
    number: "04",
    label: "Deteksi Dini",
    icon: ShieldCheck,
    accent: "text-sky-700",
    surface: "from-sky-100 via-white to-cyan-50",
  },
];

const stepItems = [
  {
    step: "01",
    title: "Daftar Gratis",
    description: "Buat akun untuk menyimpan riwayat prediksi, konsultasi, dan tindak lanjut kesehatan Anda.",
  },
  {
    step: "02",
    title: "Isi Data Kesehatan",
    description: "Masukkan indikator dasar seperti tekanan darah, kolesterol, dan kebiasaan harian secara ringkas.",
  },
  {
    step: "03",
    title: "Terima Insight dan Arah Lanjut",
    description: "Lihat prediksi awal, pahami konteksnya, lalu lanjutkan ke edukasi dan rekomendasi yang relevan.",
  },
];

const HERO_FADE_SECTION_BG = "bg-white";
const HERO_FADE_SECTION_BOTTOM =
  "from-[#f4fbf7] via-[#f4fbf7]/92";
const HERO_FADE_SECTION_SIDE =
  "from-[#f4fbf7] via-[#f4fbf7]/90";

type SectionTextureTone = "light" | "dark";

type HeroSectionProps = {
  isAuthenticated: boolean;
  onCtaClick: () => void;
};

function HeroSection({ isAuthenticated, onCtaClick }: HeroSectionProps) {
  return (
    <HeroSectionOne isAuthenticated={isAuthenticated} onCtaClick={onCtaClick} />
  );
}

function FocusBandItem({ item, index }: { item: FocusItem; index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const slotTrackRef = React.useRef<HTMLDivElement>(null);
  const slotLoopRef = React.useRef<gsap.core.Timeline | null>(null);
  const Icon = item.icon;
  const revealDuration = 0.36 + index * 0.12;
  const slotDuration = 0.58 + index * 0.06;

  React.useEffect(() => {
    const track = slotTrackRef.current;
    if (!track) {
      return;
    }

    gsap.set(track, { y: 0 });

    return () => {
      slotLoopRef.current?.kill();
      slotLoopRef.current = null;
    };
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    const track = slotTrackRef.current;
    if (!track) {
      return;
    }

    slotLoopRef.current?.kill();
    gsap.killTweensOf(track);
    gsap.set(track, { y: 0 });
    slotLoopRef.current = gsap
      .timeline({ repeat: -1 })
      .to(track, {
        y: -86,
        duration: slotDuration * 0.34,
        ease: "power1.in",
      })
      .to(track, {
        y: -118,
        duration: slotDuration * 0.22,
        ease: "power2.in",
      })
      .to(track, {
        y: -108,
        duration: slotDuration * 0.28,
        ease: "power3.out",
      })
      .to({}, {
        duration: slotDuration * 0.16,
      })
      .set(track, { y: 0 });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const track = slotTrackRef.current;
    slotLoopRef.current?.kill();
    slotLoopRef.current = null;

    if (!track) {
      return;
    }

    gsap.killTweensOf(track);
    const currentY = Number(gsap.getProperty(track, "y")) || 0;
    const snapTarget = Math.abs(currentY) > 54 ? -108 : 0;
    gsap.to(track, {
      y: snapTarget,
      duration: 0.22,
      ease: "power3.out",
      overwrite: true,
      onComplete: () => {
        gsap.set(track, { y: 0 });
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: revealDuration, delay: index * 0.05, ease: "easeOut" }}
      className="group relative min-h-[108px] overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-white to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 bg-gradient-to-t from-white to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div
        className="relative h-[108px] overflow-hidden"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
      >
        <div
          ref={slotTrackRef}
          className="flex flex-col will-change-transform"
        >
          {[0, 1].map((row) => (
            <div
              key={`${item.number}-${row}`}
              className="flex h-[108px] items-center gap-4 px-6 py-5 transition-colors duration-200 group-hover:bg-[#fcfcf8] lg:px-10"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.surface} ${item.accent} ring-1 ring-black/5 transition-transform duration-200 ${isHovered ? "scale-105" : "scale-100"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  {item.number}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0.2, opacity: 0.22 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: revealDuration + 0.12, delay: index * 0.05, ease: "easeOut" }}
        className="absolute inset-x-6 bottom-0 h-px origin-left bg-slate-900/10 lg:inset-x-10"
      />
    </motion.div>
  );
}

type SectionGridFrameProps = {
  id?: string;
  page: string;
  label: string;
  backgroundClassName?: string;
  contentColumnClassName?: string;
  contentClassName?: string;
  footerDetail?: string;
  children: React.ReactNode;
};

function SectionGridFrame({
  id,
  page,
  label,
  backgroundClassName = HERO_FADE_SECTION_BG,
  contentColumnClassName = "",
  contentClassName = "",
  footerDetail = "HeartCare landing",
  children,
}: SectionGridFrameProps) {
  const frameColumns =
    "grid-cols-[clamp(72px,12vw,220px)_clamp(16px,2vw,40px)_minmax(0,1fr)_clamp(16px,2vw,40px)_clamp(72px,12vw,220px)]";

  const isFirstSection = page === "02";

  return (
    <section
      id={id}
      className={`relative overflow-hidden border-x border-b border-[#ecece7] ${backgroundClassName}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid ${frameColumns} ${isFirstSection ? '[mask-image:linear-gradient(to_bottom,transparent_0%,black_150px)]' : ''}`}
      >
        <div className="border-x border-[#ecece7]" />
        <div className="border-r border-[#ecece7]" />
        <div />
        <div className="border-l border-[#ecece7]" />
        <div className="border-x border-[#ecece7]" />
      </div>

      <div className="relative z-10">
        <div className={`grid ${frameColumns}`}>
          <div />
          <div />
          <div className={`min-w-0 ${contentColumnClassName}`}>
            <div className={`mx-auto w-full max-w-[1376px] min-w-0 ${contentClassName}`}>{children}</div>
          </div>
          <div />
          <div />
        </div>
      </div>

      <div className={`relative z-10 grid w-full border-t border-[#deebe3] text-[10px] uppercase tracking-[0.24em] ${frameColumns}`}>
        <div className="flex items-center justify-center bg-emerald-50 px-3 py-2 text-center text-emerald-700 sm:px-5 lg:px-7">
          {page}
        </div>
        <div />
        <div className="flex items-center border-x border-[#deebe3] bg-white text-slate-600">
          <div className="w-full px-4 py-2 sm:px-8 lg:px-10">{label}</div>
        </div>
        <div />
        <div className="flex items-center justify-center bg-emerald-50 px-3 py-2 text-center text-emerald-700 sm:px-5 lg:px-7">
          {footerDetail}
        </div>
      </div>
    </section>
  );
}

function SectionDivider({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div
      className={[
        "relative left-1/2 mt-8 h-px -translate-x-1/2",
        tone === "dark" ? "bg-white/15" : "bg-[#ecece7]",
      ].join(" ")}
      style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
    />
  );
}

type SectionTextureBlockProps = {
  seed: number;
  tone?: SectionTextureTone;
  textureClassName: string;
  bottomFadeClassName: string;
  sideFadeClassName: string;
  wrapperClassName?: string;
  children: React.ReactNode;
};

function SectionTextureBlock({
  wrapperClassName = "",
  children,
}: SectionTextureBlockProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

type SectionHeaderBlockProps = {
  label: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  tone?: "light" | "dark";
  wrapperClassName?: string;
  titleWrapClassName?: string;
  contentWrapClassName?: string;
  titleClassName?: string;
  divider?: React.ReactNode;
};

function SectionHeaderBlock({
  label,
  title,
  content,
  tone = "light",
  wrapperClassName = "",
  titleWrapClassName = "",
  contentWrapClassName = "",
  titleClassName = "mt-4 max-w-4xl text-[1.9rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] md:text-[2.35rem] xl:text-[2.9rem]",
  divider,
}: SectionHeaderBlockProps) {
  return (
    <div className={`relative z-10 ${wrapperClassName}`}>
      <div className={titleWrapClassName}>
        <p
          className={
            tone === "dark"
              ? "text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-100/80"
              : "text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-700/80"
          }
        >
          {label}
        </p>
        <h2 className={titleClassName}>{title}</h2>
      </div>
      {content ? <div className={contentWrapClassName}>{content}</div> : null}
      {divider === undefined ? <SectionDivider tone={tone} /> : divider}
    </div>
  );
}

function FocusBand() {
  return (
    <SectionGridFrame
      page="02"
      label="Fokus Kami"
      contentClassName="px-6 pb-20 pt-20 sm:px-8 lg:px-12 xl:px-16"
      footerDetail="02"
    >
      <div className="space-y-10">
        <SectionTextureBlock
          seed={2}
          textureClassName="-bottom-20 -left-24 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
          bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
          sideFadeClassName={HERO_FADE_SECTION_SIDE}
          wrapperClassName="pb-6"
        >
          <SectionHeaderBlock
            label="Fokus Kami"
            title="Empat titik fokus awal untuk membaca risiko dengan lebih cepat."
            titleWrapClassName="max-w-[920px]"
            titleClassName="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.95rem] 2xl:max-w-[26ch]"
            contentWrapClassName="mt-5 max-w-[60ch] text-[15px] leading-7 text-slate-600 md:text-[16px]"
            divider={null}
            content={
              <p>
                Empat area utama ini jadi titik baca awal kami untuk membantu pengguna memahami konteks risiko dengan cepat dan tetap mudah diikuti.
              </p>
            }
          />
        </SectionTextureBlock>

        <div className="w-full">
          <div
            className="relative left-1/2 -translate-x-1/2 border-t border-[#ecece7]"
            style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
          />
        </div>

        <div className="w-full p-4 sm:p-5 lg:p-10">
          <div className="grid gap-px overflow-hidden border border-[#ecece7] bg-[#ecece7] md:grid-cols-2 2xl:grid-cols-4">
            {focusItems.map((item, index) => (
              <FocusBandItem key={item.label} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </SectionGridFrame>
  );
}

type FeatureBentoMiniCardProps = {
  feature: FeatureItem;
  isActive: boolean;
  queuePosition: number;
  onClick: () => void;
  cardRef: (node: HTMLButtonElement | null) => void;
  progressRef: (node: HTMLDivElement | null) => void;
};

function FeatureBentoMiniCard({
  feature,
  isActive,
  queuePosition,
  onClick,
  cardRef,
  progressRef,
}: FeatureBentoMiniCardProps) {
  const Icon = feature.icon;

  return (
    <button
      ref={cardRef}
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={[
        "group relative flex min-h-[118px] w-full items-start gap-4 overflow-hidden rounded-[14px] border p-4 text-left transition-all duration-300",
        isActive
          ? "border-emerald-200 bg-[#fcfcf8] shadow-[0_14px_30px_-28px_rgba(15,23,42,0.34)]"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-[#fcfcf8] hover:shadow-[0_14px_30px_-30px_rgba(15,23,42,0.24)]",
      ].join(" ")}
    >
      <div className={`relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${feature.surface} ${feature.accent} ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{feature.number}</span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em]"
            style={feature.tagStyle}
          >
            {feature.tag}
          </span>
          {queuePosition === 0 ? (
            <span className="ml-auto hidden text-[9px] font-medium uppercase tracking-[0.16em] text-emerald-700 sm:inline">
              Tampil
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[14px] font-semibold leading-snug text-slate-900">{feature.title}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-500">{feature.shortDescription}</p>
      </div>
      <div
        ref={progressRef}
        className="absolute inset-x-0 bottom-0 h-[2px] w-0"
        style={{ background: feature.progressColor }}
      />
    </button>
  );
}

type FeatureBentoStageProps = {
  feature: FeatureItem;
  stageRef: React.RefObject<HTMLDivElement | null>;
  illustrationRef: React.RefObject<HTMLDivElement | null>;
  infoRef: React.RefObject<HTMLDivElement | null>;
};

function FeatureBentoStage({
  feature,
  stageRef,
  illustrationRef,
  infoRef,
}: FeatureBentoStageProps) {
  const Illustration = feature.illustration;

  return (
    <div
      ref={stageRef}
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_18px_46px_-38px_rgba(15,23,42,0.34)]"
    >
      <div
        ref={illustrationRef}
        className="relative min-h-[300px] overflow-hidden sm:min-h-[340px] lg:min-h-[380px]"
        style={{ background: feature.stageBg }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.58),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.52),transparent_36%)]" />
        <div className="absolute left-6 top-6 rounded-full bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 shadow-sm">
          {feature.number}
        </div>
        <div className="absolute right-6 top-6 rounded-full border border-white/60 bg-white/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 backdrop-blur-sm">
          {feature.tag}
        </div>
        <Illustration className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.86)_18%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.26)_50%,rgba(255,255,255,0.08)_64%,transparent_78%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_top_left,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.10)_18%,transparent_40%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_38%,transparent_88%)] sm:h-32 lg:h-36" />
      </div>
      <div ref={infoRef} className="border-t border-slate-200 bg-white p-5 sm:p-6">
        <span
          className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
          style={feature.tagStyle}
        >
          {feature.tag}
        </span>
        <h3 className="mt-4 max-w-xl text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[1.95rem]">
          {feature.title}
        </h3>
        <p className="mt-4 max-w-2xl text-[14px] leading-7 text-slate-600 sm:text-[15px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function FeatureBentoGrid({ items }: { items: FeatureItem[] }) {
  const featureById = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const [queueOrder, setQueueOrder] = React.useState(() => items.map((item) => item.id));
  const [displayedFeature, setDisplayedFeature] = React.useState(items[0]);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const illustrationRef = React.useRef<HTMLDivElement>(null);
  const infoRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const progressRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const progressTweenRef = React.useRef<gsap.core.Tween | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const isAnimatingRef = React.useRef(false);
  const queueOrderRef = React.useRef(queueOrder);

  const clearAdvanceTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetProgressBars = React.useCallback(() => {
    progressTweenRef.current?.kill();
    progressTweenRef.current = null;
    progressRefs.current.forEach((progressEl) => {
      if (progressEl) {
        gsap.set(progressEl, { width: "0%" });
      }
    });
  }, []);

  const startProgress = React.useCallback((featureId: number) => {
    const progressEl = progressRefs.current[featureId];
    if (!progressEl) {
      return;
    }

    progressTweenRef.current?.kill();
    progressTweenRef.current = gsap.fromTo(
      progressEl,
      { width: "0%" },
      {
        width: "100%",
        duration: FEATURE_BENTO_DURATION / 1000,
        ease: "none",
      },
    );
  }, []);

  const handleSelect = React.useCallback((nextFeatureId: number) => {
    const currentQueue = queueOrderRef.current;
    const currentFeatureId = currentQueue[0];

    if (isAnimatingRef.current || nextFeatureId === currentFeatureId) {
      return;
    }

    const currentCard = cardRefs.current[currentFeatureId];
    const stageEl = stageRef.current;
    const illustrationEl = illustrationRef.current;
    const infoEl = infoRef.current;
    const nextFeature = featureById.get(nextFeatureId);

    clearAdvanceTimer();
    resetProgressBars();
    isAnimatingRef.current = true;

    if (!nextFeature) {
      isAnimatingRef.current = false;
      return;
    }

    const nextQueue =
      currentQueue[1] === nextFeatureId
        ? [...currentQueue.slice(1), currentFeatureId]
        : [
          nextFeatureId,
          ...currentQueue.filter((featureId) => featureId !== nextFeatureId && featureId !== currentFeatureId),
          currentFeatureId,
        ];

    const previousRects = new Map<number, DOMRect>();
    currentQueue.forEach((featureId) => {
      const rect = cardRefs.current[featureId]?.getBoundingClientRect();
      if (rect) {
        previousRects.set(featureId, rect);
      }
    });

    const animateQueueShift = () => {
      requestAnimationFrame(() => {
        nextQueue.forEach((featureId) => {
          const cardEl = cardRefs.current[featureId];
          const previousRect = previousRects.get(featureId);
          const nextRect = cardEl?.getBoundingClientRect();

          if (!cardEl || !previousRect || !nextRect) {
            return;
          }

          const deltaX = previousRect.left - nextRect.left;
          const deltaY = previousRect.top - nextRect.top;

          if (deltaX === 0 && deltaY === 0) {
            return;
          }

          gsap.fromTo(
            cardEl,
            {
              x: deltaX,
              y: deltaY,
              zIndex: featureId === currentFeatureId ? 2 : 1,
            },
            {
              x: 0,
              y: 0,
              duration: featureId === currentFeatureId ? 0.58 : 0.48,
              ease: featureId === currentFeatureId ? "power2.out" : "power3.out",
              clearProps: "zIndex",
            },
          );
        });
      });
    };

    if (!currentCard || !stageEl || !illustrationEl || !infoEl) {
      setDisplayedFeature(nextFeature);
      setQueueOrder(nextQueue);
      queueOrderRef.current = nextQueue;
      isAnimatingRef.current = false;
      return;
    }

    gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    })
      .to(
        [illustrationEl, infoEl],
        {
          opacity: 0,
          y: -12,
          duration: 0.22,
          ease: "power1.in",
        },
        "-=0.18",
      )
      .add(() => {
        setDisplayedFeature(nextFeature);
        setQueueOrder(nextQueue);
        queueOrderRef.current = nextQueue;
        animateQueueShift();
      })
      .fromTo(
        [illustrationEl, infoEl],
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
      )
      .fromTo(
        currentCard,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
        },
        "<",
      );
  }, [clearAdvanceTimer, featureById, resetProgressBars]);

  React.useEffect(() => {
    const currentFeatureId = queueOrder[0];
    queueOrderRef.current = queueOrder;
    startProgress(currentFeatureId);
    clearAdvanceTimer();
    timerRef.current = window.setTimeout(() => {
      const nextFeatureId = queueOrderRef.current[1] ?? queueOrderRef.current[0];
      handleSelect(nextFeatureId);
    }, FEATURE_BENTO_DURATION);

    return () => {
      clearAdvanceTimer();
    };
  }, [clearAdvanceTimer, handleSelect, queueOrder, startProgress]);

  React.useEffect(() => {
    const cards = cardRefs.current.filter((card): card is HTMLButtonElement => card !== null);

    if (stageRef.current) {
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }

    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.14,
        },
      );
    }

    return () => {
      clearAdvanceTimer();
      resetProgressBars();
      progressTweenRef.current?.kill();
    };
  }, [clearAdvanceTimer, resetProgressBars]);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] xl:items-start">
      <div className="xl:sticky xl:top-8">
        <FeatureBentoStage
          feature={displayedFeature}
          stageRef={stageRef}
          illustrationRef={illustrationRef}
          infoRef={infoRef}
        />
      </div>
      <div className="grid auto-rows-[minmax(118px,auto)] gap-3 sm:grid-cols-2">
        {queueOrder.map((featureId, queuePosition) => {
          const feature = featureById.get(featureId);
          if (!feature) {
            return null;
          }

          return (
            <FeatureBentoMiniCard
              key={feature.id}
              feature={feature}
              isActive={queuePosition === 0}
              queuePosition={queuePosition}
              onClick={() => handleSelect(feature.id)}
              cardRef={(node) => {
                cardRefs.current[feature.id] = node;
              }}
              progressRef={(node) => {
                progressRefs.current[feature.id] = node;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").substring(0, 110);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("auth_token");
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<string>("Semua");

  const categories = ["Semua", "Jantung", "Pola hidup", "Gaya hidup"];
  const tagStyles: Record<string, string> = {
    Jantung: "bg-emerald-50 text-emerald-700",
    "Pola hidup": "bg-amber-50 text-amber-700",
    "Gaya hidup": "bg-blue-50 text-blue-700",
  };

  const filteredArticles = activeCategory === "Semua"
    ? articles
    : articles.filter((a) => (a.category || "Kesehatan") === activeCategory);

  React.useEffect(() => {
    let active = true;

    async function fetchLatestArticles() {
      setLoadingArticles(true);
      try {
        const res = await api.get("/articles");
        if (!active) {
          return;
        }

        const latest = res.data.data
          .filter((article: Article) => article.status === "published")
          .slice(0, 4);

        setArticles(latest);
      } catch {
        if (active) {
          setArticles([]);
        }
      } finally {
        if (active) {
          setLoadingArticles(false);
        }
      }
    }

    fetchLatestArticles();

    return () => {
      active = false;
    };
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          navigate(user.roles?.includes("admin") ? "/admin/dashboard" : "/user");
          return;
        } catch {
          navigate("/user");
          return;
        }
      }

      navigate("/user");
      return;
    }

    navigate("/register");
  };

  return (
    <div className={`${HERO_FADE_SECTION_BG} text-slate-950`}>
      <HeroSection
        isAuthenticated={isAuthenticated}
        onCtaClick={handleCtaClick}
      />
      <FocusBand />

      <SectionGridFrame
        id="latar-belakang"
        page="03"
        label="Latar Belakang"
        backgroundClassName={HERO_FADE_SECTION_BG}
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
        footerDetail="03"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:gap-12">
          <SectionTextureBlock
            seed={8}
            textureClassName="-bottom-24 -left-28 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
            bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
            sideFadeClassName={HERO_FADE_SECTION_SIDE}
            wrapperClassName="border-b border-[#ecece7] pb-8 lg:border-b-0 lg:border-r lg:pb-6 lg:pr-12"
          >
            <SectionHeaderBlock
              label="Latar belakang"
              title="Risiko jantung sering terlambat terbaca karena sinyal awal terlihat biasa."
              titleClassName="mt-4 max-w-[15ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[19ch] md:text-[2.4rem] xl:max-w-[25ch] xl:text-[2.95rem] 2xl:max-w-[27ch]"
              contentWrapClassName="mt-5 grid max-w-[60ch] gap-4 text-[15px] leading-7 text-slate-600 md:text-[16px]"
              divider={null}
              content={
                <>
                  <p>
                    Banyak orang baru memperhatikan kesehatan jantung setelah gejala terasa berat,
                    padahal tekanan darah, kolesterol, kebiasaan harian, dan riwayat kesehatan
                    dapat memberi tanda lebih awal bila dipantau secara konsisten.
                  </p>
                  <p>
                    HeartCare hadir untuk menjembatani jarak antara data kesehatan sederhana dan
                    pemahaman risiko yang mudah dibaca, sehingga pengguna bisa mengambil keputusan
                    lebih cepat sebelum kondisi berkembang lebih jauh.
                  </p>
                </>
              }
            />
          </SectionTextureBlock>

          <div className="grid gap-4 self-start">
            {[
              {
                number: "01",
                title: "Data tersebar",
                description:
                  "Riwayat pemeriksaan, catatan gaya hidup, dan hasil konsultasi sering tidak berada dalam satu alur yang mudah dibandingkan.",
              },
              {
                number: "02",
                title: "Bahasa medis terasa jauh",
                description:
                  "Angka tekanan darah atau kolesterol perlu konteks yang lebih sederhana agar pengguna tahu kapan perlu waspada.",
              },
              {
                number: "03",
                title: "Tindak lanjut tertunda",
                description:
                  "Tanpa ringkasan risiko yang jelas, pengguna lebih mudah menunda perubahan kebiasaan atau pemeriksaan lanjutan.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="grid gap-4 border border-emerald-950/10 bg-white/75 p-5 md:grid-cols-[72px_1fr]"
              >
                <p className="text-[1.45rem] font-semibold leading-none tracking-[-0.04em] text-emerald-700">
                  {item.number}
                </p>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionGridFrame>

      <SectionGridFrame
        id="about"
        page="04"
        label="Tentang"
        backgroundClassName={HERO_FADE_SECTION_BG}
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
        footerDetail="04"
      >
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-12">
          <SectionTextureBlock
            seed={3}
            textureClassName="-bottom-20 -left-24 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
            bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
            sideFadeClassName={HERO_FADE_SECTION_SIDE}
            wrapperClassName="pb-6"
          >
            <SectionHeaderBlock
              label="Tentang"
              title="Deteksi dini untuk keputusan yang lebih tenang dan tindakan yang lebih cepat."
              titleClassName="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.95rem] 2xl:max-w-[26ch]"
              contentWrapClassName="mt-5 grid max-w-[60ch] gap-4 text-[15px] leading-7 text-slate-600 md:text-[16px]"
              divider={null}
              content={
                <>
                  <p>
                    HeartCare dirancang untuk membantu pengguna memahami sinyal risiko sejak awal, sehingga keputusan kesehatan tidak perlu menunggu kondisi memburuk. Dengan kombinasi prediksi AI, riwayat pemeriksaan, dan edukasi yang relevan, pengguna mendapatkan gambaran yang lebih utuh untuk langkah berikutnya.
                  </p>
                </>
              }
            />
          </SectionTextureBlock>

          <div className="grid gap-4 self-start">
            <div className="group rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.38)] transition-all duration-300 hover:border-emerald-200 hover:bg-[#fcfcf8] hover:shadow-[0_22px_50px_-40px_rgba(15,23,42,0.42)]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">01</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                  Pendekatan
                </span>
              </div>
              <p className="mt-5 text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950 md:text-[1.7rem]">
                Screening ringkas, insight jelas, tindak lanjut lebih terarah.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.34)] transition-all duration-300 hover:border-emerald-200 hover:bg-[#fcfcf8] hover:shadow-[0_20px_44px_-38px_rgba(15,23,42,0.38)]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">02</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <p className="mt-4 text-[15px] font-semibold leading-snug text-slate-950">
                  Riwayat tersusun
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Semua hasil terkumpul dalam satu alur yang mudah ditinjau kembali.
                </p>
              </div>
              <div className="group rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.34)] transition-all duration-300 hover:border-emerald-200 hover:bg-[#fcfcf8] hover:shadow-[0_20px_44px_-38px_rgba(15,23,42,0.38)]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">03</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <p className="mt-4 text-[15px] font-semibold leading-snug text-slate-950">
                  Bahasa yang mudah dipahami
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Insight disajikan dengan konteks yang bisa langsung ditindaklanjuti.
                </p>
              </div>
            </div>
          </div>
        </div>

      </SectionGridFrame>

      <SectionGridFrame
        id="features"
        page="05"
        label="Fitur Unggulan"
        backgroundClassName={HERO_FADE_SECTION_BG}
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
        footerDetail="05"
      >
        <>
          <div className="w-full">
            <SectionTextureBlock
              seed={4}
              textureClassName="-bottom-20 -left-28 h-[25rem] w-[44rem] md:h-[30rem] md:w-[54rem] xl:h-[32rem] xl:w-[60rem]"
              bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
              sideFadeClassName={HERO_FADE_SECTION_SIDE}
            >
              <div className="max-w-[920px]">
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-700/80">
                  Fitur unggulan
                </p>
                <h2 className="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.95rem] 2xl:max-w-[26ch]">
                  Pengalaman yang selaras antara prediksi, edukasi, dan tindak lanjut.
                </h2>
              </div>
            </SectionTextureBlock>

            <div className="mt-10 w-full">
              <div className="max-w-[60ch] text-[15px] leading-7 text-slate-600 md:text-[16px]">
                <p>
                  Setiap fitur dirancang untuk saling terhubung, dari pembacaan risiko awal
                  sampai rekomendasi yang lebih personal, agar pengguna tidak hanya melihat hasil,
                  tetapi juga memahami langkah berikutnya.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full">
            <div
              className="relative left-1/2 -translate-x-1/2 border-t border-[#ecece7]"
              style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
            />
          </div>

          <div className="mt-10 w-full">
            <FeatureBentoGrid items={featureItems} />
          </div>
        </>
      </SectionGridFrame>

      <SectionGridFrame
        id="cara-kerja"
        page="06"

        label="Cara Kerja"
        contentClassName="px-6 py-20 sm:px-8 lg:px-12 xl:px-16"
        footerDetail="06"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
          <SectionTextureBlock
            seed={5}
            textureClassName="-bottom-20 -left-24 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
            bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
            sideFadeClassName={HERO_FADE_SECTION_SIDE}
            wrapperClassName="border-b border-[#ecece7] pb-8 lg:border-b-0 lg:border-r lg:pb-6 lg:pr-12"
          >
            <SectionHeaderBlock
              label="Cara kerja"
              title="Tiga langkah sederhana untuk memahami kondisi Anda."
              titleClassName="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.9rem] 2xl:max-w-[26ch]"
              contentWrapClassName="mt-5 max-w-[60ch] text-[15px] leading-7 text-slate-600 md:text-[16px]"
              divider={null}
              content={
                <p>
                  Alurnya dibuat sesingkat mungkin agar pengguna bisa bergerak dari input data ke
                  insight dan tindak lanjut tanpa terasa rumit.
                </p>
              }
            />
          </SectionTextureBlock>

          <div className="lg:pl-6">
            {stepItems.map((item) => (
              <div
                key={item.step}
                className="grid gap-4 border-b border-[#ecece7] py-7 first:pt-0 md:grid-cols-[88px_1fr]"
              >
                <p className="text-[1.65rem] font-bold leading-none tracking-[-0.04em] text-emerald-700 md:text-[1.85rem]">
                  {item.step}
                </p>
                <div>
                  <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950 md:text-[1.65rem]">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-[14px] leading-7 text-slate-600 md:text-[15px]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <div
            className="relative left-1/2 mt-8 h-px -translate-x-1/2 bg-[#ecece7]"
            style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
          />
        </div>
      </SectionGridFrame>

      <SectionGridFrame
        id="articles"
        page="07"
        label="Wawasan Terbaru"
        backgroundClassName={HERO_FADE_SECTION_BG}
        contentClassName="px-6 py-10 sm:px-8 lg:px-12 xl:px-16"
        footerDetail="07"
      >
        <div className="space-y-6">
          <SectionTextureBlock
            seed={6}
            textureClassName="-bottom-20 -left-24 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
            bottomFadeClassName={HERO_FADE_SECTION_BOTTOM}
            sideFadeClassName={HERO_FADE_SECTION_SIDE}
            wrapperClassName="pb-6"
          >
            <SectionHeaderBlock
              label="Wawasan terbaru"
              title="Wawasan terbaru untuk menjaga jantung tetap terpantau."
              titleWrapClassName="max-w-[920px]"
              titleClassName="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-slate-950 md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.95rem] 2xl:max-w-[26ch]"
              contentWrapClassName="mt-5 max-w-[60ch] text-[15px] leading-7 text-slate-600 md:text-[16px]"
              divider={null}
              content={
                <div className="space-y-6">
                  <p>
                    Artikel, panduan, dan konteks terbaru disusun untuk membantu pengguna memahami
                    isu kesehatan jantung secara lebih praktis.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${activeCategory === cat
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              }
            />
          </SectionTextureBlock>

          <div className="w-full">
            <div
              className="relative left-1/2 -translate-x-1/2 border-t border-[#ecece7]"
              style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
            />
          </div>

          <div className="w-full px-4 sm:px-5 lg:px-6">
            <div className="divide-y divide-gray-100">
              {loadingArticles ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="grid animate-pulse grid-cols-[28px_1fr_auto] gap-4 items-start py-4">
                    <div className="h-4 w-4 bg-slate-100 mt-0.5" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-100" />
                      <div className="h-4 w-3/4 bg-slate-200" />
                      <div className="h-3 w-full bg-slate-100" />
                    </div>
                    <div className="h-4 w-12 bg-slate-100 mt-0.5" />
                  </div>
                ))
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => {
                  const tag = article.category || "Kesehatan";
                  const tagStyle = tagStyles[tag] || "bg-slate-50 text-slate-700";

                  return (
                    <div key={article.id} className="grid grid-cols-[28px_1fr_auto] gap-4 items-start py-4">
                      <span className="text-xs text-gray-300 pt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${tagStyle}`}>
                            {tag}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(article.created_at)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 leading-snug mb-1">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {stripHtml(article.content)}
                        </p>
                      </div>

                      <Link
                        to={`/article/${article.slug}`}
                        className="flex items-center gap-1 text-xs text-emerald-700 hover:underline whitespace-nowrap pt-0.5"
                      >
                        Baca <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-sm text-gray-400">
                  Belum ada artikel untuk kategori ini.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <Link
                to="/articles"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
              >
                Lihat semua artikel <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-gray-400">Terus pantau kesehatan jantung Anda</span>
            </div>
          </div>
        </div>
      </SectionGridFrame>

      <SectionGridFrame
        page="08"
        label="Mulai Sekarang"
        backgroundClassName={HERO_FADE_SECTION_BG}
        contentColumnClassName="bg-[#065f46]"
        contentClassName=""
        footerDetail="08"
      >
        <div className="grid gap-8 px-6 py-8 text-white sm:px-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.95fr)] lg:px-10 lg:py-10 xl:px-14">
          <SectionTextureBlock
            seed={7}
            textureClassName="-bottom-20 -left-24 h-[24rem] w-[38rem] md:h-[28rem] md:w-[46rem] xl:h-[30rem] xl:w-[50rem]"
            bottomFadeClassName="from-[#065f46] via-[#065f46]/92"
            sideFadeClassName="from-[#065f46] via-[#065f46]/90"
            wrapperClassName="pb-6"
          >
            <SectionHeaderBlock
              label="Mulai sekarang"
              tone="dark"
              title={
                <>
                  <span className="font-serif italic text-emerald-700">Jaga </span>
                  jantung Anda dengan langkah yang lebih terarah.
                </>
              }
              titleClassName="mt-4 max-w-[14ch] text-[1.95rem] font-serif font-medium leading-[1.08] tracking-[-0.04em] text-white md:max-w-[18ch] md:text-[2.4rem] xl:max-w-[24ch] xl:text-[2.9rem] 2xl:max-w-[26ch] [&_span]:text-emerald-100"
              contentWrapClassName="mt-5 max-w-[60ch] text-[15px] leading-7 text-emerald-50/85 md:text-[16px]"
              divider={null}
              content={
                <p>
                  Mulai dari screening awal hingga tindak lanjut, HeartCare membantu Anda bergerak
                  lebih cepat dengan informasi yang lebih jelas.
                </p>
              }
            />
          </SectionTextureBlock>

          <div className="flex flex-col justify-between gap-6 border border-white/15 bg-white/10 p-6 shadow-[0_24px_54px_-42px_rgba(0,0,0,0.55)] backdrop-blur-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-100/80">Arah cepat</p>
              <p className="mt-4 text-lg leading-8 text-emerald-50/85">
                Masuk ke dashboard bila Anda sudah punya akun, atau mulai screening pertama Anda
                sekarang juga.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-none bg-white px-6 text-[#064e3b] hover:bg-white/90"
                onClick={handleCtaClick}
              >
                {isAuthenticated ? "Buka dashboard" : "Daftar sekarang"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="rounded-none border border-white/25 px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/login">Masuk</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </SectionGridFrame>
    </div>
  );
}
