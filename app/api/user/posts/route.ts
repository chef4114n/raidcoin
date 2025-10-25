import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      orderBy: { tweetCreatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        content: true,
        url: true,
        likes: true,
        retweets: true,
        replies: true,
        pointsAwarded: true,
        tweetCreatedAt: true,
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}