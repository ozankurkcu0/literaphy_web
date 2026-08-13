import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServiceBySlug, services } from "@/content/services";
import { getRelatedProjects } from "@/content/projects";
import { buildMetadata, breadcrumbJsonLd, serviceJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { ScopeList } from "@/components/sections/ScopeList";
import { TechStackBadges } from "@/components/sections/TechStackBadges";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedProjects } from "@/components/sections/RelatedProjects";
import { MiniFAQ } from "@/components/sections/MiniFAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { AutomationFlowVisual } from "@/components/features/AutomationFlowVisual";

export function generateStaticParams() {
  // Kendi harici sayfası olan hizmetler (href set edilmiş, örn. QR Menü
  // Sistemleri) burada statik olarak üretilmez — o slug'a bu jenerik
  // şablonla değil, kendi zengin sayfasıyla karşılık verilir.
  return services.filter((service) => !service.href).map((service) => ({ slug: service.slug }));
}

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/hizmetler/${service.slug}`,
    ogEyebrow: "Hizmet",
  });
}

export default async function ServiceDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  // Kendi harici sayfası olan bir hizmete biri doğrudan bu URL'den gelirse
  // (örn. eski bir link), jenerik şablonu render etmek yerine oraya yönlendir.
  if (service.href) redirect(service.href);

  const relatedProjects = getRelatedProjects(service.slug, service.category);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
          { name: service.name, path: `/hizmetler/${service.slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.shortDescription,
          path: `/hizmetler/${service.slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(service.faq)} />

      <PageHero
        eyebrow="Hizmet"
        title={service.name}
        lead={service.heroLead}
        actions={
          <>
            <ButtonLink href="/iletisim" withArrow>
              Teklif Alın
            </ButtonLink>
            <ButtonLink href="/projeler" variant="secondary">
              İlgili Projeleri Gör
            </ButtonLink>
          </>
        }
        visual={
          service.slug === "ai-otomasyon" ? (
            <AutomationFlowVisual />
          ) : (
            <CoverArt tone={service.relatedCoverTone} icon={service.icon} ratio="wide" />
          )
        }
      />
      <ScopeList scope={service.scope} />
      <TechStackBadges stack={service.techStack} tone="elevated" />
      <ProcessSteps tone="base" />
      <RelatedProjects projects={relatedProjects} title={`${service.name} projelerimiz`} tone="elevated" />
      <MiniFAQ items={service.faq} tone="base" />
      <CTABand
        title={`${service.name} projenizi hayata geçirelim`}
        lead="İhtiyacınızı anlatın, size özel bir teklif hazırlayalım."
        ctaLabel="Teklif Alın"
      />
    </>
  );
}
