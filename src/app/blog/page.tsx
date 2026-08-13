import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { blogPosts } from "@/content/blog";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { BlogExplorer } from "@/components/features/BlogExplorer";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Yazılım ve Otomasyon Üzerine Notlar",
  description:
    "Yazılım geliştirme, AI otomasyonu, WhatsApp otomasyonu, API entegrasyonu ve QR menü sistemleri üzerine Literaphy'den içerikler.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Blog"
        title="Yazılım ve otomasyon üzerine notlarımız"
        lead="Projelerimizden çıkardığımız dersleri ve sektör gözlemlerimizi paylaşıyoruz."
        align="left"
      />
      <Section tone="base" padding="standard">
        <BlogExplorer posts={blogPosts} />
      </Section>
    </>
  );
}
