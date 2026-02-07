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

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch reviews for the product
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      {
        productId,
        reviews: serialize(reviews),
        count: reviews.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { stars, text, author } = await request.json();

    // Validate review fields
    if (!stars || typeof stars !== 'number') {
      return NextResponse.json(
        { error: 'Rating (stars) is required and must be a number' },
        { status: 400 }
      );
    }

    if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review text is required' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review text must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (text.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Review text must not exceed 1000 characters' },
        { status: 400 }
      );
    }

    if (!author || typeof author !== 'string' || author.trim().length === 0) {
      return NextResponse.json(
        { error: 'Author name is required' },
        { status: 400 }
      );
    }

    if (author.trim().length > 100) {
      return NextResponse.json(
        { error: 'Author name must not exceed 100 characters' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        stars,
        text: text.trim(),
        author: author.trim(),
        verified: false, // Reviews are unverified by default
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review created successfully',
        review: serialize(review),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
