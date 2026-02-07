import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Product Not Found — Velorious',
    };
  }

  return {
    title: `${product.name} — Velorious`,
    description: product.description,
    keywords: [product.category, product.name, 'intimate wellness'],
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: product.image
        ? [
            {
              url: product.image,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product with reviews
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Serialize Decimal fields
  const serializedProduct = {
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
    benefits: Array.isArray(product.features) ? product.features : [],
    ingredients: [],
  };

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const serializedRelated = relatedProducts.map((p) => ({
    ...p,
    id: p.id.toString(),
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    rating: Number(p.rating),
    image: p.imageUrl || '',
    images: p.imageUrl ? [p.imageUrl] : [],
    inStock: true,
    featured: p.badge === 'Bestseller' || p.badge === 'Popular',
    new: p.badge === 'New',
    sustainable: false,
    benefits: Array.isArray(p.features) ? p.features : [],
    ingredients: [],
  }));

  return (
    <ProductDetailClient
      product={serializedProduct}
      relatedProducts={serializedRelated}
    />
  );
}
