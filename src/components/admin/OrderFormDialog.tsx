"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { inputBaseClass } from "@/lib/utils";
import { CURRENCY_OPTIONS, SERVICE_TYPE_OPTIONS, STATUS_OPTIONS } from "@/lib/order-form-options";
import type { Currency, Order, OrderInput, Status } from "@/lib/google-sheets";

const EMPTY_FORM: OrderInput = {
  firstName: "",
  lastName: "",
  serviceType: "",
  startDate: "",
  billingDate: "",
  phone: "",
  email: "",
  fee: "",
  currency: "TRY",
  totalInstallments: "",
  paidInstallments: "",
  status: "Aktif",
  note: "",
};

interface OrderFormDialogProps {
  order: Order | null; // null = yeni kayıt, dolu = düzenleme
  onClose: () => void;
  onSubmit: (values: OrderInput) => Promise<string | null>; // hata mesajı döner, başarılıysa null
}

export function OrderFormDialog({ order, onClose, onSubmit }: OrderFormDialogProps) {
  const [values, setValues] = useState<OrderInput>(order ?? EMPTY_FORM);
  const [isInstallmentPlan, setIsInstallmentPlan] = useState(Boolean(order?.totalInstallments));
  const [noEmail, setNoEmail] = useState(Boolean(order && !order.email));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function update<K extends keyof OrderInput>(key: K, value: OrderInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInstallmentPlan(checked: boolean) {
    setIsInstallmentPlan(checked);
    if (!checked) {
      setValues((prev) => ({ ...prev, totalInstallments: "", paidInstallments: "" }));
    }
  }

  function toggleNoEmail(checked: boolean) {
    setNoEmail(checked);
    if (checked) update("email", "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const message = await onSubmit(values);
    setSaving(false);
    if (message) setError(message);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" onClick={onClose}>
      <div
        className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-lg border border-hairline bg-base shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 className="text-[16px] font-semibold text-foreground">
            {order ? `Siparişi düzenle · #${order.orderNumber}` : "Yeni sipariş"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Kapat"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefon"
              name="phone"
              type="tel"
              placeholder="+90 555 000 00 00"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground-secondary">
                  E-posta
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-foreground-muted">
                  <input
                    type="checkbox"
                    checked={noEmail}
                    onChange={(event) => toggleNoEmail(event.target.checked)}
                    className="size-3.5 rounded border-hairline accent-accent"
                  />
                  E-posta yok
                </label>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                disabled={noEmail}
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className={`${inputBaseClass} h-12 disabled:cursor-not-allowed disabled:opacity-50`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="İsim"
              name="firstName"
              required
              value={values.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
            <Input
              label="Soyisim"
              name="lastName"
              required
              value={values.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="serviceType" className="text-sm font-medium text-foreground-secondary">
                Hizmet türü
              </label>
              <div className="relative">
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={values.serviceType}
                  onChange={(event) => update("serviceType", event.target.value)}
                  className={`${inputBaseClass} h-12 appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Seçiniz
                  </option>
                  {SERVICE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-medium text-foreground-secondary">
                Durum
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={(event) => update("status", event.target.value as Status)}
                  className={`${inputBaseClass} h-12 appearance-none pr-10`}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hizmete başlama tarihi"
              name="startDate"
              type="date"
              required
              value={values.startDate}
              onChange={(event) => update("startDate", event.target.value)}
            />
            <Input
              label="Hesap kesim tarihi"
              name="billingDate"
              type="date"
              value={values.billingDate}
              onChange={(event) => update("billingDate", event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-hairline bg-surface px-4 py-3.5">
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-medium text-foreground-secondary">
              <input
                type="checkbox"
                checked={isInstallmentPlan}
                onChange={(event) => toggleInstallmentPlan(event.target.checked)}
                className="size-4 rounded border-hairline accent-accent"
              />
              Yıllık plan (taksitli ödeme)
            </label>

            {isInstallmentPlan && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <Input
                  label="Toplam taksit"
                  name="totalInstallments"
                  type="number"
                  min={1}
                  step="1"
                  required={isInstallmentPlan}
                  value={values.totalInstallments}
                  onChange={(event) => update("totalInstallments", event.target.value)}
                />
                <Input
                  label="Ödenen taksit"
                  name="paidInstallments"
                  type="number"
                  min={0}
                  step="1"
                  value={values.paidInstallments}
                  onChange={(event) => update("paidInstallments", event.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fee" className="text-sm font-medium text-foreground-secondary">
              Ücret
            </label>
            <div className="flex gap-2">
              <input
                id="fee"
                name="fee"
                type="number"
                min={0}
                step="0.01"
                placeholder="0"
                value={values.fee}
                onChange={(event) => update("fee", event.target.value)}
                className={`${inputBaseClass} h-12 flex-1`}
              />
              <div className="relative w-28 shrink-0">
                <select
                  name="currency"
                  value={values.currency}
                  onChange={(event) => update("currency", event.target.value as Currency)}
                  className={`${inputBaseClass} h-12 appearance-none pr-8`}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-foreground-muted"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <Textarea
            label="Not"
            name="note"
            placeholder="Müşteriyle ilgili özel talepler, hatırlatmalar…"
            rows={3}
            value={values.note}
            onChange={(event) => update("note", event.target.value)}
          />

          {error && (
            <p role="alert" className="text-[13px] font-medium text-danger">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? "Kaydediliyor…" : order ? "Kaydet" : "Siparişi oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
