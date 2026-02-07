import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import BlogCard from '@/components/blog/BlogCard';
import { BlogPost } from '@/types';

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

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post || !post.published) {
      return {
        title: 'Not Found',
      };
    }

    return {
      title: `${post.title} — Velorious Journal`,
      description: post.excerpt,
      keywords: post.tag ? [post.tag, 'wellness', 'health'] : ['wellness', 'health'],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        url: `https://velorious.com/journal/${post.slug}`,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Article',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    // Fetch the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post || !post.published) {
      notFound();
    }

    // Fetch related posts (same tag, limit 3)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        tag: post.tag,
        id: { not: post.id },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // Transform related posts to BlogPost interface
    const transformedRelatedPosts: BlogPost[] = relatedPosts.map(p => ({
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

    // Parse publishedAt date
    const publishedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <main className="min-h-screen bg-cream">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-warm-gray font-inter">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span>/</span>
            <a href="/journal" className="hover:text-charcoal transition-colors">Journal</a>
            <span>/</span>
            <span className="text-charcoal font-semibold line-clamp-1">{post.title}</span>
          </nav>
        </div>

        {/* Hero Image */}
        {post.imageUrl && (
          <div className="w-full h-96 md:h-[500px] relative mb-12">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          {/* Tag & Read Time */}
          <div className="flex items-center gap-4 mb-6">
            {post.tag && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 border border-sage/20">
                <span className="text-xs uppercase font-inter font-bold text-sage">
                  {post.tag}
                </span>
              </div>
            )}
            {post.readTime && (
              <span className="text-sm text-warm-gray font-inter">
                {post.readTime} read
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 py-6 border-b border-charcoal/10 mb-12">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white font-bold text-lg">
              {post.authorInit || post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-playfair font-semibold text-charcoal">
                By {post.author}
              </p>
              <p className="text-sm text-warm-gray font-inter">
                {publishedDate}
              </p>
            </div>
          </div>

          {/* Rich HTML Content */}
          <div
            className="prose prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Journal Link */}
          <div className="py-8 border-t border-charcoal/10">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-sage hover:text-sage-dark font-inter font-semibold transition-colors"
            >
              <span>←</span>
              <span>Back to Journal</span>
            </Link>
          </div>
        </article>

        {/* Related Posts Section */}
        {transformedRelatedPosts.length > 0 && (
          <section className="bg-white py-16 md:py-20 mt-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-10">
                More from {post.tag}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {transformedRelatedPosts.map((relatedPost, index) => (
                  <div key={relatedPost.id} className="animate-fadeUp" style={{ animationDelay: `${index * 50}ms` }}>
                    <BlogCard post={relatedPost} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    );
  } catch (error) {
    console.error('Blog post page error:', error);
    notFound();
  }
}
