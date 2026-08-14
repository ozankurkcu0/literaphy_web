"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { processSteps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Tone = "deep" | "base" | "elevated";

// Section.tsx'in kendi toneClass'ıyla aynı eşleme — adım rozetleri, arkalarından
// geçen çizgiyi görsel olarak "kesebilmek" için bulunduğu bölümle aynı opak
// zemine sahip olmalı (bkz. HowItWorksSteps.tsx'teki aynı teknik).
const circleBgClass: Record<Tone, string> = {
  deep: "bg-deep",
  base: "bg-base",
  elevated: "bg-elevated",
};

export function ProcessSteps({ tone = "elevated" as const }: { tone?: Tone }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 65%"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow="Süreç" title="Birlikte nasıl çalışıyoruz" className="mb-14" />
      <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Adım rozetlerinin merkezlerini birleştiren tek, sürekli çizgi —
            eskiden her adımdan sonra ayrı ayrı çizilen düz gri segmentler
            yerine, scroll ilerledikçe soldan sağa dolan tek bir iz. */}
        <div ref={trackRef} className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-hairline lg:block">
          <motion.div style={{ scaleX, transformOrigin: "left" }} className="h-full bg-accent" aria-hidden />
        </div>
        {processSteps.map((step) => (
          <RevealItem key={step.number} className="group relative flex flex-col gap-4">
            <span
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border border-hairline font-mono text-sm font-semibold text-foreground-muted transition-colors duration-200 group-hover:border-accent group-hover:text-accent",
                circleBgClass[tone],
              )}
            >
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
