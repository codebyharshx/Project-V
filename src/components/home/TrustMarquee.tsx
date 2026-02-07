'use client';

import { useTranslation } from '@/lib/i18n';
import {
  Heart,
  Package,
  RotateCcw,
  Users,
  Leaf,
  Lock,
} from 'lucide-react';

export default function TrustMarquee() {
  const t = useTranslation();

  const trustItems = [
    { label: t.trust.bodySafeMaterials, icon: Heart },
    { label: t.trust.discreetShipping, icon: Package },
    { label: t.trust.returns30Day, icon: RotateCcw },
    { label: t.trust.womenFounded, icon: Users },
    { label: t.trust.ecoFriendly, icon: Leaf },
    { label: t.trust.privacyFirst, icon: Lock },
  ];

  return (
    <section className="w-full bg-sage py-2 overflow-x-auto">
      <div className="flex items-center justify-center gap-6 md:gap-10 px-4 min-w-max mx-auto">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 text-white font-inter text-xs"
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
