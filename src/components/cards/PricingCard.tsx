"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import type { PricingPlan } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/motion";

interface PricingCardProps {
  plan: PricingPlan;
  billing: "monthly" | "yearly";
}

export function PricingCard({ plan, billing }: PricingCardProps) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <motion.div
      layout
      whileHover={!plan.highlighted ? { y: -4, borderColor: "var(--color-strong)" } : undefined}
      transition={{ duration: 0.25, ease: EASE_STANDARD }}
      className={cn(
        // Not: overflow-hidden yok — "En Popüler" rozeti kartın üst kenarından
        // taşacak şekilde (-top-3) konumlanıyor; kart kendi taşmasını gizlerse
        // rozetin üst kısmı kırpılıp kaybolur. Köşe yuvarlaklığı zaten
        // background-clip:border-box sayesinde bozulmadan kalıyor.
        "relative flex h-full flex-col gap-6 rounded-xl border p-10",
        plan.highlighted
          ? "scale-[1.02] border-[1.5px] border-accent-product shadow-[0_24px_70px_-24px_var(--color-accent-product-glow),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-hairline bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
      )}
      style={
        plan.highlighted
          ? {
              backgroundImage:
                "radial-gradient(ellipse 140% 60% at 50% -10%, var(--color-accent-product-soft), var(--color-surface) 65%)",
            }
          : undefined
      }
    >
      {plan.highlighted && (
        <Badge tone="solid-product" className="absolute -top-3 left-1/2 -translate-x-1/2">
          En Popüler
        </Badge>
      )}

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
        <p className="text-sm text-foreground-muted">{plan.description}</p>
      </div>

      <motion.div layout transition={{ duration: 0.25, ease: EASE_STANDARD }} className="flex flex-col gap-1.5">
        <div className="flex items-end gap-1.5">
          <span className="relative block h-11 overflow-hidden font-mono text-[40px] leading-none font-semibold text-foreground">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={billing}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE_STANDARD }}
                className="block"
              >
                ₺{price}
                {plan.startingAt && "+"}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="pb-1 text-sm text-foreground-muted">/ ay</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {billing === "yearly" && (
            <motion.p
              key="yearly-total"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE_STANDARD }}
              className="font-mono text-xs text-foreground-muted"
            >
              Yıllık ₺{(plan.yearlyPrice * 12).toLocaleString("tr-TR")}
              {plan.startingAt && "+"} olarak faturalandırılır
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <ButtonLink
        href="/iletisim"
        variant={plan.highlighted ? "primary" : "secondary"}
        tone={plan.highlighted ? "product" : "accent"}
        className="w-full"
      >
        {plan.ctaLabel}
      </ButtonLink>

      <ul className="flex flex-col gap-3 border-t border-hairline pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
