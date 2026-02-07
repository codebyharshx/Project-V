import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { sessionId } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
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

    // Check if like already exists
    const existingLike = await prisma.communityLike.findUnique({
      where: {
        postId_sessionId: {
          postId: id,
          sessionId,
        },
      },
    });

    let isLiked: boolean;
    let likesCount: number;

    if (existingLike) {
      // Unlike - remove the like
      await prisma.communityLike.delete({
        where: {
          postId_sessionId: {
            postId: id,
            sessionId,
          },
        },
      });
      isLiked = false;
      likesCount = Math.max(0, post.likes - 1);
    } else {
      // Like - add the like
      await prisma.communityLike.create({
        data: {
          postId: id,
          sessionId,
        },
      });
      isLiked = true;
      likesCount = post.likes + 1;
    }

    // Update post likes count
    await prisma.communityPost.update({
      where: { id },
      data: { likes: likesCount },
    });

    return NextResponse.json(
      {
        success: true,
        isLiked,
        likesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
