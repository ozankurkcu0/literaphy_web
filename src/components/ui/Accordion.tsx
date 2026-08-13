"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
  defaultOpenIndex?: number;
  /** Match this to the heading that would otherwise directly precede the accordion, so levels don't skip. */
  headingLevel?: "h2" | "h3";
}

export function Accordion({ items, className, defaultOpenIndex = -1, headingLevel = "h3" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const baseId = useId();
  const Heading = headingLevel;

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className="border-b border-hairline">
            <Heading>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-[17px] font-semibold text-foreground">{item.question}</span>
                <Plus
                  className={cn(
                    "size-5 shrink-0 text-foreground-muted transition-transform duration-300 ease-in-out-soft",
                    isOpen && "rotate-45 text-accent",
                  )}
                  aria-hidden
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-300 ease-in-out-soft"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-[15px] leading-relaxed text-foreground-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
