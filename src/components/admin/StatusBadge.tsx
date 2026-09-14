import { cn } from "@/lib/utils";
import type { Status } from "@/lib/google-sheets";

const STATUS_BADGE_CLASS: Record<Status, string> = {
  Aktif: "border-success/20 bg-success/10 text-success",
  Tamamlandı: "border-hairline bg-surface text-foreground-muted",
  İptal: "border-danger/20 bg-danger/10 text-danger",
};

// Google Review / Instagram NFC kartları abonelik değil, tek seferlik
// fiziksel ürün — Aktif/Tamamlandı ayrımının bir anlamı yok, o yüzden bu
// hizmet türlerinde (iptal edilmedikleri sürece) "Tek seferlik" etiketi
// gösterilir. İptal edilmişse yine de İptal rozeti görünür.
const ONE_TIME_SERVICE_TYPES = new Set(["Google Review Kartı", "Instagram NFC Kartı"]);

export function StatusBadge({ status, serviceType }: { status: Status; serviceType?: string }) {
  if (status !== "İptal" && serviceType && ONE_TIME_SERVICE_TYPES.has(serviceType)) {
    return (
      <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap text-foreground-muted">
        Tek seferlik
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
        STATUS_BADGE_CLASS[status],
      )}
    >
      {status}
    </span>
  );
}
