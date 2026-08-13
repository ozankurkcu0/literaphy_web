# Görsel Tasarım Sistemi & Ekran Spesifikasyonları

**Rol:** Frontend Lead Designer — Figma-seviyesi spesifikasyon
**Referans dil:** Linear (motion + koyu tema mimarisi), Stripe (grid disiplini + tipografi hiyerarşisi), Apple (whitespace + premium sadelik), Vercel (mono aksanlar + kontrast), Framer Showcase (kart etkileşimi + scroll koreografisi)
**Kapsam:** Kod yok, görsel üretim yok — yalnızca uygulanabilir tasarım spesifikasyonu
**Kaynak:** Palet/tipografi/motion önerileri `ui-ux-pro-max` tasarım veritabanından doğrulandı (Linear'ın gerçek marka rengi `#5E6AD2` dahil); sayı sayacı animasyonu için veritabanında doğrudan eşleşme yoktu, Standard-tier motion prensiplerinden türetildi — bu ayrıca belirtilmiştir.

---

## 0. Tasarım Felsefesi

Beş referans markanın ortak paydası tek bir cümlede özetlenebilir: **"az öğe, çok nefes alanı, her hareketin bir nedeni var."**

Somut ilkeler:
1. **Koyu-öncelikli (dark-first).** Linear/Vercel/Framer varsayılan olarak koyu temada açılır; açık tema ikincil/alternatif olarak sunulur (Bölüm 1.1'de her iki tema de tanımlı).
2. **Saf siyah yok.** Arka planlar `#020203`–`#0A0A0C` bandında — OLED "leke" etkisini önler, aynı zamanda derinlik katmanlaması (elevation) için oda bırakır.
3. **Kontrast rengi tek bir vurgu.** Marka rengi (indigo/mor) tüm sitede tutarlı tek aksan; ikinci bir aksan sadece Cafe QR ürün ailesini ayırt etmek için kontrollü kullanılır (Bölüm 1.1.3).
4. **Kenarlıklar, gölgeler değil.** Koyu zeminde gölge okunmaz — bunun yerine `rgba(255,255,255,0.08)` gibi ince "hairline" border'lar ve hover'da hafif "glow" kullanılır (Stripe/Linear imzası).
5. **Tipografi tek aile, çok ağırlık.** Inter tek başına, 400'den 800'e kadar ağırlık skalası ile hiyerarşi kurar — Vercel'in Geist felsefesiyle birebir örtüşür.
6. **Hareket, anlam taşır.** Her animasyon ya dikkat yönlendirir ya geri bildirim verir; dekoratif hareket yok (Bölüm 1.5 motion token'ları bunu zorunlu kılar).
7. **Grid disiplini.** Her section aynı 12 kolonlu ızgaraya oturur; hizasızlık yok — Stripe'ın "her şey aynı çizgide" hissi buradan gelir.

---

## 1. Tasarım Token'ları (Foundation)

### 1.1 Renk Sistemi

#### 1.1.1 Koyu Tema (Varsayılan / Primary)

| Token | Hex / Değer | Kullanım |
|---|---|---|
| `--bg-deep` | `#020203` | Hero arka planı, footer, en dış "negatif alan" |
| `--bg-base` | `#050506` | Sayfa varsayılan arka planı |
| `--bg-elevated` | `#0A0A0C` | Alternatif section arka planı (zebra-stripe yerine kullanılır) |
| `--surface-card` | `rgba(255,255,255,0.03)` | Kart iç zemini (bg-base üzerinde) |
| `--surface-card-hover` | `rgba(255,255,255,0.06)` | Kart hover zemini |
| `--border-hairline` | `rgba(255,255,255,0.08)` | Varsayılan kenarlık (kart, input, divider) |
| `--border-strong` | `rgba(255,255,255,0.14)` | Hover/focus kenarlığı |
| `--foreground` | `#EDEDEF` | Birincil metin (başlıklar) |
| `--foreground-secondary` | `#C4C4C9` | Gövde metni (lead paragraf) |
| `--foreground-muted` | `#8A8F98` | Yardımcı metin, caption, meta bilgi |
| `--foreground-faint` | `#55575E` | Placeholder, disabled metin |
| `--accent` | `#5E6AD2` | Marka rengi — CTA, link, aktif durum, focus ring |
| `--accent-hover` | `#7275E0` | Accent hover/active tonu |
| `--accent-glow` | `rgba(94,106,210,0.25)` | Hover/focus glow, hero arka plan ambient ışık |
| `--accent-product` (Cafe QR) | `#F5A623` | Yalnızca `/cafe-qr-menu/*` rotalarında — sıcak amber, "ürün" kimliğini kurumsal hizmetlerden ayırır |
| `--accent-product-glow` | `rgba(245,166,35,0.22)` | Cafe QR sayfalarında glow karşılığı |
| `--success` | `#10B981` | Form başarı, "dahil" ikonları (pricing tablosu) |
| `--warning` | `#F59E0B` | Uyarı rozeti |
| `--danger` | `#EF4444` | Form hata durumu |

**Kural:** `--accent-product` yalnızca Cafe QR rotalarında CTA/vurgu rengi olarak devreye girer; navbar, footer ve global bileşenler her zaman `--accent` kullanır — marka bütünlüğü bozulmaz, yalnızca o bölümün "ürün modu"na geçtiği hissedilir (Stripe'ın Atlas/Terminal alt-markalarına benzer mantık).

#### 1.1.2 Açık Tema (Alternatif — Faz 4'te tema anahtarı ile devreye alınır)

| Token | Hex |
|---|---|
| `--bg-deep` (light) | `#0B0B0F` (yalnızca footer, tema fark etmeksizin koyu kalır) |
| `--bg-base` (light) | `#FFFFFF` |
| `--bg-elevated` (light) | `#F8FAFC` |
| `--surface-card` (light) | `#FFFFFF` + border `#E5E7EB` + `shadow-elevation-1` |
| `--foreground` (light) | `#0B0B0F` |
| `--foreground-secondary` (light) | `#3F3F46` |
| `--foreground-muted` (light) | `#64748B` |
| `--accent` (light) | `#4F46E5` (kontrast için biraz koyulaştırılmış indigo) |
| `--border-hairline` (light) | `#E5E7EB` |

Açık temada gölge devreye girer çünkü beyaz zeminde border tek başına derinlik iletmez:
- `--shadow-elevation-1`: `0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06)`
- `--shadow-elevation-2` (hover): `0 12px 28px rgba(0,0,0,.08)`

#### 1.1.3 Renk Kullanım Oranı (60/30/10 prensibi)
- **%60** — `bg-base` / `bg-elevated` (nötr zemin)
- **%30** — `foreground` skalası (metin, ikon, border)
- **%10** — `accent` (yalnızca CTA, link, aktif durum, seçili sekme, focus ring) — bu oranın aşılması "amatör" hissi yaratır, bu yüzden accent asla büyük yüzeylerde arka plan olarak kullanılmaz (gradient hero arka planı hariç, bkz. 4.1).

### 1.2 Tipografi

**Tek aile stratejisi (Vercel/Linear modeli):** Inter, self-hosted variable font. İkincil olarak JetBrains Mono yalnızca "teknik" veri noktaları için (istatistik rakamları, fiyat etiketleri, kategori rozetleri, tarih/meta bilgi) — bu, Linear/Vercel'in imza dokunuşu: gövde metni humanist sans, sayılar/etiketler mono.

| Rol | Font | Boyut (Desktop) | Boyut (Mobil) | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|---|---|
| Display XL (Ana sayfa hero H1) | Inter | 76px | 40px | 1.04 | -2% | 700 |
| Display L (Alt sayfa hero H1) | Inter | 56px | 34px | 1.08 | -1.5% | 700 |
| H2 (Section başlığı) | Inter | 40px | 28px | 1.15 | -1% | 700 |
| H3 (Kart/alt bölüm başlığı) | Inter | 22px | 19px | 1.3 | -0.5% | 600 |
| H4 (Küçük başlık/eyebrow altı) | Inter | 17px | 16px | 1.4 | 0 | 600 |
| Lead / Body-L (Hero alt metin) | Inter | 20px | 17px | 1.6 | 0 | 400 |
| Body (Varsayılan gövde) | Inter | 16px | 16px | 1.65 | 0 | 400 |
| Body-S (Caption/meta) | Inter | 14px | 14px | 1.5 | 0 | 500 |
| Eyebrow / Kicker (bölüm üstü etiket) | JetBrains Mono | 13px | 12px | 1.4 | +6% | 500, UPPERCASE |
| Stat / Sayaç rakamı | JetBrains Mono | 48px | 32px | 1 | -1% | 600 |
| Nav link | Inter | 14.5px | — | 1 | 0 | 500 |
| Buton metni | Inter | 15px | 15px | 1 | 0 | 600 |

**Kurallar:**
- Her sayfada tek bir H1.
- Paragraf max genişliği 65-72 karakter (`max-width: 640px` body bloklarında) — okunabilirlik.
- `foreground-secondary` yalnızca lead paragraflarda; gövde metni `foreground-secondary` değil `foreground-muted`'a kaymaz, aksi halde kontrast düşer.

### 1.3 Spacing & Grid Sistemi

**Temel birim:** 4px. **Skala:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160

| Breakpoint | Container max-width | Kenar boşluğu (padding-inline) | Grid | Gutter |
|---|---|---|---|---|
| Mobil `<768px` | 100% | 20px | 4 kolon | 16px |
| Tablet `768–1023px` | 720px | 40px | 8 kolon | 20px |
| Laptop `1024–1439px` | 1040px | 64px | 12 kolon | 24px |
| Desktop `≥1440px` | 1200px (içerik) / 1440px (showcase bandı) | 80px | 12 kolon | 24px |

**Dikey ritim (section padding-block):**
- Standart section: **128px** desktop / **96px** tablet / **72px** mobil
- Hero section: **algılanan** 160px üst (navbar payı dahil) / 96px alt
- Kompakt section (CTA bandı, mini-FAQ): **80px** desktop / **56px** mobil

Bu ritim tutarlı kaldığı sürece (yani her section aynı 128px nefes payına sahip olduğu sürece) sayfa "kalibre edilmiş" hissettirir — Stripe'ın en belirgin özelliği budur.

### 1.4 Radius / Border / Blur

| Token | Değer | Kullanım |
|---|---|---|
| `--radius-sm` | 8px | Badge, input, küçük ikon kutusu |
| `--radius-md` | 12px | Buton, mini kart |
| `--radius-lg` | 16px | Standart kart (servis, proje, blog) |
| `--radius-xl` | 24px | Büyük panel, pricing kartı, modal, görsel çerçeveler |
| `--radius-full` | 999px | Pill/badge, avatar, toggle |
| `--blur-nav` | `blur(12px)` | Navbar arkası (scroll sonrası) |
| `--blur-modal-backdrop` | `blur(8px)` | Modal/lightbox arka planı |

### 1.5 Motion Token'ları

| Token | Süre | Easing | Kullanım |
|---|---|---|---|
| `--ease-premium` | — | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero giriş, büyük reveal — Linear'ın imza eğrisi |
| `--ease-standard` | — | `cubic-bezier(0.33, 1, 0.68, 1)` (power2.out) | Kart hover, buton geçişleri |
| `--ease-in-out` | — | `cubic-bezier(0.65,0,0.35,1)` | Accordion aç/kapa, tab geçişi |
| `--duration-instant` | 100–120ms | `--ease-standard` | Basma/tıklama geri bildirimi |
| `--duration-fast` | 150–200ms | `--ease-standard` | Hover renk/border geçişleri |
| `--duration-base` | 250–300ms | `--ease-standard` | Kart lift, buton hover |
| `--duration-slow` | 400–600ms | `--ease-premium` | Scroll-reveal, stagger giriş |
| `--duration-deliberate` | 600–900ms | `--ease-premium` | Hero başlık sekansı, sayfa geçişi |

**Scroll-reveal standardı** (veritabanı: Standard tier, doğrulanmış):
```
opacity: 0 → 1, y: 24px → 0, duration 500ms, stagger 80ms/eleman,
ease power2.out, ScrollTrigger start: "top 85%", toggleActions: play none none reverse
```
Kural: bir section içinde en fazla 6-8 eleman stagger edilir; ötesi "gecikmiş" hissettirir.

**Hover standardı (kart):**
```
y: -4px, scale: 1.02, border-color → border-strong, glow opacity 0 → 1,
duration 250ms, ease power2.out — mouseleave aynı süre ile tersine
```

**Hover mikro (buton/link):**
```
y: -1px, opacity 0.9 → 1, duration 150ms, ease power1.out
transform ve opacity dışında hiçbir şey animasyonlu değil (compositor thread'de kalır)
```

**Magnetic CTA (yalnızca hero'daki TEK birincil buton için — veritabanı notu: "1-2 focal elementten fazlasında gürültü yaratır"):**
```
mousemove ile ±30% çekim gücü, clamp'li, elastic.out(1,0.4), 300-500ms
```

**Sayaç animasyonu (StatsCounterBar) — veritabanında birebir preset yok, Standard-tier prensiplerinden türetilmiştir, bu açıkça belirtilir:**
```
ScrollTrigger viewport'a girince tetiklenir (start: "top 85%"),
0'dan hedef değere say, duration 1200-1600ms, ease power1.out,
ondalık yoksa Math.round ile tam sayı; sayaç bittiğinde "+" veya "%" son eki
0.15s gecikmeyle fade-in eder (sayı zıplamasın diye)
```

**Erişilebilirlik:** `prefers-reduced-motion: reduce` durumunda tüm scroll-reveal ve stagger'lar `opacity` geçişine indirgenir (y-offset kaldırılır), sayaç animasyonu anında hedef değeri gösterir.

### 1.6 İkonografi
- **Stil:** Outline/stroke (Lucide ailesi), 1.5px stroke width, 20px veya 24px kutu.
- **Emoji asla ikon yerine kullanılmaz** (veritabanı anti-pattern — kurumsal/premium algıyı doğrudan zedeler).
- İkon renkleri her zaman `foreground-muted` (varsayılan) veya `accent` (aktif/vurgulu durum); asla düz dolgu renkli "sticker" ikon kullanılmaz.

---

## 2. Temel Bileşen Spesifikasyonları

### 2.1 Butonlar

| Varyant | Yükseklik | Padding-inline | Radius | BG | Text | Hover | Focus |
|---|---|---|---|---|---|---|---|
| Primary (Solid) | 44px (48px hero'da) | 22px | `--radius-md` | `accent` | `#FFFFFF` | bg→`accent-hover`, y:-1px, glow shadow `0 8px 24px accent-glow` | 2px ring `accent`, 2px offset |
| Secondary (Outline) | 44px | 22px | `--radius-md` | transparent | `foreground` | border `hairline`→`strong`, bg→`surface-card-hover` | aynı ring |
| Ghost (Tersiyer) | 40px | 16px | `--radius-sm` | transparent | `foreground-muted` | text→`foreground`, altı ince underline slide-in (soldan sağa 200ms) | ring yok, sadece text rengi |
| Nav CTA (header sağı) | 38px | 18px | `--radius-full` | `accent` | `#FFFFFF` | brightness +8%, scale 1.02 | ring |
| Icon-arrow CTA (hero) | 52px | 28px | `--radius-full` | `accent` | `#FFFFFF` | ok ikonu +4px sağa kayar (150ms), buton magnetic | ring |

Tüm butonlarda `cursor: pointer`, `transition: all 200ms var(--ease-standard)`, disabled durumda opacity 0.4 + `cursor: not-allowed`.

### 2.2 Kartlar

| Kart Tipi | Padding | Radius | Görsel Oranı | Hover Davranışı |
|---|---|---|---|---|
| Servis Kartı | 32px | `--radius-lg` | — (40px ikon üstte) | y:-4px, border→accent/25%, glow arkada belirir |
| Proje Kartı | 0 (görsel edge-to-edge) + 24px alt bilgi bloğu | `--radius-lg` | 4:3 | görsel `scale(1.05)` (overflow hidden), overlay gradient alttan koyulaşır, başlık `translateY(-4px)` |
| Fiyat Kartı | 40px | `--radius-xl` | — | "Popüler" kart: statik olarak `scale(1.02)`, `accent` border 1.5px + glow; diğerleri hover'da yalnızca border brighten |
| Blog Kartı | 0 + 20px alt blok | `--radius-lg` | 16:9 | görsel scale 1.04, başlık rengi → `accent` |
| Testimonial Kartı | 32px | `--radius-lg` | avatar 48px daire | statik (slider içinde, hover yok — dikkat dağıtmasın) |
| Özellik Kartı (Cafe QR) | 28px | `--radius-lg` | 32px ikon | y:-4px, ikon arka planı `accent-product-glow` ile dolar |

### 2.3 Badge / Rozet
Pill (`--radius-full`), padding `4px 12px`, font mono 12px uppercase +6% tracking, bg `accent/10%`, text `accent`, border `accent/20%`. "Popüler" pricing rozeti aynı yapı ama bg dolu `accent`, text `#FFFFFF`.

### 2.4 Form Elemanları
- **Input/Textarea:** yükseklik 48px (textarea min 120px), radius `--radius-md`, bg `surface-card`, border `hairline`, placeholder `foreground-faint`. Focus: border → `accent`, `0 0 0 3px accent-glow` ring, 150ms geçiş.
- **Select/Dropdown:** input ile birebir aynı, sağda chevron ikonu (rotate 180° açıkken, 200ms).
- **Hata durumu:** border → `danger`, alanın altında 13px `danger` renkli mesaj, `shake` animasyonu (x: -4/4/-2/0px, 300ms, yalnızca bir kez).
- **Başarı durumu (form submit):** buton içi spinner → checkmark morph (200ms), 2sn sonra "Mesajınız alındı" toast (üstten slide-in, `bg-elevated` + `success` border-left 3px).

### 2.5 Navbar (Global — tüm sayfalarda ortak)
- **Yükseklik:** 72px desktop / 64px mobil, `position: sticky; top: 0`.
- **Zemin durumu 1 (sayfa en üstü):** tamamen şeffaf, hero'nun üzerinde "yüzer" halde.
- **Zemin durumu 2 (scroll > 8px):** `bg-base` %70 opaklık + `backdrop-filter: blur(12px)` + alt kenarlıkta `border-hairline` belirir — geçiş 250ms `ease-standard`.
- **Yapı:** Logo (sol, 28px yükseklik) — Nav linkleri (orta veya logodan sonra sola yakın: Hizmetler▾ · Cafe QR Menü · Projeler · Blog · Hakkımızda · İletişim) — CTA butonu (sağ, "Teklif Alın").
- **Hizmetler dropdown:** hover/click ile açılan panel, `bg-elevated` + `border-hairline` + `--radius-xl`, açılış `opacity 0→1, y:-8px→0, duration 200ms`; içinde 3 satır (ikon 20px + başlık + 1 satır açıklama), her satır hover'da `surface-card-hover` bg.
- **Aktif sayfa göstergesi:** nav linkinin altında 2px `accent` çizgi, `layout` animasyonuyla (Framer Motion `layoutId`) bir linkten diğerine kayarak geçer — sayfa değiştikçe "akan" bir çizgi hissi.
- **Mobil:** hamburger ikon (24px, 2 çizgi → X'e morph 200ms) sağda; tıklanınca tam ekran drawer (`bg-deep`, üstten aşağı slide + fade, 300ms `ease-premium`), linkler 60ms stagger ile sırayla belirir, en altta CTA butonu tam genişlik.

### 2.6 Footer (Global)
- **Zemin:** `bg-deep` (sayfa zemininden bir ton koyu — kapanış hissi).
- **Üst kenar:** 1px yüksekliğinde yatay gradient çizgi (`transparent → accent/40% → transparent`) — Vercel'in imza "hairline glow" dokunuşu.
- **Yapı:** 128px üst padding, 4 kolon grid (Marka+sosyal / Hizmetler / Kurumsal / İletişim), 64px alt padding + bottom bar (copyright + legal linkler, `border-hairline` üst çizgi ile ayrılır).
- **Mobil:** 4 kolon → tek kolon, her grup arası 40px, sosyal ikonlar bottom bar'ın üstünde ortalanmış satır.
- **Link hover:** text `foreground-muted` → `foreground`, 150ms, alt çizgi yok (temiz liste görünümü).

### 2.7 Accordion (SSS)
Kapalı satır: 64px yükseklik, sol tarafta soru (H4), sağda `+` ikonu. Açılışta: ikon 45° rotate → `×`, panel `height: auto` GSAP ile ölçülüp animasyonlu açılır (`duration 300ms ease-in-out`), içerik `opacity 0→1` 100ms gecikmeli. Aktif satırın sol kenarında 2px `accent` çizgi belirir.

### 2.8 Lightbox / Modal (Proje galerisi, demo)
Backdrop `rgba(2,2,3,0.8)` + `blur(8px)`, içerik `scale(0.95)→1 + opacity 0→1`, `duration 250ms ease-premium`. Kapanış tersine ama %30 daha hızlı (`exit-faster-than-enter` prensibi — çıkış her zaman girişten hızlı olmalı, aksi halde "yapışkan" hisseder).

---

## 3. Global Layout Notu

Her sayfa şu iskelete oturur: `Navbar (sticky)` → `<main>` (sayfa-özel section'lar, Bölüm 4) → `Footer`. `<main>` içindeki her section, üstünde tanımlanan 128/96/72px dikey ritme ve 12 kolon grid'e sadık kalır. Art arda gelen iki section aynı arka plan tonunu (`bg-base`) kullanmaz — bir "elevated", bir "base" şeklinde hafif alternatif ile (zebra değil, ton farkı) derinlik hissi korunur.

---

## 4. Ekran Spesifikasyonları (Sayfa Sayfa)

### 4.1 Ana Sayfa (`/`)

**Grid:** 12 kolon, container 1200px (hero full-bleed arka plan, içerik 1200px'e sabit)
**Zemin sırası:** Hero `bg-deep` → ServiceGrid `bg-base` → ProductBand `bg-elevated` → Differentiator `bg-base` → FeaturedProjects `bg-elevated` → Stats `bg-deep` → Testimonial `bg-base` → CTA Band `bg-deep`

| # | Section | Yükseklik | Layout | Tipografi | Renk/BG | Hover/Anim | Responsive |
|---|---|---|---|---|---|---|---|
| 1 | **Hero** | `min-height: 92vh` (max 880px), üstte navbar payı | Tek kolon, ortalanmış, max-width 780px metin bloğu | Eyebrow (mono, `accent`) "YAZILIM · WEB · AI OTOMASYON" → Display XL H1 → Body-L alt metin → 2 CTA yan yana | `bg-deep` + arka planda merkezde 600px çapında, blur 120px, `accent-glow` renginde statik "ambient blob" (yavaş 8-12sn'lik `translate` oscillation, opacity 0.08-0.12) | H1 kelime kelime `y:20→0 + opacity` stagger 40ms (ease-premium, 700ms), CTA'lar 200ms gecikmeyle gelir; birincil CTA magnetic hover | Mobil: min-height `80vh`, H1 40px, CTA'lar dikey stack tam genişlik, blob görseli %50 opaklığa düşer (performans) |
| 2 | **ServiceCardGrid** | içerik-bağımlı (~460px) | 3 kolon (12/3-3-3-3 değil, 12/4-4-4), gutter 24px | Eyebrow "HİZMETLER" + H2 "Ne yapıyoruz" üstte ortalı, kartlar altında | `bg-base`, kartlar `surface-card` | Scroll-reveal stagger 80ms/kart; hover: Bölüm 2.2 servis kartı davranışı | Mobil: tek kolon, kartlar arası 16px, scroll-reveal stagger 60ms |
| 3 | **ProductHighlightBand (Cafe QR)** | ~520px | Asimetrik 12 kolon: sol 5 kolon metin, sağ 7 kolon ürün mockup görseli | Eyebrow (mono, `accent-product` rengi) "ÜRÜN" + H2 + Body + CTA ("Cafe QR Menüyü Keşfedin") | `bg-elevated`, ince `accent-product` renkli 1px sol-kenar çizgi bandın tamamını çevreleyen bir "kart" hissi verir (radius-xl, padding 64px) | Mockup görseli parallax: scroll ile `y` ekseninde %10 ters hareket (scrub); CTA butonu bu bantta `accent-product` renginde — sitede bu rengin göründüğü tek yer | Mobil: dikey stack (görsel üstte, metin altta), parallax kapanır |
| 4 | **DifferentiatorGrid ("Neden Biz")** | ~400px | 4 kolon (12/3-3-3-3), ikon+başlık+1 satır açıklama | H2 üstte ortalı + 4 mini kart | `bg-base`, kartlar border yok, sadece ikon+metin (kartsız, "flat" liste hissi — görsel çeşitlilik için bir önceki section'dan farklılaştırılır) | Scroll-reveal stagger 60ms, ikon hover'da `accent` rengine geçiş 150ms | Mobil: 2×2 grid, sonra 1 kolon <400px |
| 5 | **FeaturedProjects** | ~560px | H2 + "Tümünü Gör" linki sağda aynı satırda, altında 3 kolon proje kartı | Eyebrow "PROJELER" | `bg-elevated` | Proje kartı hover (Bölüm 2.2); scroll-reveal stagger 100ms | Mobil: yatay scroll-snap carousel (tek kolon grid yerine), kart genişliği %85 viewport |
| 6 | **StatsCounterBar** | ~240px | 4 kolon, ortalanmış rakamlar, ince dikey `border-hairline` ayraçlarla | Mono Stat (48px) + altında Body-S label | `bg-deep`, arka planda çok hafif `accent-glow` radial (merkez, %8 opacity) | Sayaç animasyonu (Bölüm 1.5), viewport'a girince tetiklenir | Mobil: 2×2 grid, rakam 32px'e düşer |
| 7 | **TestimonialSlider** | ~420px | Tek kart ortada (max-width 720px), altında dot pagination | H3 alıntı (24px, italic olmayan ama `foreground-secondary` tonunda) + isim/rol mono | `bg-base` | Crossfade geçiş (opacity 400ms), otomatik 6sn interval, hover'da durur (pause on hover) | Mobil: kart tam genişlik, swipe gesture destekli |
| 8 | **BlogPreviewRow** *(Faz 2)* | ~480px | 3 kolon blog kartı | H2 "Son Yazılar" + link | `bg-elevated` | Blog kartı hover (Bölüm 2.2) | Mobil: yatay scroll-snap |
| 9 | **CTABand (kapanış)** | ~360px | Tek kolon ortalanmış, max-width 640px | H2 (40px) "Projenizi konuşalım" + Body + tek büyük CTA | `bg-deep`, arka planda hero'daki gibi ama daha küçük (400px) tek ambient blob | Bant viewport'a girince blob'un opaklığı 0→0.1 fade | Mobil: padding 64px'e iner, CTA tam genişlik |

**Premium his notu:** Ana sayfanın en kritik anı Hero→ServiceGrid geçişi — `bg-deep`'ten `bg-base`'e geçerken sert bir çizgi yerine 80px'lik bir gradient-fade kullanılır, böylece section'lar arası sınır "kesilmiş" değil "eritilmiş" hisseder (Apple'ın ürün sayfalarındaki section geçiş tekniği).

---

### 4.2 Hizmetler — Hub (`/hizmetler`)

| # | Section | Yükseklik | Not |
|---|---|---|---|
| 1 | Page Header | ~320px | Sol hizalı (ortalanmış değil — alt sayfalarda ortalama yerine sol blok kullanımı "biz artık detaya iniyoruz" sinyali verir), Display L H1 + Body-L, max-width 620px |
| 2 | ServiceCardGrid (detaylı varyant) | ~700px | 3 kolon ama kartlar Ana Sayfa'dakinden daha büyük: 40px padding, kapsam maddeleri (checkmark liste, 3 madde), "İncele →" link altta |
| 3 | ProcessSteps | ~480px | Yatay 4 adım (Keşif → Tasarım → Geliştirme → Teslim), aralarında ince yatay çizgi + adım numarası dairesi (40px, `border-hairline`, aktif hover'da `accent` dolgu) |
| 4 | CTABand | ~320px | Bölüm 4.1 kapanış bandıyla birebir aynı komponent (tutarlılık) |

**Grid:** ServiceCardGrid burada 12/4-4-4 yerine kartlar arası 32px gutter ile biraz daha nefesli.

---

### 4.3 Hizmet Detay Şablonu (`/hizmetler/[web-tasarim|yazilim-gelistirme|ai-otomasyon]`)

| # | Section | Yükseklik | Not |
|---|---|---|---|
| 1 | ServiceHero | ~560px | Sol 7 kolon metin (eyebrow + H1 + lead + CTA), sağ 5 kolon soyut görsel/illüstrasyon (gradient mesh veya ürün ekran görüntüsü, `radius-xl` çerçeve + `border-hairline`) |
| 2 | ScopeList | ~400px | 2 kolon: solda "Kapsam" başlığı + Body, sağda checkmark liste (icon `success` renginde, her satır 56px yükseklik, aralarında `border-hairline` divider) |
| 3 | TechStackBadges | ~160px | Yatay wrap badge listesi (Bölüm 2.3 badge stili), ortalanmış, hover'da badge hafif `y:-2px` |
| 4 | ProcessSteps | ~480px | Hub sayfasıyla aynı komponent, bu sayfaya özel adım metinleriyle |
| 5 | RelatedProjects | ~480px | 3 kart, bu hizmet kategorisine filtrelenmiş projeler |
| 6 | MiniFAQ | ~360px | 4-5 accordion satırı, max-width 720px ortalanmış |
| 7 | CTABand | ~320px | Standart |

**AI Otomasyon varyasyonu:** ServiceHero'daki sağ görsel alanında statik illüstrasyon yerine basit bir "akış diyagramı" animasyonu (3-4 nokta arasında sırayla yanıp sönen bağlantı çizgisi, 2sn loop, `accent` renginde `stroke-dashoffset` animasyonu) — bu hizmetin "otomasyon" doğasını somutlaştıran tek özel dokunuş.

---

### 4.4 Cafe QR Menü — Ürün Landing (`/cafe-qr-menu`)

Bu sayfa site genelinden **kasıtlı olarak görsel ton farkı** taşır: `accent-product` (amber) rengi burada CTA'larda ve vurgularda `accent`in yerini alır; genel zemin (`bg-deep/base/elevated`) aynı kalır — marka bütünlüğü korunurken "ürün modu" hissettirilir.

| # | Section | Yükseklik | Layout | Not |
|---|---|---|---|---|
| 1 | ProductHero | ~640px | Sol 6 kolon metin, sağ 6 kolon telefon mockup'ı (QR kod tarama → menü açılışı gösteren statik/loop mikro-animasyon) | Eyebrow "CAFE & RESTORAN İÇİN" (`accent-product`), Display L H1, CTA "Hemen Başlayın" (amber solid) + Ghost "Fiyatları Gör" |
| 2 | HowItWorksSteps | ~440px | 3 kolon, numaralı (01/02/03 mono büyük rakam, `foreground-faint`), ikon+başlık+açıklama | Scroll-reveal stagger, bağlayıcı ince yatay çizgi kartlar arasında (%100 genişlik, `border-hairline`, adımlar açıldıkça `accent-product` ile dolan bir "progress" çizgisi — scroll-linked scrub) |
| 3 | FeatureSummaryGrid | ~480px | 6 kart, 3x2 grid (12/4-4-4) | Özellik kartı stili (Bölüm 2.2), "Tüm özellikler →" linki altta |
| 4 | PricingTeaser | ~360px | 3 mini pricing kartı (tam pricing tablosuna link) | Ortadaki (Standart) kart `accent-product` border ile öne çıkar |
| 5 | TestimonialSlider (variant cafe) | ~400px | Aynı komponent, cafe sahiplerinden yorumlar, avatar yanında işletme adı mono etiket | — |
| 6 | MiniFAQ | ~360px | Standart | — |
| 7 | CTABand (variant urgent) | ~360px | Standart CTABand ama arka planda amber glow, buton daha büyük (56px yükseklik) | "Hemen Başlayın, 5 dakikada kurulum" gibi aciliyet vurgulu metin |

### 4.5 Cafe QR — Özellikler (`/cafe-qr-menu/ozellikler`)
- **FeatureDetailGrid:** 2 kolon zigzag düzen (görsel-metin, metin-görsel alternasyonu), her blok ~480px, aralarında 96px boşluk, görsel `radius-xl` + `border-hairline` çerçeveli ekran görüntüsü.
- **ScreenshotGallery:** yatay scroll-snap galeri, her görsel 720px genişlik, `radius-lg`, hover'da hafif `scale(1.02)`.

### 4.6 Cafe QR — Fiyatlandırma (`/cafe-qr-menu/fiyatlandirma`)
| # | Section | Not |
|---|---|---|
| 1 | PricingCardGroup | 3 kart yan yana (12/4-4-4), ortadaki "Popüler" `scale(1.02)` + `accent-product` border 1.5px + glow, üstte pill rozet "En Popüler" (dolgu amber). Her kartta: plan adı (H3) → fiyat (mono, 40px, `/ay` küçük ek) → CTA (tam genişlik) → checkmark özellik listesi (8-10 madde, `border-hairline` divider'lı satırlar) |
| 2 | PricingComparisonTable | Genişlik 100%, sticky ilk kolon (mobilde yatay scroll), satır hover'da `surface-card-hover` |
| 3 | MiniFAQ | Standart, fiyatlandırmaya özel sorular ("kurulum ücreti var mı" vb.) |
| 4 | CTABand | Standart |

**Toggle:** Aylık/Yıllık switch (pricing card group üstünde, pill toggle, aktif taraf `accent-product` dolgu, geçiş `x` transform 200ms) — yıllık seçilince fiyat sayısı `FlipCounter` tarzı kısa animasyonla değişir (150ms, eski değer yukarı çıkar-siline, yeni değer aşağıdan gelir).

### 4.7 Cafe QR — Demo (`/cafe-qr-menu/demo`)
- **InteractiveDemoFrame:** Sayfanın odak noktası — ortada büyük telefon çerçevesi (mockup, `radius-xl`, gerçekçi gölge/glow), yanında (sağda, masaüstünde) adım göstergeleri. Kullanıcı adımlar arasında tıklayınca telefon ekranı içeriği `crossfade + slight scale` ile değişir (300ms). Arka planda çok hafif `accent-product` ambient glow.
- **DemoRequestForm:** Demo frame'in altında, kısa form (yalnızca 3 alan: işletme adı, telefon, e-posta) — bu persona sabırsız olduğu için form kasıtlı olarak site genelindeki İletişim formundan daha kısa.

---

### 4.8 Projeler — Galeri (`/projeler`)

| # | Section | Not |
|---|---|---|
| 1 | PageHeader | Sol hizalı, H1 + Body, ~280px |
| 2 | ProjectFilterBar | Yatay pill buton grubu (Tümü / Web / Yazılım / AI Otomasyon / Cafe QR), aktif filtre `accent` dolgu, `layoutId` ile filtreler arası geçen bir "kayan pill" arka planı | sticky değil, header altında sabit konum |
| 3 | ProjectGrid | 12/4-4-4, kartlar arası 24px | Filtre değiştiğinde: kalan kartlar `FLIP` tekniğiyle yeni pozisyonlarına akıcı geçer (Framer Motion `layout` prop, 400ms `ease-premium`), çıkan kartlar `scale(0.9)+opacity 0` ile 200ms'de kaybolur, giren kartlar aynı şekilde belirir |

**Mobil:** Filtre bar yatay scroll (chip'ler), grid tek kolon.

### 4.9 Proje Detay (`/projeler/[slug]`)

| # | Section | Yükseklik | Not |
|---|---|---|---|
| 1 | ProjectHero | ~520px | Full-bleed kapak görseli (`radius-xl`, üstte kategori badge + H1 overlay alt kısımda gradient-scrim üzerinde) |
| 2 | ProblemSolutionBlock | ~420px | 2 kolon (Problem / Çözüm), aralarında dikey `border-hairline` |
| 3 | ProjectGallery | değişken | Masonry veya 2 kolon görsel grid, tıklanınca lightbox (Bölüm 2.8) |
| 4 | ResultMetricsRow | ~200px | StatsCounterBar ile aynı komponent, bu projeye özel sonuç rakamlarıyla |
| 5 | TechStackBadges | ~120px | Standart |
| 6 | RelatedProjects | ~440px | 3 kart |
| 7 | CTABand | Standart | — |

---

### 4.10 Blog — Liste (`/blog`)

| # | Section | Not |
|---|---|---|
| 1 | PageHeader + BlogCategoryFilter | Filtre chip'leri (Projeler galerisiyle aynı komponent mantığı) |
| 2 | FeaturedPostCard | Tek büyük kart, full-width, 2 kolon iç düzen (görsel sol %55 / metin sağ %45), diğer kartlardan görsel olarak büyütülmüş (öne çıkan yazı hissi) |
| 3 | BlogPostGrid | 12/4-4-4, standart blog kartı (Bölüm 2.2) |
| 4 | Pagination | Sayfa numaraları yerine "Daha fazla yükle" butonu (sonsuz kaydırma yerine kontrollü, SEO-dostu — her tıklamada URL query güncellenir) |

### 4.11 Blog Detay (`/blog/[slug]`)

| # | Section | Not |
|---|---|---|
| 1 | ArticleHeader | Kategori badge + H1 (Display L değil, biraz daha küçük: 44px) + meta satır (yazar avatarı 32px, tarih, okuma süresi — mono) + kapak görseli altında |
| 2 | ArticleBody | max-width 680px (okunabilirlik), tipografi: body 18px/1.75 (blog içeriği site geneli 16px'ten biraz büyük — okuma konforu), `H2/H3` makale içi alt başlıklar sol kenarında scroll ile aktifleşen bir mini table-of-contents (sticky, sağ margin'de, yalnızca `≥1280px`) |
| 3 | ShareButtons | ArticleBody solunda sticky dikey ikon grubu (yalnızca desktop) |
| 4 | RelatedPosts | 3 kart |
| 5 | CTABand | Makalenin konusuna göre dinamik CTA metni (ör. AI yazısı sonunda "AI Otomasyon hizmetimizi inceleyin") |

---

### 4.12 Hakkımızda (`/hakkimizda`)

| # | Section | Yükseklik | Not |
|---|---|---|---|
| 1 | StorySection | ~480px | Tek kolon, max-width 720px, büyük lead paragraf (24px, `foreground-secondary`) — "manifesto" hissi |
| 2 | ValuesGrid | ~400px | 3-4 kolon, DifferentiatorGrid ile aynı flat-list stili |
| 3 | TeamGrid *(opsiyonel)* | ~440px | 4 kolon kart, fotoğraf `radius-lg` + grayscale filtre (hover'da renkli, `filter: grayscale(1)→grayscale(0)` 300ms — zarif bir dokunuş) |
| 4 | CTABand | Standart | — |

### 4.13 SSS (`/sss`)
- Tek kolon, max-width 760px ortalanmış, kategori sekmeleri üstte (pill tab, aktif `accent` alt çizgi kayan animasyonu — navbar'daki aktif gösterge ile aynı `layoutId` tekniği), altında accordion listesi (Bölüm 2.7).

### 4.14 İletişim (`/iletisim`)

| # | Section | Not |
|---|---|---|
| 1 | Split Layout | Sol 5 kolon: ContactInfoCard (adres/telefon/email, her biri ikon+metin satırı) + sosyal ikonlar + çalışma saatleri. Sağ 7 kolon: ContactForm (`surface-card` panel içinde, `radius-xl`, 40px padding) |
| 2 | MapEmbed *(varsa ofis)* | Formun altında tam genişlik, `radius-lg`, harita koyu tema stilinde (custom map style — site temasıyla uyumlu, varsayılan Google Maps açık tema kullanılmaz) |

Form alanları: Ad Soyad / E-posta / Telefon / Hizmet İlgisi (select) / Mesaj (textarea) / Submit — her alan Bölüm 2.4 spesifikasyonuna uyar, submit sonrası buton içi başarı morph'u.

### 4.15 Legal Sayfalar (`/gizlilik-politikasi` vb.)
Tek kolon, max-width 720px, `body` tipografisi, H2/H3 hiyerarşisiyle düz metin içerik. Görsel süsleme yok — bu sayfalarda "premium" his sadeliktir, dikkat dağıtıcı hiçbir bileşen kullanılmaz.

### 4.16 404 (`not-found.tsx`)
Tek ekran, ortalanmış, büyük mono "404" (96px, `foreground-faint`), altında kısa mesaj + "Ana Sayfaya Dön" CTA. Arka planda Hero'daki ambient blob'un çok soluk (opacity 0.04) bir versiyonu — site kimliğinden kopmaz ama "kayboldunuz" hissini de taşır.

---

## 5. Responsive Davranış — Site Geneli Özet Tablo

| Kural | Mobil (`<768px`) | Tablet (`768-1023px`) | Desktop (`≥1024px`) |
|---|---|---|---|
| Grid kolon sayısı (kart section'ları) | 1 | 2 | 3-4 (section'a göre) |
| Yatay galeri/carousel kullanımı | Scroll-snap (Featured Projects, Blog Preview, Screenshot Gallery) | Grid'e döner | Tam grid |
| Navbar | Hamburger + full-screen drawer | Hamburger (linkler sığmazsa) | Tam yatay menü |
| Section dikey padding | 64-72px | 96px | 128px |
| Hero H1 | 36-40px | 48px | 56-76px (sayfaya göre) |
| Parallax/scrub efektler | Kapalı (performans) | Kısmi | Tam aktif |
| Sticky TOC / ShareButtons (blog) | Kapalı | Kapalı | Açık (`≥1280px`) |
| Touch hedef boyutu | Min 44×44px her yerde | — | — |
| Magnetic hover CTA | Kapalı (dokunmatik cihazda anlamsız) | Kapalı | Açık |

---

## 6. "Premium His" Kontrol Listesi

Her ekran teslim edilmeden önce şu 10 madde doğrulanır (Linear/Stripe/Apple/Vercel/Framer sentezinden damıtılmıştır):

1. Sayfada tek bir H1 var mı, hiyerarşi net mi?
2. Accent rengi toplam yüzeyin ~%10'unu aşıyor mu? (Aşıyorsa geri al.)
3. Her section aynı dikey ritme (128/96/72px) oturuyor mu?
4. İki bitişik section aynı arka plan tonunu mu kullanıyor? (Kullanıyorsa bir tanesini `elevated`'a çek.)
5. Kart hover'ları `transform`/`opacity` dışında bir şey animasyonlu mu? (Öyleyse performans riski — düzelt.)
6. Herhangi bir buton/link `cursor: pointer` ve görünür `focus` ring'e sahip mi?
7. Koyu zeminde saf `#000000` kullanılmış mı? (Kullanılmışsa `#020203`'e çevir.)
8. Scroll-reveal'lar `prefers-reduced-motion` durumunda doğru davranıyor mu?
9. Mobilde herhangi bir yatay taşma (horizontal scroll) var mı?
10. Bir section'ın "neden burada olduğu" ve "sonraki adımın ne olduğu" 3 saniyede anlaşılıyor mu?

Bu liste her yeni section eklendiğinde tekrar çalıştırılmalı — bir tasarım sisteminin "premium" kalmasının tek yolu disiplinin her ekranda aynı şekilde uygulanmasıdır, istisna yoktur.
