"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * `liquid-glass-button.tsx`'teki SVG türbülans/deplasman tekniğinin, düğme
 * yerine büyük bir içerik paneli için uyarlanmış hali: arkadaki video net
 * görünsün diye zemin neredeyse tamamen şeffaf kalıyor, ama camsı bir
 * kırılma + ince kenar parlaklığı ile "sıvı cam" hissi veriyor. Metin kendi
 * kontrastını background'un hafif kararan alt katmanından ve yazı gölgesinden
 * alıyor — panel opak bir kart değil.
 */
export function LiquidGlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate", className)}>
      {/* arkadaki video/görüntüyü camsı biçimde kıran, hafif bulanık katman */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: 'url("#hero-liquid-glass") blur(3px)',
          WebkitBackdropFilter: "blur(14px)",
        }}
        aria-hidden
      />
      {/* çok ince bir karartma — cam tamamen şeffaf kalsa metin hiçbir zeminde
          okunmaz; bu, video'yu bastırmadan minimum kontrastı garanti ediyor */}
      <div className="absolute inset-0 -z-10 rounded-[inherit] bg-black/10" aria-hidden />
      {/* Apple-tarzı cam kenar parlaklığı: üstte/solda ışık, altta/sağda gölge */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-[inset_1.5px_1.5px_1px_-1px_rgba(255,255,255,0.9),inset_-1.5px_-1.5px_1px_-1px_rgba(255,255,255,0.3),inset_0_0_24px_10px_rgba(255,255,255,0.08),0_24px_60px_-24px_rgba(0,0,0,0.45)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] border border-white/30" aria-hidden />

      {children}

      <HeroGlassFilter />
    </div>
  );
}

function HeroGlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="hero-liquid-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="26" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
