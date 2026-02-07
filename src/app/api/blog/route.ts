import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Serialize helper for Decimal and Date fields
function serialize(data: any): any {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) {
    return data.toISOString();
  }
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map(item => serialize(item));
    }
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = { published: true };
    if (tag) {
      where.tag = tag;
    }
    if (featured) {
      where.featured = true;
    }

    // Fetch posts and total count in parallel
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json(
      {
        posts: serialize(posts),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blog list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
