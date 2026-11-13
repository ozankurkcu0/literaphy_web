"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEEKDAYS, type Weekday } from "@/lib/calisma-program-constants";
import { HIDDEN_TASK_CATEGORY, YAGMUR_STUDY_PLAN, STUDY_CATEGORY_META, STUDY_CATEGORIES, type StudyCategory } from "@/lib/yagmur-study-plan";
import type { YagmurCustomStudyTask } from "@/lib/google-sheets";

interface DisplayTask {
  id: string;
  category: StudyCategory;
  label: string;
  custom: boolean;
  overridden: boolean;
}

function AddTaskRow({ weekday, onAdded }: { weekday: Weekday; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<StudyCategory>("Diğer");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!label.trim()) return;
    setSaving(true);
    const response = await fetch("/api/yagmur/study-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekday, category, label: label.trim() }),
    });
    setSaving(false);
    if (response.ok) {
      setLabel("");
      setCategory("Diğer");
      setOpen(false);
      onAdded();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12px] font-medium text-rose-500/80 transition-colors hover:bg-pink-50 hover:text-rose-700"
      >
        <Plus className="size-3.5" aria-hidden />
        Görev ekle
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-pink-200 bg-pink-50/50 p-2">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="ör. 15 dk shadowing"
        autoFocus
        className="h-8 rounded-md border border-pink-200 bg-white px-2 text-[12.5px] text-rose-950 outline-none focus:border-pink-400"
      />
      <div className="flex items-center gap-1.5">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as StudyCategory)}
          className="h-7 flex-1 rounded-md border border-pink-200 bg-white px-1.5 text-[11.5px] text-rose-800 outline-none focus:border-pink-400"
        >
          {STUDY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !label.trim()}
          className="rounded-md bg-pink-500 px-2.5 py-1 text-[11.5px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "…" : "Ekle"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-1.5 py-1 text-[11.5px] text-rose-700/70 hover:bg-pink-100"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}

