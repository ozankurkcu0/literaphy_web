"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, ChevronDown, Pencil as PencilIcon, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CURRENCY_OPTIONS, EXPENSE_RECURRENCE_OPTIONS } from "@/lib/order-form-options";
import { addOneMonth, formatCurrencyAmount, formatDateDisplay, formatExpenseSchedule } from "@/lib/order-format";
import { inputBaseClass } from "@/lib/utils";
import type { Currency, Expense, ExpenseInput, ExpenseRecurrence, Order } from "@/lib/google-sheets";

const EMPTY_EXPENSE: ExpenseInput = {
  name: "",
  amount: "",
  currency: "TRY",
  recurrence: "Tek seferlik",
  dueDate: "",
  note: "",
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-foreground-muted">{label}</p>
      <p className="text-[14px] text-foreground">{value || "—"}</p>
    </div>
  );
}

function formatInstallmentsDetail(order: Order): string | null {
  const total = Number(order.totalInstallments);
  if (!order.totalInstallments || Number.isNaN(total) || total <= 0) return null;
  const paid = Number(order.paidInstallments) || 0;
  return `${paid}/${total} ödendi · ${Math.max(total - paid, 0)} kaldı`;
}

interface OrderDetailDialogProps {
  order: Order;
  onClose: () => void;
  onEdit: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
}

