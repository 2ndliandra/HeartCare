type GridTextureProps = {
  variant: "light" | "dark" | "dot";
  intensity?: "subtle" | "medium" | "visible";
  className?: string;
  gridSize?: number;
  fadeEdges?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  backgroundColor?: string;
};

const intensityMap = {
  subtle: {
    light: "rgba(14,122,94,0.04)",
    dark: "rgba(255,255,255,0.04)",
    dot: "rgba(14,122,94,0.08)",
  },
  medium: {
    light: "rgba(14,122,94,0.07)",
    dark: "rgba(255,255,255,0.05)",
    dot: "rgba(14,122,94,0.09)",
  },
  visible: {
    light: "rgba(14,122,94,0.08)",
    dark: "rgba(255,255,255,0.06)",
    dot: "rgba(14,122,94,0.1)",
  },
} as const;

export default function GridTexture({
  variant,
  intensity = "subtle",
  className = "",
  gridSize = 48,
  fadeEdges,
  backgroundColor,
}: GridTextureProps) {
  const lineColor = intensityMap[intensity][variant];
  const bg = backgroundColor ?? (variant === "dark" ? "#064e3b" : variant === "dot" ? "#ffffff" : "#fafaf8");
  const topFade = fadeEdges?.top ?? 0;
  const bottomFade = fadeEdges?.bottom ?? 0;
  const leftFade = fadeEdges?.left ?? 0;
  const rightFade = fadeEdges?.right ?? 0;

  const fades = [
    leftFade ? `linear-gradient(to right, ${bg} 0%, transparent ${leftFade}%)` : null,
    rightFade ? `linear-gradient(to left, ${bg} 0%, transparent ${rightFade}%)` : null,
    topFade ? `linear-gradient(to bottom, ${bg} 0%, transparent ${topFade}%)` : null,
    bottomFade ? `linear-gradient(to top, ${bg} 0%, transparent ${bottomFade}%)` : null,
  ].filter(Boolean);

  if (variant === "dot") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${className}`}
        style={{
          backgroundImage: [
            ...fades,
            `radial-gradient(ellipse 80% 80% at center, transparent 30%, ${bg} 85%)`,
            `radial-gradient(circle, ${lineColor} 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: [...fades.map(() => "100% 100%"), "100% 100%", "28px 28px"].join(","),
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: [
          ...fades,
          `repeating-linear-gradient(${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent ${gridSize}px)`,
          `repeating-linear-gradient(90deg, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent ${gridSize}px)`,
        ].join(","),
        backgroundSize: [...fades.map(() => "100% 100%")].join(","),
      }}
    />
  );
}
