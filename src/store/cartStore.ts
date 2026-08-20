import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  sku: string;
  name: string;      // e.g. "XL / Black"
  title: string;     // e.g. "Amnis Cashmere Coat"
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

/** One component of a bundle, at its per-set quantity (before multiplying by the bundle's own quantity). */
export interface CartBundleComponent {
  variantId: string;
  sku: string;
  productTitle: string;
  variantName: string;
  quantity: number;
}

export interface CartBundle {
  bundleId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  items: CartBundleComponent[];
}

interface CartState {
  items: CartItem[];
  bundles: CartBundle[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  addBundle: (bundle: Omit<CartBundle, "quantity">, quantity?: number) => void;
  removeBundle: (bundleId: string) => void;
  updateBundleQuantity: (bundleId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      bundles: [],
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, item.stock);
          set({
            items: currentItems.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: Math.min(quantity, item.stock) }],
          });
        }
      },
      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
      },
      updateQuantity: (variantId, quantity) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;
        const targetQuantity = Math.max(1, Math.min(quantity, item.stock));
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: targetQuantity } : i
          ),
        });
      },
      addBundle: (bundle, quantity = 1) => {
        const currentBundles = get().bundles;
        const existing = currentBundles.find((b) => b.bundleId === bundle.bundleId);

        if (existing) {
          set({
            bundles: currentBundles.map((b) =>
              b.bundleId === bundle.bundleId ? { ...b, quantity: b.quantity + quantity } : b
            ),
          });
        } else {
          set({ bundles: [...currentBundles, { ...bundle, quantity }] });
        }
      },
      removeBundle: (bundleId) => {
        set({ bundles: get().bundles.filter((b) => b.bundleId !== bundleId) });
      },
      updateBundleQuantity: (bundleId, quantity) => {
        const targetQuantity = Math.max(1, quantity);
        set({
          bundles: get().bundles.map((b) =>
            b.bundleId === bundleId ? { ...b, quantity: targetQuantity } : b
          ),
        });
      },
      clearCart: () => set({ items: [], bundles: [] }),
      getTotalAmount: () => {
        const itemsTotal = get().items.reduce((total, item) => total + item.price * item.quantity, 0);
        const bundlesTotal = get().bundles.reduce((total, b) => total + b.price * b.quantity, 0);
        return itemsTotal + bundlesTotal;
      },
      getTotalItems: () => {
        const itemsCount = get().items.reduce((total, item) => total + item.quantity, 0);
        const bundlesCount = get().bundles.reduce((total, b) => total + b.quantity, 0);
        return itemsCount + bundlesCount;
      },
    }),
    {
      name: "sana-amnis-cart-storage",
      // v2: variant ids became real UUIDs matching product_variants.id. Carts saved
      // before that hold placeholder ids like "v1-250" which no longer resolve to a
      // product, so they are dropped rather than failing silently at checkout.
      // v3: added bundles — older carts persisted before it existed have no such key.
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as Partial<CartState> | undefined;
        if (!state?.items) return persisted as CartState;
        let migrated = state;
        if (version < 2) {
          migrated = {
            ...migrated,
            items: migrated.items!.filter((i) => UUID_RE.test(i.variantId)),
          };
        }
        if (version < 3) {
          migrated = { ...migrated, bundles: migrated.bundles ?? [] };
        }
        return migrated as CartState;
      },
    }
  )
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
