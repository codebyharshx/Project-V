'use client';

import { useUIStore } from '@/stores/ui-store';
import { X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Journal' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'Our Story' },
];

export default function MobileNav() {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);

  if (!mobileNavOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={() => toggleMobileNav()}
      />

      {/* Slide-out Nav */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-cream z-50 md:hidden transition-transform duration-300 transform ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-xl font-semibold text-charcoal">Menu</h2>
          <button
            onClick={() => toggleMobileNav()}
            className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-charcoal" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col py-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => toggleMobileNav()}
              className="px-4 py-3 font-serif text-lg text-charcoal hover:bg-cream-dark transition-colors border-b border-border/50"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Additional Links */}
        <div className="border-t border-border px-4 py-4 space-y-2">
          <a href="/account" className="block text-sm text-charcoal/70 hover:text-charcoal py-2">
            Account
          </a>
          <a href="/wishlist" className="block text-sm text-charcoal/70 hover:text-charcoal py-2">
            Wishlist
          </a>
        </div>
      </div>
    </>
  );
}
