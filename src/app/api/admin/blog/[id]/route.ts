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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)

    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { post: serialize(post) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    const body = await request.json()

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title || undefined,
        slug: body.slug || undefined,
        excerpt: body.excerpt || undefined,
        content: body.content || undefined,
        tag: body.tag || undefined,
        tagIcon: body.tagIcon || undefined,
        author: body.author || undefined,
        authorInit: body.authorInit || undefined,
        readTime: body.readTime || undefined,
        featured: body.featured !== undefined ? body.featured : undefined,
        imageUrl: body.imageUrl || undefined,
        published: body.published !== undefined ? body.published : undefined,
      },
    })

    return NextResponse.json(
      { post: serialize(post) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
