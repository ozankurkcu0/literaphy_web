import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/IconBox";

const rows = [
  { icon: Mail, label: "E-posta", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: "Telefon", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Adres", value: CONTACT.addressLine },
  { icon: Clock, label: "Çalışma Saatleri", value: CONTACT.workingHours },
];

export function ContactInfoCard() {
  return (
    <Reveal className="flex h-full flex-col gap-8">
      <div>
        <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-accent uppercase">İletişim</span>
        <h1 className="mt-4 text-[28px] leading-tight font-bold text-foreground md:text-[34px]">
          Konuşmaya hazırız
        </h1>
        <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-foreground-muted">
          Projenizi anlatın, size en uygun çözümü ve zaman çizelgesini birlikte belirleyelim.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row) => {
          const content = (
            <div className="flex items-start gap-4">
              <IconBox icon={row.icon} size="sm" />
              <div>
                <p className="text-xs font-medium text-foreground-muted uppercase">{row.label}</p>
                <p className="mt-0.5 text-[15px] text-foreground">{row.value}</p>
              </div>
            </div>
          );
          return row.href ? (
            <a key={row.label} href={row.href} className="transition-opacity hover:opacity-80">
              {content}
            </a>
          ) : (
            <div key={row.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-5 border-t border-hairline pt-6">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            {social.label}
          </a>
        ))}
      </div>
    </Reveal>
  );
}
