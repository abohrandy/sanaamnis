import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Script from "next/script";
import Providers from "@/providers";
import { PageTransition } from "@/components/ds/motion/PageTransition";
import "./globals.css";

const META_PIXEL_ID = "28070160635956900";

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
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
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
      email: "info@sanaamniscoconut.com",
      areaServed: "NG",
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "communitymart@gmail.com",
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
