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

export const metadata: Metadata = {
  metadataBase: new URL("https://sanaamnis.com"),
  title: {
    default: "Sana Amnis | Cold-Pressed Organic Coconut Elixirs & Luxury Lifestyle",
    template: "%s | Sana Amnis Sanctuary",
  },
  description: "Sana Amnis formulates 100% pure cold-pressed extra virgin coconut oil, bioactive coconut water, and bio-active lipid body care harvested from organic coastal groves.",
  keywords: ["cold pressed coconut oil", "organic coconut water", "luxury skincare", "single origin badagry", "lauric acid", "mct oil nigeria"],
  authors: [{ name: "Sana Amnis Botanical Laboratories" }],
  openGraph: {
    title: "Sana Amnis | Cold-Pressed Organic Coconut Elixirs & Luxury Lifestyle",
    description: "Cold-pressed extra virgin coconut oil and bioactive hydration harvested from organic Nigerian groves.",
    url: "https://sanaamnis.com",
    siteName: "Sana Amnis",
    images: [
      {
        url: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1200",
        width: 1200,
        height: 630,
        alt: "Sana Amnis Extra Virgin Coconut Oil",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sana Amnis | Cold-Pressed Organic Coconut Elixirs",
    description: "Cold-pressed extra virgin coconut oil and bioactive hydration harvested from organic Nigerian groves.",
    images: ["https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1200"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${playfair.variable} antialiased bg-[#FAF8F5] text-[#161A17] min-h-screen flex flex-col selection:bg-[#C9A227] selection:text-[#161A17]`}>
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}


