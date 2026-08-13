import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { StorySection } from "@/components/sections/StorySection";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { StatsCounterBar } from "@/components/sections/StatsCounterBar";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda — Yazılım ve Otomasyon Ortağınız",
  description:
    "Literaphy, işletmelerin dijitalleşme sürecinde tekrar eden ve zaman alan iş yüklerini teknolojiyle ortadan kaldırmak için kuruldu.",
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <StorySection />
      <ValuesGrid />
      <TeamGrid />
      <StatsCounterBar tone="base" />
      <CTABand
        title="Ekibimizle tanışın"
        lead="Projenizi anlatın, ihtiyacınıza en uygun ekip arkadaşımız sizinle iletişime geçsin."
        ctaLabel="İletişime Geçin"
      />
    </>
  );
}
