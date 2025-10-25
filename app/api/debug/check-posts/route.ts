import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to connect to database...');
    
    // First, try to connect and get basic info
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    // Get all posts
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            twitterHandle: true,
            email: true,
            walletAddress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${allPosts.length} posts in database`);
    
    // Check pending posts (same query as admin panel)
    const pendingPosts = await prisma.post.findMany({
      where: {
        OR: [
          { pointsAwarded: 0 },
          { lastProcessed: null }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            twitterHandle: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalPosts: allPosts.length,
        pendingPosts: pendingPosts.length,
        posts: allPosts.map((post: any) => ({
          id: post.id,
          tweetId: post.tweetId,
          content: post.content.substring(0, 100) + '...',
          user: post.user.name + ' (@' + post.user.twitterHandle + ')',
          pointsAwarded: post.pointsAwarded,
          lastProcessed: post.lastProcessed,
          createdAt: post.createdAt
        })),
        pendingPostsDetails: pendingPosts.map((post: any) => ({
          id: post.id,
          tweetId: post.tweetId,
          content: post.content.substring(0, 100) + '...',
          user: post.user.name + ' (@' + post.user.twitterHandle + ')',
          pointsAwarded: post.pointsAwarded,
          lastProcessed: post.lastProcessed,
          createdAt: post.createdAt
        }))
      }
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      details: 'Failed to connect to database or query posts'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}