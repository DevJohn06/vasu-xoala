import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users, admins, type UserRole } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole | 'ADMIN'
      pageSlug: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole | 'ADMIN'
    pageSlug: string | null
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "admin",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        
        try {
          const adminArr = await db.select().from(admins).where(eq(admins.username, credentials.username as string)).limit(1)
          const admin = adminArr[0]
          
          if (!admin) return null

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            admin.password
          )

          if (passwordsMatch) {
            return {
              id: `admin-${admin.id}`,
              name: admin.username,
              role: 'ADMIN',
              pageSlug: null,
            }
          }
          return null
        } catch (error) {
          console.error("Admin Auth Error:", error)
          return null
        }
      },
    }),
    Credentials({
      id: "pin",
      name: "PIN Access",
      credentials: {
        pin: { label: "Security PIN", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.pin) return null

        try {
          const userArr = await db.select().from(users).where(eq(users.pin, credentials.pin as string)).limit(1)
          const user = userArr[0]

          if (!user || user.status !== 'active') return null

          return {
            id: `user-${user.id}`,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role as UserRole,
            pageSlug: user.pageSlug,
          }
        } catch (error) {
          console.error("PIN Auth Error:", error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.pageSlug = user.pageSlug
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as UserRole | 'ADMIN'
        session.user.pageSlug = token.pageSlug as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day decay
  },
  secret: process.env.AUTH_SECRET || "dummy-secret-for-dev",
})
