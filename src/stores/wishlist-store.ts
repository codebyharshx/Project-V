import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistStore = {
  items: number[];
  toggleItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId: number) =>
        set((state) => {
          const exists = state.items.includes(productId);
          return {
            items: exists
              ? state.items.filter((id) => id !== productId)
              : [...state.items, productId],
          };
        }),

      isInWishlist: (productId: number) => {
        const state = get();
        return state.items.includes(productId);
      },

      clearWishlist: () =>
        set({
          items: [],
        }),
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
    }
  )
);
