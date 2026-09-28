"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Pencil, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YagmurGoal } from "@/lib/google-sheets";

function GoalCard({ goal, onSave }: { goal: YagmurGoal; onSave: (goalId: string, learned: number) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goal.learned));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(String(goal.learned));
  }, [goal.learned, editing]);

  const percent = goal.total > 0 ? Math.min(100, Math.round((goal.learned / goal.total) * 100)) : 0;

  async function handleSave() {
    const value = Math.max(0, Math.min(goal.total, Number(draft) || 0));
    setSaving(true);
    await onSave(goal.goalId, value);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-pink-200/70 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-pink-400" aria-hidden />
          <p className="text-[14px] font-semibold text-rose-950">{goal.name}</p>
        </div>
        <span className="text-[13px] font-semibold text-rose-600">%{percent}</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-pink-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={goal.total}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="h-9 w-24 rounded-lg border border-pink-200 bg-white px-2.5 text-[13px] text-rose-950 outline-none focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.15)]"
            />
            <span className="text-[12.5px] text-rose-700/70">/ {goal.total} kelime</span>
          </div>
        ) : (
          <p className="text-[12.5px] text-rose-700/70">
            {goal.learned} / {goal.total} kelime ezberlendi
          </p>
        )}

        <button
          type="button"
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:opacity-50",
            editing ? "bg-pink-500 text-white hover:bg-pink-600" : "text-rose-700/70 hover:bg-pink-50 hover:text-rose-900",
          )}
        >
          {editing ? (
            <>
              <Check className="size-3.5" aria-hidden />
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </>
          ) : (
            <>
              <Pencil className="size-3.5" aria-hidden />
              Güncelle
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function YagmurGoals() {
  const [goals, setGoals] = useState<YagmurGoal[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch("/api/yagmur/goals");
      const data = await response.json();
      if (!response.ok || data.configured === false) {
        setError(data.error ?? null);
        return;
      }
      setGoals(data.goals ?? []);
    } catch {
      setError("Hedefler yüklenemedi.");
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function handleSave(goalId: string, learned: number) {
    setGoals((prev) => (prev ? prev.map((g) => (g.goalId === goalId ? { ...g, learned } : g)) : prev));
    const response = await fetch(`/api/yagmur/goals/${goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learned }),
    });
    if (!response.ok) {
      await fetchGoals();
    }
  }

  if (error || !goals) return null;
  if (goals.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {goals.map((goal) => (
        <GoalCard key={goal.goalId} goal={goal} onSave={handleSave} />
      ))}
    </div>
  );
}
