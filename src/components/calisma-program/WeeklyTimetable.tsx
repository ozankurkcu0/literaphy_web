"use client";

import { X } from "lucide-react";
import { cardSurfaceClass, cn } from "@/lib/utils";
import { TIMELINE_TYPE_META } from "@/lib/calisma-program-meta";
import { WEEKDAYS } from "@/lib/calisma-program-constants";
import type { ClassScheduleEntry, Weekday } from "@/lib/google-sheets";

// GTÜ OBS "Ders Programı" çıktısındaki sabit periyotlarla birebir aynı —
// öğle arası (12:20-13:30) dahil, PDF çıktısıyla aynı satır yapısı.
const PERIODS = [
  { start: "08:30", end: "09:20" },
  { start: "09:30", end: "10:20" },
  { start: "10:30", end: "11:20" },
  { start: "11:30", end: "12:20" },
  { start: "13:30", end: "14:20" },
  { start: "14:30", end: "15:20" },
  { start: "15:30", end: "16:20" },
  { start: "16:30", end: "17:20" },
] as const;

function timeToMinutes(time: string): number {
  const [h = NaN, m = NaN] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/** Bir periyodu tamamen kapsayan dersi bulur — PDF'teki gibi, iki periyot
 * süren bir ders her iki satırda da (aynı hücre içeriğiyle) tekrar eder. */
function findEntry(entries: ClassScheduleEntry[], day: Weekday, period: { start: string; end: string }) {
  const periodStart = timeToMinutes(period.start);
  const periodEnd = timeToMinutes(period.end);
  return entries.find(
    (entry) =>
      entry.weekday === day &&
      timeToMinutes(entry.startTime) <= periodStart &&
      timeToMinutes(entry.endTime) >= periodEnd,
  );
}

/** Sabit GTÜ periyotlarının dışına düşen kayıtlar (ör. akşam sporu gibi
 * standart ders periyoduna hiç denk gelmeyen kişisel aktiviteler) için
 * kendi saatiyle ek bir satır ekler — aksi halde tabloda hiç görünmezler. */
function buildPeriods(entries: ClassScheduleEntry[]): { start: string; end: string }[] {
  const periods: { start: string; end: string }[] = [...PERIODS];
  for (const entry of entries) {
    const coveredByExisting = periods.some(
      (period) => timeToMinutes(entry.startTime) <= timeToMinutes(period.start) && timeToMinutes(entry.endTime) >= timeToMinutes(period.end),
    );
    if (!coveredByExisting && entry.startTime && entry.endTime) {
      periods.push({ start: entry.startTime, end: entry.endTime });
    }
  }
  return periods.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

export function WeeklyTimetable({
  entries,
  onEditEntry,
  onDeleteEntry,
}: {
  entries: ClassScheduleEntry[];
  onEditEntry: (entry: ClassScheduleEntry) => void;
  onDeleteEntry: (entry: ClassScheduleEntry) => void;
}) {
  const weekendHasEntries = entries.some((entry) => entry.weekday === "Cumartesi" || entry.weekday === "Pazar");
  const visibleDays = weekendHasEntries ? WEEKDAYS : WEEKDAYS.slice(0, 5);
  const periods = buildPeriods(entries);

  return (
    <div className={`${cardSurfaceClass} overflow-x-auto`}>
      <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-16" />
          {visibleDays.map((day) => (
            <col key={day} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-hairline bg-surface">
            <th className="px-3 py-2.5 text-[11.5px] font-semibold text-foreground-muted">Saat</th>
            {visibleDays.map((day) => (
              <th key={day} className="border-l border-hairline px-3 py-2.5 text-[13px] font-semibold text-foreground">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period, index) => (
            <tr key={period.start} className={cn(index > 0 && "border-t border-hairline")}>
              <td className="whitespace-nowrap px-3 py-2 align-top text-[11px] text-foreground-muted">
                {period.start}
                <br />
                {period.end}
              </td>
              {visibleDays.map((day) => {
                const entry = findEntry(entries, day, period);
                const meta = entry ? TIMELINE_TYPE_META[entry.kind] : null;
                return (
                  <td key={day} className="border-l border-hairline p-1 align-top">
                    {entry && meta ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onEditEntry(entry)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") onEditEntry(entry);
                        }}
                        className={cn(
                          "group relative cursor-pointer rounded-md border px-2 py-1.5 transition-[filter] hover:brightness-95",
                          meta.badge,
                        )}
                      >
                        <p className="truncate pr-4 text-[11.5px] font-semibold text-foreground">{entry.courseName}</p>
                        {entry.location && <p className="truncate text-[10.5px] text-foreground-muted">{entry.location}</p>}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteEntry(entry);
                          }}
                          className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded text-foreground-muted opacity-0 transition-opacity hover:bg-black/10 hover:text-foreground group-hover:opacity-100"
                          aria-label={`${entry.courseName} kaydını sil`}
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
