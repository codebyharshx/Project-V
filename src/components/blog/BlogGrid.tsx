'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types';

interface BlogGridProps {
  posts: BlogPost[];
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
}

export default function BlogGrid({
  posts,
  showViewAll = true,
  title,
  subtitle,
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <section className="w-full bg-cream py-12 md:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-4">
              No Articles Found
            </h2>
            <p className="text-charcoal/60 font-inter mb-8">
              Check back soon for more wellness insights and community stories.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <section className="w-full bg-cream py-12 md:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {title && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-charcoal/70 font-inter text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Featured Post */}
        <div className="mb-12 md:mb-16">
          <BlogCard post={featuredPost} variant="featured" />
        </div>

        {/* Remaining Posts Grid */}
        {remainingPosts.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post) => (
                <BlogCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          </div>
        )}

        {/* View All Link */}
        {showViewAll && (
          <div className="flex justify-center">
            <Link
              href="/journal"
              className="inline-flex items-center gap-3 bg-sage hover:bg-sage-dark text-white px-8 py-4 rounded-lg font-playfair font-semibold text-lg transition-all duration-300 hover:gap-5"
            >
              Read All Articles
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
