"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Eye, Heart, ImageIcon, MapPin, Quote } from "lucide-react";

// 14 Ekim 2025 — sevgili olma tarihi.
const ANNIVERSARY = new Date(2025, 9, 14, 0, 0, 0);
// Tam 365. gün (1. yıl dönümü) — sayaç bu an 365'e ulaşır, konfeti patlar.
const FIRST_YEAR = new Date(2026, 9, 14, 0, 0, 0);
const FIRST_YEAR_SEEN_KEY = "iyikidogdunaskim-first-year-confetti";

// Açılış ekranıyla (public/iyikidogdunaskim/intro) aynı pixel/cottagecore
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

// 365. gün için ihtişamlı final: yukarı fırlayıp patlayan roketler (daire ve
// kalp şeklinde), iki yandan konfeti topları, ortada dev patlama ve en sonda
// tepeden yağan altın/pembe yağmur. ~9 sn sürer; tek canvas, tek rAF döngüsü.
type FinaleParticle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
  decay: number;
  gravity: number;
  drag: number;
  kind: "rect" | "circle" | "spark" | "heart";
};

const FINALE_COLORS = [...CONFETTI_COLORS, "#ffd166", "#ffe8a3", "#ffffff"];

function finaleColor(): string {
  return FINALE_COLORS[Math.floor(Math.random() * FINALE_COLORS.length)] ?? "#ffffff";
}

