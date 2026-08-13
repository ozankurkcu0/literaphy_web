import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { qrMenuFaq, qrMenuPricing } from "@/content/qr-menu";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { PricingSection } from "@/components/features/PricingSection";
import { PricingComparisonTable } from "@/components/sections/PricingComparisonTable";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Fiyatlandırma",
  description:
    "QR Menü Sistemleri fiyatlandırma paketleri: Başlangıç, Standart ve Premium. Kurulum ücretsiz, yıllık ödemede %20 indirim.",
  path: "/qr-menu-sistemleri/fiyatlandirma",
});

export default function QrMenuPricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "QR Menü Sistemleri", path: "/qr-menu-sistemleri" },
          { name: "Fiyatlandırma", path: "/qr-menu-sistemleri/fiyatlandirma" },
        ])}
      />
      <PageHero
        eyebrow="Fiyatlandırma"
        tone="product"
        title="Şeffaf, sürpriz içermeyen paketler"
        lead="İşletmenizin büyüklüğüne uygun bir paket seçin, istediğiniz zaman yükseltin."
        align="center"
      />
      <Section tone="base" padding="standard" wide>
        <PricingSection plans={qrMenuPricing} />
      </Section>
      <PricingComparisonTable />
      <MiniFAQ items={qrMenuFaq} title="Fiyatlandırma hakkında merak edilenler" tone="base" />
      <CTABand
        title="Hâlâ karar veremediniz mi?"
        lead="Size özel bir demo hazırlayalım, birlikte en uygun paketi belirleyelim."
        ctaLabel="Demo İsteyin"
        ctaHref="/qr-menu-sistemleri/demo"
        tone="product"
      />
    </>
  );
}
