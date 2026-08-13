import { services } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";

interface ServiceCardGridProps {
  tone?: "deep" | "base" | "elevated";
  detailed?: boolean;
  showHeading?: boolean;
}

export function ServiceCardGrid({ tone = "base", detailed = false, showHeading = true }: ServiceCardGridProps) {
  return (
    <Section tone={tone} padding={showHeading ? "standard" : "none"}>
      {showHeading && (
        <SectionHeading
          eyebrow="Hizmetler"
          title="İşletmenizin ihtiyacına göre şekillenen çözümler"
          lead="Web sitenizden operasyon yazılımınıza, otomasyonlarınızdan entegrasyonlarınıza kadar tek bir teknoloji ortağıyla ilerleyin."
          className="mb-14"
        />
      )}
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <RevealItem key={service.slug}>
            <ServiceCard slug={service.slug} detailed={detailed} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
