import type { StatItem, TeamMember } from "@/types";

// Ekip isimleri ve istatistikler gerçek verilerle değiştirilmeli — bkz. TODO.md.
export const teamMembers: TeamMember[] = [
  {
    name: "Onur Baş",
    role: "Kurucu Ortak & Teknik Direktör",
    bio: "12 yıllık yazılım mimarisi deneyimiyle OBSoft'un teknik vizyonunu yönetiyor; büyük ölçekli entegrasyon projelerine liderlik ediyor.",
  },
  {
    name: "Elif Sancak",
    role: "Ürün ve Tasarım Direktörü",
    bio: "Kurumsal web ve QR Menü Sistemleri ürün ailesinin tasarım dilini kuruyor; marka deneyimi ile kullanılabilirliği birlikte tasarlıyor.",
  },
  {
    name: "Kaan Doğu",
    role: "AI & Otomasyon Mühendisi",
    bio: "AI otomasyonu ve WhatsApp entegrasyon projelerinde uçtan uca mimariyi kuruyor; süreç analizinden canlıya almaya kadar sürece eşlik ediyor.",
  },
  {
    name: "Naz Ergin",
    role: "Müşteri Başarı Yöneticisi",
    bio: "Proje süreçlerinin şeffaf ilerlemesinden ve teslim sonrası destekten sorumlu; müşterilerin OBSoft ile çalışma deneyimini yönetiyor.",
  },
];

export const companyStats: StatItem[] = [
  { value: 60, suffix: "+", label: "Tamamlanan proje" },
  { value: 98, suffix: "%", label: "Müşteri memnuniyeti" },
  { value: 6, suffix: "", label: "Yıllık sektör deneyimi" },
  { value: 24, suffix: "sa", label: "Ortalama geri dönüş süresi" },
];

export const companyValues = [
  {
    title: "Şeffaflık",
    description: "Süreç boyunca net iletişim kurar, sürprizlerden kaçınırız.",
  },
  {
    title: "Sonuç Odaklılık",
    description: "Her projede ölçülebilir bir başarı metriği tanımlar, ona göre çalışırız.",
  },
  {
    title: "Teknik Derinlik",
    description: "Kolay yolu değil, doğru ve sürdürülebilir mimariyi tercih ederiz.",
  },
  {
    title: "Uzun Vadeli Ortaklık",
    description: "Teslimle biten değil, teslimle başlayan bir ilişki kurarız.",
  },
];

export const companyStory = {
  eyebrow: "HAKKIMIZDA",
  lead:
    "OBSoft, işletmelerin dijitalleşme sürecinde tekrar eden, zaman alan ve hataya açık iş yüklerini teknolojiyle ortadan kaldırmak için kuruldu.",
  body: "Web geliştirmeden AI otomasyonuna, WhatsApp entegrasyonundan QR menü sistemlerine kadar attığımız her adımın ortak paydası aynı: doğru teknolojiyi doğru sürece uygulayarak ölçülebilir bir sonuç üretmek. Küçük bir ekip olarak kalmayı bilinçli olarak tercih ediyoruz — bu sayede her projeye kurucu seviyesinde teknik dikkat ayırabiliyoruz.",
};
