'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Home,
  HelpCircle,
  MessageSquare,
  Mail,
  ShoppingCart,
  Menu,
  X,
  LogOut,
} from 'lucide-react'

interface NavLink {
  label: string
  href: string
  icon: React.ReactNode
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Products', href: '/admin/products', icon: <Package size={20} /> },
  { label: 'Blog Posts', href: '/admin/blog', icon: <FileText size={20} /> },
  { label: 'Community', href: '/admin/community', icon: <Users size={20} /> },
  { label: 'Homepage Content', href: '/admin/content', icon: <Home size={20} /> },
  { label: 'FAQs', href: '/admin/faq', icon: <HelpCircle size={20} /> },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: <MessageSquare size={20} />,
  },
  { label: 'Subscribers', href: '/admin/subscribers', icon: <Mail size={20} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden bg-[#2C2C2C] text-white p-2.5 rounded-lg touch-manipulation shadow-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 max-w-[85vw] sm:w-60 sm:max-w-none bg-[#2C2C2C] text-white flex flex-col transition-transform duration-300 ease-out z-40 lg:static lg:z-auto lg:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-gray-700 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            VELORIOUS
            <span className="bg-[#8B9D83] text-white text-xs font-semibold px-2 py-1 rounded">
              Admin
            </span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/admin' && pathname.startsWith(link.href + '/'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 touch-manipulation ${
                    isActive
                      ? 'bg-[#8B9D83] text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-700" />

          {/* Settings section placeholder */}
          <div className="text-xs text-gray-500 font-semibold px-4 mb-3">SETTINGS</div>
          {/* Future: Settings links can go here */}
        </nav>

        {/* User Info & Sign Out */}
        {session?.user && (
          <div className="border-t border-gray-700 p-4">
            <div className="mb-4 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8B9D83] rounded-full flex items-center justify-center text-white font-semibold">
                  {session.user.email?.[0].toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
