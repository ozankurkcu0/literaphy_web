"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ChevronDown, Info, Pencil as PencilIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CURRENCY_OPTIONS, EXPENSE_RECURRENCE_OPTIONS } from "@/lib/order-form-options";
import { formatCurrencyAmount, formatExpenseSchedule } from "@/lib/order-format";
import { cardSurfaceClass, cn, inputBaseClass } from "@/lib/utils";
import type { CompanyExpense, CompanyExpenseCategory, CompanyExpenseInput, Currency, ExpenseRecurrence } from "@/lib/google-sheets";

// Sipariş sayfasındaki COMPANY_EXPENSE_CATEGORIES ile bire bir aynı sırada —
// google-sheets.ts'teki export'u client komponentten import edemediğimiz
// için (server-only) burada ayrıca tanımlı, bkz. o dosyadaki yorum.
const CATEGORY_OPTIONS: { label: string; value: CompanyExpenseCategory }[] = [
  { label: "Domain & Hosting", value: "Domain & Hosting" },
  { label: "Reklam Giderleri", value: "Reklam Giderleri" },
  { label: "Yazılım & Araç Abonelikleri", value: "Yazılım & Araç Abonelikleri" },
  { label: "Ofis & Kırtasiye", value: "Ofis & Kırtasiye" },
  { label: "Muhasebe & Hukuk", value: "Muhasebe & Hukuk" },
  { label: "Donanım & Ekipman", value: "Donanım & Ekipman" },
  { label: "Diğer", value: "Diğer" },
];

const EMPTY_EXPENSE: CompanyExpenseInput = {
  category: "Domain & Hosting",
  amount: "",
  currency: "TRY",
  recurrence: "Tek seferlik",
  dueDate: "",
  note: "",
};

type Source = "sheets" | "unconfigured";

export default function AdminCompanyExpensesPage() {
  const [expenses, setExpenses] = useState<CompanyExpense[] | null>(null);
  const [source, setSource] = useState<Source>("sheets");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<CompanyExpenseInput>(EMPTY_EXPENSE);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/company-expenses");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Giderler alınamadı.");
        return;
      }
      if (data.configured === false) {
        setSource("unconfigured");
        setLoadError(data.error ?? null);
        return;
      }
      setSource("sheets");
      // En son eklenen en üstte görünsün.
      setExpenses([...(data.expenses ?? [])].reverse());
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  function update<K extends keyof CompanyExpenseInput>(key: K, value: CompanyExpenseInput[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function changeRecurrence(recurrence: ExpenseRecurrence) {
    // Tekrar tipi değişince tarih/gün alanının anlamı değiştiği için eski
    // değeri tutmak yanlış bir gün/tarih göstermesine yol açar.
    setFormValues((prev) => ({ ...prev, recurrence, dueDate: "" }));
  }

  function startEdit(expense: CompanyExpense) {
    setEditingExpenseId(expense.expenseId);
    setFormValues({
      category: expense.category,
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);

    const isEdit = Boolean(editingExpenseId);
    const url = isEdit ? `/api/admin/company-expenses/${editingExpenseId}` : "/api/admin/company-expenses";

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

  async function handleDelete(expense: CompanyExpense) {
    const confirmed = window.confirm(`"${expense.category}" giderini silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/company-expenses/${expense.expenseId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Gider silinemedi.");
      return;
    }
    if (editingExpenseId === expense.expenseId) cancelEdit();
    await fetchExpenses();
  }

  const totalsByCurrency = new Map<string, number>();
  for (const expense of expenses ?? []) {
    const amount = Number(expense.amount);
    if (!expense.amount || Number.isNaN(amount)) continue;
    totalsByCurrency.set(expense.currency, (totalsByCurrency.get(expense.currency) ?? 0) + amount);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Şirket Giderleri</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Herhangi bir siparişe bağlı olmayan genel giderler — domain/hosting, reklam, abonelikler ve benzerleri.
        </p>
      </div>

      {source === "unconfigured" ? (
        <div className="flex items-start gap-3 rounded-lg border border-hairline bg-surface px-5 py-4 text-[13.5px] text-foreground-secondary">
          <Info className="mt-0.5 size-4 shrink-0 text-foreground-muted" aria-hidden />
          <p>{loadError ?? "Google Sheets bağlantısı henüz yapılandırılmamış."}</p>
        </div>
      ) : (
        <>
          {totalsByCurrency.size > 0 && (
            <div className={`${cardSurfaceClass} flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4`}>
              <p className="text-[13px] font-medium text-foreground-muted">Toplam gider</p>
              <p className="text-[15px] font-semibold text-foreground">
                {[...totalsByCurrency.entries()]
                  .map(([currency, amount]) => formatCurrencyAmount(amount, currency))
                  .join(" · ")}
              </p>
            </div>
          )}

          {loadError && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">
              {loadError}
            </div>
          )}

          {expenses === null && !loadError ? (
            <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
              Yükleniyor…
            </div>
          ) : expenses && expenses.length === 0 ? (
            <div className={`${cardSurfaceClass} px-6 py-16 text-center`}>
              <p className="text-[15px] font-medium text-foreground">Henüz gider eklenmedi</p>
              <p className="mt-1 text-[13px] text-foreground-muted">
                Aşağıdaki formdan domain, hosting, reklam gibi genel giderleri ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {(expenses ?? []).map((expense) => (
                <li
                  key={expense.expenseId}
                  className={`${cardSurfaceClass} flex items-center justify-between gap-3 px-4 py-3`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-foreground">{expense.category}</p>
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
                      aria-label={`${expense.category} giderini düzenle`}
                    >
                      <PencilIcon className="size-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense)}
                      className="flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      aria-label={`${expense.category} giderini sil`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-5"
          >
            <p className="text-[14px] font-semibold text-foreground">
              {editingExpenseId ? "Gideri düzenle" : "Gider ekle"}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="expenseCategory" className="text-sm font-medium text-foreground-secondary">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    id="expenseCategory"
                    value={formValues.category}
                    onChange={(event) => update("category", event.target.value as CompanyExpenseCategory)}
                    className={cn(inputBaseClass, "h-12 appearance-none pr-9")}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
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
                    className={cn(inputBaseClass, "h-12 flex-1")}
                  />
                  <div className="relative w-24 shrink-0">
                    <select
                      value={formValues.currency}
                      onChange={(event) => update("currency", event.target.value as Currency)}
                      className={cn(inputBaseClass, "h-12 appearance-none pr-7")}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="expenseRecurrence" className="text-sm font-medium text-foreground-secondary">
                  Tekrar
                </label>
                <div className="relative">
                  <select
                    id="expenseRecurrence"
                    value={formValues.recurrence}
                    onChange={(event) => changeRecurrence(event.target.value as ExpenseRecurrence)}
                    className={cn(inputBaseClass, "h-12 appearance-none pr-9")}
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
              placeholder="ör. Vercel Pro plan, yıllık yenileme"
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
        </>
      )}
    </div>
  );
}
