import { processSteps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function ProcessSteps({ tone = "elevated" as const }: { tone?: "deep" | "base" | "elevated" }) {
  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow="Süreç" title="Birlikte nasıl çalışıyoruz" className="mb-14" />
      <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {processSteps.map((step, index) => (
          <RevealItem key={step.number} className="group relative flex flex-col gap-4">
            {index < processSteps.length - 1 && (
              <div
                className="absolute top-5 left-[calc(100%_-_0.5rem)] hidden h-px w-full bg-gradient-to-r from-hairline to-transparent lg:block"
                aria-hidden
              />
            )}
            <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-hairline font-mono text-sm font-semibold text-foreground-muted transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
              {step.number}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-foreground-muted">{step.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
