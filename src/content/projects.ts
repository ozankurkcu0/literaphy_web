import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "vento-yapi-kurumsal-site",
    title: "Kurumsal Web Sitesi",
    client: "Vento Yapı",
    category: "web-gelistirme",
    categoryLabel: "Web Geliştirme",
    summary:
      "İnşaat sektöründe faaliyet gösteren Vento Yapı için proje portföyünü öne çıkaran, SEO odaklı yeni nesil bir kurumsal web sitesi geliştirdik.",
    problem:
      "Vento Yapı'nın mevcut web sitesi mobilde düzgün görüntülenmiyor, proje görselleri yavaş yükleniyor ve arama motorlarında marka adı dışında hiçbir sorguda görünmüyordu.",
    solution:
      "Next.js tabanlı, sayfa hızını önceliklendiren yeni bir mimari kurduk; proje galerisini filtrelenebilir hale getirdik ve teknik SEO altyapısını (yapılandırılmış veri, sitemap, görsel optimizasyonu) sıfırdan inşa ettik.",
    results: [
      { label: "Sayfa yüklenme hızı", value: "%68 artış" },
      { label: "Organik trafik (3 ay)", value: "%140 artış" },
      { label: "Teklif formu dönüşümü", value: "%35 artış" },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS"],
    coverTone: "indigo",
    image: "/projects/vento-yapi-kurumsal-site.jpg",
    imageWide: "/projects/vento-yapi-kurumsal-site-wide.jpg",
    featured: true,
  },
  {
    slug: "lupa-lojistik-operasyon-paneli",
    title: "Operasyon Yönetim Paneli",
    client: "",
    category: "yazilim-gelistirme",
    categoryLabel: "Yazılım Geliştirme",
    summary:
      "Lupa Lojistik için Excel tabanlı sevkiyat takibini ortadan kaldıran, gerçek zamanlı bir operasyon yönetim paneli geliştirdik.",
    problem:
      "Sevkiyat, araç ve sürücü verileri farklı Excel dosyalarında tutuluyor, operasyon ekibi güncel durumu takip etmekte zorlanıyor ve raporlama saatler sürüyordu.",
    solution:
      "Tüm sevkiyat verilerini tek bir merkezi panelde birleştiren, rol bazlı yetkilendirmeye sahip özel bir web uygulaması geliştirdik; canlı harita takibi ve otomatik raporlama modülü ekledik.",
    results: [
      { label: "Raporlama süresi", value: "6 saatten 10 dakikaya" },
      { label: "Veri hatası", value: "%90 azalma" },
      { label: "Operasyon ekibi verimliliği", value: "%45 artış" },
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "WebSocket"],
    coverTone: "violet",
    image: "/projects/yonetim_panel.jpg",
    imageWide: "/projects/yonetim_panel.jpg",
    featured: true,
  },
  {
    slug: "meva-finans-belge-otomasyonu",
    title: "AI Destekli Belge İşleme Otomasyonu",
    client: "",
    category: "ai-otomasyon",
    categoryLabel: "AI Otomasyonu",
    summary:
      "Meva Finans'ın fatura ve sözleşme belgelerini manuel olarak sisteme işleyen ekibi için AI destekli otomatik veri çıkarma sistemi kurduk.",
    problem:
      "Ekip, günde yüzlerce fatura ve sözleşmeyi elle inceleyip muhasebe sistemine giriyor; bu süreç hem zaman alıyor hem de veri girişi hatalarına yol açıyordu.",
    solution:
      "Gelen belgeleri otomatik sınıflandıran, kritik alanları (tutar, tarih, vergi numarası vb.) çıkaran ve doğrudan muhasebe sistemine aktaran bir AI otomasyon hattı kurduk; şüpheli durumlar otomatik olarak insan onayına yönlendiriliyor.",
    results: [
      { label: "İşlem süresi", value: "%80 azalma" },
      { label: "Veri girişi hatası", value: "%95 azalma" },
      { label: "Aylık tasarruf edilen mesai", value: "120 saat" },
    ],
    techStack: ["OpenAI API", "Python", "LangChain", "PostgreSQL"],
    coverTone: "cyan",
    image: "/projects/ai-powered-document.jpg",
    imageWide: "/projects/ai-powered-document.jpg",
    featured: true,
  },
  {
    slug: "cizgi-mobilya-whatsapp-satis",
    title: "WhatsApp Üzerinden Sipariş Otomasyonu",
    client: "",
    category: "whatsapp-otomasyonu",
    categoryLabel: "WhatsApp Otomasyonu",
    summary:
      "Çizgi Mobilya'nın Instagram ve web sitesinden gelen talepleri WhatsApp üzerinden otomatik olarak siparişe dönüştüren bir akış kurduk.",
    problem:
      "Satış ekibi, farklı kanallardan gelen ürün taleplerini tek tek WhatsApp'tan yanıtlıyor, stok ve fiyat bilgisini manuel kontrol ediyor, yoğun saatlerde yanıt süresi saatleri buluyordu.",
    solution:
      "WhatsApp Business API üzerinde ürün kataloğu, stok sorgulama ve sipariş oluşturma adımlarını otomatikleştiren bir bot kurduk; karmaşık talepler otomatik olarak satış temsilcisine devrediliyor.",
    results: [
      { label: "Ortalama yanıt süresi", value: "40 dakikadan 15 saniyeye" },
      { label: "WhatsApp üzerinden satış", value: "%60 artış" },
      { label: "Satış ekibi iş yükü", value: "%50 azalma" },
    ],
    techStack: ["WhatsApp Business API", "Node.js", "OpenAI API"],
    coverTone: "emerald",
    image: "/projects/whatsapp_siparis.jpg",
    imageWide: "/projects/whatsapp_siparis.jpg",
    featured: false,
  },
  {
    slug: "orkide-market-entegrasyon",
    title: "E-Ticaret Sitesi",
    client: "",
    category: "web-gelistirme",
    categoryLabel: "WEB Geliştirme",
    summary:
      "Orkide Market'in kendi e-ticaret sitesi ile 3 farklı pazaryeri arasındaki stok ve fiyat senkronizasyonunu otomatikleştirdik.",
    problem:
      "Stok ve fiyat güncellemeleri her pazaryerinde ayrı ayrı elle yapılıyor, senkronizasyon eksikliği yüzünden sık sık stokta olmayan ürün satışı yaşanıyordu.",
    solution:
      "Merkezi bir entegrasyon katmanı geliştirerek e-ticaret sitesi ile pazaryerleri arasında gerçek zamanlı çift yönlü stok ve fiyat senkronizasyonu kurduk; hata durumlarını anlık bildirimle izlenebilir hale getirdik.",
    results: [
      { label: "Stok tutarsızlığı", value: "%97 azalma" },
      { label: "Manuel güncelleme süresi", value: "Günde 3 saatten 0'a" },
      { label: "İptal edilen sipariş oranı", value: "%70 azalma" },
    ],
    techStack: ["REST API", "Node.js", "Redis", "Webhook"],
    coverTone: "rose",
    image: "/projects/orkide-market-entegrasyon.jpg",
    imageWide: "/projects/orkide-market-entegrasyon-wide.jpg",
    featured: false,
  },
  {
    slug: "kahve-duragi-qr-menu",
    title: "Zincir Şubeler için QR Menü Sistemi",
    client: "RAFF Coffee",
    category: "qr-menu",
    categoryLabel: "QR Menü Sistemleri",
    summary:
      "8 şubeli Kahve Durağı zinciri için basılı menü maliyetini ortadan kaldıran, merkezi yönetilebilir bir QR menü sistemi kurduk.",
    problem:
      "Fiyat güncellemesi gereken her seferinde 8 şubede basılı menüler yeniden bastırılıyor, bu hem maliyetli hem de şubeler arası fiyat tutarsızlığına yol açıyordu.",
    solution:
      "Tüm şubelerin tek panelden yönetildiği, marka kimliğine uygun tasarlanmış bir QR menü sistemi kurduk; merkez ofis fiyat güncellemesini tek seferde tüm şubelere anında yayabiliyor.",
    results: [
      { label: "Yıllık basım maliyeti", value: "%100 tasarruf" },
      { label: "Fiyat güncelleme süresi", value: "1 haftadan anlıka" },
      { label: "Müşteri menü görüntüleme süresi", value: "%25 artış" },
    ],
    techStack: ["Next.js", "QR Kod Üretimi", "Yönetim Paneli"],
    coverTone: "amber",
    image: "/projects/kahve-duragi-qr-menu.jpg",
    imageWide: "/projects/kahve-duragi-qr-menu-wide.jpg",
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getRelatedProjects(slug: string, category: string, limit = 3): Project[] {
  return projects
    .filter((project) => project.slug !== slug && project.category === category)
    .concat(projects.filter((project) => project.slug !== slug && project.category !== category))
    .slice(0, limit);
}
