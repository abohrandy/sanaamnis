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

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
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
      clearCart: () => set({ items: [] }),
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "sana-amnis-cart-storage",
    }
  )
);