function fireGrandFinale(canvas: HTMLCanvasElement | null) {
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

  const scale = Math.min(width, 900) / 900 + 0.35; // küçük ekranda patlamalar da küçük
  const particles: FinaleParticle[] = [];
  const rockets: { x: number; y: number; vy: number; targetY: number; heart: boolean; color: string }[] = [];

  function add(p: Partial<FinaleParticle> & Pick<FinaleParticle, "x" | "y" | "vx" | "vy">) {
    particles.push({
      px: p.x,
      py: p.y,
      size: 4,
      color: finaleColor(),
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 20,
      life: 1,
      decay: 1 / 150,
      gravity: 0.16,
      drag: 0.99,
      kind: "rect",
      ...p,
    });
  }

  function burst(x: number, y: number, heart: boolean, color: string) {
    const n = Math.round((heart ? 70 : 90) * Math.min(scale, 1.2));
    for (let i = 0; i < n; i++) {
      let vx: number;
      let vy: number;
      if (heart) {
        const t = (i / n) * Math.PI * 2;
        vx = (16 * Math.sin(t) ** 3) * 0.33 * scale;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.33 * scale;
      } else {
        const a = (i / n) * Math.PI * 2;
        const s = (3 + Math.random() * 4) * scale;
        vx = Math.cos(a) * s;
        vy = Math.sin(a) * s;
      }
      add({ x, y, vx, vy, color: Math.random() < 0.7 ? color : "#ffe8a3", kind: "spark", size: 2.6, decay: 1 / (85 + Math.random() * 25), gravity: 0.07, drag: 0.975 });
    }
    // Patlamanın içinde minik konfeti.
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = (1 + Math.random() * 3) * scale;
      add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: 5 + Math.random() * 3, decay: 1 / 120 });
    }
  }

  function launchRocket(heart: boolean) {
    rockets.push({
      x: width * (0.15 + Math.random() * 0.7),
      y: height + 10,
      vy: -(height * 0.017 + Math.random() * 3),
      targetY: height * (0.15 + Math.random() * 0.3),
      heart,
      color: finaleColor(),
    });
  }

  function cannon(side: "left" | "right") {
    const x = side === "left" ? -10 : width + 10;
    const y = height * 0.85;
    for (let i = 0; i < 70; i++) {
      const angle = side === "left" ? -(0.45 + Math.random() * 0.8) : -Math.PI + (0.45 + Math.random() * 0.8);
      const s = (9 + Math.random() * 11) * scale;
      add({ x, y, vx: Math.cos(angle) * s, vy: Math.sin(angle) * s, size: 6 + Math.random() * 6, kind: Math.random() > 0.35 ? "rect" : "circle", decay: 1 / 170, drag: 0.985 });
    }
  }

  function centerBlast() {
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = (2 + Math.random() * 15) * scale;
      add({ x: width / 2, y: height / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, size: 5 + Math.random() * 7, kind: Math.random() > 0.7 ? "heart" : Math.random() > 0.5 ? "rect" : "circle", decay: 1 / 190, drag: 0.985 });
    }
  }

  function rain() {
    for (let i = 0; i < 12; i++) {
      add({ x: Math.random() * width, y: -10, vx: (Math.random() - 0.5) * 1.5, vy: 1 + Math.random() * 2.5, size: 5 + Math.random() * 5, kind: Math.random() > 0.8 ? "heart" : "rect", color: Math.random() > 0.5 ? "#ffd166" : finaleColor(), decay: 1 / 200, gravity: 0.03, drag: 0.995 });
    }
  }

  // Zaman çizelgesi (kare = ~1/60 sn).
  const schedule: Record<number, () => void> = {
    0: centerBlast,
    20: () => { cannon("left"); cannon("right"); },
    45: () => launchRocket(false),
    65: () => launchRocket(true),
    85: () => launchRocket(false),
    110: () => { cannon("left"); cannon("right"); launchRocket(true); },
    130: () => launchRocket(false),
    150: () => launchRocket(true),
    165: () => launchRocket(false),
    185: () => { centerBlast(); launchRocket(true); },
    205: () => launchRocket(false),
    220: () => launchRocket(true),
    240: () => { cannon("left"); cannon("right"); },
  };
  const RAIN_FROM = 250;
  const RAIN_TO = 400;
  const END = 560;
  let frame = 0;

  function drawHeart(size: number) {
    const s = size / 16;
    ctx!.beginPath();
    ctx!.moveTo(0, 4 * s);
    ctx!.bezierCurveTo(-10 * s, -4 * s, -6 * s, -12 * s, 0, -6 * s);
    ctx!.bezierCurveTo(6 * s, -12 * s, 10 * s, -4 * s, 0, 4 * s);
    ctx!.fill();
  }

  function step() {
    schedule[frame]?.();
    if (frame >= RAIN_FROM && frame < RAIN_TO && frame % 3 === 0) rain();

    ctx!.clearRect(0, 0, width, height);
    ctx!.globalCompositeOperation = "source-over";

    // Roketler: iz bırakarak yükselir, hedef yükseklikte patlar.
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]!;
      r.y += r.vy;
      r.vy *= 0.985;
      add({ x: r.x + (Math.random() - 0.5) * 2, y: r.y, vx: (Math.random() - 0.5) * 0.6, vy: 0.6 + Math.random(), size: 2, color: "#ffe8a3", kind: "spark", decay: 1 / 22, gravity: 0.02, drag: 0.95 });
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = "#fff";
      ctx!.beginPath();
      ctx!.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
      ctx!.fill();
      if (r.y <= r.targetY || r.vy > -1.5) {
        burst(r.x, r.y, r.heart, r.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.px = p.x;
      p.py = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.life -= p.decay;
      if (p.life <= 0 || p.y > height + 40) {
        particles.splice(i, 1);
        continue;
      }
      ctx!.globalAlpha = Math.min(p.life * 1.4, 1);
      ctx!.fillStyle = p.color;
      if (p.kind === "spark") {
        ctx!.globalCompositeOperation = "lighter";
        ctx!.strokeStyle = p.color;
        ctx!.lineWidth = p.size;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(p.px, p.py);
        ctx!.lineTo(p.x, p.y);
        ctx!.stroke();
        ctx!.globalCompositeOperation = "source-over";
        continue;
      }
      ctx!.save();
      ctx!.translate(p.x, p.y);
      // Konfeti dönerken yan görünüp ince kalsın (kâğıt gibi çevrilsin).
      ctx!.rotate((p.rotation * Math.PI) / 180);
      if (p.kind === "rect") {
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, (p.size / 2) * Math.abs(Math.cos(frame / 6 + i)));
      } else if (p.kind === "heart") {
        drawHeart(p.size * 1.6);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    frame++;
    if (frame < END || particles.length > 0 || rockets.length > 0) {
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
 *   1) dosyayı public/iyikidogdunaskim/foto-N.jpg olarak koy,
 *   2) ilgili bloğun `image` alanına "/iyikidogdunaskim/foto-N.jpg" yaz.
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
    image: "/iyikidogdunaskim/foto-2.jpg",
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
    image: "/iyikidogdunaskim/foto-3.jpg",
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
    video: "/iyikidogdunaskim/video-4.mp4", // döngülü, sessiz oynar
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
    image: "/iyikidogdunaskim/foto-5.jpg",
    alt: "Yan yana",
    tint: "#ffbcdb",
  },
  // Yeni fotoğraf yerleri (06–08): yollar hazır. Sadece public/iyikidogdunaskim/
  // altına foto-7.jpg / foto-8.jpg / foto-9.jpg koy — dosya yokken yer tutucu çıkar.
  // kicker/line/sub metinlerini istediğin gibi düzenle.
  {
    type: "photo",
    layout: "left",
    kicker: "06 — Birlikte",
    line: "Seninle her yer, en güzel yer oluyor.",
    sub: "Birlikte geçen her an, saklamak istediğim bir kare.",
    image: "/iyikidogdunaskim/foto-7.jpg",
    alt: "Birlikte bir an",
    tint: "#ffc0dc",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "07 — Anılarımız",
    line: "Her anımızı yeniden yaşamak isterim.",
    sub: "Küçük anlar, en büyük hazinelerim.",
    image: "/iyikidogdunaskim/foto-8.jpg",
    landscape: true,
    alt: "Anılarımızdan bir kare",
    tint: "#ffc4de",
  },
  {
    type: "photo",
    layout: "right",
    kicker: "08 — Biz",
    line: "Sen ve ben, en güzel cümleyiz.",
    sub: "Daha yazacak çok sayfamız var.",
    image: "/iyikidogdunaskim/foto-9.jpg",
    alt: "Biz",
    tint: "#ffc6e0",
  },
  {
    type: "photo",
    layout: "top",
    kicker: "09 — Sonsuza Kadar",
    line: "Seninle geçirdiğim her gün, sonsuza kadar sürsün istiyorum.",
    sub: "Çünkü sen, benim en güzel hikayemsin.",
    image: "/iyikidogdunaskim/foto-6.jpg",
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

// En çok konuşulan 15 dilde "seni seviyorum" (Türkçe dahil). Hem arka planda
// süzülen yazılarda hem de mektubun altındaki dönen satırda kullanılır.
const LOVE_LANGS = [
  { lang: "tr", name: "Türkçe", text: "Seni seviyorum" },
  { lang: "en", name: "İngilizce", text: "I love you" },
  { lang: "zh", name: "Çince", text: "我爱你" },
  { lang: "hi", name: "Hintçe", text: "मैं तुमसे प्यार करता हूँ" },
  { lang: "es", name: "İspanyolca", text: "Te quiero" },
  { lang: "fr", name: "Fransızca", text: "Je t'aime" },
  { lang: "ar", name: "Arapça", text: "أحبك" },
  { lang: "bn", name: "Bengalce", text: "আমি তোমাকে ভালোবাসি" },
  { lang: "pt", name: "Portekizce", text: "Eu te amo" },
  { lang: "ru", name: "Rusça", text: "Я тебя люблю" },
  { lang: "id", name: "Endonezce", text: "Aku cinta kamu" },
  { lang: "de", name: "Almanca", text: "Ich liebe dich" },
  { lang: "ja", name: "Japonca", text: "愛してる" },
  { lang: "ko", name: "Korece", text: "사랑해" },
  { lang: "it", name: "İtalyanca", text: "Ti amo" },
] as const;

// Pixelify Sans sadece Latin/Kiril kapsıyor; diğer yazılar sistem fontuna düşer.
const LOVE_FONT = `${FONT_BODY}, "Noto Sans", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans Devanagari", "Noto Sans Bengali", "Noto Sans Arabic", sans-serif`;

// Arka planda süzülen yazılar — kalplerle aynı animasyon, soluk renk.
// Sabit değerler (SSR/CSR aynı çıksın diye Math.random() yok).
const floatingLove = [
  { left: "7%", size: 15, duration: 24, delay: 2, i: 1 },
  { left: "15%", size: 17, duration: 27, delay: 9, i: 2 },
  { left: "23%", size: 20, duration: 26, delay: 15, i: 12 },
  { left: "31%", size: 15, duration: 23, delay: 5, i: 5 },
  { left: "39%", size: 18, duration: 28, delay: 11, i: 6 },
  { left: "47%", size: 22, duration: 25, delay: 0, i: 12 },
  { left: "55%", size: 16, duration: 29, delay: 17, i: 9 },
  { left: "63%", size: 19, duration: 24, delay: 7, i: 13 },
  { left: "71%", size: 15, duration: 26, delay: 13, i: 3 },
  { left: "79%", size: 18, duration: 27, delay: 4, i: 10 },
  { left: "86%", size: 20, duration: 25, delay: 19, i: 14 },
  { left: "93%", size: 16, duration: 28, delay: 8, i: 4 },
];

// Mektubun altında dil dil dönen satır. Azaltılmış harekette sabit Türkçe kalır.
function LoveRotator({ visible }: { visible: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIdx((n) => (n + 1) % LOVE_LANGS.length), 2800);
    return () => window.clearInterval(id);
  }, [visible]);

  const item = LOVE_LANGS[idx] ?? LOVE_LANGS[0];
  return (
    <div
      className="mt-5 flex min-h-[64px] flex-col items-center justify-center gap-1 text-center transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={item.lang}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1"
        >
          <span
            lang={item.lang}
            dir={item.lang === "ar" ? "rtl" : "ltr"}
            className="text-[22px] font-semibold leading-tight"
            style={{ fontFamily: LOVE_FONT, color: RED_DK }}
          >
            {item.text}
          </span>
          <span className="text-[8px] uppercase tracking-[0.2em]" style={{ fontFamily: FONT_PIX, color: INK_SOFT }}>
            {item.name}
          </span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

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
  // Dosya henüz yüklenmediyse kırık resim yerine yer tutucu göster.
  const [failed, setFailed] = useState(false);
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
  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        onError={() => setFailed(true)}
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
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
// İzole HTML/CSS/JS (public/iyikidogdunaskim/intro) bir iframe içinde çalışır,
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
const PUZZLE_IMAGE = "/iyikidogdunaskim/puzzle.jpg";
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
      <div className="pointer-events-none absolute left-[8%] top-[10%] h-[28rem] w-[28rem] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,193,212,.75), transparent)" }} />
      <div className="pointer-events-none absolute bottom-[8%] right-[6%] h-[28rem] w-[28rem] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,225,196,.75), transparent)" }} />

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
// Notu değiştirmek için LETTER_BEFORE / LETTER_POEM / LETTER_AFTER'ı düzenle (boş satır = yeni paragraf).
const LETTER_BEFORE = `Balım, ellerimle yazıyor olduğum mektubuma başlamadan önce seni çok sevdiğimi söylemek istiyorum. Bu gün günlerden 14 Ekim 2026; sayın çok sevdiğim Birtanem'in, hayatımın, aşkımın doğduğu gün. Ayrıca kimilerine göre yıl dönümümüz (🤨), kimilerine göre de sadece doğum günün...

Ancak önemli olan devam etmektir, iyi ki beraberiz minnoşum 😘 seni çoookkk seviyorum.

Araya giren o saçma sapan 5 aylık boşluk, bana sadece sensiz buraların ne kadar tatsız tuzsuz olduğunu gösterdi maalesef 🥲. Şimdi o sayfaları tamamen kapattık; önümüzde çooookkkkk daha güzel, çok daha bizlikk bi sayfa var. Bu siteyi yaparken o fotoğraflarımıza, mutlu anlarımıza falan baktım da... Cidden ne kadarr güzel gülmüşüz beraber. O gülüşüne ayrı, sana ayrı hastayım biliyorsun bebişimmm 😍. Bundan sonra o güzel yüzünü çok daha fazla güldürücem, söz veriyorum ki seni hep seveceğim. İyi ki doğdun, iyi ki yeniden hayatımdasın Yağmur'um, benim güzeller güzeli sevgilim.

İyi ki doğdun Sevgilimmm 💗, iyi ki varsın.

İki mısra yazdım sana bi de;`;
// Şiir ayrı parça: italik ve ortalı gösterilir, iki mısra alt alta durur.
const LETTER_POEM = `Güller açıp sana baksa gül kendini gül mü görür?
Senin o kara gözlerin varken benim gönlüm başka neyi görür?`;
const LETTER_AFTER = `Hadi şimdi şu ekrana bakmayı bırak da bana dön, seni ne kadar çoookkk sevdiğimi bi de o güzel gözlerine bakarak söyleyeyim...

Seni seviyorum 💗`;
// Daktilo tek metin üzerinden sayar; parçalar araya satır sonu eklenmeden birleşir.
const LETTER_TEXT = LETTER_BEFORE + LETTER_POEM + LETTER_AFTER;
const LETTER_SIGNATURE = "— Seni çok seven Sevgilin, Ozan💗";

