import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'Journal — Velorious',
  description: 'Read our latest wellness articles, tips, and community stories on intimate health and self-care.',
  keywords: ['wellness', 'wellness articles', 'health tips', 'intimate wellness', 'self-care'],
  openGraph: {
    title: 'Journal — Velorious',
    description: 'Read our latest wellness articles, tips, and community stories',
    type: 'website',
    url: 'https://velorious.com/journal',
  },
};

// Serialize helper for Decimal and Date fields
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
    if (obj.constructor?.name === 'Decimal') {
      return (parseFloat(obj.toString()) as unknown) as T;
    }

    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = serializeData(obj[key]);
    }
    return result as T;
  }

  return data;
}

export default async function JournalPage() {
  try {
    // Fetch all published blog posts
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    const serializedPosts = serializeData(posts);

    return (
      <main className="min-h-screen bg-cream">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-warm-gray font-inter mb-8">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span>/</span>
            <span className="text-charcoal font-semibold">Journal</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal mb-4">
              Our Journal
            </h1>
            <p className="text-lg md:text-xl text-warm-gray font-inter max-w-2xl mx-auto">
              Wellness wisdom, expert insights, and stories from our community. Explore articles on intimate health, self-care, and personal wellness.
            </p>
          </div>
        </div>

        {/* Journal Client Component */}
        <JournalClient initialPosts={serializedPosts} />
      </main>
    );
  } catch (error) {
    console.error('Journal page error:', error);
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-2xl font-playfair font-bold text-charcoal mb-4">
            Unable to load journal
          </h1>
          <p className="text-warm-gray font-inter">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
