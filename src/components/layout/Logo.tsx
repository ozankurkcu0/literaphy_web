import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center transition-opacity hover:opacity-80", className)}
      aria-label="Literaphy anasayfa"
    >
      <Image
        src="/logo.png"
        alt="Literaphy"
        width={912}
        height={191}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
