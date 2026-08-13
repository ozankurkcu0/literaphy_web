import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function TechStackBadges({ stack, tone = "base" as const }: { stack: string[]; tone?: "deep" | "base" | "elevated" }) {
  return (
    <Section tone={tone} padding="compact">
      <RevealGroup className="flex flex-wrap items-center justify-center gap-3">
        {stack.map((tech) => (
          <RevealItem key={tech}>
            <Badge tone="neutral">{tech}</Badge>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
