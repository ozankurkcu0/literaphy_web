import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CigaretteOff, GraduationCap, Heart } from "lucide-react";
import { MypanelLogoutButton } from "@/components/mypanel/LogoutButton";
import { cardSurfaceClass, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

const PANEL_LINKS = [
  {
    href: "/mypanel/calismaprogram",
    label: "Çalışma Programım",
    description: "Ders programı, sınav takvimi ve günlük planlayıcı.",
    icon: GraduationCap,
  },
  {
    href: "/mypanel/yagmurumprofugececek",
    label: "Yağmur'un Programı",
    description: "Haftalık İngilizce çalışma programı.",
    icon: Heart,
  },
  {
    href: "/mypanel/sigara",
    label: "Sigarayı Bırakma",
    description: "Sigarasız geçen süre, biriken para ve vücuttaki değişimler.",
    icon: CigaretteOff,
  },
];

export default function MypanelHubPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-foreground">Panel</h1>
          <MypanelLogoutButton />
        </div>

        <div className="flex flex-col gap-3">
          {PANEL_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  cardSurfaceClass,
                  "group flex items-center gap-4 p-5 transition-colors hover:border-accent",
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-elevated">
                  <Icon className="size-5 text-foreground-muted" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-medium text-foreground">{item.label}</span>
                  <span className="mt-0.5 block text-[13px] text-foreground-muted">{item.description}</span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
