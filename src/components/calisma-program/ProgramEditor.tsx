"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ChevronDown, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, inputBaseClass } from "@/lib/utils";
import { TIMELINE_KINDS, WEEKDAYS, type TimelineKind, type Weekday } from "@/lib/calisma-program-constants";
import { TIMELINE_TYPE_META } from "@/lib/calisma-program-meta";
import { WeeklyTimetable } from "@/components/calisma-program/WeeklyTimetable";
import type { ClassScheduleEntry, ClassScheduleEntryInput } from "@/lib/google-sheets";

type Source = "sheets" | "unconfigured";

const EMPTY_ENTRY: ClassScheduleEntryInput = {
  weekday: "Pazartesi",
  startTime: "",
  endTime: "",
  courseName: "",
  location: "",
  note: "",
  kind: "Ders",
};

export function CalismaProgramProgramEditor() {
  const [entries, setEntries] = useState<ClassScheduleEntry[] | null>(null);
  const [source, setSource] = useState<Source>("sheets");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<ClassScheduleEntryInput>(EMPTY_ENTRY);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/calisma-program/ders-programi");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Ders programı alınamadı.");
        return;
      }
      if (data.configured === false) {
        setSource("unconfigured");
        setLoadError(data.error ?? null);
        return;
      }
      setSource("sheets");
      setEntries(data.entries ?? []);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  function update<K extends keyof ClassScheduleEntryInput>(key: K, value: ClassScheduleEntryInput[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(entry: ClassScheduleEntry) {
    setEditingEntryId(entry.entryId);
    setFormValues({
      weekday: entry.weekday,
      startTime: entry.startTime,
      endTime: entry.endTime,
      courseName: entry.courseName,
      location: entry.location,
      note: entry.note,
      kind: entry.kind,
    });
    setFormError(null);
  }

  function cancelEdit() {
    setEditingEntryId(null);
    setFormValues(EMPTY_ENTRY);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);

    const isEdit = Boolean(editingEntryId);
    const url = isEdit ? `/api/calisma-program/ders-programi/${editingEntryId}` : "/api/calisma-program/ders-programi";

    try {
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? "Ders kaydedilemedi.");
        setSaving(false);
        return;
      }
      cancelEdit();
      await fetchEntries();
    } catch {
      setFormError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function handleDelete(entry: ClassScheduleEntry) {
    const confirmed = window.confirm(`"${entry.courseName}" kaydını programdan silmek istediğine emin misin?`);
    if (!confirmed) return;

    const response = await fetch(`/api/calisma-program/ders-programi/${entry.entryId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Ders silinemedi.");
      return;
    }
    if (editingEntryId === entry.entryId) cancelEdit();
    await fetchEntries();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Sabit Haftalık Program</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Her hafta tekrar eden dersler ve aktiviteler — spor, kulüp, ders çalışma bloğu, ne olursa.
        </p>
      </div>

      {source === "unconfigured" ? (
        <div className="flex items-start gap-3 rounded-lg border border-hairline bg-surface px-5 py-4 text-[13.5px] text-foreground-secondary">
          <Info className="mt-0.5 size-4 shrink-0 text-foreground-muted" aria-hidden />
          <p>{loadError ?? "Google Sheets bağlantısı henüz yapılandırılmamış."}</p>
        </div>
      ) : (
        <>
          {loadError && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">{loadError}</div>
          )}

          {entries === null && !loadError ? (
            <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
              Yükleniyor…
            </div>
          ) : (
            <WeeklyTimetable entries={entries ?? []} onEditEntry={startEdit} onDeleteEntry={handleDelete} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-5">
            <p className="text-[14px] font-semibold text-foreground">{editingEntryId ? "Kaydı düzenle" : "Programa ekle"}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="entryWeekday" className="text-sm font-medium text-foreground-secondary">
                  Gün
                </label>
                <div className="relative">
                  <select
                    id="entryWeekday"
                    value={formValues.weekday}
                    onChange={(e) => update("weekday", e.target.value as Weekday)}
                    className={cn(inputBaseClass, "h-12 appearance-none pr-9")}
                  >
                    {WEEKDAYS.map((weekday) => (
                      <option key={weekday} value={weekday}>
                        {weekday}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-foreground-muted" aria-hidden />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="entryKind" className="text-sm font-medium text-foreground-secondary">
                  Tip
                </label>
                <div className="relative">
                  <select
                    id="entryKind"
                    value={formValues.kind}
                    onChange={(e) => update("kind", e.target.value as TimelineKind)}
                    className={cn(inputBaseClass, "h-12 appearance-none pr-9")}
                  >
                    {TIMELINE_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {TIMELINE_TYPE_META[kind].label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-foreground-muted" aria-hidden />
                </div>
              </div>
              <Input label="Başlık" name="entryCourseName" placeholder="ör. Lineer Cebir, Spor" value={formValues.courseName} onChange={(e) => update("courseName", e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Başlangıç saati" name="entryStart" type="time" value={formValues.startTime} onChange={(e) => update("startTime", e.target.value)} required />
              <Input label="Bitiş saati" name="entryEnd" type="time" value={formValues.endTime} onChange={(e) => update("endTime", e.target.value)} required />
            </div>

            <Input label="Yer (opsiyonel)" name="entryLocation" placeholder="ör. B Blok 204" value={formValues.location} onChange={(e) => update("location", e.target.value)} />
            <Input label="Not (opsiyonel)" name="entryNote" value={formValues.note} onChange={(e) => update("note", e.target.value)} />

            {formError && <p className="text-[13px] font-medium text-danger">{formError}</p>}

            <div className="flex justify-end gap-2">
              {editingEntryId && (
                <Button type="button" variant="ghost" size="md" onClick={cancelEdit}>
                  Vazgeç
                </Button>
              )}
              <Button type="submit" variant="secondary" size="md" disabled={saving}>
                {!editingEntryId && <Plus className="size-4" aria-hidden />}
                {saving ? "Kaydediliyor…" : editingEntryId ? "Kaydet" : "Ekle"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
