import Link from "next/link";
import { CONTACT, FOOTER_LINKS, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { MeshGradient } from "@/components/ui/MeshGradient";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-deep">
      <div
        className="absolute top-0 left-0 h-px w-full"
        style={{
          background: "linear-gradient(to right, transparent, var(--color-accent-glow), transparent)",
        }}
        aria-hidden
      />
      <MeshGradient
        className="top-0 left-1/2 -translate-x-1/2"
        size={640}
        opacity={0.05}
      />

      <Container className="relative grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-24">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-foreground-muted">{SITE_TAGLINE}</p>
          <div className="mt-2 flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground-muted transition-colors duration-150 hover:text-foreground"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Hizmetler" links={FOOTER_LINKS.hizmetler} />
        <FooterColumn title="Kurumsal" links={FOOTER_LINKS.kurumsal} />

        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-xs font-medium tracking-[0.08em] text-foreground-muted uppercase">
            İletişim
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-foreground-muted">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-foreground">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-foreground">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>{CONTACT.addressLine}</li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-hairline">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} OBSoft Yazılım Teknolojileri. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-foreground-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-xs font-medium tracking-[0.08em] text-foreground-muted uppercase">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
