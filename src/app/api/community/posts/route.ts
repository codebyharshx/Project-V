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
    const topic = searchParams.get('topic');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build where clause - only approved, non-flagged posts
    const where: any = {
      approved: true,
      flagged: false,
    };
    if (topic && topic !== 'All') {
      where.topic = topic;
    }

    // Fetch posts with replies and total count in parallel
    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
      prisma.communityPost.count({ where }),
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
    console.error('Community posts list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymousName, avatarInitial, avatarColor, topic, body: postBody, sessionId } = body;

    // Validate required fields
    if (!anonymousName || !avatarInitial || !avatarColor || !topic || !postBody || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate body length
    if (postBody.trim().length < 20) {
      return NextResponse.json(
        { error: 'Post must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        anonymousName,
        avatarInitial,
        avatarColor,
        topic,
        body: postBody.trim(),
        sessionId,
        approved: true, // Auto-approve for now, implement moderation later
        verified: false,
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json(
      { post: serialize(post) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create community post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
