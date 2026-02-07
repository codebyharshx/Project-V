import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

/**
 * Stripe Webhook Handler
 *
 * IMPORTANT: This route must have body parsing disabled to verify Stripe signature.
 * The raw request body is required for signature verification.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Find the order by session ID
        const order = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (!order) {
          console.warn(`Order not found for session ${session.id}`);
          return NextResponse.json({ received: true });
        }

        // Extract shipping address from session
        const shippingAddress = session.shipping_details?.address
          ? {
              line1: session.shipping_details.address.line1,
              line2: session.shipping_details.address.line2,
              city: session.shipping_details.address.city,
              state: session.shipping_details.address.state,
              postal_code: session.shipping_details.address.postal_code,
              country: session.shipping_details.address.country,
            }
          : {};

        // payment_intent is string (ID) when not expanded
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            stripePaymentId: paymentIntentId,
            email: session.customer_email || order.email,
            shippingAddress: shippingAddress,
          },
        });

        console.log(`Order ${order.id} marked as paid`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Find and cancel the order if payment wasn't completed
        const order = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (order && order.status === 'pending') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'cancelled',
            },
          });

          console.log(`Order ${order.id} cancelled due to expired session`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find order by payment intent ID (if available in metadata)
        console.warn(
          `Payment failed for intent ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`
        );

        // You could update the order status here if you have the payment intent ID
        // stored in the order metadata
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// In App Router, request.text() returns the raw body; no body parser config needed.
