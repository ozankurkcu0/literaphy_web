"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Info, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cardSurfaceClass, cn, inputBaseClass } from "@/lib/utils";
import { TIMELINE_TYPE_META, dateToIso, todayIso } from "@/lib/calisma-program-meta";
import { SCHEDULE_EVENT_TYPES, type ScheduleEventType } from "@/lib/calisma-program-constants";
import type { ScheduleEvent } from "@/lib/google-sheets";

type Source = "sheets" | "unconfigured";

const WEEKDAY_HEADERS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/** 6 hafta x 7 gün (42 hücre) sabit bir ay ızgarası — önceki/sonraki aydan
 * taşan günler dahil, Pazartesi başlangıçlı (WEEKDAYS ile aynı sırada). */
function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

const EMPTY_FORM = {
  startTime: "",
  endTime: "",
  type: "Diğer" as ScheduleEventType,
  title: "",
  note: "",
};

export function CalismaProgramCalendar() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayIso());

  const [events, setEvents] = useState<ScheduleEvent[] | null>(null);
  const [source, setSource] = useState<Source>("sheets");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/calisma-program/etkinlikler");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Etkinlikler alınamadı.");
        return;
      }
      if (data.configured === false) {
        setSource("unconfigured");
        setLoadError(data.error ?? null);
        return;
      }
      setSource("sheets");
      setEvents(data.events ?? []);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const event of events ?? []) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.startTime || "99:99").localeCompare(b.startTime || "99:99"));
    }
    return map;
  }, [events]);

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthLabel = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(viewYear, viewMonth, 1));
  const today = todayIso();

  function goToMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToToday() {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(today);
  }

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const response = await fetch("/api/calisma-program/etkinlikler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formValues, date: selectedDate }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? "Etkinlik kaydedilemedi.");
        setSaving(false);
        return;
      }
      setFormValues(EMPTY_FORM);
      await fetchEvents();
    } catch {
      setFormError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function toggleDone(event: ScheduleEvent) {
    setEvents((prev) => prev?.map((item) => (item.eventId === event.eventId ? { ...item, done: !item.done } : item)) ?? prev);
    const response = await fetch(`/api/calisma-program/etkinlikler/${event.eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !event.done }),
    });
    if (!response.ok) await fetchEvents();
  }

  async function handleDelete(event: ScheduleEvent) {
    const confirmed = window.confirm(`"${event.title}" silinsin mi?`);
    if (!confirmed) return;

    const response = await fetch(`/api/calisma-program/etkinlikler/${event.eventId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Silinemedi.");
      return;
    }
    await fetchEvents();
  }

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];
  const selectedLabel = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${selectedDate}T00:00:00`),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Takvim</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">Sınavlar, quizler ve haftana eklediğin her şey tek yerde.</p>
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className={`${cardSurfaceClass} p-4`}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-foreground capitalize">{monthLabel}</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToMonth(-1)}
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                    aria-label="Önceki ay"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goToToday}
                    className="rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                  >
                    Bugün
                  </button>
                  <button
                    type="button"
                    onClick={() => goToMonth(1)}
                    className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                    aria-label="Sonraki ay"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {WEEKDAY_HEADERS.map((label) => (
                  <div key={label} className="py-1 text-center text-[11px] font-semibold text-foreground-muted">
                    {label}
                  </div>
                ))}
                {grid.map((date) => {
                  const iso = dateToIso(date);
                  const inMonth = date.getMonth() === viewMonth;
                  const dayEvents = eventsByDate.get(iso) ?? [];
                  const isToday = iso === today;
                  const isSelected = iso === selectedDate;
                  return (
                    <button
                      type="button"
                      key={iso}
                      onClick={() => setSelectedDate(iso)}
                      className={cn(
                        "flex min-h-[68px] flex-col items-start gap-1 rounded-md border px-1.5 py-1.5 text-left transition-colors",
                        isSelected ? "border-blue-400 bg-blue-50" : "border-transparent hover:bg-surface",
                        !inMonth && "opacity-40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full text-[11.5px] font-medium",
                          isToday ? "bg-blue-600 text-white" : "text-foreground",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 4).map((event) => (
                          <span key={event.eventId} className={cn("size-1.5 rounded-full", TIMELINE_TYPE_META[event.type].dot)} aria-hidden />
                        ))}
                        {dayEvents.length > 4 && <span className="text-[9px] text-foreground-muted">+{dayEvents.length - 4}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${cardSurfaceClass} flex flex-col p-5`}>
              <p className="mb-4 text-[14px] font-semibold text-foreground capitalize">{selectedLabel}</p>

              {selectedEvents.length === 0 ? (
                <p className="mb-4 text-[13.5px] text-foreground-muted">Bu gün için henüz bir şey yok.</p>
              ) : (
                <ul className="mb-4 flex flex-col gap-1.5">
                  {selectedEvents.map((event) => {
                    const meta = TIMELINE_TYPE_META[event.type];
                    const Icon = meta.icon;
                    return (
                      <li
                        key={event.eventId}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border px-3 py-2",
                          event.done ? "border-hairline bg-surface opacity-60" : meta.badge,
                        )}
                      >
                        <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-white", meta.dot)}>
                          <Icon className="size-3.5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cn("truncate text-[12.5px] font-medium text-foreground", event.done && "line-through")}>
                            {event.title}
                          </p>
                          <p className="truncate text-[11px] text-foreground-muted">
                            {event.startTime || "Saatsiz"}
                            {event.endTime ? `–${event.endTime}` : ""}
                            {event.note ? ` · ${event.note}` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => toggleDone(event)}
                            className="rounded-md px-1.5 py-1 text-[10.5px] font-medium text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                          >
                            {event.done ? "Geri al" : "Tamam"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(event)}
                            className="flex size-6 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            aria-label={`${event.title} sil`}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-3 border-t border-hairline pt-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="calType" className="text-sm font-medium text-foreground-secondary">
                    Tip
                  </label>
                  <div className="relative">
                    <select
                      id="calType"
                      value={formValues.type}
                      onChange={(e) => update("type", e.target.value as ScheduleEventType)}
                      className={cn(inputBaseClass, "h-11 appearance-none pr-9")}
                    >
                      {SCHEDULE_EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-foreground-muted" aria-hidden />
                  </div>
                </div>

                <Input label="Başlık" name="calTitle" placeholder="ör. Spor yap" value={formValues.title} onChange={(e) => update("title", e.target.value)} required />

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Saat (opsiyonel)" name="calStart" type="time" value={formValues.startTime} onChange={(e) => update("startTime", e.target.value)} />
                  <Input label="Bitiş (opsiyonel)" name="calEnd" type="time" value={formValues.endTime} onChange={(e) => update("endTime", e.target.value)} />
                </div>

                <Input label="Not (opsiyonel)" name="calNote" value={formValues.note} onChange={(e) => update("note", e.target.value)} />

                {formError && <p className="text-[13px] font-medium text-danger">{formError}</p>}

                <Button type="submit" variant="secondary" size="md" className="justify-center" disabled={saving}>
                  <Plus className="size-4" aria-hidden />
                  {saving ? "Kaydediliyor…" : "Bu güne ekle"}
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
