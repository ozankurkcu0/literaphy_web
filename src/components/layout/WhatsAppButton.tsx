"use client";

import { motion } from "motion/react";
import { CONTACT } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { EASE_PREMIUM } from "@/lib/motion";

/** Sağ altta sabit duran WhatsApp CTA'sı — hizmet/fiyat sayfalarını
 * dolduran ziyaretçilerin form yerine tek dokunuşla mesaj atabilmesi için.
 * Site genelinde tek yerden (RootLayout) render edilir. */
export function WhatsAppButton() {
  return (
    <motion.a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan yazın"
      onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8, ease: EASE_PREMIUM }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_-6px_rgba(0,0,0,0.4)] sm:right-6 sm:bottom-6"
      style={{ backgroundImage: "linear-gradient(180deg, #262626 0%, #000000 55%, #000000 100%)" }}
    >
      <span
        className="absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-200 ease-standard group-hover:opacity-100"
        style={{ backgroundImage: "linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 55%, #0a0a0a 100%)" }}
        aria-hidden
      />
      <WhatsAppIcon className="size-7 text-white" />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-md border border-hairline bg-deep px-3 py-1.5 text-sm font-medium whitespace-nowrap text-foreground opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-opacity duration-150 ease-standard group-hover:opacity-100 sm:block">
        WhatsApp&apos;tan yazın
      </span>
    </motion.a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34a9.96 9.96 0 0 0 4.92 1.3h.01c5.52 0 10-4.48 10-10s-4.49-9.96-10.01-9.96Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.26-8.2 2.2 0 4.27.86 5.83 2.42a8.15 8.15 0 0 1 2.41 5.8c0 4.53-3.69 8.21-8.25 8.21Zm4.52-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.68 4.25 3.76.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
