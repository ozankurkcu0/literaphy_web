import { qrMenuFeatures } from "@/content/qr-menu";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CoverArt } from "@/components/ui/CoverArt";
import { cn } from "@/lib/utils";

const tones = ["amber", "indigo", "cyan", "emerald", "violet", "rose"] as const;

export function FeatureDetailGrid() {
  return (
    <Section tone="base" padding="standard" innerClassName="flex flex-col gap-24">
      {qrMenuFeatures.map((feature, index) => {
        const reversed = index % 2 === 1;
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reversed && "lg:[&>*:first-child]:order-2")}
          >
            <Reveal>
              <CoverArt tone={tones[index % tones.length] ?? "indigo"} icon={Icon} ratio="wide" />
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-4">
              <span className="font-mono text-xs font-medium tracking-[0.1em] text-accent-product uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
              <p className="max-w-md text-[16px] leading-relaxed text-foreground-muted">{feature.description}</p>
            </Reveal>
          </div>
        );
      })}
    </Section>
  );
}
