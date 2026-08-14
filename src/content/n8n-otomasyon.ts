import {
  BarChart3,
  Bot,
  Database,
  Megaphone,
  MessageCircle,
  Send,
  Workflow,
} from "lucide-react";

export const n8nHowItWorks = [
  {
    number: "01",
    title: "Keşif ve Analiz",
    description: "Tekrar eden, zaman alan sürecinizi birlikte inceler; otomasyona en uygun adımları belirleriz.",
  },
  {
    number: "02",
    title: "Otomasyonu Kuruyoruz",
    description: "N8N ve gerektiğinde AI modelleriyle iş akışınızı tasarlar, mevcut araçlarınıza (CRM, e-posta, WhatsApp) bağlarız.",
  },
  {
    number: "03",
    title: "Devreye Alıp İzliyoruz",
    description: "Otomasyonu canlıya alır, sonuçları birlikte izler; süreç değiştikçe akışı güncelleriz.",
  },
];

export const n8nFeatures = [
  {
    icon: Bot,
    title: "AI Destekli Müşteri Asistanı",
    description: "Müşteri sorularını anlayan, doğru yönlendiren özel chatbot ve asistan sistemleri geliştiriyoruz.",
  },
  {
    icon: Workflow,
    title: "İş Süreci Otomasyonu",
    description: "Belge işleme, veri girişi ve raporlama gibi manuel süreçleri uçtan uca otomatikleştiriyoruz.",
  },
  {
    icon: BarChart3,
    title: "Veri Analizi ve Karar Desteği",
    description: "Dağınık verilerinizi AI destekli analizlerle anlamlı, karar alınabilir raporlara dönüştürüyoruz.",
  },
  {
    icon: Database,
    title: "Mevcut Araçlarınıza Entegrasyon",
    description: "CRM, e-posta, tablo ve veri tabanlarınıza doğrudan bağlanan, elle veri taşımaya son veren akışlar kuruyoruz.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp ve Mesajlaşma Otomasyonu",
    description: "WhatsApp ve diğer mesajlaşma platformlarında otomatik, tutarlı ve hızlı yanıt sistemleri kuruyoruz.",
  },
  {
    icon: Megaphone,
    title: "Sosyal Medya İçerik Akışları",
    description: "İçerik üretiminden paylaşım takvimine kadar sosyal medya sürecinizi otomatik akışlarla yönetiyoruz.",
  },
];

/** /fiyatlandirma sayfasındaki teklif sürecini anlatan adımlar — sabit paket
 * yerine HowItWorksSteps ile aynı şekilde gösterilir. */
export const n8nPricingProcess = [
  {
    number: "01",
    title: "Ücretsiz Keşif Görüşmesi",
    description: "Sürecinizi dinler, otomasyona uygun adımları ve tahmini kapsamı birlikte belirleriz.",
  },
  {
    number: "02",
    title: "Kapsam ve Teklif",
    description: "Entegrasyon ihtiyaçlarınıza göre net kapsamlı, şeffaf bir teklif hazırlar ve sizinle paylaşırız.",
  },
  {
    number: "03",
    title: "Geliştirme ve Devreye Alma",
    description: "Onaylanan kapsamda otomasyonu geliştirir, test eder ve canlıya alırız.",
  },
];

export const n8nFaq = [
  {
    question: "Hangi süreçler otomasyona uygun?",
    answer: "Tekrar eden, kural tabanlı veya büyük hacimli veri içeren her süreç (fatura işleme, müşteri talebi sınıflandırma, rapor özetleme, e-posta yanıtlama) otomasyona uygundur. Keşif görüşmesinde sürecinizi birlikte değerlendiririz.",
  },
  {
    question: "Kendi verilerimizi paylaşmadan bir çözüm kurulabilir mi?",
    answer: "Evet. Veri gizliliği önceliğimizdir; kurumsal verileriniz üzerinde çalışan izole ortamlar ve gerekli veri işleme sözleşmeleriyle ilerliyoruz.",
  },
  {
    question: "Otomasyonlarınız her sisteme entegre edilebilir mi?",
    answer: "Evet. Oluşturduğumuz otomasyonlar, mevcut sistemlerinize entegre edilerek iş süreçlerinizi daha verimli hale getirir.",
  },
  {
    question: "Sabit paket fiyatınız yok mu?",
    answer: "Yok — her otomasyon ihtiyacı kapsam ve entegrasyon açısından farklı olduğu için sabit bir paket yerine, keşif görüşmesi sonrasında projenize özel şeffaf bir teklif hazırlıyoruz.",
  },
];

/** Demo sayfasındaki interaktif workflow görselinin senaryosu: bir WhatsApp
 * mesajının AI ile işlenip CRM'e kaydedildiği örnek akış. */
export const n8nDemoSteps = [
  {
    icon: MessageCircle,
    title: "1. Mesaj Gelir",
    description: "Müşteriden WhatsApp üzerinden yeni bir mesaj geldiğinde otomasyon tetiklenir.",
    status: "WhatsApp'tan yeni mesaj alındı",
  },
  {
    icon: Bot,
    title: "2. AI İşler",
    description: "Mesaj içeriği AI ile analiz edilir; talep sınıflandırılır ve uygun yanıt hazırlanır.",
    status: "AI mesajı analiz ediyor…",
  },
  {
    icon: Database,
    title: "3. CRM'e Kaydedilir",
    description: "Talep otomatik olarak CRM'e işlenir, müşteriye anında yanıt gönderilir.",
    status: "CRM kaydı oluşturuldu",
  },
];

export const n8nWorkflowNodes = [
  { icon: MessageCircle, x: 15, y: 24, label: "WhatsApp" },
  { icon: Bot, x: 50, y: 8, label: "AI" },
  { icon: Database, x: 85, y: 24, label: "CRM" },
  { icon: Send, x: 50, y: 42, label: "Yanıt" },
];
