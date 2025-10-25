import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { twitterApi } from '@/lib/twitter';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }

    const { tweetUrl } = await request.json();

    if (!tweetUrl) {
      return NextResponse.json({ error: 'Tweet URL is required' }, { status: 400 });
    }

    // Extract tweet ID from URL
    const tweetIdMatch = tweetUrl.match(/status\/(\d+)/);
    if (!tweetIdMatch) {
      return NextResponse.json({ error: 'Invalid Twitter URL format' }, { status: 400 });
    }

    const tweetId = tweetIdMatch[1];

    // Check if tweet already exists
    const existingPost = await prisma.post.findUnique({
      where: { tweetId }
    });

    if (existingPost) {
      return NextResponse.json({ error: 'Tweet already submitted' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Try to fetch tweet details from API (if available)
      const tweet = await twitterApi.getTweetById(tweetId);
      
      // Verify tweet mentions $raidcoin
      const content = tweet.text.toLowerCase();
      const hasRaidcoinMention = content.includes('$raidcoin') || 
                                content.includes('#raidcoin') || 
                                content.includes('@raidcoin');

      if (!hasRaidcoinMention) {
        return NextResponse.json({ 
          error: 'Tweet must mention $raidcoin, #raidcoin, or @raidcoin' 
        }, { status: 400 });
      }

      // Verify user owns the tweet
      if (tweet.author?.username !== user.twitterHandle) {
        return NextResponse.json({ 
          error: 'You can only submit your own tweets' 
        }, { status: 400 });
      }

      // Create post record
      const post = await prisma.post.create({
        data: {
          tweetId: tweet.id,
          userId: user.id,
          content: tweet.text,
          authorHandle: tweet.author?.username || '',
          authorName: tweet.author?.name || '',
          authorImage: tweet.author?.profile_image_url || '',
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
          quotes: tweet.public_metrics.quote_count,
          url: tweetUrl,
          tweetCreatedAt: new Date(tweet.created_at),
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Tweet submitted successfully',
        post: {
          id: post.id,
          content: post.content,
          likes: post.likes,
          retweets: post.retweets,
          replies: post.replies,
        }
      });

    } catch (apiError) {
      // If API fails, fall back to manual submission
      console.log('API unavailable, using manual submission mode');
      
      // Create post with placeholder data
      const post = await prisma.post.create({
        data: {
          tweetId,
          userId: user.id,
          content: `Manually submitted tweet: ${tweetUrl}`,
          authorHandle: user.twitterHandle || 'unknown',
          authorName: user.name || 'Unknown User',
          authorImage: user.image,
          likes: 0, // Will be updated manually or via periodic checks
          retweets: 0,
          replies: 0,
          quotes: 0,
          url: tweetUrl,
          tweetCreatedAt: new Date(),
          // Mark as manually submitted for different processing
          lastProcessed: null,
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Tweet submitted for manual review',
        post: {
          id: post.id,
          content: post.content,
          note: 'Engagement metrics will be updated during periodic reviews'
        }
      });
    }

  } catch (error) {
    console.error('Error submitting tweet:', error);
    return NextResponse.json(
      { error: 'Failed to submit tweet' },
      { status: 500 }
    );
  }
}