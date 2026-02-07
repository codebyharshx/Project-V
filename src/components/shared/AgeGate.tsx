'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';

export function AgeGate() {
  const [hydrated, setHydrated] = useState(false);
  const { ageVerified, setAgeVerified } = useUIStore();

  useEffect(() => {
    // Wait a tick for store hydration to complete
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until hydrated
  if (!hydrated) {
    return null;
  }

  // If already verified, don't show
  if (ageVerified) {
    return null;
  }

  const handleVerify = () => {
    setAgeVerified(true);
  };

  const handleLeave = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500"
      style={{
        opacity: ageVerified ? 0 : 1,
        pointerEvents: ageVerified ? 'none' : 'auto',
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-cream px-8 py-12 text-center shadow-2xl">
        {/* Logo */}
        <div className="mb-6 text-4xl font-bold tracking-wider text-charcoal">
          VELORIOUS
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-serif font-bold text-charcoal">
          Welcome
        </h1>

        {/* Age Verification Text */}
        <p className="mb-8 text-sm text-charcoal/70 leading-relaxed">
          You must be at least 18 years old to enter this website. By clicking
          "I'm 18+", you confirm that you are 18 or older and agree to our terms
          of service.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleVerify}
            className="flex-1 rounded-lg bg-sage px-6 py-3 font-medium text-cream transition-all hover:bg-sage-dark hover:shadow-lg active:scale-95"
          >
            I'm 18+
          </button>
          <button
            onClick={handleLeave}
            className="flex-1 rounded-lg border-2 border-charcoal px-6 py-3 font-medium text-charcoal transition-all hover:bg-charcoal/5 active:scale-95"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
