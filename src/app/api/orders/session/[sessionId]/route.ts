import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function serialize(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === 'object') {
    if (Array.isArray(data)) return data.map(serialize);
    if ((data as { constructor?: { name?: string } }).constructor?.name === 'Decimal') {
      return parseFloat((data as { toString: () => string }).toString());
    }
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(data as object)) {
      out[key] = serialize((data as Record<string, unknown>)[key]);
    }
    return out;
  }
  return data;
}

/**
 * GET /api/orders/session/[sessionId]
 * Fetch order details by Stripe session ID
 * Used on checkout success page to display order confirmation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: serialize(order) });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
