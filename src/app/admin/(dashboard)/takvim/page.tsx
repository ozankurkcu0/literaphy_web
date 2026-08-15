"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CHART_COLORS } from "@/components/admin/charts/chart-tokens";
import { buildCalendarEvents } from "@/lib/order-analytics";
import { formatCurrencyAmount } from "@/lib/order-format";
import { cardSurfaceClass, cn } from "@/lib/utils";
import type { Expense, Order } from "@/lib/google-sheets";

const WEEKDAY_LABELS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
const monthYearFormatter = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });
const fullDateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function AdminCalendarPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const events = useMemo(
    () => buildCalendarEvents(year, month, orders ?? [], expenses),
    [year, month, orders, expenses],
  );

  const { cells, today, isCurrentMonth } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Pazartesi=0
    const list: (number | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
    while (list.length % 7 !== 0) list.push(null);
    const now = new Date();
    return { cells: list, today: now, isCurrentMonth: now.getFullYear() === year && now.getMonth() === month };
  }, [year, month]);

  function goToToday() {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(null);
  }

  function changeMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1));
    setSelectedDay(null);
  }

  const ordersByNumber = useMemo(() => new Map((orders ?? []).map((order) => [order.orderNumber, order])), [orders]);
  const selectedDayEvents = selectedDay ? events.get(selectedDay) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Takvim</h1>
          <p className="mt-1 text-[14px] text-foreground-muted">Hesap kesim ve gider tarihleri, ay ay.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="md" className="h-9 px-2.5" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <span className="min-w-[150px] text-center text-[14px] font-medium text-foreground capitalize">
            {monthYearFormatter.format(cursor)}
          </span>
          <Button type="button" variant="secondary" size="md" className="h-9 px-2.5" onClick={() => changeMonth(1)}>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
          {!isCurrentMonth && (
            <Button type="button" variant="ghost" size="md" onClick={goToToday}>
              Bugün
            </Button>
          )}
        </div>
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
          <div className="flex items-center gap-4 text-[12.5px]">
            <span className="flex items-center gap-1.5 text-foreground-secondary">
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: CHART_COLORS.income }} />
              Gelir (hesap kesim)
            </span>
            <span className="flex items-center gap-1.5 text-foreground-secondary">
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: CHART_COLORS.expense }} />
              Gider
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-hairline">
            <div className="grid grid-cols-7 border-b border-hairline bg-surface">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="px-2 py-2 text-center text-[12px] font-medium text-foreground-muted">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((day, index) => {
                const dayEvents = day ? events.get(day) : undefined;
                const isToday = isCurrentMonth && day === today.getDate();
                const shownIncome = dayEvents?.income.slice(0, 2) ?? [];
                const shownExpense = dayEvents?.expense.slice(0, 2) ?? [];
                const total = (dayEvents?.income.length ?? 0) + (dayEvents?.expense.length ?? 0);
                const shown = shownIncome.length + shownExpense.length;

                return (
                  <button
                    type="button"
                    key={index}
                    disabled={!day}
                    onClick={() => day && setSelectedDay(day)}
                    className={cn(
                      "min-h-[92px] border-r border-b border-hairline p-1.5 text-left [&:nth-child(7n)]:border-r-0",
                      !day && "bg-surface/40",
                      day && "cursor-pointer transition-colors hover:bg-surface",
                    )}
                  >
                    {day && (
                      <>
                        <div className="mb-1">
                          {isToday ? (
                            <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-white">
                              {day}
                            </span>
                          ) : (
                            <span className="text-[12px] text-foreground-muted">{day}</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {shownIncome.map((order) => (
                            <div
                              key={order.orderNumber}
                              className="truncate rounded px-1 py-0.5 text-[10.5px]"
                              style={{ backgroundColor: `${CHART_COLORS.income}1a`, color: CHART_COLORS.income }}
                            >
                              {order.firstName} {order.lastName}
                            </div>
                          ))}
                          {shownExpense.map((expense) => (
                            <div
                              key={expense.expenseId}
                              className="truncate rounded px-1 py-0.5 text-[10.5px]"
                              style={{ backgroundColor: `${CHART_COLORS.expense}1a`, color: CHART_COLORS.expense }}
                            >
                              {expense.name}
                            </div>
                          ))}
                          {total > shown && (
                            <p className="text-[10px] text-foreground-muted">+{total - shown} daha</p>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-lg border border-hairline bg-base shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <h2 className="text-[16px] font-semibold text-foreground capitalize">
                {fullDateFormatter.format(new Date(year, month, selectedDay))}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Kapat"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
              {!selectedDayEvents || (selectedDayEvents.income.length === 0 && selectedDayEvents.expense.length === 0) ? (
                <p className="text-[13.5px] text-foreground-muted">Bu günde kayıt yok.</p>
              ) : (
                <>
                  {selectedDayEvents.income.length > 0 && (
                    <div>
                      <p className="mb-2 text-[12px] font-medium text-foreground-muted">Gelir — hesap kesim</p>
                      <ul className="flex flex-col gap-2">
                        {selectedDayEvents.income.map((order) => (
                          <li
                            key={order.orderNumber}
                            className={`${cardSurfaceClass} flex items-center justify-between gap-3 px-3.5 py-2.5`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[13.5px] font-medium text-foreground">
                                {order.firstName} {order.lastName}
                              </p>
                              <p className="truncate text-[12px] text-foreground-muted">
                                #{order.orderNumber} · {order.serviceType}
                              </p>
                            </div>
                            <span className="shrink-0 text-[13.5px] font-semibold text-foreground">
                              {order.fee ? formatCurrencyAmount(Number(order.fee), order.currency) : "—"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedDayEvents.expense.length > 0 && (
                    <div>
                      <p className="mb-2 text-[12px] font-medium text-foreground-muted">Gider</p>
                      <ul className="flex flex-col gap-2">
                        {selectedDayEvents.expense.map((expense) => {
                          const relatedOrder = ordersByNumber.get(expense.orderNumber);
                          return (
                            <li
                              key={expense.expenseId}
                              className={`${cardSurfaceClass} flex items-center justify-between gap-3 px-3.5 py-2.5`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-[13.5px] font-medium text-foreground">{expense.name}</p>
                                <p className="truncate text-[12px] text-foreground-muted">
                                  {relatedOrder ? `${relatedOrder.firstName} ${relatedOrder.lastName} · ` : ""}#
                                  {expense.orderNumber}
                                </p>
                              </div>
                              <span className="shrink-0 text-[13.5px] font-semibold text-foreground">
                                {expense.amount ? formatCurrencyAmount(Number(expense.amount), expense.currency) : "—"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
