"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes: string;
}

function Phone({ src, alt, className, priority, sizes }: PhoneProps) {
  return (
    <div className={cn("relative", className)}>
      {/* side controls — same bezel language as PhoneMockup */}
      <div className="absolute top-14 -left-[1.5px] h-5 w-[3px] rounded-l-sm bg-strong" aria-hidden />
      <div className="absolute top-[5.5rem] -left-[1.5px] h-9 w-[3px] rounded-l-sm bg-strong" aria-hidden />
      <div className="absolute top-16 -right-[1.5px] h-10 w-[3px] rounded-r-sm bg-strong" aria-hidden />

      <div className="relative rounded-[2rem] border border-strong bg-elevated p-2 shadow-[0_30px_70px_-18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="relative aspect-[9/17.5] overflow-hidden rounded-[1.5rem] bg-base ring-1 ring-black/40">
          <div className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-deep" aria-hidden />
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
        </div>
      </div>
    </div>
  );
}

export function QrMenuHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] px-6 pt-10 pb-20">
      {/* ambient glow — anchors the layered phones without competing with the deep-tone section */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 55% 40%, var(--color-accent-product-glow), transparent 72%)",
        }}
        aria-hidden
      />

      {/* back device — Kategori Görüntü screen, tucked behind and to the right */}
      <motion.div
        className="absolute top-4 right-0 z-0 w-[46%] rotate-[10deg] opacity-80"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <Phone
          src="/features/qr-ss-kategori-goruntu.png"
          alt="Kategori görüntüleme ekranı"
          sizes="(min-width: 1024px) 10rem, 40vw"
        />
      </motion.div>

      {/* front device — Ürün Detayı screen, the page's LCP image */}
      <motion.div
        className="relative z-10 w-[68%] -translate-x-3 -rotate-[4deg]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Phone
          src="/features/qr-ss-urun-detayi.png"
          alt="Örnek bir QR menü sitesinin ürün detayı ekranı"
          sizes="(min-width: 1024px) 15rem, 60vw"
          priority
        />
      </motion.div>

      {/* floating stat card — sits below both devices so it never collides with the
          in-screenshot UI (e.g. a baked-in "Sepete Ekle" button) */}
      <div className="absolute bottom-0 left-2 z-20 flex items-center gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-product-soft text-accent-product">
          <Zap className="size-4" aria-hidden />
        </div>
        <div>
          <p className="text-sm leading-tight font-semibold text-foreground">Anlık Güncelleme</p>
          <p className="text-xs leading-tight text-foreground-muted">Saniyeler içinde yayında</p>
        </div>
      </div>
    </div>
  );
}
