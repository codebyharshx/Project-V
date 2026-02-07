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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const body = await request.json();
    const { author, text, sessionId } = body;

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!author || !text || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate text length
    if (text.trim().length < 5) {
      return NextResponse.json(
        { error: 'Reply must be at least 5 characters' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create the reply
    const reply = await prisma.communityReply.create({
      data: {
        postId,
        author,
        text: text.trim(),
        sessionId,
      },
    });

    // Increment reply count
    await prisma.communityPost.update({
      where: { id: postId },
      data: { commentCount: post.commentCount + 1 },
    });

    return NextResponse.json(
      { reply: serialize(reply) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create reply error:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}
