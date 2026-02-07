'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Plus } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Product {
  id: number
  name: string
  slug: string
  category: string
  price: number
  originalPrice: number | null
  description: string
  longDescription: string
  features: string[]
  rating: number
  reviewCount: number
  badge: string | null
  imageUrl: string | null
  color: string
  icon: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: number | null }>({
    isOpen: false,
    productId: null,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(productId: number) {
    try {
      setDeletingId(productId)
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete product')
      setProducts(products.filter((p) => p.id !== productId))
      setDeleteConfirm({ isOpen: false, productId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      console.error('Error deleting product:', err)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, active: !product.active }),
      })
      if (!response.ok) throw new Error('Failed to update product')
      const { product: updated } = await response.json()
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      console.error('Error updating product:', err)
    }
  }

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  const columns: Column<Product>[] = [
    {
      key: 'imageUrl',
      label: 'Image',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {value ? (
            <div
              className="w-10 h-10 rounded bg-cover bg-center"
              style={{ backgroundImage: `url('${value}')` }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded flex items-center justify-center text-xs text-white font-bold"
              style={{ backgroundColor: row.color || '#ccc' }}
            >
              {row.color ? row.color.substring(1, 3).toUpperCase() : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => {
        const num = Number(value)
        return Number.isFinite(num) ? `€${num.toFixed(2)}` : '—'
      },
    },
    {
      key: 'active',
      label: 'Status',
      render: (value, row) => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => {
        const num = Number(value)
        return Number.isFinite(num) ? `${num.toFixed(1)} ⭐` : '—'
      },
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors text-sm sm:text-base touch-manipulation shrink-0"
        >
          <Plus size={20} />
          Add New Product
        </Link>
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-0 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] text-base sm:text-sm"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full min-w-0 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] text-base sm:text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 min-w-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProducts}
            emptyMessage="No products found"
            actions={(product) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </Link>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, productId: product.id })}
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
        onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
        onConfirm={() => {
          if (deleteConfirm.productId !== null) {
            handleDelete(deleteConfirm.productId)
          }
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}
