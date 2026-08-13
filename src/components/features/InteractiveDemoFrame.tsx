"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Coffee, QrCode, ShoppingBag } from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: QrCode,
    title: "1. QR Kodu Okutun",
    description: "Masadaki QR kodu telefon kamerasıyla okutun, uygulama indirmeye gerek yok.",
  },
  {
    icon: Coffee,
    title: "2. Menü Açılır",
    description: "Kategorilere ayrılmış dijital menü saniyeler içinde ekranda belirir.",
  },
  {
    icon: ShoppingBag,
    title: "3. Sipariş Verin",
    description: "İstediğiniz ürünleri sepete ekleyin, siparişinizi tek dokunuşla tamamlayın.",
  },
];

const menuItems = [
  { name: "Filtre Kahve", price: "₺95" },
  { name: "Flat White", price: "₺120" },
  { name: "Cheesecake", price: "₺140" },
  { name: "Avokado Tost", price: "₺160" },
];

export function InteractiveDemoFrame() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid items-center gap-14 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = active === index;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-lg border p-5 text-left transition-colors duration-200",
                  isActive ? "border-accent-product bg-accent-product-soft" : "border-hairline bg-surface hover:border-strong",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md",
                    isActive ? "bg-accent-product text-white" : "bg-surface-hover text-foreground-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-foreground-muted">{step.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-7">
        <PhoneMockup>
          <AnimatePresence mode="wait">
            {active === 0 && (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col items-center justify-center gap-6 bg-deep px-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="flex size-28 items-center justify-center rounded-2xl border border-accent-product/40 bg-accent-product-soft"
                >
                  <QrCode className="size-14 text-accent-product" aria-hidden />
                </motion.div>
                <p className="text-sm text-foreground-muted">QR kodu kameranıza gösterin</p>
              </motion.div>
            )}

            {active === 1 && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col gap-3 bg-base p-5"
              >
                <p className="mb-1 font-mono text-xs tracking-[0.1em] text-accent-product uppercase">Kahve Durağı</p>
                <p className="mb-3 text-lg font-semibold text-foreground">Menü</p>
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex items-center justify-between rounded-md border border-hairline bg-surface px-4 py-3"
                  >
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="font-mono text-sm text-foreground-muted">{item.price}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {active === 2 && (
              <motion.div
                key="order"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col items-center justify-center gap-5 bg-base px-8 text-center"
              >
                <div className="flex size-20 items-center justify-center rounded-full bg-success/10">
                  <Check className="size-10 text-success" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Siparişiniz alındı</p>
                  <p className="mt-1 text-sm text-foreground-muted">Mutfağa iletildi, afiyet olsun.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PhoneMockup>
      </div>
    </div>
  );
}
