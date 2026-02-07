'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function PromoBanner() {
  const t = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-cream h-8 flex items-center justify-center">
      <div className="flex items-center justify-center gap-2 text-[0.6875rem] font-medium">
        <span>{t.promo.freeShipping}</span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss promo banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
