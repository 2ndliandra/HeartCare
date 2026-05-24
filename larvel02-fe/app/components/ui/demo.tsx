import { ArrowRight, HeartPulse } from "lucide-react";

import { HeroSectionNine } from "~/components/ui/hero-section-9";

export function Demo() {
  return (
    <HeroSectionNine
      title="Pahami risiko jantung lebih dini dengan tampilan yang lebih terarah."
      description="HeartCare membantu Anda membaca potensi risiko penyakit jantung lewat AI, riwayat kesehatan, dan arahan lanjutan yang lebih mudah dipahami."
      primaryCta={{
        text: "Mulai cek kesehatan",
        href: "/register",
        icon: <HeartPulse className="mr-2 h-5 w-5" />,
      }}
      secondaryCta={{
        text: "Pelajari fitur",
        href: "/#features",
        icon: <ArrowRight className="mr-2 h-4 w-4" />,
      }}
      heroImage={{
        src: "/assets/Paijos.png",
        alt: "Tampilan mockup HeartCare",
        width: 1904,
        height: 949,
      }}
    />
  );
}
