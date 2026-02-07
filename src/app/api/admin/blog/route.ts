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

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (published === 'true') {
      where.published = true
    } else if (published === 'false') {
      where.published = false
    }

    // Fetch all blog posts (including unpublished) ordered by newest
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        posts: serialize(posts),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin blog list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.tag || !body.author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, tag, author' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title)

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || '',
        content: body.content,
        tag: body.tag,
        tagIcon: body.tagIcon || '',
        author: body.author,
        authorInit: body.authorInit || '',
        readTime: body.readTime || '5 min read',
        featured: body.featured || false,
        imageUrl: body.imageUrl || null,
        published: body.published || false,
      },
    })

    return NextResponse.json(
      { post: serialize(post) },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
