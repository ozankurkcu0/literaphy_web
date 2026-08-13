import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { ProjectExplorer } from "@/components/features/ProjectExplorer";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Projelerimiz — Somut Sonuçlar Üreten Çözümler",
  description:
    "Literaphy'nin web geliştirme, yazılım geliştirme, AI otomasyonu, WhatsApp otomasyonu, API entegrasyonu ve QR menü sistemleri projelerini inceleyin.",
  path: "/projeler",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Projeler", path: "/projeler" },
        ])}
      />
      <PageHero
        eyebrow="Projeler"
        title="Somut sonuçlar üreten çözümler"
        lead="Farklı sektörlerden işletmeler için geliştirdiğimiz projelere ve elde edilen ölçülebilir sonuçlara göz atın."
        align="left"
      />
      <Section tone="base" padding="standard">
        <ProjectExplorer projects={projects} />
      </Section>
      <CTABand
        title="Sıradaki proje sizinki olsun"
        lead="İhtiyacınızı anlatın, benzer bir başarı hikayesini birlikte yazalım."
        ctaLabel="Teklif Alın"
      />
    </>
  );
}
