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
      <Avatar name={member.name} size={56} />
      <div>
        <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
        <p className="font-mono text-xs text-accent">{member.role}</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">{member.bio}</p>
    </div>
  );
}
