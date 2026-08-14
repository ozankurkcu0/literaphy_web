import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { ButtonLink } from "@/components/ui/Button";

interface FeatureSummaryGridProps {
  features: { icon: LucideIcon; title: string; description: string }[];
  eyebrow?: string;
  title: string;
  moreHref: string;
  moreLabel?: string;
}

export function FeatureSummaryGrid({
  features,
  eyebrow = "Özellikler",
  title,
  moreHref,
  moreLabel = "Tüm Özellikleri İnceleyin",
}: FeatureSummaryGridProps) {
  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading eyebrow={eyebrow} title={title} tone="product" className="mb-14" />
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <RevealItem key={feature.title}>
            <FeatureCard feature={feature} />
          </RevealItem>
        ))}
      </RevealGroup>
      <div className="mt-12 flex justify-center">
        <ButtonLink href={moreHref} variant="secondary" withArrow>
          {moreLabel}
        </ButtonLink>
      </div>
    </Section>
  );
}
