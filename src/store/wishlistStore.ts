import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Saved items.
 *
 * Previously every grid kept its own `wishlistIds` in local component state, so a
 * heart toggled on /shop was invisible to the drawer in the header and vanished on
 * navigation. One persisted store fixes both.
 */
export interface WishlistItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const items = get().items;
        set({
          items: items.some((i) => i.productId === item.productId)
            ? items.filter((i) => i.productId !== item.productId)
            : [...items, item],
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: "sana-amnis-wishlist", version: 1 }
  )
);
