"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { NAV_ICONS } from "@/lib/nav-icons";
import { Logo } from "@/components/layout/Logo";
import { ServicesDropdown } from "@/components/layout/ServicesDropdown";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Dock, DockIcon, DockItem } from "@/components/ui/dock";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLinks = NAV_LINKS.filter((link) => link.href !== "/hizmetler");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-250 ease-standard",
        scrolled
          ? "border-b border-hairline bg-base/70 shadow-[0_1px_24px_rgba(0,0,0,0.28)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-10 lg:h-28 lg:px-16">
        <Logo />

        <nav className="hidden items-center justify-center lg:flex">
          <Dock>
            <ServicesDropdown />
            {otherLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = NAV_ICONS[link.href];
              return (
                <div key={link.href} className="flex flex-col items-center gap-1">
                  <DockItem>
                    <DockIcon>
                      <Link
                        href={link.href}
                        aria-label={link.label}
                        className={cn(
                          "flex size-full items-center justify-center rounded-full text-foreground-muted transition-colors duration-150 hover:text-foreground",
                          isActive && "text-accent",
                        )}
                      >
                        {Icon && <Icon className="size-full" aria-hidden strokeWidth={1.6} />}
                      </Link>
                    </DockIcon>
                  </DockItem>
                  <span
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap text-foreground-muted",
                      isActive && "text-foreground",
                    )}
                  >
                    {link.label}
                  </span>
                </div>
              );
            })}
          </Dock>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden lg:block">
            <LiquidButton
              size="xl"
              className="text-foreground"
              onClick={() => router.push("/iletisim")}
            >
              Teklif Alın
            </LiquidButton>
          </div>
          {/* Mobilde "Teklif Alın" masaüstü butonuyla birlikte gizleniyordu,
              tek eylem hamburger menüsüne kalıyordu (SEO/UX denetiminde
              tespit edildi) — kompakt bir ikon buton her zaman görünür. */}
          <Link
            href="/iletisim"
            aria-label="Teklif Alın"
            className="flex size-11 items-center justify-center rounded-full bg-accent text-white transition-transform duration-150 ease-standard active:scale-95 lg:hidden"
          >
            <ArrowUpRight className="size-5" aria-hidden />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
