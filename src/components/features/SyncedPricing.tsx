"use client";

import { useState } from "react";
import type { PricingPlan } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCalculator } from "@/components/features/PricingCalculator";
import { PricingSection } from "@/components/features/PricingSection";

/** QR Menü fiyatlandırma sayfasındaki hesaplayıcı ile altındaki paket
 * kartlarının aylık/yıllık seçimini tek bir state'te tutar — birinde
 * yıllık seçildiğinde diğeri de otomatik yıllığa geçer. */
export function SyncedPricing({ plans }: { plans: PricingPlan[] }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
      <Section tone="base" padding="compact" wide>
        <SectionHeading
          eyebrow="Hesaplayıcı"
          title="Size uygun paketi 30 saniyede bulun"
          lead="Şube sayınızı ve ihtiyaçlarınızı seçin, size uygun paketi ve tahmini fiyatı anında görün."
          tone="product"
          className="mb-10"
        />
        <PricingCalculator billing={billing} onBillingChange={setBilling} />
      </Section>
      <Section tone="base" padding="standard" wide>
        <PricingSection plans={plans} billing={billing} onBillingChange={setBilling} />
      </Section>
    </>
  );
}
