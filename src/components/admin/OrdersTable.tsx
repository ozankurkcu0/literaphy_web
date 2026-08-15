"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Info, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrencyAmount, formatDateDisplay } from "@/lib/order-format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Order } from "@/lib/google-sheets";

function formatFee(order: Order): string {
  if (!order.fee) return "—";
  const numeric = Number(order.fee);
  if (Number.isNaN(numeric)) return order.fee;
  return formatCurrencyAmount(numeric, order.currency);
}

function formatInstallments(order: Order): string {
  const total = Number(order.totalInstallments);
  if (!order.totalInstallments || Number.isNaN(total) || total <= 0) return "—";
  const paid = Number(order.paidInstallments) || 0;
  const remaining = Math.max(total - paid, 0);
  return `${paid}/${total} · ${remaining} kalan`;
}

/** Hesap kesim tarihi bugüne göre ne kadar yakın/geçmişse ona göre renk —
 * geçmiş ve hâlâ aktifse kırmızı, 7 gün içindeyse turuncu. */
function billingDateClass(order: Order): string {
  if (!order.billingDate || order.status !== "Aktif") return "text-foreground-secondary";
  const diffDays = Math.floor((new Date(order.billingDate).getTime() - Date.now()) / 86_400_000);
  if (diffDays < 0) return "font-medium text-danger";
  if (diffDays <= 7) return "font-medium text-warning";
  return "text-foreground-secondary";
}

type SortKey = "orderNumber" | "name" | "startDate" | "billingDate" | "fee" | "status";
type SortDir = "asc" | "desc";

function compareOrders(a: Order, b: Order, key: SortKey): number {
  switch (key) {
    case "orderNumber":
      return Number(a.orderNumber) - Number(b.orderNumber);
    case "name":
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, "tr");
    case "startDate":
      return (a.startDate || "").localeCompare(b.startDate || "");
    case "billingDate":
      return (a.billingDate || "").localeCompare(b.billingDate || "");
    case "fee":
      return (Number(a.fee) || 0) - (Number(b.fee) || 0);
    case "status":
      return a.status.localeCompare(b.status, "tr");
    default:
      return 0;
  }
}

interface OrdersTableProps {
  orders: Order[];
  selectedOrderNumbers: Set<string>;
  onToggleSelect: (orderNumber: string) => void;
  onToggleSelectAll: () => void;
  onViewDetail: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function OrdersTable({
  orders,
  selectedOrderNumbers,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onEdit,
  onDelete,
  emptyTitle = "Henüz sipariş kaydı yok",
  emptyDescription = "Sağ üstteki “Yeni Sipariş” butonuyla ilk kaydı oluşturabilirsiniz.",
}: OrdersTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);

  const sortedOrders = useMemo(() => {
    if (!sort) return orders;
    const sorted = [...orders].sort((a, b) => compareOrders(a, b, sort.key));
    return sort.dir === "asc" ? sorted : sorted.reverse();
  }, [orders, sort]);

  function handleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      return prev.dir === "asc" ? { key, dir: "desc" } : null;
    });
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-[13px] text-foreground-muted">{emptyDescription}</p>
      </div>
    );
  }

  const allSelected = orders.length > 0 && orders.every((order) => selectedOrderNumbers.has(order.orderNumber));
  const someSelected = !allSelected && orders.some((order) => selectedOrderNumbers.has(order.orderNumber));

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full min-w-[1160px] border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-hairline bg-surface text-foreground-muted">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Tümünü seç"
                className="size-4 cursor-pointer accent-accent"
              />
            </th>
            <SortableHeader columnKey="orderNumber" label="Sipariş No" sort={sort} onSort={handleSort} />
            <th className="px-4 py-3 font-medium">Telefon</th>
            <th className="px-4 py-3 font-medium">E-posta</th>
            <SortableHeader columnKey="name" label="İsim Soyisim" sort={sort} onSort={handleSort} />
            <th className="px-4 py-3 font-medium">Hizmet Türü</th>
            <SortableHeader columnKey="startDate" label="Başlama" sort={sort} onSort={handleSort} />
            <SortableHeader columnKey="billingDate" label="Hesap Kesim" sort={sort} onSort={handleSort} />
            <th className="px-4 py-3 font-medium">Taksit</th>
            <SortableHeader columnKey="fee" label="Ücret" sort={sort} onSort={handleSort} />
            <SortableHeader columnKey="status" label="Durum" sort={sort} onSort={handleSort} />
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr
              key={order.orderNumber}
              className={cn(
                "border-b border-hairline last:border-0 hover:bg-surface",
                selectedOrderNumbers.has(order.orderNumber) && "bg-accent-soft/40",
              )}
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrderNumbers.has(order.orderNumber)}
                  onChange={() => onToggleSelect(order.orderNumber)}
                  aria-label={`${order.orderNumber} numaralı siparişi seç`}
                  className="size-4 cursor-pointer accent-accent"
                />
              </td>
              <td className="px-4 py-3 font-mono text-foreground-secondary">#{order.orderNumber}</td>
              <td className="px-4 py-3 text-foreground-secondary">{order.phone || "—"}</td>
              <td className="px-4 py-3 text-foreground-secondary">{order.email || "—"}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onViewDetail(order)}
                  className="text-left text-foreground underline decoration-transparent underline-offset-2 transition-colors hover:decoration-foreground-muted"
                >
                  {order.firstName} {order.lastName}
                </button>
              </td>
              <td className="px-4 py-3 text-foreground-secondary">{order.serviceType}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatDateDisplay(order.startDate)}</td>
              <td className={cn("px-4 py-3", billingDateClass(order))}>{formatDateDisplay(order.billingDate)}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatInstallments(order)}</td>
              <td className="px-4 py-3 text-foreground-secondary">{formatFee(order)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onViewDetail(order)}
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                    aria-label={`${order.orderNumber} numaralı siparişin ayrıntılarını gör`}
                  >
                    <Info className="size-4" aria-hidden />
                  </button>
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

function SortableHeader({
  columnKey,
  label,
  sort,
  onSort,
}: {
  columnKey: SortKey;
  label: string;
  sort: { key: SortKey; dir: SortDir } | null;
  onSort: (key: SortKey) => void;
}) {
  const active = sort?.key === columnKey;
  const Icon = active ? (sort?.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={cn(
          "flex items-center gap-1.5 transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />
      </button>
    </th>
  );
}
