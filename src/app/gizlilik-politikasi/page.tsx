import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { privacyPolicy } from "@/content/legal";
import { LegalContent } from "@/components/sections/LegalContent";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description: "Literaphy gizlilik politikası ve kişisel veri işleme esasları.",
  path: "/gizlilik-politikasi",
});

export default function PrivacyPolicyPage() {
  return <LegalContent {...privacyPolicy} />;
}
