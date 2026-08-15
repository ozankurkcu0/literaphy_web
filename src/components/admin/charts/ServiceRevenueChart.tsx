import { formatCurrencyAmount } from "@/lib/order-format";
import type { ServiceRevenuePoint } from "@/lib/order-analytics";
import { CHART_COLORS } from "./chart-tokens";

interface Props {
  data: ServiceRevenuePoint[];
  currency: string;
}

/** Hizmet türleri isim olarak değişse anlamı değişmeyen (nominal) bir
 * kategori olduğu için tek renk kullanılır — kimlik değil, büyüklük
 * karşılaştırması yapılıyor (bkz. dataviz skill, "nominal categorical"). */
export function ServiceRevenueChart({ data, currency }: Props) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-[13.5px] text-foreground-muted">Seçili dönemde veri yok.</p>;
  }

  const max = Math.max(...data.map((item) => item.amount), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => {
        const widthPercent = Math.max(2, (item.amount / max) * 100);
        return (
          <div key={item.service} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-foreground-secondary">{item.service}</span>
              <span className="font-medium tabular-nums text-foreground">
                {formatCurrencyAmount(item.amount, currency)}
              </span>
            </div>
            <div className="h-2 w-full rounded-[4px] bg-surface">
              <div
                className="h-2 rounded-r-[4px]"
                style={{ width: `${widthPercent}%`, backgroundColor: CHART_COLORS.sequential }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
