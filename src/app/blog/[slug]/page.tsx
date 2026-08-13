import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/content/blog";
import { buildMetadata, breadcrumbJsonLd, articleJsonLd, JsonLd } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { CoverArt } from "@/components/ui/CoverArt";
import { ShareButtons } from "@/components/features/ShareButtons";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";

type PageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogEyebrow: post.category,
  });
}

export default async function BlogDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category);
  const minutes = readingTime(post.content.join(" "));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          datePublished: post.publishedAt,
          author: post.author,
        })}
      />

      <Section tone="deep" padding="hero" innerClassName="flex flex-col items-center gap-6 text-center">
        <Reveal>
          <Badge tone="accent">{post.category}</Badge>
        </Reveal>
        <Reveal delay={0.06} className="max-w-3xl">
          <h1 className="balance text-[30px] leading-[1.15] font-bold text-foreground sm:text-[38px] lg:text-[44px]">
            {post.title}
          </h1>
        </Reveal>
        <Reveal delay={0.12} className="flex items-center gap-3">
          <Avatar name={post.author} size={36} />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">{post.author}</p>
            <p className="font-mono text-xs text-foreground-muted">
              {formatDate(post.publishedAt)} · {minutes} dk okuma
            </p>
          </div>
        </Reveal>
      </Section>

      <Section tone="base" padding="none" className="-mt-10">
        <Reveal>
          {post.imageWide ? (
            <div className="relative mx-auto aspect-[16/7] max-w-4xl overflow-hidden rounded-lg">
              <Image
                src={post.imageWide}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <CoverArt tone={post.coverTone} ratio="wide" className="mx-auto max-w-4xl" />
          )}
        </Reveal>
      </Section>

      <Section tone="base" padding="standard">
        <div className="mx-auto grid max-w-3xl gap-10 lg:grid-cols-[48px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ShareButtons slug={post.slug} title={post.title} />
            </div>
          </div>
          <article className="flex flex-col gap-6">
            <div className="mb-2 flex justify-start lg:hidden">
              <ShareButtons slug={post.slug} title={post.title} />
            </div>
            {post.content.map((paragraph, index) => (
              <Reveal key={index} delay={Math.min(index * 0.04, 0.2)}>
                <p className="text-[18px] leading-[1.8] text-foreground-secondary">{paragraph}</p>
              </Reveal>
            ))}
            {post.relatedHref && (
              <Reveal className="mt-4 rounded-lg border border-hairline bg-surface p-6">
                <p className="mb-3 text-sm text-foreground-muted">İlgili hizmetimize göz atmak ister misiniz?</p>
                <ButtonLink href={post.relatedHref.href} variant="secondary" withArrow>
                  {post.relatedHref.label}
                </ButtonLink>
              </Reveal>
            )}
          </article>
        </div>
      </Section>

      <RelatedPosts posts={related} tone="elevated" />
      <CTABand
        title="Bu yazı işinize yaradıysa, birlikte konuşalım"
        lead="Benzer bir ihtiyacınız varsa size özel bir yol haritası çıkaralım."
        ctaLabel="İletişime Geçin"
      />
    </>
  );
}
