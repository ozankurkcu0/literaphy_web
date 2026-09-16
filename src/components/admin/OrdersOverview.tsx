"use client";

import { useState } from "react";
import { AlertTriangle, Check, ClipboardList, TrendingDown, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cardSurfaceClass } from "@/lib/utils";
import { isOneTimeServiceType } from "@/lib/order-form-options";
import { addOneMonth, dateToIso, formatCurrencyAmount, getExpenseNextOccurrence } from "@/lib/order-format";
import type { Expense, Order } from "@/lib/google-sheets";

function formatCurrencyTotal(amount: number, currency: string): string {
  return formatCurrencyAmount(amount, currency, { maximumFractionDigits: 0 });
}

function sumByCurrency<T extends { amount?: string; fee?: string; currency: string }>(
  items: T[],
  amountOf: (item: T) => string,
): string {
  const totals = new Map<string, number>();
  for (const item of items) {
    const raw = amountOf(item);
    if (!raw) continue;
    const amount = Number(raw);
    if (Number.isNaN(amount)) continue;
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + amount);
  }
  if (totals.size === 0) return "—";
  return [...totals.entries()].map(([currency, amount]) => formatCurrencyTotal(amount, currency)).join(" · ");
}

function reminderLabel(diffDays: number): string {
  if (diffDays < 0) return `${Math.abs(diffDays)} gün gecikti`;
  if (diffDays === 0) return "bugün";
  return `${diffDays} gün kaldı`;
}

interface ReminderItem {
  key: string;
  title: string;
  subtitle: string;
  diffDays: number;
  onMarkPaid?: () => void; // varsa aksiyon butonu gösterilir
  actionLabel?: string; // buton metni, belirtilmezse "Ödendi"
}

