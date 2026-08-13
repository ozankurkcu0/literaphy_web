import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "product" | "success" | "neutral" | "solid" | "solid-product";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClass: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent border-accent/20",
  product: "bg-accent-product-soft text-accent-product border-accent-product/20",
  success: "bg-success/10 text-success border-success/20",
  neutral: "bg-surface text-foreground-muted border-hairline",
  solid: "bg-accent text-white border-transparent",
  "solid-product": "bg-accent-product text-white border-transparent",
};

export function Badge({ children, tone = "accent", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium tracking-[0.06em] uppercase",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
