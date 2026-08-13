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
  techStack: string[];
  faq: { question: string; answer: string }[];
  relatedCoverTone: CoverTone;
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
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
