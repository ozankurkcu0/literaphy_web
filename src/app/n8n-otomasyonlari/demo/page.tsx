import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveWorkflowDemo } from "@/components/features/InteractiveWorkflowDemo";
import { DemoRequestForm } from "@/components/features/DemoRequestForm";
import { submitN8nDemoRequest } from "@/app/n8n-otomasyonlari/demo/actions";

export const metadata: Metadata = buildMetadata({
  title: "Canlı Demo",
  description: "Literaphy N8N Otomasyonları'nı adım adım keşfedin ve kendi işletmeniz için demo isteyin.",
  path: "/n8n-otomasyonlari/demo",
});

export default function N8nDemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "N8N Otomasyonları", path: "/n8n-otomasyonlari" },
          { name: "Demo", path: "/n8n-otomasyonlari/demo" },
        ])}
      />
      <Section tone="deep" padding="hero">
        <SectionHeading
          eyebrow="Canlı Demo"
          title="Bir otomasyonun arka planda nasıl çalıştığını görün"
          lead="Adımları takip ederek bir WhatsApp mesajının AI ile işlenip CRM'e kaydedilmesini baştan sona inceleyin."
          tone="product"
          titleAs="h1"
          className="mb-16"
        />
        <InteractiveWorkflowDemo />
      </Section>
      <Section tone="base" padding="standard">
        <div className="mx-auto max-w-xl">
          <DemoRequestForm
            action={submitN8nDemoRequest}
            title="Kendi otomasyonunuz için demo isteyin"
            submitLabel="Otomasyon Talebinizi Gönderin"
          />
        </div>
      </Section>
    </>
  );
}
