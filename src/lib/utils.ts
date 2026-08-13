import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return input
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const inputBaseClass =
  "w-full rounded-md border border-hairline bg-surface px-4 text-[15px] text-foreground placeholder:text-foreground-muted outline-none transition-[border-color,box-shadow,opacity] duration-150 ease-out focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50";

// Shared "glass card" seam — a hairline border plus a 1px inset top highlight
// so surfaces catch light like a physical panel instead of reading as a flat div.
export const cardSurfaceClass =
  "rounded-lg border border-hairline bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
