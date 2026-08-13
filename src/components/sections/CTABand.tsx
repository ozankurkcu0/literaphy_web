import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { ButtonLink } from "@/components/ui/Button";

interface CTABandProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  ctaLabel: string;
  ctaHref?: string;
  tone?: "accent" | "product";
  urgent?: boolean;
}

export function CTABand({
  title,
  lead,
  ctaLabel,
  ctaHref = "/iletisim",
  tone = "accent",
  urgent = false,
}: CTABandProps) {
  return (
    <Section tone="deep" padding="compact" className="relative overflow-hidden">
      <MeshGradient
        tone={tone}
        size={480}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <Reveal delay={0.06}>
          <h2 className="balance text-[28px] leading-[1.15] font-bold text-foreground md:text-[40px]">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.12}>
            <p className="text-[16px] leading-relaxed text-foreground-muted">{lead}</p>
          </Reveal>
        )}
        <Reveal delay={0.18}>
          <MagneticWrap>
            <ButtonLink href={ctaHref} size={urgent ? "lg" : "md"} tone={tone} withArrow>
              {ctaLabel}
            </ButtonLink>
          </MagneticWrap>
        </Reveal>
      </div>
    </Section>
  );
}
