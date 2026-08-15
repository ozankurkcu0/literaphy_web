# Admin Paneli Kurulumu

`/admin` altında, sipariş/hizmet kayıtlarını yöneten bir panel var. Kayıtlar
yeni bir veritabanı yerine mevcut **"Sipariş Kayıtları" Google Sheet'ine**
okunup yazılıyor; admin girişleri ise repo public olduğu için düz metin
saklanmıyor, bcrypt ile hash'leniyor.

Aşağıdaki iki kurulum birbirinden bağımsız — istediğiniz sırayla
yapabilirsiniz, panel her ikisi olmadan da açılır ama sipariş listesi/girişi
çalışmaz.

## 1) Admin hesabı oluşturma

```bash
npm run admin:create-account
```

Telefon numarası ve şifre sorar (isteğe bağlı bir isim de sorar), şifreyi
bcrypt ile hash'leyip `data/admins.local.json` dosyasına yazar. Bu dosya
`.gitignore`'da — asla commit'lenmez, sadece yerel makinenizde durur.

Birden fazla admin eklemek için betiği tekrar çalıştırın; aynı telefon
numarasıyla tekrar çalıştırırsanız şifre günceller.

`/admin` adresine gidip bu telefon/şifre ile giriş yapabilirsiniz.

### Production'a (Vercel) geçerken

Vercel'in dosya sistemi her deploy'da sıfırlanır, yani `data/admins.local.json`
canlıda işe yaramaz. Betiğin son satırında yazdırdığı JSON'u kopyalayıp
Vercel projenizin **Environment Variables** kısmına `ADMIN_ACCOUNTS_JSON`
adıyla yapıştırın:

```
[{"phone":"905xxxxxxxxx","passwordHash":"$2a$10$...","name":"Ozan"}]
```

Bu değişken varsa kod `data/admins.local.json`'u hiç okumaz, doğrudan bunu
kullanır. Ayrıca `ADMIN_SESSION_SECRET` değişkenini de Vercel'e eklemeyi
unutmayın (aşağıda).

## 2) Google Sheets bağlantısı

Panel, ekran görüntüsünde gösterdiğiniz sheet'i ("Sipariş Kayıtları")
gerçek veri kaynağı olarak kullanacak şekilde tasarlandı. Sheet'in sütun
sırası sabit: **Sipariş No · İsim · Soyisim · Hizmet Türü · Başlama Tarihi ·
Hesap Kesim Tarihi · Telefon · E-posta · Ücret · Para Birimi · Toplam
Taksit · Ödenen Taksit**. Mevcut sheet'te olmayan sütunları panel ilk açılışta otomatik
ekler, mevcut sütunlara dokunmaz. Panel arayüzünde (form ve tablo) alanlar
farklı sırada gösterilir (Telefon/E-posta en başta) ama sheet'teki fiziksel
sütun sırası kayıtları bozmamak için hep aynı kalır.

Toplam/Ödenen Taksit sütunları, yıllık/taksitli planlar için — yeni sipariş
eklerken "Yıllık plan (taksitli ödeme)" kutusunu işaretleyip toplam ve
ödenen taksit sayısını girersiniz, panel kalan taksidi otomatik hesaplar.
Boş bırakılırsa tek seferlik/taksitsiz sipariş demektir.

### a) Servis hesabı oluşturma (Google Cloud Console)

