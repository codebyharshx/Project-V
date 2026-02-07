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

// Generate slug from name
function generateSlug(name: string): string {
  return name
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
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category && category !== 'all') {
      where.category = category
    }

    // Fetch all products (including inactive ones for admin)
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        products: serialize(products),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin products list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' },
        { status: 400 }
      )
    }

    // Validate price is positive
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.name)

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        category: body.category,
        price: body.price,
        originalPrice: body.originalPrice || null,
        description: body.description || '',
        longDescription: body.longDescription || '',
        features: body.features || [],
        badge: body.badge || null,
        imageUrl: body.imageUrl || null,
        color: body.color || '',
        icon: body.icon || '',
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        active: body.active !== undefined ? body.active : true,
      },
    })

    return NextResponse.json(
      { product: serialize(product) },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
