import type { StatItem, TeamMember } from "@/types";

// Ekip isimleri ve istatistikler gerçek verilerle değiştirilmeli — bkz. TODO.md.
export const teamMembers: TeamMember[] = [
  {
    name: "Ozan Kürkçü",
    role: "Kurucu Ortak & Geliştirici",
    bio: "6 yıllık yazılım mimarisi deneyimiyle Literaphy'nin teknik vizyonunu yönetiyor; web ve otomasyon projelerine liderlik ediyor.",
    avatar: "/team/ozan-kurkcu.jpg",
  },
  {
    name: "Berat Alakuş",
    role: "Kurucu Ortak & Yönetici",
    bio: "Kurumsal Web ve QR Menü Sistemlerinin yönetiminden sorumlu; müşteri ilişkileri ve proje yönetimi süreçlerini yürütüyor.",
    avatar: "/team/berat-alakus.jpg",
  }
];

export const companyStats: StatItem[] = [
  { value: 10, suffix: "+", label: "Tamamlanan proje" },
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
    "Literaphy, işletmelerin dijitalleşme sürecinde tekrar eden, zaman alan ve hataya açık iş yüklerini teknolojiyle ortadan kaldırmak için kuruldu.",
  body: "Web geliştirmeden AI otomasyonuna, WhatsApp entegrasyonundan QR menü sistemlerine kadar attığımız her adımın ortak paydası aynı: doğru teknolojiyi doğru sürece uygulayarak ölçülebilir bir sonuç üretmek. Küçük bir ekip olarak kalmayı bilinçli olarak tercih ediyoruz — bu sayede her projeye kurucu seviyesinde teknik dikkat ayırabiliyoruz.",
};
