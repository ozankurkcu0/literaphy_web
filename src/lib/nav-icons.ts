import { Wrench, QrCode, FolderKanban, Newspaper, Users, Mail, type LucideIcon } from "lucide-react";

export const NAV_ICONS: Record<string, LucideIcon> = {
  "/hizmetler": Wrench,
  "/qr-menu-sistemleri": QrCode,
  "/projeler": FolderKanban,
  "/blog": Newspaper,
  "/hakkimizda": Users,
  "/iletisim": Mail,
};
