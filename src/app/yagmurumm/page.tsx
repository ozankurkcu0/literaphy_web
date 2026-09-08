import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yağmurumm",
  robots: { index: false, follow: false },
};

// Basit sabit "rastgele" değerler — server component'te Math.random()
// kullanmamak için elle serpiştirildi, her render'da aynı kalır.
const hearts = [
  { left: "3%", size: 16, duration: 10, delay: 0, emoji: "💗" },
  { left: "9%", size: 22, duration: 13, delay: 2.2, emoji: "💖" },
  { left: "16%", size: 14, duration: 9, delay: 4.6, emoji: "💕" },
  { left: "24%", size: 26, duration: 15, delay: 1.1, emoji: "💗" },
  { left: "31%", size: 18, duration: 11, delay: 6, emoji: "💘" },
  { left: "38%", size: 20, duration: 12.5, delay: 3.4, emoji: "💖" },
  { left: "46%", size: 15, duration: 9.5, delay: 0.8, emoji: "💕" },
  { left: "53%", size: 24, duration: 14, delay: 5.2, emoji: "💗" },
  { left: "60%", size: 17, duration: 10.5, delay: 2.8, emoji: "💘" },
  { left: "67%", size: 21, duration: 12, delay: 7.1, emoji: "💖" },
  { left: "74%", size: 15, duration: 9.2, delay: 1.6, emoji: "💕" },
  { left: "81%", size: 25, duration: 13.5, delay: 4.1, emoji: "💗" },
  { left: "88%", size: 18, duration: 11.5, delay: 0.3, emoji: "💘" },
  { left: "94%", size: 20, duration: 10.8, delay: 5.9, emoji: "💖" },
  { left: "12%", size: 13, duration: 8.5, delay: 8.3, emoji: "💕" },
  { left: "44%", size: 16, duration: 9.8, delay: 9.4, emoji: "💗" },
  { left: "70%", size: 14, duration: 8.8, delay: 6.7, emoji: "💘" },
  { left: "27%", size: 19, duration: 11.2, delay: 10.2, emoji: "💖" },
];

export default function YagmurummPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#3b0d24] via-[#8a1f52] to-[#ff85b3] px-6 py-24 text-center">
      {/* köşelerde yumuşak ışık lekeleri */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-400/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rose-300/25 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-[110px]" />

      {/* yükselen kalpler */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        {hearts.map((h, i) => (
          <span
            key={i}
            className="absolute bottom-[-10%] opacity-0 [animation-name:yagmurumm-float] [animation-timing-function:linear] [animation-iteration-count:infinite]"
            style={{
              left: h.left,
              fontSize: h.size,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-xl">
        <p className="text-[13px] font-medium uppercase tracking-[0.35em] text-pink-100/80">yağmurumm</p>
        <h1 className="mt-5 text-[clamp(2rem,7vw,3.75rem)] font-semibold leading-[1.15] text-white drop-shadow-[0_2px_24px_rgba(255,0,120,0.5)]">
          Yağmurumu <span className="text-pink-200">çok</span> seviyorum
        </h1>
        <p className="mt-6 text-lg text-pink-50/90">Bu sayfa sadece bunu söylemek için var. 💗</p>
      </div>

      <style>{`
        @keyframes yagmurumm-float {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          8% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-115vh) scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
