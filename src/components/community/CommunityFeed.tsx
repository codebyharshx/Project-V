'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CommunityPost } from '@/types/index';
import CommunityPostCard from './CommunityPostCard';

interface CommunityFeedProps {
  posts: CommunityPost[];
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
  limit?: number;
  onLike?: (id: string) => void;
  onReply?: (id: string, text: string) => void;
}

export default function CommunityFeed({
  posts,
  showViewAll = false,
  title = 'Community Feed',
  subtitle = 'Discover stories and insights from our community',
  limit,
  onLike,
  onReply,
}: CommunityFeedProps) {
  const displayedPosts = limit ? posts.slice(0, limit) : posts;
  const hasMorePosts = limit && posts.length > limit;

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        {title && (
          <div className="mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-warm-gray font-inter text-base md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {displayedPosts.length > 0 ? (
          <>
            <div className="space-y-6 mb-10">
              {displayedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fadeUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CommunityPostCard
                    post={post}
                    onLike={onLike}
                    onReply={onReply}
                  />
                </div>
              ))}
            </div>

            {/* Load More / View All Button */}
            {hasMorePosts && (
              <div className="flex justify-center">
                {showViewAll ? (
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors"
                  >
                    <span>View All Stories</span>
                    <ChevronRight size={18} />
                  </Link>
                ) : (
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors">
                    <span>Load More</span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-cream/50 rounded-lg border border-border">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
              No stories yet
            </h3>
            <p className="text-warm-gray font-inter text-base mb-6">
              Be the first to share your experience and start the conversation.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors">
              <span>Share Your Story</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
