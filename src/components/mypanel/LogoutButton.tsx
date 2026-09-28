"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function MypanelLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/mypanel/logout", { method: "POST" });
    router.replace("/mypanel/giris");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <LogOut className="size-4" aria-hidden />
      Çıkış
    </button>
  );
}
