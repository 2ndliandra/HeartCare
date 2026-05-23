import type { ReactNode } from "react";

type SectionTextureTone = "light" | "dark";

type ArticlePageFrameProps = {
  id?: string;
  page: string;
  label: string;
  backgroundClassName?: string;
  contentColumnClassName?: string;
  contentClassName?: string;
  footerDetail?: string;
  children: ReactNode;
};

export function ArticlePageFrame({
  id,
  page,
  label,
  backgroundClassName = "bg-white",
  contentColumnClassName = "",
  contentClassName = "",
  footerDetail = "HeartCare journal",
  children,
}: ArticlePageFrameProps) {
  const frameColumns =
    "grid-cols-[clamp(72px,12vw,220px)_clamp(16px,2vw,40px)_minmax(0,1fr)_clamp(16px,2vw,40px)_clamp(72px,12vw,220px)]";

  return (
    <section
      id={id}
      className={`relative overflow-hidden border-x border-b border-[#ecece7] ${backgroundClassName}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid ${frameColumns}`}
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

export function ArticleSectionDivider({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={[
        "relative left-1/2 h-px -translate-x-1/2",
        tone === "dark" ? "bg-white/15" : "bg-[#ecece7]",
        className,
      ].join(" ")}
      style={{ width: "calc(100vw - (clamp(72px, 12vw, 220px) * 2))" }}
    />
  );
}

type ArticleTextureHeroProps = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  tone?: SectionTextureTone;
  wrapperClassName?: string;
  titleWrapClassName?: string;
  descriptionWrapClassName?: string;
  titleClassName?: string;
  titleTag?: "h1" | "h2";
  divider?: ReactNode;
};

export function ArticleTextureHero({
  label,
  title,
  description,
  children,
  tone = "light",
  wrapperClassName = "",
  titleWrapClassName = "",
  descriptionWrapClassName = "",
  titleClassName = "mt-4 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-5xl xl:text-6xl",
  titleTag = "h2",
  divider,
}: ArticleTextureHeroProps) {
  const HeadingTag = titleTag;

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <div className="relative z-10 w-full">
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
          <HeadingTag className={titleClassName}>{title}</HeadingTag>
        </div>
        {description ? <div className={descriptionWrapClassName}>{description}</div> : null}
        {children}
        {divider === undefined ? <ArticleSectionDivider tone={tone} className="mt-8" /> : divider}
      </div>
    </div>
  );
}
