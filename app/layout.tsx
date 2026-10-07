import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Sora } from "next/font/google";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { seo } from "@/content/site";
import { BRAND_NAME, INSTAGRAM_URL, SITE_URL } from "@/lib/constants";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.title, template: `%s — ${BRAND_NAME}` },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: BRAND_NAME,
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ec",
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  url: SITE_URL,
  ...(INSTAGRAM_URL && { sameAs: [INSTAGRAM_URL] }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable} ${manrope.variable} antialiased`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-forest"
        >
          Pular para o conteúdo
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <AnalyticsTracker />
      </body>
    </html>
  );
}
