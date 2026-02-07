'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TOPICS = ['All Topics', 'Experiences', 'Questions', 'Recommendations', 'Tips'];

interface CommunityTabsProps {
  activeTopic: string;
  onTopicChange: (topic: string) => void;
  postCounts?: Record<string, number>;
}

export default function CommunityTabs({
  activeTopic,
  onTopicChange,
  postCounts = {},
}: CommunityTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="w-full bg-white sticky top-0 z-10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative flex items-center gap-2">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 z-10 w-10 h-10 items-center justify-center bg-gradient-to-r from-white to-transparent hover:from-cream rounded-r-lg transition-colors"
              aria-label="Scroll topics left"
            >
              <ChevronLeft size={20} className="text-charcoal" />
            </button>
          )}

          {/* Tabs Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-4 md:px-10 px-0"
          >
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => onTopicChange(topic)}
                className={`relative whitespace-nowrap px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${
                  activeTopic === topic
                    ? 'bg-sage text-white shadow-md'
                    : 'bg-cream text-charcoal hover:bg-cream-dark'
                }`}
              >
                {topic}
                {postCounts[topic] !== undefined && postCounts[topic] > 0 && (
                  <span
                    className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      activeTopic === topic
                        ? 'bg-white/30 text-white'
                        : 'bg-sage/20 text-sage'
                    }`}
                  >
                    {postCounts[topic]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 z-10 w-10 h-10 items-center justify-center bg-gradient-to-l from-white to-transparent hover:from-cream rounded-l-lg transition-colors"
              aria-label="Scroll topics right"
            >
              <ChevronRight size={20} className="text-charcoal" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
