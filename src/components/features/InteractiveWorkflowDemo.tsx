"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { n8nDemoSteps, n8nWorkflowNodes } from "@/content/n8n-otomasyon";
import { WorkflowCanvasMockup } from "@/components/ui/WorkflowCanvasMockup";
import { cn } from "@/lib/utils";

// Node index'leri arasındaki bağlantılar: WhatsApp(0)→AI(1), AI(1)→CRM(2), AI(1)→Yanıt(3).
const edges: { from: number; to: number; revealAtStep: number }[] = [
  { from: 0, to: 1, revealAtStep: 1 },
  { from: 1, to: 2, revealAtStep: 2 },
  { from: 1, to: 3, revealAtStep: 2 },
];

// Her adımda hangi node'ların "aktif" (canlanmış) olduğu.
const activeNodesByStep = [[0], [0, 1], [0, 1, 2, 3]];

export function InteractiveWorkflowDemo() {
  const [active, setActive] = useState(0);
  const activeNodes = activeNodesByStep[active] ?? [];

  return (
    <div className="grid items-center gap-14 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div className="flex flex-col gap-3">
          {n8nDemoSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = active === index;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-lg border p-5 text-left transition-colors duration-200",
                  isActive ? "border-accent-product bg-accent-product-soft" : "border-hairline bg-surface hover:border-strong",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md",
                    isActive ? "bg-accent-product text-white" : "bg-surface-hover text-foreground-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-foreground-muted">{step.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-7">
        <WorkflowCanvasMockup>
          <svg viewBox="0 0 100 50" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            {edges.map((edge) => {
              const from = n8nWorkflowNodes[edge.from];
              const to = n8nWorkflowNodes[edge.to];
              if (!from || !to) return null;
              const isVisible = active >= edge.revealAtStep;
              return (
                <motion.path
                  key={`${edge.from}-${edge.to}`}
                  d={`M${from.x},${from.y} L${to.x},${to.y}`}
                  fill="none"
                  stroke="var(--color-icon-tint)"
                  strokeWidth={0.4}
                  strokeDasharray="2 2"
                  initial={false}
                  animate={
                    isVisible
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {n8nWorkflowNodes.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeNodes.includes(index);
            return (
              <motion.div
                key={node.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 1.6, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-md border transition-colors duration-300",
                    isActive
                      ? "border-accent-product/50 bg-base text-accent-product shadow-[0_0_20px_-4px_var(--color-accent-product-glow)]"
                      : "border-hairline bg-base text-foreground-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </motion.div>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-wide uppercase transition-colors duration-300",
                    isActive ? "text-foreground-secondary" : "text-foreground-muted/60",
                  )}
                >
                  {node.label}
                </span>
              </motion.div>
            );
          })}

          <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="rounded-full border border-hairline bg-surface/90 px-4 py-1.5 text-center font-mono text-xs text-foreground-secondary backdrop-blur-sm"
              >
                {n8nDemoSteps[active]?.status}
              </motion.p>
            </AnimatePresence>
          </div>
        </WorkflowCanvasMockup>
      </div>
    </div>
  );
}
