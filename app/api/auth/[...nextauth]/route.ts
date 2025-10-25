import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export default NextAuth({
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
      if (account?.provider === 'twitter') {
        try {
          // Update user with Twitter-specific information
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twitterId: account.providerAccountId,
              twitterHandle: profile?.username,
            },
          })
        } catch (error) {
          console.error('Error updating user Twitter info:', error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
})