'use client';

import { useTranslation } from '@/lib/i18n';
import { Heart, Shield, Sparkles } from 'lucide-react';

export default function PressBar() {
  const t = useTranslation();

  const values = [
    { icon: Shield, label: t.trust.bodySafeMaterials },
    { icon: Heart, label: t.brandStory.quality },
    { icon: Sparkles, label: t.hero.premium },
  ];

  return (
    <section className="w-full border-t border-b border-charcoal/10 bg-cream/50 py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-charcoal/70 font-inter font-medium text-xs tracking-wide"
              >
                <Icon size={16} className="text-sage" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
