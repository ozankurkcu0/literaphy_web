"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import type { Testimonial } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { cn } from "@/lib/utils";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  eyebrow?: string;
  title?: string;
  tone?: "deep" | "base" | "elevated";
}

export function TestimonialSlider({
  testimonials,
  eyebrow = "Referanslar",
  title = "Müşterilerimiz ne diyor?",
  tone = "base",
}: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // İlk render'da gösterilen tek testimonial'ın SSR HTML'de opacity:0 ile
  // (yani JS'siz AI crawler'lar için "gizli") çıkmaması için — sadece
  // slaytlar arası geçişte gerçek bir fade-in uygulanıyor, ilk yüklemede
  // içerik baştan tam opak. SEO denetiminde tespit edildi.
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const isPaused = hovered || manuallyPaused || reducedMotion;

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-14" />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={isFirstRender.current ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TestimonialCard testimonial={current} />
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {testimonials.map((testimonial, i) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}. yoruma geç`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-300",
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-hairline hover:bg-strong",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setManuallyPaused((prev) => !prev)}
              aria-label={manuallyPaused ? "Otomatik geçişi başlat" : "Otomatik geçişi duraklat"}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground"
            >
              {manuallyPaused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
