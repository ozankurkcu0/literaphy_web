import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === OLD_PRODUCTION_HOST) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Statik dosyalar ve Next.js internal path'leri hariç her şeyi kapsar.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
