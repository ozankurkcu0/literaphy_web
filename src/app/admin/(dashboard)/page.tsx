"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { OrdersOverview } from "@/components/admin/OrdersOverview";
import { OrderFormDialog } from "@/components/admin/OrderFormDialog";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { SERVICE_TYPE_OPTIONS, STATUS_OPTIONS } from "@/lib/order-form-options";
import { inputBaseClass } from "@/lib/utils";
import type { Expense, Order, OrderInput } from "@/lib/google-sheets";

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; order: Order }
  | { mode: "detail"; order: Order }
  | null;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Siparişler alınamadı.");
        return;
      }
      setConfigured(data.configured ?? true);
      setOrders(data.orders ?? []);
      if (data.error) setLoadError(data.error);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  // Gider bildirimleri (Siparişler özetindeki "Gider" bölümü) için — tek
  // seferde tüm siparişlerin giderlerini çeker, sessizce başarısız olur
  // (siparişler zaten kendi hata mesajını gösteriyor).
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/expenses");
      const data = await response.json();
      if (response.ok) setExpenses(data.expenses ?? []);
    } catch {
      // sessiz — özet kartı sadece eksik veriyle gösterir
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchExpenses();
  }, [fetchOrders, fetchExpenses]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (serviceFilter && order.serviceType !== serviceFilter) return false;
      if (statusFilter && order.status !== statusFilter) return false;
      if (!query) return true;
      const haystack = [order.orderNumber, order.firstName, order.lastName, order.phone, order.email]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [orders, search, serviceFilter, statusFilter]);

  const hasActiveFilters = Boolean(search.trim() || serviceFilter || statusFilter);

  async function handleCreate(values: OrderInput): Promise<string | null> {
    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok) return data.error ?? "Sipariş oluşturulamadı.";
    setDialog(null);
    await fetchOrders();
    return null;
  }

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

  async function handleDelete(order: Order) {
    const confirmed = window.confirm(
      `#${order.orderNumber} numaralı ${order.firstName} ${order.lastName} siparişini silmek istediğinize emin misiniz?`,
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/orders/${order.orderNumber}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Sipariş silinemedi.");
      return;
    }
    await fetchOrders();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Siparişler</h1>
          <p className="mt-1 text-[14px] text-foreground-muted">
            Tüm müşteri sipariş ve hizmet kayıtları, Google Sheets ile senkron.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => setDialog({ mode: "create" })}
          disabled={!configured}
        >
          <Plus className="size-4" aria-hidden />
          Yeni Sipariş
        </Button>
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
          {orders && orders.length > 0 && (
            <OrdersOverview orders={orders} expenses={expenses} onOrderUpdated={fetchOrders} />
          )}

          {orders && orders.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="İsim, telefon, e-posta veya sipariş no ara…"
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

              <div className="relative">
                <select
                  value={serviceFilter}
                  onChange={(event) => setServiceFilter(event.target.value)}
                  className={`${inputBaseClass} h-11 w-56 appearance-none pr-9`}
                >
                  <option value="">Tüm hizmet türleri</option>
                  {SERVICE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`${inputBaseClass} h-11 w-40 appearance-none pr-9`}
                >
                  <option value="">Tüm durumlar</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
              </div>
            </div>
          )}

          <OrdersTable
            orders={filteredOrders}
            onViewDetail={(order) => setDialog({ mode: "detail", order })}
            onEdit={(order) => setDialog({ mode: "edit", order })}
            onDelete={handleDelete}
            emptyTitle={hasActiveFilters ? "Sonuç bulunamadı" : undefined}
            emptyDescription={
              hasActiveFilters ? "Arama veya filtre kriterlerine uyan sipariş yok." : undefined
            }
          />
        </>
      )}

      {dialog?.mode === "create" && (
        <OrderFormDialog order={null} onClose={() => setDialog(null)} onSubmit={handleCreate} />
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
          onClose={() => {
            setDialog(null);
            fetchExpenses();
          }}
          onEdit={(order) => setDialog({ mode: "edit", order })}
          onOrderUpdated={fetchOrders}
        />
      )}
    </div>
  );
}
