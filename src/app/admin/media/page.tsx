"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { UploadCloud, Copy, Check, Search, Trash2, Loader2 } from "lucide-react";

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  kind: "image" | "video";
  bytes: number | null;
  width: number | null;
  height: number | null;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  return bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function AdminMediaLibraryPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => api<{ media: MediaAsset[] }>("/api/admin/media"),
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.set("file", file);
      return api("/api/admin/media", { method: "POST", body: form });
    },
    onSuccess: () => {
      toast.success("Uploaded");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (err: Error) => toast.error("Upload failed", err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (err: Error) => toast.error("Could not delete", err.message),
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const assets = mediaQuery.data?.media ?? [];
  const filtered = assets.filter((a) => a.filename.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">Media Library</h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Real uploads via Cloudinary — images and videos
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload.mutate(file);
        }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${
          isDraggingOver ? "border-primary bg-primary/5" : "border-neutral-800"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = "";
          }}
        />
        <UploadCloud className="w-6 h-6 text-neutral-500" aria-hidden="true" />
        <p className="text-xs text-neutral-400">Drag and drop an image or video here, or</p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
          className="flex items-center gap-2 rounded-none"
        >
          {upload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {upload.isPending ? "Uploading…" : "Browse files"}
        </Button>
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">JPEG, PNG, WebP, AVIF up to 8MB · MP4, WebM, MOV up to 80MB</p>
      </div>

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

      {mediaQuery.isLoading ? (
        <p className="text-xs text-neutral-500 py-10 text-center">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-800 text-neutral-500 text-xs">
          {assets.length === 0 ? "No uploads yet." : "Nothing matches your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((asset) => (
            <div key={asset.id} className="group bg-card border border-border/40 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-square overflow-hidden bg-neutral-900 flex items-center justify-center border-b border-border/20">
                {asset.kind === "video" ? (
                  <video src={asset.url} muted className="w-full h-full object-cover" />
                ) : (
                  <Image src={asset.url} alt={asset.filename} fill sizes="300px" className="object-cover" />
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-foreground truncate font-sans">{asset.filename}</p>
                  <p className="text-[10px] text-muted-foreground font-medium font-sans">
                    {asset.width && asset.height ? `${asset.width} x ${asset.height} • ` : ""}
                    {formatBytes(asset.bytes)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleCopy(asset.id, asset.url)} className="flex-1 flex items-center justify-center gap-1.5">
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirm(`Delete "${asset.filename}"?`) && remove.mutate(asset.id)}
                    className="text-destructive hover:bg-destructive/10 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