function ReminderPanel({
  title,
  items,
  markingKey,
}: {
  title: string;
  items: ReminderItem[];
  markingKey?: string | null;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-warning/25 bg-warning/5 px-5 py-4">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-warning">
        <AlertTriangle className="size-4" aria-hidden />
        {title}
      </div>
      <ul className="flex flex-col gap-1.5 text-[13.5px]">
        {items.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-3">
            <span className="text-foreground-secondary">
              {item.title} <span className="text-foreground-muted">· {item.subtitle}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className={item.diffDays < 0 ? "font-medium text-danger" : "font-medium text-warning"}>
                {reminderLabel(item.diffDays)}
              </span>
              {item.onMarkPaid && (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  className="h-7 px-2.5 text-[12px]"
                  disabled={markingKey === item.key}
                  onClick={item.onMarkPaid}
                >
                  <Check className="size-3.5" aria-hidden />
                  {markingKey === item.key ? "İşaretleniyor…" : (item.actionLabel ?? "Ödendi")}
                </Button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface OrdersOverviewProps {
  orders: Order[];
  expenses: Expense[];
  onOrderUpdated?: () => void;
  onExpenseUpdated?: () => void;
}

/** Sipariş listesinin üstündeki özet: toplam/aktif sayılar, gelir/gider
 * toplamları ve üç ayrı bölüm halinde hatırlatmalar — "Planlanan satışlar"
 * (Planlandı durumundaki, henüz ödeme/teslim yapılmayan siparişler),
 * "Gelir" (hesap kesim tarihleri) ve "Gider" (hosting/domain vb. ödemeler).
 * Planlanan satışlarda "Teslim edildi" butonu siparişi Aktif'e geçirip bir
 * sonraki hesap kesimini bir ay ileri atar; Gelir hatırlatmalarında "Ödendi"
 * butonu hesap kesim tarihini bir ay ileri alıp o siparişi bir sonraki
 * döneme taşır; gider hatırlatmalarında ise ilgili giderin son ödeme
 * tarihini bugüne çeker (bkz. getExpenseNextOccurrence). "Toplam gelir"
 * kartı Planlandı siparişlerin ücretini ana toplama katmaz — henüz
 * gerçekleşmemiş bir gelir olduğu için ayrı bir "planlanan" rakamı olarak
 * parantez içinde gösterilir. Ekstra veri çekmez, zaten yüklenmiş
 * listelerden hesaplar. */
export function OrdersOverview({ orders, expenses, onOrderUpdated, onExpenseUpdated }: OrdersOverviewProps) {
  const [markingKey, setMarkingKey] = useState<string | null>(null);

  async function handleMarkOrderPaid(order: Order) {
    const key = `order:${order.orderNumber}`;
    setMarkingKey(key);
    try {
      // Tek seferlik ürünlerde (Google Review/Instagram NFC kartı) hesap
      // kesim tarihi bir sonraki aya devretmez — ödeme tarihinde sabitlenir
      // ve sipariş tamamlanmış sayılır, bkz. isOneTimeServiceType. "Planlandı"
      // siparişlerde bu buton "teslim edildi + ödeme alındı" anlamına gelir:
      // sipariş Aktif'e geçer ve bir sonraki hesap kesimi (hesap kesim tarihi
      // hiç girilmemişse başlama tarihinden) bir ay ileri atılır.
      const patch = isOneTimeServiceType(order.serviceType)
        ? { billingDate: dateToIso(new Date()), status: "Tamamlandı" }
        : order.status === "Planlandı"
          ? { billingDate: addOneMonth(order.billingDate || order.startDate), status: "Aktif" }
          : { billingDate: addOneMonth(order.billingDate) };
      const response = await fetch(`/api/admin/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error ?? "İşaretlenemedi.");
        return;
      }
      onOrderUpdated?.();
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    } finally {
      setMarkingKey(null);
    }
  }

  async function handleMarkExpensePaid(expense: Expense, occurrence: Date) {
    const key = `expense:${expense.expenseId}`;
    setMarkingKey(key);
    try {
      const response = await fetch(`/api/admin/orders/${expense.orderNumber}/expenses/${expense.expenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastPaidDate: dateToIso(occurrence) }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error ?? "İşaretlenemedi.");
        return;
      }
      onExpenseUpdated?.();
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    } finally {
      setMarkingKey(null);
    }
  }

  const activeOrders = orders.filter((order) => order.status === "Aktif");
  const activeOrderNumbers = new Set(activeOrders.map((order) => order.orderNumber));
  const ordersByNumber = new Map(orders.map((order) => [order.orderNumber, order]));

  // "Planlandı": müşteriyle ileri bir tarih için anlaşıldı ama o tarihe
  // kadar ne ödeme alındı ne de ürün/hizmet teslim edildi — henüz gerçekleşmemiş
  // bir gelir olduğu için "Toplam gelir"e dahil edilmez, ayrı bir "planlanan"
  // rakamı olarak parantez içinde gösterilir (bkz. StatCard hint).
  const revenueLabel = sumByCurrency(
    orders.filter((order) => order.status !== "İptal" && order.status !== "Planlandı"),
    (order) => order.fee,
  );
  const expenseLabel = sumByCurrency(expenses, (expense) => expense.amount);

  const now = Date.now();

  const scheduledOrders = orders.filter((order) => order.status === "Planlandı");
  const scheduledRevenueRaw = sumByCurrency(scheduledOrders, (order) => order.fee);
  const scheduledRevenueLabel = scheduledRevenueRaw === "—" ? null : `+${scheduledRevenueRaw} planlanan`;

  const scheduledReminders: ReminderItem[] = scheduledOrders
    .filter((order) => order.startDate)
    .map((order) => ({
      key: `order:${order.orderNumber}`,
      title: `${order.firstName} ${order.lastName}`,
      subtitle: `#${order.orderNumber}`,
      diffDays: Math.floor((new Date(order.startDate).getTime() - now) / 86_400_000),
      actionLabel: "Teslim edildi",
      onMarkPaid: () => {
        void handleMarkOrderPaid(order);
      },
    }))
    .sort((a, b) => a.diffDays - b.diffDays);

  const incomeReminders: ReminderItem[] = activeOrders
    .filter((order) => order.billingDate)
    .map((order) => ({
      key: `order:${order.orderNumber}`,
      title: `${order.firstName} ${order.lastName}`,
      subtitle: `#${order.orderNumber}`,
      diffDays: Math.floor((new Date(order.billingDate).getTime() - now) / 86_400_000),
      onMarkPaid: () => {
        void handleMarkOrderPaid(order);
      },
    }))
    .filter((item) => item.diffDays <= 7)
    .sort((a, b) => a.diffDays - b.diffDays);

  const expenseReminders: ReminderItem[] = expenses
    .filter((expense) => activeOrderNumbers.has(expense.orderNumber))
    .map((expense): ReminderItem | null => {
      const nextOccurrence = getExpenseNextOccurrence(expense);
      if (!nextOccurrence) return null;
      const order = ordersByNumber.get(expense.orderNumber);
      const customerName = order ? `${order.firstName} ${order.lastName}` : `#${expense.orderNumber}`;
      return {
        key: `expense:${expense.expenseId}`,
        title: expense.name,
        subtitle: customerName,
        diffDays: Math.floor((nextOccurrence.getTime() - now) / 86_400_000),
        onMarkPaid: () => {
          void handleMarkExpensePaid(expense, nextOccurrence);
        },
      };
    })
    .filter((item): item is ReminderItem => item !== null && item.diffDays <= 7)
    .sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Toplam sipariş" value={String(orders.length)} />
        <StatCard icon={Users} label="Aktif müşteri" value={String(activeOrders.length)} />
        <StatCard icon={Wallet} label="Toplam gelir" value={revenueLabel} hint={scheduledRevenueLabel} />
        <StatCard icon={TrendingDown} label="Toplam gider" value={expenseLabel} />
      </div>

      <ReminderPanel
        title="Planlanan satışlar — henüz ödeme/teslim yapılmayan anlaşmalar"
        items={scheduledReminders}
        markingKey={markingKey}
      />
      <ReminderPanel
        title="Gelir — yaklaşan / geçmiş hesap kesim tarihleri"
        items={incomeReminders}
        markingKey={markingKey}
      />
      <ReminderPanel
        title="Gider — yaklaşan / geçmiş ödemeler"
        items={expenseReminders}
        markingKey={markingKey}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  // Örn. "Toplam gelir" kartında henüz gerçekleşmemiş "Planlandı" tutarını
  // ana rakama katmadan parantez içinde ayrıca göstermek için (bkz.
  // scheduledRevenueLabel).
  hint?: string | null;
}) {
  return (
    <div className={`${cardSurfaceClass} flex items-center gap-3 px-5 py-4`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-elevated">
        <Icon className="size-[18px] text-foreground-muted" aria-hidden />
      </div>
      <div>
        <p className="text-[12px] text-foreground-muted">{label}</p>
        <p className="text-[17px] font-semibold text-foreground">
          {value}
          {hint && <span className="ml-1.5 text-[12px] font-normal text-warning">({hint})</span>}
        </p>
      </div>
    </div>
  );
}
