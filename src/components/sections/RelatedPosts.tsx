import type { BlogPost } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/cards/BlogCard";

interface RelatedPostsProps {
  posts: BlogPost[];
  tone?: "deep" | "base" | "elevated";
}

export function RelatedPosts({ posts, tone = "base" }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <Section tone={tone} padding="standard">
      <SectionHeading eyebrow="Devamı" title="İlginizi çekebilecek diğer yazılar" align="left" className="mb-14" />
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
