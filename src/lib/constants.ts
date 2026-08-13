export const SITE_NAME = "OBSoft";
export const SITE_LEGAL_NAME = "OBSoft Yazılım Teknolojileri";
export const SITE_TAGLINE = "Yazılım, otomasyon ve dijital altyapı ortağınız";
// 155-160 karakter Google meta description sınırının altında tutulmalı (bkz. quality-gates.md).
export const SITE_DESCRIPTION =
  "OBSoft; web geliştirme, özel yazılım, AI otomasyonları, WhatsApp otomasyonu, API entegrasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.";

// Gerçek alan adı belirlendiğinde tek bu satırı güncellemeniz yeterli.
export const SITE_URL = "https://obsoft.com.tr";

// Gerçek iletişim bilgileri netleşince bu blok güncellenmeli — bkz. TODO.md.
export const CONTACT = {
  email: "merhaba@obsoft.com.tr",
  phone: "+90 850 000 00 00",
  phoneDisplay: "0850 000 00 00",
  whatsapp: "https://wa.me/908500000000",
  addressLine: "Levent, İstanbul, Türkiye",
  workingHours: "Pazartesi – Cuma, 09:00 – 18:00",
};

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/obsoft" },
  { label: "Instagram", href: "https://instagram.com/obsoft" },
  { label: "X", href: "https://x.com/obsoft" },
  { label: "GitHub", href: "https://github.com/obsoft" },
];

export const NAV_LINKS = [
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "QR Menü Sistemleri", href: "/qr-menu-sistemleri" },
  { label: "Projeler", href: "/projeler" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

export const FOOTER_LINKS = {
  hizmetler: [
    { label: "Web Geliştirme", href: "/hizmetler/web-gelistirme" },
    { label: "Yazılım Geliştirme", href: "/hizmetler/yazilim-gelistirme" },
    { label: "AI Otomasyonları", href: "/hizmetler/ai-otomasyon" },
    { label: "WhatsApp Otomasyonu", href: "/hizmetler/whatsapp-otomasyonu" },
    { label: "API Entegrasyonları", href: "/hizmetler/api-entegrasyonlari" },
    { label: "QR Menü Sistemleri", href: "/qr-menu-sistemleri" },
  ],
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
