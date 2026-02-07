import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@velorious.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }

        // Find admin in database
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        })

        if (!admin) {
          throw new Error('Invalid credentials')
        }

        // Verify password against hash
        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          admin.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        // Return user object
        return {
          id: admin.id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

/**
 * Helper function to hash a password for admin setup
 * Use this in a setup script to generate the ADMIN_PASSWORD_HASH
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}
