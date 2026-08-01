import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with Sana Amnis for wholesale, distribution or general product questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
