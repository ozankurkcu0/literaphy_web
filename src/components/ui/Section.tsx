import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

type Tone = "deep" | "base" | "elevated";
type Padding = "hero" | "standard" | "compact" | "none";

interface SectionProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: Tone;
  padding?: Padding;
  as?: ElementType;
  wide?: boolean;
  id?: string;
}

const toneClass: Record<Tone, string> = {
  deep: "bg-deep",
  base: "bg-base",
  elevated: "bg-elevated",
};

const paddingClass: Record<Padding, string> = {
  hero: "pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24",
  standard: "py-18 md:py-24 lg:py-32",
  compact: "py-14 md:py-16 lg:py-20",
  none: "",
};

export function Section({
  children,
  className,
  innerClassName,
  tone = "base",
  padding = "standard",
  as: Tag = "section",
  wide = false,
  id,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("relative", toneClass[tone], paddingClass[padding], className)}>
      <Container wide={wide} className={innerClassName}>
        {children}
      </Container>
    </Tag>
  );
}
