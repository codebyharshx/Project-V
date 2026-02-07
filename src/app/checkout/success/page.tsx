'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

interface OrderData {
  id: number;
  stripeSessionId: string;
  email: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Record<string, any>;
  billingName: string;
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product?: {
      id: number;
      name: string;
      imageUrl?: string | null;
    };
  }>;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Clear cart on mount
  useEffect(() => {
    setMounted(true);
    clearCart();
  }, [clearCart]);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
          setError('No session ID found');
          setIsLoading(false);
          return;
        }

        // Fetch order from API using session ID
        const response = await fetch(`/api/orders/session/${sessionId}`);

        if (!response.ok) {
          setError('Could not load order details');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data.order);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchOrder();
    }
  }, [mounted, searchParams]);

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

  return (
    <main className="w-full min-h-screen bg-cream">
      {/* Success Animation Background */}
      <style>{`
        @keyframes confetti-fall {
          to {
            opacity: 0;
            transform: translateY(100px) rotate(360deg);
          }
        }
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          pointer-events: none;
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-inter text-charcoal/60">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-charcoal">Order Confirmed</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            // Loading State
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-full mb-6 animate-pulse">
                <CheckCircle2 size={32} className="text-sage/50" />
              </div>
              <p className="text-charcoal/60 font-inter">
                Loading your order details...
              </p>
            </div>
          ) : error || !order ? (
            // Error State
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-playfair font-bold text-charcoal mb-3">
                {error || 'Order Not Found'}
              </h2>
              <p className="text-charcoal/60 font-inter mb-8">
                We couldn't retrieve your order details. Please check your email for confirmation or contact support.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-sage hover:bg-sage-dark text-white px-8 py-4 rounded-lg font-playfair font-semibold transition-colors duration-300"
              >
                Return Home
              </Link>
            </div>
          ) : (
            // Success State
            <div className="space-y-8">
              {/* Success Header */}
              <div className="bg-white rounded-lg border border-border p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-sage/10 rounded-full mb-6">
                  <CheckCircle2 size={48} className="text-sage" />
                </div>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-3">
                  Order Confirmed!
                </h1>
                <p className="text-lg text-charcoal/70 font-inter mb-6">
                  Thank you for your purchase. We're preparing your order.
                </p>
                <p className="text-sm text-charcoal/60 font-inter">
                  Order confirmation has been sent to <span className="font-semibold">{order.email}</span>
                </p>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Number */}
                <div className="bg-white rounded-lg border border-border p-6">
                  <p className="text-sm text-charcoal/60 font-inter mb-2">
                    Order Number
                  </p>
                  <p className="text-2xl font-playfair font-bold text-charcoal">
                    #{order.id}
                  </p>
                </div>

                {/* Order Date */}
                <div className="bg-white rounded-lg border border-border p-6">
                  <p className="text-sm text-charcoal/60 font-inter mb-2">
                    Order Date
                  </p>
                  <p className="text-lg font-playfair font-bold text-charcoal">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white rounded-lg border border-border p-8">
                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                  Items Ordered
                </h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                    >
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream border border-border">
                          {item.product?.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sage" />
                          )}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <p className="text-lg font-playfair font-bold text-charcoal">
                          {item.product?.name || `Product #${item.productId}`}
                        </p>
                        <p className="text-sm text-charcoal/60 font-inter mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      {/* Item Price */}
                      <div className="text-right">
                        <p className="text-lg font-playfair font-bold text-charcoal">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
                <div className="bg-white rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                    Shipping Address
                  </h2>

                  <div className="flex gap-4">
                    <Package className="text-sage flex-shrink-0 mt-1" size={24} />
                    <div className="text-charcoal/70 font-inter space-y-1">
                      {order.shippingAddress.line1 && (
                        <p>{order.shippingAddress.line1}</p>
                      )}
                      {order.shippingAddress.line2 && (
                        <p>{order.shippingAddress.line2}</p>
                      )}
                      {order.shippingAddress.city && (
                        <p>
                          {order.shippingAddress.city}
                          {order.shippingAddress.postal_code &&
                            `, ${order.shippingAddress.postal_code}`}
                        </p>
                      )}
                      {order.shippingAddress.country && (
                        <p className="font-semibold">
                          {order.shippingAddress.country.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-border p-8">
                <h2 className="text-xl font-playfair font-bold text-charcoal mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between font-inter text-charcoal/70">
                    <span>Subtotal</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-inter text-charcoal/70">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? (
                        <span className="text-sage font-semibold">Free</span>
                      ) : (
                        `€${order.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between">
                    <span className="font-playfair font-bold text-charcoal">
                      Total Paid
                    </span>
                    <span className="font-playfair font-bold text-charcoal text-2xl">
                      €{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-sage/10 rounded-lg border border-sage/30 p-8">
                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                  What's Next?
                </h2>

                <div className="space-y-4 font-inter text-charcoal/70">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sage text-white font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal mb-1">
                        Order Confirmation
                      </p>
                      <p className="text-sm">
                        Check your email for order confirmation and tracking information
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sage text-white font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal mb-1">
                        Discreet Packaging
                      </p>
                      <p className="text-sm">
                        Your order will arrive in unmarked, discreet packaging for your privacy
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sage text-white font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal mb-1">
                        Quick Delivery
                      </p>
                      <p className="text-sm">
                        Delivery typically takes 5-10 business days in Europe
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white py-4 px-6 rounded-lg font-playfair font-semibold transition-colors duration-300"
                >
                  Continue Shopping
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 border-2 border-sage text-sage hover:bg-sage/5 py-4 px-6 rounded-lg font-playfair font-semibold transition-colors duration-300"
                >
                  Return Home
                </Link>
              </div>

              {/* Support Info */}
              <div className="bg-cream rounded-lg border border-border/50 p-6 text-center text-sm font-inter text-charcoal/70">
                <p className="mb-2">
                  Questions about your order? Check your email for order confirmation or contact our support team.
                </p>
                <p>
                  <span className="font-semibold">30-Day Returns:</span> Not satisfied? Return any product within 30 days for a full refund.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
