import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('=== LEADERBOARD API CALLED ===')
    
    // Check for wallet authentication via header or query parameter
    const walletAddress = request.headers.get('x-admin-wallet') || 
                         request.nextUrl.searchParams.get('wallet') ||
                         null
    
    console.log('Wallet address from request:', walletAddress)
    
    const REQUIRED_ADMIN_WALLET = process.env.CREATOR_WALLET_ADDRESS
    console.log('Required admin wallet:', REQUIRED_ADMIN_WALLET)
    
    // Check wallet-based authentication first
    if (walletAddress === REQUIRED_ADMIN_WALLET) {
      console.log('Wallet authentication successful')
    } else {
      // Fallback to session-based authentication
      const session = await getServerSession(authOptions)
      console.log('Session:', session?.user?.email)
      
      // Check if user is authenticated
      if (!session?.user?.email) {
        console.log('No session found and no valid wallet provided')
        return NextResponse.json({ error: 'Unauthorized - requires admin wallet or valid session' }, { status: 401 })
      }

      // Get user from database to check wallet
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { walletAddress: true }
      })
      
      console.log('User wallet address from session:', user?.walletAddress)
      
      // Check if user has the required admin wallet
      if (!user?.walletAddress || user.walletAddress !== REQUIRED_ADMIN_WALLET) {
        console.log('User does not have required admin wallet')
        return NextResponse.json({ error: 'Admin wallet required' }, { status: 403 })
      }
      
      console.log('Session authentication successful - user has admin wallet')
    }

    console.log('Fetching leaderboard data from database...')
    
    // First, let's check all users to see what we have
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        twitterHandle: true,
        totalPoints: true,
        totalEarned: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        totalPoints: 'desc'
      }
    })
    
    console.log(`Total users in database: ${allUsers.length}`)
    console.log('Users with any data:', allUsers.slice(0, 5).map(u => ({
      name: u.name,
      handle: u.twitterHandle,
      points: u.totalPoints,
      posts: u._count.posts
    })))
    
    // Fetch top 100 users by total points, including their post count
    const users = await prisma.user.findMany({
      where: {
        totalPoints: {
          gt: 0 // Only include users with points
        }
      },
      select: {
        id: true,
        name: true,
        twitterHandle: true,
        email: true,
        walletAddress: true,
        totalPoints: true,
        totalEarned: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        totalPoints: 'desc'
      },
      take: 100
    })

    console.log(`Found ${users.length} users with points`)

    // Transform the data to match the expected leaderboard format
    const leaderboard = users.map((user, index) => ({
      id: user.id,
      username: user.name || user.twitterHandle || 'Anonymous',
      twitterHandle: user.twitterHandle || '',
      email: user.email || '',
      walletAddress: user.walletAddress || null,
      totalPoints: user.totalPoints,
      totalRewards: Number(user.totalEarned.toFixed(4)),
      totalPosts: user._count.posts,
      status: 'active', // For now, assume all users are active
      rank: index + 1,
      lastActive: user.updatedAt.toISOString(),
      joinedAt: user.createdAt.toISOString()
    }))

    console.log('Leaderboard data prepared:', leaderboard.length, 'entries')

    return NextResponse.json({
      success: true,
      leaderboard,
      totalUsers: leaderboard.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}