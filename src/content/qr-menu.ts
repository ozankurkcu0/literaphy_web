import {
  BarChart3,
  Globe2,
  Languages,
  Palette,
  QrCode,
  RefreshCw,
  Smartphone,
  Timer,
} from "lucide-react";
import type { PricingPlan } from "@/types";

export const qrMenuHowItWorks = [
  {
    number: "01",
    title: "QR Kodu Okutun",
    description: "Müşteriniz masadaki QR kodu telefon kamerasıyla okutur, uygulama indirmesine gerek kalmaz.",
  },
  {
    number: "02",
    title: "Menü Anında Açılır",
    description: "Kategorilere ayrılmış, görsellerle zenginleştirilmiş dijital menünüz saniyeler içinde tarayıcıda açılır.",
  },
  {
    number: "03",
    title: "Siz Anlık Güncelleyin",
    description: "Fiyat, ürün veya kampanya değişikliklerini yönetim panelinden yapın; basılı menü beklemeden anında yayına alın.",
  },
];

export const qrMenuFeatures = [
  {
    icon: QrCode,
    title: "Temassız QR Menü",
    description: "Uygulama indirmeden, tek karede açılan hızlı ve hijyenik dijital menü deneyimi.",
  },
  {
    icon: RefreshCw,
    title: "Anlık Güncelleme",
    description: "Fiyat ve ürün değişikliklerini yönetim panelinden saniyeler içinde yayına alın, basım maliyeti ödemeyin.",
  },
  {
    icon: Languages,
    title: "Çoklu Dil Desteği",
    description: "Türkçe, İngilizce ve talep ettiğiniz diğer dillerde otomatik menü sunumu.",
  },
  {
    icon: Palette,
    title: "Marka Kimliğine Uyumlu Tasarım",
    description: "Logonuz, renkleriniz ve fotoğraflarınızla marka kimliğinize birebir uyumlu menü teması.",
  },
  {
    icon: BarChart3,
    title: "Ziyaretçi Analitiği",
    description: "En çok görüntülenen ürünler, yoğun saatler ve müşteri davranışlarını panelden takip edin.",
  },
  {
    icon: Smartphone,
    title: "Her Cihazda Mükemmel Görünüm",
    description: "Mobil, tablet ve masaüstünde otomatik uyumlanan, hızlı yüklenen responsive tasarım.",
  },
];

export const qrMenuPricing: PricingPlan[] = [
  {
    name: "Başlangıç",
    monthlyPrice: 349,
    yearlyPrice: 279,
    description: "Tek şube, temel dijital menü ihtiyacı olan işletmeler için.",
    features: [
      "1 şube / 1 QR menü",
      "Sınırsız ürün ve kategori",
      "Tek dil desteği",
      "Temel marka özelleştirmesi",
      "Aylık güncelleme desteği",
    ],
    highlighted: false,
    ctaLabel: "Başlangıç ile Devam Et",
  },
  {
    name: "Standart",
    monthlyPrice: 649,
    yearlyPrice: 519,
    description: "Büyüyen cafe ve restoranlar için en çok tercih edilen paket.",
    features: [
      "3 şubeye kadar",
      "Sınırsız ürün ve kategori",
      "3 dile kadar çoklu dil",
      "Tam marka özelleştirmesi",
      "Ziyaretçi analitiği paneli",
      "Öncelikli destek",
    ],
    highlighted: true,
    ctaLabel: "Standart ile Başla",
  },
  {
    name: "Premium",
    monthlyPrice: 1190,
    yearlyPrice: 950,
    description: "Çoklu şube zincirleri ve özel entegrasyon ihtiyacı olan işletmeler için.",
    features: [
      "Sınırsız şube",
      "Sınırsız dil desteği",
      "POS / sipariş sistemi entegrasyonu",
      "Gelişmiş analitik ve raporlama",
      "Özel alan adı (custom domain)",
      "Özel hesap yöneticisi",
    ],
    highlighted: false,
    ctaLabel: "Premium ile İletişime Geç",
  },
];

export const qrMenuComparisonRows = [
  { feature: "Şube sayısı", starter: "1", standard: "3'e kadar", premium: "Sınırsız" },
  { feature: "Dil desteği", starter: "1 dil", standard: "3 dile kadar", premium: "Sınırsız" },
  { feature: "Analitik paneli", starter: "—", standard: "✓", premium: "✓ (Gelişmiş)" },
  { feature: "POS / sipariş entegrasyonu", starter: "—", standard: "—", premium: "✓" },
  { feature: "Özel alan adı", starter: "—", standard: "—", premium: "✓" },
  { feature: "Destek", starter: "E-posta", standard: "Öncelikli", premium: "Özel hesap yöneticisi" },
];

export const qrMenuFaq = [
  {
    question: "Kurulum ücreti var mı?",
    answer: "Hayır, tüm paketlerde kurulum ücretsizdir. Menünüzü birlikte tasarlayıp 24-48 saat içinde yayına alıyoruz.",
  },
  {
    question: "Aylık mı yıllık mı ödeme yapabiliyorum?",
    answer: "Her iki seçenek de mevcut; yıllık ödemede aylık fiyata göre yaklaşık %20 indirim uygulanır.",
  },
  {
    question: "Menümü kendim güncelleyebilir miyim?",
    answer: "Evet, size özel yönetim panelinden ürün, fiyat ve kategori güncellemelerini kendiniz, teknik bilgiye gerek kalmadan yapabilirsiniz.",
  },
  {
    question: "QR kodları nereye yerleştirmeliyim?",
    answer: "Masa üstü standlar, giriş panosu veya menü kartı üzerine yerleştirebileceğiniz baskıya hazır QR tasarımlarını sizin için hazırlıyoruz.",
  },
];

export const qrMenuStatIcons = { Timer, Globe2 };
