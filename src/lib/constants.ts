// Brand Colors
export const COLORS = {
  cream: '#FAF7F2',
  sage: '#8B9D83',
  blush: '#D4A0A0',
  charcoal: '#2C2C2C',
  gold: '#D4AF37',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#E8E8E8',
  darkGray: '#7A7A7A',
  accentPink: '#E8B4C8',
  accentGreen: '#A8C8B8',
  accentBlue: '#B8C8E8',
} as const

// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'skincare', label: 'Skincare', slug: 'skincare' },
  { id: 'bodycare', label: 'Body Care', slug: 'body-care' },
  { id: 'haircare', label: 'Hair Care', slug: 'hair-care' },
  { id: 'fragrances', label: 'Fragrances', slug: 'fragrances' },
  { id: 'wellness', label: 'Wellness', slug: 'wellness' },
  { id: 'accessories', label: 'Accessories', slug: 'accessories' },
] as const

// Community Discussion Topics
export const COMMUNITY_TOPICS = [
  { id: 'skincare-routine', label: 'Skincare Routines', slug: 'skincare-routine' },
  { id: 'ingredient-spotlight', label: 'Ingredient Spotlight', slug: 'ingredient-spotlight' },
  { id: 'wellness-tips', label: 'Wellness Tips', slug: 'wellness-tips' },
  { id: 'beauty-hacks', label: 'Beauty Hacks', slug: 'beauty-hacks' },
  { id: 'product-reviews', label: 'Product Reviews', slug: 'product-reviews' },
  { id: 'sustainability', label: 'Sustainability', slug: 'sustainability' },
  { id: 'self-care', label: 'Self-Care Stories', slug: 'self-care' },
  { id: 'off-topic', label: 'Off Topic', slug: 'off-topic' },
] as const

// Anonymous Username Options (Fantasy/Mystical Theme)
export const ANONYMOUS_NAMES = [
  'SilentBlossom',
  'MoonlitSoul',
  'DuskWhisperer',
  'StardustDreamer',
  'SereneShadow',
  'NocturneWanderer',
  'TwilightMuse',
  'EchoingBreeze',
  'VioletVeil',
  'OpalSiren',
  'LunarLight',
  'SilkSerpent',
  'AmberAura',
  'EmeraldEyes',
  'IndigoIntuition',
  'CrimsonClarity',
  'PearlPalace',
  'SapphireSecret',
  'RoseRaven',
  'JadeJourney',
  'CosmicCrescent',
  'EnigmaEcho',
  'FrostFlower',
  'GoldenGhost',
  'HarmonicHeart',
  'IrisIllusion',
  'KaleidoscopeKnight',
  'LatentLight',
  'MysticMire',
  'NovaNavigator',
] as const

// Avatar Color Options
export const AVATAR_COLORS = [
  '#D4A0A0', // blush
  '#8B9D83', // sage
  '#E8B4C8', // accentPink
  '#A8C8B8', // accentGreen
  '#B8C8E8', // accentBlue
  '#D4AF37', // gold
  '#FFB6C1', // light pink
  '#98D8C8', // mint
  '#F7DC6F', // bright yellow
  '#BB8FCE', // lavender
] as const

// Pagination
export const ITEMS_PER_PAGE = 12
export const BLOG_POSTS_PER_PAGE = 6
export const COMMUNITY_POSTS_PER_PAGE = 10

// Site Metadata
export const SITE_NAME = 'Velorious'
export const SITE_DESCRIPTION = 'Sustainable luxury beauty and wellness products for the conscious lifestyle'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
] as const

// Footer Links
export const FOOTER_LINKS = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=skincare', label: 'Skincare' },
    { href: '/products?category=bodycare', label: 'Body Care' },
    { href: '/products?category=fragrances', label: 'Fragrances' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/sustainability', label: 'Sustainability' },
    { href: '/blog', label: 'Blog' },
    { href: '/careers', label: 'Careers' },
  ],
  support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/returns', label: 'Returns & Exchanges' },
    { href: '/shipping', label: 'Shipping Info' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
} as const

// Social Media Links
export const SOCIAL_LINKS = [
  { platform: 'instagram', url: 'https://instagram.com/velorious' },
  { platform: 'twitter', url: 'https://twitter.com/velorious' },
  { platform: 'facebook', url: 'https://facebook.com/velorious' },
  { platform: 'pinterest', url: 'https://pinterest.com/velorious' },
] as const
