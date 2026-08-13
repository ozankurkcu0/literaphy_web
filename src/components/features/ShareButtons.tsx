"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shareLinks = [
    {
      label: "X'te paylaş",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn'de paylaş",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex flex-row gap-3 lg:flex-col">
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="flex size-11 items-center justify-center rounded-full border border-hairline text-foreground-muted transition-colors duration-150 hover:border-strong hover:text-foreground"
          >
            <Icon className="size-4" aria-hidden />
          </a>
        );
      })}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Bağlantıyı kopyala"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-foreground-muted transition-colors duration-150 hover:border-strong hover:text-foreground"
      >
        {copied ? <Check className="size-4 text-success" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
