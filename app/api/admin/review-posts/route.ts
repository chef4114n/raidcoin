import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and check if they're an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    // For now, you can manually set admin users or check a specific email
    const isAdmin = session.user.email === 'your-admin-email@example.com'; // Change this to your email

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get pending posts that need manual review
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

    return NextResponse.json(pendingPosts);
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'your-admin-email@example.com'; // Change this to your email

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { postId, likes, retweets, replies, quotes, approved } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    if (approved) {
      // Calculate points based on engagement
      const engagementScore = (
        (likes * 1) +
        (retweets * 3) +
        (replies * 2) +
        (quotes * 3)
      );
      const finalPoints = Math.max(engagementScore, 1); // Minimum 1 point

      // Update post with engagement data and points
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likes: likes || 0,
          retweets: retweets || 0,
          replies: replies || 0,
          quotes: quotes || 0,
          pointsAwarded: finalPoints,
          lastProcessed: new Date()
        }
      });

      // Update user's total points
      await prisma.user.update({
        where: { id: updatedPost.userId },
        data: {
          totalPoints: { increment: finalPoints }
        }
      });

      // Create point history entry
      await prisma.pointHistory.create({
        data: {
          userId: updatedPost.userId,
          postId: updatedPost.id,
          points: finalPoints,
          reason: 'manual_review',
          description: `Manual review: ${likes} likes, ${retweets} retweets, ${replies} replies, ${quotes} quotes`
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Post approved and points awarded',
        pointsAwarded: finalPoints
      });
    } else {
      // Reject the post
      await prisma.post.delete({
        where: { id: postId }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Post rejected and removed'
      });
    }

  } catch (error) {
    console.error('Error processing manual review:', error);
    return NextResponse.json(
      { error: 'Failed to process review' },
      { status: 500 }
    );
  }
}