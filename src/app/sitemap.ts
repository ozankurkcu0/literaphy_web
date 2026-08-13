import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { blogPosts } from "@/content/blog";

const staticRoutes = [
  "",
  "/hizmetler",
  "/qr-menu-sistemleri",
  "/qr-menu-sistemleri/ozellikler",
  "/qr-menu-sistemleri/fiyatlandirma",
  "/qr-menu-sistemleri/demo",
  "/projeler",
  "/blog",
  "/hakkimizda",
  "/sss",
  "/iletisim",
  "/gizlilik-politikasi",
  "/kullanim-sartlari",
  "/kvkk-aydinlatma-metni",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/hizmetler/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projeler/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...projectEntries, ...blogEntries];
}
