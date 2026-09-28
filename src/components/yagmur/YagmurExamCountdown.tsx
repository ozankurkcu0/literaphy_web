"use client";

import { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { YAGMUR_EXAM } from "@/lib/yagmur-motivation";

function daysUntil(dateStr: string): number {
  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

const EXAM_DATE_LABEL = new Date(`${YAGMUR_EXAM.date}T00:00:00`).toLocaleDateString("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function YagmurExamCountdown() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    setDaysLeft(daysUntil(YAGMUR_EXAM.date));
  }, []);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-pink-200/70 bg-gradient-to-r from-rose-100 via-pink-50 to-purple-100 px-5 py-4 shadow-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-rose-500">
        <CalendarHeart className="size-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-rose-700/80">
          {YAGMUR_EXAM.name} · {EXAM_DATE_LABEL}
        </p>
        <p className="text-[20px] font-semibold text-rose-950">
          {daysLeft === null ? "…" : daysLeft > 0 ? `${daysLeft} gün kaldı` : daysLeft === 0 ? "Bugün! 🍀" : "Sınav geçti"}
        </p>
      </div>
    </div>
  );
}