function EditTaskRow({
  task,
  onCancel,
  onSaved,
}: {
  task: DisplayTask;
  onCancel: () => void;
  onSaved: (label: string, category: StudyCategory) => void;
}) {
  const [label, setLabel] = useState(task.label);
  const [category, setCategory] = useState<StudyCategory>(task.category);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const trimmed = label.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    const response = await fetch(`/api/yagmur/study-tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, label: trimmed }),
    });
    setSaving(false);
    if (response.ok) onSaved(trimmed, category);
    else setError("Kaydedilemedi, tekrar dene.");
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-pink-200 bg-pink-50/50 p-2">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="h-8 rounded-md border border-pink-200 bg-white px-2 text-[12.5px] text-rose-950 outline-none focus:border-pink-400"
      />
      <div className="flex items-center gap-1.5">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as StudyCategory)}
          className="h-7 flex-1 rounded-md border border-pink-200 bg-white px-1.5 text-[11.5px] text-rose-800 outline-none focus:border-pink-400"
        >
          {STUDY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !label.trim()}
          className="rounded-md bg-pink-500 px-2.5 py-1 text-[11.5px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "…" : "Kaydet"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md px-1.5 py-1 text-[11.5px] text-rose-700/70 hover:bg-pink-100">
          Vazgeç
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

export function YagmurStudyChecklist() {
  const [checked, setChecked] = useState<Set<string> | null>(null);
  const [customTasks, setCustomTasks] = useState<YagmurCustomStudyTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchChecked = useCallback(async () => {
    try {
      const response = await fetch("/api/yagmur/study-progress");
      const data = await response.json();
      if (!response.ok || data.configured === false) {
        setError(data.error ?? null);
        return;
      }
      setChecked(new Set<string>(data.checked ?? []));
    } catch {
      setError("Çalışma programı yüklenemedi.");
    }
  }, []);

  const fetchCustomTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/yagmur/study-tasks");
      const data = await response.json();
      if (!response.ok || data.configured === false) return;
      setCustomTasks(data.tasks ?? []);
    } catch {
      // sessizce yut — statik program yine de görünür kalsın
    }
  }, []);

  useEffect(() => {
    fetchChecked();
    fetchCustomTasks();
  }, [fetchChecked, fetchCustomTasks]);

  async function toggle(taskId: string) {
    const willCheck = !(checked?.has(taskId) ?? false);
    setChecked((prev) => {
      const next = new Set(prev ?? []);
      if (willCheck) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
    const response = await fetch("/api/yagmur/study-progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, checked: willCheck }),
    });
    if (!response.ok) await fetchChecked();
  }

  async function handleDeleteTask(task: DisplayTask) {
    if (!task.custom) {
      // Sabit görev: sunucu gizleme satırı yazar.
      setCustomTasks((prev) => [
        ...prev.filter((item) => item.taskId !== task.id),
        { rowNumber: -1, taskId: task.id, weekday: "Pazartesi", category: HIDDEN_TASK_CATEGORY, label: task.label },
      ]);
    } else {
      setCustomTasks((prev) => prev.filter((item) => item.taskId !== task.id));
    }
    const response = await fetch(`/api/yagmur/study-tasks/${task.id}`, { method: "DELETE" });
    await fetchCustomTasks();
    if (!response.ok) setError(null);
  }

  async function handleResetOverride(taskId: string) {
    setCustomTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    const response = await fetch(`/api/yagmur/study-tasks/${taskId}?mode=reset`, { method: "DELETE" });
    if (!response.ok) await fetchCustomTasks();
  }

  function handleEdited() {
    setEditingId(null);
    fetchCustomTasks();
  }

  if (error) return null;

  const overrides = new Map(customTasks.map((task) => [task.taskId, task]));
  const staticIds = new Set(Object.values(YAGMUR_STUDY_PLAN).flatMap((list) => list.map((task) => task.id)));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-semibold text-rose-950">Haftalık İngilizce Çalışma Programı 📚</h2>
        <p className="mt-0.5 text-[12.5px] text-rose-700/70">Her Pazartesi sıfırdan başlar — istediğin güne kendi görevini de ekleyebilirsin.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {WEEKDAYS.map((day) => {
          const toCategory = (value: string): StudyCategory =>
            (STUDY_CATEGORIES as string[]).includes(value) ? (value as StudyCategory) : "Diğer";
          const hiddenTasks = YAGMUR_STUDY_PLAN[day].filter((task) => overrides.get(task.id)?.category === HIDDEN_TASK_CATEGORY);
          const staticTasks: DisplayTask[] = YAGMUR_STUDY_PLAN[day]
            .filter((task) => overrides.get(task.id)?.category !== HIDDEN_TASK_CATEGORY)
            .map((task) => {
            const override = overrides.get(task.id);
            return override
              ? { id: task.id, category: toCategory(override.category), label: override.label, custom: false, overridden: true }
              : { ...task, custom: false, overridden: false };
          });
          const dayCustomTasks: DisplayTask[] = customTasks
            .filter((task) => task.weekday === day && !staticIds.has(task.taskId))
            .map((task) => ({
              id: task.taskId,
              category: toCategory(task.category),
              label: task.label,
              custom: true,
              overridden: false,
            }));
          const tasks = [...staticTasks, ...dayCustomTasks];
          const doneCount = checked ? tasks.filter((task) => checked.has(task.id)).length : 0;

          return (
            <div key={day} className="flex flex-col gap-2.5 rounded-2xl border border-pink-200/70 bg-white/70 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-semibold text-rose-950">{day}</p>
                <span className="text-[11.5px] font-medium text-rose-700/60">
                  {doneCount}/{tasks.length}
                </span>
              </div>

              <ul className="flex flex-col gap-1.5">
                {tasks.map((task) => {
                  const isChecked = checked?.has(task.id) ?? false;
                  const meta = STUDY_CATEGORY_META[task.category];
                  if (editingId === task.id) {
                    return (
                      <li key={task.id}>
                        <EditTaskRow task={task} onCancel={() => setEditingId(null)} onSaved={handleEdited} />
                      </li>
                    );
                  }
                  return (
                    <li key={task.id} className="group flex items-start">
                      <button
                        type="button"
                        onClick={() => toggle(task.id)}
                        disabled={!checked}
                        className="flex w-full min-w-0 items-start gap-2 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-pink-50/70 disabled:opacity-50"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                            isChecked ? "border-pink-500 bg-pink-500" : "border-pink-300 bg-white",
                          )}
                        >
                          {isChecked && <Check className="size-3 text-white" aria-hidden />}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span
                            className={cn(
                              "inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                              meta.badge,
                            )}
                          >
                            {task.category}
                          </span>
                          <span className={cn("text-[12.5px] text-rose-900", isChecked && "text-rose-400 line-through")}>
                            {task.label}
                          </span>
                        </span>
                      </button>
                      <div className="mt-1.5 flex shrink-0 items-center opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditingId(task.id)}
                          className="flex size-5 items-center justify-center rounded text-rose-300 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`${task.label} görevini düzenle`}
                        >
                          <Pencil className="size-3" aria-hidden />
                        </button>
                        {task.overridden && (
                          <button
                            type="button"
                            onClick={() => handleResetOverride(task.id)}
                            className="flex size-5 items-center justify-center rounded text-rose-300 hover:bg-rose-50 hover:text-rose-600"
                            aria-label={`${task.label} görevini varsayılana döndür`}
                            title="Varsayılana döndür"
                          >
                            <RotateCcw className="size-3" aria-hidden />
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task)}
                        className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded text-rose-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100"
                        aria-label={`${task.label} görevini sil`}
                      >
                        <X className="size-3" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <AddTaskRow weekday={day} onAdded={fetchCustomTasks} />

              {hiddenTasks.length > 0 && (
                <details className="text-[11.5px] text-rose-700/70">
                  <summary className="cursor-pointer select-none">Silinenler ({hiddenTasks.length})</summary>
                  <ul className="mt-1 flex flex-col gap-1">
                    {hiddenTasks.map((task) => (
                      <li key={task.id} className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate">{overrides.get(task.id)?.label ?? task.label}</span>
                        <button
                          type="button"
                          onClick={() => handleResetOverride(task.id)}
                          className="shrink-0 rounded px-1.5 py-0.5 font-medium text-rose-600 hover:bg-pink-50"
                        >
                          Geri getir
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
