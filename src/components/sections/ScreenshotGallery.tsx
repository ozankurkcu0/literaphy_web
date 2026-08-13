"use client";

import { motion } from "motion/react";
import { LayoutGrid, ListOrdered, Palette, ScanLine } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CoverArt } from "@/components/ui/CoverArt";
import { EASE_PREMIUM } from "@/lib/motion";
import type { CoverTone } from "@/types";

const screens: { label: string; tone: CoverTone; icon: typeof ScanLine }[] = [
  { label: "Karşılama Ekranı", tone: "amber", icon: ScanLine },
  { label: "Kategori Görünümü", tone: "indigo", icon: LayoutGrid },
  { label: "Ürün Detayı", tone: "emerald", icon: ListOrdered },
  { label: "Marka Teması", tone: "violet", icon: Palette },
];

export function ScreenshotGallery() {
  return (
    <Section tone="elevated" padding="standard">
      <Reveal>
        <span className="mb-8 block font-mono text-[13px] font-medium tracking-[0.12em] text-accent-product uppercase">
          Ekran Görüntüleri
        </span>
      </Reveal>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
        {screens.map((screen, index) => (
          <motion.div
            key={screen.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_PREMIUM }}
            className="w-[280px] shrink-0 snap-start sm:w-[340px]"
          >
            <CoverArt tone={screen.tone} icon={screen.icon} ratio="portrait" label={screen.label} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
