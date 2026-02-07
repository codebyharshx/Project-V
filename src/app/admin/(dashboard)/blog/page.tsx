'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Plus, Star } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  tag: string
  tagIcon: string
  author: string
  authorInit: string
  readTime: string
  featured: boolean
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; postId: number | null }>({
    isOpen: false,
    postId: null,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch blog posts
  useEffect(() => {
    fetchPosts()
  }, [])

  // Filter posts based on search and status
  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter === 'published') {
      filtered = filtered.filter((p) => p.published)
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter((p) => !p.published)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, statusFilter])

  async function fetchPosts() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(postId: number) {
    try {
      setDeletingId(postId)
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete blog post')
      setPosts(posts.filter((p) => p.id !== postId))
      setDeleteConfirm({ isOpen: false, postId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post')
      console.error('Error deleting blog post:', err)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleFeatured(post: BlogPost) {
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, featured: !post.featured }),
      })
      if (!response.ok) throw new Error('Failed to update blog post')
      const { post: updated } = await response.json()
      setPosts(posts.map((p) => (p.id === updated.id ? updated : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog post')
      console.error('Error updating blog post:', err)
    }
  }

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'tag',
      label: 'Tag',
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
    },
    {
      key: 'published',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value, row) => (
        <button
          onClick={() => handleToggleFeatured(row)}
          className={`p-2 rounded transition-colors ${
            value
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle featured"
        >
          <Star size={18} fill={value ? 'currentColor' : 'none'} />
        </button>
      ),
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] transition-colors text-sm sm:text-base touch-manipulation shrink-0"
        >
          <Plus size={20} />
          New Blog Post
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 min-w-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredPosts}
            emptyMessage="No blog posts found"
            actions={(post) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </Link>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, postId: post.id })}
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
        onClose={() => setDeleteConfirm({ isOpen: false, postId: null })}
        onConfirm={() => {
          if (deleteConfirm.postId !== null) {
            handleDelete(deleteConfirm.postId)
          }
        }}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}
