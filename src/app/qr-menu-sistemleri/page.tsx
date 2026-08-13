import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, breadcrumbJsonLd, productJsonLd, JsonLd } from "@/lib/seo";
import { qrMenuFaq, qrMenuPricing } from "@/content/qr-menu";
import { getTestimonialsByTag } from "@/content/testimonials";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { FeatureSummaryGrid } from "@/components/sections/FeatureSummaryGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingSection } from "@/components/features/PricingSection";
import { TestimonialSlider } from "@/components/sections/TestimonialSlider";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

export const metadata: Metadata = buildMetadata({
  title: "QR Menü Sistemleri — Cafe ve Restoranlar İçin Dijital Menü",
  description:
    "Literaphy QR Menü Sistemleri ile basılı menü maliyetinden kurtulun, fiyat güncellemelerini saniyeler içinde yayına alın. Kurulum 24-48 saat içinde tamamlanır.",
  path: "/qr-menu-sistemleri",
});

export default function QrMenuLandingPage() {
  const testimonials = getTestimonialsByTag("qr-menu");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "QR Menü Sistemleri", path: "/qr-menu-sistemleri" },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: "Literaphy QR Menü Sistemleri",
          description:
            "Cafe ve restoranlar için anlık güncellenebilir, çoklu dilli QR menü sistemi.",
          path: "/qr-menu-sistemleri",
          price: String(qrMenuPricing[0]?.monthlyPrice ?? 349),
        })}
      />

      <PageHero
        eyebrow="Cafe & Restoran İçin"
        tone="product"
        title="Temassız, anlık güncellenebilir dijital menü"
        lead="Basılı menü maliyetini ortadan kaldırın. Fiyat ve ürün değişikliklerinizi saniyeler içinde tüm şubelerinize yayın."
        actions={
          <>
            <MagneticWrap>
              <ButtonLink href="/qr-menu-sistemleri/demo" tone="product" size="lg" withArrow>
                Hemen Başlayın
              </ButtonLink>
            </MagneticWrap>
            <ButtonLink href="/qr-menu-sistemleri/fiyatlandirma" variant="secondary">
              Fiyatları Gör
            </ButtonLink>
          </>
        }
        visual={
          <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
            <Image
              src="/projects/kahve-duragi-qr-menu-portrait.jpg"
              alt="Örnek bir QR menü sitesinin karşılama ekranı"
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover"
              priority
            />
          </div>
        }
      />

      <HowItWorksSteps />
      <FeatureSummaryGrid />

      <Section tone="base" padding="standard">
        <SectionHeading
          eyebrow="Fiyatlandırma"
          title="İşletmenize uygun paketi seçin"
          tone="product"
          action={
            <ButtonLink href="/qr-menu-sistemleri/fiyatlandirma" variant="secondary" withArrow>
              Tüm Paketleri Karşılaştır
            </ButtonLink>
          }
          className="mb-14"
        />
        <PricingSection plans={qrMenuPricing} />
      </Section>

      {testimonials.length > 0 && (
        <TestimonialSlider
          testimonials={testimonials}
          eyebrow="İşletme Sahipleri"
          title="Cafe ve restoranlar ne diyor?"
          tone="elevated"
        />
      )}

      <MiniFAQ items={qrMenuFaq} eyebrow="SSS" title="QR Menü Sistemleri hakkında merak edilenler" />

      <CTABand
        eyebrow="Hemen Başlayın"
        title="Menünüz 48 saat içinde yayında olsun"
        lead="Kurulum ücretsiz, işlemler birkaç adımda tamamlanır."
        ctaLabel="Demo İsteyin"
        ctaHref="/qr-menu-sistemleri/demo"
        tone="product"
        urgent
      />
    </>
  );
}
