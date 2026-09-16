"use client";

import { useEffect, useState } from "react";
import { Check, Pencil as PencilIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { isOneTimeServiceType } from "@/lib/order-form-options";
import { addOneMonth, dateToIso, formatCurrencyAmount, formatDateDisplay } from "@/lib/order-format";
import type { Order } from "@/lib/google-sheets";

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleMarkPaid() {
    setMarkingPaid(true);
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
            <StatusBadge status={order.status} serviceType={order.serviceType} />
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
                  {((order.billingDate && order.status === "Aktif") || order.status === "Planlandı") && (
                    <button
                      type="button"
                      onClick={handleMarkPaid}
                      disabled={markingPaid}
                      className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      <Check className="size-3" aria-hidden />
                      {markingPaid ? "…" : order.status === "Planlandı" ? "Teslim edildi" : "Ödendi"}
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
        </div>
      </div>
    </div>
  );
}
