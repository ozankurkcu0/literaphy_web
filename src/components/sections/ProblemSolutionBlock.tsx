import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function ProblemSolutionBlock({ problem, solution }: { problem: string; solution: string }) {
  return (
    <Section tone="base" padding="standard">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:divide-x md:divide-hairline">
        <Reveal className="flex flex-col gap-4 md:pr-10">
          <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-foreground-muted uppercase">
            Problem
          </span>
          <p className="text-[17px] leading-relaxed text-foreground-secondary">{problem}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4 md:pl-10">
          <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-accent uppercase">Çözüm</span>
          <p className="text-[17px] leading-relaxed text-foreground-secondary">{solution}</p>
        </Reveal>
      </div>
    </Section>
  );
}
