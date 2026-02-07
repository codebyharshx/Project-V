'use client'

import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, Star } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Testimonial {
  id: number
  text: string
  author: string
  avatar: string
  color: string
  location: string
  verified: boolean
  stars: number
  active: boolean
  sortOrder: number
  createdAt: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModal, setSelectedModal] = useState<{ isOpen: boolean; testimonial: Testimonial | null }>({
    isOpen: false,
    testimonial: null,
  })
  const [showNewForm, setShowNewForm] = useState(false)

  const [formData, setFormData] = useState({
    text: '',
    author: '',
    avatar: '',
    color: '#8B9D83',
    location: '',
    stars: 5,
  })

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; testimonialId: number | null }>({
    isOpen: false,
    testimonialId: null,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/testimonials')
      if (!response.ok) throw new Error('Failed to fetch testimonials')
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stars' ? parseInt(value) : value,
    }))
  }

  async function handleCreateTestimonial() {
    if (!formData.text || !formData.author) {
      setError('Please fill in text and author fields')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to create testimonial')
      const { testimonial } = await response.json()
      setTestimonials([...testimonials, testimonial])
      setFormData({
        text: '',
        author: '',
        avatar: '',
        color: '#8B9D83',
        location: '',
        stars: 5,
      })
      setShowNewForm(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial')
      console.error('Error creating testimonial:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateTestimonial(testimonial: Testimonial) {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })
      if (!response.ok) throw new Error('Failed to update testimonial')
      const { testimonial: updated } = await response.json()
      setTestimonials(testimonials.map((t) => (t.id === updated.id ? updated : t)))
      setSelectedModal({ isOpen: false, testimonial: null })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial')
      console.error('Error updating testimonial:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTestimonial(testimonialId: number) {
    try {
      setDeletingId(testimonialId)
      const response = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testimonialId }),
      })
      if (!response.ok) throw new Error('Failed to delete testimonial')
      setTestimonials(testimonials.filter((t) => t.id !== testimonialId))
      setDeleteConfirm({ isOpen: false, testimonialId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial')
      console.error('Error deleting testimonial:', err)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(testimonial: Testimonial) {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testimonial, active: !testimonial.active }),
      })
      if (!response.ok) throw new Error('Failed to update testimonial')
      const { testimonial: updated } = await response.json()
      setTestimonials(testimonials.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial')
      console.error('Error updating testimonial:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer testimonials</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors touch-manipulation shrink-0"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Testimonial Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">New Testimonial</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="Testimonial text"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                name="stars"
                value={formData.stars}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleInputChange}
                  name="color"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateTestimonial}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating...' : 'Create Testimonial'}
            </button>
            <button
              onClick={() => {
                setShowNewForm(false)
                setFormData({
                  text: '',
                  author: '',
                  avatar: '',
                  color: '#8B9D83',
                  location: '',
                  stars: 5,
                })
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
            No testimonials yet. Create one to get started.
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.stars ? 'text-yellow-400' : 'text-gray-300'}
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm flex-1">{testimonial.text}</p>

              {/* Author */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    {testimonial.location && (
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleToggleActive(testimonial)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    testimonial.active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {testimonial.active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setSelectedModal({ isOpen: true, testimonial })}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm font-medium"
                  title="Edit"
                >
                  <Edit2 size={16} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, testimonialId: testimonial.id })}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                  title="Delete"
                >
                  <Trash2 size={16} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedModal.isOpen && selectedModal.testimonial && (
        <EditTestimonialModal
          testimonial={selectedModal.testimonial}
          onClose={() => setSelectedModal({ isOpen: false, testimonial: null })}
          onSave={handleUpdateTestimonial}
          isSaving={saving}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, testimonialId: null })}
        onConfirm={() => {
          if (deleteConfirm.testimonialId !== null) {
            handleDeleteTestimonial(deleteConfirm.testimonialId)
          }
        }}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}

interface EditTestimonialModalProps {
  testimonial: Testimonial
  onClose: () => void
  onSave: (testimonial: Testimonial) => Promise<void>
  isSaving: boolean
}

function EditTestimonialModal({
  testimonial,
  onClose,
  onSave,
  isSaving,
}: EditTestimonialModalProps) {
  const [formData, setFormData] = useState(testimonial)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stars' ? parseInt(value) : value,
    }))
  }

  async function handleSubmit() {
    await onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Testimonial</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              name="stars"
              value={formData.stars}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
