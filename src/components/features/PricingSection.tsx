"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { PricingPlan } from "@/types";
import { PricingCard } from "@/components/cards/PricingCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

interface PricingSectionProps {
  plans: PricingPlan[];
  /** Verilirse aylık/yıllık seçimi dışarıdan kontrol edilir (üstteki
   * hesaplayıcıyla senkron kalması için) — verilmezse kendi içinde yönetir. */
  billing?: Billing;
  onBillingChange?: (billing: Billing) => void;
}

export function PricingSection({ plans, billing: billingProp, onBillingChange }: PricingSectionProps) {
  const [internalBilling, setInternalBilling] = useState<Billing>("monthly");
  const billing = billingProp ?? internalBilling;
  const setBilling = onBillingChange ?? setInternalBilling;

  return (
    <div>
      <div className="mb-12 flex justify-center">
        <div className="relative flex items-center rounded-full border border-hairline bg-surface p-1">
          {(["monthly", "yearly"] as const).map((option) => {
            const isActive = billing === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setBilling(option)}
                className="relative flex h-11 cursor-pointer items-center rounded-full px-5 text-sm font-medium"
              >
                {isActive && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-accent-product"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={cn("relative z-10", isActive ? "text-white" : "text-foreground-muted")}>
                  {option === "monthly" ? "Aylık" : "Yıllık (%20 indirim)"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <RevealGroup
        className={cn(
          "grid grid-cols-1 gap-8",
          plans.length >= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {plans.map((plan) => (
          <RevealItem key={plan.name}>
            <PricingCard plan={plan} billing={billing} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
