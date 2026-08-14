"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { LayoutGrid, ListOrdered, Palette, ScanLine } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CoverArt } from "@/components/ui/CoverArt";
import { EASE_PREMIUM } from "@/lib/motion";
import type { CoverTone } from "@/types";

const screens: { label: string; tone: CoverTone; icon: typeof ScanLine; image?: string }[] = [
  { label: "Karşılama Ekranı", tone: "amber", icon: ScanLine, image: "/features/qr-ss-karsilama.png" },
  { label: "Kategori Görünümü", tone: "indigo", icon: LayoutGrid, image: "/features/qr-ss-kategori-gorunumu.png" },
  { label: "Kategori Görüntü", tone: "violet", icon: Palette, image: "/features/qr-ss-kategori-goruntu.png" },
  { label: "Ürün Detayı", tone: "emerald", icon: ListOrdered, image: "/features/qr-ss-urun-detayi.png" },
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
            {screen.image ? (
              <div className="relative aspect-[9/17] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={screen.image}
                  alt={screen.label}
                  fill
                  sizes="(min-width: 640px) 340px, 280px"
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 font-mono text-xs font-medium tracking-[0.1em] text-white/85 uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                  {screen.label}
                </span>
              </div>
            ) : (
              <CoverArt tone={screen.tone} icon={screen.icon} ratio="portrait" label={screen.label} />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
