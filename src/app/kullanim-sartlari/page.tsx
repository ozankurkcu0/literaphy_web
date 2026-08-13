import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { termsOfService } from "@/content/legal";
import { LegalContent } from "@/components/sections/LegalContent";

export const metadata: Metadata = buildMetadata({
  title: "Kullanım Şartları",
  description: "OBSoft web sitesi kullanım şartları.",
  path: "/kullanim-sartlari",
});

export default function TermsPage() {
  return <LegalContent {...termsOfService} />;
}

