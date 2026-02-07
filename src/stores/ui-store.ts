import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UIStore = {
  ageVerified: boolean;
  cookieConsented: boolean | null; // null = no choice made, true = accepted, false = declined
  searchOpen: boolean;
  mobileNavOpen: boolean;
  welcomePopupDismissed: boolean;
  productModalId: number | null;
  setAgeVerified: (verified: boolean) => void;
  setCookieConsented: (consented: boolean) => void;
  toggleSearch: () => void;
  toggleMobileNav: () => void;
  setWelcomePopupDismissed: (dismissed: boolean) => void;
  openProductModal: (productId: number) => void;
  closeProductModal: () => void;
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ageVerified: false,
      cookieConsented: null,
      searchOpen: false,
      mobileNavOpen: false,
      welcomePopupDismissed: false,
      productModalId: null,

      setAgeVerified: (verified: boolean) =>
        set({
          ageVerified: verified,
        }),

      setCookieConsented: (consented: boolean) =>
        set({
          cookieConsented: consented,
        }),

      toggleSearch: () =>
        set((state) => ({
          searchOpen: !state.searchOpen,
        })),

      toggleMobileNav: () =>
        set((state) => ({
          mobileNavOpen: !state.mobileNavOpen,
        })),

      setWelcomePopupDismissed: (dismissed: boolean) =>
        set({
          welcomePopupDismissed: dismissed,
        }),

      openProductModal: (productId: number) =>
        set({
          productModalId: productId,
        }),

      closeProductModal: () =>
        set({
          productModalId: null,
        }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        ageVerified: state.ageVerified,
        cookieConsented: state.cookieConsented,
        welcomePopupDismissed: state.welcomePopupDismissed,
      }),
      skipHydration: true,
    }
  )
);
