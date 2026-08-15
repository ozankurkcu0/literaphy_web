"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** Pazarlama sitesinin Header/Footer/WhatsApp CTA'sını sarar. /admin
 * altındaki sayfalar kendi kabuğunu (bkz. admin/(dashboard)/layout.tsx)
 * kullandığı için burada hiçbir marketing chrome'u render edilmez. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
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
