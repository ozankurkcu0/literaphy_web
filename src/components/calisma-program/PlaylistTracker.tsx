"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, ExternalLink, Info, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cardSurfaceClass, cn } from "@/lib/utils";
import type { StudyPlaylist, StudyPlaylistInput } from "@/lib/google-sheets";

type Source = "sheets" | "unconfigured";

const EMPTY_ENTRY: StudyPlaylistInput = {
  courseName: "",
  title: "",
  url: "",
  totalVideos: 0,
  watchedVideos: 0,
  done: false,
};

function progressPercent(playlist: Pick<StudyPlaylist, "totalVideos" | "watchedVideos" | "done">): number {
  if (playlist.totalVideos > 0) {
    return Math.min(100, Math.round((playlist.watchedVideos / playlist.totalVideos) * 100));
  }
  return playlist.done ? 100 : 0;
}

export function PlaylistTracker() {
  const [playlists, setPlaylists] = useState<StudyPlaylist[] | null>(null);
  const [source, setSource] = useState<Source>("sheets");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<StudyPlaylistInput>(EMPTY_ENTRY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/calisma-program/playlistler");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Playlistler alınamadı.");
        return;
      }
      if (data.configured === false) {
        setSource("unconfigured");
        setLoadError(data.error ?? null);
        return;
      }
      setSource("sheets");
      setPlaylists(data.playlists ?? []);
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  function update<K extends keyof StudyPlaylistInput>(key: K, value: StudyPlaylistInput[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!formValues.title.trim()) {
      setFormError("Başlık gerekli.");
      return;
    }
    setSaving(true);

    try {
      const response = await fetch("/api/calisma-program/playlistler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? "Playlist kaydedilemedi.");
        setSaving(false);
        return;
      }
      setFormValues(EMPTY_ENTRY);
      await fetchPlaylists();
    } catch {
      setFormError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function patchPlaylist(playlist: StudyPlaylist, patch: Partial<StudyPlaylistInput>) {
    const next = { ...playlist, ...patch };
    setPlaylists((prev) => prev?.map((item) => (item.playlistId === playlist.playlistId ? next : item)) ?? prev);
    const response = await fetch(`/api/calisma-program/playlistler/${playlist.playlistId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!response.ok) await fetchPlaylists();
  }

  function handleWatchedChange(playlist: StudyPlaylist, rawValue: string) {
    const value = Math.max(0, Number.parseInt(rawValue, 10) || 0);
    const done = playlist.totalVideos > 0 ? value >= playlist.totalVideos : playlist.done;
    patchPlaylist(playlist, { watchedVideos: value, done });
  }

  function toggleDone(playlist: StudyPlaylist) {
    patchPlaylist(playlist, { done: !playlist.done });
  }

  async function handleDelete(playlist: StudyPlaylist) {
    const confirmed = window.confirm(`"${playlist.title}" silinsin mi?`);
    if (!confirmed) return;

    const response = await fetch(`/api/calisma-program/playlistler/${playlist.playlistId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error ?? "Silinemedi.");
      return;
    }
    await fetchPlaylists();
  }

  const inProgress = (playlists ?? []).filter((playlist) => !playlist.done);
  const completed = (playlists ?? []).filter((playlist) => playlist.done);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Ders Playlistleri</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Videoları YouTube&apos;dan izle, burada sadece ilerlemeni takip et.
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

          {playlists === null && !loadError ? (
            <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
              Yükleniyor…
            </div>
          ) : (
            <>
              <section className={`${cardSurfaceClass} p-5`}>
                <p className="mb-4 text-[14px] font-semibold text-foreground">
                  Devam Edenler {inProgress.length > 0 ? `(${inProgress.length})` : ""}
                </p>
                {inProgress.length === 0 ? (
                  <p className="text-[13.5px] text-foreground-muted">Devam eden playlist yok.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {inProgress.map((playlist) => (
                      <PlaylistRow
                        key={playlist.playlistId}
                        playlist={playlist}
                        onWatchedChange={handleWatchedChange}
                        onToggleDone={toggleDone}
                        onDelete={handleDelete}
                      />
                    ))}
                  </ul>
                )}
              </section>

              {completed.length > 0 && (
                <section className={`${cardSurfaceClass} p-5`}>
                  <p className="mb-4 text-[14px] font-semibold text-foreground">Tamamlananlar ({completed.length})</p>
                  <ul className="flex flex-col gap-3">
                    {completed.map((playlist) => (
                      <PlaylistRow
                        key={playlist.playlistId}
                        playlist={playlist}
                        onWatchedChange={handleWatchedChange}
                        onToggleDone={toggleDone}
                        onDelete={handleDelete}
                      />
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-5">
            <p className="text-[14px] font-semibold text-foreground">Yeni playlist ekle</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Başlık"
                name="playlistTitle"
                placeholder="ör. Diferansiyel Denklemler"
                value={formValues.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
              <Input
                label="Ders (opsiyonel)"
                name="playlistCourse"
                placeholder="ör. Matematik II"
                value={formValues.courseName}
                onChange={(e) => update("courseName", e.target.value)}
              />
            </div>

            <Input
              label="YouTube linki (opsiyonel)"
              name="playlistUrl"
              type="url"
              placeholder="https://www.youtube.com/playlist?list=…"
              value={formValues.url}
              onChange={(e) => update("url", e.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Toplam video (opsiyonel)"
                name="playlistTotal"
                type="number"
                min={0}
                value={formValues.totalVideos === 0 ? "" : formValues.totalVideos}
                onChange={(e) => update("totalVideos", Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
              />
              <Input
                label="İzlenen video"
                name="playlistWatched"
                type="number"
                min={0}
                value={formValues.watchedVideos === 0 ? "" : formValues.watchedVideos}
                onChange={(e) => update("watchedVideos", Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
              />
            </div>

            {formError && <p className="text-[13px] font-medium text-danger">{formError}</p>}

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="md" disabled={saving}>
                <Plus className="size-4" aria-hidden />
                {saving ? "Kaydediliyor…" : "Ekle"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

interface PlaylistRowProps {
  playlist: StudyPlaylist;
  onWatchedChange: (playlist: StudyPlaylist, value: string) => void;
  onToggleDone: (playlist: StudyPlaylist) => void;
  onDelete: (playlist: StudyPlaylist) => void;
}

function PlaylistRow({ playlist, onWatchedChange, onToggleDone, onDelete }: PlaylistRowProps) {
  const percent = progressPercent(playlist);

  return (
    <li className={cn("group flex flex-col gap-2.5 rounded-lg border px-4 py-3", playlist.done ? "border-hairline bg-surface" : "border-hairline")}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggleDone(playlist)}
          aria-pressed={playlist.done}
          aria-label={playlist.done ? `${playlist.title} tamamlandı, geri al` : `${playlist.title} tamamlandı olarak işaretle`}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-transparent transition-colors",
            playlist.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-foreground-muted/40",
          )}
        >
          {playlist.done && <Check className="size-3.5" aria-hidden />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {playlist.url ? (
              <a
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "truncate text-[13.5px] font-medium text-foreground hover:underline",
                  playlist.done && "text-foreground-muted line-through",
                )}
              >
                {playlist.title}
              </a>
            ) : (
              <p className={cn("truncate text-[13.5px] font-medium text-foreground", playlist.done && "text-foreground-muted line-through")}>
                {playlist.title}
              </p>
            )}
            {playlist.url && <ExternalLink className="size-3 shrink-0 text-foreground-muted" aria-hidden />}
          </div>
          {playlist.courseName && <p className="truncate text-[12px] text-foreground-muted">{playlist.courseName}</p>}
        </div>

        <button
          type="button"
          onClick={() => onDelete(playlist)}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
          aria-label={`${playlist.title} sil`}
        >
          <Trash2 className="size-3.5" aria-hidden />
        </button>
      </div>

      <div className="flex items-center gap-3 pl-9">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
          <div
            className={cn("h-full rounded-full transition-all", playlist.done ? "bg-emerald-500" : "bg-blue-500")}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[12px] text-foreground-muted">
          <input
            type="number"
            min={0}
            value={playlist.watchedVideos}
            onChange={(e) => onWatchedChange(playlist, e.target.value)}
            aria-label={`${playlist.title} izlenen video sayısı`}
            className="h-7 w-14 rounded-md border border-hairline bg-transparent px-2 text-center text-[12px] text-foreground"
          />
          <span>/ {playlist.totalVideos > 0 ? playlist.totalVideos : "?"}</span>
          <span className="ml-1 tabular-nums">{percent}%</span>
        </div>
      </div>
    </li>
  );
}
