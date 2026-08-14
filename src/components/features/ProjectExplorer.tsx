"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project, ProjectCategory } from "@/types";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";

const filters: { label: string; value: ProjectCategory | "hepsi" }[] = [
  { label: "Tümü", value: "hepsi" },
  { label: "Web Geliştirme", value: "web-gelistirme" },
  { label: "N8N Otomasyonu", value: "ai-otomasyon" },
  { label: "QR Menü Sistemleri", value: "qr-menu" },
];

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "hepsi">("hepsi");

  const filtered = useMemo(
    () => (active === "hepsi" ? projects : projects.filter((project) => project.category === active)),
    [active, projects],
  );

  return (
    <div>
      <div className="no-scrollbar mb-12 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const isActive = active === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActive(filter.value)}
              className="relative flex h-11 shrink-0 cursor-pointer items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className={cn("relative z-10", isActive ? "text-white" : "text-foreground-muted hover:text-foreground")}>
                {filter.label}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-foreground-muted">Bu kategoride henüz proje bulunmuyor.</p>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
