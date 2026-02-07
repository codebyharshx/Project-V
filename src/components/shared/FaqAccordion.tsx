'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Faq } from '@/types';

interface FaqAccordionProps {
  items: Faq[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-warm-gray font-inter">No FAQs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-border overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-cream transition-colors text-left"
          >
            <h3 className="font-playfair font-semibold text-charcoal text-lg">
              {item.question}
            </h3>
            <ChevronDown
              size={24}
              className={`flex-shrink-0 text-sage transition-transform duration-200 ${
                expandedId === item.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedId === item.id && (
            <div className="px-6 py-4 bg-cream/50 border-t border-border">
              <div
                className="text-charcoal/80 font-inter text-base leading-relaxed prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
