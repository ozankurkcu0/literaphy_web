import { qrMenuFeatures } from "@/content/qr-menu";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { ButtonLink } from "@/components/ui/Button";

export function FeatureSummaryGrid() {
  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading
        eyebrow="Özellikler"
        title="İşletmenizi büyütecek her şey standart pakette"
        tone="product"
        className="mb-14"
      />
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {qrMenuFeatures.map((feature, index) => (
          <RevealItem key={feature.title}>
            <FeatureCard index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/qr-menu-sistemleri/ozellikler" variant="secondary" withArrow>
          Tüm Özellikleri İnceleyin
        </ButtonLink>
      </div>
    </Section>
  );
}
