import { CONTACT, SITE_LEGAL_NAME } from "@/lib/constants";

export const privacyPolicy = {
  title: "Gizlilik Politikası",
  updatedAt: "31 Temmuz 2026",
  sections: [
    {
      heading: "1. Genel Bilgilendirme",
      paragraphs: [
        `${SITE_LEGAL_NAME} ("Literaphy", "biz") olarak, literaphy.com.tr web sitesi üzerinden topladığımız kişisel verilerin gizliliğini ve güvenliğini önemsiyoruz. Bu politika, hangi verileri, hangi amaçla topladığımızı ve nasıl işlediğimizi açıklar.`,
      ],
    },
    {
      heading: "2. Toplanan Veriler",
      paragraphs: [
        "İletişim formu, demo talep formu veya e-posta yoluyla bizimle iletişime geçtiğinizde ad-soyad, e-posta adresi, telefon numarası ve mesaj içeriğiniz gibi bilgileri topluyoruz.",
        "Web sitesini ziyaret ettiğinizde, hizmet kalitesini artırmak amacıyla anonim kullanım istatistikleri (sayfa görüntüleme, tarayıcı bilgisi gibi) toplanabilir.",
      ],
    },
    {
      heading: "3. Verilerin Kullanım Amacı",
      paragraphs: [
        "Toplanan veriler yalnızca talebinizi değerlendirmek, sizinle iletişime geçmek, hizmetlerimizi sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır. Verileriniz üçüncü taraflarla pazarlama amacıyla paylaşılmaz.",
      ],
    },
    {
      heading: "4. Veri Güvenliği",
      paragraphs: [
        "Kişisel verilerinizin yetkisiz erişime, kayba veya kötüye kullanıma karşı korunması için makul teknik ve idari önlemler alıyoruz.",
      ],
    },
    {
      heading: "5. Haklarınız",
      paragraphs: [
        `Kişisel verilerinize erişim, düzeltme veya silme talebiniz için ${CONTACT.email} adresinden bizimle iletişime geçebilirsiniz.`,
      ],
    },
  ],
};

export const termsOfService = {
  title: "Kullanım Şartları",
  updatedAt: "31 Temmuz 2026",
  sections: [
    {
      heading: "1. Kabul",
      paragraphs: [
        `literaphy.com.tr web sitesini kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.`,
      ],
    },
    {
      heading: "2. Hizmetlerin Kapsamı",
      paragraphs: [
        "Literaphy, web geliştirme, yazılım geliştirme, AI otomasyonu, WhatsApp otomasyonu, API entegrasyonu ve QR Menü Sistemleri hizmetlerini sunar. Hizmet kapsamı, süresi ve bedeli her proje için ayrı bir sözleşme veya teklif ile belirlenir.",
      ],
    },
    {
      heading: "3. Fikri Mülkiyet",
      paragraphs: [
        "Web sitesinde yer alan marka, logo ve içerikler Literaphy'ye aittir. İzinsiz kullanılamaz veya çoğaltılamaz. Proje teslimlerinde fikri mülkiyet devri, ilgili proje sözleşmesinde ayrıca düzenlenir.",
      ],
    },
    {
      heading: "4. Sorumluluğun Sınırlandırılması",
      paragraphs: [
        "Web sitesindeki bilgiler genel bilgilendirme amaçlıdır. Literaphy, sitenin kesintisiz veya hatasız çalışacağını garanti etmez.",
      ],
    },
    {
      heading: "5. Değişiklikler",
      paragraphs: [
        "Literaphy, bu kullanım şartlarını dilediği zaman güncelleme hakkını saklı tutar. Güncellemeler bu sayfada yayınlandığı andan itibaren geçerli olur.",
      ],
    },
  ],
};

export const kvkkNotice = {
  title: "KVKK Aydınlatma Metni",
  updatedAt: "31 Temmuz 2026",
  sections: [
    {
      heading: "1. Veri Sorumlusu",
      paragraphs: [
        `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, ${SITE_LEGAL_NAME} veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda işlemektedir.`,
      ],
    },
    {
      heading: "2. İşlenen Kişisel Veriler",
      paragraphs: [
        "İletişim formu ve demo talep formu aracılığıyla paylaştığınız ad-soyad, e-posta, telefon numarası ve mesaj içeriği gibi kimlik ve iletişim verileri işlenmektedir.",
      ],
    },
    {
      heading: "3. Kişisel Verilerin İşlenme Amacı",
      paragraphs: [
        "Verileriniz; talebinizin değerlendirilmesi, tarafınıza teklif sunulması, hizmet süreçlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.",
      ],
    },
    {
      heading: "4. Kişisel Verilerin Aktarılması",
      paragraphs: [
        "Kişisel verileriniz, yasal zorunluluklar dışında, açık rızanız olmaksızın üçüncü kişilerle paylaşılmaz.",
      ],
    },
    {
      heading: "5. Veri Sahibinin Hakları",
      paragraphs: [
        `KVKK'nın 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Bu haklarınızı kullanmak için ${CONTACT.email} adresinden bize ulaşabilirsiniz.`,
      ],
    },
  ],
};
