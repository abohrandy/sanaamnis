"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Copy, Check, Search, Trash2 } from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
}

const INITIAL_ASSETS: MediaAsset[] = [
  { id: "1", name: "amnis_coat_camel.jpg", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600", size: "342 KB", dimensions: "1200 x 1600" },
  { id: "2", name: "linen_kimono_ivory.jpg", url: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600", size: "215 KB", dimensions: "1000 x 1300" },
  { id: "3", name: "knitwear_model_black.jpg", url: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600", size: "410 KB", dimensions: "1200 x 1600" },
];

export default function AdminMediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_ASSETS);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
            Media Library
          </h1>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
            Manage Cloudinary Digital Assets & Optimizations
          </p>
        </div>
        <Button className="flex items-center gap-2 rounded-none self-start sm:self-auto">
          <UploadCloud className="w-4 h-4" />
          Upload New Asset
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex gap-4 items-center max-w-md bg-card border border-border/40 px-4 py-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search media library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-hidden border-0 text-foreground font-sans text-xs uppercase tracking-wider"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group bg-card border border-border/40 overflow-hidden flex flex-col justify-between"
          >
            {/* Image display */}
            <div className="relative aspect-square overflow-hidden bg-neutral-900 flex items-center justify-center border-b border-border/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta info */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-foreground truncate font-sans">{asset.name}</p>
                <p className="text-[10px] text-muted-foreground font-medium font-sans">
                  {asset.dimensions} • {asset.size}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(asset.id)}
                  className="text-destructive hover:bg-destructive/10 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
