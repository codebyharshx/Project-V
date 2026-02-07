import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ANONYMOUS_NAMES } from './constants'

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price value to EUR currency format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Convert a string to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (secondsAgo < 60) return 'just now'

  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`

  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`

  const daysAgo = Math.floor(hoursAgo / 24)
  if (daysAgo < 7) return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`

  const weeksAgo = Math.floor(daysAgo / 7)
  if (weeksAgo < 4) return `${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago`

  const monthsAgo = Math.floor(daysAgo / 30)
  if (monthsAgo < 12) return `${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago`

  const yearsAgo = Math.floor(monthsAgo / 12)
  return `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`
}

/**
 * Generate a random anonymous username
 */
export function generateAnonymousName(): string {
  return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)]
}
