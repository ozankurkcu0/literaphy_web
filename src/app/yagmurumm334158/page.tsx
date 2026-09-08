"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ImageIcon, MapPin, Quote } from "lucide-react";

// 14 Ekim 2025 — sevgili olma tarihi.
const ANNIVERSARY = new Date(2025, 9, 14, 0, 0, 0);

/** SSR/istemci uyuşmazlığı olmasın diye ilk render'da null döner, gerçek
 * değer mount sonrası (yalnızca istemcide) hesaplanıp saniyede bir güncellenir. */
function useElapsedSince(date: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;
  const totalSeconds = Math.max(Math.floor((now - date.getTime()) / 1000), 0);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

// "Devam Et" butonuna basınca ekranı kaplayan konfeti + havai fişek patlaması.
// Kütüphane yerine hafif bir canvas parçacık motoru — merkezden bir konfeti
// patlaması, ekranda birkaç rastgele noktada da havai fişek kıvılcımları.
type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
  shape: "rect" | "circle";
};

const CONFETTI_COLORS = ["#ff5e9c", "#ff8fc0", "#ffd166", "#ffffff", "#c86dd7", "#ff3d81", "#ffe3f1"];

function randomConfettiColor(): string {
  return CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? CONFETTI_COLORS[0]!;
}

function fireConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const particles: ConfettiParticle[] = [];

  // Merkezden büyük konfeti patlaması.
  for (let i = 0; i < 160; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 11;
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 5 + Math.random() * 6,
      color: randomConfettiColor(),
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 22,
      life: 1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    });
  }

  // Rastgele noktalarda küçük havai fişek kıvılcımları.
  for (let f = 0; f < 4; f++) {
    const ox = width * (0.15 + Math.random() * 0.7);
    const oy = height * (0.15 + Math.random() * 0.4);
    for (let j = 0; j < 36; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: randomConfettiColor(),
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 20,
        life: 1,
        shape: "circle",
      });
    }
  }

  const gravity = 0.16;
  const maxFrames = 150;
  let frame = 0;

  function step() {
    frame++;
    ctx!.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.life -= 1 / maxFrames;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = Math.max(p.life, 0);
      ctx!.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }
    if (frame < maxFrames) {
      requestAnimationFrame(step);
    } else {
      ctx!.clearRect(0, 0, width, height);
    }
  }
  requestAnimationFrame(step);
}

/**
 * Kaydırmalı aşk hikayesi. Fotoğraflı bölümlerin fotoğrafı henüz yok —
 * `image` alanını `undefined` bırakıyoruz, dolu bir kutu yerine kibarca
 * "buraya fotoğraf gelecek" yer tutucusu gösteriyoruz. Fotoğraf eklerken:
 *   1) dosyayı public/yagmurumm334158/foto-N.jpg olarak koy,
 *   2) ilgili bloğun `image` alanına "/yagmurumm334158/foto-N.jpg" yaz.
 * (google-review-karti / instagram-nfc-karti sayfalarındaki aynı pattern.)
 *
 * "quote" bloklar fotoğrafsız — ileride elle yazılacak özlü sözler için
 * boş yer tutucu, `text` alanı doldurulunca placeholder yerine gerçek
 * metin basılır.
 *
 * "map" bloğu (ilk bölüm) ilk görüştüğümüz yerin haritasını gösterir —
 * `mapQuery`'ye bir adres/yer adı ("Kadıköy, İstanbul") ya da "enlem,boylam"
 * yazınca otomatik Google Maps embed'i çıkar, boşken yer tutucu görünür.
 */
type PhotoBlock = {
  type: "photo";
  layout: "left" | "right" | "top";
  kicker: string;
  line: string;
  sub: string;
  image: string | undefined;
  alt: string;
  tint: string;
};

type MapBlock = {
  type: "map";
  layout: "left" | "right" | "top";
  kicker: string;
  line: string;
  sub: string;
  mapQuery: string | undefined;
  tint: string;
};

type QuoteBlock = {
  type: "quote";
  text: string | undefined;
  tint: string;
};

type Block = PhotoBlock | MapBlock | QuoteBlock;

