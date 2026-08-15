"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ClipboardList, Inbox, LogOut, Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Siparişler", href: "/admin", icon: ClipboardList },
  { label: "Müşteriler", href: "/admin/musteriler", icon: Users },
  { label: "Analiz", href: "/admin/analiz", icon: BarChart3 },
  { label: "Gelen Kutusu", href: "/admin/gelen-kutusu", icon: Inbox },
  { label: "Hesaplar", href: "/admin/hesaplar", icon: UserCog },
];

export function AdminShell({ adminLabel, children }: { adminLabel: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-hairline bg-base px-4 py-6">
        <Link href="/admin" className="mb-8 px-2 text-[15px] font-semibold text-foreground">
          Literaphy <span className="text-foreground-muted">Panel</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-foreground"
                    : "text-foreground-muted hover:bg-surface hover:text-foreground",
                )}
              >
                <Icon className="size-[18px]" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 border-t border-hairline pt-4">
          <p className="truncate px-2 text-[13px] text-foreground-muted">{adminLabel}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="size-[18px]" aria-hidden />
            Çıkış yap
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto px-8 py-8">{children}</main>
    </div>
  );
}
