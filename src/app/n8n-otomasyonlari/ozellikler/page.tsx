import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { n8nFeatures } from "@/content/n8n-otomasyon";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureDetailGrid } from "@/components/sections/FeatureDetailGrid";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Özellikler",
  description:
    "N8N Otomasyonları özellikleri: AI destekli asistanlar, iş süreci otomasyonu, veri analizi ve mevcut araçlarınıza entegrasyon.",
  path: "/n8n-otomasyonlari/ozellikler",
});

export default function N8nFeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "N8N Otomasyonları", path: "/n8n-otomasyonlari" },
          { name: "Özellikler", path: "/n8n-otomasyonlari/ozellikler" },
        ])}
      />
      <PageHero
        eyebrow="Özellikler"
        tone="product"
        title="Sürecinizi baştan sona otomatikleştiren her detay"
        lead="Müşteri iletişiminden veri analizine kadar, işletmenizi gerçek bir hız avantajına dönüştüren otomasyon özellikleri."
        actions={
          <ButtonLink href="/n8n-otomasyonlari/demo" tone="product" withArrow>
            Canlı Demoyu İnceleyin
          </ButtonLink>
        }
      />
      <FeatureDetailGrid features={n8nFeatures} />
      <CTABand
        title="Bu özellikleri kendi sürecinizde görün"
        lead="Ücretsiz keşif görüşmesiyle başlayın, ihtiyacınıza özel akışı birlikte tasarlayalım."
        ctaLabel="Demo İsteyin"
        ctaHref="/n8n-otomasyonlari/demo"
        tone="product"
      />
    </>
  );
}