const blocks: Block[] = [
  {
    type: "map",
    layout: "left",
    kicker: "01 — İlk Bakış",
    line: "Gözlerin ilk kez değdiğinde kalbime, zaman orada durdu sandım.",
    sub: "İlk görüştüğümüz yer, artık kalbimde ayrı bir yer tutuyor.",
    mapQuery: undefined, // örn. "Kadıköy, İstanbul" ya da "40.99,29.02"
    tint: "#ff3d81",
  },
  {
    type: "photo",
    layout: "right",
    kicker: "02 — Gülüşün",
    line: "Gülüşün, en karanlık günümü bile aydınlatmaya yetiyor.",
    sub: "Sen gülünce, dünya biraz daha güzelleşiyor.",
    image: undefined, // public/yagmurumm334158/foto-2.jpg
    alt: "Gülüşün",
    tint: "#ff5e9c",
  },
  {
    type: "quote",
    text: undefined,
    tint: "#ff77b0",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "03 — Elin",
    line: "Elini tuttuğumda, her şeyin yolunda olacağını biliyorum.",
    sub: "Senin elin, benim en güvenli limanım.",
    image: undefined, // public/yagmurumm334158/foto-3.jpg
    alt: "Elini tuttuğumuz an",
    tint: "#ff8fc0",
  },
  {
    type: "photo",
    layout: "left",
    kicker: "04 — Sesin",
    line: "Sesini duymak, en yorgun günümde bile beni dinlendiriyor.",
    sub: "Seninle konuşmak, en sevdiğim alışkanlığım.",
    image: undefined, // public/yagmurumm334158/foto-4.jpg
    alt: "Birlikte sohbet",
    tint: "#ffa5cd",
  },
  {
    type: "quote",
    text: undefined,
    tint: "#ffb0d4",
  },
  {
    type: "photo",
    layout: "right",
    kicker: "05 — Yanımdasın",
    line: "Yanımda olduğun her an, kendimi eksiksiz hissediyorum.",
    sub: "Sen, tamamlayan parçamsın.",
    image: undefined, // public/yagmurumm334158/foto-5.jpg
    alt: "Yan yana",
    tint: "#ffbcdb",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "06 — Sonsuza Kadar",
    line: "Seninle geçirdiğim her gün, sonsuza kadar sürsün istiyorum.",
    sub: "Çünkü sen, benim en güzel hikayemsin.",
    image: undefined, // public/yagmurumm334158/foto-6.jpg
    alt: "Sonsuza kadar",
    tint: "#ffc8e2",
  },
];

// Sabit sayılar — server/client aynı çıksın diye Math.random() yerine elle
// serpiştirildi (bkz. /yagmurumm sayfasındaki aynı yaklaşım).
const hearts = [
  { left: "4%", size: 16, duration: 16, delay: 0, emoji: "💗" },
  { left: "11%", size: 22, duration: 20, delay: 3.2, emoji: "💖" },
  { left: "19%", size: 14, duration: 15, delay: 7.5, emoji: "💕" },
  { left: "27%", size: 26, duration: 22, delay: 1.4, emoji: "💗" },
  { left: "35%", size: 18, duration: 17, delay: 9.8, emoji: "💘" },
  { left: "43%", size: 20, duration: 19, delay: 5.1, emoji: "💖" },
  { left: "51%", size: 15, duration: 14.5, delay: 12.3, emoji: "💕" },
  { left: "59%", size: 24, duration: 21, delay: 2.6, emoji: "💗" },
  { left: "67%", size: 17, duration: 16.5, delay: 8.4, emoji: "💘" },
  { left: "75%", size: 21, duration: 18.5, delay: 4.7, emoji: "💖" },
  { left: "83%", size: 15, duration: 15.5, delay: 11.1, emoji: "💕" },
  { left: "91%", size: 25, duration: 20.5, delay: 6.3, emoji: "💗" },
  { left: "97%", size: 18, duration: 17.5, delay: 0.9, emoji: "💘" },
  { left: "58%", size: 13, duration: 14, delay: 13.6, emoji: "💕" },
];

const fadeUp = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

