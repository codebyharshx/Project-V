"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PromoBanner from "./PromoBanner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AgeGate } from "@/components/shared/AgeGate";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { ToastContainer } from "@/components/shared/ToastContainer";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin area: no promo, navbar, footer, or overlays (clean shell)
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AgeGate />
      <CookieConsent />
      <CartDrawer />
      <SearchModal />
      <ToastContainer />
    </>
  );
}
