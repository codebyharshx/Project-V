'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function CategoryGrid() {
  const t = useTranslation();

  const categories = [
    {
      name: t.categories.vibrators,
      slug: 'vibrators',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    },
    {
      name: t.categories.wellness,
      slug: 'wellness',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    },
    {
      name: t.categories.intimacy,
      slug: 'intimacy',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
    },
    {
      name: t.categories.selfCare,
      slug: 'self-care',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
  ];

  return (
    <section className="w-full bg-cream py-6 md:py-10 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-[1.75rem] lg:text-[2rem] font-playfair font-bold text-charcoal mb-1.5">
            {t.categories.shopByCategory}
          </h2>
          <p className="text-charcoal/70 font-inter text-[0.9375rem]">
            {t.categories.subtitle}
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Background image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/30 to-transparent group-hover:from-charcoal/70 group-hover:via-charcoal/40 transition-all duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                <h3 className="text-white font-playfair font-bold text-base md:text-lg mb-0.5">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-inter font-semibold text-[0.8125rem]">{t.common.shopNow}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
