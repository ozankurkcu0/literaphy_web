import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  action?: ReactNode;
  tone?: "accent" | "product";
  className?: string;
  /** Use "h1" when this is the only/first heading on the page (no PageHero/Hero above it). */
  titleAs?: "h1" | "h2";
}

export function SectionHeading({
  title,
  lead,
  align = "center",
  action,
  className,
  titleAs: Title = "h2",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCenter ? "items-center text-center" : "items-start text-left",
        action && "sm:flex-row sm:items-end sm:justify-between sm:text-left",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", isCenter && !action ? "items-center" : "items-start")}>
        <Reveal delay={0.05}>
          <Title className="balance max-w-2xl text-[28px] leading-[1.15] font-bold text-foreground md:text-[34px] lg:text-[40px]">
            {title}
          </Title>
        </Reveal>
        {lead && (
          <Reveal delay={0.1}>
            <p className="max-w-xl text-[17px] leading-relaxed text-foreground-muted md:text-lg">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.1} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
