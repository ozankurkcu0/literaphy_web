import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { cardSurfaceClass, cn } from "@/lib/utils";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className={cn(
        cardSurfaceClass,
        "relative mx-auto flex max-w-2xl flex-col items-center gap-6 overflow-hidden px-8 py-12 text-center sm:px-14",
      )}
    >
      <Quote
        className="absolute -top-4 left-6 size-24 text-accent/[0.07] sm:size-28"
        strokeWidth={1}
        aria-hidden
      />
      <p className="relative text-xl leading-relaxed text-foreground-secondary sm:text-2xl">
        “{testimonial.quote}”
      </p>
      <div className="relative flex items-center gap-3">
        <Avatar name={testimonial.name} size={44} />
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
          <p className="font-mono text-xs text-foreground-muted">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}
