"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Timer, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { LiraSign } from "@/components/ui/LiraSign";
import { buildWhatsAppHref } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { EASE_PREMIUM } from "@/lib/motion";

// Kapatıldığında/alındığında 12 saat boyunca tekrar gösterilmesin diye
// localStorage kullanıyoruz — bilinçli olarak sayfa bazlı: Google Review
// Kartı'ndan Instagram NFC Kartı'na (ya da tam tersi) geçilince popup'ın
// kaybolup bir daha çıkmaması yerine, yeni sayfada da normal şekilde
// tekrar belirmesini istiyoruz. Erişilemezse (gizli sekme vb.) popup
// normal davranır, sadece süre hatırlanmaz.
const DISMISS_UNTIL_KEY = "nfc-combo-popup-dismissed-until";
const SHOW_DELAY_MS = 5000;
const COOLDOWN_HOURS = 12;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

const WHATSAPP_MESSAGE =
  "Merhaba, Google Review Kartı + Instagram NFC Kartı kombo kampanyasından (₺1.500) yararlanmak istiyorum.";

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Google Review Kartı ve Instagram NFC Kartı ürün sayfalarında birkaç saniye
 * sonra sol alttan bir bildirim gibi beliren, ekranı kaplamayan kampanya
 * kartı — iki kartı birlikte alanlara indirim sunar. Kapatılsın ya da
 * kampanya alınsın, her seferinde 12 saatlik bir geri sayımla yeniden
 * gösterilebilir hale gelir (o yüzden neredeyse her gün karşılaşılır). */
export function NfcComboPopup() {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(COOLDOWN_MS);

  useEffect(() => {
    try {
      const dismissedUntil = Number(localStorage.getItem(DISMISS_UNTIL_KEY) ?? 0);
      if (Date.now() < dismissedUntil) return;
    } catch {
      // localStorage erişilemiyor — popup'ı yine de göster.
    }

    const timer = setTimeout(() => {
      setOpen(true);
      setDeadline(Date.now() + COOLDOWN_MS);
      trackEvent("nfc_combo_popup_shown", {});
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Popup açıkken saniyede bir geri sayımı güncelle.
  useEffect(() => {
    if (!open || deadline === null) return;
    setRemaining(deadline - Date.now());
    const interval = setInterval(() => setRemaining(deadline - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [open, deadline]);

  function dismiss() {
    setOpen(false);
    // Kampanya kartında gösterilen geri sayımla aynı an — "12 saat sonra
    // tekrar gösterilir" hem ekranda yazan hem gerçekte olan şey.
    const until = deadline ?? Date.now() + COOLDOWN_MS;
    try {
      localStorage.setItem(DISMISS_UNTIL_KEY, String(until));
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
              dismiss();
            }}
            aria-label="Kapat"
            className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="solid-product" className="w-fit">
                Sınırlı Süreli Kampanya
              </Badge>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted">
                <Timer className="size-3.5" aria-hidden />
                {formatCountdown(remaining)}
              </span>
            </div>

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
                dismiss();
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
