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

    // Fetch all FAQs ordered by sortOrder
    const faqs = await prisma.faq.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(
      {
        faqs: serialize(faqs),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin FAQs list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
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
    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Missing required fields: question, answer' },
        { status: 400 }
      )
    }

    // Get max sortOrder
    const maxSort = await prisma.faq.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const sortOrder = (maxSort?.sortOrder || 0) + 1

    // Create FAQ
    const faq = await prisma.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        sortOrder,
        active: body.active !== undefined ? body.active : true,
      },
    })

    return NextResponse.json(
      { faq: serialize(faq) },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create FAQ error:', error)
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
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
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    // Update FAQ
    const faq = await prisma.faq.update({
      where: { id: parseInt(id) },
      data: {
        question: body.question || undefined,
        answer: body.answer || undefined,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : undefined,
        active: body.active !== undefined ? body.active : undefined,
      },
    })

    return NextResponse.json(
      { faq: serialize(faq) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update FAQ error:', error)
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
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
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    await prisma.faq.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json(
      { message: 'FAQ deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete FAQ error:', error)
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
