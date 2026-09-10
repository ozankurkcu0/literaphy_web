import type { Metadata } from "next";
import Image from "next/image";
import { CreditCard, Layers, SmartphoneNfc } from "lucide-react";
import { buildMetadata, breadcrumbJsonLd, productJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import {
  googleReviewFaq,
  googleReviewFeatures,
  googleReviewHowItWorks,
  googleReviewPricing,
} from "@/content/google-review";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { QuantityPricingSection } from "@/components/features/QuantityPricingSection";
import { NfcComboPopup } from "@/components/features/NfcComboPopup";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

export const metadata: Metadata = buildMetadata({
  title: "Google Review Kartı — NFC ile Anında Google Yorumu",
  description:
    "Literaphy Google Review Kartı; NFC ile telefona okutulduğunda işletmenizin Google Haritalar değerlendirme sayfasını doğrudan açar. Tek kart ₺1.000, 5'li paket ₺4.500, 10'lu paket ₺8.000 — üzeri için iletişime geçin.",
  path: "/google-review-karti",
});

// Gerçek ürün fotoğrafları.
const heroImage: string | undefined = "/products/google-review-karti-hero.jpg"; // kafede kullanım, 16:9
const cardFrontImage: string | undefined = "/products/google-review-karti-on-yuz.jpg"; // kart yakın çekim
const cardBackImage: string | undefined = "/products/google-review-karti-arka-yuz.jpg"; // kartlar (çoklu paket görünümü)
const inUseImage: string | undefined = "/products/google-review-karti-kullanimda.jpg"; // kafede elde kullanım

export default function GoogleReviewCardPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Google Review Kartı", path: "/google-review-karti" },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: "Literaphy Google Review Kartı",
          description:
            "NFC ile çalışan, telefona okutulduğunda işletmenin Google Haritalar değerlendirme sayfasını doğrudan açan kart.",
          path: "/google-review-karti",
          price: String(googleReviewPricing[0]?.unitPrice ?? 1000),
        })}
      />
      <JsonLd data={faqJsonLd(googleReviewFaq)} />

      <PageHero
        eyebrow="İşletmeler İçin"
        tone="product"
        title="Tek dokunuşla Google yorumu alın"
        lead="Kartı telefona yaklaştırın — işletmenizin Google Haritalar değerlendirme sayfası, uygulama indirmeden anında açılır. Yorum bırakma adımını kolaylaştırdıkça daha fazla müşteriniz yorum bırakır."
        actions={
          <>
            <MagneticWrap>
              <ButtonLink href="#fiyatlandirma" tone="product" size="lg" withArrow>
                Fiyatları Gör
              </ButtonLink>
            </MagneticWrap>
            <ButtonLink href="/iletisim" variant="secondary">
              İletişime Geçin
            </ButtonLink>
          </>
        }
        visual={
          heroImage ? (
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <Image
                src={heroImage}
                alt="Google Review Kartı bir kafede kasada kullanılıyor"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          ) : (
            <CoverArt tone="emerald" icon={SmartphoneNfc} ratio="wide" label="Google Review Kartı" />
          )
        }
      />

      <HowItWorksSteps
        steps={googleReviewHowItWorks}
        eyebrow="Nasıl Çalışır"
        title="Üç adımda daha fazla Google yorumu"
      />

      <Section tone="elevated" padding="standard">
        <SectionHeading
          eyebrow="Özellikler"
          title="Kutudan çıkar çıkmaz kullanıma hazır"
          tone="product"
          className="mb-14"
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {googleReviewFeatures.map((feature) => (
            <RevealItem key={feature.title} className="h-full">
              <FeatureCard feature={feature} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="base" padding="standard">
        <SectionHeading
          eyebrow="Kart Tasarımı"
          title="Markanıza uygun, şık bir kart"
          lead="Kart üzerine logonuzu ve marka renklerinizi işleyebiliriz. Aşağıda gerçek kartımızın yakın çekimini, paket görünümünü ve bir kafede kullanım örneğini görebilirsiniz."
          tone="product"
          className="mb-14"
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <RevealItem>
            {cardFrontImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={cardFrontImage}
                  alt="Google Review Kartı yakın çekim"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "50% 45%", transform: "scale(0.82)" }}
                />
              </div>
            ) : (
              <CoverArt tone="emerald" icon={CreditCard} ratio="video" label="Kart — Ön Yüz" />
            )}
          </RevealItem>
          <RevealItem>
            {cardBackImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={cardBackImage}
                  alt="Google Review Kartları çoklu paket görünümü"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "0% 50%", transform: "scale(1.5)", transformOrigin: "30% 58%" }}
                />
              </div>
            ) : (
              <CoverArt tone="indigo" icon={Layers} ratio="video" label="Kartlar — Paket Görünümü" />
            )}
          </RevealItem>
          <RevealItem>
            {inUseImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={inUseImage}
                  alt="Google Review Kartı kafede elde kullanımda"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "62% 60%", transform: "scale(3)", transformOrigin: "48% 68%" }}
                />
              </div>
            ) : (
              <CoverArt tone="amber" icon={SmartphoneNfc} ratio="video" label="Kullanımda" />
            )}
          </RevealItem>
        </RevealGroup>
      </Section>

      <Section tone="elevated" padding="standard" wide id="fiyatlandirma">
        <SectionHeading
          eyebrow="Fiyatlandırma"
          title="İşletmenize uygun adedi seçin"
          lead="Tüm fiyatlar tek seferliktir, abonelik değildir. Kartlar işletmenize özel programlanıp kargoyla gönderilir."
          tone="product"
          className="mb-14"
        />
        <QuantityPricingSection tiers={googleReviewPricing} productName="Google Review Kartı" />
      </Section>

      <MiniFAQ items={googleReviewFaq} eyebrow="SSS" title="Google Review Kartı hakkında merak edilenler" />

      <CTABand
        eyebrow="Hemen Başlayın"
        title="İşletmeniz için Google Review Kartı sipariş edin"
        lead="İşletme bilgilerinizi paylaşın, kartlarınızı 3-5 iş günü içinde programlayıp adresinize gönderelim."
        ctaLabel="Sipariş İçin İletişime Geçin"
        tone="product"
        urgent
      />

      <NfcComboPopup />
    </>
  );
}
