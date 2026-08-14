import Image from "next/image";
import { Linkedin } from "lucide-react";
import type { TeamMember } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { cardSurfaceClass, cn } from "@/lib/utils";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div
      className={cn(
        cardSurfaceClass,
        "flex flex-col gap-4 p-7 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-strong",
      )}
    >
      {member.avatar ? (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
          <Image src={member.avatar} alt={member.name} fill sizes="56px" className="object-cover" />
        </div>
      ) : (
        <Avatar name={member.name} size={56} />
      )}
      <div>
        <h3 className="text-[16px] font-semibold text-foreground">{member.name}</h3>
        <p className="font-mono text-xs text-accent">{member.role}</p>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} — LinkedIn profili`}
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors duration-150 hover:text-foreground"
          >
            <Linkedin className="size-3.5" aria-hidden />
            LinkedIn
          </a>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">{member.bio}</p>
    </div>
  );
}
