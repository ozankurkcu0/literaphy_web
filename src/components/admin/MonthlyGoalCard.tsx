"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CHART_COLORS } from "@/components/admin/charts/chart-tokens";
import { formatCurrencyAmount } from "@/lib/order-format";
import { cardSurfaceClass, cn, inputBaseClass } from "@/lib/utils";
import type { Currency, Order } from "@/lib/google-sheets";

interface Goal {
  month: string;
  currency: Currency;
  amount: string;
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const monthLabelFormatter = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });

interface MonthlyGoalCardProps {
  orders: Order[];
  currency: Currency;
}

/** Analiz sayfasındaki dönem filtresinden bağımsız — her zaman içinde
 * bulunulan takvim ayının hedefini ve o aya kadarki fiili geliri gösterir.
 * Hedef, ayrı bir "Hedefler" sheet'inde tutuluyor (bkz. google-sheets.ts). */
export function MonthlyGoalCard({ orders, currency }: MonthlyGoalCardProps) {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/goals");
      const data = await response.json();
      if (response.ok) setGoals(data.goals ?? []);
    } catch {
      // sessiz — kart sadece "hedef belirlenmedi" gösterir
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const month = currentMonthKey();
  const goal = goals?.find((item) => item.month === month && item.currency === currency);
  const target = goal ? Number(goal.amount) || 0 : 0;

  const actual = orders
    .filter((order) => order.status !== "İptal" && order.currency === currency && order.fee)
    .filter((order) => order.startDate?.startsWith(month))
    .reduce((sum, order) => sum + (Number(order.fee) || 0), 0);

  const percent = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;

  function startEdit() {
    setInputValue(goal?.amount ?? "");
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, currency, amount: inputValue }),
      });
      if (response.ok) {
        await fetchGoals();
        setEditing(false);
      } else {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error ?? "Hedef kaydedilemedi.");
      }
    } catch {
      window.alert("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  return (
    <div className={`${cardSurfaceClass} p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-foreground-muted" aria-hidden />
          <h2 className="text-[14px] font-semibold text-foreground">
            {monthLabelFormatter.format(new Date())} hedefi
          </h2>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            <Pencil className="size-3.5" aria-hidden />
            {goal ? "Düzenle" : "Hedef belirle"}
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            autoFocus
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="ör. 50000"
            className={`${inputBaseClass} h-10 flex-1`}
          />
          <Button type="button" variant="secondary" size="md" onClick={() => setEditing(false)}>
            Vazgeç
          </Button>
          <Button type="button" variant="primary" size="md" onClick={handleSave} disabled={saving || !inputValue}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </div>
      ) : !goal ? (
        <p className="text-[13.5px] text-foreground-muted">Bu ay için henüz bir hedef belirlenmedi.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[13.5px] text-foreground-secondary">
              {formatCurrencyAmount(actual, currency)}{" "}
              <span className="text-foreground-muted">/ {formatCurrencyAmount(target, currency)}</span>
            </span>
            <span className={cn("text-[13px] font-medium", percent >= 100 ? "text-success" : "text-foreground-muted")}>
              %{percent}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-[4px] bg-surface">
            <div
              className={cn("h-2.5 rounded-r-[4px] transition-all", percent >= 100 && "bg-success")}
              style={
                percent >= 100
                  ? { width: "100%" }
                  : { width: `${Math.max(2, percent)}%`, backgroundColor: CHART_COLORS.income }
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
