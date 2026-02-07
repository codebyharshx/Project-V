'use client';

import { usePathname } from 'next/navigation';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { useTranslation } from '@/lib/i18n';

export default function Navbar() {
  const t = useTranslation();
  const pathname = usePathname();
  const [scrollShadow, setScrollShadow] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const cartItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  const NAV_LINKS = [
    { href: '/shop', label: t.nav.shop },
    { href: '/blog', label: t.nav.blog },
    { href: '/community', label: t.nav.community },
    { href: '/about', label: t.nav.about },
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollShadow(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-8 left-0 right-0 z-40 bg-cream/95 backdrop-blur-sm transition-shadow duration-200 ${
        scrollShadow ? 'shadow-sm' : ''
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-0.5">
            <span className="text-base sm:text-lg font-serif font-semibold text-charcoal tracking-tight">
              VELO
            </span>
            <span className="text-base sm:text-lg font-serif font-semibold text-sage tracking-tight">
              RIOUS
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname?.startsWith(href);
              return (
                <a
                  key={href}
                  href={href}
                  className={`text-[0.8125rem] font-medium transition-all duration-300 relative pb-1 ${
                    isActive
                      ? 'text-charcoal'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage"></div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => toggleSearch()}
              className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-charcoal" />
            </button>

            <a
              href="/wishlist"
              className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors hidden sm:block"
              aria-label={t.nav.wishlist}
            >
              <Heart size={20} className="text-charcoal" />
            </a>

            <a
              href="/admin/login"
              className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors hidden sm:block"
              aria-label={t.nav.account}
            >
              <User size={20} className="text-charcoal" />
            </a>

            {/* Shopping Bag */}
            <button
              onClick={() => toggleCart()}
              className="relative p-1.5 hover:bg-cream-dark rounded-lg transition-colors"
              aria-label={t.nav.cart}
            >
              <ShoppingBag size={20} className="text-charcoal" />
              {hasMounted && cartItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-blush text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItems > 9 ? '9+' : cartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => toggleMobileNav()}
              className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-charcoal" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
