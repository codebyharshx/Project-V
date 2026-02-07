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

    // Fetch all testimonials ordered by sortOrder
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(
      {
        testimonials: serialize(testimonials),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin testimonials list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
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
    if (!body.text || !body.author || body.stars === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: text, author, stars' },
        { status: 400 }
      )
    }

    // Get max sortOrder
    const maxSort = await prisma.testimonial.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const sortOrder = (maxSort?.sortOrder || 0) + 1

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        text: body.text,
        author: body.author,
        avatar: body.avatar || '',
        color: body.color || '#8B9D83',
        location: body.location || '',
        stars: body.stars,
        verified: body.verified !== undefined ? body.verified : true,
        active: body.active !== undefined ? body.active : true,
        sortOrder,
      },
    })

    return NextResponse.json(
      { testimonial: serialize(testimonial) },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
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
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    // Update testimonial
    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        text: body.text || undefined,
        author: body.author || undefined,
        avatar: body.avatar || undefined,
        color: body.color || undefined,
        location: body.location || undefined,
        stars: body.stars !== undefined ? body.stars : undefined,
        verified: body.verified !== undefined ? body.verified : undefined,
        active: body.active !== undefined ? body.active : undefined,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : undefined,
      },
    })

    return NextResponse.json(
      { testimonial: serialize(testimonial) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
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
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json(
      { message: 'Testimonial deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
