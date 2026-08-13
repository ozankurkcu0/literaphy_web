import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "accent" | "product";
  actions?: ReactNode;
  visual?: ReactNode;
}

export function PageHero({
  title,
  lead,
  align = "left",
  actions,
  visual,
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <Section tone="deep" padding="hero">
      <div
        className={cn(
          "grid items-center gap-12",
          visual ? "lg:grid-cols-12" : "grid-cols-1",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-6",
            visual ? "lg:col-span-6" : "max-w-3xl",
            isCenter && !visual ? "mx-auto items-center text-center" : "items-start text-left",
          )}
        >
          {/* Plain h1 (not wrapped in Reveal): this is the page's LCP candidate — fading it
              in via framer-motion would render it opacity:0 in the SSR HTML and delay the
              browser's LCP timestamp until after hydration + the IntersectionObserver fires. */}
          <h1 className="balance text-[34px] leading-[1.08] font-bold tracking-[-0.015em] text-foreground sm:text-[44px] lg:text-[56px]">
            {title}
          </h1>
          {lead && (
            <Reveal delay={0.16}>
              <p className="max-w-xl text-[17px] leading-relaxed text-foreground-secondary lg:text-lg">{lead}</p>
            </Reveal>
          )}
          {actions && (
            <Reveal delay={0.24} className="flex flex-wrap items-center gap-4 pt-2">
              {actions}
            </Reveal>
          )}
        </div>
        {visual && (
          <Reveal delay={0.15} className="lg:col-span-6">
            {visual}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
