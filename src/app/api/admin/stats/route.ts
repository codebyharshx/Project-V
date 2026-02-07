import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch statistics
    const [
      totalProducts,
      totalSubscribers,
      totalPosts,
      orderStats,
      recentOrders,
    ] = await Promise.all([
      // Total products
      prisma.product.count(),

      // Total subscribers
      prisma.subscriber.count(),

      // Total community posts
      prisma.communityPost.count(),

      // Order statistics
      prisma.order.aggregate({
        _count: { id: true },
        _sum: { total: true },
      }),

      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
    ])

    // Calculate month-over-month growth
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const [currentMonthOrders, lastMonthOrders] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: currentMonth,
            lte: monthEnd,
          },
        },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
        _count: { id: true },
      }),
    ])

    const monthlyGrowth =
      lastMonthOrders._count.id === 0
        ? 0
        : (
            ((currentMonthOrders._count.id - lastMonthOrders._count.id) /
              lastMonthOrders._count.id) *
            100
          ).toFixed(1)

    return NextResponse.json({
      totalProducts,
      totalOrders: orderStats._count.id || 0,
      totalRevenue: orderStats._sum.total ? orderStats._sum.total.toString() : '0',
      totalSubscribers,
      totalPosts,
      monthlyGrowth,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        email: order.email,
        total: order.total.toString(),
        status: order.status,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
