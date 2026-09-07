import { CreditCard, MapPin, Sparkles, SmartphoneNfc, Star, Zap } from "lucide-react";
import type { QuantityPricingTier } from "@/types";

export const googleReviewHowItWorks = [
  {
    number: "01",
    title: "Kartı Okutun",
    description: "Müşteriniz kartı telefonuna yaklaştırır, NFC çipi devreye girer.",
  },
  {
    number: "02",
    title: "Google Haritalar Anında Açılır",
    description: "Uygulama indirmeye gerek kalmadan, işletmenizin Google Haritalar değerlendirme ekranı doğrudan tarayıcıda açılır.",
  },
  {
    number: "03",
    title: "Saniyeler İçinde Yorum Bırakılır",
    description: "Müşteriniz yıldız puanını verip yorumunu yazar; siz de daha fazla ve daha hızlı Google yorumu kazanırsınız.",
  },
];

export const googleReviewFeatures = [
  {
    icon: SmartphoneNfc,
    title: "Güçlü NFC Çipi",
    description: "Kartın içindeki NFC çipi, telefon yaklaştırıldığı anda devreye girer; ekstra bir işlem gerekmez.",
  },
  {
    icon: Zap,
    title: "Uygulama Gerektirmez",
    description: "Okutma anında tarayıcı üzerinden doğrudan açılır, müşterinizin herhangi bir uygulama indirmesine gerek kalmaz.",
  },
  {
    icon: MapPin,
    title: "Doğrudan Google Haritalar'a Yönlendirir",
    description: "Kart, işletmenizin Google Haritalar değerlendirme sayfasını doğrudan açar; müşteri fazladan arama yapmaz.",
  },
  {
    icon: CreditCard,
    title: "Şık ve Dayanıklı Tasarım",
    description: "PVC kart üzerine baskılı, masa üstünde, kasada veya girişte uzun süre kullanılabilecek sağlam yapı.",
  },
  {
    icon: Sparkles,
    title: "Kurulum ve Pil Gerektirmez",
    description: "Elektronik bileşen içermez; kutudan çıkar çıkmaz kullanıma hazırdır, bakım gerektirmez.",
  },
  {
    icon: Star,
    title: "Daha Fazla Google Yorumu",
    description: "Değerlendirme bırakma adımı kolaylaştıkça müşterileriniz daha sık yorum bırakır, işletmeniz Google'da daha görünür olur.",
  },
];

export const googleReviewPricing: QuantityPricingTier[] = [
  {
    quantity: "1 kart",
    unitPrice: 1000,
    totalPrice: 1000,
    description: "Tek şubeli işletmeler veya önce denemek isteyenler için.",
    features: [
      "İşletmenize özel programlanmış 1 adet NFC kart",
      "Google Haritalar değerlendirme sayfasına doğrudan yönlendirme",
      "Kargo ile adresinize teslim",
    ],
    highlighted: false,
    ctaLabel: "Sipariş Verin",
  },
  {
    quantity: "5 kart",
    unitPrice: 900,
    totalPrice: 4500,
    description: "Masalara, kasaya ve girişe dağıtmak isteyen işletmeler için en popüler paket.",
    features: [
      "İşletmenize özel programlanmış 5 adet NFC kart",
      "Masa, kasa ve giriş için yeterli adet",
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
    description: "Çok şubeli işletmeler ve zincirler için toplu avantajlı fiyat.",
    features: [
      "İşletmenize özel programlanmış 10 adet NFC kart",
      "Çok şubeli işletmeler için ideal dağıtım adedi",
      "Adet başı %20 indirimli fiyat",
      "Kargo ile adresinize teslim",
    ],
    highlighted: false,
    ctaLabel: "10'lu Paketi Alın",
  },
];

export const googleReviewFaq = [
  {
    question: "NFC kart nasıl çalışır, telefonuma özel bir uygulama mı gerekiyor?",
    answer:
      "Hayır. Güncel akıllı telefonların büyük çoğunluğu NFC'yi tarayıcı üzerinden destekler; kart telefona yaklaştırıldığında ekstra bir uygulama gerekmeden Google Haritalar değerlendirme sayfası açılır.",
  },
  {
    question: "Kartlar hangi Google Haritalar sayfasına yönlendiriliyor?",
    answer:
      "Kart, yalnızca sizin işletmenizin Google Business Profili'ndeki 'yorum yaz' ekranına özel olarak programlanır; sipariş sırasında işletme bilgilerinizi bizimle paylaşmanız yeterlidir.",
  },
  {
    question: "Birden fazla şubem var, her şube için ayrı kart mı gerekiyor?",
    answer:
      "Evet, her şubenin kendi Google Business Profili olduğundan her şube için o şubeye özel programlanmış ayrı kart(lar) gönderiyoruz. Çok şubeli işletmeler için 10'lu paket ya da 10 adedin üzerindeki özel teklifler en uygun seçenektir.",
  },
  {
    question: "Kartlar ne kadar sürede elimde olur?",
    answer:
      "Sipariş onayından ve işletme bilgilerinizi bizimle paylaşmanızdan sonra kartlarınız ortalama 3-5 iş günü içinde programlanıp adresinize kargolanır.",
  },
  {
    question: "Kartın ömrü ne kadar, arızalanırsa ne olur?",
    answer:
      "Kart pil veya elektronik bir bileşen içermez; günlük kullanımda yıllarca sorunsuz çalışır. Kaybolma veya hasar durumunda aynı yönlendirmeyle yeni kart çıkarabiliriz.",
  },
];
