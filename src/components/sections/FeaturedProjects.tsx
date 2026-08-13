import { getFeaturedProjects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";

export function FeaturedProjects() {
  const projects = getFeaturedProjects().slice(0, 3);

  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading
        eyebrow="Projeler"
        title="Somut sonuçlar üreten çözümler"
        align="left"
        action={
          <ButtonLink href="/projeler" variant="secondary" withArrow>
            Tüm Projeler
          </ButtonLink>
        }
        className="mb-14"
      />
      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <RevealItem key={project.slug}>
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
