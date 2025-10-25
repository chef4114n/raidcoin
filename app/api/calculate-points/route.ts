import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { twitterApi } from '@/lib/twitter';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting point calculation process...');

    // Get all posts that haven't been processed or need recalculation
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { lastProcessed: null },
          { lastProcessed: { lt: new Date(Date.now() - 10 * 60 * 1000) } } // 10 minutes ago
        ]
      },
      include: {
        user: true
      }
    });

    console.log(`Processing ${posts.length} posts for point calculation`);

    let totalPointsAwarded = 0;
    const userPointsMap = new Map<string, number>();

    for (const post of posts) {
      try {
        // Calculate engagement score
        const engagementScore = twitterApi.calculateEngagementScore({
          like_count: post.likes,
          retweet_count: post.retweets,
          reply_count: post.replies,
          quote_count: post.quotes
        });

        // Calculate additional points based on time decay (newer posts get slight bonus)
        const postAge = Date.now() - new Date(post.tweetCreatedAt).getTime();
        const ageInHours = postAge / (1000 * 60 * 60);
        const timeBonusMultiplier = Math.max(0.5, 1 - (ageInHours / (24 * 7))); // Decay over a week

        const finalPoints = Math.floor(engagementScore * timeBonusMultiplier);
        const pointsDelta = finalPoints - post.pointsAwarded;

        if (pointsDelta !== 0) {
          // Update post points
          await prisma.post.update({
            where: { id: post.id },
            data: {
              pointsAwarded: finalPoints,
              lastProcessed: new Date()
            }
          });

          // Create point history entry
          await prisma.pointHistory.create({
            data: {
              userId: post.userId,
              postId: post.id,
              points: pointsDelta,
              reason: 'tweet_engagement',
              description: `Engagement update: ${post.likes} likes, ${post.retweets} retweets, ${post.replies} replies, ${post.quotes} quotes`
            }
          });

          // Track user points for batch update
          const currentUserPoints = userPointsMap.get(post.userId) || 0;
          userPointsMap.set(post.userId, currentUserPoints + pointsDelta);
          
          totalPointsAwarded += pointsDelta;
        } else {
          // Just update last processed time
          await prisma.post.update({
            where: { id: post.id },
            data: { lastProcessed: new Date() }
          });
        }
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
      }
    }

    // Batch update user total points
    for (const [userId, pointsDelta] of userPointsMap.entries()) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalPoints: {
              increment: pointsDelta
            }
          }
        });
      } catch (error) {
        console.error(`Error updating user ${userId} points:`, error);
      }
    }

    // Log the processing result
    await prisma.processingLog.create({
      data: {
        type: 'point_calculation',
        status: 'completed',
        message: `Calculated points for ${posts.length} posts, awarded ${totalPointsAwarded} total points`,
        data: {
          processedPosts: posts.length,
          totalPointsAwarded,
          affectedUsers: userPointsMap.size,
        },
        completedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${posts.length} posts`,
      data: {
        processedPosts: posts.length,
        totalPointsAwarded,
        affectedUsers: userPointsMap.size,
      }
    });

  } catch (error) {
    console.error('Error in point calculation:', error);

    // Log the error
    await prisma.processingLog.create({
      data: {
        type: 'point_calculation',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      }
    });

    return NextResponse.json(
      { success: false, error: 'Failed to calculate points' },
      { status: 500 }
    );
  }
}