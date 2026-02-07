'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface FormData {
  name: string
  slug: string
  category: string
  price: number | ''
  originalPrice: number | ''
  description: string
  longDescription: string
  features: string[]
  badge: string
  imageUrl: string
  color: string
  icon: string
  rating: number | ''
  reviewCount: number | ''
  active: boolean
}

const CATEGORY_OPTIONS = [
  { value: 'vibrators', label: 'Vibrators' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'intimacy', label: 'Intimacy' },
  { value: 'self-care', label: 'Self-Care' },
]

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Bestseller', label: 'Bestseller' },
  { value: 'Sale', label: 'Sale' },
  { value: 'New', label: 'New' },
  { value: 'Popular', label: 'Popular' },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [formData, setFormData] = useState<FormData | null>(null)
  const [newFeature, setNewFeature] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch product
  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/admin/products/${productId}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const { product } = await response.json()
        setFormData({
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || '',
          description: product.description,
          longDescription: product.longDescription,
          features: product.features || [],
          badge: product.badge || '',
          imageUrl: product.imageUrl || '',
          color: product.color,
          icon: product.icon,
          rating: product.rating,
          reviewCount: product.reviewCount,
          active: product.active,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load product</p>
      </div>
    )
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            name,
            slug: name
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-'),
          }
        : null
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : name === 'price' || name === 'originalPrice' || name === 'rating' || name === 'reviewCount'
                  ? value === ''
                    ? ''
                    : parseFloat(value)
                  : value,
          }
        : null
    )
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && formData) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              features: [...prev.features, newFeature.trim()],
            }
          : null
      )
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
          }
        : null
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setError(null)

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Product name is required')
      return
    }
    if (!formData.category) {
      setError('Category is required')
      return
    }
    if (formData.price === '' || (typeof formData.price === 'number' && formData.price <= 0)) {
      setError('Price must be a positive number')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
          originalPrice:
            formData.originalPrice === ''
              ? null
              : typeof formData.originalPrice === 'string'
                ? parseFloat(formData.originalPrice)
                : formData.originalPrice,
          rating: typeof formData.rating === 'string' ? parseFloat(formData.rating) : formData.rating,
          reviewCount: typeof formData.reviewCount === 'string' ? parseInt(formData.reviewCount) : formData.reviewCount,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      console.error('Error updating product:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete product')
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      console.error('Error deleting product:', err)
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">{formData.name}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL-friendly name)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated from name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from product name, but you can customize it
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  >
                    {BADGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (EUR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (optional)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                  <p className="text-xs text-gray-500 mt-1">For sale items</p>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Ratings & Reviews</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Count
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="1"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Descriptions</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief product description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  placeholder="Detailed product description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Features</h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddFeature()
                    }
                  }}
                  placeholder="Add a feature"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Media</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
              </div>

              {formData.imageUrl && (
                <div className="w-full h-32 rounded bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url('${formData.imageUrl}')` }} />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color/Gradient
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-16 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={handleInputChange}
                    name="color"
                    placeholder="#8B9D83"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (CSS class)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g., heart, star, package"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Status</h2>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#8B9D83] focus:ring-[#8B9D83]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
              <p className="text-xs text-gray-500">
                {formData.active ? 'Product will be visible to customers' : 'Product will be hidden from customers'}
              </p>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Product
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end bg-white rounded-lg border border-gray-200 p-6">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  )
}
