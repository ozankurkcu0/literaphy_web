import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function ResultMetricsRow({ results }: { results: { label: string; value: string }[] }) {
  return (
    <Section tone="deep" padding="compact">
      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:divide-x sm:divide-hairline">
        {results.map((result) => (
          <RevealItem key={result.label} className="flex flex-col items-center gap-2 text-center sm:px-6">
            <span className="font-mono text-[32px] font-semibold text-accent lg:text-[40px]">{result.value}</span>
            <span className="text-sm text-foreground-muted">{result.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
