"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export interface InstagramEmbedProps {
  url: string;
  className?: string;
}

/** Renders an Instagram post/reel via Instagram's own oEmbed script — the
 * blockquote is the fallback markup Instagram's docs specify; embed.js
 * replaces it with the real iframe once it loads. */
export function InstagramEmbed({ url, className }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');

    const process = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      process();
    } else if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.addEventListener("load", process);
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div ref={containerRef} className={className}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ margin: "0 auto", maxWidth: 540, width: "100%" }}
      />
    </div>
  );
}
