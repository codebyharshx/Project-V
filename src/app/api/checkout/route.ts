import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface CheckoutRequestBody {
  items: CheckoutItem[];
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items, email }: CheckoutRequestBody = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify products exist in database and get their current prices
    const productIds = items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products could not be found' },
        { status: 400 }
      );
    }

    // Create a map for quick lookup and validate prices match
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Verify all products are active and prices match
    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }
      if (!product.active) {
        return NextResponse.json(
          { error: `Product ${product.name} is no longer available` },
          { status: 400 }
        );
      }

      // Allow small price differences due to floating point
      const dbPrice = parseFloat(product.price.toString());
      if (Math.abs(dbPrice - item.price) > 0.01) {
        return NextResponse.json(
          { error: 'Product prices have changed. Please refresh your cart.' },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 10;
    const total = subtotal + shipping;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              productId: item.id.toString(),
            },
          },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shipping * 100, // cents
              currency: 'eur',
            },
            display_name: shipping === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [
          'DE', // Germany
          'FR', // France
          'GB', // United Kingdom
          'NL', // Netherlands
          'BE', // Belgium
          'AT', // Austria
          'IT', // Italy
          'ES', // Spain
          'SE', // Sweden
          'DK', // Denmark
          'FI', // Finland
          'NO', // Norway
          'IE', // Ireland
          'PT', // Portugal
          'CH', // Switzerland
        ],
      },
    });

    // Create pending order in database
    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id!,
        email: email,
        status: 'pending',
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        shippingAddress: {},
        billingName: 'VLR Wellness',
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing checkout' },
      { status: 500 }
    );
  }
}
