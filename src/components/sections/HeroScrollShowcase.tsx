"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollFrameSequence } from "@/components/sections/ScrollFrameSequence";

// Üç ayrı Google Flow videosu, ezgif ile kareye bölünüp scroll-scrub
// tekniğiyle oynatılıyor: N8N otomasyon hub'ı beliriyor, sonra bir geçiş
// sekansıyla telefona/QR koda dönüşüyor, sonra QR Menü kendi ekranında
// kahve temalı dijital menüyü açıyor. Bu, aynı kurgunun 2. render'ı (v2) —
// önceki render (n8n / n8n-to-qr / qr klasörleri) public/scroll-frames
// altında duruyor, silinmedi, sadece artık kullanılmıyor.
const slides = [
  {
    label: "N8N Otomasyonları",
    framesBasePath: "/scroll-frames/n8n-v2",
    frameCount: 180,
  },
  {
    label: "N8N'den QR Menü'ye geçiş",
    framesBasePath: "/scroll-frames/n8n-to-qr-v2",
    frameCount: 180,
  },
  {
    label: "QR Menü Sistemleri",
    framesBasePath: "/scroll-frames/qr-v2",
    frameCount: 180,
  },
];

const SEGMENT = 1 / slides.length;
// Segment sınırındaki kare-seti değişimini yumuşatan küçük bir crossfade —
// sekanslar zaten kendi içinde akıcı video olduğu için önceki 3-statik-görsel
// halindeki geniş crossfade'e artık ihtiyaç yok, sadece dikişi gizliyor.
const FADE = SEGMENT * 0.08;

/**
 * Hero'nun arkasında oturan, scroll'a bağlı gorsel vitrin. Dış wrapper
 * (`h-[300vh]`) gerçek scroll mesafesini sağlıyor; iç katman `sticky`
 * ile ekrana sabitleniyor, scroll ilerledikçe sadece görseller arasında
 * crossfade oluyor — sayfa "atlamıyor", tek bir uzun kaydırma hissi
 * veriyor (Apple ürün sayfaları gibi).
 */
export function HeroScrollShowcase({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <section className="sticky top-0 flex h-screen overflow-hidden bg-deep">
        {/* görsel katmanları */}
        {slides.map((slide, index) => {
          const start = index * SEGMENT;
          const end = start + SEGMENT;
          const opacity = useTransform(
            scrollYProgress,
            index === 0
              ? [start, end - FADE, end]
              : index === slides.length - 1
                ? [start, start + FADE, end]
                : [start, start + FADE, end - FADE, end],
            index === 0 ? [1, 1, 0] : index === slides.length - 1 ? [0, 1, 1] : [0, 1, 1, 0],
          );
          // Segment içi ilerleme (0-1) — scroll-scrub kare dizisi için.
          const segmentProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

          return (
            <motion.div key={slide.label} style={{ opacity }} className="absolute inset-0">
              <ScrollFrameSequence
                basePath={slide.framesBasePath}
                frameCount={slide.frameCount}
                progress={segmentProgress}
                className="h-full w-full"
              />
            </motion.div>
          );
        })}

        {/* engineered-canvas grid, görsellerin üstünde */}
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

        {/* çok hafif alt-gölgeleme — video'nun kendi netliğini/parlaklığını bastırmaz,
            sadece en alttaki "Kaydırın" göstergesinin her zaman okunur kalmasını
            garantiler. Metin bloğu artık kendi kontrastını kendi kartından alıyor,
            burada ağır bir beyaz yıkama yok. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35))" }}
          aria-hidden
        />

        {children}

        {/* aktif segmenti gösteren küçük nokta göstergesi */}
        <div className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 sm:flex">
          {slides.map((slide, index) => {
            const start = index * SEGMENT;
            const end = start + SEGMENT;
            const activeOpacity = useTransform(
              scrollYProgress,
              [start, start + FADE, end - FADE, end],
              [0.3, 1, 1, 0.3],
            );
            return (
              <motion.span
                key={slide.label}
                style={{ opacity: activeOpacity }}
                className="h-1.5 w-6 rounded-full bg-accent"
              />
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
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
    </div>
  );
}
