import { companyValues } from "@/content/team";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function ValuesGrid() {
  return (
    <Section tone="base" padding="standard">
      <SectionHeading eyebrow="Değerlerimiz" title="Çalışma şeklimizi belirleyen ilkeler" className="mb-14" />
      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {companyValues.map((value) => (
          <RevealItem key={value.title} className="flex flex-col gap-2 border-t border-hairline pt-5">
            <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
            <p className="text-sm leading-relaxed text-foreground-muted">{value.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
