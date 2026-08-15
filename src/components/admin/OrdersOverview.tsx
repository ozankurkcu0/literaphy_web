"use client";

import { AlertTriangle, ClipboardList, Users, Wallet } from "lucide-react";
import { cardSurfaceClass } from "@/lib/utils";
import type { Order } from "@/lib/google-sheets";

function formatCurrencyTotal(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("tr-TR").format(amount)} ${currency}`;
  }
}

function reminderLabel(diffDays: number): string {
  if (diffDays < 0) return `${Math.abs(diffDays)} gün gecikti`;
  if (diffDays === 0) return "bugün";
  return `${diffDays} gün kaldı`;
}

interface OrdersOverviewProps {
  orders: Order[];
}

/** Sipariş listesinin üstündeki özet: toplam/aktif sayılar, para birimine
 * göre gelir toplamı ve yaklaşan/geçmiş hesap kesim tarihi uyarısı. Ekstra
 * API çağrısı yapmıyor, zaten yüklenmiş `orders` listesinden hesaplıyor. */
export function OrdersOverview({ orders }: OrdersOverviewProps) {
  const activeOrders = orders.filter((order) => order.status === "Aktif");

  const revenueByCurrency = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "İptal" || !order.fee) continue;
    const amount = Number(order.fee);
    if (Number.isNaN(amount)) continue;
    revenueByCurrency.set(order.currency, (revenueByCurrency.get(order.currency) ?? 0) + amount);
  }
  const revenueLabel =
    revenueByCurrency.size === 0
      ? "—"
      : [...revenueByCurrency.entries()].map(([currency, amount]) => formatCurrencyTotal(amount, currency)).join(" · ");

  const now = Date.now();
  const upcomingBilling = activeOrders
    .filter((order) => order.billingDate)
    .map((order) => ({
      order,
      diffDays: Math.floor((new Date(order.billingDate).getTime() - now) / 86_400_000),
    }))
    .filter(({ diffDays }) => diffDays <= 7)
    .sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Toplam sipariş" value={String(orders.length)} />
        <StatCard icon={Users} label="Aktif müşteri" value={String(activeOrders.length)} />
        <StatCard icon={Wallet} label="Toplam gelir" value={revenueLabel} />
      </div>

      {upcomingBilling.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-warning/25 bg-warning/5 px-5 py-4">
          <div className="flex items-center gap-2 text-[13.5px] font-medium text-warning">
            <AlertTriangle className="size-4" aria-hidden />
            Yaklaşan / geçmiş hesap kesim tarihleri
          </div>
          <ul className="flex flex-col gap-1.5 text-[13.5px]">
            {upcomingBilling.map(({ order, diffDays }) => (
              <li key={order.orderNumber} className="flex items-center justify-between gap-3">
                <span className="text-foreground-secondary">
                  {order.firstName} {order.lastName}{" "}
                  <span className="text-foreground-muted">· #{order.orderNumber}</span>
                </span>
                <span className={diffDays < 0 ? "font-medium text-danger" : "font-medium text-warning"}>
                  {reminderLabel(diffDays)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className={`${cardSurfaceClass} flex items-center gap-3 px-5 py-4`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-elevated">
        <Icon className="size-[18px] text-foreground-muted" aria-hidden />
      </div>
      <div>
        <p className="text-[12px] text-foreground-muted">{label}</p>
        <p className="text-[17px] font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
