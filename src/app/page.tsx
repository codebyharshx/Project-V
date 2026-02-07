import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import TrustMarquee from '@/components/home/TrustMarquee';
import PressBar from '@/components/home/PressBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductGrid from '@/components/shop/ProductGrid';
import BrandStory from '@/components/home/BrandStory';
import TestimonialSection from '@/components/home/TestimonialSection';
import BlogGrid from '@/components/blog/BlogGrid';
import CommunityPreview from '@/components/community/CommunityPreview';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'Velorious — Intimate Wellness, Redefined',
  description:
    'Premium intimate wellness products designed with integrity and science. Discover natural, effective solutions for intimate health and pleasure.',
  keywords: [
    'intimate wellness',
    'wellness products',
    'natural intimate care',
    'sexual wellness',
    'intimate health',
  ],
  openGraph: {
    title: 'Velorious — Intimate Wellness, Redefined',
    description:
      'Premium intimate wellness products designed with integrity and science.',
    type: 'website',
    url: 'https://velorious.com',
  },
};

/**
 * Serialization helper for Prisma Decimal fields
 * Converts Decimal and Date types to JSON-serializable formats
 */
function serializeData<T>(data: T): T {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item)) as T;
  }

  if (data instanceof Date) {
    return (data.toISOString() as unknown) as T;
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, any>;

    // Check if it's a Decimal (Prisma type)
    if ('toNumber' in obj && typeof obj.toNumber === 'function') {
      return obj.toNumber() as T;
    }

    // Recursively serialize nested objects
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else if (value && typeof value === 'object' && 'toNumber' in value) {
        serialized[key] = (value as any).toNumber();
      } else if (typeof value === 'object' && value !== null) {
        serialized[key] = serializeData(value);
      } else {
        serialized[key] = value;
      }
    }
    return serialized as T;
  }

  return data;
}

export default async function HomePage() {
  try {
    // Fetch all data in parallel
    const [featuredProducts, latestPosts, testimonials, faqs, communityPosts] =
      await Promise.all([
        // Fetch featured products
        prisma.product.findMany({
          where: { active: true },
          take: 8,
          orderBy: { createdAt: 'desc' },
        }),
        // Fetch latest blog posts
        prisma.blogPost.findMany({
          where: { published: true },
          take: 4,
          orderBy: { createdAt: 'desc' },
        }),
        // Fetch testimonials
        prisma.testimonial.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        // Fetch FAQs
        prisma.faq.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        // Fetch community posts
        prisma.communityPost.findMany({
          where: { approved: true, flagged: false },
          take: 4,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    // Serialize Decimal and Date fields for client components
    const serializedProducts = serializeData(
      featuredProducts.map((product) => ({
        ...product,
        id: product.id.toString(),
        price: Number(product.price),
        originalPrice: product.originalPrice
          ? Number(product.originalPrice)
          : undefined,
        rating: Number(product.rating),
      }))
    );

    const serializedPosts = serializeData(
      latestPosts.map((post) => ({
        ...post,
        id: post.id.toString(),
      }))
    );

    const serializedTestimonials = serializeData(
      testimonials.map((testimonial) => ({
        ...testimonial,
        id: testimonial.id.toString(),
      }))
    );

    const serializedFaqs = serializeData(
      faqs.map((faq) => ({
        ...faq,
        id: faq.id.toString(),
      }))
    );

    const serializedCommunityPosts = serializeData(
      communityPosts.map((post) => ({
        ...post,
        id: post.id.toString(),
        author: post.anonymousName,
        content: post.body,
        replyCount: post.commentCount,
      }))
    );

    return (
      <main className="w-full">
        {/* Hero Section */}
        <Hero />

        {/* Trust Marquee */}
        <TrustMarquee />

        {/* Press Bar */}
        <PressBar />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Featured Products Section */}
        {serializedProducts && serializedProducts.length > 0 && (
          <ProductGrid
            products={serializedProducts}
            columns={4}
            title="Featured Collection"
            subtitle="Discover our most-loved intimate wellness products, carefully curated for you"
            showViewAll
          />
        )}

        {/* Brand Story Section */}
        <BrandStory />

        {/* Testimonials Section */}
        {serializedTestimonials && serializedTestimonials.length > 0 && (
          <TestimonialSection testimonials={serializedTestimonials} />
        )}

        {/* Blog/Journal Section */}
        {serializedPosts && serializedPosts.length > 0 && (
          <BlogGrid
            posts={serializedPosts}
            title="The Journal"
            subtitle="Insights, stories, and expert perspectives on intimate wellness"
            showViewAll
          />
        )}

        {/* Community Preview Section */}
        {serializedCommunityPosts && serializedCommunityPosts.length > 0 && (
          <CommunityPreview posts={serializedCommunityPosts} />
        )}

        {/* FAQ Section */}
        {serializedFaqs && serializedFaqs.length > 0 && (
          <section className="w-full bg-cream py-12 md:py-20 px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              {/* Section Header */}
              <div className="mb-12 md:mb-16 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-charcoal/70 font-inter text-lg">
                  Got questions? We have answers. Explore our comprehensive FAQ
                  section.
                </p>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-4">
                {serializedFaqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group border border-border rounded-lg bg-white hover:border-sage/30 hover:shadow-sm transition-all duration-300"
                  >
                    <summary className="cursor-pointer p-6 flex items-center justify-between text-charcoal font-playfair font-semibold text-lg hover:text-sage transition-colors duration-300">
                      <span>{faq.question}</span>
                      <svg
                        className="w-5 h-5 text-charcoal group-open:text-sage group-open:rotate-180 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 border-t border-border/50 pt-4 text-charcoal/75 font-inter leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);

    // Return minimal homepage on error
    return (
      <main className="w-full">
        <Hero />
        <TrustMarquee />
        <PressBar />
        <CategoryGrid />
        <BrandStory />
        <NewsletterSection />
      </main>
    );
  }
}
