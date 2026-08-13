import { teamMembers } from "@/content/team";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/cards/TeamCard";

export function TeamGrid() {
  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading eyebrow="Ekip" title="Literaphy'nin arkasındaki isimler" className="mb-14" />
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <RevealItem key={member.name}>
            <TeamCard member={member} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
