import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const RAIDCOIN_MINT = process.env.RAIDCOIN_TOKEN_MINT || '61QMuj4oqqNsStRx1KPWuV5uvvYWpkvUdtNHG8u6pump';
const MINIMUM_TOKENS = 500000; // 500k tokens

// Wallets excluded from minimum token requirement
const EXCLUDED_WALLETS = [
  '4J2SZMhWjzx2WJrhEwtBFnL49rNK6JpSy1NLzhvfr2xB'
];

// Multiple RPC endpoints for fallback
const RPC_ENDPOINTS = [
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.g.alchemy.com/v2/demo'
];

async function getConnectionWithFallback(): Promise<Connection> {
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint, {
        commitment: 'confirmed',
        httpHeaders: {
          'User-Agent': 'RaidCoin-App/1.0'
        }
      });
      
      // Test the connection with a simple call
      await connection.getSlot();
      console.log('Successfully connected to RPC:', endpoint);
      return connection;
    } catch (error) {
      console.warn('Failed to connect to RPC:', endpoint, error);
      continue;
    }
  }
  
  throw new Error('All RPC endpoints are unavailable');
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    console.log('Checking token balance for wallet:', walletAddress);
    console.log('RaidCoin mint address:', RAIDCOIN_MINT);

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!RAIDCOIN_MINT || RAIDCOIN_MINT === 'YOUR_TOKEN_MINT_ADDRESS_HERE') {
      console.error('RaidCoin mint address not configured');
      return NextResponse.json({
        success: false,
        balance: 0,
        hasEnoughTokens: false,
        minimumRequired: MINIMUM_TOKENS,
        error: 'Token contract not configured'
      });
    }

    try {
      // Get connection with fallback
      const connection = await getConnectionWithFallback();

      // Validate wallet address
      const walletPublicKey = new PublicKey(walletAddress);
      console.log('Wallet public key validated:', walletPublicKey.toString());

      // Validate mint address
      const mintPublicKey = new PublicKey(RAIDCOIN_MINT);
      console.log('Mint public key validated:', mintPublicKey.toString());

      // Get token accounts for the wallet with retry logic
      console.log('Fetching token accounts...');
      let tokenAccounts;
      let retries = 3;
      
      while (retries > 0) {
        try {
          tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            walletPublicKey,
            {
              mint: mintPublicKey
            }
          );
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          
          console.log(`Retrying token account fetch... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }
      }

      if (!tokenAccounts) {
        throw new Error('Failed to fetch token accounts');
      }

      console.log('Found token accounts:', tokenAccounts.value.length);

      let totalBalance = 0;
      let decimals = 6; // Default to 6 decimals

      // Sum up all token balances for this mint
      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info;
        const tokenAmount = parsedInfo.tokenAmount;
        
        console.log('Token account balance:', tokenAmount);
        
        totalBalance += parseInt(tokenAmount.amount);
        decimals = tokenAmount.decimals; // Use actual decimals from token
      }

      console.log('Total raw balance:', totalBalance);
      console.log('Token decimals:', decimals);

      // Convert from token units to actual tokens
      const actualBalance = totalBalance / Math.pow(10, decimals);
      console.log('Actual balance:', actualBalance);

      // Check if wallet is excluded from minimum token requirement
      const isExcludedWallet = EXCLUDED_WALLETS.includes(walletAddress);
      console.log('Wallet excluded from minimum requirement:', isExcludedWallet);

      const hasEnoughTokens = isExcludedWallet || actualBalance >= MINIMUM_TOKENS;

      return NextResponse.json({
        success: true,
        balance: actualBalance,
        hasEnoughTokens,
        minimumRequired: MINIMUM_TOKENS,
        balanceFormatted: actualBalance.toLocaleString(),
        minimumFormatted: MINIMUM_TOKENS.toLocaleString(),
        isExcluded: isExcludedWallet,
        debug: {
          rawBalance: totalBalance,
          decimals,
          tokenAccountsFound: tokenAccounts.value.length,
          walletExcluded: isExcludedWallet
        }
      });

    } catch (walletError) {
      console.error('Error checking wallet balance:', walletError);
      
      // Check if wallet is excluded from minimum token requirement even on error
      const isExcludedWallet = EXCLUDED_WALLETS.includes(walletAddress);
      console.log('Wallet excluded from minimum requirement (error case):', isExcludedWallet);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to check wallet balance';
      if (walletError instanceof Error) {
        if (walletError.message.includes('Invalid public key')) {
          errorMessage = 'Invalid wallet address format';
        } else if (walletError.message.includes('429')) {
          errorMessage = 'Network busy - please try again in a moment';
        } else if (walletError.message.includes('failed to get info')) {
          errorMessage = 'Network connection error';
        } else if (walletError.message.includes('All RPC endpoints are unavailable')) {
          errorMessage = 'Solana network temporarily unavailable';
        } else {
          errorMessage = 'Network error - please try again';
        }
      }

      return NextResponse.json({
        success: false,
        balance: 0,
        hasEnoughTokens: isExcludedWallet, // Allow excluded wallets even on balance check error
        minimumRequired: MINIMUM_TOKENS,
        isExcluded: isExcludedWallet,
        error: errorMessage,
        debug: {
          errorType: walletError instanceof Error ? walletError.constructor.name : 'Unknown',
          errorMessage: walletError instanceof Error ? walletError.message : 'Unknown error',
          walletExcluded: isExcludedWallet
        }
      });
    }

  } catch (error) {
    console.error('Token balance check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check token balance',
        debug: {
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}