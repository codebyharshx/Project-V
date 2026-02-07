import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Serialize Decimal to number for JSON response
function serialize(data: any): any {
  if (data === null || data === undefined) return data
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map((item) => serialize(item))
    }
    // Handle Decimal from Prisma
    if (data.constructor?.name === 'Decimal') {
      return parseFloat(data.toString())
    }
    const serialized: any = {}
    for (const key in data) {
      serialized[key] = serialize(data[key])
    }
    return serialized
  }
  return data
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const flagged = searchParams.get('flagged')
    const topic = searchParams.get('topic')

    // Build where clause
    const where: any = {}
    if (flagged === 'true') {
      where.flagged = true
    } else if (flagged === 'false') {
      where.flagged = false
    }
    if (topic && topic !== 'all') {
      where.topic = topic
    }

    // Fetch all community posts with filters
    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        replies: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        posts: serialize(posts),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin community posts list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, flagged, approved } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const post = await prisma.communityPost.update({
      where: { id: parseInt(id) },
      data: {
        flagged: flagged !== undefined ? flagged : undefined,
        approved: approved !== undefined ? approved : undefined,
      },
      include: {
        replies: true,
      },
    })

    return NextResponse.json(
      { post: serialize(post) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update community post error:', error)
    return NextResponse.json(
      { error: 'Failed to update community post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    await prisma.communityPost.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json(
      { message: 'Community post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete community post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete community post' },
      { status: 500 }
    )
  }
}
