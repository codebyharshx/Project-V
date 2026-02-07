'use client';

import { ChevronDown, Send } from 'lucide-react';
import { useState } from 'react';

const TOPICS = ['Experiences', 'Questions', 'Recommendations', 'Tips'];
const ANONYMOUS_NAMES = [
  'SereneSage',
  'BlissfulBreeze',
  'RadiantRose',
  'WisdomWanderer',
  'VelvetVoice',
  'SilentStar',
  'EchoEmbrace',
  'GoldenGlow',
  'MoonlitMuse',
  'PeacefulPetal',
];

interface PostBoxProps {
  onPostSubmit?: (data: {
    topic: string;
    content: string;
    anonymousName: string;
  }) => Promise<void>;
}

export default function PostBox({ onPostSubmit }: PostBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  // Generate a random anonymous name
  const generateAnonymousName = () => {
    return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
  };

  const [anonymousName] = useState(generateAnonymousName());

  const characterCount = content.length;
  const isValid = content.trim().length >= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onPostSubmit) {
        await onPostSubmit({
          topic: selectedTopic,
          content: content.trim(),
          anonymousName,
        });
      }

      // Reset form
      setContent('');
      setSelectedTopic(TOPICS[0]);
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to submit post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="w-full bg-white rounded-lg border border-border p-4 md:p-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left text-warm-gray font-inter text-base px-4 py-3 hover:bg-cream rounded-lg transition-colors"
        >
          Share your experience anonymously...
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-lg border border-border p-4 md:p-6 animate-fadeUp"
    >
      {/* Header */}
      <h3 className="font-playfair font-bold text-charcoal text-lg mb-4">
        Share Your Story
      </h3>

      {/* Topic Selector */}
      <div className="mb-4 relative">
        <label className="block text-charcoal font-inter text-sm font-semibold mb-2">
          Topic
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-white font-inter text-sm text-charcoal hover:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 flex items-center justify-between"
          >
            <span>{selectedTopic}</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                showTopicDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showTopicDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowTopicDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 font-inter text-sm transition-colors ${
                    selectedTopic === topic
                      ? 'bg-sage/10 text-sage font-semibold'
                      : 'text-charcoal hover:bg-cream'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="mb-4">
        <label className="block text-charcoal font-inter text-sm font-semibold mb-2">
          Your Story
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience, question, or advice..."
          className="w-full px-4 py-3 border border-border rounded-lg font-inter text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-sage/30 resize-none"
          rows={5}
          disabled={isSubmitting}
        />
      </div>

      {/* Character Count */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs text-warm-gray font-inter">
          Minimum 20 characters required
        </div>
        <div
          className={`text-xs font-inter font-semibold ${
            characterCount >= 20 ? 'text-sage' : 'text-warm-gray'
          }`}
        >
          {characterCount} characters
        </div>
      </div>

      {/* Anonymous Name Display */}
      <div className="mb-6 p-4 bg-cream rounded-lg border border-border/50">
        <p className="text-charcoal/60 font-inter text-xs mb-1">
          Your post will appear as:
        </p>
        <p className="text-charcoal font-playfair font-semibold">{anonymousName}</p>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 p-4 bg-sage/5 rounded-lg border border-sage/20 flex gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sage/30 flex items-center justify-center mt-0.5">
          <div className="w-2 h-2 rounded-full bg-sage" />
        </div>
        <p className="text-charcoal/70 font-inter text-xs leading-relaxed">
          Your identity is always protected. All posts are completely anonymous
          and your personal information is never shared.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setContent('');
            setShowTopicDropdown(false);
          }}
          disabled={isSubmitting}
          className="px-6 py-2 border border-border text-charcoal font-inter text-sm font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="px-6 py-2 bg-sage text-white font-inter text-sm font-semibold rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Post Anonymously</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
