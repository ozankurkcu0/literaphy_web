"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarClock, CalendarDays, LayoutGrid, ListVideo, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Bugün", href: "/mypanel/calismaprogram", icon: LayoutGrid },
  { label: "Ders Programı", href: "/mypanel/calismaprogram/program", icon: CalendarDays },
  { label: "Takvim", href: "/mypanel/calismaprogram/takvim", icon: CalendarClock },
  { label: "Playlistler", href: "/mypanel/calismaprogram/playlistler", icon: ListVideo },
];

export function CalismaProgramShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Bu aracın artık kendi şifresi yok — "Çıkış" /mypanel'in ortak
  // oturumundan çıkar (bkz. /mypanel/(panel)/layout.tsx).
  async function handleLogout() {
    await fetch("/api/mypanel/logout", { method: "POST" });
    router.replace("/mypanel/giris");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <header className="border-b border-hairline bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/mypanel/calismaprogram" className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
            <span aria-hidden>🎓</span>
            Çalışma Programım
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/mypanel/calismaprogram" ? pathname === "/mypanel/calismaprogram" : pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors",
                    active ? "bg-blue-600 text-white" : "text-foreground-muted hover:bg-surface hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden />
              Çıkış
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
