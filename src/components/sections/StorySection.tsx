import { companyStory } from "@/content/team";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function StorySection() {
  return (
    <Section tone="deep" padding="hero">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Reveal delay={0.08}>
          <h1 className="balance text-[26px] leading-[1.35] font-semibold text-foreground md:text-[32px]">
            {companyStory.lead}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-[17px] leading-relaxed text-foreground-muted">{companyStory.body}</p>
        </Reveal>
      </div>
    </Section>
  );
}
