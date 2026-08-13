"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { PricingPlan } from "@/types";
import { PricingCard } from "@/components/cards/PricingCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PricingSection({ plans }: { plans: PricingPlan[] }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

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

      <RevealGroup className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <RevealItem key={plan.name}>
            <PricingCard plan={plan} billing={billing} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
