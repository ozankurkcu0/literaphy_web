import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { organizationJsonLd, JsonLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Yazılım, Otomasyon ve Dijital Büyüme Ortağınız`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "yazılım geliştirme",
    "web tasarım",
    "AI otomasyon",
    "WhatsApp otomasyonu",
    "API entegrasyonu",
    "QR menü sistemi",
    "Literaphy",
  ],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <MotionConfig reducedMotion="user">
          <SkipLink />
          <JsonLd data={organizationJsonLd()} />
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
