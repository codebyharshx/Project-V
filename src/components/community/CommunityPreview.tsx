'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CommunityPost } from '@/types/index';

interface CommunityPreviewProps {
  posts: CommunityPost[];
}

export default function CommunityPreview({ posts }: CommunityPreviewProps) {
  // Show only 3-4 latest posts
  const displayedPosts = posts.slice(0, 4);

  const getInitial = (author: string) => author.charAt(0).toUpperCase();

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'from-blue-400 to-purple-500': 'from-blue-400 to-purple-500',
      'from-pink-400 to-rose-500': 'from-pink-400 to-rose-500',
      'from-green-400 to-teal-500': 'from-green-400 to-teal-500',
      'from-amber-400 to-orange-500': 'from-amber-400 to-orange-500',
      'from-indigo-400 to-blue-500': 'from-indigo-400 to-blue-500',
    };
    return colorMap[color] || 'from-sage to-sage-dark';
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const timeAgo = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-b from-cream to-blush/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-3">
            Join Our Community
          </h2>
          <p className="text-warm-gray font-inter text-base md:text-lg max-w-2xl mx-auto">
            A safe, anonymous space to share experiences, ask questions, and
            support each other
          </p>
        </div>

        {/* Posts Grid */}
        {displayedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
              {displayedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg border border-border p-5 hover:shadow-lg hover:border-sage/30 transition-all duration-300 animate-fadeUp flex flex-col"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Header */}
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getColorClass(
                          post.avatarColor || 'from-sage to-sage-dark'
                        )} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                      >
                        {getInitial(post.author)}
                      </div>

                      {/* Name & Time */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair font-semibold text-charcoal text-sm truncate">
                          {post.author}
                        </h4>
                        <p className="text-xs text-warm-gray font-inter">
                          {timeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Topic Badge */}
                    <span className="inline-block px-2 py-1 bg-blush/10 text-blush font-inter text-xs font-semibold rounded-full">
                      {post.topic}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-charcoal/75 font-inter text-sm leading-relaxed flex-1 mb-4">
                    {truncateText(post.content, 100)}
                  </p>

                  {/* Footer Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50 text-xs text-warm-gray font-inter">
                    <span>{post.likes} likes</span>
                    <span>{post.replyCount} replies</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
              <div className="text-center p-6 bg-white rounded-lg border border-border">
                <p className="font-playfair text-2xl md:text-3xl font-bold text-sage mb-1">
                  2,400+
                </p>
                <p className="text-warm-gray font-inter text-sm">Community Members</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg border border-border">
                <p className="font-playfair text-2xl md:text-3xl font-bold text-blush mb-1">
                  {posts.length}
                </p>
                <p className="text-warm-gray font-inter text-sm">Stories Shared</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg border border-border">
                <p className="font-playfair text-2xl md:text-3xl font-bold text-gold mb-1">
                  100%
                </p>
                <p className="text-warm-gray font-inter text-sm">Anonymous</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-8 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors shadow-md hover:shadow-lg"
              >
                <span>Join the Conversation</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-3">
              Community Coming Soon
            </h3>
            <p className="text-warm-gray font-inter text-base mb-6">
              Be among the first to join our growing community of supportive
              members.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-8 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors"
            >
              <span>Explore Community</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
