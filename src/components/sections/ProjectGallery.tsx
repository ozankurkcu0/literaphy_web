"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { CoverTone } from "@/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CoverArt } from "@/components/ui/CoverArt";

export function ProjectGallery({ tone }: { tone: CoverTone }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tiles = [0, 1, 2, 3];

  return (
    <Section tone="elevated" padding="standard">
      <Reveal>
        <span className="mb-8 block font-mono text-[13px] font-medium tracking-[0.12em] text-accent uppercase">
          Proje Görselleri
        </span>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {tiles.map((tile) => (
          <button
            key={tile}
            type="button"
            onClick={() => setOpenIndex(tile)}
            className="cursor-pointer overflow-hidden rounded-lg text-left"
          >
            <CoverArt tone={tone} ratio="video" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep/80 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-3xl"
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  aria-label="Kapat"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-foreground-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <CoverArt tone={tone} ratio="wide" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
