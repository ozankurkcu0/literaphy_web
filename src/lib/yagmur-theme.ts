import { BookOpen, ClipboardCheck, Dumbbell, PenSquare, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { TimelineKind } from "@/lib/calisma-program-constants";

/** /yagmurumprofugececek'in "pastel pembe & rüya gibi" teması — TIMELINE_TYPE_META
 * ile aynı yapı ama /calismaprogram'ın mavi ağırlıklı paletinden bilerek
 * ayrı: pembe/gül/lila/şeftali tonları. */
interface TypeMeta {
  label: string;
  icon: LucideIcon;
  dot: string;
  badge: string;
}

export const YAGMUR_TYPE_META: Record<TimelineKind, TypeMeta> = {
  Ders: { label: "Ders", icon: BookOpen, dot: "bg-pink-400", badge: "bg-pink-50 text-pink-700 border-pink-200" },
  Sınav: { label: "Sınav", icon: PenSquare, dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  Quiz: {
    label: "Quiz",
    icon: ClipboardCheck,
    dot: "bg-purple-400",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Spor: { label: "Spor", icon: Dumbbell, dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  Toplantı: {
    label: "Toplantı",
    icon: Users,
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
  Diğer: {
    label: "Diğer",
    icon: Sparkles,
    dot: "bg-fuchsia-400",
    badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  },
};
