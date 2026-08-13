import type { Project } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/cards/ProjectCard";

interface RelatedProjectsProps {
  projects: Project[];
  title?: string;
  tone?: "deep" | "base" | "elevated";
}

export function RelatedProjects({ projects, title = "Diğer projeler", tone = "base" }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow="Devamı" title={title} align="left" className="mb-14" />
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
