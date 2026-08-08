import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Providers from "@/providers";
import { PageTransition } from "@/components/ds/motion/PageTransition";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1C3322",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanaamniscoconut.com";
const SITE_DESCRIPTION =
  "Sana Amnis coconut products made in Nigeria from Nigerian, home-grown coconuts — coconut water, milk powder, oils, flour, flakes, poundo and body care.";
// Hosted with the site rather than hotlinked from Google Drive, which rate-limits
// and cannot be relied on by social crawlers.
const SOCIAL_IMAGE = "/products/range-full-dark.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  title: {
    default: "Sana Amnis | Nigerian Coconut Water, Milk & Cold-Pressed Oil",
    template: "%s | Sana Amnis",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "coconut water nigeria",
    "cold pressed coconut oil",
    "coconut milk powder",
    "coconut flour",
    "coconut oil lagos",
    "sana amnis",
  ],
  authors: [{ name: "Sana Amnis" }],
  openGraph: {
    title: "Sana Amnis | Nigerian Coconut Water, Milk & Cold-Pressed Oil",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Sana Amnis",
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 2000,
        height: 1331,
        alt: "The Sana Amnis range of coconut products",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sana Amnis | Nigerian Coconut Water, Milk & Cold-Pressed Oil",
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sana Amnis",
  url: SITE_URL,
  logo: `${SITE_URL}/logo3.png`,
  description: SITE_DESCRIPTION,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "concierge@sanaamnis.com",
      areaServed: "NG",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${playfair.variable} antialiased bg-[#FAF8F5] text-[#161A17] min-h-screen flex flex-col selection:bg-[#C9A227] selection:text-[#161A17]`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
