'use client';

import { Instagram, Music2, Pin, Youtube, Twitter } from 'lucide-react';
import { useTranslation, useI18n } from '@/lib/i18n';

export default function Footer() {
  const t = useTranslation();
  const { language, setLanguage } = useI18n();

  const SHOP_LINKS = [
    { href: '/shop', label: t.footer.allProducts },
    { href: '/shop/bestsellers', label: t.footer.bestSellers },
    { href: '/shop/new', label: t.footer.newArrivals },
    { href: '/shop/gift-cards', label: t.footer.giftCards },
  ];

  const LEARN_LINKS = [
    { href: '/blog', label: t.footer.blog },
    { href: '/guides', label: t.footer.guides },
    { href: '/faq', label: t.footer.faq },
  ];

  const COMPANY_LINKS = [
    { href: '/about', label: t.footer.about },
    { href: '/contact', label: t.footer.contact },
    { href: '/careers', label: t.footer.careers },
  ];

  const LEGAL_LINKS = [
    { href: '/privacy', label: t.footer.privacyPolicy },
    { href: '/terms', label: t.footer.terms },
    { href: '/returns', label: t.footer.returns },
    { href: '/shipping', label: t.footer.shipping },
  ];

  return (
    <footer className="bg-charcoal text-cream">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4">
              <div className="flex items-center gap-0.5 mb-3">
                <span className="text-base font-serif font-semibold text-cream">
                  VELO
                </span>
                <span className="text-base font-serif font-semibold text-sage">
                  RIOUS
                </span>
              </div>
              <p className="text-xs text-cream/70 mb-4">
                {t.footer.description}
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setLanguage('de')}
                className={`text-xs px-2 py-1 rounded ${
                  language === 'de'
                    ? 'bg-sage text-white'
                    : 'bg-charcoal-light text-cream/70 hover:text-cream'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-1 rounded ${
                  language === 'en'
                    ? 'bg-sage text-white'
                    : 'bg-charcoal-light text-cream/70 hover:text-cream'
                }`}
              >
                EN
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-charcoal-light transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-charcoal-light transition-colors"
                aria-label="TikTok"
              >
                <Music2 size={18} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-charcoal-light transition-colors"
                aria-label="Pinterest"
              >
                <Pin size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-charcoal-light transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-charcoal-light transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-cream mb-3 text-[0.6875rem] uppercase tracking-wide">
              {t.footer.shop}
            </h3>
            <ul className="space-y-1.5">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs text-cream/70 hover:text-cream transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="font-semibold text-cream mb-3 text-[0.6875rem] uppercase tracking-wide">
              {t.footer.learn}
            </h3>
            <ul className="space-y-1.5">
              {LEARN_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs text-cream/70 hover:text-cream transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-cream mb-3 text-[0.6875rem] uppercase tracking-wide">
              {t.footer.company}
            </h3>
            <ul className="space-y-1.5">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs text-cream/70 hover:text-cream transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-cream mb-3 text-[0.6875rem] uppercase tracking-wide">
              {t.footer.legal}
            </h3>
            <ul className="space-y-1.5">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs text-cream/70 hover:text-cream transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal-light"></div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Copyright and Payment Methods */}
          <div className="space-y-2">
            <p className="text-[0.6875rem] text-cream/60">
              {t.footer.copyright}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[0.6875rem] text-cream/70 bg-charcoal-light px-2 py-1 rounded">
                Visa
              </span>
              <span className="text-[0.6875rem] text-cream/70 bg-charcoal-light px-2 py-1 rounded">
                Mastercard
              </span>
              <span className="text-[0.6875rem] text-cream/70 bg-charcoal-light px-2 py-1 rounded">
                PayPal
              </span>
              <span className="text-[0.6875rem] text-cream/70 bg-charcoal-light px-2 py-1 rounded">
                Klarna
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
