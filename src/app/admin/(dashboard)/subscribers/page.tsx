'use client'

import { useState, useEffect } from 'react'
import { Trash2, Download } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Subscriber {
  id: number
  email: string
  verified: boolean
  subscribedAt: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; subscriberId: number | null }>({
    isOpen: false,
    subscriberId: null,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch subscribers
  useEffect(() => {
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/subscribers')
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching subscribers:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(subscriberId: number) {
    try {
      setDeletingId(subscriberId)
      const response = await fetch('/api/admin/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subscriberId }),
      })
      if (!response.ok) throw new Error('Failed to delete subscriber')
      setSubscribers(subscribers.filter((s) => s.id !== subscriberId))
      setDeleteConfirm({ isOpen: false, subscriberId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber')
      console.error('Error deleting subscriber:', err)
    } finally {
      setDeletingId(null)
    }
  }

  function handleExportCSV() {
    try {
      // Prepare CSV data
      const headers = ['Email', 'Status', 'Subscribed Date']
      const rows = subscribers.map((s) => [
        s.email,
        s.verified ? 'Verified' : 'Unverified',
        new Date(s.subscribedAt).toLocaleDateString(),
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('Failed to export CSV')
      console.error('Error exporting CSV:', err)
    }
  }

  const columns: Column<Subscriber>[] = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'verified',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value ? 'Verified' : 'Unverified'}
        </span>
      ),
    },
    {
      key: 'subscribedAt',
      label: 'Subscribed Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {subscribers.length} total subscribers
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation shrink-0"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 min-w-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading subscribers...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={subscribers}
            emptyMessage="No subscribers found"
            searchable={true}
            searchPlaceholder="Search by email..."
            searchableKeys={['email']}
            actions={(subscriber) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, subscriberId: subscriber.id })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, subscriberId: null })}
        onConfirm={() => {
          if (deleteConfirm.subscriberId !== null) {
            handleDelete(deleteConfirm.subscriberId)
          }
        }}
        title="Delete Subscriber"
        message="Are you sure you want to remove this subscriber from the list? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}
