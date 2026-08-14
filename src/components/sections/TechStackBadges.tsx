import type { IconType } from "react-icons";
import {
  SiLangchain,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWhatsapp,
} from "react-icons/si";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

// Gerçek marka logosu bulunan teknolojiler — geri kalanı (ör. "Headless CMS",
// "Yönetim Paneli", "QR Kod Üretimi") somut bir ürün/marka değil, kavramsal
// bir yetenek tanımı olduğu için logosu yok; bunlar Badge fallback'ine düşer.
const TECH_ICONS: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  Vercel: SiVercel,
  Python: SiPython,
  n8n: SiN8N,
  "Node.js": SiNodedotjs,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  "WhatsApp Business API": SiWhatsapp,
  LangChain: SiLangchain,
};

export function TechStackBadges({ stack, tone = "base" as const }: { stack: string[]; tone?: "deep" | "base" | "elevated" }) {
  return (
    <Section tone={tone} padding="compact">
      <RevealGroup className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        {stack.map((tech) => {
          const Icon = TECH_ICONS[tech];
          return (
            <RevealItem key={tech}>
              {Icon ? (
                <div
                  title={tech}
                  className="flex h-9 items-center justify-center text-foreground-muted transition-colors duration-150 ease-standard hover:text-foreground"
                >
                  <Icon className="size-7" aria-hidden />
                  <span className="sr-only">{tech}</span>
                </div>
              ) : (
                <div className="flex h-9 items-center justify-center">
                  <Badge tone="neutral">{tech}</Badge>
                </div>
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
