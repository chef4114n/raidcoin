import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Simple fetch wrapper for Supabase-style queries
async function supabaseQuery(table: string, query: any = {}) {
  // This is a simplified version - in a real implementation you'd want proper Supabase client
  // For now, we'll return mock data to demonstrate the structure
  return { data: [], error: null }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (creator wallet holder)
    const adminEmail = process.env.ADMIN_EMAIL
    if (session.user.email !== adminEmail) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Mock data for demonstration - replace with actual database queries
    const mockRaiders = [
      {
        id: '1',
        name: 'Crypto Raider 1',
        twitterHandle: 'cryptoraider1',
        email: 'raider1@example.com',
        walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRe',
        totalPoints: 15420,
        totalEarned: 2.5847,
        tweetCount: 23,
        lastActive: new Date().toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'SOL Builder',
        twitterHandle: 'solbuilder',
        email: 'builder@example.com',
        walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        totalPoints: 12890,
        totalEarned: 2.1654,
        tweetCount: 19,
        lastActive: new Date().toISOString(),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Raid Master',
        twitterHandle: 'raidmaster',
        email: 'master@example.com',
        walletAddress: 'A4jQ7kzN2L8vB5mR9pXtYwE6sH3cF7dG1uI8qT4rK9oP',
        totalPoints: 11230,
        totalEarned: 1.8893,
        tweetCount: 17,
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Alpha Raider',
        twitterHandle: 'alpharaider',
        email: 'alpha@example.com',
        walletAddress: 'B8sT5mV3X9wF2nL6pQ4rY7eH1aS9dG6tK3uI2oP5cM8N',
        totalPoints: 9840,
        totalEarned: 1.6532,
        tweetCount: 15,
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Degen Farmer',
        twitterHandle: 'degenfarmer',
        email: 'degen@example.com',
        walletAddress: null, // Example of user without wallet
        totalPoints: 8760,
        totalEarned: 1.4721,
        tweetCount: 13,
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      raiders: mockRaiders
    })

  } catch (error) {
    console.error('Error in raiders breakdown API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}