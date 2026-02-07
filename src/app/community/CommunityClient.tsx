'use client';

import { useEffect, useState } from 'react';
import { CommunityPost } from '@/types';
import PostBox from '@/components/community/PostBox';
import CommunityPostCard from '@/components/community/CommunityPostCard';

const TOPICS = ['All', 'Experiences', 'Questions', 'Recommendations', 'Tips'];

const AVATAR_COLORS = [
  'from-blue-400 to-purple-500',
  'from-pink-400 to-rose-500',
  'from-green-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-blue-500',
];

interface CommunityClientProps {
  initialPosts: CommunityPost[];
  totalPosts: number;
}

export default function CommunityClient({ initialPosts, totalPosts }: CommunityClientProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [hasMore, setHasMore] = useState(totalPosts > initialPosts.length);

  // Initialize session ID
  useEffect(() => {
    const stored = localStorage.getItem('community-session-id');
    if (stored) {
      setSessionId(stored);
    } else {
      const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('community-session-id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Generate random avatar color
  const getAvatarColor = () => {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  };

  // Handle post submission
  const handlePostSubmit = async (data: {
    topic: string;
    content: string;
    anonymousName: string;
  }) => {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousName: data.anonymousName,
          avatarInitial: data.anonymousName.charAt(0).toUpperCase(),
          avatarColor: getAvatarColor(),
          topic: data.topic,
          body: data.content,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      setPosts([result.post, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Handle like toggle
  const handleLike = async (postId: string) => {
    const postIdNum = parseInt(postId);
    try {
      const response = await fetch(`/api/community/posts/${postIdNum}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();

      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likes: result.likesCount, liked: result.isLiked }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle reply
  const handleReply = async (postId: string, text: string) => {
    const postIdNum = parseInt(postId);
    try {
      const response = await fetch(`/api/community/posts/${postIdNum}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'Anonymous',
          text,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reply');
      }

      const result = await response.json();

      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: [...(post.replies || []), result.reply],
              replyCount: (post.replyCount || 0) + 1,
            }
          : post
      ));
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/community/posts?topic=${selectedTopic === 'All' ? '' : selectedTopic}&page=${currentPage + 1}&limit=10`
      );
      if (!response.ok) throw new Error('Failed to load more');

      const result = await response.json();
      setPosts([...posts, ...result.posts]);
      setCurrentPage(currentPage + 1);
      setHasMore(result.posts.length === 10);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts by topic
  const filteredPosts = selectedTopic === 'All'
    ? posts
    : posts.filter(post => post.topic === selectedTopic);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal mb-4">
          Our Community
        </h1>
        <p className="text-lg md:text-xl text-warm-gray font-inter max-w-2xl">
          A safe, completely anonymous space where women share experiences, ask questions, and support one another on their wellness journey.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 p-6 md:p-8 bg-white rounded-lg border border-border">
        <div className="text-center">
          <p className="text-sm text-warm-gray font-inter mb-1">Community Members</p>
          <p className="text-3xl md:text-4xl font-playfair font-bold text-sage">∞</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-warm-gray font-inter mb-1">Stories Shared</p>
          <p className="text-3xl md:text-4xl font-playfair font-bold text-charcoal">{totalPosts}</p>
        </div>
        <div className="col-span-2 md:col-span-1 text-center">
          <p className="text-sm text-warm-gray font-inter mb-1">Privacy Level</p>
          <p className="text-2xl md:text-3xl font-playfair font-bold text-blush">100% Anonymous</p>
        </div>
      </div>

      {/* Post Box */}
      <div className="mb-12">
        <PostBox onPostSubmit={handlePostSubmit} />
      </div>

      {/* Topic Filter */}
      <div className="mb-10 border-b border-charcoal/10">
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 font-inter font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                selectedTopic === topic
                  ? 'text-sage border-sage'
                  : 'text-warm-gray border-transparent hover:text-charcoal'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Community Feed */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="space-y-6 mb-10">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fadeUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CommunityPostCard
                  post={post}
                  onLike={() => handleLike(post.id.toString())}
                  onReply={(id, text) => handleReply(id.toString(), text)}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More Stories'}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-white rounded-lg border border-border">
          <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
            No stories yet
          </h3>
          <p className="text-warm-gray font-inter text-base mb-6">
            Be the first to share your experience and start the conversation.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-inter font-semibold rounded-lg hover:bg-sage-dark transition-colors"
          >
            Share Your Story
          </button>
        </div>
      )}
    </section>
  );
}
