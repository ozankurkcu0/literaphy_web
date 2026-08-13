import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCardGrid } from "@/components/sections/ServiceCardGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Yazılım, Web ve AI Otomasyon Hizmetleri",
  description:
    "Literaphy; web geliştirme, yazılım geliştirme, AI otomasyonu, WhatsApp otomasyonu ve API entegrasyonu hizmetleri sunar.",
  path: "/hizmetler",
});

export default function ServicesHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
        ])}
      />
      <PageHero
        eyebrow="Hizmetler"
        title="İşletmenizin her dijital ihtiyacı için tek adres"
        lead="Web sitenizden operasyon yazılımınıza, otomasyonlarınızdan sistem entegrasyonlarınıza kadar; her hizmeti aynı teknik titizlikle sunuyoruz."
      />
      <ServiceCardGrid detailed showHeading={false} tone="base" />
      <ProcessSteps />
      <CTABand
        title="Hangi hizmetin size uygun olduğundan emin değil misiniz?"
        lead="Kısa bir keşif görüşmesiyle ihtiyacınızı birlikte netleştirelim."
        ctaLabel="Keşif Görüşmesi Ayarlayın"
      />
    </>
  );
}
