import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { n8nFaq, n8nPricingProcess } from "@/content/n8n-otomasyon";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

export const metadata: Metadata = buildMetadata({
  title: "Fiyatlandırma",
  description:
    "N8N Otomasyonları fiyatlandırma süreci: her proje kapsamına göre şeffaf, özel teklif hazırlanır. Ücretsiz keşif görüşmesiyle başlayın.",
  path: "/n8n-otomasyonlari/fiyatlandirma",
});

export default function N8nPricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "N8N Otomasyonları", path: "/n8n-otomasyonlari" },
          { name: "Fiyatlandırma", path: "/n8n-otomasyonlari/fiyatlandirma" },
        ])}
      />
      <PageHero
        eyebrow="Fiyatlandırma"
        tone="product"
        title="Projeye özel, şeffaf teklif süreci"
        lead="Her otomasyon ihtiyacı farklı kapsam ve entegrasyon gerektirir — bu yüzden sabit paketler yerine, sürecinizi dinledikten sonra size özel bir teklif hazırlıyoruz."
        align="center"
        actions={
          <MagneticWrap>
            <ButtonLink href="/n8n-otomasyonlari/demo" tone="product" size="lg" withArrow>
              Ücretsiz Keşif Görüşmesi
            </ButtonLink>
          </MagneticWrap>
        }
      />
      <HowItWorksSteps steps={n8nPricingProcess} eyebrow="Süreç" title="Teklif almanız üç adım sürer" />
      <MiniFAQ items={n8nFaq} title="Fiyatlandırma hakkında merak edilenler" tone="base" />
      <CTABand
        title="Sürecinizi anlatın, size özel teklifi hazırlayalım"
        lead="Görüşme ücretsiz, teklif kapsamınıza göre şeffaf hazırlanır."
        ctaLabel="Demo İsteyin"
        ctaHref="/n8n-otomasyonlari/demo"
        tone="product"
      />
    </>
  );
}
