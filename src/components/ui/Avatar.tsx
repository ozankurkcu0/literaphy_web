import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const DEFAULT_GRADIENT: [string, string] = ["#5E6AD2", "#2A2E63"];

const PALETTE: [string, string][] = [
  DEFAULT_GRADIENT,
  ["#F5A623", "#5C3D0E"],
  ["#10B981", "#0B3D2E"],
  ["#EF4444", "#4A1414"],
  ["#38BDF8", "#0E3049"],
  ["#A78BFA", "#332259"],
];

function paletteIndex(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % PALETTE.length;
  }
  return Math.abs(hash) % PALETTE.length;
}

export function Avatar({ name, size = 48, className }: AvatarProps) {
  const [from, to] = PALETTE[paletteIndex(name)] ?? DEFAULT_GRADIENT;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-mono font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
