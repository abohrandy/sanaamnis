"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  VideoIcon,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Video } from "./VideoExtension";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.set("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.media.url as string;
}

const TOOLBAR_BUTTON =
  "p-2 rounded-none text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer";
const TOOLBAR_BUTTON_ACTIVE = "bg-neutral-800 text-white";

/**
 * Full HTML editor for blog article body copy — replaces the old
 * blank-line-separated-paragraphs textarea. Content is stored as HTML in
 * blogPosts.content; src/lib/blog.ts detects and renders it directly, falling
 * back to the legacy plain-text parser for posts written before this existed.
 */
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const toast = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Video,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] max-h-[520px] overflow-y-auto p-4 text-sm text-white outline-none prose-invert [&_h2]:font-serif [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h3]:font-serif [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-700 [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:underline [&_a]:text-primary [&_img]:rounded-[1rem] [&_img]:my-3 [&_video]:my-3",
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0) return false;
        event.preventDefault();
        for (const file of files) {
          insertUploadedFile(file);
        }
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the editor in sync when the parent swaps which post is being edited
  // (opening a different row's "Edit" reuses the same mounted editor instance).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const insertUploadedFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      setIsUploading(true);
      try {
        const url = await uploadFile(file);
        if (file.type.startsWith("video/")) {
          editor.chain().focus().insertContent({ type: "video", attrs: { src: url } }).run();
        } else {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch (error) {
        toast.error("Could not upload the file", error instanceof Error ? error.message : undefined);
      } finally {
        setIsUploading(false);
      }
    },
    [editor, toast]
  );

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-neutral-800 bg-neutral-950">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-800 p-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("bold") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("italic") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("underline") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Underline">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("strike") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Strikethrough">
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-neutral-800 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 2 }) ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 3 }) ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("bulletList") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Bullet list">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("orderedList") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${TOOLBAR_BUTTON} ${editor.isActive("blockquote") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Quote">
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={addLink} className={`${TOOLBAR_BUTTON} ${editor.isActive("link") ? TOOLBAR_BUTTON_ACTIVE : ""}`} aria-label="Link">
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-neutral-800 mx-1" />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) insertUploadedFile(file);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => imageInputRef.current?.click()} className={TOOLBAR_BUTTON} aria-label="Insert image">
          <ImageIcon className="w-3.5 h-3.5" />
        </button>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) insertUploadedFile(file);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => videoInputRef.current?.click()} className={TOOLBAR_BUTTON} aria-label="Insert video">
          <VideoIcon className="w-3.5 h-3.5" />
        </button>

        {isUploading && <Loader2 className="w-3.5 h-3.5 text-neutral-400 animate-spin ml-1" />}

        <span className="flex-1" />

        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={TOOLBAR_BUTTON} aria-label="Undo">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={TOOLBAR_BUTTON} aria-label="Redo">
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <EditorContent editor={editor} />
      <p className="px-3 py-2 text-[10px] text-neutral-500 border-t border-neutral-800">
        Drag and drop an image or video anywhere in the text above to embed it.
      </p>
    </div>
  );
}
