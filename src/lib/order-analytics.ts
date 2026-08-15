import type { Currency, Expense, Order, Status } from "@/lib/google-sheets";

/** Analiz sayfası için dönem/para birimi filtrelerine göre sipariş ve
 * gider verisini aylık kovalara toplayan saf yardımcı fonksiyonlar —
 * hiçbir API çağrısı yapmaz, zaten yüklenmiş listeler üzerinde çalışır. */

export type PeriodPreset = "this-month" | "last-3-months" | "last-6-months" | "this-year" | "all-time";

export const PERIOD_PRESET_OPTIONS: { label: string; value: PeriodPreset }[] = [
  { label: "Bu ay", value: "this-month" },
  { label: "Son 3 ay", value: "last-3-months" },
  { label: "Son 6 ay", value: "last-6-months" },
  { label: "Bu yıl", value: "this-year" },
  { label: "Tüm zamanlar", value: "all-time" },
];

export interface PeriodRange {
  start: Date | null; // null = alt sınır yok (tüm zamanlar)
  end: Date;
}

export function resolvePeriodRange(preset: PeriodPreset): PeriodRange {
  const now = new Date();
  switch (preset) {
    case "this-month":
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    case "last-3-months":
      return { start: new Date(now.getFullYear(), now.getMonth() - 2, 1), end: now };
    case "last-6-months":
      return { start: new Date(now.getFullYear(), now.getMonth() - 5, 1), end: now };
    case "this-year":
      return { start: new Date(now.getFullYear(), 0, 1), end: now };
    case "all-time":
      return { start: null, end: now };
  }
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isWithinRange(dateStr: string, range: PeriodRange): boolean {
  const date = parseDate(dateStr);
  if (!date) return false;
  if (range.start && date < range.start) return false;
  if (date > range.end) return false;
  return true;
}

export interface MonthBucket {
  key: string; // "2026-08"
  label: string; // "Ağu 2026"
  date: Date;
}

const monthLabelFormatter = new Intl.DateTimeFormat("tr-TR", { month: "short", year: "numeric" });

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Seçili aralığı ay ay listeler. "Tüm zamanlar" için alt sınır, veri
 * içindeki en eski tarihten (sipariş başlama / tek seferlik gider tarihi)
 * türetilir — hiç veri yoksa son 6 ayı gösterir. */
export function buildMonthBuckets(range: PeriodRange, orders: Order[], expenses: Expense[]): MonthBucket[] {
  let start = range.start;

  if (!start) {
    const candidateDates: Date[] = [];
    for (const order of orders) {
      const date = parseDate(order.startDate);
      if (date) candidateDates.push(date);
    }
    for (const expense of expenses) {
      if (expense.recurrence === "Tek seferlik") {
        const date = parseDate(expense.dueDate);
        if (date) candidateDates.push(date);
      }
    }
    start =
      candidateDates.length > 0
        ? new Date(Math.min(...candidateDates.map((d) => d.getTime())))
        : new Date(range.end.getFullYear(), range.end.getMonth() - 5, 1);
  }

  const months: MonthBucket[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(range.end.getFullYear(), range.end.getMonth(), 1);
  // Makul olmayan geniş aralıklarda (ör. hatalı tarih girişi) sonsuz döngüyü önle.
  let guard = 0;
  while (cursor <= last && guard < 240) {
    months.push({ key: monthKey(cursor), label: monthLabelFormatter.format(cursor), date: new Date(cursor) });
    cursor.setMonth(cursor.getMonth() + 1);
    guard++;
  }
  return months;
}

export interface MonthlyFinancePoint {
  key: string;
  label: string;
  income: number;
  expense: number;
}

/** Aylık gelir/gider toplamı. Gelir, siparişin başlama tarihine göre o aya
 * yazılır (İptal hariç). Gider, tekrar tipine göre değişir: Aylık ise
 * aralıktaki her aya, Yıllık ise ay/gün eşleşen aya, Tek seferlik ise
 * kayıtlı tarihin ayına eklenir. */
export function buildMonthlyFinance(
  months: MonthBucket[],
  orders: Order[],
  expenses: Expense[],
  currency: Currency,
): MonthlyFinancePoint[] {
  const income = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "İptal" || order.currency !== currency || !order.fee) continue;
    const date = parseDate(order.startDate);
    if (!date) continue;
    const key = monthKey(date);
    const amount = Number(order.fee);
    if (Number.isNaN(amount)) continue;
    income.set(key, (income.get(key) ?? 0) + amount);
  }

  const expense = new Map<string, number>();
  const monthKeySet = new Set(months.map((m) => m.key));
  for (const item of expenses) {
    if (item.currency !== currency || !item.amount) continue;
    const amount = Number(item.amount);
    if (Number.isNaN(amount)) continue;

    if (item.recurrence === "Aylık") {
      for (const key of monthKeySet) expense.set(key, (expense.get(key) ?? 0) + amount);
    } else if (item.recurrence === "Yıllık") {
      const [, mm] = item.dueDate.split("-");
      if (!mm) continue;
      for (const month of months) {
        if (String(month.date.getMonth() + 1).padStart(2, "0") === mm) {
          expense.set(month.key, (expense.get(month.key) ?? 0) + amount);
        }
      }
    } else {
      const date = parseDate(item.dueDate);
      if (!date) continue;
      const key = monthKey(date);
      if (monthKeySet.has(key)) expense.set(key, (expense.get(key) ?? 0) + amount);
    }
  }

  return months.map((month) => ({
    key: month.key,
    label: month.label,
    income: income.get(month.key) ?? 0,
    expense: expense.get(month.key) ?? 0,
  }));
}

export interface ServiceRevenuePoint {
  service: string;
  amount: number;
}

export function buildServiceRevenue(orders: Order[], range: PeriodRange, currency: Currency): ServiceRevenuePoint[] {
  const totals = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "İptal" || order.currency !== currency || !order.fee) continue;
    if (!isWithinRange(order.startDate, range)) continue;
    const amount = Number(order.fee);
    if (Number.isNaN(amount)) continue;
    totals.set(order.serviceType, (totals.get(order.serviceType) ?? 0) + amount);
  }
  return [...totals.entries()]
    .map(([service, amount]) => ({ service, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildStatusCounts(orders: Order[], range: PeriodRange): Record<Status, number> {
  const counts: Record<Status, number> = { Aktif: 0, Tamamlandı: 0, İptal: 0 };
  for (const order of orders) {
    if (!isWithinRange(order.startDate, range)) continue;
    counts[order.status] += 1;
  }
  return counts;
}

export function availableCurrencies(orders: Order[], expenses: Expense[]): Currency[] {
  const set = new Set<Currency>(["TRY"]);
  for (const order of orders) set.add(order.currency);
  for (const expense of expenses) set.add(expense.currency);
  return [...set];
}
