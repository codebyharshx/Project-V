'use client';

import { useState, useMemo } from 'react';
import { BlogPost } from '@/types';
import BlogCard from '@/components/blog/BlogCard';

const TAGS = ['All', 'Wellness', 'Education', 'Community', 'Tips'];

interface JournalClientProps {
  initialPosts: BlogPost[];
}

export default function JournalClient({ initialPosts }: JournalClientProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') {
      return initialPosts;
    }
    return initialPosts.filter(post =>
      post.tag && post.tag.toLowerCase() === selectedTag.toLowerCase()
    );
  }, [initialPosts, selectedTag]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
      {/* Tag Filter Tabs */}
      <div className="mb-12 border-b border-charcoal/10">
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 font-inter font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                selectedTag === tag
                  ? 'text-sage border-sage'
                  : 'text-warm-gray border-transparent hover:text-charcoal'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8">
        <p className="text-sm text-warm-gray font-inter">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} {selectedTag !== 'All' && `in ${selectedTag}`}
        </p>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fadeUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-white rounded-lg border border-border">
          <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
            No articles found
          </h3>
          <p className="text-warm-gray font-inter text-base mb-6">
            No articles match your current filter. Try selecting a different tag.
          </p>
          <button
            onClick={() => setSelectedTag('All')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors"
          >
            View All Articles
          </button>
        </div>
      )}
    </section>
  );
}
