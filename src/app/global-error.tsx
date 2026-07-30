"use client";

import React, { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 *
 * Replaces the whole document, so it cannot rely on app styles or shared
 * components — everything here is inline on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
          color: "#161A17",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9A227",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Sana Amnis
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 500,
              color: "#1C3322",
              margin: "16px 0 12px",
            }}
          >
            The site is having a moment
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#676E6A", margin: "0 0 24px" }}>
            Something failed while loading the page. Reloading usually fixes it.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1C3322",
              color: "#FAF8F5",
              border: 0,
              borderRadius: 8,
              padding: "14px 28px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
