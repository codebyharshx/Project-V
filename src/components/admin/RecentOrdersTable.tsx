'use client'

import DataTable, { Column } from './DataTable'

interface OrderData {
  id: number
  email: string
  total: string
  status: string
  itemCount: number
  createdAt: string
}

interface RecentOrdersTableProps {
  orders: OrderData[]
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const ordersColumns: Column<OrderData>[] = [
    {
      key: 'id',
      label: 'Order #',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'itemCount',
      label: 'Items',
      sortable: true,
      render: (value) => `${value} item(s)`,
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value) => {
        const amount = parseFloat(value) / 100
        return `$${amount.toFixed(2)}`
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusColors: Record<string, string> = {
          completed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          failed: 'bg-red-100 text-red-800',
        }
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[value] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value)
        return date.toLocaleDateString()
      },
    },
  ]

  return (
    <DataTable
      columns={ordersColumns}
      data={orders}
      emptyMessage="No orders yet"
    />
  )
}
