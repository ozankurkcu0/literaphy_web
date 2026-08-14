import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkflowCanvasMockupProps {
  children: ReactNode;
  className?: string;
}

/** N8N/otomasyon editörü hissi veren, noktalı-grid arka planlı bir "canvas"
 * çerçevesi. PhoneMockup'ın bu ürün hattındaki karşılığı — ama telefon değil,
 * çünkü otomasyonlar kullanıcının ekranında değil arka planda çalışır. */
export function WorkflowCanvasMockup({ children, className }: WorkflowCanvasMockupProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xl", className)}>
      <div
        className="absolute -inset-6 -z-10 rounded-[3rem] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent-glow), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative rounded-2xl border border-strong bg-elevated p-2.5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* sahte pencere kontrolleri — bir editör/canvas penceresi olduğunu okutur */}
        <div className="mb-2.5 flex items-center gap-1.5 px-1.5">
          <span className="size-2.5 rounded-full bg-strong" aria-hidden />
          <span className="size-2.5 rounded-full bg-strong" aria-hidden />
          <span className="size-2.5 rounded-full bg-strong" aria-hidden />
        </div>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-base ring-1 ring-black/40"
          style={{
            backgroundImage: "radial-gradient(var(--color-hairline) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
