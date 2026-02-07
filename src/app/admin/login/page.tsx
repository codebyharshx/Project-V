'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('admin@velorious.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin')
    }
  }, [status, router])

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError('Invalid credentials. Please try again.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok) {
        setError('Invalid email or password')
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state only on server or when session is loading
  const showForm = mounted && status !== 'loading'

  return (
    <div className="flex items-center justify-center min-h-screen min-h-[100dvh] bg-[#FAF7F2] px-4 py-8 sm:py-12">
      <div
        className="w-full max-w-md transition-opacity duration-300"
        style={{ opacity: showForm ? 1 : 0 }}
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-2">
            VELORIOUS
          </h1>
          <p className="text-[#8B9D83] font-semibold text-sm sm:text-base">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] focus:border-transparent transition"
              placeholder="admin@velorious.com"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] focus:border-transparent transition pr-12"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B9D83] hover:bg-[#7a8a73] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 touch-manipulation min-h-[48px]"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Velorious Admin Dashboard
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#FAF7F2]" />
    }>
      <AdminLoginContent />
    </Suspense>
  )
}
