'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

const tagColorMap: { [key: string]: string } = {
  wellness: 'from-sage-light to-sage',
  education: 'from-blush-light to-blush',
  community: 'from-gold/20 to-gold/10',
  stories: 'from-warm-gray/20 to-warm-gray/10',
  tips: 'from-sage-light/30 to-sage/20',
};

const getTagBgGradient = (tag: string) => {
  return tagColorMap[tag.toLowerCase()] || 'from-cream-dark to-warm-gray/20';
};

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get fallback gradient if no image
  const getFallbackGradient = () => {
    return `from-${post.tag?.toLowerCase() === 'wellness' ? 'sage-light' : 'blush-light'} to-${post.tag?.toLowerCase() === 'wellness' ? 'sage' : 'blush'}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (variant === 'featured') {
    return (
      <Link href={`/journal/${post.slug}`}>
        <div
          className="group relative overflow-hidden rounded-xl aspect-video bg-cream cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                priority
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient()}`}
              />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent group-hover:from-charcoal/85 transition-all duration-300" />

          {/* Tag Badge */}
          {post.tag && (
            <div className="absolute top-6 left-6 z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTagBgGradient(post.tag)} backdrop-blur-sm`}
              >
                <span className="text-xs uppercase font-inter font-bold text-charcoal">
                  {post.tag}
                </span>
              </div>
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white mb-3 line-clamp-2 group-hover:text-sage transition-colors duration-300">
              {post.title}
            </h2>
            <p className="text-white/90 font-inter text-sm md:text-base line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-white/70 text-sm font-inter">
              <span>By {post.author}</span>
              {post.createdAt && (
                <>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/journal/${post.slug}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-cream mb-4">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient()}`}
            />
          )}

          {/* Tag Badge Overlay */}
          {post.tag && (
            <div className="absolute top-4 left-4 z-10">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getTagBgGradient(post.tag)} backdrop-blur-sm`}
              >
                <span className="text-xs uppercase font-inter font-bold text-charcoal">
                  {post.tag}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg md:text-xl font-playfair font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-sage transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-charcoal/70 font-inter text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-warm-gray font-inter">
          <div className="flex items-center gap-2">
            {/* Author Avatar */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white text-xs font-bold">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <span>{post.author}</span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
