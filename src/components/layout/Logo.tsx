import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-mono text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80",
        className,
      )}
      aria-label="OBSoft anasayfa"
    >
      <span className="text-accent">OB</span>
      <span>Soft</span>
    </Link>
  );
}
