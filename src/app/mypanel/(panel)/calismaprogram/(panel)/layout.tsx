import { CalismaProgramShell } from "@/components/calisma-program/CalismaProgramShell";

// Kendi şifresi yok — /mypanel'in ortak dış kapısı (bkz.
// /mypanel/(panel)/layout.tsx) yeterli. Middleware, /api/calisma-program/*
// route'larının hâlâ beklediği oturum çerezini sessizce basıyor (bkz.
// middleware.ts).
export default function CalismaProgramPanelLayout({ children }: { children: React.ReactNode }) {
  return <CalismaProgramShell>{children}</CalismaProgramShell>;
}
