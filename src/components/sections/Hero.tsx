"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EASE_PREMIUM } from "@/lib/motion";
import { HeroScrollShowcase } from "@/components/sections/HeroScrollShowcase";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidGlassPanel } from "@/components/ui/LiquidGlassPanel";
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
    <>
      <HeroScrollShowcase>
        {/* Ürünün en hareketli anı (parçalanma/birleşme) ekranın tam ortasında
            geçiyor. Metin bloğu bu yüzden ortayı kaplamıyor: dar, kompakt bir
            panel halinde üste, navbar'ın hemen altına sabitlendi — geri kalan
            ekranın büyük kısmı ürün için boş bir "sahne" olarak kalıyor.
            Özellik şeridi de artık burada değil, hero'nun hemen altında kendi
            (video'suz) bölümünde — vitrin ekranını tek bir mesaja indirgiyor.
            Panel artık opak bir kart değil — "liquid glass" denemesi: zemin
            neredeyse şeffaf, video panelin arkasında camsı bir kırılmayla
            görünüyor; okunabilirlik ince bir karartma katmanı + yazı
            gölgesinden geliyor. */}
        <Container className="relative z-10 pt-16 sm:pt-20">
          <LiquidGlassPanel className="mx-auto max-w-3xl rounded-[28px] px-6 py-9 text-center sm:px-14 sm:py-12">
            <motion.div initial="hidden" animate="visible" variants={container}>
              {/* Plain h1 (not animated): this is the page's LCP candidate — fading it in via
                  framer-motion would render it opacity:0 in the SSR HTML and delay the browser's
                  LCP timestamp until after hydration + animation. */}
              <h1 className="balance text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.35)] sm:text-[56px] lg:text-[76px]">
                İşletmenizi teknolojiyle{" "}
                <span className="text-icon-tint">büyüten</span> yazılım ortağınız
              </h1>

              <motion.p
                variants={item}
                className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] lg:text-xl"
              >
                Literaphy; web geliştirme, özel yazılım, N8N otomasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.
              </motion.p>

              <motion.div variants={item} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
                    onClick={() => router.push("/hizmetler/ai-otomasyon")}
                    className="group !rounded-full gap-2 text-accent-product shadow-[0_0_20px_-12px_var(--color-accent-product-glow)] hover:bg-accent-product-soft hover:shadow-[0_0_28px_-8px_var(--color-accent-product-glow)]"
                  >
                    N8N Otomasyonlarını Keşfedin
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </LiquidButton>
                </MagneticWrap>
              </motion.div>
            </motion.div>
          </LiquidGlassPanel>
        </Container>

        {/* eases the hero into the feature strip instead of a hard cut */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-base))" }}
          aria-hidden
        />
      </HeroScrollShowcase>

      {/* Özellik şeridi artık pinned scroll bölümünün dışında, normal akışta —
          scroll-scrub videosu üstünde ekstra bir katman olmadan, sade bir
          bilgi çubuğu olarak hero'nun hemen altında duruyor. */}
      <Container className="relative z-10 -mt-4 pb-16 sm:pb-20">
        <div className={cn(cardSurfaceClass, "mx-auto max-w-3xl bg-surface px-6 py-6 sm:px-10")}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-hairline">
            {features.map((feature) => (
              <p key={feature} className="text-sm font-medium text-foreground-secondary sm:px-4 sm:text-center">
                {feature}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
