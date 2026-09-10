"use client";

import { motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import type { QuantityPricingTier } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { LiraSign } from "@/components/ui/LiraSign";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/motion";
import { buildWhatsAppHref } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

interface QuantityPricingSectionProps {
  tiers: QuantityPricingTier[];
  /** WhatsApp'a giden ön dolgulu mesaja eklenecek ürün adı (ör. "Google Review Kartı"). */
  productName: string;
}

function tierWhatsAppHref(productName: string, tier: QuantityPricingTier) {
  return buildWhatsAppHref(`Merhaba, ${productName} - ${tier.quantity} paketi almak istiyorum.`);
}

// PricingCard'ın (aylık/yıllık abonelik) görsel dilini birebir kullanıyor,
// ama billing toggle yerine sabit "adet başı ₺X · toplam ₺Y" fiyatlandırma
// gösteriyor — Google Review Kartı gibi tek seferlik/fiziksel ürünler için.
// Paket satın alma CTA'ları (form yerine) doğrudan WhatsApp'a yönlendirir —
// bu ürünler tek seferlik/fiziksel siparişler olduğundan iletişim formu yerine
// hızlı mesajlaşma daha uygun.
export function QuantityPricingSection({ tiers, productName }: QuantityPricingSectionProps) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
      {tiers.map((tier) => (
        <RevealItem key={tier.quantity}>
          <motion.div
            whileHover={!tier.highlighted ? { y: -4, borderColor: "var(--color-strong)" } : undefined}
            transition={{ duration: 0.25, ease: EASE_STANDARD }}
            className={cn(
              "relative flex h-full flex-col gap-6 rounded-xl border p-10",
              tier.highlighted
                ? "scale-[1.02] border-[1.5px] border-accent-product shadow-[0_24px_70px_-24px_var(--color-accent-product-glow),inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "border-hairline bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
            )}
            style={
              tier.highlighted
                ? {
                    backgroundImage:
                      "radial-gradient(ellipse 140% 60% at 50% -10%, var(--color-accent-product-soft), var(--color-surface) 65%)",
                  }
                : undefined
            }
          >
            {tier.highlighted && (
              <Badge tone="solid-product" className="absolute -top-3 left-1/2 -translate-x-1/2">
                En Popüler
              </Badge>
            )}

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-foreground">{tier.quantity}</h3>
              <p className="text-sm text-foreground-muted">{tier.description}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-end gap-1.5">
                <span className="font-mono text-[40px] leading-none font-semibold text-foreground">
                  <LiraSign />
                  {tier.totalPrice.toLocaleString("tr-TR")}
                </span>
              </div>
              <p className="font-mono text-xs text-foreground-muted">
                adet başı <LiraSign />
                {tier.unitPrice.toLocaleString("tr-TR")}
              </p>
            </div>

            <ButtonLink
              href={tierWhatsAppHref(productName, tier)}
              external
              variant={tier.highlighted ? "primary" : "secondary"}
              tone={tier.highlighted ? "product" : "accent"}
              className="w-full"
              onClick={() => trackEvent("whatsapp_click", { location: "quantity_pricing", tier: tier.quantity })}
            >
              {tier.ctaLabel}
            </ButtonLink>

            <ul className="flex flex-col gap-3 border-t border-hairline pt-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </RevealItem>
      ))}

      <RevealItem>
        <div className="flex h-full flex-col gap-6 rounded-xl border border-dashed border-hairline p-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-foreground">Daha Fazlası</h3>
            <p className="text-sm text-foreground-muted">10 adedin üzerinde, çok şubeli anlaşmalar veya özel tasarım talepleri için.</p>
          </div>

          <div className="flex flex-1 items-center">
            <p className="text-sm leading-relaxed text-foreground-secondary">
              İhtiyacınıza göre hazırladığımız özel fiyat teklifi için bizimle iletişime geçin.
            </p>
          </div>

          <ButtonLink href="/iletisim" variant="secondary" className="w-full">
            <MessageCircle className="size-4" aria-hidden />
            İletişime Geçin
          </ButtonLink>
        </div>
      </RevealItem>
    </RevealGroup>
  );
}
