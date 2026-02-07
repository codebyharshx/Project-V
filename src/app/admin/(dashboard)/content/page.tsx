'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SiteContent {
  id: string
  key: string
  value: any
}

export default function ContentEditorPage() {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['hero', 'promo', 'press', 'trust'])
  )

  // Form states
  const [heroData, setHeroData] = useState({ headline: '', subtitle: '' })
  const [promoData, setPromoData] = useState({ text: '', code: '' })
  const [pressLogos, setPressLogos] = useState<string[]>([])
  const [trustBadges, setTrustBadges] = useState<string[]>([])

  // Fetch content
  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/content')
      if (!response.ok) throw new Error('Failed to fetch content')
      const data = await response.json()
      setContent(data.content || [])

      // Parse content into form states
      data.content?.forEach((item: SiteContent) => {
        if (item.key === 'hero' && typeof item.value === 'object') {
          setHeroData(item.value)
        } else if (item.key === 'promo' && typeof item.value === 'object') {
          setPromoData(item.value)
        } else if (item.key === 'press_logos' && Array.isArray(item.value)) {
          setPressLogos(item.value)
        } else if (item.key === 'trust_badges' && Array.isArray(item.value)) {
          setTrustBadges(item.value)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveContent(key: string, value: any) {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!response.ok) throw new Error('Failed to save content')
      setSuccess(`${key} saved successfully`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content')
      console.error('Error saving content:', err)
    } finally {
      setSaving(false)
    }
  }

  function toggleSection(section: string) {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const isExpanded = (section: string) => expandedSections.has(section)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading content...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homepage Content Editor</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Edit main site content sections</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('hero')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          {isExpanded('hero') ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {isExpanded('hero') && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={heroData.headline}
                onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <button
              onClick={() => saveContent('hero', heroData)}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        )}
      </div>

      {/* Promo Banner Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('promo')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">Promo Banner</h2>
          {isExpanded('promo') ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {isExpanded('promo') && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Text
              </label>
              <input
                type="text"
                value={promoData.text}
                onChange={(e) => setPromoData({ ...promoData, text: e.target.value })}
                placeholder="e.g., Summer Sale"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code
              </label>
              <input
                type="text"
                value={promoData.code}
                onChange={(e) => setPromoData({ ...promoData, code: e.target.value })}
                placeholder="e.g., SUMMER20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
              />
            </div>

            <button
              onClick={() => saveContent('promo', promoData)}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Promo Banner'}
            </button>
          </div>
        )}
      </div>

      {/* Press Logos Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('press')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">Press Logos</h2>
          {isExpanded('press') ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {isExpanded('press') && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div className="space-y-3">
              {pressLogos.map((logo, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => {
                      const newLogos = [...pressLogos]
                      newLogos[index] = e.target.value
                      setPressLogos(newLogos)
                    }}
                    placeholder="Logo URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                  <button
                    onClick={() => setPressLogos(pressLogos.filter((_, i) => i !== index))}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPressLogos([...pressLogos, ''])}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Add Logo
            </button>

            <button
              onClick={() => saveContent('press_logos', pressLogos.filter((l) => l.trim() !== ''))}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Press Logos'}
            </button>
          </div>
        )}
      </div>

      {/* Trust Badges Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('trust')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">Trust Badges</h2>
          {isExpanded('trust') ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {isExpanded('trust') && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div className="space-y-3">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => {
                      const newBadges = [...trustBadges]
                      newBadges[index] = e.target.value
                      setTrustBadges(newBadges)
                    }}
                    placeholder="Badge text (e.g., 100% Natural)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83]"
                  />
                  <button
                    onClick={() => setTrustBadges(trustBadges.filter((_, i) => i !== index))}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTrustBadges([...trustBadges, ''])}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Add Badge
            </button>

            <button
              onClick={() => saveContent('trust_badges', trustBadges.filter((b) => b.trim() !== ''))}
              disabled={saving}
              className="px-4 py-2 bg-[#8B9D83] text-white rounded-lg hover:bg-[#7a8a73] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Trust Badges'}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          All changes are saved to the database. You can expand/collapse sections to organize your editing workspace.
        </p>
      </div>
    </div>
  )
}
