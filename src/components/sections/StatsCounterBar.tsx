import { companyStats } from "@/content/team";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

export function StatsCounterBar({ tone = "deep" as const }: { tone?: "deep" | "base" | "elevated" }) {
  return (
    <Section tone={tone} padding="compact">
      <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-hairline">
        {companyStats.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col items-center gap-2 text-center lg:px-6">
            <StatCounter value={stat.value} suffix={stat.suffix} className="text-[32px] text-foreground lg:text-[48px]" />
            <span className="text-sm text-foreground-muted">{stat.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
