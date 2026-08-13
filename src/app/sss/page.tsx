import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import { faqItems } from "@/content/faq";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { FaqCategoryTabs } from "@/components/features/FaqCategoryTabs";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Sıkça Sorulan Sorular",
  description: "Literaphy hizmetleri, QR Menü Sistemleri, fiyatlandırma ve süreç hakkında sıkça sorulan sorular.",
  path: "/sss",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Sıkça Sorulan Sorular", path: "/sss" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqItems.map(({ question, answer }) => ({ question, answer })))} />
      <PageHero
        eyebrow="SSS"
        title="Sıkça sorulan sorular"
        lead="Aradığınız cevabı bulamadıysanız, doğrudan bize ulaşabilirsiniz."
        align="center"
      />
      <Section tone="base" padding="standard">
        <FaqCategoryTabs />
      </Section>
      <CTABand
        title="Sorunuzu bulamadınız mı?"
        lead="Bize yazın, en kısa sürede yanıtlayalım."
        ctaLabel="İletişime Geçin"
      />
    </>
  );
}
