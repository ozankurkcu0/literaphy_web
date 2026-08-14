# Blog İçerik Planı — QR Menü & N8N Otomasyonları Kümeleri

`docs/PLANNING.md` §"Blog topic cluster modeli"nde tarif edilen yapıyı takip eder:
her ürün/hizmet için bir "pillar" sayfa (zaten var) + o pillar'a iç link veren
4-6 destekleyici blog yazısı. Şu an (2026-08) `src/content/blog.ts` içinde her
kategoriden yalnızca 1 genel-giriş yazısı var — bu plan, iki flagship ürün
(QR Menü Sistemleri, N8N Otomasyonları) etrafında **ticari niyetli**
long-tail konularla kümeyi doldurmayı hedefliyor.

**Not:** Aşağıdaki anahtar kelimeler gerçek arama hacmi verisiyle
doğrulanmadı (hipotez listesi) — DataForSEO/Google Keyword Planner ile
teyit edilmesi önerilir (`seo-dataforseo` skill'i kullanılabilir).

---

## Küme 1 — QR Menü Sistemleri

Pillar: `/qr-menu-sistemleri` · Mevcut destekleyici yazı: "Restoranlar İçin
Dijital Menüye Geçiş: Nelere Dikkat Edilmeli?"

| # | Başlık | Hedef anahtar kelime | Niyet | Hedef sayfa |
|---|---|---|---|---|
| 1 | QR Menü Sistemi Fiyatları 2026: Ne Kadar Tutar? | qr menü fiyatları | Ticari | `/qr-menu-sistemleri/fiyatlandirma` |
| 2 | QR Menüden Sipariş Almak: Panele mi Düşsün, Doğrudan POS'a mı? | qr menüden sipariş alma | Ticari | `/qr-menu-sistemleri/fiyatlandirma` (hesaplayıcıya bağlanır) |
| 3 | Restoranlar İçin En İyi QR Menü Sistemi Nasıl Seçilir? | en iyi qr menü sistemi | Ticari | `/qr-menu-sistemleri` |
| 4 | QR Menü ile Kağıt Menü Baskı Maliyetini Nasıl Sıfırlarsınız? | qr menü kağıt menü maliyeti | Bilgilendirici + Ticari | `/qr-menu-sistemleri/ozellikler` |
| 5 | Turistik Bölgede Cafe/Restoranlar İçin Çok Dilli Dijital Menü Neden Şart? | çok dilli dijital menü | Bilgilendirici | `/qr-menu-sistemleri/ozellikler` |
| 6 | Zincir Restoranlar İçin Çoklu Şube QR Menü Yönetimi Nasıl Yapılır? | çoklu şube qr menü | Ticari | `/qr-menu-sistemleri/fiyatlandirma` (Premium/Expert) |

**#2 önemli not:** Bu yazı, fiyatlandırma sayfasına yeni eklenen hesaplayıcıdaki
"sadece menü / panele düşsün / POS'a işlensin" ayrımını birebir açıklayan bir
içerik — hesaplayıcıyla en güçlü iç link fırsatı burada.

---

## Küme 2 — N8N Otomasyonları

Pillar: `/n8n-otomasyonlari` · Mevcut destekleyici yazılar: "İşletmeler İçin AI
Otomasyonuna Nereden Başlanır?", "WhatsApp Business API Nedir, Nasıl Kurulur?",
"API Entegrasyonu ile Manuel Veri Girişini Nasıl Bitirirsiniz?"

| # | Başlık | Hedef anahtar kelime | Niyet | Hedef sayfa |
|---|---|---|---|---|
| 1 | Restoranlar İçin WhatsApp Otomasyonu Nasıl Kurulur? (Adım Adım) | whatsapp otomasyonu nasıl kurulur | Ticari + İşlemsel | `/n8n-otomasyonlari/demo` |
| 2 | Sipariş, Fatura ve Stok Takibini Otomatikleştirmenin Maliyeti Ne Kadar Tutar? | iş süreci otomasyonu maliyeti | Ticari | `/n8n-otomasyonlari/fiyatlandirma` |
| 3 | N8N Nedir? KOBİ'ler İçin Zapier'e Kıyasla Avantajları | n8n nedir | Bilgilendirici | `/n8n-otomasyonlari` |
| 4 | CRM'siz İşletmeler İçin Basit Bir Lead Takip Otomasyonu Nasıl Kurulur? | crm olmadan lead takibi | İşlemsel | `/n8n-otomasyonlari/demo` |
| 5 | E-ticaret İşletmeleri İçin Otomatikleştirilmesi Gereken 10 Süreç | e-ticaret otomasyonu | Bilgilendirici | `/n8n-otomasyonlari/ozellikler` |
| 6 | Otomasyon Projesi İçin Ajans mı, İç Ekip mi? Maliyet ve Süre Karşılaştırması | otomasyon ajansı vs iç ekip | Ticari (karar aşaması) | `/n8n-otomasyonlari/fiyatlandirma` |

---

## Önerilen yazım sırası (ilk 3)

Ticari niyeti en yüksek ve mevcut sayfalara (fiyatlandırma + yeni
hesaplayıcı) en güçlü şekilde bağlanan üçü ilk sırada:

1. **QR Menü Sistemi Fiyatları 2026** — doğrudan dönüşüm amaçlı, "fiyat" arayan kullanıcıyı yakalar.
2. **QR Menüden Sipariş Almak: Panele mi, POS'a mı?** — hesaplayıcıya organik trafik çeker.
3. **Restoranlar İçin WhatsApp Otomasyonu Nasıl Kurulur?** — N8N tarafında en somut, en çok aranan işlemsel konu.

## Format notu

Her yazı `src/content/blog.ts`'deki mevcut `BlogPost` şemasına uyar
(`slug`, `title`, `excerpt`, `content: string[]`, `category`, `author`,
`authorRole`, `publishedAt`, `coverTone`, opsiyonel `image`/`imageWide`,
opsiyonel `relatedHref`). Yeni kategoriler gerekirse (`"QR Menü Sistemleri"`,
`"N8N Otomasyonları"` zaten mevcut kategori değerleriyle uyumlu).
