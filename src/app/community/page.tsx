import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import CommunityClient from './CommunityClient';

export const metadata: Metadata = {
  title: 'Community — Velorious',
  description: 'Join our safe, anonymous community space. Share experiences, ask questions, and connect with women on their wellness journey.',
  keywords: ['community', 'wellness community', 'anonymous', "women's health", 'wellness stories'],
  openGraph: {
    title: 'Community — Velorious',
    description: 'Join our safe, anonymous community space',
    type: 'website',
    url: 'https://velorious.com/community',
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

export default async function CommunityPage() {
  try {
    // Fetch initial community posts
    const posts = await prisma.communityPost.findMany({
      where: {
        approved: true,
        flagged: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Get stats
    const totalPosts = await prisma.communityPost.count({
      where: {
        approved: true,
        flagged: false,
      },
    });

    const serializedPosts = serializeData(posts);

    return (
      <main className="min-h-screen bg-cream">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-warm-gray font-inter mb-8">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span>/</span>
            <span className="text-charcoal font-semibold">Community</span>
          </nav>
        </div>

        {/* Community Client Component */}
        <CommunityClient initialPosts={serializedPosts} totalPosts={totalPosts} />
      </main>
    );
  } catch (error) {
    console.error('Community page error:', error);
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-2xl font-playfair font-bold text-charcoal mb-4">
            Unable to load community
          </h1>
          <p className="text-warm-gray font-inter">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
