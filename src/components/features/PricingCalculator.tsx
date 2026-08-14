"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { qrMenuPricing } from "@/content/qr-menu";
import { ButtonLink } from "@/components/ui/Button";
import { LiraSign } from "@/components/ui/LiraSign";
import { cn, cardSurfaceClass } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

type LanguageNeed = "1" | "upto3" | "unlimited";

const languageOptions: { value: LanguageNeed; label: string }[] = [
  { value: "1", label: "Tek dil" },
  { value: "upto3", label: "3 dile kadar" },
  { value: "unlimited", label: "Sınırsız" },
];

type OrderFlow = "none" | "panel" | "pos";

const orderOptions: { value: OrderFlow; label: string }[] = [
  { value: "none", label: "Hayır, sadece menü" },
  { value: "panel", label: "Evet, yönetim paneline düşsün" },
  { value: "pos", label: "Evet, doğrudan POS'a işlensin" },
];

/** Karşılaştırma tablosundaki (qrMenuComparisonRows) eşiklerin aynısını
 * takip eder — oradaki paket sınırları değişirse burası da güncellenmeli.
 * "panel" akışı Premium'un "QR Menü üzerinden sipariş (panele entegre)"
 * özelliğine, "pos" akışı ise Expert'in POS/sipariş sistemi entegrasyonuna
 * karşılık geliyor. */
function recommendPlanName(branches: number, languages: LanguageNeed, order: OrderFlow): string {
  if (order === "pos") return "Expert";
  if (order === "panel") return "Premium";
  if (languages === "unlimited") return "Premium";
  if (branches === 1 && languages === "1") return "Başlangıç";
  if (branches <= 3) return "Standart";
  return "Premium";
}

/** QR Menü fiyatlandırma sayfasında paket kartlarının üstünde oturan,
 * birkaç soruya göre uygun paketi ve tahmini fiyatı canlı gösteren
 * interaktif hesaplayıcı. Ziyaretçiyi 3 basit soruyla paket kartlarına
 * kıyasla çok daha hızlı bir "size uygun olan bu" cevabına götürür. */
export function PricingCalculator() {
  const [branches, setBranches] = useState(1);
  const [languages, setLanguages] = useState<LanguageNeed>("1");
  const [order, setOrder] = useState<OrderFlow>("none");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const planName = recommendPlanName(branches, languages, order);
  // qrMenuPricing her zaman dolu bir sabit dizi olduğu için [0] fallback'i güvenli.
  const plan = qrMenuPricing.find((item) => item.name === planName) ?? qrMenuPricing[0]!;
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  const reason = useMemo(() => {
    if (order === "pos") return "Siparişlerin doğrudan POS sisteminize işlenmesi için özel entegrasyon kapsamı gerekiyor.";
    if (order === "panel") return "Siparişlerin yönetim panelinize düşmesi, panele entegre QR sipariş özelliği gerektiriyor.";
    if (planName === "Başlangıç") return "Tek şube, tek dil ihtiyacınız için en uygun paket.";
    if (planName === "Standart") return "3 şubeye kadar ve çoklu dil desteğiyle en çok tercih edilen paket.";
    return "Şube sayınız veya dil ihtiyacınız için daha geniş kapsamlı bir paket gerekiyor.";
  }, [order, planName]);

  return (
    <div className={cn(cardSurfaceClass, "grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10")}>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground-secondary">Kaç şubeniz var?</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setBranches((current) => Math.max(1, current - 1))}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-hairline text-foreground transition-colors duration-150 ease-standard hover:border-strong hover:bg-surface-hover disabled:opacity-40"
              disabled={branches <= 1}
              aria-label="Şube sayısını azalt"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="w-16 text-center font-mono text-2xl font-semibold text-foreground">
              {branches >= 12 ? "12+" : branches}
            </span>
            <button
              type="button"
              onClick={() => setBranches((current) => Math.min(12, current + 1))}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-hairline text-foreground transition-colors duration-150 ease-standard hover:border-strong hover:bg-surface-hover disabled:opacity-40"
              disabled={branches >= 12}
              aria-label="Şube sayısını artır"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground-secondary">Kaç dilde menü sunmak istiyorsunuz?</span>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((option) => (
              <PillOption
                key={option.value}
                active={languages === option.value}
                onClick={() => setLanguages(option.value)}
              >
                {option.label}
              </PillOption>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground-secondary">
            QR üzerinden sipariş almak istiyor musunuz?
          </span>
          <div className="flex flex-col items-start gap-2">
            {orderOptions.map((option) => (
              <PillOption key={option.value} active={order === option.value} onClick={() => setOrder(option.value)}>
                {option.label}
              </PillOption>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.3, ease: EASE_STANDARD }}
        className="flex flex-col justify-between gap-6 rounded-lg border border-accent-product/20 bg-accent-product-soft p-6"
      >
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-medium tracking-[0.08em] text-accent-product uppercase">
            Size önerimiz
          </span>
          <motion.span
            key={plan.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE_STANDARD }}
            className="text-2xl font-semibold text-foreground"
          >
            {plan.name}
          </motion.span>
          <p className="text-sm text-foreground-muted">{reason}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBilling(option)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 ease-standard",
                  billing === option ? "bg-foreground text-white" : "text-foreground-muted hover:text-foreground",
                )}
              >
                {option === "monthly" ? "Aylık" : "Yıllık (%20 indirim)"}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-1.5">
            <span className="font-mono text-[32px] leading-none font-semibold text-foreground">
              <LiraSign />
              {price.toLocaleString("tr-TR")}
              {plan.startingAt && "+"}
            </span>
            <span className="pb-1 text-sm text-foreground-muted">/ ay</span>
          </div>
          <ButtonLink
            href="/qr-menu-sistemleri/demo"
            tone="product"
            withArrow
            className="w-full"
            onClick={() => trackEvent("pricing_calculator_cta_click", { plan: plan.name })}
          >
            {plan.name} ile Demo İsteyin
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}

function PillOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ease-standard",
        active
          ? "border-accent-product bg-accent-product text-white"
          : "border-hairline text-foreground-muted hover:border-strong hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
