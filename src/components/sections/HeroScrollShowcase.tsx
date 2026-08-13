"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

// PLACEHOLDER görseller — Google Flow'dan gelen gerçek klipler/foto hazır
// olunca burayı (ve <video> geçişini) güncelle. Şimdilik elimizdeki gerçek
// site/proje ekran görüntüleriyle mekanizmayı test ediyoruz.
const slides = [
  {
    label: "Web Geliştirme",
    src: "/projects/vento-yapi-kurumsal-site-wide.jpg",
  },
  {
    label: "N8N Otomasyonları",
    src: "/n8n-workflow.jpg",
  },
  {
    label: "QR Menü Sistemleri",
    src: "/projects/kahve-duragi-qr-menu-wide.jpg",
  },
];

const SEGMENT = 1 / slides.length;
// Her segmentin ne kadarı crossfade'e ayrılsın (segment genişliğinin oranı).
const FADE = SEGMENT * 0.25;

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
      <section className="sticky top-0 flex h-screen items-center overflow-hidden bg-deep">
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

          return (
            <motion.div key={slide.src} style={{ opacity }} className="absolute inset-0">
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
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

        {/* okunabilirlik scrim'i — placeholder görseller (koyu proje fotoğrafları,
            üstünde kendi yazıları olan ekran görüntüleri) çok değişken kontrastta
            olduğu için önceki soft-shader arka plana göre belirgin güçlendirildi;
            gerçek Flow klipleri gelince (daha sade/stüdyo tonlu) gevşetilebilir. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 45%, rgba(255,255,255,0.45) 75%, rgba(255,255,255,0.25) 100%)",
          }}
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
                key={slide.src}
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
