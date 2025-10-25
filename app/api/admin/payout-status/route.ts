import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { solanaPaymentService } from '@/lib/solana';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }

    // Get user and check if their wallet matches creator wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return NextResponse.json({ error: 'No wallet connected' }, { status: 403 });
    }

    // Check if user's wallet matches the creator wallet
    const creatorWalletAddress = process.env.CREATOR_WALLET_ADDRESS;
    const isAdmin = user.walletAddress === creatorWalletAddress;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required - Creator wallet only' }, { status: 403 });
    }

    // Get payout system status
    const status = {
      system: {
        solanaNetwork: process.env.SOLANA_NETWORK || 'mainnet-beta',
        creatorWallet: process.env.CREATOR_WALLET_ADDRESS,
        payoutInterval: '10 minutes (via Vercel cron)',
        creatorFeePercentage: process.env.CREATOR_FEE_PERCENTAGE || '5',
      },
      wallet: {
        payerAddress: null as string | null,
        balance: null as number | null,
        balanceError: null as string | null,
      },
      database: {
        totalUsers: 0,
        usersWithWallets: 0,
        usersWithPoints: 0,
        totalPayouts: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
        failedPayouts: 0,
      },
      recentActivity: {
        recentPayouts: [] as any[],
        recentLogs: [] as any[],
      }
    };

    // Get wallet info
    try {
      const balance = await solanaPaymentService.getBalance();
      status.wallet.balance = balance;
      status.wallet.payerAddress = process.env.SOLANA_PRIVATE_KEY ? 'Configured' : 'Not configured';
    } catch (error: any) {
      status.wallet.balanceError = error.message;
    }

    // Get database stats
    const [
      totalUsers,
      usersWithWallets,
      usersWithPoints,
      totalPayouts,
      pendingPayouts,
      completedPayouts,
      failedPayouts,
      recentPayouts,
      recentLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { walletAddress: { not: null } } }),
      prisma.user.count({ where: { totalPoints: { gt: 0 } } }),
      prisma.payout.count(),
      prisma.payout.count({ where: { status: 'PROCESSING' } }),
      prisma.payout.count({ where: { status: 'COMPLETED' } }),
      prisma.payout.count({ where: { status: 'FAILED' } }),
      prisma.payout.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { twitterHandle: true, name: true }
          }
        }
      }),
      prisma.processingLog.findMany({
        where: { type: 'payout_process' },
        take: 10,
        orderBy: { startedAt: 'desc' }
      })
    ]);

    status.database = {
      totalUsers,
      usersWithWallets,
      usersWithPoints,
      totalPayouts,
      pendingPayouts,
      completedPayouts,
      failedPayouts,
    };

    status.recentActivity = {
      recentPayouts,
      recentLogs,
    };

    return NextResponse.json({
      success: true,
      status,
      message: 'Payout system status retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error getting payout status:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      details: 'Failed to get payout system status'
    }, { status: 500 });
  }
}

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

    // Get user and check if their wallet matches creator wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return NextResponse.json({ error: 'No wallet connected' }, { status: 403 });
    }

    // Check if user's wallet matches the creator wallet
    const creatorWalletAddress = process.env.CREATOR_WALLET_ADDRESS;
    const isAdmin = user.walletAddress === creatorWalletAddress;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required - Creator wallet only' }, { status: 403 });
    }

    const { action } = await request.json();

    if (action === 'trigger_payout') {
      // Manually trigger a payout process
      const payoutResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/process-payouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const payoutResult = await payoutResponse.json();

      return NextResponse.json({
        success: payoutResponse.ok,
        message: payoutResponse.ok ? 'Payout process triggered successfully' : 'Failed to trigger payout process',
        data: payoutResult
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in payout admin:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      details: 'Failed to process payout admin request'
    }, { status: 500 });
  }
}