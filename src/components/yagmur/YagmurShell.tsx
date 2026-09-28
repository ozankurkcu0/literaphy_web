"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function YagmurShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Bu aracın artık kendi şifresi yok — "Çıkış" /mypanel'in ortak
  // oturumundan çıkar (bkz. /mypanel/(panel)/layout.tsx).
  async function handleLogout() {
    await fetch("/api/mypanel/logout", { method: "POST" });
    router.replace("/mypanel/giris");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100">
      <header className="border-b border-pink-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-rose-900">
            <span aria-hidden>🌸</span>
            Yağmur&apos;un Programı
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium text-rose-700/70 transition-colors hover:bg-white/70 hover:text-rose-900"
          >
            <LogOut className="size-4" aria-hidden />
            Çıkış
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
