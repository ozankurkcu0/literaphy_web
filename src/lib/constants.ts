import { services, getServiceHref } from "@/content/services";

export const SITE_NAME = "Literaphy";
export const SITE_LEGAL_NAME = "Literaphy Yazılım Teknolojileri";
export const SITE_TAGLINE = "Yazılım, otomasyon ve dijital altyapı ortağınız";
// 155-160 karakter Google meta description sınırının altında tutulmalı (bkz. quality-gates.md).
export const SITE_DESCRIPTION =
  "Literaphy; web geliştirme, özel yazılım, AI otomasyonları, WhatsApp otomasyonu, API entegrasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.";

// Gerçek alan adı belirlendiğinde tek bu satırı güncellemeniz yeterli.
export const SITE_URL = "https://literaphy.com";

// Gerçek iletişim bilgileri netleşince bu blok güncellenmeli — bkz. TODO.md.
export const CONTACT = {
  email: "iletisim@literaphy.com",
  phone: "+90 850 000 00 00",
  phoneDisplay: "0850 000 00 00",
  whatsapp: "https://wa.me/908500000000",
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
