import type { PricingPlan } from "@/types";
import { PricingCard } from "@/components/cards/PricingCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PricingSection({ plans }: { plans: PricingPlan[] }) {
  return (
    <RevealGroup
      className={cn(
        "grid grid-cols-1 gap-8",
        plans.length >= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {plans.map((plan) => (
        <RevealItem key={plan.name}>
          <PricingCard plan={plan} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
