import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function ScopeList({ scope, title = "Bu hizmet neleri kapsıyor?" }: { scope: string[]; title?: string }) {
  return (
    <Section tone="base" padding="standard">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <h2 className="text-[28px] leading-tight font-bold text-foreground md:text-[34px]">{title}</h2>
        </Reveal>
        <RevealGroup className="flex flex-col lg:col-span-8">
          {scope.map((item) => (
            <RevealItem
              key={item}
              className="flex items-start gap-4 border-b border-hairline py-5 first:pt-0 last:border-b-0"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Check className="size-4" aria-hidden />
              </span>
              <span className="pt-1 text-[16px] leading-relaxed text-foreground-secondary">{item}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
