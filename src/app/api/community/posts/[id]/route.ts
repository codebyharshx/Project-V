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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { post: serialize(post) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Community post fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // TODO: Implement admin session checking
    // For now, allow deletion - implement authorization later

    // Delete the post (cascades to replies and likes)
    await prisma.communityPost.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Community post delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