1. [console.cloud.google.com](https://console.cloud.google.com) → yeni proje
   oluşturun (ör. "literaphy-admin").
2. **APIs & Services → Library** → "Google Sheets API" arayıp **Enable**
   edin.
3. **APIs & Services → Credentials → Create Credentials → Service account**
   ile bir servis hesabı oluşturun (rol vermenize gerek yok, sheet paylaşımı
   yetkiyi verecek).
4. Oluşturduğunuz servis hesabına girin → **Keys → Add Key → Create new key
   → JSON** — bir JSON dosyası iner. İçinde `client_email` ve `private_key`
   alanları var, bunlar aşağıda lazım olacak.

### b) Sheet'i servis hesabıyla paylaşma

"Sipariş Kayıtları" sheet'ini açın → **Paylaş** → indirdiğiniz JSON'daki
`client_email` değerini (ör. `literaphy-admin@proje-adi.iam.gserviceaccount.com`)
**Düzenleyen** yetkisiyle ekleyin. Servis hesabı bir Google hesabı gibi
davranır, e-posta bildirimi almaz ama erişimi olur.

### c) Env değişkenlerini doldurma

`.env.local` (yerelde) veya Vercel Environment Variables (production'da):

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=literaphy-admin@proje-adi.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=168fGXezML8X4eXGZcEc8W4P-BXGo5SY-JiXYR7xV2hY
GOOGLE_SHEET_NAME=Sayfa1
```

- `GOOGLE_SHEET_ID`, sheet URL'sindeki `/d/` ile `/edit` arasındaki kısım.
- `GOOGLE_PRIVATE_KEY`'i JSON dosyasından olduğu gibi (tırnak içinde,
  `\n`'ler dahil) kopyalayın — kod bunları otomatik gerçek satır sonuna
  çevirir.
- `GOOGLE_SHEET_NAME`, sheet'in alt sekme adı (Türkçe arayüzde varsayılan
  "Sayfa1"). Farklıysa değiştirin.

## 3) Denemek

```bash
npm run dev
```

`http://localhost:3000/admin` → oluşturduğunuz telefon/şifre ile giriş →
"Yeni Sipariş" ile bir kayıt oluşturun, sheet'e düştüğünü kontrol edin.

## 4) Sipariş numarası

Her yeni sipariş için 6 haneli (100000–999999 arası) rastgele bir numara
üretilir ve mevcut kayıtlarla çakışmayana kadar tekrar denenir — elle girmenize
gerek yok, sheet'teki A sütununa otomatik yazılır.

## 5) Giderler (hosting, domain vb.)

Her siparişin ayrıntı ekranında (listede bir isme veya ⓘ ikonuna tıklayın)
o müşteriyle ilgili giderleri (hosting, domain, SMS gateway vb.) ekleyip
takip edebilirsiniz. Bunlar için "Sipariş Kayıtları" sheet'inde ayrıca
**"Giderler"** adında bir sekme kullanılıyor — yoksa panel ilk gider
eklendiğinde otomatik oluşturur, elle hazırlamanıza gerek yok.

Her gidere bir tekrar tipi seçilir: **Tek seferlik**, **Aylık** (sadece
ayın günü sorulur, yıl gerekmez) veya **Yıllık** (tam tarih). Yaklaşan/geçmiş
ödemeler, Siparişler sayfasının üstündeki özette gelir hatırlatmasının
altında ayrı bir "Gider" bölümünde listelenir.

## 6) Gelen Kutusu (Gmail)

"Gelen Kutusu" sekmesi, kutunuza (`GMAIL_IMAP_USER`) IMAP ile bağlanıp son
30 mail arasından İletişim/N8N/QR Menü demo formlarından gelenleri tanır
(bkz. src/lib/email.ts'teki ortak bildirim şablonu) ve içeriğini ("Ad
Soyad", "Telefon" vb. alanlar) ayrıştırıp "Bekleyen Müşteriler" listesinde
gösterir — ham mail listesi yerine düzenli kart görünümü. Google Cloud
projesi/OAuth gerekmez.

Panelden bir talebi **"Cevap verildi"** olarak işaretleyebilirsiniz — bu,
standart IMAP `\Answered` bayrağını açar/kapatır, yani Gmail'in kendisinde
de (herhangi bir mail istemcisinde) görünür. Mail gönderme/silme yapılmaz,
tek yazma işlemi bu bayrak.

### Uygulama şifresi oluşturma

1. `myaccount.google.com/security` → **2 Adımlı Doğrulama**'nın açık
   olduğundan emin olun (kapalıysa önce onu açmanız gerekir).
2. Aynı sayfada **Uygulama Şifreleri** (App Passwords) → yeni bir şifre
   oluşturun (uygulama adı olarak "Literaphy Admin" gibi bir şey yazabilirsiniz).
   Google 16 haneli, boşluksuz bir kod verir (ör. `abcdabcdabcdabcd`) — bu
   normal Gmail şifreniz **değil**, sadece bu entegrasyon için.
3. `.env.local`'e (veya Vercel'e) ekleyin:

```
GMAIL_IMAP_USER=literaphy@gmail.com
GMAIL_IMAP_APP_PASSWORD=abcdabcdabcdabcd
```

4. `npm run dev` → `/admin/gelen-kutusu` → mailler gelmeye başlar. Sağ
   üstteki "Yenile" ile elle tazeleyebilirsiniz.

Not: Google hesabında 2 Adımlı Doğrulama olmayan bir işletme/aile hesabı
kullanıyorsanız (Workspace) yönetici "Daha az güvenli uygulama erişimi"ni
ayrıca açmanız gerekebilir — Google bunu önermiyor, mümkünse 2FA + Uygulama
Şifresi yöntemini kullanın.

## 7) Aktivite log'u

"Aktivite" sekmesi, panelde kim ne zaman ne değiştirdi/sildiğini gösterir
(sipariş/gider/hesap oluşturma-güncelleme-silme, gelen kutusu işaretleme).
Bunun için sheet'te ayrıca **"Aktivite Log"** sekmesi kullanılıyor — yoksa
ilk işlemde otomatik oluşturulur, elle hazırlamanıza gerek yok. Log yazımı
başarısız olsa bile (ör. geçici bir bağlantı sorunu) asıl işlemi (sipariş
kaydetme vb.) etkilemez, sadece sunucu logunda görünür.

## 8) Aylık gelir hedefi, Takvim, Dışa aktarma

- **Analiz** sayfasındaki "Bu ayın hedefi" kartı ayrı bir **"Hedefler"**
  sekmesinde tutuluyor (otomatik oluşur). Her ay+para birimi için tek
  satır — aynı ayı tekrar kaydederseniz üzerine yazılır.
- **Takvim** sayfası ekstra bir sheet kullanmaz, zaten yüklü sipariş/gider
  verisinden hesaplar.
- **Dışa Aktar** (Siparişler sayfasında) CSV'yi tamamen tarayıcıda üretir,
  sunucuya bir şey göndermez — noktalı virgül ayraçlı ve UTF-8 BOM'lu,
  Türkçe Excel'de doğrudan düzgün açılır.
