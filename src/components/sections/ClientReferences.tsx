import Image from "next/image";
import type { ClientReference } from "@/content/references";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cardSurfaceClass, cn } from "@/lib/utils";

function ReferenceTile({ reference }: { reference: ClientReference }) {
  const tileClass = cn(
    cardSurfaceClass,
    "flex h-full min-h-32 flex-col items-center justify-center gap-3 px-6 py-8 text-center",
    reference.url && "transition-colors hover:border-strong",
  );

  const content = (
    <>
      {reference.logo ? (
        <Image
          src={reference.logo}
          alt={`${reference.name} logosu`}
          width={160}
          height={56}
          className="h-12 w-auto max-w-full object-contain"
        />
      ) : (
        <span className="text-xl font-semibold tracking-tight text-foreground">{reference.name}</span>
      )}
      <span className="font-mono text-xs text-foreground-muted">{reference.service}</span>
    </>
  );

  if (reference.url) {
    return (
      <a
        href={reference.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${reference.name} — ${reference.service}`}
        className={tileClass}
      >
        {content}
      </a>
    );
  }

  return <div className={tileClass}>{content}</div>;
}

export function ClientReferences({
  references,
  tone = "base",
}: {
  references: ClientReference[];
  tone?: "deep" | "base" | "elevated";
}) {
  if (references.length === 0) return null;

  return (
    <Section tone={tone} padding="standard">
      <SectionHeading
        eyebrow="Referanslar"
        title="Bizi tercih eden işletmeler"
        className="mb-14"
      />
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {references.map((reference) => (
          <RevealItem key={`${reference.name}-${reference.service}`}>
            <ReferenceTile reference={reference} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
