"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export interface MediaDropzoneProps {
  /** Current image/video URL, or empty string when nothing is set. */
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime";

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/**
 * Drag-and-drop (or click-to-browse) uploader for a single image/video field —
 * used in place of a raw "paste a URL" text input in the recipe and blog admin
 * forms. Uploads through the same /api/admin/media Cloudinary route the Media
 * Library page uses, then hands the resulting URL back via onChange.
 */
export function MediaDropzone({ value, onChange, accept = DEFAULT_ACCEPT, label = "Image or video" }: MediaDropzoneProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.media.url as string);
    } catch (error) {
      toast.error("Could not upload the file", error instanceof Error ? error.message : undefined);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">{label}</label>

      {value ? (
        <div className="relative rounded-none overflow-hidden border border-neutral-800 bg-neutral-950 h-40 flex items-center justify-center">
          {isVideoUrl(value) ? (
            <video src={value} muted controls className="h-full w-full object-contain" />
          ) : (
            <Image src={value} alt="" fill sizes="400px" className="object-contain" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
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
            if (file) upload(file);
          }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-40 border-2 border-dashed cursor-pointer transition-colors ${
            isDraggingOver ? "border-primary bg-primary/5" : "border-neutral-800 hover:border-neutral-700"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
              <p className="text-[10px] text-neutral-500">Uploading…</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 text-neutral-500" aria-hidden="true" />
              <p className="text-[10px] text-neutral-500 text-center px-4">
                Drag and drop, or click to browse — images or videos
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
