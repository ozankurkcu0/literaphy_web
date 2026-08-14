"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/cards/BlogCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["Tümü", "Web Geliştirme", "N8N Otomasyon", "QR Menü", "Diğer"];

export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  // Veride bulunan kategorilerle sınırlı, ama her zaman CATEGORY_ORDER
  // sırasında — yazı sırasına göre kayıp bir buton dizilimi olmasın diye.
  const categories = useMemo(() => {
    const present = new Set(posts.map((post) => post.category));
    return CATEGORY_ORDER.filter((category) => category === "Tümü" || present.has(category));
  }, [posts]);
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
        // Filtre değiştikçe (kategori -> Tümü -> kategori) liste her seferinde
        // yeniden mount oluyor; Reveal'ın whileInView + once:true davranışı bu
        // durumda ekranın altında kalan kartları sonsuza dek görünmez
        // bırakabiliyordu (bir daha viewport'a "giriş" tetiklenmiyordu). Mount
        // anında oynayan (scroll'a bağlı olmayan) bir stagger fade-in'e
        // geçildi, böylece her filtre değişiminde tüm kartlar güvenle görünür.
        <motion.div
          key={active}
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.06)}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((post) => (
            <motion.div key={post.slug} variants={fadeUp}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
