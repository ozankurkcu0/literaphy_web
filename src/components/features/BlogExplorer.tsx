"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/cards/BlogCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(() => ["Tümü", ...new Set(posts.map((post) => post.category))], [posts]);
  const [active, setActive] = useState("Tümü");

  const [featured, ...rest] = posts;
  const filtered = active === "Tümü" ? rest : rest.filter((post) => post.category === active);
  const showFeatured = active === "Tümü" && featured;

  return (
    <div>
      <div className="no-scrollbar mb-12 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className="relative flex h-11 shrink-0 cursor-pointer items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              {isActive && (
                <motion.span
                  layoutId="blog-filter-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className={cn("relative z-10", isActive ? "text-white" : "text-foreground-muted hover:text-foreground")}>
                {category}
              </span>
            </button>
          );
        })}
      </div>

      {showFeatured && (
        <div className="mb-16 border-b border-hairline pb-16">
          <BlogCard post={featured} featured />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-foreground-muted">Bu kategoride henüz yazı bulunmuyor.</p>
      ) : (
        <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <RevealItem key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
