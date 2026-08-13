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
    name: "Barış Ünal",
    role: "Kurucu Ortak",
    company: "Meva Finans",
    quote:
      "Belge işleme otomasyonu ilk ayda kendini amorti etti. En değerlisi, ekibimizin artık tekrar eden işler yerine katma değerli işlere odaklanabilmesi oldu.",
    tag: "kurumsal",
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
