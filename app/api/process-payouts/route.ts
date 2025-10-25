import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { solanaPaymentService } from '@/lib/solana';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function for calculating payouts
function calculatePayouts(
  users: Array<{ id: string; totalPoints: number; walletAddress: string | null }>,
  totalRewardPool: number,
  creatorFeePercentage: number = 5
): Array<{ userId: string; amount: number; creatorFee: number }> {
  const usersWithWallets = users.filter(user => user.walletAddress && user.totalPoints > 0);
  
  if (usersWithWallets.length === 0) {
    return [];
  }

  const totalPoints = usersWithWallets.reduce((sum, user) => sum + user.totalPoints, 0);
  
  if (totalPoints === 0) {
    return [];
  }

  const creatorFeeAmount = (totalRewardPool * creatorFeePercentage) / 100;
  const remainingRewardPool = totalRewardPool - creatorFeeAmount;

  return usersWithWallets.map(user => ({
    userId: user.id,
    amount: (user.totalPoints / totalPoints) * remainingRewardPool,
    creatorFee: (user.totalPoints / totalPoints) * creatorFeeAmount,
  }));
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting payout process...');

    // Get configuration
    const creatorFeePercentage = parseInt(process.env.CREATOR_FEE_PERCENTAGE || '5');
    const totalRewardPool = 1; // 1 SOL for testing - adjust based on your needs

    // Define the period (last 10 minutes to last payout)
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 10 * 60 * 1000); // 10 minutes ago

    // Get users with points and wallet addresses
    const usersWithPoints = await prisma.user.findMany({
      where: {
        totalPoints: { gt: 0 },
        walletAddress: { not: null }
      },
      select: {
        id: true,
        totalPoints: true,
        walletAddress: true,
        twitterHandle: true,
      }
    });

    if (usersWithPoints.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users eligible for payout',
        data: { payoutsProcessed: 0 }
      });
    }

    // Calculate payout amounts
    const payoutCalculations = calculatePayouts(
      usersWithPoints,
      totalRewardPool,
      creatorFeePercentage
    );

    console.log(`Processing payouts for ${payoutCalculations.length} users`);

    let successfulPayouts = 0;
    let failedPayouts = 0;
    let totalPaidOut = 0;
    let totalCreatorFees = 0;

    // Process each payout
    for (const calc of payoutCalculations) {
      try {
        const user = usersWithPoints.find((u: any) => u.id === calc.userId);
        if (!user || !user.walletAddress) continue;

        // Create payout record
        const payout = await prisma.payout.create({
          data: {
            userId: calc.userId,
            amount: calc.amount,
            solanaAmount: calc.amount,
            status: 'PROCESSING',
            periodStart,
            periodEnd,
            totalPoints: user.totalPoints,
            totalPoolPoints: usersWithPoints.reduce((sum: number, u: any) => sum + u.totalPoints, 0),
            creatorFee: calc.creatorFee,
          }
        });

        // Send payment
        const paymentResult = await solanaPaymentService.sendPayment({
          recipientAddress: user.walletAddress,
          amount: calc.amount,
          userId: calc.userId,
          periodStart,
          periodEnd,
        });

        if (paymentResult.success) {
          // Update payout record with success
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: 'COMPLETED',
              txSignature: paymentResult.signature,
              processedAt: new Date(),
            }
          });

          // Update user's total earned
          await prisma.user.update({
            where: { id: calc.userId },
            data: {
              totalEarned: { increment: calc.amount }
            }
          });

          successfulPayouts++;
          totalPaidOut += calc.amount;
          totalCreatorFees += calc.creatorFee;

          console.log(`✅ Paid ${calc.amount} SOL to ${user.twitterHandle} (${user.walletAddress})`);
        } else {
          // Update payout record with failure
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: 'FAILED',
              processedAt: new Date(),
            }
          });

          failedPayouts++;
          console.error(`❌ Failed to pay ${user.twitterHandle}: ${paymentResult.error}`);
        }

      } catch (error) {
        failedPayouts++;
        console.error(`Error processing payout for user ${calc.userId}:`, error);
      }
    }

    // Send creator fee if there were successful payouts
    let creatorFeeResult = null;
    if (totalCreatorFees > 0) {
      creatorFeeResult = await solanaPaymentService.sendCreatorFee(totalCreatorFees);
      if (creatorFeeResult.success) {
        console.log(`✅ Sent creator fee: ${totalCreatorFees} SOL`);
      } else {
        console.error(`❌ Failed to send creator fee: ${creatorFeeResult.error}`);
      }
    }

    // Reset user points after successful payout period
    if (successfulPayouts > 0) {
      await prisma.user.updateMany({
        where: {
          id: { in: payoutCalculations.map((p: any) => p.userId) }
        },
        data: {
          totalPoints: 0
        }
      });

      console.log(`Reset points for ${payoutCalculations.length} users`);
    }

    // Log the processing result
    await prisma.processingLog.create({
      data: {
        type: 'payout_process',
        status: failedPayouts > 0 ? 'completed_with_errors' : 'completed',
        message: `Processed ${successfulPayouts + failedPayouts} payouts, ${successfulPayouts} successful, ${failedPayouts} failed`,
        data: {
          totalUsers: payoutCalculations.length,
          successfulPayouts,
          failedPayouts,
          totalPaidOut,
          totalCreatorFees,
          creatorFeeSuccess: creatorFeeResult?.success || false,
        },
        completedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${successfulPayouts + failedPayouts} payouts`,
      data: {
        totalUsers: payoutCalculations.length,
        successfulPayouts,
        failedPayouts,
        totalPaidOut,
        totalCreatorFees,
        creatorFeeSuccess: creatorFeeResult?.success || false,
      }
    });

  } catch (error) {
    console.error('Error in payout process:', error);

    // Log the error
    await prisma.processingLog.create({
      data: {
        type: 'payout_process',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      }
    });

    return NextResponse.json(
      { success: false, error: 'Failed to process payouts' },
      { status: 500 }
    );
  }
}