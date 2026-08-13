"use client";

import { motion } from "motion/react";
import { Bot, Database, Mail, Zap } from "lucide-react";

const nodes = [
  { icon: Mail, x: 12, y: 20 },
  { icon: Bot, x: 50, y: 8 },
  { icon: Database, x: 88, y: 20 },
  { icon: Zap, x: 50, y: 42 },
];

export function AutomationFlowVisual() {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-hairline bg-elevated">
      <svg viewBox="0 0 100 50" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        {[
          "M12,20 L50,8",
          "M50,8 L88,20",
          "M50,8 L50,42",
        ].map((d) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={0.4}
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        ))}
      </svg>
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={index}
            className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-accent/30 bg-base text-accent"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
          >
            <Icon className="size-5" aria-hidden />
          </motion.div>
        );
      })}
    </div>
  );
}
