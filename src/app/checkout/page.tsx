'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { items, clearCart, subtotal, shipping, total } = useCartStore((state) => ({
    items: state.items,
    clearCart: state.clearCart,
    subtotal: state.subtotal(),
    shipping: state.shipping(),
    total: state.total(),
  }));

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/shop');
    }
  }, [mounted, items.length, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Prepare items for checkout
      const checkoutItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      // Call our checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create checkout session');
        setIsLoading(false);
        return;
      }

      if (!data.url) {
        setError('Failed to get checkout URL');
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="w-full min-h-screen bg-cream">
        <div className="px-6 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-96 bg-warm-gray/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return null; // Router will redirect
  }

  return (
    <main className="w-full min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-inter text-charcoal/60">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-charcoal transition-colors">
              Shopping Cart
            </Link>
            <span>/</span>
            <span className="text-charcoal">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal">
            Checkout
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Left Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Email Section */}
              <div className="bg-white rounded-lg border border-border p-8">
                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                  Contact Information
                </h2>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-inter font-semibold text-charcoal mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg font-inter text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-charcoal/60 font-inter mt-2">
                    We'll send your order confirmation and shipping updates to this email.
                  </p>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg border border-border p-8">
                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-2">
                  Shipping Details
                </h2>
                <p className="text-sm text-charcoal/60 font-inter mb-6">
                  Shipping address will be collected securely on the next step with Stripe.
                </p>

                <div className="bg-sage/10 border border-sage/30 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 size={20} className="text-sage flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-inter text-charcoal">
                      <span className="font-semibold">We ship to 15 European countries:</span> Germany, France, UK, Netherlands, Belgium, Austria, Italy, Spain, Sweden, Denmark, Finland, Norway, Ireland, Portugal, and Switzerland.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-inter text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-sage hover:bg-sage-dark disabled:bg-sage/50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-playfair font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Proceed to Secure Payment
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-border p-4 text-center">
                  <div className="text-sage font-bold text-2xl mb-2">🔒</div>
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    Secure Payment
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-border p-4 text-center">
                  <div className="text-sage font-bold text-2xl mb-2">🛡️</div>
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    SSL Encrypted
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-border p-4 text-center">
                  <div className="text-sage font-bold text-2xl mb-2">✓</div>
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    Stripe Protected
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-cream rounded-lg border border-border/50 p-6 space-y-2 text-sm font-inter text-charcoal/70">
                <p>
                  <span className="font-semibold">Discreet Packaging:</span> Your order will arrive in unmarked, discreet packaging for your privacy.
                </p>
                <p>
                  <span className="font-semibold">30-Day Returns:</span> Not satisfied? Return any product within 30 days for a full refund.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-8 sticky top-20">
              <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 pb-6 border-b border-border max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream border border-border">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sage" />
                        )}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <p className="text-sm font-inter font-semibold text-charcoal line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-charcoal/60 font-inter mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-playfair font-bold text-charcoal mt-2">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Lines */}
              <div className="space-y-4 py-6 border-b border-border">
                <div className="flex justify-between font-inter text-charcoal/70">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-inter text-charcoal/70">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-sage font-semibold">Free</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-sage font-semibold">
                    ✓ You qualify for free shipping!
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-6">
                <div className="flex justify-between mb-4">
                  <span className="font-playfair font-bold text-charcoal">
                    Total
                  </span>
                  <span className="font-playfair font-bold text-charcoal text-2xl">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
