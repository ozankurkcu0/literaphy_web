import type { Metadata } from "next";
import Image from "next/image";
import { CreditCard, Instagram, Layers } from "lucide-react";
import { buildMetadata, breadcrumbJsonLd, productJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import {
  instagramNfcFaq,
  instagramNfcFeatures,
  instagramNfcHowItWorks,
  instagramNfcPricing,
} from "@/content/instagram-nfc";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { QuantityPricingSection } from "@/components/features/QuantityPricingSection";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

export const metadata: Metadata = buildMetadata({
  title: "Instagram NFC Kartı — Tek Dokunuşla Anında Takipçi",
  description:
    "Literaphy Instagram NFC Kartı; telefona okutulduğunda Instagram profilinizi doğrudan açar. Tek kart ₺1.000, 5'li paket ₺4.500, 10'lu paket ₺8.000 — üzeri için iletişime geçin.",
  path: "/instagram-nfc-karti",
});

// Gerçek ürün fotoğrafları.
const heroImage: string | undefined = "/products/instagram-nfc-karti-hero.jpg"; // kafede kullanım
const cardFrontImage: string | undefined = "/products/instagram-nfc-karti-on-yuz.jpg"; // kart yakın çekim
const cardBackImage: string | undefined = "/products/instagram-nfc-karti-paket.jpg"; // paket/çoklu kart fotoğrafı
const inUseImage: string | undefined = "/products/instagram-nfc-karti-kullanimda.jpg"; // kafede elde kullanım

export default function InstagramNfcCardPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Instagram NFC Kartı", path: "/instagram-nfc-karti" },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: "Literaphy Instagram NFC Kartı",
          description: "NFC ile çalışan, telefona okutulduğunda Instagram profilinizi doğrudan açan kart.",
          path: "/instagram-nfc-karti",
          price: String(instagramNfcPricing[0]?.unitPrice ?? 1000),
        })}
      />
      <JsonLd data={faqJsonLd(instagramNfcFaq)} />

      <PageHero
        eyebrow="Kişiler ve İşletmeler İçin"
        tone="product"
        title="Tek dokunuşla Instagram takipçisi kazanın"
        lead="Kartı telefona yaklaştırın — Instagram profiliniz, uygulama indirmeden anında açılır. Takip etme adımını kolaylaştırdıkça daha fazla kişi hesabınızı takip eder."
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
                alt="Instagram NFC Kartı bir kafede kasada kullanılıyor"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          ) : (
            <CoverArt tone="violet" icon={Instagram} ratio="wide" label="Instagram NFC Kartı" />
          )
        }
      />

      <HowItWorksSteps
        steps={instagramNfcHowItWorks}
        eyebrow="Nasıl Çalışır"
        title="Üç adımda daha fazla Instagram takipçisi"
      />

      <Section tone="elevated" padding="standard">
        <SectionHeading
          eyebrow="Özellikler"
          title="Kutudan çıkar çıkmaz kullanıma hazır"
          tone="product"
          className="mb-14"
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instagramNfcFeatures.map((feature) => (
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
          lead="Kart üzerine logonuzu ve marka renklerinizi işleyebiliriz. Aşağıda gerçek kartımızın yakın çekimini ve bir kafede kullanım örneğini görebilirsiniz."
          tone="product"
          className="mb-14"
        />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <RevealItem>
            {cardFrontImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={cardFrontImage}
                  alt="Instagram NFC Kartı yakın çekim"
                  fill
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <CoverArt tone="violet" icon={CreditCard} ratio="video" label="Kart — Ön Yüz" />
            )}
          </RevealItem>
          <RevealItem>
            {cardBackImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={cardBackImage}
                  alt="Instagram NFC Kartları çoklu paket görünümü"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <CoverArt tone="rose" icon={Layers} ratio="video" label="Kartlar — Paket Görünümü" />
            )}
          </RevealItem>
          <RevealItem>
            {inUseImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <Image
                  src={inUseImage}
                  alt="Instagram NFC Kartı kafede elde kullanımda"
                  fill
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <CoverArt tone="amber" icon={Instagram} ratio="video" label="Kullanımda" />
            )}
          </RevealItem>
        </RevealGroup>
      </Section>

      <Section tone="elevated" padding="standard" wide id="fiyatlandirma">
        <SectionHeading
          eyebrow="Fiyatlandırma"
          title="İhtiyacınıza uygun adedi seçin"
          lead="Tüm fiyatlar tek seferliktir, abonelik değildir. Kartlar hesabınıza özel programlanıp kargoyla gönderilir."
          tone="product"
          className="mb-14"
        />
        <QuantityPricingSection tiers={instagramNfcPricing} />
      </Section>

      <MiniFAQ items={instagramNfcFaq} eyebrow="SSS" title="Instagram NFC Kartı hakkında merak edilenler" />

      <CTABand
        eyebrow="Hemen Başlayın"
        title="Instagram NFC Kartınızı sipariş edin"
        lead="Instagram kullanıcı adınızı paylaşın, kartlarınızı 3-5 iş günü içinde programlayıp adresinize gönderelim."
        ctaLabel="Sipariş İçin İletişime Geçin"
        tone="product"
        urgent
      />
    </>
  );
}
