import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

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

/** /admin altındaki tüm sayfaları korur — geçerli oturum çerezi yoksa
 * /admin/login'e yönlendirir. API route'lar (/api/admin/*) kendi içinde
 * ayrıca oturum kontrolü yapar (bkz. src/app/api/admin). */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === OLD_PRODUCTION_HOST) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
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

  return NextResponse.next();
}

export const config = {
  // Admin auth kontrolü sadece /admin altında çalışır (fonksiyon içinde
  // filtreleniyor); host yönlendirmesi ise statik varlıklar hariç her yolu
  // kapsamalı, o yüzden matcher geniş tutuldu.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
