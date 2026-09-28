"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Circle, PiggyBank } from "lucide-react";
import { cardSurfaceClass, cn } from "@/lib/utils";

// Bırakma anı — sayfa ilk oluşturulduğu tarih/saat.
const QUIT_AT = new Date(2026, 8, 28, 15, 25, 0);
const PACKS_PER_DAY = 1;
const PRICE_PER_PACK_TL = 130;

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

interface Milestone {
  label: string;
  detail: string;
  thresholdMs: number;
}

// Sigarayı bırakma sonrası vücuttaki değişim zaman çizelgesi — yaygın kabul
// gören halk sağlığı kaynaklarındaki (WHO, CDC, NHS) süreler baz alındı.
const MILESTONES: Milestone[] = [
  { label: "20 dakika", detail: "Nabız ve tansiyon normale dönmeye başlar.", thresholdMs: 20 * MINUTE_MS },
  { label: "12 saat", detail: "Kandaki karbon monoksit seviyesi normale döner.", thresholdMs: 12 * HOUR_MS },
  { label: "24 saat", detail: "Kalp krizi riski düşmeye başlar.", thresholdMs: 1 * DAY_MS },
  { label: "48 saat", detail: "Tat ve koku alma duyusu belirgin şekilde keskinleşir.", thresholdMs: 2 * DAY_MS },
  { label: "72 saat", detail: "Bronşlar gevşer, nefes almak kolaylaşır, enerji artar.", thresholdMs: 3 * DAY_MS },
  { label: "2 hafta", detail: "Kan dolaşımı iyileşir, yürüyüş/egzersiz belirgin kolaylaşır.", thresholdMs: 14 * DAY_MS },
  { label: "1 ay", detail: "Akciğer fonksiyonu artmaya, öksürük ve nefes darlığı azalmaya başlar.", thresholdMs: 30 * DAY_MS },
  { label: "3 ay", detail: "Akciğerdeki silialar (mikro tüycükler) yenilenir, enfeksiyon riski azalır.", thresholdMs: 90 * DAY_MS },
  { label: "9 ay", detail: "Akciğer kapasitesi yaklaşık %10 artar, öksürük ve yorgunluk büyük ölçüde azalır.", thresholdMs: 270 * DAY_MS },
  { label: "1 yıl", detail: "Kalp hastalığı riski, sigara içenlere göre yarıya iner.", thresholdMs: 365 * DAY_MS },
  { label: "5 yıl", detail: "İnme (felç) riski, hiç içmemiş biriyle aynı seviyeye yaklaşır.", thresholdMs: 5 * 365 * DAY_MS },
  { label: "10 yıl", detail: "Akciğer kanseri riski, sigara içenlere göre yaklaşık yarıya iner.", thresholdMs: 10 * 365 * DAY_MS },
];

function useElapsedSince(date: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;
  return Math.max(now - date.getTime(), 0);
}

function formatElapsed(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS = [
  { key: "days", label: "gün" },
  { key: "hours", label: "saat" },
  { key: "minutes", label: "dakika" },
  { key: "seconds", label: "saniye" },
] as const;

export function SigaraTracker() {
  const elapsedMs = useElapsedSince(QUIT_AT);
  const elapsed = elapsedMs === null ? null : formatElapsed(elapsedMs);
  const savedTl = elapsedMs === null ? null : (elapsedMs / DAY_MS) * PACKS_PER_DAY * PRICE_PER_PACK_TL;

  return (
    <div className="flex flex-col gap-6">
      <div className={cn(cardSurfaceClass, "p-6 text-center")}>
        <p className="text-[13px] text-foreground-muted">Sigarasız geçen süre</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          {UNITS.map((unit) => (
            <div key={unit.key} className="flex flex-col items-center gap-1">
              <span className="text-[28px] font-semibold tabular-nums text-foreground">
                {elapsed ? String(elapsed[unit.key]).padStart(2, "0") : "--"}
              </span>
              <span className="text-[11px] text-foreground-muted">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(cardSurfaceClass, "flex items-center gap-4 p-5")}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-elevated">
          <PiggyBank className="size-5 text-foreground-muted" aria-hidden />
        </span>
        <div>
          <p className="text-[13px] text-foreground-muted">Şimdiye kadar biriken para</p>
          <p className="text-[20px] font-semibold text-foreground">
            {savedTl === null ? "—" : `${savedTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`}
          </p>
        </div>
      </div>

      <div className={cn(cardSurfaceClass, "p-5")}>
        <p className="mb-4 text-[13px] font-medium text-foreground-secondary">Vücutta neler değişiyor</p>
        <ul className="flex flex-col gap-3">
          {MILESTONES.map((milestone) => {
            const reached = elapsedMs !== null && elapsedMs >= milestone.thresholdMs;
            const Icon = reached ? CircleCheck : Circle;
            return (
              <li key={milestone.label} className="flex items-start gap-3">
                <Icon
                  className={cn("mt-0.5 size-[18px] shrink-0", reached ? "text-success" : "text-foreground-muted/50")}
                  aria-hidden
                />
                <div>
                  <p className={cn("text-[13.5px] font-medium", reached ? "text-foreground" : "text-foreground-muted")}>
                    {milestone.label}
                  </p>
                  <p className="text-[13px] text-foreground-muted">{milestone.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
