"use client";

import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { formatCurrencyAmount } from "@/lib/order-format";
import type { MonthlyFinancePoint } from "@/lib/order-analytics";
import { BAR_MAX_THICKNESS, CHART_COLORS } from "./chart-tokens";

const WIDTH_PER_MONTH = 64;
const CHART_HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 32, left: 60 };

function niceMax(value: number): number {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

/** Sadece üst köşeleri yuvarlatılmış, taban çizgisinde köşeli bir çubuk
 * yolu — dataviz mark spec'i (4px yuvarlak veri ucu, tabanda köşeli). */
function topRoundedBarPath(x: number, y: number, width: number, height: number, radius: number): string {
  if (height <= 0 || width <= 0) return "";
  const r = Math.min(radius, width / 2, height);
  return `M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`;
}

interface Props {
  data: MonthlyFinancePoint[];
  currency: string;
}

export function IncomeExpenseChart({ data, currency }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: MonthlyFinancePoint } | null>(null);

  if (data.length === 0) {
    return <p className="py-8 text-center text-[13.5px] text-foreground-muted">Seçili dönemde veri yok.</p>;
  }

  const width = Math.max(data.length * WIDTH_PER_MONTH, 320);
  const innerWidth = width - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = niceMax(Math.max(1, ...data.flatMap((point) => [point.income, point.expense])));
  const slotWidth = innerWidth / data.length;
  const barWidth = Math.max(2, Math.min(BAR_MAX_THICKNESS, (slotWidth - 8) / 2));
  const baseline = PADDING.top + innerHeight;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(maxValue * fraction));

  function handleHover(event: MouseEvent, point: MonthlyFinancePoint) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top, point });
  }

  // Klavye odağı (Tab/tıklama) bir FocusEvent verir — MouseEvent'teki
  // clientX/clientY burada yok, bu yüzden hedef elemanın konumundan
  // hesaplıyoruz (NaN üretip React'in stil hatası vermesini önler).
  function handleFocus(event: FocusEvent<SVGRectElement>, point: MonthlyFinancePoint) {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const targetRect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: targetRect.left + targetRect.width / 2 - containerRect.left,
      y: targetRect.top - containerRect.top,
      point,
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-3 flex items-center gap-4 text-[12.5px]">
        <span className="flex items-center gap-1.5 text-foreground-secondary">
          <span className="inline-block h-[2px] w-4" style={{ backgroundColor: CHART_COLORS.income }} />
          Gelir
        </span>
        <span className="flex items-center gap-1.5 text-foreground-secondary">
          <span className="inline-block h-[2px] w-4" style={{ backgroundColor: CHART_COLORS.expense }} />
          Gider
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${CHART_HEIGHT}`} style={{ width, height: CHART_HEIGHT, maxWidth: "100%" }}>
          {ticks.map((tick) => {
            const y = baseline - (tick / maxValue) * innerHeight;
            return (
              <g key={tick}>
                <line x1={PADDING.left} x2={width - PADDING.right} y1={y} y2={y} stroke={CHART_COLORS.gridline} strokeWidth={1} />
                <text x={PADDING.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={CHART_COLORS.textMuted}>
                  {new Intl.NumberFormat("tr-TR", { notation: "compact" }).format(tick)}
                </text>
              </g>
            );
          })}

          {data.map((point, index) => {
            const slotX = PADDING.left + index * slotWidth;
            const groupCenter = slotX + slotWidth / 2;
            const incomeHeight = (point.income / maxValue) * innerHeight;
            const expenseHeight = (point.expense / maxValue) * innerHeight;
            const incomeX = groupCenter - barWidth - 1;
            const expenseX = groupCenter + 1;

            return (
              <g key={point.key}>
                <path d={topRoundedBarPath(incomeX, baseline - incomeHeight, barWidth, incomeHeight, 4)} fill={CHART_COLORS.income} />
                <path d={topRoundedBarPath(expenseX, baseline - expenseHeight, barWidth, expenseHeight, 4)} fill={CHART_COLORS.expense} />
                <text x={groupCenter} y={CHART_HEIGHT - PADDING.bottom + 18} textAnchor="middle" fontSize={11} fill={CHART_COLORS.textMuted}>
                  {point.label}
                </text>
                {/* Hover/tıklama hedefi: çubuk çiftinin tamamı, boşluklar dahil */}
                <rect
                  x={slotX}
                  y={PADDING.top}
                  width={slotWidth}
                  height={innerHeight}
                  fill="transparent"
                  onMouseEnter={(event) => handleHover(event, point)}
                  onMouseMove={(event) => handleHover(event, point)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(event) => handleFocus(event, point)}
                  onBlur={() => setTooltip(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${point.label}: Gelir ${formatCurrencyAmount(point.income, currency)}, Gider ${formatCurrencyAmount(point.expense, currency)}`}
                />
              </g>
            );
          })}

          <line x1={PADDING.left} x2={width - PADDING.right} y1={baseline} y2={baseline} stroke={CHART_COLORS.axis} strokeWidth={1} />
        </svg>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-hairline bg-base px-3 py-2 text-[12.5px] whitespace-nowrap shadow-lg"
          style={{ left: tooltip.x + 12, top: Math.max(0, tooltip.y - 56) }}
        >
          <p className="mb-1 font-medium text-foreground">{tooltip.point.label}</p>
          <p className="flex items-center gap-1.5 text-foreground-secondary">
            <span className="inline-block h-[2px] w-3" style={{ backgroundColor: CHART_COLORS.income }} />
            Gelir: <span className="font-semibold text-foreground">{formatCurrencyAmount(tooltip.point.income, currency)}</span>
          </p>
          <p className="flex items-center gap-1.5 text-foreground-secondary">
            <span className="inline-block h-[2px] w-3" style={{ backgroundColor: CHART_COLORS.expense }} />
            Gider: <span className="font-semibold text-foreground">{formatCurrencyAmount(tooltip.point.expense, currency)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
