"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/lib/i18n";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hydrate Zustand stores on client
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useUIStore.persist.rehydrate();
  }, []);

  return (
    <SessionProvider>
      <I18nProvider>{children}</I18nProvider>
    </SessionProvider>
  );
}
