'use client';

import { Star, Check } from 'lucide-react';
import { useState } from 'react';

interface TestimonialCardProps {
  testimonial: {
    text: string;
    author: string;
    avatar: string;
    color: string;
    location: string;
    stars: number;
    verified: boolean;
  };
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract first letter for avatar
  const avatarLetter = testimonial.author.charAt(0).toUpperCase();

  return (
    <div
      className={`bg-white rounded-xl p-6 md:p-8 border border-border hover:shadow-lg transition-all duration-300 ${
        isHovered ? 'hover:-translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Marks Decoration */}
      <div className="text-6xl text-sage/20 font-playfair mb-4 leading-none">
        "
      </div>

      {/* Testimonial Text */}
      <p className="text-charcoal/80 font-inter text-base leading-relaxed mb-6">
        {testimonial.text}
      </p>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < testimonial.stars
                ? 'fill-gold stroke-gold'
                : 'stroke-warm-gray fill-none'
            }
          />
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-start justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
          >
            {avatarLetter}
          </div>

          {/* Author Details */}
          <div>
            <h4 className="font-playfair font-bold text-charcoal">
              {testimonial.author}
            </h4>
            <p className="text-sm text-warm-gray font-inter">
              {testimonial.location}
            </p>
          </div>
        </div>

        {/* Verified Badge */}
        {testimonial.verified && (
          <div className="flex items-center gap-1 bg-sage/10 px-3 py-1 rounded-full">
            <Check size={16} className="text-sage" />
            <span className="text-xs font-inter font-semibold text-sage">
              Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
