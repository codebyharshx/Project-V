// Product Type (matches Prisma schema with optional backward-compat fields)
export interface Product {
  id: number | string
  name: string
  slug: string
  category: string
  price: number
  originalPrice?: number | null
  description: string
  longDescription: string
  features: unknown
  rating: number
  reviewCount: number
  badge?: string | null
  imageUrl?: string | null
  color: string
  icon: string
  active: boolean
  createdAt: string
  updatedAt: string
  // Backward-compatible fields for client components
  image?: string
  images?: string[]
  inStock?: boolean
  featured?: boolean
  new?: boolean
  sustainable?: boolean
  benefits?: string[]
  ingredients?: string[]
  volume?: string
  weight?: string
  skinType?: string[]
  scent?: string
}

// Blog Post Type
export interface BlogPost {
  id: number | string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  authorInit?: string
  tag: string
  tagIcon?: string
  readTime?: string
  featured?: boolean
  imageUrl?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

// Community Reply Type
export interface CommunityReply {
  id: string
  content: string
  author: string
  authorId?: string
  createdAt: string
  likes: number
  liked?: boolean
}

// Community Post Type
export interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorId?: string
  topic: string
  image?: string
  replies: CommunityReply[]
  replyCount: number
  likes: number
  liked?: boolean
  createdAt: string
  avatarColor?: string
  avatarInitial?: string
  verified?: boolean
  updatedAt: string
}

// Testimonial Type
export interface Testimonial {
  id: string
  author: string
  title?: string
  content: string
  rating: number
  image?: string
  productId?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

// FAQ Type
export interface Faq {
  id: string
  question: string
  answer: string
  category: string
  order: number
  createdAt: string
  updatedAt: string
}

// Cart Item Type
export interface CartItem {
  product: Product
  quantity: number
}

// Order Type
export interface Order {
  id: string
  userId?: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  customerEmail: string
  customerName: string
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

// Editable Site Content Types
export interface SiteContent {
  id: string
  key: string
  value: string
  type: 'text' | 'html' | 'json'
  updatedAt: string
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
}

export interface AboutContent {
  title: string
  description: string
  mission: string
  values: string[]
  image: string
}

// User Type
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

// Review Type (matches Prisma schema with backward-compat fields)
export interface Review {
  id: number | string
  productId: number | string
  stars: number
  text: string
  author: string
  verified: boolean
  createdAt: string
  // Backward-compatible fields for client components
  title: string
  content: string
  rating: number
}

// Newsletter Subscription Type
export interface NewsletterSubscription {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  subscribedAt: string
  unsubscribedAt?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
