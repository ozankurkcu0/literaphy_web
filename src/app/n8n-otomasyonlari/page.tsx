import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, serviceJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import { n8nFaq, n8nFeatures, n8nHowItWorks } from "@/content/n8n-otomasyon";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { FeatureSummaryGrid } from "@/components/sections/FeatureSummaryGrid";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { AutomationFlowVisual } from "@/components/features/AutomationFlowVisual";

export const metadata: Metadata = buildMetadata({
  title: "N8N Otomasyonları — Yapay Zeka Destekli İş Süreci Otomasyonu",
  description:
    "Literaphy N8N Otomasyonları ile tekrar eden iş süreçlerinizi AI destekli akışlarla otomatikleştirin. Keşif görüşmesiyle başlayın, projenize özel şeffaf teklif alın.",
  path: "/n8n-otomasyonlari",
});

export default function N8nLandingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "N8N Otomasyonları", path: "/n8n-otomasyonlari" },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "Literaphy N8N Otomasyonları",
          description:
            "İşletmeler için AI destekli, N8N tabanlı iş süreci otomasyonu ve entegrasyon hizmeti.",
          path: "/n8n-otomasyonlari",
        })}
      />
      <JsonLd data={faqJsonLd(n8nFaq)} />

      <PageHero
        eyebrow="AI Destekli Otomasyon"
        tone="product"
        title="İşletmenizi hızlandıran akıllı otomasyonlar"
        lead="Manuel ve tekrar eden iş süreçlerinizi N8N ve yapay zekayla yeniden tasarlıyoruz. Müşteri desteğinden raporlamaya kadar."
        actions={
          <>
            <MagneticWrap>
              <ButtonLink href="/n8n-otomasyonlari/demo" tone="product" size="lg" withArrow>
                Canlı Demoyu İnceleyin
              </ButtonLink>
            </MagneticWrap>
            <ButtonLink href="/n8n-otomasyonlari/fiyatlandirma" variant="secondary">
              Teklif Süreci
            </ButtonLink>
          </>
        }
        visual={<AutomationFlowVisual />}
      />

      <HowItWorksSteps steps={n8nHowItWorks} eyebrow="Nasıl Çalışır" title="Üç adımda özel otomasyon süreci" />

      <FeatureSummaryGrid
        features={n8nFeatures}
        title="İşletmenizi büyütecek otomasyon çözümleri"
        moreHref="/n8n-otomasyonlari/ozellikler"
      />

      <MiniFAQ items={n8nFaq} eyebrow="SSS" title="N8N Otomasyonları hakkında merak edilenler" />

      <CTABand
        eyebrow="Hemen Başlayın"
        title="Sürecinizi konuşalım, size özel bir otomasyon tasarlayalım"
        lead="Ücretsiz keşif görüşmesiyle başlayın, kapsam netleşince şeffaf bir teklif alın."
        ctaLabel="Demo İsteyin"
        ctaHref="/n8n-otomasyonlari/demo"
        tone="product"
        urgent
      />
    </>
  );
}
