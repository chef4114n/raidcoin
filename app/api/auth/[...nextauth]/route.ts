import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback - Account:', account?.provider);
      if (account?.provider === 'twitter') {
        try {
          // Update user with Twitter-specific information
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twitterId: account.providerAccountId,
              twitterHandle: (profile as any)?.username || (profile as any)?.data?.username,
            },
          })
          console.log('User updated successfully');
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
  session: {
    strategy: 'database',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }