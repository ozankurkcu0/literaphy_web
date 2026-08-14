import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { qrMenuFeatures } from "@/content/qr-menu";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureDetailGrid } from "@/components/sections/FeatureDetailGrid";
import { ScreenshotGallery } from "@/components/sections/ScreenshotGallery";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Özellikler",
  description:
    "QR Menü Sistemleri özellikleri: anlık güncelleme, çoklu dil desteği, marka kimliğine uyumlu tasarım ve ziyaretçi analitiği.",
  path: "/qr-menu-sistemleri/ozellikler",
});

export default function QrMenuFeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "QR Menü Sistemleri", path: "/qr-menu-sistemleri" },
          { name: "Özellikler", path: "/qr-menu-sistemleri/ozellikler" },
        ])}
      />
      <PageHero
        eyebrow="Özellikler"
        tone="product"
        title="İşletmenizi büyütecek her detay düşünüldü"
        lead="Menü yönetiminden ziyaretçi analitiğine kadar, dijital menünüzü gerçek bir büyüme aracına dönüştüren özellikler."
        actions={
          <ButtonLink href="/qr-menu-sistemleri/demo" tone="product" withArrow>
            Canlı Demoyu İnceleyin
          </ButtonLink>
        }
      />
      <FeatureDetailGrid features={qrMenuFeatures} />
      <ScreenshotGallery />
      <CTABand
        title="Özellikleri kendi menünüzde görün"
        lead="5 dakikada kurulum, sınırsız güncelleme."
        ctaLabel="Demo İsteyin"
        ctaHref="/qr-menu-sistemleri/demo"
        tone="product"
      />
    </>
  );
}
