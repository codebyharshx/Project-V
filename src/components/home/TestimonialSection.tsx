'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from '@/components/shared/TestimonialCard';
import { useTranslation } from '@/lib/i18n';

interface Testimonial {
  text: string;
  author: string;
  avatar: string;
  color: string;
  location: string;
  stars: number;
  verified: boolean;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({
  testimonials,
}: TestimonialSectionProps) {
  const t = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay carousel on mobile
  useEffect(() => {
    if (!isAutoplay || typeof window === 'undefined') return;

    autoplayIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isAutoplay, testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setIsAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-cream py-6 md:py-10 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-[1.75rem] lg:text-[2rem] font-playfair font-bold text-charcoal mb-1.5">
            {t.testimonials.title}
          </h2>
          <p className="text-charcoal/70 font-inter text-[0.9375rem] max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Mobile Carousel - shows one testimonial */}
        <div className="md:hidden mb-8">
          <div className="relative">
            {/* Single Testimonial Display */}
            <div className="overflow-hidden rounded-xl">
              <div
                className="transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                <div className="flex w-full">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:bg-sage hover:text-white transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:bg-sage hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-sage w-3 h-3'
                    : 'bg-border w-2 h-2 hover:bg-sage/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid - shows 3 testimonials */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
