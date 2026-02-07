import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import RecentOrdersTable from '@/components/admin/RecentOrdersTable'
import { Package, ShoppingCart, Mail, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: string
  totalSubscribers: number
  totalPosts: number
  monthlyGrowth: string | number
  recentOrders: Array<{
    id: number
    email: string
    total: string
    status: string
    itemCount: number
    createdAt: string
  }>
}

export default async function AdminDashboard() {
  // Auth is enforced by (dashboard)/layout.tsx
  // Fetch dashboard statistics
  let stats: DashboardStats | null = null
  try {
    const [
      totalProducts,
      totalSubscribers,
      totalPosts,
      orderStats,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.subscriber.count(),
      prisma.communityPost.count(),
      prisma.order.aggregate({
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
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

    stats = {
      totalProducts,
      totalOrders: orderStats._count.id || 0,
      totalRevenue: orderStats._sum.total
        ? orderStats._sum.total.toString()
        : '0',
      totalSubscribers,
      totalPosts,
      monthlyGrowth,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        email: order.email,
        total: order.total.toString(),
        status: order.status,
        itemCount: order.items.length,
        createdAt: order.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard statistics</p>
      </div>
    )
  }

  // Format revenue
  const revenue = stats.totalRevenue
    ? parseFloat(stats.totalRevenue) / 100
    : 0

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          iconColor="#8B9D83"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={`${stats.monthlyGrowth}% this month`}
          changeType={parseFloat(String(stats.monthlyGrowth)) >= 0 ? 'positive' : 'negative'}
          icon={ShoppingCart}
          iconColor="#C4A55A"
        />
        <StatsCard
          title="Revenue"
          value={`$${revenue.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="#D4A0A0"
        />
        <StatsCard
          title="Subscribers"
          value={stats.totalSubscribers}
          icon={Mail}
          iconColor="#2C2C2C"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors text-sm sm:text-base touch-manipulation"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          Add Product
        </Link>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 bg-[#C4A55A] text-white rounded-lg hover:bg-[#b3945a] transition-colors text-sm sm:text-base touch-manipulation"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          New Blog Post
        </Link>
        <Link
          href="/admin/subscribers"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 bg-[#D4A0A0] text-white rounded-lg hover:bg-[#c39090] transition-colors text-sm sm:text-base touch-manipulation"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          View Subscribers
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C2C2C]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-[#8B9D83] hover:text-[#7a8a73] text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <RecentOrdersTable orders={stats.recentOrders} />
      </div>

      {/* Activity Timeline Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 min-w-0 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C2C2C] mb-4 sm:mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pb-4 border-b border-gray-100 last:border-0 min-w-0">
              <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="w-2 h-2 rounded-full bg-[#8B9D83] mt-1.5 sm:mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C]">
                    New order #{order.id}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {order.email} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#2C2C2C] shrink-0 pl-4 sm:pl-0">
                ${(parseFloat(order.total) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
