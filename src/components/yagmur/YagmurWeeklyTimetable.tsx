"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { YAGMUR_TYPE_META } from "@/lib/yagmur-theme";
import { WEEKDAYS } from "@/lib/calisma-program-constants";
import type { YagmurScheduleEntry, Weekday } from "@/lib/google-sheets";

function timeToMinutes(time: string): number {
  const [h = NaN, m = NaN] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/** GTÜ'nün sabit periyotlarının aksine burada tamamen kişisel bir program
 * söz konusu — hangi okul/saat düzeni olduğunu bilmediğimiz için satırlar
 * baştan sabit değil, tamamen eklenen kayıtların kendi saatlerinden
 * türetiliyor (aynı mantıkla üst üste binen saatler kendi satırını alır). */
function buildPeriods(entries: YagmurScheduleEntry[]): { start: string; end: string }[] {
  const periods: { start: string; end: string }[] = [];
  for (const entry of entries) {
    if (!entry.startTime || !entry.endTime) continue;
    const coveredByExisting = periods.some(
      (period) => timeToMinutes(entry.startTime) <= timeToMinutes(period.start) && timeToMinutes(entry.endTime) >= timeToMinutes(period.end),
    );
    if (!coveredByExisting) {
      periods.push({ start: entry.startTime, end: entry.endTime });
    }
  }
  return periods.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

function findEntry(entries: YagmurScheduleEntry[], day: Weekday, period: { start: string; end: string }) {
  const periodStart = timeToMinutes(period.start);
  const periodEnd = timeToMinutes(period.end);
  return entries.find(
    (entry) =>
      entry.weekday === day &&
      timeToMinutes(entry.startTime) <= periodStart &&
      timeToMinutes(entry.endTime) >= periodEnd,
  );
}

export function YagmurWeeklyTimetable({
  entries,
  onEditEntry,
  onDeleteEntry,
}: {
  entries: YagmurScheduleEntry[];
  onEditEntry: (entry: YagmurScheduleEntry) => void;
  onDeleteEntry: (entry: YagmurScheduleEntry) => void;
}) {
  const weekendHasEntries = entries.some((entry) => entry.weekday === "Cumartesi" || entry.weekday === "Pazar");
  const visibleDays = weekendHasEntries ? WEEKDAYS : WEEKDAYS.slice(0, 5);
  const periods = buildPeriods(entries);

  if (periods.length === 0) {
    return (
      <div className="rounded-2xl border border-pink-200/70 bg-white/70 px-6 py-16 text-center shadow-sm">
        <p className="text-[15px] font-medium text-rose-900">Henüz bir şey eklemedin 🌸</p>
        <p className="mt-1 text-[13px] text-rose-700/70">Aşağıdaki formdan ilk dersini ekleyerek başla.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-pink-200/70 bg-white/70 shadow-sm">
      <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-16" />
          {visibleDays.map((day) => (
            <col key={day} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-pink-200/70 bg-pink-50/70">
            <th className="px-3 py-2.5 text-[11.5px] font-semibold text-rose-700/70">Saat</th>
            {visibleDays.map((day) => (
              <th key={day} className="border-l border-pink-200/70 px-3 py-2.5 text-[13px] font-semibold text-rose-900">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period, index) => (
            <tr key={period.start} className={cn(index > 0 && "border-t border-pink-100")}>
              <td className="whitespace-nowrap px-3 py-2 align-top text-[11px] text-rose-700/60">
                {period.start}
                <br />
                {period.end}
              </td>
              {visibleDays.map((day) => {
                const entry = findEntry(entries, day, period);
                const meta = entry ? YAGMUR_TYPE_META[entry.kind] : null;
                return (
                  <td key={day} className="border-l border-pink-100 p-1 align-top">
                    {entry && meta ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onEditEntry(entry)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") onEditEntry(entry);
                        }}
                        className={cn(
                          "group relative cursor-pointer rounded-lg border px-2 py-1.5 transition-[filter] hover:brightness-95",
                          meta.badge,
                        )}
                      >
                        <p className="truncate pr-4 text-[11.5px] font-semibold text-current">{entry.title}</p>
                        {entry.location && <p className="truncate text-[10.5px] opacity-70">{entry.location}</p>}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteEntry(entry);
                          }}
                          className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded text-current opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                          aria-label={`${entry.title} kaydını sil`}
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </div>
                    ) : (
                      <div className="min-h-[42px]" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
