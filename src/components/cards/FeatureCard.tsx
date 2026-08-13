"use client";

import { motion } from "motion/react";
import { qrMenuFeatures } from "@/content/qr-menu";
import { EASE_STANDARD } from "@/lib/motion";

export function FeatureCard({ index }: { index: number }) {
  const feature = qrMenuFeatures[index];
  if (!feature) return null;

  const Icon = feature.icon;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: -4 } }}
      transition={{ duration: 0.25, ease: EASE_STANDARD }}
      className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      <motion.div
        variants={{
          rest: { backgroundColor: "var(--color-icon-tint-soft)" },
          hover: { backgroundColor: "rgba(10, 132, 255, 0.16)" },
        }}
        transition={{ duration: 0.25, ease: EASE_STANDARD }}
        className="flex size-11 items-center justify-center rounded-md text-icon-tint"
      >
        <Icon className="size-5" aria-hidden strokeWidth={1.75} />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-foreground-muted">{feature.description}</p>
    </motion.div>
  );
}
