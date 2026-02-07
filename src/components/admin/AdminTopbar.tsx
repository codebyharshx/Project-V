'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'

const routeTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/blog': 'Blog Posts',
  '/admin/community': 'Community',
  '/admin/content': 'Homepage Content',
  '/admin/faq': 'FAQs',
  '/admin/testimonials': 'Testimonials',
  '/admin/subscribers': 'Subscribers',
  '/admin/orders': 'Orders',
}

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.startsWith('/admin/orders/')) return 'Order Details'
  if (pathname.startsWith('/admin/products/new')) return 'New Product'
  if (pathname.startsWith('/admin/products/')) return 'Edit Product'
  if (pathname.startsWith('/admin/blog/new')) return 'New Blog Post'
  if (pathname.startsWith('/admin/blog/')) return 'Edit Blog Post'
  return 'Admin'
}

export default function AdminTopbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const pageTitle = getPageTitle(pathname)

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 pl-14 sm:pl-4 lg:px-8 sticky top-0 z-20 min-w-0 shrink-0">
      {/* Left: Page Title */}
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2C2C2C] truncate">{pageTitle}</h1>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:text-[#2C2C2C] transition touch-manipulation" aria-label="Notifications">
          <Bell size={20} className="sm:w-6 sm:h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
        </button>

        {/* Admin Info */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 lg:pl-6 border-l border-gray-200">
          <div className="text-right hidden sm:block max-w-[120px] md:max-w-[180px] lg:max-w-none">
            <p className="text-sm font-medium text-[#2C2C2C] truncate">
              {session?.user?.email || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B9D83] rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {session?.user?.email?.[0].toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  )
}
