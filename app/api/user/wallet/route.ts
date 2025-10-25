import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { solanaPaymentService } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Validate Solana address
    if (!solanaPaymentService.constructor.isValidAddress(walletAddress)) {
      return NextResponse.json({ error: 'Invalid Solana address' }, { status: 400 });
    }

    // Update user's wallet address
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { walletAddress }
    });

    return NextResponse.json({ success: true, walletAddress: user.walletAddress });
  } catch (error) {
    console.error('Error updating wallet address:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet address' },
      { status: 500 }
    );
  }
}