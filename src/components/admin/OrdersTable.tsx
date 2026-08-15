"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Order } from "@/lib/google-sheets";

function formatDateDisplay(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

function formatFee(order: Order): string {
  if (!order.fee) return "—";
  const numeric = Number(order.fee);
  if (Number.isNaN(numeric)) return order.fee;
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: order.currency }).format(numeric);
  } catch {
    return `${new Intl.NumberFormat("tr-TR").format(numeric)} ${order.currency}`;
  }
}

function formatInstallments(order: Order): string {
  const total = Number(order.totalInstallments);
  if (!order.totalInstallments || Number.isNaN(total) || total <= 0) return "—";
  const paid = Number(order.paidInstallments) || 0;
  const remaining = Math.max(total - paid, 0);
  return `${paid}/${total} · ${remaining} kalan`;
}

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function OrdersTable({
  orders,
  onEdit,
  onDelete,
  emptyTitle = "Henüz sipariş kaydı yok",
  emptyDescription = "Sağ üstteki “Yeni Sipariş” butonuyla ilk kaydı oluşturabilirsiniz.",
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-[13px] text-foreground-muted">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full min-w-[1080px] border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-hairline bg-surface text-foreground-muted">
            <th className="px-4 py-3 font-medium">Sipariş No</th>
            <th className="px-4 py-3 font-medium">Telefon</th>
            <th className="px-4 py-3 font-medium">E-posta</th>
            <th className="px-4 py-3 font-medium">İsim Soyisim</th>
            <th className="px-4 py-3 font-medium">Hizmet Türü</th>
            <th className="px-4 py-3 font-medium">Başlama</th>
            <th className="px-4 py-3 font-medium">Hesap Kesim</th>
            <th className="px-4 py-3 font-medium">Taksit</th>
            <th className="px-4 py-3 font-medium">Ücret</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNumber} className="border-b border-hairline last:border-0 hover:bg-surface">
              <td className="px-4 py-3 font-mono text-foreground-secondary">#{order.orderNumber}</td>
              <td className="px-4 py-3 text-foreground-secondary">{order.phone || "—"}</td>
              <td className="px-4 py-3 text-foreground-secondary">{order.email || "—"}</td>
              <td className="px-4 py-3 text-foreground">
                {order.firstName} {order.lastName}
              </td>
              <td className="px-4 py-3 text-foreground-secondary">{order.serviceType}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatDateDisplay(order.startDate)}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatDateDisplay(order.billingDate)}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatInstallments(order)}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatFee(order)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(order)}
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                    aria-label={`${order.orderNumber} numaralı siparişi düzenle`}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(order)}
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    aria-label={`${order.orderNumber} numaralı siparişi sil`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
