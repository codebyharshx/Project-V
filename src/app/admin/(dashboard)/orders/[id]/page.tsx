'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')

  // Fetch order
  useEffect(() => {
    fetchOrder()
  }, [orderId])

  async function fetchOrder() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) throw new Error('Failed to fetch order')
      const data = await response.json()
      setOrder(data.order)
      setNewStatus(data.order.status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching order:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus() {
    if (!order || !newStatus) return

    try {
      setSaving(true)
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update order status')
      const { order: updated } = await response.json()
      setOrder(updated)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status')
      console.error('Error updating order:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600">Order not found</p>
      </div>
    )
  }

  const shippingAddr = order.shippingAddress || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order #{order.stripeSessionId.substring(0, 12)}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-gray-900 font-medium font-mono">{order.stripeSessionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900 font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="text-gray-900 font-medium font-mono">
                {order.stripePaymentId || 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="text-gray-900 font-medium">
                {shippingAddr.street || 'N/A'}<br />
                {[shippingAddr.city, shippingAddr.state, shippingAddr.postalCode].filter(Boolean).join(', ') || '—'}<br />
                {shippingAddr.country || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.product.name}</td>
                  <td className="py-3 px-4 text-gray-900">{item.quantity}</td>
                  <td className="py-3 px-4 text-gray-900">€{Number(item.price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    €{(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-3 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">€{Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900 font-medium">€{Number(order.shipping).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-lg font-bold text-[#8B9D83]">€{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Update Order Status</h2>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={handleUpdateStatus}
            disabled={saving || newStatus === order.status}
            className="px-6 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Updating...' : 'Update Status'}
          </button>
        </div>

        {newStatus !== order.status && (
          <p className="text-sm text-gray-500">
            Current status: <span className="font-medium text-gray-900">{order.status}</span>
          </p>
        )}
      </div>

      {/* Back Button */}
      <Link
        href="/admin/orders"
        className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Back to Orders
      </Link>
    </div>
  )
}
