"use client";

import { useEffect } from "react";

export interface ShortcutHandlers {
  onSearch?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onSearch, onEscape }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + K or CTRL + K -> Search trigger
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearch?.();
      }

      // ESC -> Escape trigger
      if (e.key === "Escape") {
        onEscape?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onEscape]);
}
