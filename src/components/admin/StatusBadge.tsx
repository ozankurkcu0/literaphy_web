import { cn } from "@/lib/utils";
import type { Status } from "@/lib/google-sheets";

const STATUS_BADGE_CLASS: Record<Status, string> = {
  Aktif: "border-success/20 bg-success/10 text-success",
  Tamamlandı: "border-hairline bg-surface text-foreground-muted",
  İptal: "border-danger/20 bg-danger/10 text-danger",
};

export function StatusBadge({ status }: { status: Status }) {
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
