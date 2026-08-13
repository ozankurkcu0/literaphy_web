import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

interface MiniFAQProps {
  items: { question: string; answer: string }[];
  eyebrow?: string;
  title?: string;
  tone?: "deep" | "base" | "elevated";
}

export function MiniFAQ({ items, eyebrow = "SSS", title = "Sıkça sorulan sorular", tone = "base" }: MiniFAQProps) {
  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-12" />
      <Reveal className="mx-auto max-w-3xl" delay={0.1}>
        <Accordion items={items} />
      </Reveal>
    </Section>
  );
}