// Mektup metnini daktilo gibi yazar. Yazılmamış kısım görünmez ama yerini
// tuttuğu için kağıt boyutu/satır kırılımları baştan sabit kalır (zıplama yok).
// Sayıyı bu bileşen tuttuğu için her harfte sadece metin yeniden render olur.
// Kağıda dokunmak yazıyı atlatır; "azaltılmış hareket" tercihinde direkt tam metin.
function TypedLetter() {
  const [count, setCount] = useState(0);
  const caretRef = useRef<HTMLSpanElement>(null);
  const total = LETTER_TEXT.length;
  const done = count >= total;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    let i = 0;
    let id: number;
    const tick = () => {
      i++;
      setCount(i);
      if (i >= total) return;
      const prev = LETTER_TEXT[i - 1];
      // Noktalama ve satır sonunda kısa nefes payı.
      const delay = prev === "\n" ? 380 : ".!?…".includes(prev ?? "") ? 260 : prev === "," ? 120 : 34;
      id = window.setTimeout(tick, delay);
    };
    id = window.setTimeout(tick, 400);
    return () => window.clearTimeout(id);
  }, [total]);

  // Yazı kağıdın altına inince kaydırma imleci takip etsin.
  useEffect(() => {
    if (count % 12 === 0 || done) caretRef.current?.scrollIntoView({ block: "nearest" });
  }, [count, done]);

  return (
    <div onClick={() => setCount(total)}>
      <p className="sr-only">{[LETTER_BEFORE, LETTER_POEM, LETTER_AFTER].join("\n\n")}</p>
      <div
        aria-hidden="true"
        className="text-[clamp(1.05rem,3.4vw,1.25rem)] leading-[32px]"
        style={{ whiteSpace: "pre-line" }}
      >
        {[
          { text: LETTER_BEFORE, className: "" },
          { text: LETTER_POEM, className: "my-3 text-center italic" },
          { text: LETTER_AFTER, className: "" },
        ].map((part, idx, parts) => {
          const start = parts.slice(0, idx).reduce((n, p) => n + p.text.length, 0);
          const shown = Math.max(0, Math.min(part.text.length, count - start));
          const isCaretHere = count < total && count >= start && (count < start + part.text.length || idx === parts.length - 1);
          return (
            <div key={idx} className={part.className}>
              {part.text.slice(0, shown)}
              {isCaretHere && (
                <span ref={caretRef} className="inline-block w-[2px] bg-current align-middle" style={{ height: "1.1em" }} />
              )}
              <span className="opacity-0">{part.text.slice(shown)}</span>
            </div>
          );
        })}
      </div>
      <p
        className="mt-2 text-right text-lg font-semibold leading-[32px] transition-opacity duration-700"
        style={{ color: RED_DK, opacity: done ? 1 : 0 }}
      >
        {LETTER_SIGNATURE}
      </p>
      <LoveRotator visible={done} />
    </div>
  );
}

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
              <TypedLetter />
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

