import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects, projects } from "@/content/projects";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CoverArt } from "@/components/ui/CoverArt";
import { ProblemSolutionBlock } from "@/components/sections/ProblemSolutionBlock";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { ResultMetricsRow } from "@/components/sections/ResultMetricsRow";
import { TechStackBadges } from "@/components/sections/TechStackBadges";
import { RelatedProjects } from "@/components/sections/RelatedProjects";
import { CTABand } from "@/components/sections/CTABand";

type PageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projeler/${project.slug}`,
    ogEyebrow: project.categoryLabel,
  });
}

export default async function ProjectDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project.slug, project.category);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Projeler", path: "/projeler" },
          { name: project.title, path: `/projeler/${project.slug}` },
        ])}
      />

      <Section tone="deep" padding="hero" innerClassName="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col gap-5 lg:col-span-6">
          <Reveal>
            <Badge tone="neutral">{project.categoryLabel}</Badge>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="balance text-[34px] leading-[1.1] font-bold text-foreground sm:text-[44px] lg:text-[52px]">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-[17px] leading-relaxed text-foreground-secondary">{project.summary}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-mono text-sm text-foreground-muted">Müşteri: {project.client}</p>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="lg:col-span-6">
          {project.imageWide ? (
            <div className="relative aspect-[16/7] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <Image
                src={project.imageWide}
                alt={`${project.title} — ${project.client}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <CoverArt tone={project.coverTone} ratio="wide" />
          )}
        </Reveal>
      </Section>

      <ProblemSolutionBlock problem={project.problem} solution={project.solution} />
      <ProjectGallery tone={project.coverTone} />
      <ResultMetricsRow results={project.results} />
      <TechStackBadges stack={project.techStack} tone="base" />
      <RelatedProjects projects={related} tone="elevated" />
      <CTABand
        title="Benzer bir sonuç sizin için de mümkün"
        lead="İhtiyacınızı anlatın, bu projeye benzer bir yol haritası çıkaralım."
        ctaLabel="Teklif Alın"
      />
    </>
  );
}
