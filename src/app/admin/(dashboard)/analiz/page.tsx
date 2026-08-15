"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ClipboardList, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { IncomeExpenseChart } from "@/components/admin/charts/IncomeExpenseChart";
import { ServiceRevenueChart } from "@/components/admin/charts/ServiceRevenueChart";
import { MonthlyGoalCard } from "@/components/admin/MonthlyGoalCard";
import { formatCurrencyAmount } from "@/lib/order-format";
import {
  PERIOD_PRESET_OPTIONS,
  availableCurrencies,
  buildMonthBuckets,
  buildMonthlyFinance,
  buildServiceRevenue,
  buildStatusCounts,
  resolvePeriodRange,
  type PeriodPreset,
} from "@/lib/order-analytics";
import { cardSurfaceClass, cn, inputBaseClass } from "@/lib/utils";
import type { Currency, Expense, Order } from "@/lib/google-sheets";

const STATUS_TILE_CLASS: Record<string, string> = {
  Aktif: "border-success/20 bg-success/5 text-success",
  Tamamlandı: "border-hairline bg-surface text-foreground-secondary",
  İptal: "border-danger/20 bg-danger/5 text-danger",
};

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [preset, setPreset] = useState<PeriodPreset>("last-6-months");
  const [currency, setCurrency] = useState<Currency>("TRY");

  const fetchAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [ordersRes, expensesRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/expenses"),
      ]);
      const ordersData = await ordersRes.json();
      const expensesData = await expensesRes.json();
      if (!ordersRes.ok) {
        setLoadError(ordersData.error ?? "Veriler alınamadı.");
        return;
      }
      setOrders(ordersData.orders ?? []);
      setExpenses(expensesData.expenses ?? []);
      if (ordersData.error) setLoadError(ordersData.error);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const range = useMemo(() => resolvePeriodRange(preset), [preset]);
  const currencies = useMemo(() => availableCurrencies(orders ?? [], expenses), [orders, expenses]);

  const months = useMemo(() => buildMonthBuckets(range, orders ?? [], expenses), [range, orders, expenses]);
  const monthlyFinance = useMemo(
    () => buildMonthlyFinance(months, orders ?? [], expenses, currency),
    [months, orders, expenses, currency],
  );
  const serviceRevenue = useMemo(
    () => buildServiceRevenue(orders ?? [], range, currency),
    [orders, range, currency],
  );
  const statusCounts = useMemo(() => buildStatusCounts(orders ?? [], range), [orders, range]);

  const totalIncome = monthlyFinance.reduce((sum, point) => sum + point.income, 0);
  const totalExpense = monthlyFinance.reduce((sum, point) => sum + point.expense, 0);
  const net = totalIncome - totalExpense;
  const orderCount = statusCounts.Aktif + statusCounts.Tamamlandı + statusCounts.İptal;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Analiz</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">Gelir ve gider trendleri, döneme göre filtrelenebilir.</p>
      </div>

      {loadError && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">
          {loadError}
        </div>
      )}

      {orders === null && !loadError ? (
        <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
          Yükleniyor…
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1 rounded-md border border-hairline bg-surface p-1">
              {PERIOD_PRESET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreset(option.value)}
                  className={cn(
                    "rounded px-3 py-1.5 text-[13px] font-medium transition-colors",
                    preset === option.value
                      ? "bg-base text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as Currency)}
                className={`${inputBaseClass} h-9 w-28 appearance-none pr-8 text-[13px]`}
              >
                {currencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-foreground-muted"
                aria-hidden
              />
            </div>
          </div>

          <MonthlyGoalCard orders={orders ?? []} currency={currency} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Wallet} label="Toplam gelir" value={formatCurrencyAmount(totalIncome, currency)} />
            <StatCard icon={TrendingDown} label="Toplam gider" value={formatCurrencyAmount(totalExpense, currency)} />
            <StatCard
              icon={TrendingUp}
              label="Net"
              value={formatCurrencyAmount(net, currency)}
              tone={net >= 0 ? "success" : "danger"}
            />
            <StatCard icon={ClipboardList} label="Sipariş sayısı" value={String(orderCount)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["Aktif", "Tamamlandı", "İptal"] as const).map((status) => (
              <div
                key={status}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-[13.5px] font-medium ${STATUS_TILE_CLASS[status]}`}
              >
                <span>{status}</span>
                <span className="text-[16px] font-semibold tabular-nums">{statusCounts[status]}</span>
              </div>
            ))}
          </div>

          <div className={`${cardSurfaceClass} p-5`}>
            <h2 className="mb-4 text-[14px] font-semibold text-foreground">Gelir &amp; Gider</h2>
            <IncomeExpenseChart data={monthlyFinance} currency={currency} />
          </div>

          {monthlyFinance.length > 0 && (
            <div className={`${cardSurfaceClass} overflow-x-auto p-5`}>
              <h2 className="mb-4 text-[14px] font-semibold text-foreground">Aylık detay</h2>
              <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-hairline text-foreground-muted">
                    <th className="py-2 pr-4 font-medium">Ay</th>
                    <th className="py-2 pr-4 font-medium">Gelir</th>
                    <th className="py-2 pr-4 font-medium">Gider</th>
                    <th className="py-2 font-medium">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyFinance.map((point) => {
                    const pointNet = point.income - point.expense;
                    return (
                      <tr key={point.key} className="border-b border-hairline last:border-0">
                        <td className="py-2 pr-4 text-foreground-secondary">{point.label}</td>
                        <td className="py-2 pr-4 tabular-nums text-foreground">
                          {formatCurrencyAmount(point.income, currency)}
                        </td>
                        <td className="py-2 pr-4 tabular-nums text-foreground">
                          {formatCurrencyAmount(point.expense, currency)}
                        </td>
                        <td
                          className={cn(
                            "py-2 tabular-nums font-medium",
                            pointNet >= 0 ? "text-success" : "text-danger",
                          )}
                        >
                          {formatCurrencyAmount(pointNet, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className={`${cardSurfaceClass} p-5`}>
            <h2 className="mb-4 text-[14px] font-semibold text-foreground">Hizmet türüne göre gelir</h2>
            <ServiceRevenueChart data={serviceRevenue} currency={currency} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "success" | "danger";
}) {
  return (
    <div className={`${cardSurfaceClass} flex items-center gap-3 px-5 py-4`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-elevated">
        <Icon className="size-[18px] text-foreground-muted" aria-hidden />
      </div>
      <div>
        <p className="text-[12px] text-foreground-muted">{label}</p>
        <p
          className={cn(
            "text-[17px] font-semibold",
            tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-foreground",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
