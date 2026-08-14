"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { NAV_ICONS } from "@/lib/nav-icons";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // Panel document.body'ye portal'lanıyor, bu yüzden ilk render'da (SSR) henüz
  // body yok — mounted false'ken portal atlanır, hydration sonrası true olur.
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex size-11 cursor-pointer items-center justify-center text-foreground"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Panel document.body'ye portal'lanıyor — <header> scroll'da
          backdrop-blur kazanıyor, ve backdrop-filter/filter CSS'te fixed
          konumlu elemanlar için yeni bir containing block oluşturuyor. Panel
          header'ın (bir descendant'ı olarak) İÇİNDE kalsaydı, sayfa
          kaydırılıp header blur'lu haldeyken açıldığında "top-16 bottom-0"
          viewport yerine 64px'lik header kutusuna göre hesaplanıyor, panel
          çöküyor ve arkadaki sayfa içeriği görünür/üst üste biniyordu. Portal
          bu ata zincirinden tamamen çıkarıyor. z-[60], sağ altta sabit duran
          WhatsApp butonunun (z-50) üstünde kalması için — açıkken menü onu da
          örtmeli. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Mobil gezinme menüsü"
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 top-16 bottom-0 z-[60] flex flex-col bg-deep px-6 py-8 lg:hidden"
              >
                <motion.nav
                  className="flex flex-col gap-1"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {NAV_LINKS.map((link) => {
                    const Icon = NAV_ICONS[link.href];
                    return (
                      <motion.div key={link.href} variants={itemVariants}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 border-b border-hairline py-4 text-xl font-semibold text-foreground",
                            pathname === link.href && "text-accent",
                          )}
                        >
                          {Icon && <Icon className="size-5 shrink-0" aria-hidden strokeWidth={1.75} />}
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-auto pt-8">
                  <ButtonLink href="/iletisim" size="lg" className="w-full">
                    Teklif Alın
                  </ButtonLink>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
