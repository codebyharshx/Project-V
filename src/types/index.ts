// Product Type
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images: string[]
  ingredients: string[]
  benefits: string[]
  skinType?: string[]
  scent?: string
  volume?: string
  weight?: string
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  new: boolean
  sustainable: boolean
  createdAt: string
  updatedAt: string
}

// Blog Post Type
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  image: string
  tags: string[]
  published: boolean
  publishedAt: string
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

// Review Type
export interface Review {
  id: string
  productId: string
  rating: number
  title: string
  content: string
  author: string
  verified: boolean
  helpful: number
  createdAt: string
  updatedAt: string
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
