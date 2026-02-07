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

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
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

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { product: serialize(product) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
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

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validate price if provided
    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Generate slug if name changed
    let slug = body.slug
    if (body.name && !body.slug) {
      slug = generateSlug(body.name)
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name || existingProduct.name,
        slug: slug || existingProduct.slug,
        category: body.category || existingProduct.category,
        price: body.price !== undefined ? body.price : existingProduct.price,
        originalPrice: body.originalPrice !== undefined ? body.originalPrice : existingProduct.originalPrice,
        description: body.description !== undefined ? body.description : existingProduct.description,
        longDescription: body.longDescription !== undefined ? body.longDescription : existingProduct.longDescription,
        features: body.features !== undefined ? body.features : existingProduct.features,
        badge: body.badge !== undefined ? body.badge : existingProduct.badge,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : existingProduct.imageUrl,
        color: body.color !== undefined ? body.color : existingProduct.color,
        icon: body.icon !== undefined ? body.icon : existingProduct.icon,
        rating: body.rating !== undefined ? body.rating : existingProduct.rating,
        reviewCount: body.reviewCount !== undefined ? body.reviewCount : existingProduct.reviewCount,
        active: body.active !== undefined ? body.active : existingProduct.active,
      },
    })

    return NextResponse.json(
      { product: serialize(product) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
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

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
