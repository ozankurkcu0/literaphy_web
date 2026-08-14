import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { blogPosts } from "@/content/blog";

const staticRoutes = [
  "",
  "/hizmetler",
  "/qr-menu-sistemleri",
  "/qr-menu-sistemleri/ozellikler",
  "/qr-menu-sistemleri/fiyatlandirma",
  "/qr-menu-sistemleri/demo",
  "/n8n-otomasyonlari",
  "/n8n-otomasyonlari/ozellikler",
  "/n8n-otomasyonlari/fiyatlandirma",
  "/n8n-otomasyonlari/demo",
  "/projeler",
  "/blog",
  "/hakkimizda",
  "/sss",
  "/iletisim",
  "/gizlilik-politikasi",
  "/kullanim-sartlari",
  "/kvkk-aydinlatma-metni",
];

// Not: priority/changeFrequency kasıtlı olarak yok — Google ikisini de yok
// sayıyor (SEO denetiminde teyit edildi), dosyayı gereksiz büyütüyorlardı.
// lastModified de statik/hizmet/proje sayfalarında YOK — her build'de "şimdi"
// yazmak (eskiden `now` kullanılıyordu) gerçek bir değişiklik sinyali
// taşımıyordu; Google'ın kendi önerisi, güvenilir bir tarih yoksa alanı hiç
// göndermemek. Blog yazılarında gerçek `publishedAt` verisi olduğu için o
// korunuyor.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  // href set edilmiş hizmetler (QR Menü, N8N Otomasyonları) kendi sayfalarına
  // sahip ve /hizmetler/{slug} ziyaret edilirse oraya yönlenir — o yüzden
  // burada listelenmiyorlar, aksi halde sitemap'te hemen yönlendiren,
  // "gerçek olmayan" bir URL yayınlanmış olurdu.
  const serviceEntries: MetadataRoute.Sitemap = services
    .filter((service) => !service.href)
    .map((service) => ({
      url: `${SITE_URL}/hizmetler/${service.slug}`,
    }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projeler/${project.slug}`,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  return [...staticEntries, ...serviceEntries, ...projectEntries, ...blogEntries];
}
