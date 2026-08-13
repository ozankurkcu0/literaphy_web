"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { faqCategories, faqItems } from "@/content/faq";
import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils";

export function FaqCategoryTabs() {
  const [active, setActive] = useState<(typeof faqCategories)[number]>("Genel");
  const filtered = faqItems.filter((item) => item.category === active);

  return (
    <div className="mx-auto max-w-3xl">
      <div
        role="tablist"
        aria-label="SSS kategorileri"
        className="no-scrollbar mb-10 flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center"
      >
        {faqCategories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="faq-panel"
              onClick={() => setActive(category)}
              className="relative flex h-11 shrink-0 cursor-pointer items-center px-4 text-sm font-medium whitespace-nowrap"
            >
              <span className={cn("relative z-10", isActive ? "text-foreground" : "text-foreground-muted hover:text-foreground")}>
                {category}
              </span>
              {isActive && (
                <motion.span
                  layoutId="faq-tab-underline"
                  className="absolute inset-x-3 -bottom-1 h-[2px] bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div id="faq-panel" role="tabpanel">
        <Accordion items={filtered} headingLevel="h2" />
      </div>
    </div>
  );
}
