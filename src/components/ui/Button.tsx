import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "pill";
type Size = "md" | "lg";
type Tone = "accent" | "product";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const toneVars: Record<Tone, { gradient: string; gradientHover: string; ring: string; glow: string }> = {
  // Tek vurgu sistemi: her iki tonda da simsiyah zemin + beyaz yazı (Apple-tarzı
  // CTA). "accent" ve "product" artık aynı paleti paylaşıyor; ayırt edicilik
  // buton metniyle sağlanıyor, renkle değil.
  accent: {
    gradient: "linear-gradient(180deg, #262626 0%, #000000 55%, #000000 100%)",
    gradientHover: "linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 55%, #0a0a0a 100%)",
    ring: "focus-visible:outline-accent",
    glow: "var(--color-accent-glow)",
  },
  product: {
    gradient: "linear-gradient(180deg, #262626 0%, #000000 55%, #000000 100%)",
    gradientHover: "linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 55%, #0a0a0a 100%)",
    ring: "focus-visible:outline-accent-product",
    glow: "var(--color-accent-product-glow)",
  },
};

const isFilled = (variant: Variant) => variant === "primary" || variant === "pill";

function variantClass(variant: Variant) {
  switch (variant) {
    case "primary":
      return "text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.35)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";
    case "pill":
      return "text-white rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.35)] active:scale-[0.98]";
    case "secondary":
      return "border border-hairline bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-strong hover:bg-surface-hover active:scale-[0.98]";
    case "ghost":
      return "text-foreground-muted hover:text-foreground bg-transparent active:scale-[0.98]";
    default:
      return "";
  }
}

const sizeClass: Record<Size, string> = {
  md: "h-11 px-[22px] text-[15px] rounded-md",
  lg: "h-13 px-7 text-[16px] rounded-full",
};

const baseClass =
  "relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[transform,background-color,border-color,box-shadow,opacity] duration-200 ease-standard cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40 group overflow-hidden";

function FillLayers({ variant, tone }: { variant: Variant; tone: Tone }) {
  if (!isFilled(variant)) return null;
  const t = toneVars[tone];
  return (
    <>
      <span
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: t.gradient, boxShadow: `0 8px 24px -8px ${t.glow}` }}
        aria-hidden
      />
      <span
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 ease-standard group-hover:opacity-100"
        style={{ backgroundImage: t.gradientHover }}
        aria-hidden
      />
    </>
  );
}

function Content({ children, withArrow }: { children: ReactNode; withArrow: boolean }) {
  return (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {withArrow && (
        <ArrowRight
          className="relative z-10 size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
          aria-hidden
        />
      )}
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  tone = "accent",
  withArrow = false,
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(baseClass, variantClass(variant), sizeClass[size], toneVars[tone].ring, className)}
      {...rest}
    >
      <FillLayers variant={variant} tone={tone} />
      <Content withArrow={withArrow}>{children}</Content>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  tone = "accent",
  withArrow = false,
  className,
  children,
  external = false,
}: BaseProps & { href: string; external?: boolean }) {
  const classes = cn(baseClass, variantClass(variant), sizeClass[size], toneVars[tone].ring, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <FillLayers variant={variant} tone={tone} />
        <Content withArrow={withArrow}>{children}</Content>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <FillLayers variant={variant} tone={tone} />
      <Content withArrow={withArrow}>{children}</Content>
    </Link>
  );
}
