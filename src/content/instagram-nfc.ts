import { CreditCard, Heart, Instagram, Sparkles, UserPlus, Zap } from "lucide-react";
import type { QuantityPricingTier } from "@/types";

export const instagramNfcHowItWorks = [
  {
    number: "01",
    title: "Kartı Okutun",
    description: "Karşınızdaki kişi kartı telefonuna yaklaştırır, NFC çipi devreye girer.",
  },
  {
    number: "02",
    title: "Instagram Profiliniz Anında Açılır",
    description: "Uygulama indirmeye gerek kalmadan, Instagram hesabınız doğrudan telefonda açılır.",
  },
  {
    number: "03",
    title: "Saniyeler İçinde Takip Eder",
    description: "Karşınızdaki kişi tek dokunuşla takip eder; siz de daha fazla ve daha hızlı takipçi kazanırsınız.",
  },
];

export const instagramNfcFeatures = [
  {
    icon: Instagram,
    title: "Güçlü NFC Çipi",
    description: "Kartın içindeki NFC çipi, telefon yaklaştırıldığı anda devreye girer; ekstra bir işlem gerekmez.",
  },
  {
    icon: Zap,
    title: "Uygulama Gerektirmez",
    description: "Okutma anında Instagram profiliniz doğrudan açılır, karşınızdaki kişinin ekstra arama yapmasına gerek kalmaz.",
  },
  {
    icon: UserPlus,
    title: "Doğrudan Profilinize Yönlendirir",
    description: "Kart, Instagram hesabınızı doğrudan açar; takip etmek için tek dokunuş yeterlidir.",
  },
  {
    icon: CreditCard,
    title: "Şık ve Dayanıklı Tasarım",
    description: "PVC kart üzerine baskılı, cüzdanda, masada veya kartvizit standında uzun süre kullanılabilecek sağlam yapı.",
  },
  {
    icon: Sparkles,
    title: "Kurulum ve Pil Gerektirmez",
    description: "Elektronik bileşen içermez; kutudan çıkar çıkmaz kullanıma hazırdır, bakım gerektirmez.",
  },
  {
    icon: Heart,
    title: "Daha Fazla Instagram Takipçisi",
    description: "Takip etme adımı kolaylaştıkça etkinliklerde, mağazada veya kartvizit yerine daha fazla kişi hesabınızı takip eder.",
  },
];

export const instagramNfcPricing: QuantityPricingTier[] = [
  {
    quantity: "1 kart",
    unitPrice: 1000,
    totalPrice: 1000,
    description: "Kişisel hesaplar veya önce denemek isteyenler için.",
    features: [
      "Hesabınıza özel programlanmış 1 adet NFC kart",
      "Instagram profilinize doğrudan yönlendirme",
      "Kargo ile adresinize teslim",
    ],
    highlighted: false,
    ctaLabel: "Sipariş Verin",
  },
  {
    quantity: "5 kart",
    unitPrice: 900,
    totalPrice: 4500,
    description: "Ekibe, mağazaya veya etkinliklere dağıtmak isteyenler için en popüler paket.",
    features: [
      "Hesabınıza özel programlanmış 5 adet NFC kart",
      "Ekip, mağaza ve etkinlik için yeterli adet",
      "Adet başı %10 indirimli fiyat",
      "Kargo ile adresinize teslim",
    ],
    highlighted: true,
    ctaLabel: "5'li Paketi Alın",
  },
  {
    quantity: "10 kart",
    unitPrice: 800,
    totalPrice: 8000,
    description: "Çok şubeli işletmeler, ajanslar ve topluluklar için toplu avantajlı fiyat.",
    features: [
      "Hesabınıza özel programlanmış 10 adet NFC kart",
      "Çok şubeli işletmeler için ideal dağıtım adedi",
      "Adet başı %20 indirimli fiyat",
      "Kargo ile adresinize teslim",
    ],
    highlighted: false,
    ctaLabel: "10'lu Paketi Alın",
  },
];

export const instagramNfcFaq = [
  {
    question: "NFC kart nasıl çalışır, telefonuma özel bir uygulama mı gerekiyor?",
    answer:
      "Hayır. Güncel akıllı telefonların büyük çoğunluğu NFC'yi tarayıcı üzerinden destekler; kart telefona yaklaştırıldığında ekstra bir uygulama gerekmeden Instagram profiliniz açılır (telefonda Instagram uygulaması yüklüyse doğrudan uygulama içinde açılır).",
  },
  {
    question: "Kartlar hangi Instagram hesabına yönlendiriliyor?",
    answer:
      "Kart, yalnızca sizin belirttiğiniz Instagram hesabına özel olarak programlanır; sipariş sırasında kullanıcı adınızı bizimle paylaşmanız yeterlidir.",
  },
  {
    question: "Birden fazla hesabım veya şubem var, her biri için ayrı kart mı gerekiyor?",
    answer:
      "Evet, her hesap için o hesaba özel programlanmış ayrı kart(lar) gönderiyoruz. Çok şubeli işletmeler ve ajanslar için 10'lu paket ya da 10 adedin üzerindeki özel teklifler en uygun seçenektir.",
  },
  {
    question: "Kartlar ne kadar sürede elimde olur?",
    answer:
      "Sipariş onayından ve Instagram kullanıcı adınızı bizimle paylaşmanızdan sonra kartlarınız ortalama 3-5 iş günü içinde programlanıp adresinize kargolanır.",
  },
  {
    question: "Kartın ömrü ne kadar, arızalanırsa ne olur?",
    answer:
      "Kart pil veya elektronik bir bileşen içermez; günlük kullanımda yıllarca sorunsuz çalışır. Kaybolma veya hasar durumunda aynı yönlendirmeyle yeni kart çıkarabiliriz.",
  },
];
