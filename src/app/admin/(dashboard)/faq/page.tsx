'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Faq {
  id: number
  question: string
  answer: string
  sortOrder: number
  active: boolean
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [editData, setEditData] = useState<Faq | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; faqId: number | null }>({
    isOpen: false,
    faqId: null,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch FAQs
  useEffect(() => {
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/faq')
      if (!response.ok) throw new Error('Failed to fetch FAQs')
      const data = await response.json()
      setFaqs(data.faqs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching FAQs:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateFaq() {
    if (!newFaq.question || !newFaq.answer) {
      setError('Please fill in both question and answer')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      })
      if (!response.ok) throw new Error('Failed to create FAQ')
      const { faq } = await response.json()
      setFaqs([faq, ...faqs])
      setNewFaq({ question: '', answer: '' })
      setShowNewForm(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create FAQ')
      console.error('Error creating FAQ:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateFaq() {
    if (!editData || !editData.question || !editData.answer) {
      setError('Please fill in both question and answer')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      if (!response.ok) throw new Error('Failed to update FAQ')
      const { faq } = await response.json()
      setFaqs(faqs.map((f) => (f.id === faq.id ? faq : f)))
      setEditingId(null)
      setEditData(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update FAQ')
      console.error('Error updating FAQ:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteFaq(faqId: number) {
    try {
      setDeletingId(faqId)
      const response = await fetch('/api/admin/faq', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: faqId }),
      })
      if (!response.ok) throw new Error('Failed to delete FAQ')
      setFaqs(faqs.filter((f) => f.id !== faqId))
      setDeleteConfirm({ isOpen: false, faqId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ')
      console.error('Error deleting FAQ:', err)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleReorder(faqId: number, direction: 'up' | 'down') {
    const currentIndex = faqs.findIndex((f) => f.id === faqId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= faqs.length) return

    const faqA = faqs[currentIndex]
    const faqB = faqs[newIndex]

    try {
      // Swap sort orders
      await Promise.all([
        fetch('/api/admin/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...faqA, sortOrder: faqB.sortOrder }),
        }),
        fetch('/api/admin/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...faqB, sortOrder: faqA.sortOrder }),
        }),
      ])

      // Reorder in UI
      const newFaqs = [...faqs]
      ;[newFaqs[currentIndex], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[currentIndex]]
      setFaqs(newFaqs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder FAQs')
      console.error('Error reordering FAQs:', err)
    }
  }

  async function handleToggleActive(faq: Faq) {
    try {
      const response = await fetch('/api/admin/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...faq, active: !faq.active }),
      })
      if (!response.ok) throw new Error('Failed to update FAQ')
      const { faq: updated } = await response.json()
      setFaqs(faqs.map((f) => (f.id === updated.id ? updated : f)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update FAQ')
      console.error('Error updating FAQ:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading FAQs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors touch-manipulation shrink-0"
        >
          <Plus size={20} />
          Add FAQ
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New FAQ Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">New FAQ</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={newFaq.question}
              onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter question"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter answer"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateFaq}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating...' : 'Create FAQ'}
            </button>
            <button
              onClick={() => {
                setShowNewForm(false)
                setNewFaq({ question: '', answer: '' })
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
            No FAQs yet. Create one to get started.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <div>
                      {expandedId === faq.id ? (
                        <ChevronUp size={20} className="text-[#8B9D83]" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{faq.question}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Order: {faq.sortOrder}
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faq.active}
                      onChange={() => handleToggleActive(faq)}
                      className="w-4 h-4 rounded border-gray-300 focus:ring-[#8B9D83]"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </label>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, faqId: faq.id })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === faq.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                  {editingId === faq.id ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={editData?.question || ''}
                          onChange={(e) =>
                            setEditData((prev) => (prev ? { ...prev, question: e.target.value } : null))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={editData?.answer || ''}
                          onChange={(e) =>
                            setEditData((prev) => (prev ? { ...prev, answer: e.target.value } : null))
                          }
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateFaq}
                          disabled={saving}
                          className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditData(null)
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setEditingId(faq.id)
                            setEditData(faq)
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>

                        {/* Reorder Buttons */}
                        <button
                          onClick={() => handleReorder(faq.id, 'up')}
                          disabled={index === 0}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleReorder(faq.id, 'down')}
                          disabled={index === faqs.length - 1}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, faqId: null })}
        onConfirm={() => {
          if (deleteConfirm.faqId !== null) {
            handleDeleteFaq(deleteConfirm.faqId)
          }
        }}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}
