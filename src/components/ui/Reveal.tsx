"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_STANDARD, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}

export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      // opacity kasıtlı olarak animasyona dahil DEĞİL — SSR HTML'de
      // `opacity:0` inline style olarak render edilirse (framer-motion'ın
      // `initial` prop'u tam bunu yapar), JS çalıştırmayan AI crawler'lar
      // (GPTBot, ClaudeBot, PerplexityBot vb.) bu içeriği "gizli" sayıp
      // tamamen atlıyor — SEO denetiminde site genelinde 46 örnekte tespit
      // edildi. Sadece y-transform ile aynı "yukarı kayarak beliren" his
      // korunuyor, metin ise JS'siz de her zaman tam opak ve okunabilir.
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: EASE_STANDARD, delay }}
    >
      {children}
    </Component>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function RevealGroup({ children, className, stagger = 0.08 }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      // bkz. Reveal() içindeki not — opacity kasıtlı olarak yok, sadece y.
      variants={{
        hidden: { y },
        visible: { y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
      }}
    >
      {children}
    </motion.div>
  );
}
