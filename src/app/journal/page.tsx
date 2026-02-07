import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import JournalClient from './JournalClient';
import { BlogPost } from '@/types';

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

// Transform Prisma blog posts to BlogPost interface
function transformPosts(posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>>): BlogPost[] {
  return posts.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    authorInit: p.authorInit,
    tag: p.tag,
    tagIcon: p.tagIcon,
    readTime: p.readTime,
    featured: p.featured,
    imageUrl: p.imageUrl,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export default async function JournalPage() {
  try {
    // Fetch all published blog posts
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    const transformedPosts = transformPosts(posts);

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
        <JournalClient initialPosts={transformedPosts} />
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
