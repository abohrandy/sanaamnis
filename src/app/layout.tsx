import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Providers from "@/providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Sana Amnis | Premium CMS eCommerce",
  description: "A state-of-the-art production-grade eCommerce experience powered by Next.js 15, Drizzle ORM, and Better Auth.",
  keywords: ["ecommerce", "luxury store", "nextjs", "better-auth", "drizzle", "paystack"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