function PhotoFrame({ image, alt, className }: { image: string | undefined; alt: string; className: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={alt} className={`${className} object-cover shadow-[0_25px_70px_rgba(0,0,0,0.4)]`} />
    );
  }
  return (
    <div
      className={`${className} flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/35 bg-white/10 text-white/70 backdrop-blur-sm`}
    >
      <ImageIcon className="h-9 w-9" />
      <span className="text-sm">Fotoğraf burada görünecek</span>
    </div>
  );
}

function MapFrame({ mapQuery, className }: { mapQuery: string | undefined; className: string }) {
  if (mapQuery) {
    return (
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
        className={`${className} border-0`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="İlk görüştüğümüz yer"
      />
    );
  }
  return (
    <div
      className={`${className} flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/35 bg-white/10 px-6 text-center text-white/70 backdrop-blur-sm`}
    >
      <MapPin className="h-9 w-9" />
      <span className="text-sm">İlk görüştüğümüz yerin haritası burada olacak</span>
    </div>
  );
}

export default function Yagmurumm2Page() {
  const elapsed = useElapsedSince(ANNIVERSARY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  function handleContinue() {
    fireConfetti(confettiCanvasRef.current);
    scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* "Devam Et" konfeti/havai fişek katmanı — tıklamalar altından geçsin
          diye pointer-events-none, her şeyin üstünde sabit durur. */}
      <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />

      {/* Sürekli hareket eden arka plan — sayfa boyunca sabit kalır, kaydırma
          bunu etkilemez, üstündeki bölümler yarı saydam. */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 [animation:yagmurumm2-drift_22s_ease-in-out_infinite] bg-[length:250%_250%] bg-[linear-gradient(120deg,#180510,#3b0d24,#8a1f52,#ff5e9c,#5c1338,#180510)]" />
        <div className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full bg-fuchsia-400/20 blur-[110px] [animation:yagmurumm2-blob-a_14s_ease-in-out_infinite]" />
        <div className="absolute right-[8%] top-[55%] h-96 w-96 rounded-full bg-pink-300/20 blur-[120px] [animation:yagmurumm2-blob-b_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[5%] left-[35%] h-72 w-72 rounded-full bg-rose-300/15 blur-[100px] [animation:yagmurumm2-blob-a_16s_ease-in-out_infinite_reverse]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          {hearts.map((h, i) => (
            <span
              key={i}
              className="absolute bottom-[-10%] opacity-0 [animation-name:yagmurumm2-float] [animation-timing-function:linear] [animation-iteration-count:infinite]"
              style={{ left: h.left, fontSize: h.size, animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
            >
              {h.emoji}
            </span>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="relative snap-y snap-mandatory overflow-y-scroll" style={{ height: "100dvh" }}>
        {/* Açılış */}
        <section className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center px-6 text-center">
          <motion.p {...fadeUp} className="text-[13px] font-medium uppercase tracking-[0.4em] text-pink-100/70">
            bir aşk hikayesi
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mt-5 max-w-2xl text-[clamp(2rem,6.5vw,3.5rem)] font-semibold leading-[1.2] text-white drop-shadow-[0_2px_24px_rgba(255,0,120,0.4)]"
          >
            Sana dair, kalbimden dökülenler
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-5 max-w-md text-lg text-pink-50/80"
          >
            Her kaydırışta bir cümle, her cümlede biraz daha sen varsın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute bottom-14"
          >
            <motion.button
              type="button"
              onClick={handleContinue}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              animate={{ boxShadow: ["0 10px 40px rgba(255,60,140,0.35)", "0 10px 55px rgba(255,60,140,0.6)", "0 10px 40px rgba(255,60,140,0.35)"] }}
              transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-white ring-1 ring-white/40"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Devam Et</span>
              <ChevronDown className="relative h-4 w-4" />
            </motion.button>
          </motion.div>
        </section>

        {/* Doğum günü + yıldönümü sayacı — 14 Ekim ikisi birden */}
        <section className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center gap-8 px-6 text-center">
          <motion.p {...fadeUp} className="text-[13px] font-medium uppercase tracking-[0.4em] text-pink-100/70">
            14 ekim — iki kutlama birden
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="max-w-xl text-[clamp(1.8rem,5.5vw,3rem)] font-semibold leading-tight text-white drop-shadow-[0_2px_24px_rgba(255,0,120,0.4)]"
          >
            Hem doğum günün, hem yıldönümümüz 🎂💗
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="max-w-md text-base text-pink-50/80"
          >
            14 Ekim hem senin doğum günün, hem de 2025&apos;ten beri yıldönümümüz — aynı günde iki kat şanslıyım.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {[
              { label: "gün", value: elapsed?.days },
              { label: "saat", value: elapsed?.hours },
              { label: "dakika", value: elapsed?.minutes },
              { label: "saniye", value: elapsed?.seconds },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex w-24 flex-col items-center gap-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-5 backdrop-blur-sm sm:w-28"
              >
                <span className="text-3xl font-bold tabular-nums text-white sm:text-4xl">{stat.value ?? "–"}</span>
                <span className="text-xs uppercase tracking-widest text-pink-100/70">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="text-lg text-pink-50/85"
          >
            Ve her gün biraz daha çok. 💗
          </motion.p>
        </section>

        {/* Bölümler */}
        {blocks.map((block, i) => {
          if (block.type === "quote") {
            return (
              <section
                key={`quote-${i}`}
                className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center px-6 text-center"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(circle at 50% 40%, ${block.tint}2b, transparent 65%)` }}
                />
                <motion.div
                  {...fadeUp}
                  className="relative mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-white/30 bg-white/10 px-10 py-16 backdrop-blur-sm"
                >
                  <Quote className="h-8 w-8 text-white/60" />
                  {block.text ? (
                    <p className="text-xl font-medium leading-relaxed text-white">{block.text}</p>
                  ) : (
                    <p className="text-lg text-white/60">Buraya özlü bir söz gelecek</p>
                  )}
                </motion.div>
              </section>
            );
          }

          const isTop = block.layout === "top";
          const isRight = block.layout === "right";

          return (
            <section
              key={block.kicker}
              className={`relative flex h-screen min-h-screen snap-start flex-col items-center justify-center gap-10 px-6 py-16 text-center ${
                isTop ? "" : `sm:flex-row sm:gap-16 sm:text-left ${isRight ? "sm:flex-row-reverse" : ""}`
              }`}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 35%, ${block.tint}33, transparent 65%)` }}
              />

              <motion.div
                {...fadeUp}
                className={`relative shrink-0 ${isTop ? "w-full max-w-xl" : "w-full max-w-md sm:w-[48%]"}`}
              >
                {block.type === "map" ? (
                  <MapFrame
                    mapQuery={block.mapQuery}
                    className={`w-full rounded-2xl ${isTop ? "aspect-[16/10]" : "aspect-[4/5]"}`}
                  />
                ) : (
                  <PhotoFrame
                    image={block.image}
                    alt={block.alt}
                    className={`w-full rounded-2xl ${isTop ? "aspect-[16/10]" : "aspect-[4/5]"}`}
                  />
                )}
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className={`relative max-w-md ${isTop ? "text-center" : ""}`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-pink-100/70">{block.kicker}</p>
                <p className="mt-4 text-[clamp(1.4rem,3.6vw,2.1rem)] font-semibold leading-snug text-white drop-shadow-[0_2px_18px_rgba(255,0,120,0.35)]">
                  {block.line}
                </p>
                <p className="mt-4 text-base text-pink-50/85">{block.sub}</p>
              </motion.div>
            </section>
          );
        })}

        {/* Kapanış */}
        <section className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center gap-4 px-6 text-center">
          <motion.h2
            {...fadeUp}
            className="max-w-2xl text-[clamp(2rem,7vw,3.5rem)] font-semibold leading-tight text-white drop-shadow-[0_2px_24px_rgba(255,0,120,0.5)]"
          >
            Seni çok seviyorum, Yağmurum 💗
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="text-lg text-pink-50/90">
            Ve bu hikaye daha yeni başlıyor.
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            href="/yagmurumm33334141"
            className="mt-6 text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
          >
            yağmurumm sayfasına dön
          </motion.a>
        </section>
      </div>

      <style>{`
        @keyframes yagmurumm2-drift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes yagmurumm2-blob-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 60px) scale(1.15); }
        }
        @keyframes yagmurumm2-blob-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -40px) scale(1.1); }
        }
        @keyframes yagmurumm2-float {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          8% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { transform: translateY(-115vh) scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
