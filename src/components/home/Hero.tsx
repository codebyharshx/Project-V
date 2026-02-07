'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function Hero() {
  const t = useTranslation();

  return (
    <section className="relative w-full min-h-[55vh] bg-gradient-to-br from-cream via-cream to-blush/10 overflow-visible pt-20">
      {/* Main content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[55vh] px-6 lg:px-12 py-20 lg:py-8">
        {/* Text content */}
        <div className="max-w-xl">
          {/* Headline */}
          <h1 className="text-[1.75rem] md:text-4xl lg:text-[2.5rem] font-playfair font-bold text-charcoal mb-2 leading-tight">
            {t.hero.headline1}
            <br />
            <span className="text-sage">{t.hero.headline2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-charcoal/80 mb-5 font-inter leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link
              href="/shop"
              className="px-5 py-2 bg-sage text-cream font-inter font-semibold text-[0.8125rem] rounded-lg hover:bg-sage/90 transition-colors duration-300 text-center"
            >
              {t.hero.shopCollection}
            </Link>
            <Link
              href="/about"
              className="px-5 py-2 border-2 border-sage text-sage font-inter font-semibold text-[0.8125rem] rounded-lg hover:bg-sage/5 transition-colors duration-300 text-center"
            >
              {t.hero.ourStory}
            </Link>
          </div>
        </div>

        {/* Hero Visual Panel - Desktop only */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-[320px] mx-auto bg-gradient-to-br from-sage/[0.08] via-blush/[0.08] to-gold/[0.06] border border-sage/20 rounded-2xl p-5 backdrop-blur-sm">
            {/* Decorative blurs */}
            <div className="absolute -top-3 -left-3 w-[60px] h-[60px] bg-sage/10 rounded-full blur-[20px] -z-10"></div>
            <div className="absolute -bottom-3 -right-3 w-[80px] h-[80px] bg-blush/10 rounded-full blur-[20px] -z-10"></div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-semibold text-sage-dark mb-3">
              <span className="w-1.5 h-1.5 bg-sage rounded-full"></span>
              {t.hero.curatedForYou}
            </div>

            {/* Feature tiles */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-gradient-to-br from-sage/[0.15] to-sage/[0.05] border border-sage/[0.12] rounded-xl flex flex-col items-center justify-center py-3 px-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <span className="text-[1.75rem] mb-1">🌿</span>
                <span className="text-[10px] font-medium text-charcoal/60">{t.hero.bodySafe}</span>
              </div>
              <div className="bg-gradient-to-br from-blush/[0.15] to-blush/[0.05] border border-blush/[0.12] rounded-xl flex flex-col items-center justify-center py-3 px-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <span className="text-[1.75rem] mb-1">💝</span>
                <span className="text-[10px] font-medium text-charcoal/60">{t.hero.selfLove}</span>
              </div>
              <div className="bg-gradient-to-br from-gold/[0.15] to-gold/[0.05] border border-gold/[0.12] rounded-xl flex flex-col items-center justify-center py-3 px-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <span className="text-[1.75rem] mb-1">📦</span>
                <span className="text-[10px] font-medium text-charcoal/60">{t.hero.discreet}</span>
              </div>
              <div className="bg-gradient-to-br from-sage/[0.12] to-blush/[0.08] border border-sage/[0.1] rounded-xl flex flex-col items-center justify-center py-3 px-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <span className="text-[1.75rem] mb-1">✨</span>
                <span className="text-[10px] font-medium text-charcoal/60">{t.hero.premium}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
