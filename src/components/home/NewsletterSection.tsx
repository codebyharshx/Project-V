'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function NewsletterSection() {
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-6 md:py-10 px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage via-sage to-sage/90"></div>

      {/* Content */}
      <div className="relative z-10 max-w-[40rem] mx-auto text-center">
        <h2 className="text-2xl md:text-[1.75rem] lg:text-[2rem] font-playfair font-bold text-white mb-2">
          {t.newsletter.title}
        </h2>

        <p className="text-white/90 font-inter text-[0.9375rem] mb-6 leading-relaxed">
          {t.newsletter.subtitle}
        </p>

        {/* Newsletter form */}
        {success ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle size={24} className="text-white" />
              <h3 className="text-lg font-playfair font-bold text-white">
                Welcome to Velorious!
              </h3>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-[1.125rem] h-[1.125rem]" />
                <input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white text-charcoal placeholder:text-charcoal/50 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gold hover:bg-gold/90 disabled:bg-gold/70 text-charcoal font-inter font-semibold text-sm rounded-lg transition-colors duration-300 whitespace-nowrap"
              >
                {loading ? '...' : t.newsletter.subscribe}
              </button>
            </div>
            {error && (
              <p className="text-white/80 text-xs mt-2 font-inter">{error}</p>
            )}
          </form>
        )}

        {/* Privacy note */}
        <p className="text-white/70 font-inter text-[0.6875rem] leading-relaxed">
          {t.newsletter.privacy}
        </p>
      </div>
    </section>
  );
}
