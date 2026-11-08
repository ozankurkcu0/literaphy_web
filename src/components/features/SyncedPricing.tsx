import type { PricingPlan } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCalculator } from "@/components/features/PricingCalculator";
import { PricingSection } from "@/components/features/PricingSection";

/** QR Menü fiyatlandırma sayfası: hesaplayıcı + paket kartları. */
export function SyncedPricing({ plans }: { plans: PricingPlan[] }) {
  return (
    <>
      <Section tone="base" padding="compact" wide>
        <SectionHeading
          eyebrow="Hesaplayıcı"
          title="Size uygun paketi 30 saniyede bulun"
          lead="Şube sayınızı ve ihtiyaçlarınızı seçin, size uygun paketi ve yıllık fiyatı anında görün."
          tone="product"
          className="mb-10"
        />
        <PricingCalculator />
      </Section>
      <Section tone="base" padding="standard" wide>
        <PricingSection plans={plans} />
      </Section>
    </>
  );
}
