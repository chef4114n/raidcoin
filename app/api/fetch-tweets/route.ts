import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { twitterApi } from '@/lib/twitter';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting tweet fetch process...');

    // Get the last processed tweet ID to avoid duplicates
    const lastProcessedTweet = await prisma.post.findFirst({
      orderBy: { tweetCreatedAt: 'desc' },
      select: { tweetId: true }
    });

    const searchOptions = {
      maxResults: 100,
      ...(lastProcessedTweet && { sinceId: lastProcessedTweet.tweetId })
    };

    const twitterResponse = await twitterApi.searchTweets(searchOptions);
    const tweets = twitterResponse.data || [];

    console.log(`Found ${tweets.length} new tweets`);

    let processedCount = 0;
    let newUsersCount = 0;

    for (const tweet of tweets) {
      try {
        if (!tweet.author) continue;

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { twitterId: tweet.author.id }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              twitterId: tweet.author.id,
              twitterHandle: tweet.author.username,
              name: tweet.author.name,
              image: tweet.author.profile_image_url,
            }
          });
          newUsersCount++;
        } else {
          // Update user info if it has changed
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twitterHandle: tweet.author.username,
              name: tweet.author.name,
              image: tweet.author.profile_image_url,
            }
          });
        }

        // Check if tweet already exists
        const existingPost = await prisma.post.findUnique({
          where: { tweetId: tweet.id }
        });

        if (!existingPost) {
          // Create new post
          await prisma.post.create({
            data: {
              tweetId: tweet.id,
              userId: user.id,
              content: tweet.text,
              authorHandle: tweet.author.username,
              authorName: tweet.author.name,
              authorImage: tweet.author.profile_image_url,
              likes: tweet.public_metrics.like_count,
              retweets: tweet.public_metrics.retweet_count,
              replies: tweet.public_metrics.reply_count,
              quotes: tweet.public_metrics.quote_count,
              url: `https://twitter.com/${tweet.author.username}/status/${tweet.id}`,
              tweetCreatedAt: new Date(tweet.created_at),
            }
          });
          processedCount++;
        } else {
          // Update engagement metrics for existing post
          await prisma.post.update({
            where: { id: existingPost.id },
            data: {
              likes: tweet.public_metrics.like_count,
              retweets: tweet.public_metrics.retweet_count,
              replies: tweet.public_metrics.reply_count,
              quotes: tweet.public_metrics.quote_count,
            }
          });
        }
      } catch (error) {
        console.error(`Error processing tweet ${tweet.id}:`, error);
      }
    }

    // Log the processing result
    await prisma.processingLog.create({
      data: {
        type: 'tweet_fetch',
        status: 'completed',
        message: `Processed ${processedCount} new tweets, created ${newUsersCount} new users`,
        data: {
          totalTweets: tweets.length,
          processedTweets: processedCount,
          newUsers: newUsersCount,
        },
        completedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} new tweets`,
      data: {
        totalTweets: tweets.length,
        processedTweets: processedCount,
        newUsers: newUsersCount,
      }
    });

  } catch (error) {
    console.error('Error in tweet fetch:', error);

    // Log the error
    await prisma.processingLog.create({
      data: {
        type: 'tweet_fetch',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      }
    });

    return NextResponse.json(
      { success: false, error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}