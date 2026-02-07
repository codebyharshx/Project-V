'use client'

import { useState, useEffect } from 'react'
import { Flag, Trash2, Eye } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface CommunityPost {
  id: number
  anonymousName: string
  avatarInitial: string
  avatarColor: string
  topic: string
  body: string
  verified: boolean
  likes: number
  commentCount: number
  sessionId: string
  flagged: boolean
  approved: boolean
  createdAt: string
  replies: any[]
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; post: CommunityPost | null }>({
    isOpen: false,
    post: null,
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; postId: number | null }>({
    isOpen: false,
    postId: null,
  })
  const [actioningId, setActioningId] = useState<number | null>(null)

  // Fetch community posts
  useEffect(() => {
    fetchPosts()
  }, [])

  // Filter posts based on status and topic
  useEffect(() => {
    let filtered = posts

    if (statusFilter === 'flagged') {
      filtered = filtered.filter((p) => p.flagged)
    } else if (statusFilter === 'approved') {
      filtered = filtered.filter((p) => p.approved && !p.flagged)
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter((p) => p.topic === topicFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, statusFilter, topicFilter])

  async function fetchPosts() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/community')
      if (!response.ok) throw new Error('Failed to fetch community posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching community posts:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleFlag(post: CommunityPost) {
    try {
      setActioningId(post.id)
      const response = await fetch('/api/admin/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          flagged: !post.flagged,
        }),
      })
      if (!response.ok) throw new Error('Failed to update post')
      const { post: updated } = await response.json()
      setPosts(posts.map((p) => (p.id === updated.id ? updated : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
      console.error('Error updating post:', err)
    } finally {
      setActioningId(null)
    }
  }

  async function handleDelete(postId: number) {
    try {
      setActioningId(postId)
      const response = await fetch('/api/admin/community', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId }),
      })
      if (!response.ok) throw new Error('Failed to delete post')
      setPosts(posts.filter((p) => p.id !== postId))
      setDeleteConfirm({ isOpen: false, postId: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      console.error('Error deleting post:', err)
    } finally {
      setActioningId(null)
    }
  }

  const topics = ['all', ...new Set(posts.map((p) => p.topic))]

  const columns: Column<CommunityPost>[] = [
    {
      key: 'anonymousName',
      label: 'Author',
      sortable: true,
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'body',
      label: 'Content',
      render: (value) => (
        <div className="max-w-md truncate text-sm text-gray-600">
          {value}
        </div>
      ),
    },
    {
      key: 'likes',
      label: 'Likes',
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'commentCount',
      label: 'Replies',
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'flagged',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {value ? 'Flagged' : 'Approved'}
        </span>
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
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Moderation</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and moderate community posts</p>
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
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
          >
            <option value="all">All Posts</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
          </select>

          {/* Topic Filter */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic === 'all' ? 'All Topics' : topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 min-w-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading community posts...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredPosts}
            emptyMessage="No community posts found"
            actions={(post) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewModal({ isOpen: true, post })}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="View full post"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleToggleFlag(post)}
                  disabled={actioningId === post.id}
                  className={`p-2 rounded transition-colors ${
                    post.flagged
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={post.flagged ? 'Unflag' : 'Flag'}
                >
                  <Flag size={18} fill={post.flagged ? 'currentColor' : 'none'} />
                </button>
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

      {/* View Modal */}
      {viewModal.isOpen && viewModal.post && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewModal({ isOpen: false, post: null })}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Full Post</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Author:</strong> {viewModal.post.anonymousName}
                </p>
                <p>
                  <strong>Topic:</strong> {viewModal.post.topic}
                </p>
                <p>
                  <strong>Likes:</strong> {viewModal.post.likes}
                </p>
                <p>
                  <strong>Replies:</strong> {viewModal.post.commentCount}
                </p>
                <p>
                  <strong>Posted:</strong> {new Date(viewModal.post.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700 whitespace-pre-wrap">{viewModal.post.body}</p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => setViewModal({ isOpen: false, post: null })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, postId: null })}
        onConfirm={() => {
          if (deleteConfirm.postId !== null) {
            handleDelete(deleteConfirm.postId)
          }
        }}
        title="Delete Community Post"
        message="Are you sure you want to delete this community post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={actioningId !== null}
      />
    </div>
  )
}
