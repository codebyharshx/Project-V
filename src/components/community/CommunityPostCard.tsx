'use client';

import { Heart, MessageCircle, Share2, Shield } from 'lucide-react';
import { useState } from 'react';
import { CommunityPost } from '@/types/index';

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike?: (id: string) => void;
  onReply?: (id: string, text: string) => void;
}

export default function CommunityPostCard({
  post,
  onLike,
  onReply,
}: CommunityPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onReply) {
        await onReply(post.id, replyText);
      }
      setReplyText('');
      setShowReplyInput(false);
    } finally {
      setIsSubmitting(false);
    }
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
    <div
      className={`bg-white rounded-lg border border-border p-6 transition-all duration-300 ${
        isHovered ? 'shadow-lg border-sage/30' : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColorClass(
              post.avatarColor
            )} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
          >
            {post.avatarInitial}
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-playfair font-semibold text-charcoal">
                {post.author}
              </h4>
              {post.verified && (
                <Shield size={16} className="text-sage flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-warm-gray font-inter">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Topic Badge */}
        <span className="ml-4 px-3 py-1 bg-blush/10 text-blush font-inter text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
          {post.topic}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-charcoal/80 font-inter text-sm leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Footer - Interaction Buttons */}
      <div className="flex items-center gap-6 pt-4 border-t border-border">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-warm-gray hover:text-blush transition-colors duration-200 group"
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart
            size={18}
            className={`transition-all duration-200 ${
              isLiked
                ? 'fill-blush stroke-blush'
                : 'group-hover:stroke-blush stroke-warm-gray'
            }`}
          />
          <span className="text-xs font-inter font-medium">{likeCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => {
            setShowReplies(!showReplies);
            if (!showReplies) setShowReplyInput(false);
          }}
          className="flex items-center gap-2 text-warm-gray hover:text-sage transition-colors duration-200"
          aria-label="View comments"
        >
          <MessageCircle size={18} />
          <span className="text-xs font-inter font-medium">
            {post.replyCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          className="flex items-center gap-2 text-warm-gray hover:text-gold transition-colors duration-200"
          aria-label="Share post"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-6 pt-6 border-t border-border animate-fadeUp">
          {/* Existing Replies */}
          {post.replies && post.replies.length > 0 ? (
            <div className="space-y-4 mb-4">
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-cream/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-inter font-semibold text-charcoal text-sm">
                      {reply.author}
                    </h5>
                    <span className="text-xs text-warm-gray">
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-charcoal/80 font-inter text-sm">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-gray text-sm font-inter mb-4">
              No replies yet. Be the first to respond!
            </p>
          )}

          {/* Reply Input */}
          {showReplyInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2 border border-border rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                disabled={isSubmitting}
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isSubmitting}
                className="px-4 py-2 bg-sage text-white font-inter text-sm font-semibold rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReplyInput(true)}
              className="w-full px-4 py-2 border border-border text-charcoal font-inter text-sm font-medium rounded-lg hover:bg-cream transition-colors"
            >
              Write a reply...
            </button>
          )}
        </div>
      )}
    </div>
  );
}
