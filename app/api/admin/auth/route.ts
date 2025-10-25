import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }

    // Get user's wallet address
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return NextResponse.json({ 
        error: 'No wallet connected',
        isAdmin: false,
        hasWallet: false
      }, { status: 403 });
    }

    // Check if user's wallet matches the creator wallet
    const creatorWalletAddress = process.env.CREATOR_WALLET_ADDRESS;
    const isAdmin = user.walletAddress === creatorWalletAddress;

    return NextResponse.json({
      isAdmin,
      hasWallet: true,
      walletAddress: user.walletAddress,
      creatorWallet: creatorWalletAddress
    });

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}