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
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (search) {
      where.email = { contains: search, mode: 'insensitive' }
    }

    // Fetch all subscribers ordered by newest
    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
    })

    return NextResponse.json(
      {
        subscribers: serialize(subscribers),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin subscribers list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
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
        { error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    await prisma.subscriber.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json(
      { message: 'Subscriber deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete subscriber error:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
