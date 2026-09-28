"use client";

import { YagmurExamCountdown } from "@/components/yagmur/YagmurExamCountdown";
import { YagmurMotivationBanner } from "@/components/yagmur/YagmurMotivationBanner";
import { YagmurGoals } from "@/components/yagmur/YagmurGoals";
import { YagmurStudyChecklist } from "@/components/yagmur/YagmurStudyChecklist";

export function YagmurProgramEditor() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-semibold text-rose-950">Yağmur&apos;un Programı 🌸</h1>
        <p className="mt-1 text-[14px] text-rose-700/70">Proficiency&apos;e hazırlık — sınav, hedefler ve haftalık çalışma tek yerde.</p>
      </div>

      <YagmurExamCountdown />
      <YagmurMotivationBanner />
      <YagmurGoals />
      <YagmurStudyChecklist />
    </div>
  );
}
