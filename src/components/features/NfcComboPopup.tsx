"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { LiraSign } from "@/components/ui/LiraSign";
import { buildWhatsAppHref } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { EASE_PREMIUM } from "@/lib/motion";

// Aynı sekmede iki karta da girse tekrar açılmasın diye sessionStorage,
// kapatıldığında/tıklandığında bir süre hiç gösterilmesin diye localStorage
// kullanıyoruz — ikisi de erişilemezse (gizli sekme vb.) popup normal davranır.
const SESSION_KEY = "nfc-combo-popup-shown";
const DISMISS_UNTIL_KEY = "nfc-combo-popup-dismissed-until";
const SHOW_DELAY_MS = 5000;
const CLOSE_COOLDOWN_DAYS = 7;
const CONVERTED_COOLDOWN_DAYS = 90;

const WHATSAPP_MESSAGE =
  "Merhaba, Google Review Kartı + Instagram NFC Kartı kombo kampanyasından (₺1.500) yararlanmak istiyorum.";

/** Google Review Kartı ve Instagram NFC Kartı ürün sayfalarında birkaç saniye
 * sonra sol alttan bir bildirim gibi beliren, ekranı kaplamayan kampanya
 * kartı — iki kartı birlikte alanlara indirim sunar. */
export function NfcComboPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const dismissedUntil = Number(localStorage.getItem(DISMISS_UNTIL_KEY) ?? 0);
      if (Date.now() < dismissedUntil) return;
    } catch {
      // localStorage/sessionStorage erişilemiyor — popup'ı yine de göster.
    }

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // no-op
      }
      trackEvent("nfc_combo_popup_shown", {});
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function dismiss(cooldownDays: number) {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_UNTIL_KEY, String(Date.now() + cooldownDays * 24 * 60 * 60 * 1000));
    } catch {
      // no-op
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Google Review ve Instagram NFC kartı kombo kampanyası"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          // Tam ekranı kaplayan bir backdrop yok — sağ altta sabit duran
          // WhatsApp butonuyla (z-50, right-5/6) çakışmasın diye sol altta,
          // bir bildirim/toast gibi beliriyor; sayfanın geri kalanı tıklanabilir kalıyor.
          className="fixed bottom-5 left-4 z-50 w-[calc(100%-2rem)] max-w-[360px] overflow-hidden rounded-xl border border-accent-product/20 bg-base shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_20px_50px_-20px_rgba(0,0,0,0.35)] sm:bottom-6 sm:left-6"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 140% 60% at 0% -20%, var(--color-accent-product-soft), var(--color-base) 65%)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              trackEvent("nfc_combo_popup_dismiss", { method: "close_button" });
              dismiss(CLOSE_COOLDOWN_DAYS);
            }}
            aria-label="Kapat"
            className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="flex flex-col gap-4 p-6">
            <Badge tone="solid-product" className="w-fit">
              Sınırlı Süreli Kampanya
            </Badge>

            <div className="flex flex-col gap-1 pr-6">
              <h3 className="text-[17px] leading-[1.25] font-bold text-foreground">
                Google Review + Instagram NFC Kombo
              </h3>
              <p className="text-[13px] leading-relaxed text-foreground-muted">
                İki kartı birlikte alın, işletmeniz hem Google&apos;da hem Instagram&apos;da tek dokunuşla büyüsün.
              </p>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm text-foreground-muted line-through">
                <LiraSign />
                2.000
              </span>
              <span className="font-mono text-[26px] leading-none font-semibold text-accent-product">
                <LiraSign />
                1.500
              </span>
              <span className="text-xs text-foreground-muted">%25 indirim</span>
            </div>

            <ButtonLink
              href={buildWhatsAppHref(WHATSAPP_MESSAGE)}
              external
              tone="product"
              size="md"
              className="w-full"
              onClick={() => {
                trackEvent("whatsapp_click", { location: "nfc_combo_popup" });
                dismiss(CONVERTED_COOLDOWN_DAYS);
              }}
            >
              WhatsApp&apos;tan Kampanyayı Alın
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
