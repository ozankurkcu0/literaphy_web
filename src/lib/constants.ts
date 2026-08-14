import { services, getServiceHref } from "@/content/services";

export const SITE_NAME = "Literaphy";
export const SITE_LEGAL_NAME = "Literaphy Yazılım Teknolojileri";
export const SITE_TAGLINE = "Yazılım, otomasyon ve dijital altyapı ortağınız";
// 155-160 karakter Google meta description sınırının altında tutulmalı (bkz. quality-gates.md).
export const SITE_DESCRIPTION =
  "Literaphy; web geliştirme, özel yazılım, AI otomasyonları, WhatsApp otomasyonu, API entegrasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.";

// Gerçek alan adı (literaphy.com) alınıp DNS/Vercel'e bağlanana kadar GEÇİCİ
// olarak canlı Vercel adresini kullanıyoruz — SEO denetiminde tespit edildi:
// literaphy.com hiç DNS'e sahip değilken canonical/OG/JSON-LD/sitemap onu
// gösteriyordu, bu da sitenin hiç indexlenememesine yol açıyordu. Domain
// gelince NEXT_PUBLIC_SITE_URL env değişkenini set edin (öncelikli) ya da
// bu satırı geri değiştirin — bkz. TODO.md.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://literaphy-web.vercel.app";

export const CONTACT = {
  email: "literaphy@gmail.com",
  phone: "+90 542 461 96 30",
  phoneDisplay: "0542 461 96 30",
  whatsapp: "https://wa.me/905424619630",
  addressLine: "Kartepe, Kocaeli, Türkiye",
  workingHours: "Pazartesi – Cumartesi, 09:00 – 20:00",
};

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/literaphy" },
  { label: "Instagram", href: "https://instagram.com/literaphy" },
  { label: "X", href: "https://x.com/literaphy" },
  { label: "GitHub", href: "https://github.com/literaphy" },
];

export const NAV_LINKS = [
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "N8N Otomasyonları", href: "/n8n-otomasyonlari" },
  { label: "Projeler", href: "/projeler" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

export const FOOTER_LINKS = {
  // src/content/services.ts'den türetilir — elle kopyalanmış bir liste değil,
  // bir hizmet eklenip/silindiğinde burası otomatik güncel kalır.
  hizmetler: services.map((service) => ({
    label: service.name,
    href: getServiceHref(service),
  })),
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Projeler", href: "/projeler" },
    { label: "Blog", href: "/blog" },
    { label: "Sıkça Sorulan Sorular", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
  ],
  legal: [
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
    { label: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni" },
  ],
};
