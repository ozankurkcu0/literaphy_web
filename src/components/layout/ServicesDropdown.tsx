"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Wrench } from "lucide-react";
import { services, getServiceHref } from "@/content/services";
import { DockIcon, DockItem } from "@/components/ui/dock";
import { cn } from "@/lib/utils";

export function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.startsWith("/hizmetler");
  const containerRef = useRef<HTMLDivElement>(null);

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    // Only close once focus has left the whole trigger+panel group, not when it
    // moves between links inside it — keyboard users need to Tab through the panel.
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      containerRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <DockItem>
        <DockIcon>
          <Link
            href="/hizmetler"
            aria-haspopup="true"
            aria-expanded={open}
            className={cn(
              "flex size-full items-center justify-center rounded-full text-foreground-muted transition-colors duration-150 hover:text-foreground",
              isActive && "text-accent",
            )}
          >
            <Wrench className="size-full" aria-hidden strokeWidth={1.6} />
          </Link>
        </DockIcon>
      </DockItem>
      <span className={cn("text-[11px] font-medium whitespace-nowrap text-foreground-muted", isActive && "text-foreground")}>
        Hizmetler
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 z-50 w-[340px] -translate-x-1/2 pt-3"
          >
            <div className="rounded-xl border border-hairline bg-elevated p-2 shadow-2xl shadow-black/40">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.slug}
                    href={getServiceHref(service)}
                    className="flex items-start gap-3 rounded-md p-3 transition-colors duration-150 hover:bg-surface-hover"
                  >
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                      <Icon className="size-[18px]" aria-hidden strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{service.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
                        {service.shortDescription}
                      </p>
                    </div>
                  </Link>
                );
              })}
              <Link
                href="/hizmetler"
                className="mt-1 flex items-center justify-center rounded-md border-t border-hairline py-3 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Tüm Hizmetleri Gör
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
