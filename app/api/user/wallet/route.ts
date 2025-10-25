import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PublicKey } from '@solana/web3.js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to validate Solana address
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== WALLET API DEBUG ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await getServerSession(authOptions);
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    if (!session.user) {
      console.log('❌ No user in session');
      return NextResponse.json({ error: 'No user in session' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    if (!userId) {
      console.log('❌ No user ID in session');
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }
    
    console.log('✅ Session valid, user ID:', userId);

    const requestBody = await request.json();
    console.log('Request body:', requestBody);
    const { walletAddress } = requestBody;
    console.log('Wallet address from request:', walletAddress);

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Validate Solana address
    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: 'Invalid Solana address' }, { status: 400 });
    }

    // Update user's wallet address
    const user = await prisma.user.update({
      where: { id: userId },
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