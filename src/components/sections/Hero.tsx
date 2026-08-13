"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EASE_PREMIUM } from "@/lib/motion";
import { HeroScrollShowcase } from "@/components/sections/HeroScrollShowcase";
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
    <HeroScrollShowcase>
      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
        >
          {/* Metin bloğu artık kendi buzlu-cam paneli içinde: arkadaki scroll
              videosu artık bastırılmıyor (bkz. HeroScrollShowcase), o yüzden
              okunabilirlik global bir beyaz yıkamadan değil, bu panelin kendi
              opak zemininden geliyor — video her yerde net kalıyor, metin de
              arkasında hangi kare oynarsa oynasın okunaklı kalıyor. */}
          <div className="rounded-[28px] border border-hairline bg-base/85 px-6 py-9 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-14 sm:py-12">
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
              className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-secondary lg:text-xl"
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
          </div>

          <motion.div variants={item} className="w-full pt-2">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className={cn(cardSurfaceClass, "bg-base/85 px-6 py-6 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-10")}
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
    </HeroScrollShowcase>
  );
}
