import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { ContactInfoCard } from "@/components/sections/ContactInfoCard";
import { ContactForm } from "@/components/features/ContactForm";
import { LocationPanel } from "@/components/sections/LocationPanel";

export const metadata: Metadata = buildMetadata({
  title: "İletişim — Projenizi Konuşalım",
  description: "OBSoft ile iletişime geçin, projenizi anlatın, size özel bir teklif hazırlayalım.",
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <Section tone="deep" padding="hero" innerClassName="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ContactInfoCard />
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </Section>
      <Section tone="base" padding="compact">
        <LocationPanel />
      </Section>
    </>
  );
}
