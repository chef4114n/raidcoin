import NextAuth, { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      // When using database sessions, user data comes from the database
      if (user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            email: user.email, // Explicitly include email from database
            name: user.name,
            image: user.image,
          },
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback - Account:', account?.provider);
      console.log('SignIn callback - Profile:', profile);
      console.log('SignIn callback - User:', user);
      
      if (account?.provider === 'twitter') {
        try {
          // Twitter OAuth 2.0 might not provide email, so we create a synthetic one
          const twitterHandle = (profile as any)?.username || (profile as any)?.data?.username || account.providerAccountId;
          const syntheticEmail = user.email || `${twitterHandle}@twitter.oauth`;
          
          // Update user with Twitter-specific information
          await prisma.user.update({
            where: { id: user.id },
            data: {
              email: syntheticEmail, // Ensure email is set
              twitterId: account.providerAccountId,
              twitterHandle: twitterHandle,
              name: user.name || (profile as any)?.name || twitterHandle,
            },
          })
          console.log('User updated successfully with email:', syntheticEmail);
        } catch (error) {
          console.error('Error updating user Twitter info:', error)
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - URL:', url, 'BaseURL:', baseUrl);
      // Handles redirect after sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows relative callback URLs
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }