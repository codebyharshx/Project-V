'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const { cookieConsented, setCookieConsented } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show consent banner 2 seconds after mount (if no choice made yet)
  useEffect(() => {
    if (!mounted || cookieConsented !== null) return;

    const timer = setTimeout(() => {
      setShowConsent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [mounted, cookieConsented]);

  // Hide if not mounted, not showing, or user already made a choice
  if (!mounted || !showConsent || cookieConsented !== null) {
    return null;
  }

  const handleDecline = () => {
    setCookieConsented(false);
    setShowConsent(false);
  };

  const handleAccept = () => {
    setCookieConsented(true);
    setShowConsent(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t border-charcoal/10 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Text */}
          <div className="text-sm text-charcoal/70">
            <p className="font-medium text-charcoal mb-1">
              Cookie Preferences
            </p>
            <p>
              We use essential cookies to keep our site secure and functioning.
              We also use analytics cookies to understand how you interact with
              our site, so we can improve the experience.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="rounded-lg border border-charcoal/20 px-4 py-2 font-medium text-charcoal transition-all hover:bg-charcoal/5 active:scale-95 whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-sage px-4 py-2 font-medium text-cream transition-all hover:bg-sage-dark active:scale-95 whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
