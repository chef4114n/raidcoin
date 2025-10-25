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

    // Get user's wallet status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        walletAddress: true,
        id: true,
        name: true,
        twitterHandle: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      hasWallet: !!user.walletAddress,
      walletAddress: user.walletAddress,
      user: {
        id: user.id,
        name: user.name,
        twitterHandle: user.twitterHandle
      }
    });
  } catch (error) {
    console.error('Error checking wallet status:', error);
    return NextResponse.json(
      { error: 'Failed to check wallet status' },
      { status: 500 }
    );
  }
}