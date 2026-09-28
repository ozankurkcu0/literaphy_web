import { YagmurShell } from "@/components/yagmur/YagmurShell";

// Kendi şifresi yok — /mypanel'in ortak dış kapısı (bkz.
// /mypanel/(panel)/layout.tsx) yeterli. Middleware, /api/yagmur/*
// route'larının hâlâ beklediği oturum çerezini sessizce basıyor (bkz.
// middleware.ts).
export default function YagmurPanelLayout({ children }: { children: React.ReactNode }) {
  return <YagmurShell>{children}</YagmurShell>;
}
