import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Serialize Decimal to number for JSON response
function serialize(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map(item => serialize(item));
    }
    // Handle Decimal from Prisma
    if (data.constructor?.name === 'Decimal') {
      return parseFloat(data.toString());
    }
    const serialized: any = {};
    for (const key in data) {
      serialized[key] = serialize(data[key]);
    }
    return serialized;
  }
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    // Validate product ID
    if (isNaN(productId) || productId < 1) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serialize(product), { status: 200 });
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
