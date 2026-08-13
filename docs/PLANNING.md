# Proje Planlama Dokümanı

**Proje:** Kurumsal site — Yazılım Geliştirme / Web Tasarım / AI Otomasyonları / Cafe QR Menü Sistemi
**Stack:** Next.js (App Router)
**Dil:** Tek dil (Türkçe)
**Öncelikli Hedef:** Marka bilinirliği + güven inşası (destekleyici hedef: lead/teklif dönüşümü)
**Durum:** Planlama aşaması — kod/tasarım yok

---

## 1. Stratejik Çerçeve

### 1.1 Ne satıyoruz, kime satıyoruz?

Bu işletmenin **iki farklı ürün/hizmet ekseni** var ve bunlar farklı alıcı profillerine hitap ediyor. Bu ayrım, IA'nın en kritik kararı:

| Eksen | Hizmetler | Alıcı Profili | Arama Niyeti (Search Intent) |
|---|---|---|---|
| **A. Kurumsal Hizmetler** | Web Tasarım, Yazılım Geliştirme, AI Otomasyonları | KOBİ sahibi, girişimci, kurumsal karar verici | "web tasarım ajansı", "özel yazılım geliştirme firması", "yapay zeka otomasyon danışmanlığı" — proje bazlı, teklif odaklı, uzun satış döngüsü |
| **B. Ürün: Cafe QR Menü Sistemi** | Hazır/yarı-hazır SaaS benzeri ürün | Cafe/restoran/esnaf sahibi | "cafe qr menü sistemi fiyat", "restoran dijital menü", "qr kod menü nasıl yapılır" — fiyat-duyarlı, hızlı karar, self-servis satın alma isteği |

**Karar:** Cafe QR Menü Sistemi, genel "Hizmetler" hiyerarşisinin bir alt sayfası değil, **kendi başına bir ürün/landing yapısı** olarak modellenmeli (kendi fiyatlandırma, özellik ve demo sayfalarıyla). Sebep: farklı SEO kümesi, farklı ziyaretçi psikolojisi, farklı CTA ("Teklif Al" değil "Ücretsiz Dene / Fiyatları Gör").

### 1.2 Birincil ve ikincil hedefler

- **Birincil:** Marka bilinirliği — ziyaretçi "bu firma ne yapıyor, işini ne kadar iyi biliyor" sorusuna 5 saniyede cevap bulmalı.
- **İkincil (gizli dönüşüm hedefi):** Her sayfa, kullanıcıyı doğal bir sonraki adıma (iletişim formu, teklif talebi, demo isteği) yönlendiren en az bir CTA içermeli. Marka bilinirliği ile lead üretimi birbirini dışlamaz; brand-first bir ton kullanıp CTA'ları agresif değil davetkâr tutacağız.

---

## 2. Bilgi Mimarisi (Information Architecture)

### 2.1 Site Haritası

```
/ (Ana Sayfa)
│
├── /hizmetler (Hizmetler — Hub)
│   ├── /hizmetler/web-tasarim
│   ├── /hizmetler/yazilim-gelistirme
│   └── /hizmetler/ai-otomasyon
│
├── /cafe-qr-menu (Ürün — Landing/Hub)
│   ├── /cafe-qr-menu/ozellikler
│   ├── /cafe-qr-menu/fiyatlandirma
│   └── /cafe-qr-menu/demo
│
├── /projeler (Projeler / Referanslar — Galeri)
│   └── /projeler/[slug] (Proje Detay / Vaka Çalışması)
│
├── /blog (Blog — Liste)
│   ├── /blog/[slug] (Blog Detay)
│   └── /blog/kategori/[kategori] (opsiyonel, Faz 2+)
│
├── /hakkimizda (Hakkımızda)
├── /sss (Sıkça Sorulan Sorular)
├── /iletisim (İletişim)
│
└── Footer / Legal
    ├── /gizlilik-politikasi
    ├── /kullanim-sartlari
    └── /kvkk-aydinlatma-metni
```

**Toplam sayfa sayısı:** 13 statik rota + 2 dinamik rota şablonu (`/projeler/[slug]`, `/blog/[slug]`) → içerik büyüdükçe onlarca sayfaya ölçeklenir. "10+ sayfa" hedefiyle uyumlu.

### 2.2 Navigasyon Yapısı

**Header (üst menü):**
```
Logo | Hizmetler ▾ | Cafe QR Menü | Projeler | Blog | Hakkımızda | İletişim   [Teklif Al] (CTA buton)
```
- "Hizmetler" hover/click ile mega-menu veya dropdown açar (3 hizmet + kısa açıklama + ikon).
- "Cafe QR Menü" bilinçli olarak ana seviyede, dropdown'a gömülmeden — çünkü kendi kitlesi var ve ayrı bir "ürün" olarak vurgulanmalı.
- Sağda sabit CTA butonu tüm sayfalarda tutarlı.