// Saniyelik sayaç kendi bileşeninde: her saniye yalnızca bu küçük kutular
// yeniden render olur, tüm sayfa (bölümler, kalpler, arka plan) değil.
function AnniversaryCounter() {
  const elapsed = useElapsedSince(ANNIVERSARY);
  return (
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
  );
}

export default function Yagmurumm2Page() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const { phase, startStory } = useProposalIntro();

  // 365. günde konfeti: sayfa o an açıksa tam anında, sonradan açılırsa bir kez.
  // Deneme için adrese ?yildonumu=1 eklenir (her seferinde 1.5 sn sonra patlar).
  useEffect(() => {
    if (phase !== "story") return;
    const isTest = new URLSearchParams(window.location.search).has("yildonumu");
    const fire = () => {
      fireGrandFinale(confettiCanvasRef.current);
      try {
        localStorage.setItem(FIRST_YEAR_SEEN_KEY, "1");
      } catch {}
    };
    if (isTest) {
      const id = setTimeout(fire, 1500);
      return () => clearTimeout(id);
    }
    let seen = false;
    try {
      seen = localStorage.getItem(FIRST_YEAR_SEEN_KEY) === "1";
    } catch {}
    if (seen) return;
    const wait = FIRST_YEAR.getTime() - Date.now();
    if (wait <= 0) {
      const id = setTimeout(fire, 1500);
      return () => clearTimeout(id);
    }
    if (wait > 2 ** 31 - 1) return; // setTimeout sınırı (~24 gün) — o zaman sayfa yeniden açılır
    const id = setTimeout(fire, wait);
    return () => clearTimeout(id);
  }, [phase]);

  function handleContinue() {
    fireConfetti(confettiCanvasRef.current);
    scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight, behavior: "smooth" });
  }

  if (phase === "puzzle") return <PuzzleGate onDone={startStory} />;

  if (phase === "intro") {
    return (
      <iframe
        src="/iyikidogdunaskim/intro/index.html"
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
        <div className="absolute left-[10%] top-[15%] h-[32rem] w-[32rem] rounded-full will-change-transform [animation:yagmurumm2-blob-a_14s_ease-in-out_infinite]" style={{ background: "radial-gradient(closest-side, rgba(255,193,212,.75), transparent)" }} />
        <div className="absolute right-[8%] top-[55%] h-[34rem] w-[34rem] rounded-full will-change-transform [animation:yagmurumm2-blob-b_18s_ease-in-out_infinite]" style={{ background: "radial-gradient(closest-side, rgba(255,225,196,.75), transparent)" }} />
        <div className="absolute bottom-[5%] left-[35%] h-[28rem] w-[28rem] rounded-full will-change-transform [animation:yagmurumm2-blob-a_16s_ease-in-out_infinite_reverse]" style={{ background: "radial-gradient(closest-side, rgba(240,182,198,.65), transparent)" }} />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(125% 110% at 50% 38%, transparent 55%, rgba(120,40,50,.08) 100%)" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          {hearts.map((h, i) => (
            <span
              key={i}
              className="absolute bottom-[-10%] opacity-0 will-change-transform [animation-name:yagmurumm2-float] [animation-timing-function:linear] [animation-iteration-count:infinite]"
              style={{ left: h.left, fontSize: h.size, animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
            >
              {h.emoji}
            </span>
          ))}
          {floatingLove.map((w, k) => {
            const item = LOVE_LANGS[w.i] ?? LOVE_LANGS[0];
            return (
              <span
                key={`love-${k}`}
                lang={item.lang}
                dir={item.lang === "ar" ? "rtl" : "ltr"}
                className="absolute bottom-[-10%] whitespace-nowrap opacity-0 will-change-transform [animation-name:yagmurumm2-float] [animation-timing-function:linear] [animation-iteration-count:infinite]"
                style={{
                  left: w.left,
                  fontSize: w.size,
                  fontFamily: LOVE_FONT,
                  color: "rgba(178,42,59,.45)",
                  animationDuration: `${w.duration}s`,
                  animationDelay: `${w.delay}s`,
                }}
              >
                {item.text}
              </span>
            );
          })}
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
            className="max-w-md text-[16px]"
            style={{ color: INK_SOFT }}
          >
            14 Ekim hem senin doğum günün, hem de 2025&apos;ten beri yıldönümümüz — aynı günde iki kat şanslıyım.
          </motion.p>

          <AnniversaryCounter />

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
                <p className="mt-4 text-[16px]" style={{ color: INK_SOFT }}>
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
        @media (prefers-reduced-motion: reduce) {
          [class*="yagmurumm2-"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}



