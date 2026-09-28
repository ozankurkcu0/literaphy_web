import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import {
  CALISMA_PROGRAM_SESSION_COOKIE_NAME,
  CALISMA_PROGRAM_SESSION_MAX_AGE_SECONDS,
  createCalismaProgramSessionToken,
  verifyCalismaProgramSessionToken,
} from "@/lib/calisma-program-auth";
import {
  YAGMUR_SESSION_COOKIE_NAME,
  YAGMUR_SESSION_MAX_AGE_SECONDS,
  createYagmurSessionToken,
  verifyYagmurSessionToken,
} from "@/lib/yagmur-auth";
import { MYPANEL_SESSION_COOKIE_NAME, verifyMypanelSessionToken } from "@/lib/mypanel-auth";

// Eskiden /calismaprogram ve /yagmurumprofugececek doğrudan site kökünde
// yaşıyordu; artık ikisi de ortak bir giriş kapısı olan /mypanel altına
// taşındı (bkz. /mypanel/(panel)/layout.tsx). Eski adresler kalıcı
// yönlendirmeyle (308) yeni konumuna gönderilir, ne alt yol ne de query
// string kaybolur.
const LEGACY_MYPANEL_PREFIXES = ["/calismaprogram", "/yagmurumprofugececek"];

// SEO denetiminde tespit edildi: Google'da "literaphy" aratıldığında hâlâ
// eski geçici Vercel adresi (literaphy-web.vercel.app) çıkıyor, çünkü o
// domain hâlâ canlı ve önceden canonical/sitemap onu gösteriyordu. Sadece
// canonical etiketini düzeltmek yavaş çalışır (Google'ın yeniden tarayıp
// sinyalleri birleştirmesini bekler) — kalıcı bir 308 yönlendirme çok daha
// güçlü ve hızlı bir sinyaldir, Google bu adresi index'ten düşürür.
//
// Sadece prod Vercel alias'ını hedefliyoruz (genel "*.vercel.app" değil) ki
// preview deploy önizlemeleri (literaphy-web-git-<branch>-*.vercel.app)
// çalışmaya devam etsin.
const OLD_PRODUCTION_HOST = "literaphy-web.vercel.app";
const CANONICAL_HOST = "www.literaphy.com";

// Eski adresi Search Console'da ayrı bir mülk olarak doğrulayıp Kaldırma
// aracıyla hızlıca (24-48 saat) arama sonuçlarından düşürebilmek için,
// Google'ın HTML dosyası doğrulama isteğini (google<hash>.html) redirect'ten
// muaf tutuyoruz — o dosya public/ altına konulup normal şekilde servis
// edilebilsin. Doğrulama tamamlandıktan sonra bu satır kalsa da zararı yok.
const GOOGLE_SITE_VERIFICATION_PATTERN = /^\/google[a-f0-9]+\.html$/;

/** /admin altındaki tüm sayfaları korur — geçerli oturum çerezi yoksa
 * /admin/login'e yönlendirir. API route'lar (/api/admin/*) kendi içinde
 * ayrıca oturum kontrolü yapar (bkz. src/app/api/admin). */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (
    host === OLD_PRODUCTION_HOST &&
    !GOOGLE_SITE_VERIFICATION_PATTERN.test(request.nextUrl.pathname)
  ) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;

  for (const prefix of LEGACY_MYPANEL_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const url = new URL(request.url);
      url.pathname = `/mypanel${pathname}`;
      return NextResponse.redirect(url, 308);
    }
  }

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // /mypanel: sitenin ana sayfaları dışındaki tüm kişisel/gizli araçlar
  // (calismaprogram, yagmurumprofugececek) için TEK giriş kapısı — bu
  // araçların artık kendi şifresi yok, hepsi sadece bu ortak şifreyi
  // paylaşıyor (bkz. mypanel-auth.ts).
  const isMypanelRoute = pathname === "/mypanel" || pathname.startsWith("/mypanel/");

  if (isMypanelRoute && pathname !== "/mypanel/giris") {
    const token = request.cookies.get(MYPANEL_SESSION_COOKIE_NAME)?.value;
    const authorized = await verifyMypanelSessionToken(token);

    if (!authorized) {
      const loginUrl = new URL("/mypanel/giris", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // /mypanel/calismaprogram: artık kendi şifresi yok, /mypanel'in ortak dış
  // kapısı yeterli. Ama /api/calisma-program/* route'ları hâlâ kendi
  // başlarına requireCalismaProgramSession() ile kontrol yapıyor (bkz.
  // calisma-program-session-guard.ts) — o kontrolleri değiştirmemek için,
  // eksikse burada sessizce geçerli bir oturum çerezi basılır.
  const isCalismaProgramRoute =
    pathname === "/mypanel/calismaprogram" || pathname.startsWith("/mypanel/calismaprogram/");

  if (isCalismaProgramRoute) {
    const token = request.cookies.get(CALISMA_PROGRAM_SESSION_COOKIE_NAME)?.value;
    const authorized = await verifyCalismaProgramSessionToken(token);

    if (!authorized) {
      const response = NextResponse.next();
      response.cookies.set(CALISMA_PROGRAM_SESSION_COOKIE_NAME, await createCalismaProgramSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: CALISMA_PROGRAM_SESSION_MAX_AGE_SECONDS,
      });
      return response;
    }
  }

  // /mypanel/yagmurumprofugececek: artık kendi şifresi yok, /mypanel'in
  // ortak dış kapısı yeterli. Ama /api/yagmur/* route'ları hâlâ kendi
  // başlarına requireYagmurSession() ile kontrol yapıyor (bkz.
  // yagmur-session-guard.ts) — o kontrolleri değiştirmemek için, eksikse
  // burada sessizce geçerli bir oturum çerezi basılır.
  const isYagmurRoute =
    pathname === "/mypanel/yagmurumprofugececek" || pathname.startsWith("/mypanel/yagmurumprofugececek/");

  if (isYagmurRoute) {
    const token = request.cookies.get(YAGMUR_SESSION_COOKIE_NAME)?.value;
    const authorized = await verifyYagmurSessionToken(token);

    if (!authorized) {
      const response = NextResponse.next();
      response.cookies.set(YAGMUR_SESSION_COOKIE_NAME, await createYagmurSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: YAGMUR_SESSION_MAX_AGE_SECONDS,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Admin auth kontrolü sadece /admin altında çalışır (fonksiyon içinde
  // filtreleniyor); host yönlendirmesi ise statik varlıklar hariç her yolu
  // kapsamalı, o yüzden matcher geniş tutuldu.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
