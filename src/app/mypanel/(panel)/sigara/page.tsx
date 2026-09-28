import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SigaraTracker } from "@/components/mypanel/SigaraTracker";

export const metadata: Metadata = {
  title: "Sigarayı Bırakma",
  robots: { index: false, follow: false },
};

export default function SigaraPage() {
  return (
    <div className="min-h-screen bg-base px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-foreground">Sigarayı Bırakma</h1>
          <Link
            href="/mypanel"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Panel
          </Link>
        </div>

        <SigaraTracker />
      </div>
    </div>
  );
}
