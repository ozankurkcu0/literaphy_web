import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalContentProps {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function LegalContent({ title, updatedAt, sections }: LegalContentProps) {
  return (
    <Section tone="base" padding="hero">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="text-[32px] font-bold text-foreground md:text-[40px]">{title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 font-mono text-xs text-foreground-muted uppercase">Son güncelleme: {updatedAt}</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <Reveal key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-relaxed text-foreground-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