**Footer (alt menü) — 4 kolon:**
```
Kolon 1: Logo + kısa tanım + sosyal medya ikonları
Kolon 2: Hizmetler (Web Tasarım, Yazılım, AI Otomasyon)
Kolon 3: Kurumsal (Hakkımızda, Projeler, Blog, SSS, İletişim)
Kolon 4: İletişim bilgisi (adres/telefon/e-posta) + KVKK/Gizlilik/Şartlar linkleri
```

### 2.3 Neden bu yapı? (Kararların gerekçesi)

- **Hizmetler hub sayfası** var çünkü 3 hizmetin ortak bir karşılaştırma/genel bakış noktasına ihtiyacı var — kullanıcı "ne yapıyorlar" sorusuna tek sayfada cevap bulmalı, sonra detaya inmeli.
- **Projeler galerisi ayrı bir üst-seviye sayfa** (dropdown'a gömülü değil) çünkü kullanıcı testi/soru istendi: "Proje/Referans galerisi kesinlikle olmalı" — güven inşası için en kritik sayfalardan biri, bu yüzden ana navigasyonda birinci sınıf vatandaş.
- **Blog**, kullanıcı zorunlu tutmasa da "10+ sayfa" ve "marka bilinirliği" hedefiyle SEO'nun bel kemiği olduğu için dahil edildi — yazılım/AI otomasyon gibi teknik hizmetlerde blog, uzmanlık kanıtı (E-E-A-T) olarak çok değerli. **Faz 2'de netleştirilecek, ama IA'da yeri ayrılmalı.**
- **Legal sayfalar** (KVKK/Gizlilik/Şartlar) iletişim formu ve olası çerez kullanımı nedeniyle Türkiye'de yasal zorunluluk — footer'a gömülü, ana navigasyona değil.

---

## 3. Sayfa Bazında Amaç, Hedef Kitle ve İçerik Blokları

### 3.1 Ana Sayfa (`/`)
- **Amaç:** 5 saniyede "kimiz, ne yapıyoruz, neden bize güvenmeli" sorusunu cevaplamak; tüm alt bölümlere trafik dağıtan merkez.
- **Hedef kullanıcı:** Her iki persona da (kurumsal alıcı + cafe işletmecisi) buraya düşebilir — bu yüzden hero'da net bir "yol ayrımı" (path-split) olmalı.
- **İçerik blokları:**
  1. Hero — güçlü value proposition + iki net CTA ("Hizmetlerimizi İnceleyin" / "Cafe QR Menüyü Keşfedin")
  2. Hizmet özet kartları (3 hizmet, ikon + 1 cümle + link)
  3. Cafe QR Menü öne çıkan bant (ayrı, görsel olarak farklılaştırılmış — çünkü ürün, hizmetten farklı bir kategori)
  4. Neden Biz (differentiator'lar: hız, teknik derinlik, şeffaf süreç vb.)
  5. Öne çıkan projeler (3 kart, "Tüm Projeleri Gör" linki)
  6. Sayılarla biz (istatistik şeridi — proje sayısı, müşteri sayısı, memnuniyet vb.)
  7. Müşteri yorumları / testimonial slider
  8. Blog'dan öne çıkanlar (opsiyonel, Faz 2)
  9. Kapanış CTA bandı ("Projenizi Konuşalım")

### 3.2 Hizmetler — Hub (`/hizmetler`)
- **Amaç:** 3 hizmeti karşılaştırmalı ve tarayıcı-dostu şekilde sunmak, kullanıcıyı doğru detay sayfasına yönlendirmek.
- **İçerik blokları:** Kısa giriş, 3 hizmet kartı (görsel + kapsam + "kimler için uygun" + CTA), süreç özeti (keşif → tasarım → geliştirme → teslim), genel CTA.

### 3.3 Web Tasarım (`/hizmetler/web-tasarim`)
- **Amaç:** Kurumsal/pazarlama web sitesi ihtiyacı olan işletmeleri ikna etmek.
- **İçerik:** Kapsam (kurumsal site, landing page, e-ticaret entegrasyonu vb.), kullanılan teknolojiler, süreç adımları, ilgili projeler (filtreli), fiyatlandırma yaklaşımı (paket veya "teklif alın"), SSS mini bölümü, CTA.

### 3.4 Yazılım Geliştirme (`/hizmetler/yazilim-gelistirme`)
- **Amaç:** Özel yazılım/entegrasyon ihtiyacı olan işletmeleri (web app, mobil, API entegrasyonu vb.) hedeflemek.
- **İçerik:** Hizmet kapsamı (özel yazılım, SaaS geliştirme, entegrasyonlar), teknoloji yeterliliği, çalışma modeli (fixed-price / time & material), ilgili projeler, CTA.

### 3.5 AI Otomasyonları (`/hizmetler/ai-otomasyon`)
- **Amaç:** En "yeni" ve en çok açıklama gerektiren hizmet — kullanıcıyı eğitmek + ikna etmek.
- **İçerik:** Somut kullanım senaryoları (chatbot, iş süreci otomasyonu, veri işleme, AI entegrasyonları), "önce/sonra" tipi kısa vaka anlatımı, kullanılan araç/model kategorileri, ilgili projeler, CTA.
- **Not:** Bu sayfa en çok "eğitici içerik" gerektiren sayfa olduğundan blog stratejisiyle en güçlü bağlantılı sayfa olacak.

### 3.6 Cafe QR Menü — Ürün Ana Sayfası (`/cafe-qr-menu`)
- **Amaç:** Bağımsız bir ürün landing page gibi davranmak; cafe/restoran sahibini hızlıca ikna edip "Fiyatları Gör" veya "Demo İste" adımına götürmek.
- **İçerik blokları:** Hero (ürün görseli/mockup + net fayda cümlesi), nasıl çalışır (3 adım: QR bas, menü aç, sipariş/gör), özellik özeti (kısa, detay linki `/ozellikler`e), fiyat teaser + link, kullanıcı yorumları (cafe sahiplerinden), SSS mini, güçlü CTA ("Hemen Başlayın").

### 3.7 Cafe QR — Özellikler (`/cafe-qr-menu/ozellikler`)
- **Amaç:** Ürünün teknik/fonksiyonel derinliğini göstermek (çoklu dil menü, anlık güncelleme, tasarım şablonları, analytics vb.).
- **İçerik:** Özellik listesi (ikon + başlık + açıklama grid), ekran görüntüleri/mockuplar, karşılaştırma (varsa rakip/klasik menüye göre avantaj).

### 3.8 Cafe QR — Fiyatlandırma (`/cafe-qr-menu/fiyatlandirma`)
- **Amaç:** Fiyat-duyarlı bu kitleye net, şeffaf paket bilgisi vermek — bu sayfa dönüşüm için kritik.
- **İçerik:** Paket kartları (ör. Başlangıç / Standart / Premium), özellik karşılaştırma tablosu, SSS ("kurulum var mı", "aylık mı yıllık mı" vb.), CTA.

### 3.9 Cafe QR — Demo (`/cafe-qr-menu/demo`)
- **Amaç:** Ürünü canlı/interaktif göstererek satın alma kararını hızlandırmak.
- **İçerik:** Gömülü interaktif demo (örnek bir menüyü QR ile tarama simülasyonu veya canlı örnek menü linki), "Kendi Menünüzü Oluşturun" CTA, iletişim/talep formu.

### 3.10 Projeler / Referanslar (`/projeler`)
- **Amaç:** Sosyal kanıt (social proof) — "bunları yaptık, güvenilirlik kanıtlanmış" mesajı.
- **İçerik:** Filtrelenebilir galeri (kategoriye göre: Web / Yazılım / AI Otomasyon / Cafe QR), her kart görsel + başlık + kısa etiket, detay sayfasına link.

### 3.11 Proje Detay (`/projeler/[slug]`)
- **Amaç:** Vaka çalışması derinliği — potansiyel müşteriye "bize benzer bir problemi nasıl çözdüğümüzü" göstermek.
- **İçerik:** Problem → Çözüm → Süreç → Sonuç (mümkünse ölçülebilir sonuç/metrik) yapısı, galeri/görseller, kullanılan teknolojiler, ilgili diğer projeler, CTA.

### 3.12 Blog — Liste (`/blog`)
- **Amaç:** SEO trafiği + uzmanlık kanıtı (E-E-A-T).
- **İçerik:** Kategori filtreleri, öne çıkan yazı, kart grid (görsel + başlık + özet + tarih + okuma süresi), sayfalama.

### 3.13 Blog Detay (`/blog/[slug]`)
- **Amaç:** Derinlemesine içerik ile hem SEO hem güven inşası; iç linklerle hizmet/ürün sayfalarına trafik yönlendirme.
- **İçerik:** Makale gövdesi, yazar bilgisi, ilgili yazılar, paylaşım butonları, makale sonu CTA (ilgili hizmete yönlendiren).

### 3.14 Hakkımızda (`/hakkimizda`)
- **Amaç:** İnsan/ekip boyutuyla güven inşası — "arkasında kimler var" sorusu.
- **İçerik:** Hikaye/misyon, değerler, ekip (opsiyonel fotoğraflarla), çalışma prensipleri/süreç, CTA.

### 3.15 SSS (`/sss`)
- **Amaç:** Satış öncesi itirazları (objection) tek sayfada gidermek, destek yükünü azaltmak.
- **İçerik:** Kategorize edilmiş accordion (Genel, Hizmetler, Cafe QR Menü, Fiyatlandırma, Süreç).

### 3.16 İletişim (`/iletisim`)
- **Amaç:** Ana dönüşüm noktası — form doldurma, arama, harita.
- **İçerik:** İletişim formu (ad, e-posta, telefon, hizmet ilgisi dropdown, mesaj), doğrudan iletişim bilgileri, harita (varsa fiziksel ofis), sosyal medya, çalışma saatleri.

### 3.17 Legal Sayfalar
- **Amaç:** Yasal uyumluluk (KVKK, çerez, kullanım şartları) — form/veri toplama olduğu için zorunlu.

---

## 4. Kullanıcı Akışları (User Flows)

### 4.1 Persona A — KOBİ Sahibi (Kurumsal web sitesi arıyor)
```
Google Arama ("web tasarım firması İstanbul")
   → Ana Sayfa (organik) veya doğrudan /hizmetler/web-tasarim (SEO)
   → Hizmet detay sayfasını okur
   → "İlgili Projeler" bölümünden /projeler/[slug] detayına gider (güven kontrolü)
   → /hakkimizda sayfasına göz atar (kim bunlar?)
   → /iletisim → form doldurur → dönüşüm
```

### 4.2 Persona B — Girişimci (Özel yazılım / AI otomasyon arıyor)
```
Referans/LinkedIn linki veya Google ("iş süreci otomasyonu AI")
   → /hizmetler/ai-otomasyon
   → Somut kullanım senaryolarını okur, ikna olamazsa /blog'da ilgili teknik yazıya gider
   → /projeler galerisinde "AI Otomasyon" filtresiyle örnek vaka bulur
   → /iletisim → teklif formu → dönüşüm
```

### 4.3 Persona C — Cafe/Restoran Sahibi (QR menü arıyor)
```
Google Arama ("cafe qr menü sistemi fiyatları") veya sosyal medya reklamı
   → Doğrudan /cafe-qr-menu (landing)
   → Hero'yu okur, "Nasıl Çalışır"a bakar
   → /cafe-qr-menu/fiyatlandirma → paketleri karşılaştırır
   → Emin değilse /cafe-qr-menu/demo → interaktif demoyu dener
   → "Hemen Başlayın" CTA → form/dönüşüm (kısa, sürtünmesiz form — bu persona sabırsız)
```

### 4.4 Persona D — Araştırmacı / Karşılaştırma Yapan Ziyaretçi
```
Blog yazısı üzerinden organik giriş (ör. "restoranlar için dijital dönüşüm")
   → /blog/[slug] okur
   → Makale içi iç link ile /cafe-qr-menu veya /hizmetler/ai-otomasyon'a geçer
   → /sss sayfasına bakar (itirazlarını gidermek için)
   → /iletisim veya doğrudan ürün sayfasında dönüşüm
```

**Ortak tasarım prensibi:** Her sayfa "dead-end" olmamalı — her sayfanın sonunda en az bir mantıklı sonraki adım (ilgili içerik veya CTA) olmalı.

---

## 5. Component Ağacı (Next.js App Router)

Feature-based + atomic prensiplerin karışımı: `ui/` (dumb, yeniden kullanılabilir atomlar), `layout/` (site iskeleti), `sections/` (sayfa-özel büyük bloklar), `features/` (etkileşimli/durum içeren birimler).

```
<RootLayout>
├── <Header>
│   ├── <Logo>
│   ├── <NavMenu>
│   │   ├── <NavItem>            (Hizmetler → dropdown tetikler)
│   │   └── <ServicesDropdown>
│   │       └── <ServiceMenuCard> × 3
│   ├── <MobileMenuToggle>
│   │   └── <MobileMenuDrawer>
│   └── <HeaderCTAButton>
│
├── <PageShell>  (her route bunun içine render olur)
│
│   ├── HomePage
│   │   ├── <Hero variant="split-cta">
│   │   ├── <ServiceCardGrid>
│   │   │   └── <ServiceCard> × 3
│   │   ├── <ProductHighlightBand>        (Cafe QR öne çıkan)
│   │   ├── <DifferentiatorGrid>
│   │   │   └── <DifferentiatorItem> × N
│   │   ├── <FeaturedProjects>
│   │   │   └── <ProjectCard> × 3
│   │   ├── <StatsCounterBar>
│   │   │   └── <AnimatedCounter> × N
│   │   ├── <TestimonialSlider>
│   │   │   └── <TestimonialCard>
│   │   ├── <BlogPreviewRow>               (Faz 2)
│   │   └── <CTABand>
│   │
│   ├── ServicesHubPage (/hizmetler)
│   │   ├── <PageHeader>
│   │   ├── <ServiceCardGrid> (detaylı varyant)
│   │   ├── <ProcessSteps>
│   │   │   └── <ProcessStepItem> × 4
│   │   └── <CTABand>
│   │
│   ├── ServiceDetailPage (/hizmetler/[slug])
│   │   ├── <ServiceHero>
│   │   ├── <ScopeList>
│   │   ├── <TechStackBadges>
│   │   ├── <ProcessSteps>
│   │   ├── <RelatedProjects>
│   │   │   └── <ProjectCard>
│   │   ├── <MiniFAQ>
│   │   │   └── <FAQAccordionItem>
│   │   └── <CTABand>
│   │
│   ├── CafeQrLandingPage (/cafe-qr-menu)
│   │   ├── <ProductHero>
│   │   ├── <HowItWorksSteps>
│   │   ├── <FeatureSummaryGrid>
│   │   ├── <PricingTeaser>
│   │   ├── <TestimonialSlider variant="cafe">
│   │   ├── <MiniFAQ>
│   │   └── <CTABand variant="urgent">
│   │
│   ├── CafeQrFeaturesPage
│   │   ├── <FeatureDetailGrid>
│   │   │   └── <FeatureDetailCard>
│   │   └── <ScreenshotGallery>
│   │
│   ├── CafeQrPricingPage
│   │   ├── <PricingCardGroup>
│   │   │   └── <PricingCard> × N
│   │   ├── <PricingComparisonTable>
│   │   ├── <MiniFAQ>
│   │   └── <CTABand>
│   │
│   ├── CafeQrDemoPage
│   │   ├── <InteractiveDemoFrame>       (feature/etkileşimli component)
│   │   └── <DemoRequestForm>
│   │
│   ├── ProjectsGalleryPage (/projeler)
│   │   ├── <ProjectFilterBar>            (kategori filtreleri, client component)
│   │   └── <ProjectGrid>
│   │       └── <ProjectCard>
│   │
│   ├── ProjectDetailPage (/projeler/[slug])
│   │   ├── <ProjectHero>
│   │   ├── <ProblemSolutionBlock>
│   │   ├── <ProjectGallery>
│   │   ├── <ResultMetricsRow>
│   │   ├── <TechStackBadges>
│   │   ├── <RelatedProjects>
│   │   └── <CTABand>
│   │
│   ├── BlogListPage (/blog)
│   │   ├── <BlogCategoryFilter>
│   │   ├── <FeaturedPostCard>
│   │   └── <BlogPostGrid>
│   │       └── <BlogPostCard>
│   │   └── <Pagination>
│   │
│   ├── BlogDetailPage (/blog/[slug])
│   │   ├── <ArticleHeader>
│   │   ├── <ArticleBody> (MDX/rich content)
│   │   ├── <ShareButtons>
│   │   ├── <RelatedPosts>
│   │   └── <CTABand>
│   │
│   ├── AboutPage (/hakkimizda)
│   │   ├── <StorySection>
│   │   ├── <ValuesGrid>
│   │   ├── <TeamGrid> (opsiyonel)
│   │   │   └── <TeamMemberCard>
│   │   └── <CTABand>
│   │
│   ├── FAQPage (/sss)
│   │   └── <FAQCategoryAccordion>
│   │       └── <FAQAccordionItem>
│   │
│   ├── ContactPage (/iletisim)
│   │   ├── <ContactInfoCard>
│   │   ├── <ContactForm>              (client component, validation)
│   │   └── <MapEmbed>
│   │
│   └── LegalPage (/gizlilik-politikasi vb.)
│       └── <LegalContentBlock>
│
├── <Footer>
│   ├── <FooterBrandColumn>
│   ├── <FooterLinkColumn> × 3
│   └── <FooterBottomBar> (copyright, legal linkler)
│
└── Global/Shared UI primitives (`ui/`)
    <Button> <Badge> <Card> <Input> <Select> <Textarea> <Accordion>
    <Modal> <Tooltip> <IconWrapper> <Section> <Container> <Divider>
```

---

## 6. Dosya Yapısı (Next.js App Router)

```
bizim-site/
├── docs/
│   └── PLANNING.md
│
├── public/
│   ├── images/
│   │   ├── projects/
│   │   ├── blog/
│   │   ├── team/
│   │   └── og/                    (Open Graph görselleri)
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                       (RootLayout — Header/Footer/fontlar)
│   │   ├── page.tsx                         (Ana Sayfa)
│   │   ├── globals.css
│   │   ├── sitemap.ts                       (dinamik sitemap.xml)
│   │   ├── robots.ts
│   │   ├── manifest.ts
│   │   │
│   │   ├── hizmetler/
│   │   │   ├── page.tsx                     (Hizmetler hub)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                 (web-tasarim / yazilim-gelistirme / ai-otomasyon)
│   │   │       └── data.ts                  (statik içerik/metadata haritası)
│   │   │
│   │   ├── cafe-qr-menu/
│   │   │   ├── page.tsx
│   │   │   ├── ozellikler/page.tsx
│   │   │   ├── fiyatlandirma/page.tsx
│   │   │   └── demo/page.tsx
│   │   │
│   │   ├── projeler/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx      (dinamik OG görsel, opsiyonel)
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── hakkimizda/page.tsx
│   │   ├── sss/page.tsx
│   │   ├── iletisim/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts                   (form Server Action)
│   │   │
│   │   ├── (legal)/
│   │   │   ├── gizlilik-politikasi/page.tsx
│   │   │   ├── kullanim-sartlari/page.tsx
│   │   │   └── kvkk-aydinlatma-metni/page.tsx
│   │   │
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                    (Button, Card, Input, Accordion, Badge, ...)
│   │   ├── layout/                (Header, Footer, NavMenu, MobileMenuDrawer)
│   │   ├── sections/              (Hero, CTABand, StatsCounterBar, ProcessSteps, ...)
│   │   └── features/
│   │       ├── contact-form/
│   │       ├── project-filter/
│   │       ├── testimonial-slider/
│   │       └── cafe-qr-demo/
│   │
│   ├── content/                   (statik içerik kaynakları — CMS yoksa)
│   │   ├── services.ts
│   │   ├── projects.ts
│   │   ├── blog/                  (MDX dosyaları veya blog.ts)
│   │   ├── testimonials.ts
│   │   └── faq.ts
│   │
│   ├── lib/
│   │   ├── seo.ts                 (metadata helper'lar, JSON-LD generator'lar)
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   └── use-in-view.ts         (scroll animasyon tetikleyici vb.)
│   │
│   └── types/
│       └── index.ts               (Project, Service, BlogPost, Testimonial tipleri)
│
├── next.config.ts
├── tsconfig.json
└── package.json
```

**Not:** İçerik yönetimi için başlangıçta dosya-tabanlı (`content/*.ts` + MDX) yeterli; blog hacmi büyürse Faz 3+'ta headless CMS (Sanity/Contentful) geçişi değerlendirilebilir — bu, dosya yapısını bozmadan `content/` katmanının veri kaynağını değiştirmek anlamına gelir.

---

## 7. SEO Stratejisi

### 7.1 Teknik SEO
- **Next.js Metadata API** her route için `generateMetadata` ile dinamik title/description/OG/Twitter Card.
- **JSON-LD structured data:**
  - `Organization` — root layout'ta site geneli
  - `LocalBusiness` — eğer fiziksel adres varsa (Google Business Profile ile NAP tutarlılığı)
  - `Service` — her hizmet detay sayfasında
  - `Product` + `Offer` — Cafe QR Menü fiyatlandırma sayfasında
  - `FAQPage` — `/sss` ve mini-FAQ blokları
  - `Article` — blog detay sayfaları
  - `BreadcrumbList` — tüm derinlik-2+ sayfalarda
- **Sitemap.xml & robots.txt** — `app/sitemap.ts` ile dinamik üretim (projeler/blog slug'ları dahil).
- **Canonical URL'ler** her sayfada; filtre/query param'lı proje galerisinde canonical'ın base URL'e işaret etmesi.
- **Semantik HTML** — tek `<h1>` per sayfa, mantıklı `<h2>/<h3>` hiyerarşisi.

### 7.2 URL Yapısı
- Türkçe, kısa, tire-ayrımlı, anahtar kelime içeren slug'lar (`/hizmetler/ai-otomasyon`, `/cafe-qr-menu/fiyatlandirma`) — zaten yukarıdaki IA bu prensiple kuruldu.

### 7.3 İçerik / Anahtar Kelime Stratejisi (İki ayrı küme)
- **Küme 1 — Kurumsal hizmetler:** "web tasarım ajansı", "kurumsal yazılım geliştirme", "yapay zeka otomasyon çözümleri", "iş süreci otomasyonu yazılımı" → hizmet sayfaları + blog destek içerikleri.
- **Küme 2 — Cafe QR ürünü:** "qr menü sistemi", "cafe dijital menü", "restoran qr kod menü fiyatları" → ürün sayfaları + blog'da "restoran/cafe dijitalleşme" temalı yazılar.
- **Blog topic cluster modeli:** Her hizmet/ürün için bir "pillar" sayfa (zaten var) + o pillar'a iç link veren 4-6 destekleyici blog yazısı. Örn. AI Otomasyon pillar'ına bağlı: "AI chatbot nasıl kurulur", "iş süreçlerinde otomasyonun faydaları" vb.

### 7.4 On-Page Detaylar
- Title template: `%s | [Marka Adı]` (metadata.ts'te merkezi tanım).
- Her görselde açıklayıcı `alt` metni (özellikle proje galerisi ve blog kapak görselleri).
- İç linkleme: Blog → hizmet/ürün sayfası, proje detay → ilgili hizmet sayfası (çift yönlü bağlam).
- Open Graph görselleri: statik marka şablonlu OG image (Faz 2'de dinamik `opengraph-image.tsx` ile proje/blog başlığına göre otomatik üretim değerlendirilebilir).

### 7.5 Lokal SEO (uygulanabilirse)
- Fiziksel ofis/lokasyon varsa: Google Business Profile bağlantısı, NAP (Ad-Adres-Telefon) tutarlılığı footer + iletişim sayfası + structured data arasında birebir aynı olmalı.

---

## 8. Performans Stratejisi

### 8.1 Rendering Stratejisi (route bazlı)
| Sayfa Tipi | Strateji | Gerekçe |
|---|---|---|
| Ana sayfa, Hizmetler, Cafe QR sayfaları, Hakkımızda, SSS | **Static (SSG)** — build-time render | İçerik nadiren değişir, maksimum hız |
| Proje detay, Blog detay | **Static + ISR** (`revalidate`) | İçerik zamanla eklenir ama sık değişmez; yeniden build beklemeden güncellenir |
| İletişim formu submit | **Server Action** | İstemci JS'ini minimumda tutar, form güvenliği artar |
| Proje galerisi filtreleme | **Client component, statik veriyle** | Filtre etkileşimi client-side, veri build-time gelir (ekstra API çağrısı yok) |

### 8.2 Asset Optimizasyonu
- `next/image` ile tüm görsellerde otomatik boyutlandırma, WebP/AVIF, lazy loading (hero görseli hariç → `priority`).
- `next/font` ile self-hosted font, layout shift önleme (font-display: swap benzeri davranış otomatik).
- İkon seti tek bir SVG sprite/kütüphane (ör. lucide-react) ile tree-shaking uyumlu kullanım — her sayfa sadece kullandığı ikonu bundle'a alır.

### 8.3 JS Bundle Stratejisi
- Server Components varsayılan; yalnızca gerçek etkileşim gerektiren component'ler (`ContactForm`, `ProjectFilterBar`, `TestimonialSlider`, `InteractiveDemoFrame`, `MobileMenuDrawer`, animasyonlu component'ler) `'use client'`.
- Ağır kütüphaneler (demo interaktif bileşeni, slider) `next/dynamic` ile lazy-load + `ssr:false` (gerekiyorsa).
- Route bazlı otomatik code-splitting (App Router native).

### 8.4 Core Web Vitals Hedefleri
- **LCP < 2.5s:** Hero görseli `priority` + optimize edilmiş boyut; kritik CSS inline (Next.js otomatik halleder).
- **CLS < 0.1:** Tüm görsel/video alanlarına sabit `width/height` veya `aspect-ratio`; font yüklemesi layout shift yaratmayacak şekilde.
- **INP < 200ms:** Ağır animasyon/hesaplamalar `requestAnimationFrame` veya CSS-driven (JS-driven değil) tercih edilecek.

### 8.5 Caching & CDN
- Statik sayfalar edge CDN'de (Vercel veya benzeri) cache'lenir.
- Görseller CDN üzerinden optimize + cache-control header'larla uzun süreli tarayıcı cache.
- API/form endpoint'leri no-cache, kalan her şey agresif cache.

### 8.6 İzleme
- Lighthouse CI (build pipeline'a entegre, regresyon önleme).
- Vercel Analytics / Web Vitals raporlama gerçek kullanıcı verisiyle (RUM).

---

## 9. Animasyon Stratejisi

**Genel prensip:** Animasyon dekor değil, **anlam taşımalı** — dikkat yönlendirme, hiyerarşi vurgusu, geri bildirim (feedback) amaçlı. Performansı asla feda etmez; `prefers-reduced-motion` her zaman saygı görür.

### 9.1 Önerilen Araçlar
- **Framer Motion (`motion/react`)** — component bazlı giriş/scroll animasyonları için.
- **CSS transitions/keyframes** — hover, focus gibi basit mikro-etkileşimler için (JS'siz, en performanslı).
- Smooth scroll için opsiyonel `Lenis` — yalnızca marka hissi çok önemliyse (performans maliyetini göze alarak, Faz 4'te değerlendirilecek).

### 9.2 Animasyon Envanteri (nerede, ne, neden)

| Yer | Animasyon | Amaç |
|---|---|---|
| Header | Scroll'da küçülme + arka plan blur/opacity geçişi | Navigasyonu her zaman erişilebilir ama sayfaya müdahaleci olmayan hale getirmek |
| Mobil menü | Slide-in drawer + stagger'lı link reveal | Algılanan hız ve "canlı" his |
| Hero (her sayfa) | Başlık/alt başlık/CTA fade+slide-up, hafif stagger | İlk izlenimde dikkat akışı yönlendirme |
| Hizmet/Proje kartları | Scroll-triggered fade-in + stagger (kart kart) | İçeriğin "keşfediliyor" hissi, sayfa yüklenirken göz yormamak |
| Kart hover | Hafif scale (1.02) + gölge derinliği artışı + görsel zoom | Etkileşilebilirlik sinyali |
| İstatistik sayaçları (StatsCounterBar) | Sayı sayma animasyonu (viewport'a girince tetiklenir) | Başarı/ölçek algısını güçlendirme |
| Testimonial slider | Crossfade + hafif slide geçiş | Yumuşak, dikkat dağıtmayan içerik döngüsü |
| Proje galerisi filtreleme | Layout animasyonu (FLIP tekniği — Framer Motion `layout` prop) kartlar filtrelenirken yer değiştirir | Ani sıçrama yerine akıcı yeniden düzenleme |
| Proje/Blog detay galerisi | Lightbox açılış scale+fade | Odak geçişini yumuşatma |
| Cafe QR Demo sayfası | QR tarama simülasyonu (basit "scan" mikro-animasyonu) + menü açılış slide/fade | Ürünü *hissettirmek*, somutlaştırmak — bu sayfanın en önemli dönüşüm aracı |
| SSS accordion | Height auto-animasyon (accordion açılış/kapanış) | Standart, beklenen UX geri bildirimi |
| Form (İletişim/Demo) | Input focus ring geçişi, hata/başarı mesajı fade+shake (hata) | Anlık, net geri bildirim |
| Sayfa geçişleri | Hafif fade (App Router transition, opsiyonel `view transitions API`) | Bütünsel marka hissi — **düşük öncelik, Faz 4** |
| CTA butonları | Hover'da ikon kayması / arka plan dolgu geçişi | Tıklanabilirlik vurgusu |

### 9.3 Erişilebilirlik ve Performans Kuralları
- Tüm scroll-triggered animasyonlar `prefers-reduced-motion: reduce` sorgusuna göre devre dışı bırakılır veya anlık (instant) hale getirilir.
- Animasyon süreleri 200–500ms bandında tutulur; 500ms üzeri yalnızca büyük geçişlerde (sayfa/lightbox) kullanılır.
- Sadece `transform` ve `opacity` animasyonu tercih edilir (layout/paint tetiklemez, GPU-hızlandırmalı).
- Aşırı animasyon riski: Cafe QR demo hariç, kurumsal sayfalarda animasyon **destekleyici**, asla dikkat dağıtıcı ana unsur olmamalı — marka "profesyonel/güvenilir" algısı önceliklidir.

---

## 10. Geliştirme Roadmap'i

### Faz 0 — Temel Kurulum (1 hafta)
- Next.js App Router projesi kurulumu, TypeScript, ESLint/Prettier, Tailwind (veya seçilen styling çözümü) yapılandırması.
- Tasarım sistemi temelleri: renk paleti, tipografi, spacing scale, temel `ui/` component'lerinin iskeleti (henüz görsel tasarım değil, yapı).
- `content/` veri modelleri (Service, Project, BlogPost, Testimonial, FAQ tipleri) tanımlanır.
- SEO altyapısı: `lib/seo.ts`, metadata template, `sitemap.ts`, `robots.ts`.

### Faz 1 — Çekirdek Sayfalar (2 hafta)
- Header, Footer, mobil navigasyon.
- Ana Sayfa (tüm section'lar, gerçek içerik olmadan placeholder'la da olsa tam yapı).
- Hizmetler hub + 3 hizmet detay sayfası.
- Hakkımızda, SSS, İletişim (form + Server Action + doğrulama).
- Legal sayfalar (KVKK/Gizlilik/Şartlar) — hukuki metin içerikleri hazırlanmalı.

### Faz 2 — Ürün (Cafe QR) + Projeler (2 hafta)
- Cafe QR Menü landing, Özellikler, Fiyatlandırma, Demo sayfaları.
- Proje galerisi (filtreleme dahil) + proje detay şablonu + ilk 4-6 gerçek proje içeriği.
- Testimonial ve istatistik verisi entegrasyonu.

### Faz 3 — Blog & SEO Derinleştirme (1.5 hafta)
- Blog liste + detay şablonu, MDX içerik pipeline'ı.
- İlk 6-8 blog yazısı (her hizmet/ürün pillar'ı için en az 1-2 yazı).
- Structured data (JSON-LD) tüm sayfa tiplerine uygulanır.
- İç linkleme stratejisi devreye alınır.

### Faz 4 — Animasyon, Mikro-etkileşim & Görsel Cila (1.5 hafta)
- Framer Motion entegrasyonu, animasyon envanterinin (Bölüm 9.2) uygulanması.
- Cafe QR Demo sayfasının interaktif prototipi.
- Responsive/mobil ince ayarlar, dark mode (kapsam netleşince karar verilecek).
- Erişilebilirlik denetimi (kontrast, klavye navigasyonu, `prefers-reduced-motion`).

### Faz 5 — Performans, Test & Yayın (1 hafta)
- Lighthouse/Core Web Vitals denetimi ve optimizasyon turu.
- Cross-browser/cross-device test.
- Analytics (GA4 veya alternatif) + form/lead takibi kurulumu.
- Google Search Console kaydı, sitemap gönderimi.
- Prodüksiyon deploy + DNS/CDN yapılandırması.

### Faz 6 — Yayın Sonrası (Sürekli)
- Blog içerik takvimi (aylık 2-4 yazı) ile SEO büyümesinin sürdürülmesi.
- Proje galerisine yeni vaka çalışmaları eklenmesi.
- A/B test edilebilecek CTA/hero varyasyonları (özellikle Cafe QR landing'de dönüşüm optimizasyonu için).

**Tahmini toplam süre (Faz 0–5):** ~9 hafta (tek geliştirici varsayımıyla; paralel çalışma ile kısalabilir).

---

## 11. Açık Kararlar / Sonraki Adımlar

Bu plan onaylandıktan sonra netleştirilmesi gereken noktalar:
1. Marka kimliği (isim, logo, renk/tipografi yönü) — tasarım aşamasına geçmeden önce gerekli.
2. Fiziksel ofis/lokasyon var mı? (LocalBusiness SEO ve harita entegrasyonu için)
3. Cafe QR Menü ürününün gerçek fiyat paketleri ve özellik listesi (Bölüm 3.8 için ham veri).
4. Blog için içerik üretim sorumlusu/süreci (kim yazacak, ne sıklıkla).
5. Styling çözümü tercihi (Tailwind CSS önerilir, ama teyit gerekli).
