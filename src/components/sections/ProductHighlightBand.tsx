import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function ProductHighlightBand() {
  return (
    <Section tone="elevated" padding="standard">
      <div className="relative grid items-center gap-10 overflow-hidden rounded-xl border border-accent-product/20 bg-surface p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_var(--color-accent-product-glow)] lg:grid-cols-12 lg:gap-12 lg:p-16">
        <div className="flex flex-col items-start gap-5 lg:col-span-5">
          <Reveal>
            <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-accent-product uppercase">
              Ürün
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="balance text-[28px] leading-[1.15] font-bold text-foreground md:text-[36px]">
              İşletmenizi hızlandıracak N8N otomasyonları
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[16px] leading-relaxed text-foreground-muted">
              Tekrarlayan iş süreçlerinizi yapay zeka destekli otomasyonlarla yeniden tasarlıyoruz. Müşteri desteğinden veri işlemeye, raporlamadan içerik üretimine kadar geniş bir yelpazede iş akışlarınızı optimize ediyoruz.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ButtonLink href="/hizmetler/ai-otomasyon" tone="product" withArrow>
              Otomasyon Sistemlerimizi Keşfedin
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] lg:aspect-[16/7]">
            <Image
              src="/n8n-workflow.jpg"
              alt="N8N otomasyon iş akışı örneği"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
