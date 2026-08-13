"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { qrMenuHowItWorks } from "@/content/qr-menu";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function HowItWorksSteps() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 60%"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section tone="base" padding="standard">
      <SectionHeading
        eyebrow="Nasıl Çalışır"
        title="Üç adımda temassız dijital menü"
        tone="product"
        className="mb-14"
      />
      <RevealGroup className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
        <div ref={trackRef} className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-hairline sm:block">
          <motion.div
            style={{ scaleX, transformOrigin: "left" }}
            className="h-full bg-accent-product"
          />
        </div>
        {qrMenuHowItWorks.map((step) => (
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