export function OrderDetailDialog({ order: initialOrder, onClose, onEdit, onOrderUpdated }: OrderDetailDialogProps) {
  const [order, setOrder] = useState(initialOrder);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ExpenseInput>(EMPTY_EXPENSE);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch(`/api/admin/orders/${order.orderNumber}/expenses`);
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Giderler alınamadı.");
        return;
      }
      setExpenses(data.expenses ?? []);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, [order.orderNumber]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function update<K extends keyof ExpenseInput>(key: K, value: ExpenseInput[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(expense: Expense) {
    setEditingExpenseId(expense.expenseId);
    setFormValues({
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      recurrence: expense.recurrence,
      dueDate: expense.dueDate,
      note: expense.note,
    });
    setFormError(null);
  }

  function cancelEdit() {
    setEditingExpenseId(null);
    setFormValues(EMPTY_EXPENSE);
    setFormError(null);
  }

  function changeRecurrence(recurrence: ExpenseRecurrence) {
    // Tekrar tipi değişince tarih/gün alanının anlamı değiştiği için
    // eski değeri tutmak yanlış bir gün/tarih göstermesine yol açar.
    setFormValues((prev) => ({ ...prev, recurrence, dueDate: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);

    const isEdit = Boolean(editingExpenseId);
    const url = isEdit
      ? `/api/admin/orders/${order.orderNumber}/expenses/${editingExpenseId}`
      : `/api/admin/orders/${order.orderNumber}/expenses`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? "Gider kaydedilemedi.");
        setSaving(false);
        return;
      }
      cancelEdit();
      await fetchExpenses();
    } catch {
      setFormError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function handleDelete(expense: Expense) {
    const confirmed = window.confirm(`"${expense.name}" giderini silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/orders/${order.orderNumber}/expenses/${expense.expenseId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Gider silinemedi.");
      return;
    }
    if (editingExpenseId === expense.expenseId) cancelEdit();
    await fetchExpenses();
  }

  async function handleMarkPaid() {
    setMarkingPaid(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingDate: addOneMonth(order.billingDate) }),
      });
      const data = await response.json();
      if (!response.ok) {
        window.alert(data.error ?? "İşaretlenemedi.");
        return;
      }
      setOrder(data.order);
      onOrderUpdated?.(data.order);
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    } finally {
      setMarkingPaid(false);
    }
  }

  const totalsByCurrency = new Map<string, number>();
  for (const expense of expenses ?? []) {
    const amount = Number(expense.amount);
    if (!expense.amount || Number.isNaN(amount)) continue;
    totalsByCurrency.set(expense.currency, (totalsByCurrency.get(expense.currency) ?? 0) + amount);
  }

  const installmentsDetail = formatInstallmentsDetail(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" onClick={onClose}>
      <div
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-hairline bg-base shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-foreground">
              {order.firstName} {order.lastName} <span className="text-foreground-muted">· #{order.orderNumber}</span>
            </h2>
            <StatusBadge status={order.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Kapat"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <InfoField label="Telefon" value={order.phone} />
              <InfoField label="E-posta" value={order.email} />
              <InfoField label="Hizmet türü" value={order.serviceType} />
              <InfoField label="Başlama tarihi" value={formatDateDisplay(order.startDate)} />
              <div>
                <p className="text-[12px] text-foreground-muted">Hesap kesim tarihi</p>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] text-foreground">{formatDateDisplay(order.billingDate) || "—"}</p>
                  {order.billingDate && order.status === "Aktif" && (
                    <button
                      type="button"
                      onClick={handleMarkPaid}
                      disabled={markingPaid}
                      className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      <Check className="size-3" aria-hidden />
                      {markingPaid ? "…" : "Ödendi"}
                    </button>
                  )}
                </div>
              </div>
              <InfoField
                label="Ücret"
                value={order.fee ? formatCurrencyAmount(Number(order.fee), order.currency) : "—"}
              />
              {installmentsDetail && <InfoField label="Taksit" value={installmentsDetail} />}
            </div>
            {order.note && (
              <div className="rounded-md border border-hairline bg-surface px-3.5 py-3">
                <p className="text-[12px] text-foreground-muted">Not</p>
                <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] text-foreground-secondary">{order.note}</p>
              </div>
            )}
            <div>
              <Button type="button" variant="secondary" size="md" onClick={() => onEdit(order)}>
                <PencilIcon className="size-4" aria-hidden />
                Siparişi düzenle
              </Button>
            </div>
          </div>

          <div className="border-t border-hairline pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-foreground">Giderler</h3>
              {totalsByCurrency.size > 0 && (
                <p className="text-[13px] text-foreground-muted">
                  Toplam:{" "}
                  {[...totalsByCurrency.entries()]
                    .map(([currency, amount]) => formatCurrencyAmount(amount, currency))
                    .join(" · ")}
                </p>
              )}
            </div>

            {loadError && (
              <div className="mb-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] text-danger">
                {loadError}
              </div>
            )}

            {expenses === null ? (
              !loadError && <p className="py-4 text-[13.5px] text-foreground-muted">Yükleniyor…</p>
            ) : expenses.length === 0 ? (
              <p className="py-2 text-[13.5px] text-foreground-muted">
                Bu siparişe henüz gider eklenmedi (hosting, domain vb.).
              </p>
            ) : (
              <ul className="mb-4 flex flex-col gap-1.5">
                {expenses.map((expense) => (
                  <li
                    key={expense.expenseId}
                    className="flex items-center justify-between gap-3 rounded-md border border-hairline px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-foreground">{expense.name}</p>
                      <p className="truncate text-[12px] text-foreground-muted">
                        {expense.amount ? formatCurrencyAmount(Number(expense.amount), expense.currency) : "—"}
                        {` · ${formatExpenseSchedule(expense)}`}
                        {expense.note ? ` · ${expense.note}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(expense)}
                        className="flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                        aria-label={`${expense.name} giderini düzenle`}
                      >
                        <PencilIcon className="size-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(expense)}
                        className="flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        aria-label={`${expense.name} giderini sil`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border border-hairline bg-surface p-4">
              <p className="text-[13px] font-medium text-foreground-secondary">
                {editingExpenseId ? "Gideri düzenle" : "Gider ekle"}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Gider adı"
                  name="expenseName"
                  placeholder="ör. Hosting — GoDaddy"
                  required
                  value={formValues.name}
                  onChange={(event) => update("name", event.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label htmlFor="expenseAmount" className="text-sm font-medium text-foreground-secondary">
                    Tutar
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="expenseAmount"
                      name="expenseAmount"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0"
                      value={formValues.amount}
                      onChange={(event) => update("amount", event.target.value)}
                      className={`${inputBaseClass} h-11 flex-1`}
                    />
                    <div className="relative w-24 shrink-0">
                      <select
                        value={formValues.currency}
                        onChange={(event) => update("currency", event.target.value as Currency)}
                        className={`${inputBaseClass} h-11 appearance-none pr-7`}
                      >
                        {CURRENCY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-foreground-muted"
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="expenseRecurrence" className="text-sm font-medium text-foreground-secondary">
                    Tekrar
                  </label>
                  <div className="relative">
                    <select
                      id="expenseRecurrence"
                      value={formValues.recurrence}
                      onChange={(event) => changeRecurrence(event.target.value as ExpenseRecurrence)}
                      className={`${inputBaseClass} h-11 appearance-none pr-9`}
                    >
                      {EXPENSE_RECURRENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-foreground-muted"
                      aria-hidden
                    />
                  </div>
                </div>

                {formValues.recurrence === "Aylık" ? (
                  <Input
                    label="Ayın kaçında"
                    name="expenseDueDay"
                    type="number"
                    min={1}
                    max={31}
                    step="1"
                    placeholder="ör. 15"
                    value={formValues.dueDate}
                    onChange={(event) => update("dueDate", event.target.value)}
                  />
                ) : (
                  <Input
                    label={formValues.recurrence === "Yıllık" ? "Yıllık yenileme tarihi" : "Ödeme tarihi"}
                    name="expenseDueDate"
                    type="date"
                    value={formValues.dueDate}
                    onChange={(event) => update("dueDate", event.target.value)}
                  />
                )}
              </div>

              <Input
                label="Not"
                name="expenseNote"
                placeholder="ör. yıllık yenileme"
                value={formValues.note}
                onChange={(event) => update("note", event.target.value)}
              />

              {formError && <p className="text-[13px] font-medium text-danger">{formError}</p>}

              <div className="flex justify-end gap-2">
                {editingExpenseId && (
                  <Button type="button" variant="ghost" size="md" onClick={cancelEdit}>
                    Vazgeç
                  </Button>
                )}
                <Button type="submit" variant="secondary" size="md" disabled={saving}>
                  {!editingExpenseId && <Plus className="size-4" aria-hidden />}
                  {saving ? "Kaydediliyor…" : editingExpenseId ? "Kaydet" : "Gideri ekle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
