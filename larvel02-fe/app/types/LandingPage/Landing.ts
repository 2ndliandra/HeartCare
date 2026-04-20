// ============================================================
// LandingPage types
// Used by: LandingPage/index.tsx
// ============================================================

// Article interface diimpor langsung dari ~/types/shared
// File ini tersedia untuk tipe tambahan khusus LandingPage

export interface HeroButton {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface StepItem {
  step: number;
  title: string;
  description: string;
}
