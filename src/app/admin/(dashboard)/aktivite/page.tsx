"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cardSurfaceClass } from "@/lib/utils";

interface ActivityLogEntry {
  rowNumber: number;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

const dateTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateTimeFormatter.format(date);
}

function ActionIcon({ action }: { action: string }) {
  if (action.includes("silindi")) return <Trash2 className="size-4 text-danger" aria-hidden />;
  if (action.includes("oluşturuldu") || action.includes("eklendi"))
    return <Plus className="size-4 text-success" aria-hidden />;
  return <Pencil className="size-4 text-foreground-muted" aria-hidden />;
}

export default function AdminActivityPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/activity");
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Aktivite kayıtları alınamadı.");
        setLoading(false);
        return;
      }
      setConfigured(data.configured ?? true);
      setEntries(data.entries ?? []);
      if (data.error) setError(data.error);
    } catch {
      setError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Aktivite</h1>
          <p className="mt-1 text-[14px] text-foreground-muted">
            Panelde kim ne zaman ne değiştirdi/sildi — son 150 kayıt.
          </p>
        </div>
        {configured && (
          <Button type="button" variant="secondary" size="md" onClick={fetchActivity} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Yenile
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">
          {error}
        </div>
      )}

      {!configured ? (
        <div className={`${cardSurfaceClass} flex flex-col items-center gap-3 px-6 py-20 text-center`}>
          <div className="flex size-12 items-center justify-center rounded-full bg-surface">
            <History className="size-5 text-foreground-muted" aria-hidden />
          </div>
          <p className="text-[15px] font-medium text-foreground">Google Sheets bağlantısı yapılandırılmamış</p>
          <p className="max-w-sm text-[13px] text-foreground-muted">
            Bağlandığında panel içindeki işlemler burada listelenecek. Kurulum adımları için bkz.
            docs/admin-panel-kurulum.md
          </p>
        </div>
      ) : entries === null ? (
        <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
          Yükleniyor…
        </div>
      ) : entries.length === 0 ? (
        <div className={`${cardSurfaceClass} px-6 py-16 text-center`}>
          <p className="text-[15px] font-medium text-foreground">Henüz kayıt yok</p>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Sipariş/gider/hesap üzerinde bir işlem yapıldığında burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => (
            <li
              key={entry.rowNumber}
              className={`${cardSurfaceClass} flex items-start gap-3 px-4 py-3`}
            >
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-elevated">
                <ActionIcon action={entry.action} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13.5px] font-medium text-foreground">{entry.action}</p>
                  <span className="shrink-0 text-[12px] text-foreground-muted">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                <p className="truncate text-[13px] text-foreground-secondary">{entry.detail}</p>
                <p className="text-[12px] text-foreground-muted">{entry.actor}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
