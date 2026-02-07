'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Shield, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function BrandStory() {
  const t = useTranslation();

  return (
    <section className="w-full bg-cream">
      {/* Story section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Image */}
          <div className="order-last lg:order-first">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-72 md:h-[22rem]">
              <Image
                src="https://picsum.photos/seed/brandstory/800/500"
                alt="Velorious"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-[1.75rem] lg:text-[2rem] font-playfair font-bold text-charcoal mb-4">
              {t.brandStory.title}
            </h2>

            <div className="space-y-3 font-inter text-charcoal/80 text-[0.9375rem] leading-relaxed mb-6">
              <p>
                {t.brandStory.description}
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sage font-inter font-semibold text-sm hover:text-sage/80 transition-colors duration-300 group"
            >
              {t.brandStory.learnMore}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-sage/5 border-t border-sage/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quality */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <Shield size={24} className="text-gold" />
              </div>
              <h4 className="text-base font-playfair font-bold text-charcoal mb-2">
                {t.brandStory.quality}
              </h4>
              <p className="font-inter text-charcoal/70 text-[0.8125rem] leading-relaxed">
                {t.brandStory.qualityDesc}
              </p>
            </div>

            {/* Privacy */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blush/20 rounded-full flex items-center justify-center mb-4">
                <Heart size={24} className="text-blush" />
              </div>
              <h4 className="text-base font-playfair font-bold text-charcoal mb-2">
                {t.brandStory.privacy}
              </h4>
              <p className="font-inter text-charcoal/70 text-[0.8125rem] leading-relaxed">
                {t.brandStory.privacyDesc}
              </p>
            </div>

            {/* Community */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mb-4">
                <Users size={24} className="text-sage" />
              </div>
              <h4 className="text-base font-playfair font-bold text-charcoal mb-2">
                {t.brandStory.community}
              </h4>
              <p className="font-inter text-charcoal/70 text-[0.8125rem] leading-relaxed">
                {t.brandStory.communityDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
