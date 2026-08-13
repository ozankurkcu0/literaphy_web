import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getServiceBySlug, getServiceHref } from "@/content/services";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

interface ServiceCardProps {
  slug: string;
  detailed?: boolean;
}

const categoryLabels: Record<ProjectCategory, string> = {
  "web-gelistirme": "Web Geliştirme",
  "yazilim-gelistirme": "Yazılım Geliştirme",
  "ai-otomasyon": "AI Otomasyonu",
  "whatsapp-otomasyonu": "WhatsApp Otomasyonu",
  "api-entegrasyonu": "API Entegrasyonu",
  "qr-menu": "QR Menü Sistemleri",
};

export function ServiceCard({ slug, detailed = false }: ServiceCardProps) {
  const service = getServiceBySlug(slug);
  if (!service) return null;

  const Icon = service.icon;

  return (
    <Card className="group flex h-full w-full flex-col gap-3 overflow-hidden rounded-3xl p-3 transition-colors duration-200 hover:border-accent/40">
      <CardHeader className="p-0">
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-accent-soft transition-colors duration-200 group-hover:bg-accent-soft/80">
          <Icon className="size-14 text-accent" strokeWidth={1.5} aria-hidden />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-3">
        <div className="mb-4">
          <Badge tone="neutral">{categoryLabels[service.category]}</Badge>
        </div>

        <h3 className="mb-2 text-2xl font-bold leading-tight text-foreground">{service.name}</h3>

        <p
          className={cn(
            "text-[15px] leading-relaxed text-foreground-muted",
            "[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis",
          )}
          style={{ WebkitLineClamp: 3 }}
        >
          {service.shortDescription}
        </p>

        {detailed && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {service.scope.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Link
          href={getServiceHref(service)}
          className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors duration-150 hover:text-accent-hover"
        >
          İncele
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </Link>
      </CardFooter>
    </Card>
  );
}
