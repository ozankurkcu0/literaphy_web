import {
  BrainCircuit,
  Globe,
  MessageCircle,
  QrCode,
} from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "web-gelistirme",
    category: "web-gelistirme",
    icon: Globe,
    name: "Web Geliştirme",
    shortDescription:
      "Marka değerinizi yansıtan, hızlı ve dönüşüm odaklı kurumsal web siteleri.",
    heroLead:
      "Kurumsal kimliğinizi doğru yansıtan, arama motorlarında öne çıkan ve ziyaretçiyi doğal bir şekilde harekete geçiren web siteleri tasarlıyor ve geliştiriyoruz. Her proje, marka stratejinizle birebir uyumlu bir bilgi mimarisi üzerine kurulur.",
    scope: [
      "Kurumsal web sitesi ve landing page tasarımı & geliştirmesi",
      "Marka kimliğine uygun tasarım sistemi kurulumu",
      "İçerik yönetim sistemi (CMS) entegrasyonu",
      "SEO altyapısı ve teknik performans optimizasyonu",
      "E-ticaret vitrin sayfaları ve ödeme altyapısı entegrasyonu",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Headless CMS", "Vercel"],
    faq: [
      {
        question: "Web sitesi teslim süresi ne kadar sürer?",
        answer:
          "Kapsam ve sayfa sayısına bağlı olarak kurumsal bir web sitesi ortalama 3-6 hafta içinde tasarım ve geliştirme aşamalarını tamamlayarak yayına alınır.",
      },
      {
        question: "Mevcut sitemizi yeniden mi tasarlıyorsunuz, sıfırdan mı kuruyorsunuz?",
        answer:
          "Her iki yaklaşımı da destekliyoruz. Mevcut markanızı koruyarak yeniden tasarım (redesign) ya da sıfırdan bir kurumsal kimlikle geliştirme yapabiliriz; karar, keşif görüşmesinde birlikte netleştirilir.",
      },
      {
        question: "Site yayına alındıktan sonra destek veriyor musunuz?",
        answer:
          "Evet. Teslim sonrası içerik güncellemeleri, performans takibi ve teknik destek için aylık bakım paketleri sunuyoruz.",
      },
    ],
    relatedCoverTone: "indigo",
  },
  {
    slug: "ai-otomasyon",
    category: "ai-otomasyon",
    icon: BrainCircuit,
    name: "AI Otomasyonları",
    shortDescription:
      "Yapay zeka ile tekrar eden iş süreçlerinizi otomatikleştiriyoruz.",
    heroLead:
      "Manuel olarak yürütülen, zaman alan ve hataya açık iş süreçlerinizi yapay zeka destekli otomasyonlarla yeniden tasarlıyoruz — müşteri desteğinden veri işlemeye, raporlamadan içerik üretimine kadar geniş bir yelpazede.",
    scope: [
      "Özel AI destekli chatbot ve müşteri asistanı geliştirme",
      "İş süreci otomasyonu (belge işleme, veri girişi, raporlama)",
      "AI destekli veri analizi ve karar destek sistemleri",
      "Mevcut araçlarınıza (CRM, e-posta, tablo) AI entegrasyonu",
      "Özel büyük dil modeli (LLM) entegrasyonları ve prompt mühendisliği",
    ],
    techStack: ["OpenAI API", "LangChain", "Python", "Vector Database", "n8n", "Node.js"],
    faq: [
      {
        question: "Hangi süreçler AI otomasyonuna uygun?",
        answer:
          "Tekrar eden, kural tabanlı veya büyük hacimli veri içeren her süreç (fatura işleme, müşteri talebi sınıflandırma, rapor özetleme, e-posta yanıtlama) otomasyona uygundur. Keşif görüşmesinde sürecinizi birlikte değerlendiririz.",
      },
      {
        question: "Kendi verilerimizi paylaşmadan bir çözüm kurulabilir mi?",
        answer:
          "Evet. Veri gizliliği önceliğimizdir; kurumsal verileriniz üzerinde çalışan izole ortamlar ve gerekli veri işleme sözleşmeleriyle ilerliyoruz.",
      },
      {
        question: "Sonucu nasıl ölçüyoruz?",
        answer:
          "Her otomasyon projesinde başlangıçta net başarı metrikleri (işlem süresi azalması, hata oranı, tasarruf edilen kişi-saat) belirliyor ve teslim sonrası raporluyoruz.",
      },
    ],
    relatedCoverTone: "cyan",
  },
  {
    slug: "whatsapp-otomasyonu",
    category: "whatsapp-otomasyonu",
    icon: MessageCircle,
    name: "WhatsApp Otomasyonu",
    shortDescription:
      "WhatsApp Business API ile satış, destek ve sipariş süreçlerini otomatikleştirin.",
    heroLead:
      "WhatsApp Business API üzerinden otomatik yanıt akışları, sipariş takibi, randevu hatırlatmaları ve müşteri destek botları kuruyoruz — müşterileriniz en çok kullandıkları kanaldan, zaman kaybetmeden yanıt alır.",
    scope: [
      "WhatsApp Business API kurulumu ve onay süreci yönetimi",
      "Otomatik sipariş, randevu ve rezervasyon akışları",
      "AI destekli müşteri destek botu geliştirme",
      "Toplu bildirim ve kampanya mesajlaşma altyapısı",
      "CRM ve sipariş sistemleriyle çift yönlü entegrasyon",
    ],
    techStack: ["WhatsApp Business API", "Node.js", "Webhook", "OpenAI API", "PostgreSQL"],
    faq: [
      {
        question: "WhatsApp Business API onayını siz mi alıyorsunuz?",
        answer:
          "Evet, Meta iş hesabı doğrulaması ve WhatsApp Business API başvuru sürecinin tamamını sizin adınıza yönetiyoruz.",
      },
      {
        question: "Botun yanıtlayamadığı durumlarda ne oluyor?",
        answer:
          "Otomasyon akışı, botun yanıtlayamadığı veya müşterinin talep ettiği durumlarda konuşmayı sorunsuzca bir temsilciye devreder (human handoff).",
      },
      {
        question: "Mevcut sipariş/randevu sistemimizle entegre olur mu?",
        answer:
          "Evet, mevcut CRM, e-ticaret veya rezervasyon sisteminize API üzerinden entegre ederek WhatsApp'ı ek bir sipariş/randevu kanalına dönüştürüyoruz.",
      },
    ],
    relatedCoverTone: "emerald",
  },
  {
    slug: "qr-menu-sistemleri",
    category: "qr-menu",
    icon: QrCode,
    name: "QR Menü Sistemleri",
    shortDescription:
      "Cafe ve restoranlar için temassız, anlık güncellenebilir dijital menü sistemleri.",
    heroLead:
      "Basılı menü maliyetini ortadan kaldıran, QR kod okutulduğunda uygulama indirmeden anında açılan dijital menüler kuruyoruz. Fiyat ve ürün değişikliklerini yönetim panelinden saniyeler içinde tüm şubelerinize yayabilirsiniz.",
    scope: [
      "Temassız, uygulama gerektirmeyen QR menü deneyimi",
      "Yönetim panelinden anlık fiyat ve ürün güncelleme",
      "Çoklu dil desteği ile otomatik menü sunumu",
      "Marka kimliğine birebir uyumlu tasarım",
      "Ziyaretçi analitiği ve çoklu şube yönetimi",
    ],
    techStack: ["Next.js", "QR Kod Üretimi", "Çoklu Dil Desteği", "Yönetim Paneli"],
    faq: [
      {
        question: "Kurulum ne kadar sürer, ücreti var mı?",
        answer:
          "Kurulum ücretsizdir; menünüzü birlikte tasarlayıp 24-48 saat içinde yayına alıyoruz.",
      },
      {
        question: "Menüyü kendim güncelleyebilir miyim?",
        answer:
          "Evet, size özel yönetim panelinden ürün, fiyat ve kategori güncellemelerini teknik bilgiye gerek kalmadan kendiniz yapabilirsiniz.",
      },
      {
        question: "Birden fazla şubem var, tek panelden yönetebilir miyim?",
        answer:
          "Evet, tüm şubelerinizi tek panelden yönetip fiyat güncellemelerini tek seferde tüm şubelere anında yayabilirsiniz.",
      },
    ],
    relatedCoverTone: "amber",
    // Zaten kendi zengin landing page'i var (hero, özellikler, fiyatlandırma,
    // SSS) — burada ikinci, daha sade bir /hizmetler/qr-menu-sistemleri
    // sayfası oluşturmak yerine oraya yönlendiriyoruz.
    href: "/qr-menu-sistemleri",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Where a service's "İncele" / nav link should point: its own dedicated
 * page (e.g. QR Menü Sistemleri) if it has one, otherwise the generic
 * /hizmetler/{slug} detail page. */
export function getServiceHref(service: Service): string {
  return service.href ?? `/hizmetler/${service.slug}`;
}
