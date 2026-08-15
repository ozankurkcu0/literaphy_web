"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cardSurfaceClass, cn } from "@/lib/utils";

interface TrashEntry {
  rowNumber: number;
  trashId: string;
  deletedAt: string;
  type: "Sipariş" | "Gider";
  summary: string;
  actor: string;
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

export default function AdminTrashPage() {
  const [entries, setEntries] = useState<TrashEntry[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/trash");
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Çöp kutusu alınamadı.");
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
    fetchTrash();
  }, [fetchTrash]);

  async function handleRestore(entry: TrashEntry) {
    setBusyId(entry.trashId);
    try {
      const response = await fetch(`/api/admin/trash/${entry.trashId}`, { method: "POST" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error ?? "Kayıt geri getirilemedi.");
        setBusyId(null);
        return;
      }
      await fetchTrash();
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setBusyId(null);
  }

  async function handlePermanentDelete(entry: TrashEntry) {
    const confirmed = window.confirm(
      `"${entry.summary}" kalıcı olarak silinecek, bu işlem geri alınamaz. Emin misiniz?`,
    );
    if (!confirmed) return;

    setBusyId(entry.trashId);
    try {
      const response = await fetch(`/api/admin/trash/${entry.trashId}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error ?? "Kayıt kalıcı silinemedi.");
        setBusyId(null);
        return;
      }
      await fetchTrash();
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setBusyId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Çöp Kutusu</h1>
          <p className="mt-1 text-[14px] text-foreground-muted">
            Silinen sipariş ve giderler — geri getirebilir ya da kalıcı silebilirsiniz.
          </p>
        </div>
        {configured && (
          <Button type="button" variant="secondary" size="md" onClick={fetchTrash} disabled={loading}>
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
            <Trash2 className="size-5 text-foreground-muted" aria-hidden />
          </div>
          <p className="text-[15px] font-medium text-foreground">Google Sheets bağlantısı yapılandırılmamış</p>
          <p className="max-w-sm text-[13px] text-foreground-muted">
            Bağlandığında silinen kayıtlar burada listelenecek. Kurulum adımları için bkz.
            docs/admin-panel-kurulum.md
          </p>
        </div>
      ) : entries === null ? (
        <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
          Yükleniyor…
        </div>
      ) : entries.length === 0 ? (
        <div className={`${cardSurfaceClass} px-6 py-16 text-center`}>
          <p className="text-[15px] font-medium text-foreground">Çöp kutusu boş</p>
          <p className="mt-1 text-[13px] text-foreground-muted">Silinen sipariş/gider kayıtları burada görünecek.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => {
            const busy = busyId === entry.trashId;
            return (
              <li key={entry.trashId} className={`${cardSurfaceClass} flex items-center gap-3 px-4 py-3`}>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    entry.type === "Sipariş" ? "bg-accent-soft text-foreground" : "bg-elevated text-foreground-muted",
                  )}
                >
                  {entry.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-foreground">{entry.summary}</p>
                  <p className="text-[12px] text-foreground-muted">
                    {entry.actor} · {formatTimestamp(entry.deletedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleRestore(entry)}
                    disabled={busy}
                    title="Geri getir"
                    className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground disabled:opacity-40"
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                    Geri getir
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePermanentDelete(entry)}
                    disabled={busy}
                    title="Kalıcı sil"
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
