import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type HeroAction = {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

interface HeroSectionNineProps {
  title: React.ReactNode;
  description: React.ReactNode;
  eyebrow?: string;
  primaryCta?: HeroAction;
  secondaryCta?: HeroAction;
  heroImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
}

function renderAction(action: HeroAction | undefined, primary = false) {
  if (!action) {
    return null;
  }

  const content = (
    <>
      {action.icon}
      {action.text}
    </>
  );

  const className = primary
    ? "h-12 rounded-none bg-[#2D8C6E] px-8 text-white shadow-[0_18px_38px_rgba(45,140,110,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#27785f] hover:shadow-[0_22px_44px_rgba(45,140,110,0.32)]"
    : "h-12 rounded-none border border-slate-300 bg-white/88 px-8 text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-[#2D8C6E]/30 hover:bg-white hover:text-[#2D8C6E]";

  if (action.onClick) {
    return (
      <Button size="lg" variant={primary ? "primary" : "outline"} className={className} onClick={action.onClick}>
        {content}
      </Button>
    );
  }

  if (!action.href) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(action.href);

  if (isExternal) {
    return (
      <Button asChild size="lg" variant={primary ? "primary" : "outline"} className={className}>
        <a href={action.href} target="_blank" rel="noreferrer">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={primary ? "primary" : "outline"} className={className}>
      <Link to={action.href}>{content}</Link>
    </Button>
  );
}

function HeartCareMark({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2D8C6E]/14 bg-white/90 text-[#2D8C6E] shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
        <HeartPulse className="h-5 w-5" />
      </div>
      <div className="text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2D8C6E]/85">
          HeartCare
        </p>
        <p className="text-sm text-slate-500">Prediksi risiko yang lebih terarah</p>
      </div>
    </div>
  );
}

export function HeroSectionNine({
  title,
  description,
  eyebrow = "Prediksi risiko penyakit jantung",
  primaryCta,
  secondaryCta,
  heroImage,
  className,
}: HeroSectionNineProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[#d3e5dd] bg-[linear-gradient(180deg,#eef7f2_0%,#e3f1ea_34%,#f6fbf8_72%,#ffffff_100%)] text-slate-950",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-75 lg:block"
      >
        <div className="absolute left-[-10%] top-[-20%] h-[42rem] w-[26rem] -rotate-[28deg] rounded-full bg-[radial-gradient(68%_68%_at_55%_31%,rgba(45,140,110,0.22)_0%,rgba(45,140,110,0.10)_42%,rgba(255,255,255,0)_80%)]" />
        <div className="absolute left-[10%] top-[-14%] h-[36rem] w-44 -rotate-[28deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(56,189,248,0.14)_0%,rgba(56,189,248,0.06)_82%,transparent_100%)]" />
        <div className="absolute right-[-10%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-[#2D8C6E]/16 blur-[120px]" />
        <div className="absolute bottom-[-16%] left-[20%] h-[18rem] w-[18rem] rounded-full bg-emerald-100 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(212,233,223,0.72)_0%,rgba(239,247,242,0.18)_72%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-24">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <HeartCareMark className="justify-center" />

          <div className="mx-auto mt-6 inline-flex items-center gap-2 border border-[#2D8C6E]/14 bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2D8C6E]/85 shadow-[0_18px_38px_rgba(15,23,42,0.05)] backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D8C6E]" />
            {eyebrow}
          </div>

          <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto my-8 max-w-2xl text-[17px] leading-8 text-slate-600 md:text-xl">
            {description}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {renderAction(primaryCta, true)}
            {renderAction(secondaryCta, false)}
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-10 max-w-[88rem] [mask-image:linear-gradient(to_bottom,black_62%,transparent_100%)]">
        <div className="relative min-h-[24rem] lg:min-h-[34rem] xl:min-h-[40rem]">
          <div className="relative z-20 [perspective:1200px] [mask-image:linear-gradient(to_right,black_60%,transparent_100%)] -mr-10 pl-10 lg:-mr-44 lg:pl-44">
            <div className="[transform:rotateX(20deg)]">
              <div className="relative skew-x-[0.36rad]">
                
                {/* Third Card (Bottom) */}
                <div className="absolute -left-8 -top-8 z-0 h-full w-full rounded-[30px] border border-white/40 bg-white/40 p-3 shadow-[0_45px_120px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-left-10 hover:-top-10 sm:-left-12 sm:-top-12 sm:hover:-left-14 sm:hover:-top-14">
                  <img
                    src="/assets/Check.png"
                    alt="Preview check HeartCare"
                    className="relative z-[2] h-full w-full rounded-[22px] border border-[#e5efe9] bg-white/40 object-cover opacity-80"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Second Card (Middle) */}
                <div className="absolute -left-4 -top-4 z-10 h-full w-full rounded-[30px] border border-white/60 bg-white/70 p-3 shadow-[0_45px_120px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-left-5 hover:-top-5 sm:-left-6 sm:-top-6 sm:hover:-left-8 sm:hover:-top-8">
                  <img
                    src="/assets/Bot.png"
                    alt="Preview bot HeartCare"
                    className="relative z-[2] h-full w-full rounded-[22px] border border-[#e5efe9] bg-white/70 object-cover opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* First Card (Top) */}
                <div className="relative z-20 rounded-[30px] border border-white/70 bg-white p-3 shadow-[0_45px_120px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-translate-y-1 hover:translate-x-1">
                  <img
                    src={heroImage.src}
                    alt={heroImage.alt}
                    width={heroImage.width}
                    height={heroImage.height}
                    className="relative z-[2] rounded-[22px] border border-[#e5efe9] bg-white"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <HeartCareMark className={className} />
  );
}
