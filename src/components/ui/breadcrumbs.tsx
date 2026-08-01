import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanaamniscoconut.com";

export function Breadcrumbs({ className, items, ...props }: BreadcrumbsProps) {
  // Every page that renders visual breadcrumbs gets matching BreadcrumbList
  // structured data for free — Google shows this as a breadcrumb trail in
  // search results instead of a raw URL. The final crumb (the current page)
  // omits `item`, which is valid per Google's guidance for the last entry.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <nav className={cn("flex items-center text-[10px] uppercase tracking-widest text-muted-foreground", className)} {...props}>
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                {isLast || !item.href ? (
                  <span className="text-foreground font-semibold">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
