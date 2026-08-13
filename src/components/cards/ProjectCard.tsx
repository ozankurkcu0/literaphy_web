"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/types";
import { CoverArt } from "@/components/ui/CoverArt";
import { Badge } from "@/components/ui/Badge";
import { EASE_PREMIUM } from "@/lib/motion";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
      className="group"
    >
      <Link href={`/projeler/${project.slug}`} className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4, ease: EASE_PREMIUM }}>
            {project.image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.client}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <CoverArt tone={project.coverTone} ratio="portrait" className="aspect-[4/3]" />
            )}
          </motion.div>
        </div>
        <div className="flex flex-col gap-2">
          <Badge tone="neutral">{project.categoryLabel}</Badge>
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
            {project.title}
          </h3>
          <p className="text-sm text-foreground-muted">{project.client}</p>
        </div>
      </Link>
    </motion.article>
  );
}
