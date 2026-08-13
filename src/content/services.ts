import {
  BrainCircuit,
  Globe,
  MessageCircle,
  TerminalSquare,
  Webhook,
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
    slug: "yazilim-gelistirme",
    category: "yazilim-gelistirme",
    icon: TerminalSquare,
    name: "Yazılım Geliştirme",
    shortDescription:
      "İş süreçlerinize özel, ölçeklenebilir web uygulamaları ve iç sistemler.",
    heroLead:
      "Hazır yazılımların karşılayamadığı ihtiyaçlar için sıfırdan özel yazılım geliştiriyoruz: iç operasyon panelleri, SaaS ürünleri, mobil uyumlu web uygulamaları ve mevcut sistemlerinizle konuşan entegre çözümler.",
    scope: [
      "Özel iş uygulamaları ve operasyon panelleri geliştirme",
      "SaaS ürün geliştirme (MVP'den ölçeklenebilir mimariye)",
      "Veritabanı tasarımı ve backend mimarisi kurulumu",
      "Mevcut sistemlerle entegrasyon ve veri göçü (migration)",
      "Kod kalitesi, test ve CI/CD süreçlerinin kurulması",
    ],
    techStack: ["TypeScript", "Node.js", "PostgreSQL", "React", "Docker", "AWS"],
    faq: [
      {
        question: "Fikir aşamasında bir MVP geliştirebilir misiniz?",
        answer:
          "Evet, erken aşama girişimler için önce en kritik özellikleri barındıran bir MVP geliştirip pazara hızlı çıkmanızı sağlıyoruz, ardından ölçeklenebilir mimariye taşıyoruz.",
      },
      {
        question: "Çalışma modeliniz sabit fiyat mı, saatlik mi?",
        answer:
          "Kapsamı net projelerde sabit fiyat, gelişen/değişken kapsamlı projelerde ise zaman & malzeme (time & material) modeliyle çalışıyoruz. Hangi modelin uygun olduğuna keşif görüşmesinde karar veriyoruz.",
      },
      {
        question: "Geliştirdiğiniz yazılımın kaynak kodu bize mi ait oluyor?",
        answer:
          "Evet, proje tesliminde tüm kaynak kodu ve dokümantasyon eksiksiz şekilde size teslim edilir; kod üzerinde tam mülkiyet hakkına sahip olursunuz.",
      },
    ],
    relatedCoverTone: "violet",
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
    slug: "api-entegrasyonlari",
    category: "api-entegrasyonu",
    icon: Webhook,
    name: "API Entegrasyonları",
    shortDescription:
      "Kullandığınız araçları birbirine bağlayarak veri akışını otomatikleştiriyoruz.",
    heroLead:
      "Muhasebe, CRM, e-ticaret, kargo ve ödeme sistemleriniz arasında güvenli, hataya dayanıklı veri akışları kuruyoruz — manuel veri girişini ortadan kaldırıp sistemlerinizin birbiriyle gerçek zamanlı konuşmasını sağlıyoruz.",
    scope: [
      "Üçüncü parti API entegrasyonları (ödeme, kargo, muhasebe, CRM)",
      "Özel REST/webhook API tasarımı ve geliştirmesi",
      "Sistemler arası veri senkronizasyonu ve otomasyon",
      "Legacy sistemlerin modern API katmanıyla modernizasyonu",
      "API güvenliği, hız sınırlama ve izleme altyapısı",
    ],
    techStack: ["REST API", "GraphQL", "Node.js", "Webhook", "PostgreSQL", "Redis"],
    faq: [
      {
        question: "Hangi platformlarla entegrasyon yapabiliyorsunuz?",
        answer:
          "Yaygın kullanılan CRM (HubSpot, Salesforce), muhasebe (Logo, Paraşüt), e-ticaret (Shopify, Ticimax), kargo ve ödeme sağlayıcılarının yanı sıra özel/legacy sistemlerle de entegrasyon geliştirebiliyoruz.",
      },
      {
        question: "API'si olmayan eski bir sistemimiz varsa ne yapılabilir?",
        answer:
          "Bu tür sistemler için mevcut veritabanı veya dosya çıktıları üzerinden bir köprü (middleware) API katmanı geliştirip modern sistemlerinize bağlayabiliyoruz.",
      },
      {
        question: "Entegrasyon sonrası veri hatalarını nasıl önlüyorsunuz?",
        answer:
          "Tüm entegrasyonlarda hata yakalama, yeniden deneme (retry) mekanizmaları ve izleme/alarm altyapısı kuruyoruz; herhangi bir senkronizasyon sorununda ekibiniz anında haberdar olur.",
      },
    ],
    relatedCoverTone: "rose",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
