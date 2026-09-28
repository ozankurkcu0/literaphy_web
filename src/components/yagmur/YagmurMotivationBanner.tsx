"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { YAGMUR_MOTIVATION_QUOTES } from "@/lib/yagmur-motivation";

const ROTATE_MS = 9000;

export function YagmurMotivationBanner() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * YAGMUR_MOTIVATION_QUOTES.length));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % YAGMUR_MOTIVATION_QUOTES.length);
        setVisible(true);
      }, 300);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-pink-200/70 bg-white/60 px-5 py-3.5 shadow-sm">
      <Sparkles className="size-4 shrink-0 text-pink-400" aria-hidden />
      <p
        className={cn(
          "text-[13.5px] font-medium text-rose-800 transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        {YAGMUR_MOTIVATION_QUOTES[index]}
      </p>
    </div>
  );
}
