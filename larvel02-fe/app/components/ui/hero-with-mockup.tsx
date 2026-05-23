import * as React from "react";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Glow } from "~/components/ui/glow";
import { Mockup } from "~/components/ui/mockup";
import { cn } from "~/lib/utils";

type HeroAction = {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

interface HeroWithMockupProps {
  title: React.ReactNode;
  description: React.ReactNode;
  eyebrow?: string;
  badges?: string[];
  primaryCta?: HeroAction;
  secondaryCta?: HeroAction;
  mockupImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
}

function renderAction(
  action: HeroAction | undefined,
  variant: "primary" | "ghost" | "outline",
  className: string
) {
  if (!action) {
    return null;
  }

  const content = (
    <>
      {action.icon}
      {action.text}
    </>
  );

  if (action.href) {
    return (
      <Button asChild size="lg" variant={variant} className={className}>
        <a href={action.href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button size="lg" variant={variant} className={className} onClick={action.onClick}>
      {content}
    </Button>
  );
}

export function HeroWithMockup({
  title,
  description,
  eyebrow = "Prediksi risiko penyakit jantung",
  badges = ["Berbasis AI", "Akurasi tinggi", "Insight cepat"],
  primaryCta,
  secondaryCta,
  mockupImage,
  className,
}: HeroWithMockupProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[#e3eee8] bg-[linear-gradient(180deg,#f8fcfa_0%,#f3faf7_42%,#ffffff_100%)] px-4 py-16 text-slate-950 md:px-6 md:py-24 lg:px-8 lg:py-32",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Glow variant="above" className="opacity-90" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 via-white/35 to-transparent" />
        <div className="absolute left-[-8%] top-[18%] h-48 w-48 rounded-full bg-[#2D8C6E]/10 blur-[90px]" />
        <div className="absolute right-[-10%] top-[10%] h-64 w-64 rounded-full bg-[#2D8C6E]/12 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1320px]">
        <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
          <div className="flex flex-col items-center gap-6 pt-6 text-center md:gap-7 md:pt-10 lg:items-start lg:text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2D8C6E]/16 bg-white/88 text-[#2D8C6E] shadow-[0_18px_40px_rgba(45,140,110,0.12)] backdrop-blur-sm">
              <HeartPulse className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-2 border border-[#2D8C6E]/14 bg-white/88 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2D8C6E] shadow-[0_18px_38px_rgba(15,23,42,0.05)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#2D8C6E]" />
              {eyebrow}
            </div>

            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2D8C6E]/14 bg-white/92 px-3 py-2 text-xs font-medium text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#2D8C6E]" />
                  {badge}
                </span>
              ))}
            </div>

            <h1
              className={cn(
                "max-w-[12ch] bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-600 bg-clip-text text-[2.65rem] font-semibold leading-[1.03] tracking-[-0.05em] text-transparent sm:text-5xl md:text-[3.45rem] lg:text-[4rem] xl:text-[4.45rem]"
              )}
            >
              {title}
            </h1>

            <p
              className={cn(
                "max-w-[36rem] text-[16px] font-normal leading-8 text-slate-600 sm:text-[17px] md:text-[18px]"
              )}
            >
              {description}
            </p>

            <div className="relative z-10 flex flex-wrap justify-center gap-4 pt-2 lg:justify-start">
              {renderAction(
                primaryCta,
                "primary",
                "h-14 rounded-2xl bg-[#2D8C6E] px-9 text-[15px] font-semibold text-white shadow-[0_18px_38px_rgba(45,140,110,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#27785f] hover:shadow-[0_24px_44px_rgba(45,140,110,0.34)]"
              )}
              {renderAction(
                secondaryCta,
                "outline",
                "h-14 rounded-2xl border border-[#2D8C6E]/16 bg-white/88 px-8 text-[15px] font-semibold text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2D8C6E]/28 hover:bg-white hover:text-[#2D8C6E]"
              )}
            </div>

            <div className="grid w-full gap-3 pt-3 sm:grid-cols-2 xl:max-w-[40rem]">
              <div className="rounded-2xl border border-[#2D8C6E]/12 bg-white/92 px-4 py-4 text-left shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2D8C6E]/80">
                  Berbasis AI
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Prediksi awal diringkas dengan konteks yang mudah dipahami pengguna.
                </p>
              </div>
              <div className="rounded-2xl border border-[#2D8C6E]/12 bg-white/92 px-4 py-4 text-left shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2D8C6E]/80">
                  Akurasi tinggi
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Riwayat, edukasi, dan rekomendasi tetap terhubung dalam satu alur.
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full pb-4 pt-2 lg:pb-0 lg:pt-10">
            <div className="absolute inset-x-[8%] bottom-10 top-16 rounded-[34px] bg-white/84 shadow-[0_50px_110px_rgba(15,23,42,0.10)]" />
            <div className="relative mx-auto w-full max-w-[900px] lg:max-w-none">
              <div className="[perspective:1800px]">
                <div className="[transform:rotateX(13deg)_rotateY(-10deg)_rotateZ(1deg)]">
                  <Mockup className="border border-white/70 bg-white shadow-[0_45px_130px_rgba(15,23,42,0.16)]">
                    <img
                      {...mockupImage}
                      className="h-auto w-full"
                      loading="lazy"
                      decoding="async"
                    />
                  </Mockup>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-0 top-2 hidden max-w-[15rem] rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.10)] backdrop-blur-sm lg:block">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2D8C6E]/85">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trust layer
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Dashboard tampil lebih menonjol dengan konteks screening dan hasil yang lebih cepat terbaca.
              </p>
            </div>

            <div className="pointer-events-none absolute bottom-8 right-0 hidden max-w-[15rem] rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.10)] backdrop-blur-sm lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Preview mockup
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Paijos preview diposisikan lebih besar agar area dashboard tetap jelas dan tidak terpotong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
