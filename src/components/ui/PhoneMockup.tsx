import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto w-[280px]", className)}>
      {/* ambient glow behind the device, gives it a "floating" premium presence */}
      <div
        className="absolute inset-x-4 -inset-y-6 -z-10 rounded-[3rem] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent-glow), transparent 70%)" }}
        aria-hidden
      />

      {/* side controls */}
      <div className="absolute top-24 -left-[1.5px] h-8 w-[3px] rounded-l-sm bg-strong" aria-hidden />
      <div className="absolute top-36 -left-[1.5px] h-14 w-[3px] rounded-l-sm bg-strong" aria-hidden />
      <div className="absolute top-28 -right-[1.5px] h-16 w-[3px] rounded-r-sm bg-strong" aria-hidden />

      <div className="relative rounded-[2.5rem] border border-strong bg-elevated p-2.5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="relative overflow-hidden rounded-[2rem] bg-base ring-1 ring-black/40">
          <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-deep" aria-hidden />
          <div className="h-[560px] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
