"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { BlogPost } from "@/types";
import { CoverArt } from "@/components/ui/CoverArt";
import { formatDate, readingTime } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const minutes = readingTime(post.content.join(" "));

  return (
    <article className={featured ? "grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10" : ""}>
      <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-lg">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.4, ease: EASE_PREMIUM }}>
          {post.image ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <CoverArt tone={post.coverTone} ratio="video" label={post.category} />
          )}
        </motion.div>
      </Link>
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex items-center gap-3 font-mono text-xs text-foreground-muted uppercase">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{minutes} dk okuma</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="group">
          <h3
            className={
              featured
                ? "text-2xl leading-snug font-bold text-foreground transition-colors duration-200 group-hover:text-accent lg:text-3xl"
                : "text-lg leading-snug font-semibold text-foreground transition-colors duration-200 group-hover:text-accent"
            }
          >
            {post.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}
