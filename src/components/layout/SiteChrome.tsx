"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** Pazarlama sitesinin Header/Footer/WhatsApp CTA'sını sarar. /admin ve
 * /mypanel altındaki sayfalar (calismaprogram, yagmurumprofugececek dahil,
 * bkz. admin/(dashboard)/layout.tsx, mypanel/(panel)/layout.tsx) kendi
 * kabuğunu kullandığı için burada hiçbir marketing chrome'u render edilmez.
 * Aynı şekilde /yagmurum* ile başlayan tek seferlik/özel tam ekran sürpriz
 * sayfalar (ör. /yagmurumm334158) da chrome'suz kalır — bunlar bilerek
 * /mypanel dışında, şifresiz kalıyor. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isMypanel = pathname?.startsWith("/mypanel");
  const isStandalone = pathname?.startsWith("/yagmurum");

  if (isAdmin || isMypanel || isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
