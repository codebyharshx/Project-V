import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ShopPageClient from './ShopPageClient';

export const metadata: Metadata = {
  title: 'Shop — Velorious',
  description:
    'Explore our full collection of premium intimate wellness products. Discover vibrators, wellness items, intimacy products, and self-care essentials.',
  keywords: [
    'buy intimate wellness products',
    'vibrators',
    'wellness products online',
    'intimate care',
  ],
  openGraph: {
    title: 'Shop — Velorious',
    description: 'Premium intimate wellness products',
    type: 'website',
  },
};

interface ShopPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const category = (searchParams.category as string) || 'all';
  const sort = (searchParams.sort as string) || 'featured';
  const page = parseInt((searchParams.page as string) || '1');
  const limit = 12;

  try {
    // Build where clause
    const where: any = { active: true };
    if (category !== 'all') {
      where.category = category;
    }

    // Fetch products and total count in parallel
    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy:
          sort === 'price-asc'
            ? { price: 'asc' }
            : sort === 'price-desc'
              ? { price: 'desc' }
              : sort === 'newest'
                ? { createdAt: 'desc' }
                : sort === 'rating'
                  ? { rating: 'desc' }
                  : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.product.findMany({
        where: { active: true },
        distinct: ['category'],
        select: { category: true },
      }),
    ]);

    // Serialize data for client
    const serializedProducts = products.map((product) => ({
      ...product,
      id: product.id.toString(),
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : undefined,
      rating: Number(product.rating),
      image: product.imageUrl || '',
      images: product.imageUrl ? [product.imageUrl] : [],
      inStock: true,
      featured: product.badge === 'Bestseller' || product.badge === 'Popular',
      new: product.badge === 'New',
      sustainable: false,
      benefits: Array.isArray(product.features) ? (product.features as string[]) : [],
      ingredients: [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    const uniqueCategories = Array.from(
      new Set(categories.map((c) => c.category))
    );

    return (
      <ShopPageClient
        initialProducts={serializedProducts}
        initialTotal={total}
        initialPage={page}
        initialCategory={category}
        initialSort={sort}
        categories={uniqueCategories}
      />
    );
  } catch (error) {
    console.error('Error fetching shop data:', error);
    // Return error state to client
    return (
      <ShopPageClient
        initialProducts={[]}
        initialTotal={0}
        initialPage={1}
        initialCategory={category}
        initialSort={sort}
        categories={[]}
      />
    );
  }
}
