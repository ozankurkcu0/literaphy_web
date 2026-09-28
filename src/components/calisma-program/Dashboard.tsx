"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, ChevronDown, Info, Trash2 } from "lucide-react";
import { cardSurfaceClass, cn, inputBaseClass } from "@/lib/utils";
import {
  TIMELINE_TYPE_META,
  currentWeekStartIso,
  jsDayToWeekday,
  todayIso,
  weekRangeLabel,
  type TimelineKind,
} from "@/lib/calisma-program-meta";
import { SCHEDULE_EVENT_TYPES, type ScheduleEventType } from "@/lib/calisma-program-constants";
import type { ClassScheduleEntry, ScheduleEvent, WeeklyNote } from "@/lib/google-sheets";

type Source = "sheets" | "unconfigured";

interface TimelineItem {
  key: string;
  kind: TimelineKind;
  startTime: string;
  endTime: string;
  title: string;
  sublabel: string;
}

export function CalismaProgramDashboard() {
  const [classEntries, setClassEntries] = useState<ClassScheduleEntry[] | null>(null);
  const [events, setEvents] = useState<ScheduleEvent[] | null>(null);
  const [weeklyNotes, setWeeklyNotes] = useState<WeeklyNote[] | null>(null);
  const [source, setSource] = useState<Source>("sheets");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [quickTitle, setQuickTitle] = useState("");
  const [quickType, setQuickType] = useState<ScheduleEventType>("Diğer");
  const [quickError, setQuickError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteSaving, setNoteSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [scheduleRes, eventsRes, notesRes] = await Promise.all([
        fetch("/api/calisma-program/ders-programi"),
        fetch("/api/calisma-program/etkinlikler"),
        fetch("/api/calisma-program/haftalik-notlar"),
      ]);
      const scheduleData = await scheduleRes.json();
      const eventsData = await eventsRes.json();
      const notesData = await notesRes.json();

      if (!scheduleRes.ok || !eventsRes.ok || !notesRes.ok) {
        setLoadError(scheduleData.error ?? eventsData.error ?? notesData.error ?? "Veriler alınamadı.");
        return;
      }
      if (scheduleData.configured === false || eventsData.configured === false || notesData.configured === false) {
        setSource("unconfigured");
        setLoadError(scheduleData.error ?? eventsData.error ?? notesData.error ?? null);
        return;
      }

      setSource("sheets");
      setClassEntries(scheduleData.entries ?? []);
      setEvents(eventsData.events ?? []);
      setWeeklyNotes(notesData.notes ?? []);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const today = todayIso();
  const todayWeekday = jsDayToWeekday(new Date().getDay());
  const weekStart = currentWeekStartIso();

  const thisWeekNotes = useMemo(() => {
    return (weeklyNotes ?? [])
      .filter((note) => note.weekStart === weekStart)
      .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  }, [weeklyNotes, weekStart]);

  const todayTimeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];

    for (const entry of classEntries ?? []) {
      if (entry.weekday !== todayWeekday) continue;
      items.push({
        key: `ders-${entry.entryId}`,
        kind: entry.kind,
        startTime: entry.startTime,
        endTime: entry.endTime,
        title: entry.courseName,
        sublabel: entry.location,
      });
    }

    return items.sort((a, b) => (a.startTime || "99:99").localeCompare(b.startTime || "99:99"));
  }, [classEntries, todayWeekday]);

  const todayTodos = useMemo(() => {
    return (events ?? [])
      .filter((event) => event.date === today)
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return (a.startTime || "99:99").localeCompare(b.startTime || "99:99");
      });
  }, [events, today]);

  const upcomingEvents = useMemo(() => {
    return (events ?? [])
      .filter((event) => event.date > today && !event.done)
      .sort((a, b) => (a.date + (a.startTime || "99:99")).localeCompare(b.date + (b.startTime || "99:99")))
      .slice(0, 12);
  }, [events, today]);

  async function handleQuickAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuickError(null);
    if (!quickTitle.trim()) return;
    setSaving(true);

    try {
      const response = await fetch("/api/calisma-program/etkinlikler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, type: quickType, title: quickTitle.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setQuickError(data.error ?? "Eklenemedi.");
        setSaving(false);
        return;
      }
      setQuickTitle("");
      await fetchAll();
    } catch {
      setQuickError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoteError(null);
    if (!noteText.trim()) return;
    setNoteSaving(true);

    try {
      const response = await fetch("/api/calisma-program/haftalik-notlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart, text: noteText.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNoteError(data.error ?? "Not eklenemedi.");
        setNoteSaving(false);
        return;
      }
      setNoteText("");
      await fetchAll();
    } catch {
      setNoteError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setNoteSaving(false);
  }

  async function toggleNoteDone(note: WeeklyNote) {
    setWeeklyNotes((prev) => prev?.map((item) => (item.noteId === note.noteId ? { ...item, done: !item.done } : item)) ?? prev);
    const response = await fetch(`/api/calisma-program/haftalik-notlar/${note.noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !note.done }),
    });
    if (!response.ok) await fetchAll();
  }

  async function handleDeleteNote(note: WeeklyNote) {
    const response = await fetch(`/api/calisma-program/haftalik-notlar/${note.noteId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Not silinemedi.");
      return;
    }
    await fetchAll();
  }

  async function toggleDone(event: ScheduleEvent) {
    setEvents((prev) => prev?.map((item) => (item.eventId === event.eventId ? { ...item, done: !item.done } : item)) ?? prev);
    const response = await fetch(`/api/calisma-program/etkinlikler/${event.eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !event.done }),
    });
    if (!response.ok) await fetchAll();
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
    await fetchAll();
  }

  const doneCount = todayTodos.filter((event) => event.done).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">
          Merhaba! Bugün {todayTimeline.length > 0 ? `${todayTimeline.length} işin var` : "programın boş"} 🎓
        </h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          {new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
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
            <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">
              {loadError}
            </div>
          )}

          <section className={`${cardSurfaceClass} p-5`}>
            <p className="mb-4 text-[14px] font-semibold text-foreground">Bugünün Programı</p>
            {classEntries === null ? (
              <p className="text-[13.5px] text-foreground-muted">Yükleniyor…</p>
            ) : todayTimeline.length === 0 ? (
              <p className="text-[13.5px] text-foreground-muted">Bugün için ders yok.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {todayTimeline.map((item) => {
                  const meta = TIMELINE_TYPE_META[item.kind];
                  const Icon = meta.icon;
                  return (
                    <li key={item.key} className={cn("flex items-center gap-3 rounded-lg border px-4 py-3", meta.badge)}>
                      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-white", meta.dot)}>
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-foreground">{item.title}</p>
                        <p className="truncate text-[12px] text-foreground-muted">
                          {item.startTime}
                          {item.endTime ? `–${item.endTime}` : ""}
                          {item.sublabel ? ` · ${item.sublabel}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={`${cardSurfaceClass} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-foreground">Yapılacaklar</p>
              {todayTodos.length > 0 && (
                <p className="text-[12px] text-foreground-muted">
                  {doneCount}/{todayTodos.length} tamamlandı
                </p>
              )}
            </div>

            {todayTodos.length === 0 ? (
              <p className="mb-4 text-[13.5px] text-foreground-muted">Bugün için henüz bir şey eklemedin.</p>
            ) : (
              <ul className="mb-4 flex flex-col gap-1.5">
                {todayTodos.map((event) => {
                  const meta = TIMELINE_TYPE_META[event.type];
                  return (
                    <li
                      key={event.eventId}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                        event.done ? "border-hairline bg-surface" : meta.badge,
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(event)}
                        aria-pressed={event.done}
                        aria-label={event.done ? `${event.title} tamamlandı, geri al` : `${event.title} tamamlandı olarak işaretle`}
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-transparent transition-colors",
                          event.done ? "border-foreground-muted bg-foreground-muted text-white" : meta.dot.replace("bg-", "border-"),
                        )}
                      >
                        {event.done && <Check className="size-3" aria-hidden />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-[13.5px] font-medium text-foreground", event.done && "text-foreground-muted line-through")}>
                          {event.title}
                        </p>
                        {(event.startTime || event.note) && (
                          <p className="truncate text-[11.5px] text-foreground-muted">
                            {event.startTime}
                            {event.startTime && event.note ? " · " : ""}
                            {event.note}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                        aria-label={`${event.title} sil`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <form onSubmit={handleQuickAdd} className="flex items-center gap-2 border-t border-hairline pt-4">
              <div className="relative shrink-0">
                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value as ScheduleEventType)}
                  aria-label="Tip"
                  className={cn(inputBaseClass, "h-11 w-[104px] appearance-none pr-7 text-[13px]")}
                >
                  {SCHEDULE_EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-foreground-muted" aria-hidden />
              </div>
              <input
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Bugüne bir şey ekle… ör. Kütüphaneye git"
                className={cn(inputBaseClass, "h-11 flex-1")}
              />
              <button
                type="submit"
                disabled={saving || !quickTitle.trim()}
                className="flex h-11 shrink-0 items-center justify-center rounded-md bg-foreground px-4 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-40"
              >
                Ekle
              </button>
            </form>
            {quickError && <p className="mt-2 text-[13px] font-medium text-danger">{quickError}</p>}
          </section>

          <section className={`${cardSurfaceClass} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-foreground">Bu Haftanın Notları</p>
              <p className="text-[12px] text-foreground-muted">{weekRangeLabel(weekStart)}</p>
            </div>

            {weeklyNotes === null ? (
              <p className="mb-4 text-[13.5px] text-foreground-muted">Yükleniyor…</p>
            ) : thisWeekNotes.length === 0 ? (
              <p className="mb-4 text-[13.5px] text-foreground-muted">
                Bu hafta için henüz bir not yok. ör. &quot;bu hafta notlarını toparla&quot;, &quot;ödev teslim et&quot;.
              </p>
            ) : (
              <ul className="mb-4 flex flex-col gap-1.5">
                {thisWeekNotes.map((note) => (
                  <li
                    key={note.noteId}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                      note.done ? "border-hairline bg-surface" : "border-hairline",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleNoteDone(note)}
                      aria-pressed={note.done}
                      aria-label={note.done ? "not tamamlandı, geri al" : "not tamamlandı olarak işaretle"}
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-transparent transition-colors",
                        note.done ? "border-foreground-muted bg-foreground-muted text-white" : "border-blue-400",
                      )}
                    >
                      {note.done && <Check className="size-3" aria-hidden />}
                    </button>
                    <p className={cn("min-w-0 flex-1 text-[13.5px] font-medium text-foreground", note.done && "text-foreground-muted line-through")}>
                      {note.text}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                      aria-label="notu sil"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddNote} className="flex items-center gap-2 border-t border-hairline pt-4">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Bu haftaya bir not ekle… ör. Şunu şunu yap"
                className={cn(inputBaseClass, "h-11 flex-1")}
              />
              <button
                type="submit"
                disabled={noteSaving || !noteText.trim()}
                className="flex h-11 shrink-0 items-center justify-center rounded-md bg-foreground px-4 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-40"
              >
                Ekle
              </button>
            </form>
            {noteError && <p className="mt-2 text-[13px] font-medium text-danger">{noteError}</p>}
          </section>

          <section className={`${cardSurfaceClass} p-5`}>
            <p className="mb-4 text-[14px] font-semibold text-foreground">Yaklaşan Etkinlikler</p>
            {events === null ? (
              <p className="text-[13.5px] text-foreground-muted">Yükleniyor…</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-[13.5px] text-foreground-muted">Yaklaşan etkinlik yok.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {upcomingEvents.map((event) => {
                  const meta = TIMELINE_TYPE_META[event.type];
                  const Icon = meta.icon;
                  return (
                    <li key={event.eventId} className="flex items-center gap-3 rounded-lg border border-hairline px-4 py-2.5">
                      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-white", meta.dot)}>
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-foreground">{event.title}</p>
                        <p className="truncate text-[12px] text-foreground-muted">
                          {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" }).format(new Date(event.date))}
                          {event.startTime ? ` · ${event.startTime}` : ""}
                          {event.note ? ` · ${event.note}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleDone(event)}
                          className="rounded-md px-2 py-1 text-[12px] font-medium text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
                        >
                          Tamamlandı
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event)}
                          className="flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                          aria-label={`${event.title} etkinliğini sil`}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
