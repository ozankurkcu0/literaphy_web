"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Circle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cardSurfaceClass } from "@/lib/utils";

interface InboxLead {
  uid: number;
  subject: string;
  source: string;
  date: string;
  seen: boolean;
  answered: boolean;
  fields: { label: string; value: string }[];
}

function formatMessageDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    date,
  );
}

export default function AdminInboxPage() {
  const [leads, setLeads] = useState<InboxLead[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingUid, setTogglingUid] = useState<number | null>(null);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/inbox");
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Gelen kutusu alınamadı.");
        setLoading(false);
        return;
      }
      setConfigured(data.configured ?? true);
      setLeads(data.leads ?? []);
      if (data.error) setError(data.error);
    } catch {
      setError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  async function toggleAnswered(lead: InboxLead) {
    const nextAnswered = !lead.answered;
    setTogglingUid(lead.uid);
    setLeads((prev) => prev?.map((item) => (item.uid === lead.uid ? { ...item, answered: nextAnswered } : item)) ?? prev);

    const response = await fetch(`/api/admin/inbox/${lead.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answered: nextAnswered }),
    });
    if (!response.ok) {
      // geri al
      setLeads((prev) => prev?.map((item) => (item.uid === lead.uid ? { ...item, answered: lead.answered } : item)) ?? prev);
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "İşaretlenemedi.");
    }
    setTogglingUid(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Gelen Kutusu — Bekleyen Müşteriler</h1>
          <p className="mt-1 text-[14px] text-foreground-muted">
            İletişim, N8N ve QR Menü demo formlarından gelen talepler.
          </p>
        </div>
        {configured && (
          <Button type="button" variant="secondary" size="md" onClick={fetchInbox} disabled={loading}>
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
            <Inbox className="size-5 text-foreground-muted" aria-hidden />
          </div>
          <p className="text-[15px] font-medium text-foreground">Gmail entegrasyonu henüz bağlanmadı</p>
          <p className="max-w-sm text-[13px] text-foreground-muted">
            Bağlandığında form talepleri burada listelenecek. Kurulum adımları için bkz.
            docs/admin-panel-kurulum.md
          </p>
        </div>
      ) : leads === null ? (
        <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
          Yükleniyor…
        </div>
      ) : leads.length === 0 ? (
        <div className={`${cardSurfaceClass} px-6 py-16 text-center`}>
          <p className="text-[15px] font-medium text-foreground">Bekleyen müşteri yok</p>
          <p className="mt-1 text-[13px] text-foreground-muted">
            İletişim, N8N ve QR Menü demo formlarından gelen talepler burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {leads.map((lead) => (
            <li
              key={lead.uid}
              className={`${cardSurfaceClass} px-5 py-4 ${lead.answered ? "opacity-60" : !lead.seen ? "border-accent/20 bg-accent-soft" : ""}`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-[12px] font-medium text-foreground-secondary">
                    {lead.source || "Form talebi"}
                  </span>
                  {lead.answered && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[12px] font-medium text-success">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                      Cevap verildi
                    </span>
                  )}
                </div>
                <span className="text-[12px] text-foreground-muted">{formatMessageDate(lead.date)}</span>
              </div>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {lead.fields.map((field) => (
                  <div key={field.label}>
                    <dt className="text-[12px] text-foreground-muted">{field.label}</dt>
                    <dd className="text-[13.5px] whitespace-pre-wrap text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4">
                <Button
                  type="button"
                  variant={lead.answered ? "ghost" : "secondary"}
                  size="md"
                  onClick={() => toggleAnswered(lead)}
                  disabled={togglingUid === lead.uid}
                >
                  {lead.answered ? (
                    <>
                      <Circle className="size-4" aria-hidden />
                      Cevap verilmedi olarak işaretle
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" aria-hidden />
                      Cevap verildi olarak işaretle
                    </>
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
