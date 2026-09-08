import { services, getServiceHref } from "@/content/services";

export const SITE_NAME = "Literaphy";
export const SITE_LEGAL_NAME = "Literaphy Yazılım Teknolojileri";
export const SITE_TAGLINE = "Yazılım, otomasyon ve dijital altyapı ortağınız";
// 155-160 karakter Google meta description sınırının altında tutulmalı (bkz. quality-gates.md).
export const SITE_DESCRIPTION =
  "Literaphy; web geliştirme, özel yazılım, AI otomasyonları, WhatsApp otomasyonu, API entegrasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.";

// literaphy.com artık canlı ve www'ye 308 yönleniyor (bkz. Vercel Domains) —
// SEO denetiminde tespit edildi: canonical/OG/JSON-LD/sitemap hâlâ eski geçici
// literaphy-web.vercel.app değerini kullanıyordu (NEXT_PUBLIC_SITE_URL prod'da
// hiç set edilmemiş), bu da gerçek domain'in indexlenmesini engelliyordu.
// ÖNEMLİ: Vercel > Project Settings > Environment Variables'a
// NEXT_PUBLIC_SITE_URL=https://www.literaphy.com eklenip yeniden deploy
// edilmeli — env değişkeni burada verilen fallback'i geçersiz kılar.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.literaphy.com";

export const CONTACT = {
  email: "literaphy@gmail.com",
  phone: "+90 542 461 96 30",
  phoneDisplay: "0542 461 96 30",
  whatsapp: "https://wa.me/905424619630",
  addressLine: "Kartepe, Kocaeli, Türkiye",
  workingHours: "Pazartesi – Cumartesi, 09:00 – 20:00",
};

// SEO denetiminde tespit edildi: bu placeholder handle'lar gerçek Literaphy
// hesapları değildi — instagram.com/literaphy ve x.com/literaphy tamamen
// alakasız üçüncü şahıslara ait, github.com/literaphy 404 veriyordu. Footer'da
// ve Organization JSON-LD sameAs'ta yayınlanan bu linkler ziyaretçileri yanlış
// kişilere yönlendiriyor ve arama motorlarına yanlış varlık eşleşmesi
// bildiriyordu. Gerçek hesaplar açılınca (ya da mevcut hesapların doğru
// adresleri netleşince) buraya eklenmeli — bkz. TODO.md.
export const SOCIAL_LINKS: { label: string; href: string }[] = [];

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
