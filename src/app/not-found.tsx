import { MeshGradient } from "@/components/ui/MeshGradient";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section tone="deep" padding="hero" className="relative flex min-h-[70vh] items-center overflow-hidden">
      <MeshGradient
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size={480}
        opacity={0.04}
      />
      <div className="relative mx-auto flex flex-col items-center gap-6 text-center">
        <span className="font-mono text-[80px] leading-none font-semibold text-foreground-muted sm:text-[96px]">
          404
        </span>
        <h1 className="text-2xl font-bold text-foreground">Aradığınız sayfa bulunamadı</h1>
        <p className="max-w-sm text-foreground-muted">
          Bu sayfa taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek aradığınızı bulabilirsiniz.
        </p>
        <ButtonLink href="/" withArrow>
          Ana Sayfaya Dön
        </ButtonLink>
      </div>
    </Section>
  );
}
