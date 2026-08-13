import { Wrench, BrainCircuit, FolderKanban, Newspaper, Users, Mail, type LucideIcon } from "lucide-react";

export const NAV_ICONS: Record<string, LucideIcon> = {
  "/hizmetler": Wrench,
  // AI Otomasyonları (N8N Otomasyonları) hizmetinin services.ts'deki
  // ikonuyla aynı — services.ts'i güncellersen burayı da eşleştir.
  "/hizmetler/ai-otomasyon": BrainCircuit,
  "/projeler": FolderKanban,
  "/blog": Newspaper,
  "/hakkimizda": Users,
  "/iletisim": Mail,
};
