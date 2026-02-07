import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Transform product for search results
function transformProduct(product: any) {
  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate search query
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          products: [],
          posts: [],
        },
        { status: 200 }
      );
    }

    const searchQuery = query.trim();

    // Search products and blog posts in parallel
    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { category: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          category: true,
        },
      }),
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { excerpt: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          imageUrl: true,
          author: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        products: products.map(transformProduct),
        posts: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
