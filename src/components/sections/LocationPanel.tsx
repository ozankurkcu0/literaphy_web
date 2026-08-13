import { MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";

export function LocationPanel() {
  return (
    <Reveal delay={0.1} className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-hairline">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-elevated" style={{ mixBlendMode: "multiply" }} aria-hidden />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_40px_var(--color-accent-glow)]">
          <MapPin className="size-5" aria-hidden />
        </span>
        <p className="font-semibold text-foreground">{CONTACT.addressLine}</p>
        <p className="text-sm text-foreground-muted">{CONTACT.workingHours}</p>
      </div>
    </Reveal>
  );
}
