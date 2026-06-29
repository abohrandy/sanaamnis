import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Error404Props {
  className?: string;
  homeUrl?: string;
}

export function Error404({ className, homeUrl = "/" }: Error404Props) {
  return (
    <div
      className={cn(
        "min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-background text-foreground",
        className
      )}
    >
      <div className="space-y-6 max-w-md">
        <h1 className="font-serif text-8xl font-bold tracking-tighter text-primary/30">
          404
        </h1>
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Object Not Found
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
            Lost in Minimalism
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans max-w-sm mx-auto">
            The page catalog index you are trying to browse is unavailable. It may have been archived or deleted.
          </p>
        </div>

        <div className="pt-6 flex justify-center">
          <Link
            href={homeUrl}
            className="px-6 py-3 border border-foreground text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 rounded-none shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
