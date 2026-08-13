import { blogPosts } from "@/content/blog";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/cards/BlogCard";
import { ButtonLink } from "@/components/ui/Button";

export function BlogPreviewRow() {
  const posts = blogPosts.slice(0, 3);

  return (
    <Section tone="elevated" padding="standard">
      <SectionHeading
        eyebrow="Blog"
        title="Blog'dan öne çıkanlar"
        align="left"
        action={
          <ButtonLink href="/blog" variant="secondary" withArrow>
            Tüm Yazılar
          </ButtonLink>
        }
        className="mb-14"
      />
      <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RevealItem key={post.slug}>
            <BlogCard post={post} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
