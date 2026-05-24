import * as React from "react";
import { Facebook, HeartPulse, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

type FooterLink = {
  name: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type SocialLink = {
  icon: React.ReactElement;
  href: string;
  label: string;
};

interface Footer7Props {
  logo?: {
    url: string;
    alt: string;
    title: string;
    icon?: React.ReactNode;
  };
  sections?: FooterSection[];
  description?: string;
  socialLinks?: SocialLink[];
  copyright?: string;
  legalLinks?: FooterLink[];
}

const defaultSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { name: "Fitur unggulan", href: "/#features" },
      { name: "Wawasan terbaru", href: "/#articles" },
      { name: "Tentang HeartCare", href: "/#latar-belakang" },
      { name: "Semua artikel", href: "/articles" },
    ],
  },
  {
    title: "Akses",
    links: [
      { name: "Daftar", href: "/register" },
      { name: "Masuk", href: "/login" },
      { name: "Mulai screening", href: "/register" },
      { name: "Dashboard pengguna", href: "/user" },
    ],
  },
  {
    title: "Dukungan",
    links: [
      { name: "Kebijakan Privasi", href: "/privacy" },
      { name: "Syarat & Ketentuan", href: "/terms" },
      { name: "Artikel edukasi", href: "/articles" },
      { name: "Beranda", href: "/" },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks: FooterLink[] = [
  { name: "Terms and Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

function renderFooterLink(link: FooterLink, className?: string) {
  const isExternal = /^https?:\/\//i.test(link.href);

  if (isExternal) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noreferrer">
        {link.name}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {link.name}
    </Link>
  );
}

export const Footer7 = ({
  logo = {
    url: "/",
    alt: "HeartCare logo",
    title: "HeartCare",
    icon: <HeartPulse className="h-5 w-5 text-emerald-700" />,
  },
  sections = defaultSections,
  description = "Platform prediksi risiko jantung berbasis AI untuk deteksi dini, edukasi yang mudah dipahami, dan tindak lanjut yang lebih terarah.",
  socialLinks = defaultSocialLinks,
  copyright = "(c) 2026 HeartCare. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="border-t border-[#dfe8e1] bg-[#f8fbf8] px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex w-full flex-col justify-between gap-14 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full max-w-md flex-col justify-between gap-6">
            <div className="flex items-center gap-3">
              <Link
                to={logo.url}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm"
                aria-label={logo.alt}
              >
                {logo.icon}
              </Link>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {logo.title}
                </h2>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-700/70">
                  Heart health companion
                </p>
              </div>
            </div>

            <p className="max-w-[34ch] text-sm leading-7 text-slate-600">
              {description}
            </p>

            <ul className="flex items-center space-x-5 text-slate-500">
              {socialLinks.map((social) => (
                <li key={social.label} className="font-medium">
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.name}`} className="font-medium">
                      {renderFooterLink(link, "transition-colors hover:text-emerald-700")}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#dfe8e1] py-8 text-xs font-medium text-slate-500 md:flex-row md:items-center md:text-left">
          <p className="order-2 md:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
            {legalLinks.map((link) => (
              <li key={link.name} className="transition-colors hover:text-emerald-700">
                {renderFooterLink(link)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Footer7;
