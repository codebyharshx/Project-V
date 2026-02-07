'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tag: 'Wellness',
    tagIcon: '✨',
    author: '',
    authorInit: '',
    readTime: '5 min read',
    imageUrl: '',
    featured: false,
    published: false,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Auto-generate author initials
    if (name === 'author') {
      const initials = value
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
      setFormData((prev) => ({ ...prev, authorInit: initials }))
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({ ...prev, imageUrl: url }))
    if (url) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create blog post')
      }

      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating blog post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-600 mt-1">Create a new blog post</p>
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
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Content</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Blog post title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated from title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Short summary of the post"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Full blog post content (supports HTML)"
              rows={10}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: You can use HTML for formatting. Consider integrating a rich text editor like Tiptap for better UX.
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Metadata</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag *
              </label>
              <select
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              >
                <option value="Wellness">Wellness</option>
                <option value="Education">Education</option>
                <option value="Community">Community</option>
                <option value="Tips">Tips</option>
                <option value="Stories">Stories</option>
              </select>
            </div>

            {/* Tag Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Icon
              </label>
              <input
                type="text"
                name="tagIcon"
                value={formData.tagIcon}
                onChange={handleInputChange}
                placeholder="✨"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            {/* Author Initials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Initials
              </label>
              <input
                type="text"
                name="authorInit"
                value={formData.authorInit}
                onChange={handleInputChange}
                placeholder="Auto-generated from author name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                placeholder="5 min read"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Image</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Options</h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 focus:ring-[#8B9D83]"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as featured
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 focus:ring-[#8B9D83]"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish immediately
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
          <Link
            href="/admin/blog"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
