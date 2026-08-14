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
          {/* N8N otomasyonu QR menüden farklı olarak "hazır bir ürün" değil,
              işletmeye özel kurulan bir süreç — bu formun ne işe yaradığını
              (hazır bir demo hesabı açmıyor) kısaca netleştiriyoruz. */}
          <div className="mb-8 flex flex-col gap-2 text-center">
            <span className="font-mono text-xs font-medium tracking-[0.1em] text-accent-product uppercase">
              Bu talepte ne oluyor?
            </span>
            <p className="text-sm leading-relaxed text-foreground-muted">
              Bu form hazır bir demo hesabı açmıyor — her N8N otomasyonu işletmenize özel kurulur. Talebinizi
              aldıktan sonra ekibimiz sizi arar, mevcut sürecinizi dinler ve hangi adımların otomatikleştirilebileceğini
              birlikte netleştirip size özel örnek bir akışla dönüş yapar.
            </p>
          </div>
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
