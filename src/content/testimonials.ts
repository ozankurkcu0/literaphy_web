import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    name: "Emre Karadağ",
    role: "Genel Müdür",
    company: "Vento Yapı",
    quote:
      "Literaphy ile çalışmadan önce web sitemiz bizim için sadece bir zorunluluktu. Şimdi en güçlü satış kanallarımızdan biri — hem teknik hem de stratejik olarak süreci baştan sona çok profesyonel yönettiler.",
    tag: "kurumsal",
  },
  {
    name: "Selin Aydoğan",
    role: "Operasyon Direktörü",
    company: "Lupa Lojistik",
    quote:
      "Excel'den gerçek bir operasyon paneline geçiş, ekibimizin günlük çalışma şeklini kökten değiştirdi. Literaphy ekibi ihtiyacımızı bizden bile daha net anladı.",
    tag: "kurumsal",
  },
  {
    name: "Barış Ünal",
    role: "Kurucu Ortak",
    company: "Meva Finans",
    quote:
      "Belge işleme otomasyonu ilk ayda kendini amorti etti. En değerlisi, ekibimizin artık tekrar eden işler yerine katma değerli işlere odaklanabilmesi oldu.",
    tag: "kurumsal",
  },
  {
    name: "Derya Tan",
    role: "İşletme Sahibi",
    company: "Kahve Durağı",
    quote:
      "8 şubede fiyat güncellemesi artık tek tuşla oluyor. QR menüye geçtiğimizden beri hem baskı maliyetimiz sıfırlandı hem müşteriler menüyü çok daha rahat inceliyor.",
    tag: "qr-menu",
  },
  {
    name: "Onur Sezgin",
    role: "İşletme Sahibi",
    company: "Fırın Sokağı",
    quote:
      "Kurulumu bir günden kısa sürdü, ekibim hiç eğitim almadan kullanmaya başladı. Analitik panelinden en çok satan ürünleri görmek menü tasarımımızı bile değiştirdi.",
    tag: "qr-menu",
  },
  {
    name: "Ceyda Aksoy",
    role: "Pazarlama Müdürü",
    company: "Çizgi Mobilya",
    quote:
      "WhatsApp otomasyonu sayesinde artık müşteri mesajlarını kaçırmıyoruz. Satış ekibimiz yalnızca gerçekten ilgi gösteren müşterilerle birebir ilgileniyor.",
    tag: "kurumsal",
  },
];

export function getTestimonialsByTag(tag: Testimonial["tag"]): Testimonial[] {
  return testimonials.filter((testimonial) => testimonial.tag === tag);
}
