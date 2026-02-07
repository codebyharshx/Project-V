import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  color: string;
  icon: string;
  slug: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
            isOpen: true,
          };
        }),

      removeItem: (id: number) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id: number, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== id),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          isOpen: false,
        }),

      toggleCart: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      totalItems: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      shipping: () => {
        const state = get();
        const subtotal = state.subtotal();
        return subtotal >= 50 ? 0 : 10;
      },

      total: () => {
        const state = get();
        return state.subtotal() + state.shipping();
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
      skipHydration: true,
    }
  )
);
