import { BookOpen, ClipboardCheck, Dumbbell, PenSquare, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { TimelineKind, Weekday } from "@/lib/calisma-program-constants";

export type { TimelineKind };

/** Etkinlik tipine (+ ders programı satırları için "Ders" dahil) göre
 * renk/ikon eşlemesi — panelin "renkli öğrenci paneli" temasının tek
 * kaynağı. */

interface TypeMeta {
  label: string;
  icon: LucideIcon;
  dot: string;
  badge: string;
}

export const TIMELINE_TYPE_META: Record<TimelineKind, TypeMeta> = {
  Ders: { label: "Ders", icon: BookOpen, dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  Sınav: { label: "Sınav", icon: PenSquare, dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
  Quiz: {
    label: "Quiz",
    icon: ClipboardCheck,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Spor: { label: "Spor", icon: Dumbbell, dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  Toplantı: {
    label: "Toplantı",
    icon: Users,
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Diğer: { label: "Diğer", icon: Sparkles, dot: "bg-pink-500", badge: "bg-pink-50 text-pink-700 border-pink-200" },
};

export const WEEKDAY_SHORT: Record<string, string> = {
  Pazartesi: "Pzt",
  Salı: "Sal",
  Çarşamba: "Çar",
  Perşembe: "Per",
  Cuma: "Cum",
  Cumartesi: "Cmt",
  Pazar: "Paz",
};

/** JS'in Date.getDay() (0=Pazar..6=Cumartesi) sırasını WEEKDAYS (Pazartesi
 * başlangıçlı) sırasına çevirir. */
export function jsDayToWeekday(jsDay: number): Weekday {
  const order = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"] as const;
  return order[jsDay] as Weekday;
}

export function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIso(): string {
  return dateToIso(new Date());
}

/** Verilen tarihin (Pazartesi başlangıçlı) hafta başlangıcını ISO tarih
 * olarak döner — haftalık notlar bu değere göre gruplanır. */
export function weekStartIso(date: Date): string {
  const jsDay = date.getDay();
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  return dateToIso(monday);
}

export function currentWeekStartIso(): string {
  return weekStartIso(new Date());
}

/** "16–22 Haziran" gibi okunabilir bir hafta aralığı etiketi üretir. */
export function weekRangeLabel(weekStartIsoValue: string): string {
  const start = new Date(`${weekStartIsoValue}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: sameMonth ? undefined : "long",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" }).format(end);
  return `${startLabel}–${endLabel}`;
}
