import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (src: string) => ReturnType;
    };
  }
}

/**
 * Minimal <video> block node — Tiptap ships an image extension but nothing for
 * video, and the CMS needs to let editors drop an uploaded clip straight into
 * article body copy the same way they drop in an image.
 */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes, { controls: "true", class: "w-full rounded-[1rem]" })];
  },

  addCommands() {
    return {
      setVideo:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    };
  },
});
