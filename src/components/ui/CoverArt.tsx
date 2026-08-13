import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoverTone } from "@/types";

interface CoverArtProps {
  tone: CoverTone;
  icon?: LucideIcon;
  className?: string;
  ratio?: "video" | "square" | "portrait" | "wide";
  label?: string;
}

const toneGradient: Record<CoverTone, string> = {
  indigo: "linear-gradient(150deg, #6a76e0 0%, #262a5c 42%, #08080d 100%)",
  violet: "linear-gradient(150deg, #b49bfc 0%, #33245e 42%, #0a0712 100%)",
  cyan: "linear-gradient(150deg, #5cc8fb 0%, #123a52 42%, #060c10 100%)",
  amber: "linear-gradient(150deg, #ffbc4b 0%, #55380d 42%, #0e0803 100%)",
  emerald: "linear-gradient(150deg, #34d399 0%, #0f3c2d 42%, #050b09 100%)",
  rose: "linear-gradient(150deg, #fb8ba3 0%, #4f2130 42%, #0e0507 100%)",
};

const toneGlow: Record<CoverTone, string> = {
  indigo: "#5e6ad2",
  violet: "#a78bfa",
  cyan: "#38bdf8",
  amber: "#f5a623",
  emerald: "#10b981",
  rose: "#fb7185",
};

const ratioClass: Record<NonNullable<CoverArtProps["ratio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/7]",
};

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function CoverArt({ tone, icon: Icon, className, ratio = "video", label }: CoverArtProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]",
        ratioClass[ratio],
        className,
      )}
      style={{ background: toneGradient[tone] }}
    >
      {/* asymmetric ambient glows — brighter top-left, soft secondary bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 12%, rgba(255,255,255,0.28), transparent 42%),
            radial-gradient(circle at 82% 88%, ${toneGlow[tone]}55, transparent 48%)`,
        }}
        aria-hidden
      />
      {/* fine grid, masked so it fades toward the edges instead of tiling flatly */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at 30% 20%, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 20%, black 0%, transparent 72%)",
        }}
        aria-hidden
      />
      {/* film-grain texture — keeps the CSS gradient from reading flat/synthetic */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI }}
        aria-hidden
      />
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
            <Icon className="size-7 text-white" strokeWidth={1.5} aria-hidden />
          </div>
        </div>
      )}
      {label && (
        <span className="absolute bottom-4 left-4 font-mono text-xs font-medium tracking-[0.1em] text-white/85 uppercase">
          {label}
        </span>
      )}
      {/* top edge highlight — the "glass" seam premium dark cards use */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)" }}
        aria-hidden
      />
    </div>
  );
}
