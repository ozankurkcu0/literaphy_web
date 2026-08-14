import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  feature: { icon: LucideIcon; title: string; description: string };
}

// Server Component: hover efekti (kart yükselmesi + ikon rengi) saf CSS
// transition ile yapılıyor, framer-motion gerekmiyor. Bu sayede feature.icon
// (bir fonksiyon/bileşen) Server -> Client sınırını hiç geçmek zorunda kalmıyor
// — aksi halde Next.js "Functions cannot be passed to Client Components" hatası verirdi.
export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="group flex h-full flex-col gap-4 rounded-lg border border-hairline bg-surface p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-transform duration-250 ease-out hover:-translate-y-1">
      <div className="flex size-11 items-center justify-center rounded-md bg-(--color-icon-tint-soft) text-icon-tint transition-colors duration-250 ease-out group-hover:bg-[rgba(10,132,255,0.16)]">
        <Icon className="size-5" aria-hidden strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-foreground-muted">{feature.description}</p>
    </div>
  );
}
