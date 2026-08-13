import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBoxProps {
  icon: LucideIcon;
  tone?: "accent" | "product" | "muted";
  size?: "sm" | "md";
  className?: string;
}

const toneClass = {
  accent: "bg-accent-soft text-accent border-accent/15",
  product: "bg-accent-product-soft text-accent-product border-accent-product/15",
  muted: "bg-surface text-foreground-muted border-hairline",
};

const sizeClass = {
  sm: "size-9 rounded-sm [&>svg]:size-4",
  md: "size-11 rounded-md [&>svg]:size-5",
};

export function IconBox({ icon: Icon, tone = "accent", size = "md", className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border transition-colors duration-200",
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      <Icon aria-hidden strokeWidth={1.75} />
    </div>
  );
}
