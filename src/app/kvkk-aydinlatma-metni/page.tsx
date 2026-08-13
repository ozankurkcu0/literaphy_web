import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { kvkkNotice } from "@/content/legal";
import { LegalContent } from "@/components/sections/LegalContent";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "OBSoft KVKK aydınlatma metni ve veri sahibi hakları.",
  path: "/kvkk-aydinlatma-metni",
});

export default function KvkkPage() {
  return <LegalContent {...kvkkNotice} />;
}
