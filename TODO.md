# TODO — Yayına Almadan Önce

Bu dosya, otonom geliştirme sırasında gerçek veri/entegrasyon eksikliği
nedeniyle makul varsayımlarla doldurulan noktaları listeler. Kesintiye
sebep olmamak için akış durdurulmadı; aşağıdakiler devreye alınmadan
önce netleştirilmeli veya gerçek verilerle değiştirilmeli.

## Yüksek Öncelik

- **Gerçek alan adı**: `src/lib/constants.ts` içindeki `SITE_URL` şu an
  `https://literaphy.com.tr` olarak varsayıldı (metadata, sitemap, robots,
  JSON-LD, OG görselleri bu değeri kullanıyor). Gerçek domain
  belirlenince tek bu satır güncellenmeli.
- **İletişim bilgileri**: Telefon/WhatsApp gerçek numarayla güncellendi
  (`0542 461 96 30`). E-posta ve adres (`Kartepe, Kocaeli`) hâlâ
  placeholder olabilir — netleşince `CONTACT` bloğu güncellenmeli.
- **Form teslimatı (e-posta)**: Altyapı hazır (`src/lib/email.ts`, Resend
  üzerinden) ve üç forma da (İletişim, QR Menü demo, N8N demo) bağlandı; ama
  `RESEND_API_KEY` henüz set edilmedi — ID'siz iken sadece sunucu loguna
  yazıyor. resend.com'da hesap açılıp API key `.env`'e (ve deploy ortamına)
  eklenince ek kod değişikliği gerekmeden devreye girer. Bildirimler
  `literaphy@gmail.com` adresine gidecek şekilde ayarlandı (`CONTACT_NOTIFY_EMAIL`
  ile değiştirilebilir).
- **Sosyal medya linkleri**: `SOCIAL_LINKS` içindeki URL'ler
  (linkedin.com/company/literaphy vb.) gerçek hesaplar açılınca
  güncellenmeli; şu an tahmini/placeholder.

## Orta Öncelik

- **Ekip ve istatistikler**: `src/content/team.ts` içindeki ekip üyesi
  isimleri/rolleri ve `companyStats` (60+ proje, %98 memnuniyet vb.)
  temsili değerlerdir — gerçek ekip ve rakamlarla değiştirilmeli.
- **QR Menü fiyatları**: `src/content/qr-menu.ts` içindeki paket
  fiyatları (₺349 / ₺649 / ₺1190) örnek niteliğindedir, gerçek
  fiyatlandırma stratejisiyle teyit edilmeli.
- **Proje/blog içerikleri**: `src/content/projects.ts` ve
  `src/content/blog.ts` gerçekçi ama kurgusal örnek içeriklerdir
  (müşteri adları dahil). Gerçek referanslarla değiştirilmeli.
- **Görsel varlıklar**: Gerçek ürün fotoğrafı/ekran görüntüsü
  sağlanmadığı için tüm görseller (proje kapakları, QR demo ekranları,
  takım avatarları) `CoverArt`, `PhoneMockup`, `Avatar` gibi CSS/SVG
  tabanlı üretken bileşenlerle temsil edildi. Gerçek fotoğraf/ekran
  görüntüsü geldiğinde bu bileşenlerin yerini `next/image` ile gerçek
  varlıklar almalı.
- **Kurumsal logo**: `organizationJsonLd`/`articleJsonLd` (`src/lib/seo.tsx`)
  şu an `logo` alanı için `/icon.svg`'ye işaret ediyor (önceki
  `/logo.png` referansı `public/` içinde karşılığı olmadığından 404
  veriyordu — SEO denetiminde düzeltildi). Gerçek marka logosu (tercihen
  kare, min. 112×112 PNG/SVG) eklenince bu iki referans ona
  güncellenmeli.
- **Harita**: Gerçek ofis koordinatı olmadığı için `/iletisim`
  sayfasındaki `LocationPanel` stilize bir panel; gerçek adres
  netleşince Google Maps embed (veya benzeri) ile değiştirilebilir.

## Düşük Öncelik / Faz 5+ (roadmap'te zaten planlı)

- **Analytics (GA4)**: Altyapı hazır (`src/components/layout/Analytics.tsx`,
  `.env.example`) ama `NEXT_PUBLIC_GA_MEASUREMENT_ID` henüz set edilmedi —
  ID'siz iken bileşen sessizce hiçbir şey render etmiyor. GA4'te property
  oluşturulup ID env değişkenine eklenince ek kod değişikliği gerekmeden
  devreye girer. Search Console entegrasyonu da hâlâ yapılmadı.
- Lighthouse CI / Core Web Vitals izleme pipeline'a eklenmedi.
- Açık tema (light mode) toggle'ı bilinçli olarak uygulanmadı —
  `docs/PLANNING.md` roadmap'inde Faz 4'te "kapsam netleşince karar
  verilecek" olarak işaretlenmişti. Koyu tema token mimarisi
  `docs/DESIGN_SYSTEM.md` Bölüm 1.1.2'de tanımlı; toggle eklenmek
  istenirse `next-themes` (veya benzeri, flaş önleyici script ile)
  önerilir.
- Legal sayfalar (Gizlilik Politikası, Kullanım Şartları, KVKK
  Aydınlatma Metni) standart şablon metinlerdir — yayına almadan önce
  bir hukuk danışmanı tarafından gözden geçirilmelidir.

## Notlar

- `npm run build`, `npm run lint` ve üretim sunucusu (`npm run start`)
  bu oturumda doğrulandı: build 37/37 sayfayı hatasız üretiyor, lint
  temiz, tüm route'lar (dahil `/qr-menu-sistemleri/*`, dinamik
  `[slug]` sayfaları ve özel 404) prod modda 200/404 döndürüyor.
- `next` paketi `15.1.6` → `15.5.22`'ye yükseltilerek bilinen kritik
  CVE (CVE-2025-66478) giderildi. `npm audit` hâlâ 12 "high" uyarı
  raporluyor, ancak bunların tamamı geliştirme araç zincirine ait
  transitive bağımlılıklar (`eslint`'in `minimatch`/`brace-expansion`
  zinciri, Next.js'in build-time kullandığı `postcss`/`sharp`) —
  proje `next/image` kullanmadığı için `sharp` çalışma zamanında hiç
  devreye girmiyor. `npm audit fix --force` bu paketleri çok eski
  (kırıcı) sürümlere düşürmeyi öneriyor; bu yüzden uygulanmadı. Yeni
  bir eslint majör sürümü çıktığında `eslint`/`eslint-config-next`
  bağımsız olarak güncellenebilir.
