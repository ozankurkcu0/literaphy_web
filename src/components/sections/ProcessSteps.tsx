"use client";

import { motion } from "motion/react";
import { processSteps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EASE_STANDARD, viewportOnce } from "@/lib/motion";
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
  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow="Süreç" title="Birlikte nasıl çalışıyoruz" className="mb-14" />
      <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Adım rozetlerinin merkezlerini birleştiren tek çizgi — eskiden
            scroll pozisyonuna bağlı sürekli dolan bir izdi, bu da bölüme tam
            kaydırılmadan görüldüğünde yarım/soluk gri takılı kalabiliyordu.
            Artık görünüme girince bir kere soldan sağa çizilip tam dolu
            (bg-accent) halde kalıyor — her zaman aynı, kesin sonuç. */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE_STANDARD, delay: 0.15 }}
          style={{ transformOrigin: "left" }}
          className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-accent lg:block"
          aria-hidden
        />
        {processSteps.map((step) => (
          <RevealItem key={step.number} className="group relative flex flex-col items-center gap-4 text-center">
            <span
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border border-hairline font-mono text-sm font-semibold text-foreground-muted transition-colors duration-200 group-hover:border-accent group-hover:text-accent",
                circleBgClass[tone],
              )}
            >
              {step.number}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-foreground-muted">{step.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
