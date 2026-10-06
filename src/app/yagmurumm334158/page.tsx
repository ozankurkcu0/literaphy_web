"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Eye, Heart, ImageIcon, MapPin, Quote } from "lucide-react";

// 14 Ekim 2025 — sevgili olma tarihi.
const ANNIVERSARY = new Date(2025, 9, 14, 0, 0, 0);

// Açılış ekranıyla (public/yagmurumm334158/intro) aynı pixel/cottagecore
// palet ve font çifti — bu iki dosya arasında görsel tutarlılık için.
const FONT_PIX = '"Press Start 2P", monospace';
const FONT_BODY = '"Pixelify Sans", "Press Start 2P", monospace';
const INK = "#7a2230"; // maroon — gövde metni
const INK_SOFT = "#b9554d"; // coral-dk — kicker/etiketler
const CORAL = "#d97b73";
const PAPER = "#fdf4ef";
const RED_DK = "#b22a3b";

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

// Açılış ekranındaki (love.js) konfeti paletiyle aynı — kırmızı/mercan/pembe tonları.
const CONFETTI_COLORS = ["#e8546a", "#f08aa0", "#d83a52", "#f6b3c2", "#c83048", "#ff8fab"];

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
  video?: string;
  landscape?: boolean; // yatay medya: 16:10 çerçeve, dikey: 4:5
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
    mapQuery: "41.0003197,29.0301973", // Ayrılık Çeşmesi (Marmaray) — ilk görüştüğümüz yer
    tint: "#ff3d81",
  },
  {
    type: "photo",
    layout: "right",
    kicker: "02 — Gülüşün",
    line: "Gülüşün, en karanlık günümü bile aydınlatmaya yetiyor.",
    sub: "Sen gülünce, dünya biraz daha güzelleşiyor.",
    image: "/yagmurumm334158/foto-2.jpg",
    alt: "Gülüşün",
    tint: "#ff5e9c",
  },
  {
    type: "quote",
    text: "Yağmur yağarken bile içim açık, çünkü bir Yağmurum var.",
    tint: "#ff77b0",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "03 — Elin",
    line: "Elini tuttuğumda, her şeyin yolunda olacağını biliyorum.",
    sub: "Senin elin, benim en güvenli limanım.",
    image: "/yagmurumm334158/foto-3.jpg",
    landscape: true,
    alt: "Elini tuttuğumuz an",
    tint: "#ff8fc0",
  },
  {
    type: "photo",
    layout: "left",
    kicker: "04 — Sesin",
    line: "Sesini duymak, en yorgun günümde bile beni dinlendiriyor.",
    sub: "Seninle konuşmak, en sevdiğim alışkanlığım.",
    image: undefined,
    video: "/yagmurumm334158/video-4.mp4", // döngülü, sessiz oynar
    landscape: true,
    alt: "Birlikte sohbet",
    tint: "#ffa5cd",
  },
  {
    type: "quote",
    text: "Ev dediğin bir yer değilmiş, bir insanmış. Benimki sensin.",
    tint: "#ffb0d4",
  },
  {
    type: "photo",
    layout: "right",
    kicker: "05 — Yanımdasın",
    line: "Yanımda olduğun her an, kendimi eksiksiz hissediyorum.",
    sub: "Sen, tamamlayan parçamsın.",
    image: "/yagmurumm334158/foto-5.jpg",
    alt: "Yan yana",
    tint: "#ffbcdb",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "06 — Sonsuza Kadar",
    line: "Seninle geçirdiğim her gün, sonsuza kadar sürsün istiyorum.",
    sub: "Çünkü sen, benim en güzel hikayemsin.",
    image: "/yagmurumm334158/foto-6.jpg",
    landscape: true,
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

// Kağıt dokulu, mercan çerçeveli çerçeve — açılış ekranındaki .envelope/.window
// kartlarıyla aynı dil (kağıt zemin, kalın mercan kenarlık, sert gölge).
const paperFrame = "border-[3px] border-[#d97b73] bg-[#fdf4ef] shadow-[0_10px_0_-4px_rgba(185,85,77,0.25)]";

function PhotoFrame({
  image,
  video,
  alt,
  className,
}: {
  image: string | undefined;
  video?: string;
  alt: string;
  className: string;
}) {
  if (video) {
    return (
      <video
        src={video}
        aria-label={alt}
        className={`${className} ${paperFrame} object-cover p-2`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={alt}
        className={`${className} ${paperFrame} object-cover p-2`}
      />
    );
  }
  return (
    <div
      className={`${className} flex flex-col items-center justify-center gap-3 border-[3px] border-dashed border-[#d97b73]/60 bg-[#fdf4ef] px-6 text-center`}
      style={{ color: INK_SOFT }}
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
        className={`${className} ${paperFrame} p-2`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="İlk görüştüğümüz yer"
      />
    );
  }
  return (
    <div
      className={`${className} flex flex-col items-center justify-center gap-3 border-[3px] border-dashed border-[#d97b73]/60 bg-[#fdf4ef] px-6 text-center`}
      style={{ color: INK_SOFT }}
    >
      <MapPin className="h-9 w-9" />
      <span className="text-sm">İlk görüştüğümüz yerin haritası burada olacak</span>
    </div>
  );
}

// Açılış: okla zarfı aç, "Evet" de, sonra "Devam Et" ile asıl sayfaya geç.
// İzole HTML/CSS/JS (public/yagmurumm334158/intro) bir iframe içinde çalışır,
// bitince postMessage ile bu bileşene haber verir — böylece kendi stil/scriptleri
// sitenin geri kalanıyla hiç çakışmaz.
const INTRO_DONE_MESSAGE = "yagmurumm-proposal-intro:done";

type Phase = "intro" | "puzzle" | "story";

function useProposalIntro() {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data === INTRO_DONE_MESSAGE) setPhase((p) => (p === "intro" ? "puzzle" : p));
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { phase, startStory: () => setPhase("story") };
}

// Açılıştan sonraki kilit: fotoğrafı yerine oturtmadan hikayeye geçilmez.
// Parçaya dokun → başka parçaya dokun = yer değiştir (telefonda en rahatı);
// sürükleyip bırakmak da aynı işi görür. Doğru yerdeki parça kilitlenir.
const PUZZLE_IMAGE = "/yagmurumm334158/puzzle.jpg";
const PUZZLE_COLS = 4;
const PUZZLE_ROWS = 4;
const PUZZLE_RATIO = 1435 / 1127; // kırpılmış fotoğrafın en/boy oranı

function shuffledOrder(): number[] {
  const n = PUZZLE_COLS * PUZZLE_ROWS;
  let order: number[];
  do {
    order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    // Hiç parçası yerinde olmayan bir karışım: baştan "neredeyse çözülmüş" görünmesin.
  } while (order.some((piece, pos) => piece === pos));
  return order;
}

function PuzzleGate({ onDone }: { onDone: () => void }) {
  // order[konum] = o konumda duran parçanın numarası; çözülünce order[i] === i.
  const [order, setOrder] = useState<number[]>(shuffledOrder);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const [moves, setMoves] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragFrom = useRef<number | null>(null);

  const solved = order.every((piece, pos) => piece === pos);

  useEffect(() => {
    if (solved) fireConfetti(canvasRef.current);
  }, [solved]);

  function swap(a: number, b: number) {
    if (a === b || order[a] === a || order[b] === b) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b]!, next[a]!];
      return next;
    });
    setMoves((m) => m + 1);
  }

  function handlePointerDown(pos: number) {
    if (solved || order[pos] === pos) return;
    dragFrom.current = pos;
  }

  function handlePointerUp(e: React.PointerEvent) {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from === null || solved) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-pos]");
    const to = el ? Number(el.dataset.pos) : from;
    if (to !== from) {
      // sürükle-bırak
      swap(from, to);
      setSelected(null);
    } else if (selected === null) {
      setSelected(from);
    } else {
      // dokun-dokun
      swap(selected, from);
      setSelected(null);
    }
  }

  function showHint() {
    setHint(true);
    window.setTimeout(() => setHint(false), 2000);
  }

  const placed = order.filter((piece, pos) => piece === pos).length;
  const total = PUZZLE_COLS * PUZZLE_ROWS;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden bg-[#f7efe3] px-4 text-center"
      style={{ fontFamily: FONT_BODY, color: INK }}
    >
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[8%] top-[10%] h-80 w-80 rounded-full bg-[#ffc1d4]/70 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[6%] h-80 w-80 rounded-full bg-[#ffe1c4]/70 blur-[110px]" />

      <p className="relative uppercase tracking-[0.3em]" style={{ fontFamily: FONT_PIX, color: INK_SOFT, fontSize: 10 }}>
        küçük bir sınav
      </p>
      <h1 className="relative max-w-md text-[clamp(1.4rem,4.5vw,2rem)] font-semibold leading-snug" style={{ color: INK }}>
        {solved ? "Bulduk! 💗" : "Bu fotoğrafı yerine oturt, sonra devam edebilirsin"}
      </h1>

      <div
        className={`relative touch-none select-none ${paperFrame} p-2`}
        style={{
          width: `min(92vw, 640px, calc((100dvh - 260px) * ${PUZZLE_RATIO}))`,
          aspectRatio: String(PUZZLE_RATIO),
        }}
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${PUZZLE_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${PUZZLE_ROWS}, 1fr)`,
            gap: solved ? 0 : 2,
          }}
        >
          {order.map((piece, pos) => {
            const col = piece % PUZZLE_COLS;
            const row = Math.floor(piece / PUZZLE_COLS);
            const locked = piece === pos;
            return (
              <div
                key={pos}
                data-pos={pos}
                onPointerDown={() => handlePointerDown(pos)}
                onPointerUp={handlePointerUp}
                className={`transition-[outline-color,filter] duration-150 ${locked ? "cursor-default" : "cursor-pointer"}`}
                style={{
                  backgroundImage: `url(${PUZZLE_IMAGE})`,
                  backgroundSize: `${PUZZLE_COLS * 100}% ${PUZZLE_ROWS * 100}%`,
                  backgroundPosition: `${(col / (PUZZLE_COLS - 1)) * 100}% ${(row / (PUZZLE_ROWS - 1)) * 100}%`,
                  outline: selected === pos ? `3px solid ${RED_DK}` : "3px solid transparent",
                  outlineOffset: -3,
                  filter: locked && !solved ? "brightness(1.04) saturate(1.05)" : undefined,
                  zIndex: selected === pos ? 1 : 0,
                }}
              />
            );
          })}
        </div>

        {hint && (
          <div
            className="pointer-events-none absolute inset-2"
            style={{ backgroundImage: `url(${PUZZLE_IMAGE})`, backgroundSize: "100% 100%" }}
          />
        )}
      </div>

      <div className="relative flex min-h-[52px] items-center gap-4">
        {solved ? (
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-2 rounded-md border-[3px] px-9 py-3.5 uppercase tracking-[0.2em] transition-colors duration-150 hover:bg-[#e23b4e] hover:text-white"
            style={{ fontFamily: FONT_PIX, fontSize: 12, borderColor: CORAL, background: PAPER, color: INK_SOFT, boxShadow: `0 4px 0 0 ${CORAL}` }}
          >
            Devam Et
            <ChevronDown className="h-4 w-4" />
          </button>
        ) : (
          <>
            <span className="text-sm" style={{ color: INK_SOFT }}>
              {placed}/{total} yerinde · {moves} hamle
            </span>
            <button
              type="button"
              onClick={showHint}
              className="inline-flex items-center gap-2 rounded-md border-[3px] px-4 py-2 text-sm transition-colors duration-150 hover:bg-[#fff1ea]"
              style={{ borderColor: CORAL, background: PAPER, color: INK_SOFT }}
            >
              <Eye className="h-4 w-4" />
              İpucu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Kapanıştaki mektup: zarfa dokununca kapak açılır, ardından not ekrana gelir.
// Notu değiştirmek için sadece LETTER_TEXT'i düzenle (boş satır = yeni paragraf).
const LETTER_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Seni seviyorum.`;
const LETTER_SIGNATURE = "— Senin";

function LoveLetter() {
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setShowLetter(true), 700);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!showLetter) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLetter();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLetter]);

  function closeLetter() {
    setShowLetter(false);
    setOpen(false);
  }

  return (
    <>
      <motion.button
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
        type="button"
        onClick={() => !open && setOpen(true)}
        aria-label="Mektubu aç"
        className="group relative mt-6 block h-[150px] w-[230px] cursor-pointer [perspective:700px]"
      >
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs" style={{ fontFamily: FONT_PIX, color: INK_SOFT, fontSize: 10 }}>
          {open ? "" : "sana bir mektubum var"}
        </span>
        {/* gövde */}
        <span className={`absolute inset-0 overflow-hidden rounded-md ${paperFrame} transition-transform duration-150 group-hover:-translate-y-1`}>
          <span className="absolute inset-0 bg-[#f6e3da] [clip-path:polygon(0_0,50%_58%,0_100%)]" />
          <span className="absolute inset-0 bg-[#f6e3da] [clip-path:polygon(100%_0,50%_58%,100%_100%)]" />
          <span className="absolute inset-0 bg-[#efd2c7] [clip-path:polygon(0_100%,50%_48%,100%_100%)]" />
        </span>
        {/* kapak */}
        <motion.span
          animate={{ rotateX: open ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-0 h-[62%] [transform-origin:top] [transform-style:preserve-3d]"
          style={{ zIndex: open ? 0 : 2 }}
        >
          <span
            className="absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ background: "#e9b8ab", backfaceVisibility: "hidden" }}
          />
        </motion.span>
        {/* mühür */}
        {!open && (
          <span
            className="absolute left-1/2 top-[52%] z-[3] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px]"
            style={{ borderColor: RED_DK, background: "#e23b4e" }}
          >
            <Heart className="h-4 w-4 fill-white text-white" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showLetter && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3a1018]/45 px-4"
            onClick={closeLetter}
          >
            <motion.div
              initial={{ y: 60, scale: 0.92, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Mektup"
              className={`relative max-h-[82dvh] w-full max-w-md overflow-y-auto rounded-md px-7 pb-8 pt-9 text-left ${paperFrame}`}
              style={{
                fontFamily: FONT_BODY,
                color: INK,
                backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(217,123,115,0.22) 31px 32px)",
                backgroundPositionY: 20,
              }}
            >
              <p className="text-[clamp(1.05rem,3.4vw,1.25rem)] leading-[32px]" style={{ whiteSpace: "pre-line" }}>
                {LETTER_TEXT}
              </p>
              <p className="mt-2 text-right text-lg font-semibold leading-[32px]" style={{ color: RED_DK }}>
                {LETTER_SIGNATURE}
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={closeLetter}
                  className="rounded-md border-[3px] px-6 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-150 hover:bg-[#e23b4e] hover:text-white"
                  style={{ fontFamily: FONT_PIX, borderColor: CORAL, background: PAPER, color: INK_SOFT, boxShadow: `0 3px 0 0 ${CORAL}` }}
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Yagmurumm2Page() {
  const elapsed = useElapsedSince(ANNIVERSARY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const { phase, startStory } = useProposalIntro();

  function handleContinue() {
    fireConfetti(confettiCanvasRef.current);
    scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight, behavior: "smooth" });
  }

  if (phase === "puzzle") return <PuzzleGate onDone={startStory} />;

  if (phase === "intro") {
    return (
      <iframe
        src="/yagmurumm334158/intro/index.html"
        title="Yağmurum için küçük bir sürpriz"
        className="fixed inset-0 h-full w-full border-0"
      />
    );
  }

  return (
    <div className="relative" style={{ fontFamily: FONT_BODY, color: INK }}>
      {/* "Devam Et" konfeti/havai fişek katmanı — tıklamalar altından geçsin
          diye pointer-events-none, her şeyin üstünde sabit durur. */}
      <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />

      {/* Açılış ekranıyla aynı krem zemin + mercan/pembe aurora lekeleri — sabit
          kalır, kaydırma bunu etkilemez, üstündeki bölümler yarı saydam. */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f7efe3]">
        <div className="absolute left-[10%] top-[15%] h-96 w-96 rounded-full bg-[#ffc1d4]/70 blur-[110px] [animation:yagmurumm2-blob-a_14s_ease-in-out_infinite]" />
        <div className="absolute right-[8%] top-[55%] h-[26rem] w-[26rem] rounded-full bg-[#ffe1c4]/70 blur-[120px] [animation:yagmurumm2-blob-b_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[5%] left-[35%] h-72 w-72 rounded-full bg-[#f0b6c6]/60 blur-[100px] [animation:yagmurumm2-blob-a_16s_ease-in-out_infinite_reverse]" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(125% 110% at 50% 38%, transparent 55%, rgba(120,40,50,.08) 100%)" }}
        />
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
          <motion.p
            {...fadeUp}
            className="text-[13px] font-medium uppercase tracking-[0.35em]"
            style={{ fontFamily: FONT_PIX, color: INK_SOFT, fontSize: 11 }}
          >
            bir aşk hikayesi
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mt-5 max-w-2xl text-[clamp(2rem,6.5vw,3.5rem)] font-semibold leading-[1.2] drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]"
            style={{ color: INK }}
          >
            Sana dair, kalbimden dökülenler
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-5 max-w-md text-lg"
            style={{ color: INK_SOFT }}
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
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, boxShadow: `0 2px 0 0 ${CORAL}` }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border-[3px] px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-150 hover:bg-[#e23b4e] hover:text-white"
              style={{
                fontFamily: FONT_PIX,
                fontSize: 12,
                borderColor: CORAL,
                background: PAPER,
                color: INK_SOFT,
                boxShadow: `0 4px 0 0 ${CORAL}`,
              }}
            >
              <span className="relative">Devam Et</span>
              <ChevronDown className="relative h-4 w-4" />
            </motion.button>
          </motion.div>
        </section>

        {/* Doğum günü + yıldönümü sayacı — 14 Ekim ikisi birden */}
        <section className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center gap-8 px-6 text-center">
          <motion.p
            {...fadeUp}
            className="text-[13px] font-medium uppercase tracking-[0.35em]"
            style={{ fontFamily: FONT_PIX, color: INK_SOFT, fontSize: 11 }}
          >
            14 ekim — iki kutlama birden
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="max-w-xl text-[clamp(1.8rem,5.5vw,3rem)] font-semibold leading-tight drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]"
            style={{ color: INK }}
          >
            Hem doğum günün, hem yıldönümümüz 🎂💗
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="max-w-md text-base"
            style={{ color: INK_SOFT }}
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
                className={`flex w-24 flex-col items-center gap-1 rounded-xl px-4 py-5 sm:w-28 ${paperFrame}`}
              >
                <span className="text-3xl font-bold tabular-nums sm:text-4xl" style={{ color: RED_DK }}>
                  {stat.value ?? "–"}
                </span>
                <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: FONT_PIX, color: INK_SOFT }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="text-lg" style={{ color: INK_SOFT }}>
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
                  style={{ background: `radial-gradient(circle at 50% 40%, ${block.tint}22, transparent 65%)` }}
                />
                <motion.div
                  {...fadeUp}
                  className="relative mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border-[3px] border-dashed border-[#d97b73]/60 bg-[#fdf4ef] px-10 py-16"
                >
                  <Quote className="h-8 w-8" style={{ color: CORAL }} />
                  {block.text ? (
                    <p className="text-xl font-medium leading-relaxed" style={{ color: INK }}>
                      {block.text}
                    </p>
                  ) : (
                    <p className="text-lg" style={{ color: INK_SOFT }}>
                      Buraya özlü bir söz gelecek
                    </p>
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
                style={{ background: `radial-gradient(circle at 50% 35%, ${block.tint}26, transparent 65%)` }}
              />

              <motion.div
                {...fadeUp}
                className={`relative shrink-0 ${isTop ? (block.type === "photo" && block.landscape ? "w-full max-w-xl" : "w-full max-w-xs sm:max-w-sm") : "w-full max-w-md sm:w-[48%]"}`}
              >
                {block.type === "map" ? (
                  <MapFrame
                    mapQuery={block.mapQuery}
                    className={`w-full rounded-2xl aspect-[4/5]`}
                  />
                ) : (
                  <PhotoFrame
                    image={block.image}
                    video={block.video}
                    alt={block.alt}
                    className={`w-full rounded-2xl ${block.landscape ? "aspect-[16/10]" : "aspect-[4/5]"}`}
                  />
                )}
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className={`relative max-w-md ${isTop ? "text-center" : ""}`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ fontFamily: FONT_PIX, color: INK_SOFT, fontSize: 10 }}>
                  {block.kicker}
                </p>
                <p
                  className="mt-4 text-[clamp(1.4rem,3.6vw,2.1rem)] font-semibold leading-snug drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]"
                  style={{ color: INK }}
                >
                  {block.line}
                </p>
                <p className="mt-4 text-base" style={{ color: INK_SOFT }}>
                  {block.sub}
                </p>
              </motion.div>
            </section>
          );
        })}

        {/* Kapanış */}
        <section className="relative flex h-screen min-h-screen snap-start flex-col items-center justify-center gap-4 px-6 text-center">
          <motion.h2
            {...fadeUp}
            className="max-w-2xl text-[clamp(2rem,7vw,3.5rem)] font-semibold leading-tight drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]"
            style={{ color: INK }}
          >
            Seni çok seviyorum, Yağmurum 💗
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="text-lg" style={{ color: INK_SOFT }}>
            Ve bu hikaye daha yeni başlıyor.
          </motion.p>
          <LoveLetter />
          <motion.a
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.4 }}
            href="/yagmurumm33334141"
            className="mt-6 text-sm font-medium underline underline-offset-4"
            style={{ color: INK_SOFT }}
          >
            yağmurumm sayfasına dön
          </motion.a>
        </section>
      </div>

      <style>{`
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



