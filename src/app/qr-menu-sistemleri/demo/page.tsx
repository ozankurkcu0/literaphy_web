import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveDemoFrame } from "@/components/features/InteractiveDemoFrame";
import { DemoRequestForm } from "@/components/features/DemoRequestForm";
import { submitDemoRequest } from "@/app/qr-menu-sistemleri/demo/actions";

export const metadata: Metadata = buildMetadata({
  title: "Canlı Demo",
  description: "Literaphy QR Menü Sistemleri'ni adım adım keşfedin ve kendi işletmeniz için demo isteyin.",
  path: "/qr-menu-sistemleri/demo",
});

export default function QrMenuDemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "QR Menü Sistemleri", path: "/qr-menu-sistemleri" },
          { name: "Demo", path: "/qr-menu-sistemleri/demo" },
        ])}
      />
      <Section tone="deep" padding="hero">
        <SectionHeading
          eyebrow="Canlı Demo"
          title="QR Menü Sistemleri'ni deneyimleyin"
          lead="Adımları takip ederek müşterinizin göreceği deneyimi baştan sona inceleyin."
          tone="product"
          titleAs="h1"
          className="mb-16"
        />
        <InteractiveDemoFrame />
      </Section>
      <Section tone="base" padding="standard">
        <div className="mx-auto max-w-xl">
          <DemoRequestForm
            action={submitDemoRequest}
            title="Kendi menünüz için demo isteyin"
            submitLabel="Kendi Menünüzü Oluşturun"
          />
        </div>
      </Section>
    </>
  );
}
