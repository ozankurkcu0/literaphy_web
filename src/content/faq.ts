import type { FaqItem } from "@/types";

export const faqItems: FaqItem[] = [
  {
    category: "Genel",
    question: "Literaphy hangi hizmetleri sunuyor?",
    answer:
      "Web geliştirme, özel yazılım geliştirme, AI otomasyonları, WhatsApp Business otomasyonu, API entegrasyonları ve QR menü sistemleri sunuyoruz. Detaylar için Hizmetler sayfamızı inceleyebilirsiniz.",
  },
  {
    category: "Genel",
    question: "Hangi sektörlerle çalışıyorsunuz?",
    answer:
      "İnşaat, lojistik, finans, perakende, mobilya ve gıda/hizmet sektörleri başta olmak üzere farklı ölçeklerdeki işletmelerle çalışıyoruz. Sektöre özgü sürecinizi keşif görüşmesinde birlikte değerlendiriyoruz.",
  },
  {
    category: "Genel",
    question: "Proje süreci nasıl işliyor?",
    answer:
      "Her proje Keşif, Tasarım, Geliştirme ve Teslim aşamalarından oluşur. Süreç boyunca düzenli ilerleme paylaşımları alır, her aşamada geri bildirim verebilirsiniz.",
  },
  {
    category: "Hizmetler",
    question: "Sadece belirli bir hizmete mi ihtiyacım olduğuna nasıl karar veririm?",
    answer:
      "Emin değilseniz sorun değil — iletişim formundan bize ulaştığınızda, ihtiyacınızı anlamak için önce kısa bir keşif görüşmesi yapıyor, en uygun hizmet(ler)i birlikte netleştiriyoruz.",
  },
  {
    category: "Hizmetler",
    question: "Birden fazla hizmeti aynı anda alabilir miyim?",
    answer:
      "Evet, örneğin bir web sitesi geliştirirken aynı anda WhatsApp otomasyonu veya API entegrasyonu da kurabiliriz. Çoğu müşterimiz birden fazla hizmeti birlikte tercih ediyor.",
  },
  {
    category: "Hizmetler",
    question: "Geliştirme sonrası teknik destek sağlıyor musunuz?",
    answer:
      "Evet, tüm projelerde teslim sonrası destek ve isteğe bağlı aylık bakım paketleri sunuyoruz.",
  },
  {
    category: "QR Menü Sistemleri",
    question: "QR menü sistemi kurulumu ne kadar sürer?",
    answer:
      "Menü içeriğiniz hazır olduğunda kurulum 24-48 saat içinde tamamlanır ve menünüz yayına alınır.",
  },
  {
    category: "QR Menü Sistemleri",
    question: "Menümü kendim güncelleyebilir miyim?",
    answer:
      "Evet, size özel yönetim panelinden teknik bilgiye gerek kalmadan ürün, fiyat ve kategori güncellemesi yapabilirsiniz.",
  },
  {
    category: "QR Menü Sistemleri",
    question: "Birden fazla şubem var, tek panelden yönetebilir miyim?",
    answer:
      "Evet, Standart ve Premium paketlerde tüm şubelerinizi tek bir merkezi panelden yönetebilir, fiyat güncellemelerini tüm şubelere anında yayabilirsiniz.",
  },
  {
    category: "Fiyatlandırma",
    question: "Proje fiyatları nasıl belirleniyor?",
    answer:
      "Web geliştirme, yazılım geliştirme, AI otomasyonu, WhatsApp otomasyonu ve API entegrasyonu projeleri kapsam bazlı fiyatlandırılır; keşif görüşmesi sonrası size özel bir teklif hazırlanır. QR Menü Sistemleri ise sabit aylık paketlerle sunulur.",
  },
  {
    category: "Fiyatlandırma",
    question: "Ödeme planı sunuyor musunuz?",
    answer:
      "Proje bazlı hizmetlerde genellikle aşama bazlı ödeme planı (keşif/başlangıç, orta aşama, teslim) uyguluyoruz. QR Menü Sistemleri'nde ise aylık veya yıllık abonelik modeli geçerlidir.",
  },
  {
    category: "Süreç",
    question: "Projeye başlamadan önce ne hazırlamam gerekiyor?",
    answer:
      "Mevcut marka materyalleriniz (logo, renkler, varsa mevcut içerikler) ve hedeflerinizi netleştiren birkaç madde yeterli; geri kalan detayları keşif görüşmesinde birlikte şekillendiriyoruz.",
  },
  {
    category: "Süreç",
    question: "Projem sırasında ilerlemeyi nasıl takip edebilirim?",
    answer:
      "Düzenli ilerleme güncellemeleri ve ara teslimatlarla süreci şeffaf tutuyoruz; her aşamada geri bildirim verme imkanınız olur.",
  },
];

export const faqCategories: FaqItem["category"][] = [
  "Genel",
  "Hizmetler",
  "QR Menü Sistemleri",
  "Fiyatlandırma",
  "Süreç",
];
