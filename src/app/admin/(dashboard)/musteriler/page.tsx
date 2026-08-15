"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Info, Search, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderFormDialog } from "@/components/admin/OrderFormDialog";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { groupOrdersByCustomer, type Customer } from "@/lib/customers";
import { formatCurrencyAmount, formatDateDisplay } from "@/lib/order-format";
import { inputBaseClass } from "@/lib/utils";
import type { Order, OrderInput } from "@/lib/google-sheets";

type DialogState = { mode: "edit"; order: Order } | { mode: "detail"; order: Order } | null;

function customerTotals(customer: Customer): string {
  const totals = new Map<string, number>();
  for (const order of customer.orders) {
    if (order.status === "İptal" || !order.fee) continue;
    const amount = Number(order.fee);
    if (Number.isNaN(amount)) continue;
    totals.set(order.currency, (totals.get(order.currency) ?? 0) + amount);
  }
  if (totals.size === 0) return "—";
  return [...totals.entries()]
    .map(([currency, amount]) => formatCurrencyAmount(amount, currency, { maximumFractionDigits: 0 }))
    .join(" · ");
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);

  const fetchOrders = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Siparişler alınamadı.");
        return;
      }
      setOrders(data.orders ?? []);
      if (data.error) setLoadError(data.error);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const customers = useMemo(() => groupOrdersByCustomer(orders ?? []), [orders]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => {
      const haystack = [customer.firstName, customer.lastName, customer.phone, customer.email]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [customers, search]);

  async function handleUpdate(orderNumber: string, values: OrderInput): Promise<string | null> {
    const response = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok) return data.error ?? "Sipariş güncellenemedi.";
    setDialog(null);
    await fetchOrders();
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Müşteriler</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Aynı telefon numarasına sahip siparişler tek müşteri altında toplanır.
        </p>
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
          {customers.length > 0 && (
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-muted"
                aria-hidden
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="İsim, telefon veya e-posta ara…"
                className={`${inputBaseClass} h-11 pl-10 ${search ? "pr-9" : ""}`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Aramayı temizle"
                  className="absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center rounded text-foreground-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              )}
            </div>
          )}

          {filteredCustomers.length === 0 ? (
            <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center">
              <p className="text-[15px] font-medium text-foreground">
                {customers.length === 0 ? "Henüz müşteri kaydı yok" : "Sonuç bulunamadı"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredCustomers.map((customer) => {
                const expanded = expandedKey === customer.key;
                return (
                  <div key={customer.key} className="rounded-lg border border-hairline">
                    <button
                      type="button"
                      onClick={() => setExpandedKey(expanded ? null : customer.key)}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface"
                    >
                      {expanded ? (
                        <ChevronDown className="size-4 shrink-0 text-foreground-muted" aria-hidden />
                      ) : (
                        <ChevronRight className="size-4 shrink-0 text-foreground-muted" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-foreground">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="truncate text-[12.5px] text-foreground-muted">
                          {customer.phone || "—"} {customer.email ? `· ${customer.email}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-[12px] font-medium text-foreground-secondary">
                        {customer.orders.length} sipariş
                      </span>
                      <span className="hidden shrink-0 text-[13px] font-medium text-foreground-secondary sm:block">
                        {customerTotals(customer)}
                      </span>
                    </button>

                    {expanded && (
                      <div className="overflow-x-auto border-t border-hairline">
                        <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-hairline bg-surface text-foreground-muted">
                              <th className="px-4 py-2.5 font-medium">Sipariş No</th>
                              <th className="px-4 py-2.5 font-medium">Hizmet Türü</th>
                              <th className="px-4 py-2.5 font-medium">Başlama</th>
                              <th className="px-4 py-2.5 font-medium">Ücret</th>
                              <th className="px-4 py-2.5 font-medium">Durum</th>
                              <th className="px-4 py-2.5 font-medium" />
                            </tr>
                          </thead>
                          <tbody>
                            {customer.orders.map((order) => (
                              <tr key={order.orderNumber} className="border-b border-hairline last:border-0">
                                <td className="px-4 py-2.5 font-mono text-foreground-secondary">
                                  #{order.orderNumber}
                                </td>
                                <td className="px-4 py-2.5 text-foreground-secondary">{order.serviceType}</td>
                                <td className="px-4 py-2.5 text-foreground-secondary">
                                  {formatDateDisplay(order.startDate)}
                                </td>
                                <td className="px-4 py-2.5 text-foreground-secondary">
                                  {order.fee ? formatCurrencyAmount(Number(order.fee), order.currency) : "—"}
                                </td>
                                <td className="px-4 py-2.5">
                                  <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setDialog({ mode: "detail", order })}
                                    className="flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                                    aria-label={`${order.orderNumber} numaralı siparişin ayrıntılarını gör`}
                                  >
                                    <Info className="size-3.5" aria-hidden />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {dialog?.mode === "edit" && (
        <OrderFormDialog
          order={dialog.order}
          onClose={() => setDialog(null)}
          onSubmit={(values) => handleUpdate(dialog.order.orderNumber, values)}
        />
      )}
      {dialog?.mode === "detail" && (
        <OrderDetailDialog
          order={dialog.order}
          onClose={() => setDialog(null)}
          onEdit={(order) => setDialog({ mode: "edit", order })}
          onOrderUpdated={fetchOrders}
        />
      )}
    </div>
  );
}
