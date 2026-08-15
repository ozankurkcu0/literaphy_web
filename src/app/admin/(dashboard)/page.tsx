"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { OrdersOverview } from "@/components/admin/OrdersOverview";
import { OrderFormDialog } from "@/components/admin/OrderFormDialog";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { SERVICE_TYPE_OPTIONS, STATUS_OPTIONS } from "@/lib/order-form-options";
import { downloadCsv, toCsv } from "@/lib/csv-export";
import { inputBaseClass } from "@/lib/utils";
import type { Expense, Order, OrderInput, Status } from "@/lib/google-sheets";

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
  const [exportOpen, setExportOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

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
      setSelected(new Set());
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

  function toggleSelect(orderNumber: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(orderNumber)) next.delete(orderNumber);
      else next.add(orderNumber);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      const allSelected = filteredOrders.length > 0 && filteredOrders.every((order) => prev.has(order.orderNumber));
      return allSelected ? new Set() : new Set(filteredOrders.map((order) => order.orderNumber));
    });
  }

  // Sıralı (paralel değil) işliyor — Google Sheets API'nin dakikalık okuma/yazma
  // kotasını aşmamak için, tek seferde çok sayıda çağrı patlamasın diye.
  async function handleBulkStatusChange(status: Status) {
    setBulkStatusOpen(false);
    setBulkBusy(true);
    const targets = Array.from(selected);
    for (const orderNumber of targets) {
      try {
        await fetch(`/api/admin/orders/${orderNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        // sessiz — kalan kayıtlarla devam eder, sonda liste zaten tazelenir
      }
    }
    setBulkBusy(false);
    await fetchOrders();
  }

  async function handleBulkDelete() {
    const confirmed = window.confirm(`${selected.size} siparişi kalıcı olarak silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    setBulkBusy(true);
    const targets = Array.from(selected);
    for (const orderNumber of targets) {
      try {
        await fetch(`/api/admin/orders/${orderNumber}`, { method: "DELETE" });
      } catch {
        // sessiz — kalan kayıtlarla devam eder
      }
    }
    setBulkBusy(false);
    await fetchOrders();
  }

  function handleExportOrders() {
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.firstName,
      order.lastName,
      order.phone,
      order.email,
      order.serviceType,
      order.startDate,
      order.billingDate,
      order.fee,
      order.currency,
      order.status,
      order.note,
    ]);
    const csv = toCsv(
      [
        "Sipariş No",
        "İsim",
        "Soyisim",
        "Telefon",
        "E-posta",
        "Hizmet Türü",
        "Başlama Tarihi",
        "Hesap Kesim Tarihi",
        "Ücret",
        "Para Birimi",
        "Durum",
        "Not",
      ],
      rows,
    );
    downloadCsv(`siparisler-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    setExportOpen(false);
  }

  function handleExportExpenses() {
    const ordersByNumber = new Map((orders ?? []).map((order) => [order.orderNumber, order]));
    const rows = expenses.map((expense) => {
      const order = ordersByNumber.get(expense.orderNumber);
      return [
        expense.orderNumber,
        order ? `${order.firstName} ${order.lastName}` : "",
        expense.name,
        expense.amount,
        expense.currency,
        expense.recurrence,
        expense.dueDate,
        expense.note,
      ];
    });
    const csv = toCsv(
      ["Sipariş No", "Müşteri", "Gider Adı", "Tutar", "Para Birimi", "Tekrar", "Tarih", "Not"],
      rows,
    );
    downloadCsv(`giderler-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    setExportOpen(false);
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button type="button" variant="secondary" size="md" onClick={() => setExportOpen((value) => !value)}>
              <Download className="size-4" aria-hidden />
              Dışa Aktar
            </Button>
            {exportOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-hairline bg-base py-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={handleExportOrders}
                    className="block w-full px-3.5 py-2 text-left text-[13.5px] text-foreground-secondary hover:bg-surface hover:text-foreground"
                  >
                    Siparişleri indir (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={handleExportExpenses}
                    className="block w-full px-3.5 py-2 text-left text-[13.5px] text-foreground-secondary hover:bg-surface hover:text-foreground"
                  >
                    Giderleri indir (CSV)
                  </button>
                </div>
              </>
            )}
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

          {selected.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-hairline bg-surface px-4 py-2.5">
              <span className="text-[13.5px] font-medium text-foreground">{selected.size} seçili</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBulkStatusOpen((value) => !value)}
                  disabled={bulkBusy}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-foreground-secondary transition-colors hover:bg-elevated hover:text-foreground disabled:opacity-40"
                >
                  Durum değiştir
                  <ChevronDown className="size-3.5" aria-hidden />
                </button>
                {bulkStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setBulkStatusOpen(false)} />
                    <div className="absolute left-0 z-10 mt-2 w-44 rounded-md border border-hairline bg-base py-1.5 shadow-lg">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleBulkStatusChange(option.value)}
                          className="block w-full px-3.5 py-2 text-left text-[13.5px] text-foreground-secondary hover:bg-surface hover:text-foreground"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkBusy}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-40"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Sil
              </button>
              {bulkBusy && <span className="text-[12.5px] text-foreground-muted">İşleniyor…</span>}
            </div>
          )}

          <OrdersTable
            orders={filteredOrders}
            selectedOrderNumbers={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
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
