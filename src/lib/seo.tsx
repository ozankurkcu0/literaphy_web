import type { Metadata } from "next";
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/constants";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Small label rendered above the title on the generated social-share image (e.g. "Hizmet", "Blog"). */
  ogEyebrow?: string;
}

export function buildMetadata({ title, description, path, keywords, ogEyebrow }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;

  const ogImageParams = new URLSearchParams({ title });
  if (ogEyebrow) ogImageParams.set("eyebrow", ogEyebrow);
  const ogImage = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-icon.png`,
    description: SITE_DESCRIPTION,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kartepe",
      addressRegion: "Kocaeli",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: CONTACT.phone,
      email: CONTACT.email,
      areaServed: "TR",
      availableLanguage: ["tr"],
    },
    // SOCIAL_LINKS doğrulanmış gerçek hesaplar içerdiğinde otomatik dolar —
    // bkz. constants.ts'deki not (placeholder handle'lar SEO denetiminde
    // kaldırıldı, yanlış üçüncü şahıs profillerine işaret ediyorlardı).
    ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS.map((s) => s.href) } : {}),
  };
}

// "literaphy" aratıldığında Google'ın markayı tek bir varlığa (www.literaphy.com)
// bağlaması için Organization'ın yanına WebSite şeması eklendi — @id ile
// Organization'a referans veriyor, böylece ikisi aynı knowledge graph
// düğümünde birleşiyor. Eski/yanlış bir vercel.app kopyasının aynı markayla
// eşleşme ihtimalini azaltır.
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "TR",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    datePublished: input.datePublished,
    author: { "@type": "Person", name: input.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-icon.png` },
    },
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  path: string;
  price: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: input.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${input.path}`,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
