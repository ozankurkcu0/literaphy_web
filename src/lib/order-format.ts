import type { Expense } from "@/lib/google-sheets";

/** OrdersTable, OrdersOverview ve OrderDetailDialog arasında paylaşılan
 * küçük biçimlendirme yardımcıları. */

export function formatDateDisplay(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

export function formatCurrencyAmount(amount: number, currency: string, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency, ...options }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("tr-TR").format(amount)} ${currency}`;
  }
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/** Bir giderin bir sonraki ödeme/yenileme tarihini hesaplar — tekrar
 * tipine göre "aylık"/"yıllık" için her zaman bugünden itibaren ileriye
 * dönük en yakın tarihi bulur (geçmiş bir tarih asla dönmez), "tek
 * seferlik" için ise sadece kayıtlı tarihi döner (geçmişse de). */
export function getExpenseNextOccurrence(expense: Expense): Date | null {
  if (!expense.dueDate) return null;
  const today = startOfToday();

  if (expense.recurrence === "Aylık") {
    const day = Number(expense.dueDate);
    if (!day || Number.isNaN(day)) return null;
    let candidate = new Date(today.getFullYear(), today.getMonth(), day);
    if (candidate < today) candidate = new Date(today.getFullYear(), today.getMonth() + 1, day);
    return candidate;
  }

  if (expense.recurrence === "Yıllık") {
    const [, month, day] = expense.dueDate.split("-");
    if (!month || !day) return null;
    let candidate = new Date(today.getFullYear(), Number(month) - 1, Number(day));
    if (candidate < today) candidate = new Date(today.getFullYear() + 1, Number(month) - 1, Number(day));
    return candidate;
  }

  const oneTime = new Date(expense.dueDate);
  return Number.isNaN(oneTime.getTime()) ? null : oneTime;
}

/** "Ödeme alındı" işaretlemesi için — hesap kesim tarihini bir ay ileri
 * alır (aynı gün, bir sonraki ay). Ay sonu taşmalarını (ör. 31 Ocak → Şubat'ta
 * 31 yok) JS'nin Date normalizasyonuna bırakıyoruz (31 Ocak + 1 ay → 2/3
 * Mart gibi bir sonraki ayın son gününe düşer, kabul edilebilir bir yaklaşım). */
export function addOneMonth(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const next = new Date(year, month - 1 + 1, day);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatExpenseSchedule(expense: Expense): string {
  if (expense.recurrence === "Aylık") {
    return expense.dueDate ? `Her ayın ${expense.dueDate}'i` : "Aylık";
  }
  if (expense.recurrence === "Yıllık") {
    if (!expense.dueDate) return "Yıllık";
    const [, month, day] = expense.dueDate.split("-");
    return month && day ? `Her yıl ${day}.${month}` : "Yıllık";
  }
  return expense.dueDate ? formatDateDisplay(expense.dueDate) : "Tek seferlik";
}
