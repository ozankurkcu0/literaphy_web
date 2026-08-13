import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { ServiceCardGrid } from "@/components/sections/ServiceCardGrid";
import { ProductHighlightBand } from "@/components/sections/ProductHighlightBand";
import { DifferentiatorGrid } from "@/components/sections/DifferentiatorGrid";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { StatsCounterBar } from "@/components/sections/StatsCounterBar";
import { TestimonialSlider } from "@/components/sections/TestimonialSlider";
import { BlogPreviewRow } from "@/components/sections/BlogPreviewRow";
import { CTABand } from "@/components/sections/CTABand";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = buildMetadata({
  title: "Literaphy — Yazılım, Otomasyon ve Dijital Büyüme Ortağınız",
  description:
    "Literaphy; web geliştirme, özel yazılım, AI otomasyonları, WhatsApp otomasyonu, API entegrasyonları ve QR menü sistemleriyle operasyonunuzu hızlandırır.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCardGrid />
      <ProductHighlightBand />
      <DifferentiatorGrid />
      <FeaturedProjects />
      <StatsCounterBar />
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
