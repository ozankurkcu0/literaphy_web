"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EASE_STANDARD, viewportOnce } from "@/lib/motion";

interface HowItWorksStepsProps {
  steps: { number: string; title: string; description: string }[];
  eyebrow?: string;
  title: string;
}

export function HowItWorksSteps({ steps, eyebrow = "Nasıl Çalışır", title }: HowItWorksStepsProps) {
  return (
    <Section tone="base" padding="standard">
      <SectionHeading eyebrow={eyebrow} title={title} tone="product" className="mb-14" />
      <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
        {/* Adım rozetlerinin merkezlerini birleştiren tek çizgi — scroll
            pozisyonuna bağlı sürekli dolmak yerine (bölüme tam kaydırılmadan
            görüldüğünde yarım/soluk kalabiliyordu), görünüme girince bir kere
            soldan sağa çizilip tam dolu halde kalıyor (bkz. ProcessSteps.tsx'teki
            aynı teknik). */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE_STANDARD, delay: 0.15 }}
          style={{ transformOrigin: "left" }}
          className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-accent-product sm:block"
          aria-hidden
        />
        {steps.map((step) => (
          <RevealItem key={step.number} className="relative flex flex-col items-center gap-4 text-center">
            <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-accent-product/40 bg-base font-mono text-sm font-semibold text-accent-product">
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
