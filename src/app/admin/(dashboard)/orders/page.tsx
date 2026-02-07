'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/DataTable'

interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
  }
}

interface Order {
  id: number
  stripeSessionId: string
  stripePaymentId: string | null
  email: string
  status: string
  subtotal: number
  shipping: number
  total: number
  shippingAddress: any
  billingName: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch orders
  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.email.toLowerCase().includes(term) ||
          (o.stripeSessionId && String(o.stripeSessionId).toLowerCase().includes(term))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  async function fetchOrders() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const statuses = ['all', ...new Set(orders.map((o) => o.status))]

  const columns: Column<Order>[] = [
    {
      key: 'stripeSessionId',
      label: 'Order #',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value ? String(value).substring(0, 12) : '—'}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'items',
      label: 'Items',
      render: (value: OrderItem[]) => (
        <span>
          {value.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value) => `€${Number(value).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusColors: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800',
          paid: 'bg-blue-100 text-blue-800',
          shipped: 'bg-purple-100 text-purple-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
        }
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[value] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer orders</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by email or order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-0 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] text-base sm:text-sm"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full min-w-0 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] text-base sm:text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all'
                  ? 'All Statuses'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 min-w-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredOrders}
            emptyMessage="No orders found"
            actions={(order) => (
              <Link
                href={`/admin/orders/${order.id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex"
                title="View details"
              >
                <Eye size={18} />
              </Link>
            )}
          />
        )}
      </div>
    </div>
  )
}
