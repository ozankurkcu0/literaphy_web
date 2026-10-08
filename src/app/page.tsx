import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { ServiceCardGrid } from "@/components/sections/ServiceCardGrid";
import { ProductHighlightBand } from "@/components/sections/ProductHighlightBand";
import { DifferentiatorGrid } from "@/components/sections/DifferentiatorGrid";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { StatsCounterBar } from "@/components/sections/StatsCounterBar";
import { ClientReferences } from "@/components/sections/ClientReferences";
import { TestimonialSlider } from "@/components/sections/TestimonialSlider";
import { BlogPreviewRow } from "@/components/sections/BlogPreviewRow";
import { CTABand } from "@/components/sections/CTABand";
import { getPublicReferences } from "@/lib/public-references";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = buildMetadata({
  title: "Literaphy — Yazılım, Otomasyon ve Dijital Büyüme Ortağınız",
  description:
    "Literaphy; web geliştirme, özel yazılım, N8N otomasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.",
  path: "/",
});

// Referanslar sheet'ten geliyor; her ziyarette Google API'sini çağırmamak için
// sayfa saatte bir yeniden üretilir.
export const revalidate = 3600;

export default async function HomePage() {
  const references = await getPublicReferences();

  return (
    <>
      <Hero />
      <ServiceCardGrid />
      <ProductHighlightBand />
      <DifferentiatorGrid />
      <FeaturedProjects />
      <StatsCounterBar />
      <ClientReferences references={references} tone="elevated" />
      <TestimonialSlider testimonials={testimonials} />
      <BlogPreviewRow />
      <CTABand
        title="Projenizi konuşalım"
        lead="İhtiyacınızı anlatın, size en uygun çözümü ve zaman çizelgesini birlikte netleştirelim."
        ctaLabel="Teklif Alın"
      />
    </>
  );
}
