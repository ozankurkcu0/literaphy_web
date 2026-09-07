import { SmartphoneNfc } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { LiraSign } from "@/components/ui/LiraSign";

// QR Menü müşterilerine özel çapraz satış bandı — ProductHighlightBand ile
// aynı görsel dili kullanır (metin solda, görsel sağda, ürün rengi vurgusu).
// tone kasıtlı olarak "deep" (CTABand ile aynı) — hangi sayfaya, hangi
// komşu section'ların arasına eklenirse eklensin bir "özel teklif" bandı
// gibi öne çıksın istiyoruz, komşu section'ların tonuyla karışmasın.
export function GoogleReviewCrossSell() {
  return (
    <Section tone="deep" padding="standard">
      <div className="relative grid items-center gap-10 overflow-hidden rounded-xl border border-accent-product/20 bg-surface p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_var(--color-accent-product-glow)] lg:grid-cols-12 lg:gap-12 lg:p-16">
        <div className="flex flex-col items-start gap-5 lg:col-span-7">
          <Reveal>
            <Badge tone="solid-product">QR Menü Müşterilerine Özel</Badge>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="balance text-[28px] leading-[1.15] font-bold text-foreground md:text-[36px]">
              Google Review Kartı&apos;nda %50 indirim
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[16px] leading-relaxed text-foreground-muted">
              Müşterilerinizin Google Haritalar&apos;da tek dokunuşla yorum bırakmasını sağlayan Google Review Kartı,
              QR Menü Sistemleri müşterilerimize tüm paketlerde %50 indirimli.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="flex items-baseline gap-3">
            <span className="font-mono text-lg text-foreground-muted line-through">
              <LiraSign />
              1.000
            </span>
            <span className="font-mono text-[28px] leading-none font-semibold text-accent-product">
              <LiraSign />
              500
            </span>
            <span className="text-sm text-foreground-muted">/ kart — 5&apos;li ve 10&apos;lu paketlerde de geçerli</span>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink href="/google-review-karti" tone="product" withArrow>
              Google Review Kartını İnceleyin
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-5">
          <CoverArt tone="emerald" icon={SmartphoneNfc} ratio="square" label="%50 İndirim" />
        </Reveal>
      </div>
    </Section>
  );
}
