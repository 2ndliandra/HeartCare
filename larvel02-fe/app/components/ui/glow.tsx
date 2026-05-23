import { cn } from "~/lib/utils";

type GlowProps = {
  variant?: "above" | "center";
  className?: string;
};

export function Glow({ variant = "center", className }: GlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0",
        variant === "above" ? "-top-24" : "top-0",
        className
      )}
    >
      <div className="absolute left-1/2 top-0 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-emerald-300/28 blur-[120px] md:h-[28rem] md:w-[28rem]" />
      <div className="absolute right-[12%] top-[10%] h-[14rem] w-[14rem] rounded-full bg-sky-200/26 blur-[110px] md:h-[18rem] md:w-[18rem]" />
      <div className="absolute left-[8%] top-[16%] h-[16rem] w-[16rem] rounded-full bg-amber-200/24 blur-[110px] md:h-[20rem] md:w-[20rem]" />
    </div>
  );
}
