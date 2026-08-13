import { cn } from "@/lib/utils";

interface MeshGradientProps {
  tone?: "accent" | "product";
  className?: string;
  size?: number;
  opacity?: number;
}

export function MeshGradient({ tone = "accent", className, size = 640, opacity = 0.12 }: MeshGradientProps) {
  const color = tone === "product" ? "var(--color-accent-product)" : "var(--color-accent)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10 animate-drift", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: "blur(90px)",
      }}
    />
  );
}
