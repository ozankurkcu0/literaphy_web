import type { LucideIcon } from "lucide-react";

export type ProjectCategory =
  | "web-gelistirme"
  | "yazilim-gelistirme"
  | "ai-otomasyon"
  | "whatsapp-otomasyonu"
  | "api-entegrasyonu"
  | "qr-menu";

export interface Service {
  slug: string;
  category: ProjectCategory;
  icon: LucideIcon;
  name: string;
  shortDescription: string;
  heroLead: string;
  scope: string[];
  /** Overrides ScopeList's default "Bu hizmet neleri kapsıyor?" heading for this service. */
  scopeTitle?: string;
  techStack: string[];
  faq: { question: string; answer: string }[];
  relatedCoverTone: CoverTone;
  /**
   * Set when this service already has its own dedicated landing page
   * elsewhere on the site (e.g. a product line like QR Menü Sistemleri
   * living at /qr-menu-sistemleri). When present, every place that would
   * normally link to /hizmetler/{slug} links here instead, and the generic
   * /hizmetler/[slug] detail page is skipped entirely for this service
   * (excluded from static generation, redirects here if visited directly)
   * so the two pages never compete with duplicate content.
   */
  href?: string;
}

export type CoverTone = "indigo" | "violet" | "cyan" | "amber" | "emerald" | "rose";

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  problem: string;
  solution: string;
  results: { label: string; value: string }[];
  techStack: string[];
  coverTone: CoverTone;
  /** Optional real cover screenshots (from public/projects), pre-cropped per aspect ratio. Falls back to the generated CoverArt when absent. */
  image?: string;
  /** 16:7 crop for the project detail page hero. Required alongside `image` if that hero should use a real photo. */
  imageWide?: string;
  featured: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  coverTone: CoverTone;
  /** Optional real cover image (from public/blog), 16:9 crop for cards. Falls back to the generated CoverArt when absent. */
  image?: string;
  /** 16:7 crop for the blog detail page hero. Required alongside `image` if that hero should use a real photo. */
  imageWide?: string;
  relatedHref?: { label: string; href: string };
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  tag: "kurumsal" | "qr-menu";
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "Genel" | "Hizmetler" | "QR Menü Sistemleri" | "Fiyatlandırma" | "Süreç";
}

export interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  /** "4000+" gibi açık uçlu bir fiyatsa true — fiyatın sonuna "+" eklenir,
   * yıllık toplam satırı da buna göre işaretlenir. Fiyatlar yine sayı
   * kalmalı (yıllık toplam hesaplaması fiyat * 12 yapıyor). */
  startingAt?: boolean;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Opsiyonel profil fotoğrafı (public/team/ altından). Yoksa baş harflerden
   * üretilen renkli Avatar'a düşer. */
  avatar?: string;
  /** Opsiyonel kişisel LinkedIn profili — verilirse isim/rolün altında küçük
   * bir bağlantı olarak gösterilir (bkz. TeamCard). */
  linkedin?: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
