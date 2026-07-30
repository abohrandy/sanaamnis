"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * Without this, any thrown error rendered Next's bare white 500 document — which
 * is exactly what customers were hitting on every product page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center px-6 py-24 font-sans">
      <div className="max-w-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F3EFE8] border border-[#E2E6E3] flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7 text-[#8C531B] stroke-[1.4]" />
        </div>

        <h1 className="font-serif text-3xl font-medium text-[#161A17] tracking-tight">
          Something went wrong at our end
        </h1>

        <p className="text-sm text-[#676E6A] leading-relaxed">
          This is our fault, not yours. Try again in a moment — and if it keeps
          happening, let us know and we will look into it.
        </p>

        {error.digest && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#676E6A]/70">
            Reference {error.digest}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            variant="botanical"
            size="lg"
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
