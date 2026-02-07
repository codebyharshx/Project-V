import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Transform product from Prisma to frontend format
function transformProduct(product: any) {
  return {
    ...product,
    id: product.id.toString(),
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    rating: Number(product.rating),
    image: product.imageUrl || '',
    images: product.imageUrl ? [product.imageUrl] : [],
    inStock: true,
    featured: product.badge === 'Bestseller' || product.badge === 'Popular',
    new: product.badge === 'New',
    sustainable: false,
    benefits: Array.isArray(product.features) ? product.features : [],
    ingredients: [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'featured';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = { active: true };
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy based on sort
    let orderBy: any;
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' }; // featured
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products: products.map(transformProduct),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Products list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
