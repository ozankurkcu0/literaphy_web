"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EASE_PREMIUM } from "@/lib/motion";
import { LiquidMetalBackground } from "@/components/ui/LiquidMetalBackground";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Container } from "@/components/ui/Container";
import { cardSurfaceClass, cn } from "@/lib/utils";

const container = {
  hidden: {},
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

const features = [
  "Web'den AI Otomasyonuna 6 Hizmet",
  "Ortalama 24 Saatte Geri Dönüş",
  "Teslim Sonrası Destek Dahil",
];

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-deep pt-28 pb-24 lg:pt-20">
      {/* liquid metal shader sits first so it paints as the base layer */}
      <LiquidMetalBackground />

      {/* engineered-canvas grid, fading toward the edges — overlays the shader, not the other way round */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 40%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 40%, black 10%, transparent 75%)",
        }}
        aria-hidden
      />

      {/* readability scrim — guarantees text contrast no matter what the shader is doing underneath */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 55%, rgba(255,255,255,0.08) 100%)",
        }}
        aria-hidden
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
        >
          {/* Plain h1 (not animated): this is the page's LCP candidate — fading it in via
              framer-motion would render it opacity:0 in the SSR HTML and delay the browser's
              LCP timestamp until after hydration + animation. */}
          <h1
            className="balance text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-foreground sm:text-[56px] lg:text-[76px]"
          >
            İşletmenizi teknolojiyle{" "}
            <span className="text-icon-tint">büyüten</span> yazılım ortağınız
          </h1>

          <motion.p
            variants={item}
            className="max-w-xl text-[17px] leading-relaxed text-foreground-secondary lg:text-xl"
          >
            OBSoft; özel yazılım, web geliştirme, AI otomasyonları, WhatsApp iş
            otomasyonu, API entegrasyonları ve QR menü sistemleriyle
            işletmenizin operasyonunu hızlandırır.
          </motion.p>

          <motion.div variants={item} className="flex flex-col items-center gap-4 sm:flex-row">
            <MagneticWrap>
              <LiquidButton
                size="xl"
                onClick={() => router.push("/hizmetler")}
                className="group !rounded-full gap-2 bg-accent-soft text-accent shadow-[0_0_28px_-10px_var(--color-accent-glow)] hover:shadow-[0_0_36px_-8px_var(--color-accent-glow)]"
              >
                Hizmetlerimizi İnceleyin
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </LiquidButton>
            </MagneticWrap>
            <MagneticWrap>
              <LiquidButton
                size="lg"
                onClick={() => router.push("/qr-menu-sistemleri")}
                className="group !rounded-full gap-2 text-accent-product shadow-[0_0_20px_-12px_var(--color-accent-product-glow)] hover:bg-accent-product-soft hover:shadow-[0_0_28px_-8px_var(--color-accent-product-glow)]"
              >
                QR Menü Sistemlerini Keşfedin
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </LiquidButton>
            </MagneticWrap>
          </motion.div>

          <motion.div variants={item} className="w-full pt-6">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className={cn(cardSurfaceClass, "bg-surface/80 px-6 py-6 backdrop-blur-md sm:px-10")}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-hairline">
                {features.map((feature) => (
                  <p
                    key={feature}
                    className="text-sm font-medium text-foreground-secondary sm:px-4 sm:text-center"
                  >
                    {feature}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* eases the hero into the next section instead of a hard cut */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-base))" }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden
      >
        <span className="font-mono text-[11px] tracking-[0.14em] text-foreground-muted uppercase">Kaydırın</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-hairline p-1"
        >
          <span className="size-1 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
