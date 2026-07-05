'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, WeightOption } from '@/src/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, weight: WeightOption, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  hasItem: (productId: string, weight: WeightOption) => boolean;
}

const buildId = (productId: string, weight: WeightOption) =>
  `${productId}__${weight}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (product, weight, quantity = 1) => {
        const id = buildId(product.id, weight);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          const item: CartItem = {
            id,
            productId: product.id,
            name: product.name,
            weight,
            quantity,
            image: product.image,
            pricePerKg: product.pricePerKg,
          };
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      hasItem: (productId, weight) =>
        get().items.some((i) => i.id === buildId(productId, weight)),
    }),
    {
      name: 'gao-thanh-thuy-quote-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function formatQuoteMessage(items: CartItem[]): string {
  const header =
    'Chào Gạo Thanh Thủy, tôi muốn nhận báo giá sỉ cho các sản phẩm sau:';
  const lines = items.map((i) => `- ${i.name} - ${i.weight} x ${i.quantity}`);
  return [header, ...lines].join('\n');
}
