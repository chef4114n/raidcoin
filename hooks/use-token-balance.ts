import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenBalanceResult {
  balance: number;
  hasEnoughTokens: boolean;
  minimumRequired: number;
  balanceFormatted: string;
  minimumFormatted: string;
  isLoading: boolean;
  error: string | null;
}

// Simple cache to avoid too many requests
const balanceCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export function useTokenBalance(): TokenBalanceResult & { checkBalance: () => Promise<void> } {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(false);
  const [minimumRequired, setMinimumRequired] = useState(500000);
  const [balanceFormatted, setBalanceFormatted] = useState('0');
  const [minimumFormatted, setMinimumFormatted] = useState('500,000');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = useCallback(async () => {
    if (!connected || !publicKey) {
      setBalance(0);
      setHasEnoughTokens(false);
      setError(null);
      return;
    }

    const walletAddress = publicKey.toString();
    
    // Check cache first
    const cached = balanceCache.get(walletAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached balance data');
      const data = cached.data;
      setBalance(data.balance);
      setHasEnoughTokens(data.hasEnoughTokens);
      setMinimumRequired(data.minimumRequired);
      setBalanceFormatted(data.balanceFormatted);
      setMinimumFormatted(data.minimumFormatted);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Checking balance for wallet:', walletAddress);
      
      const response = await fetch('/api/check-token-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });

      const data = await response.json();
      console.log('Balance check response:', data);

      if (data.success) {
        setBalance(data.balance);
        setHasEnoughTokens(data.hasEnoughTokens);
        setMinimumRequired(data.minimumRequired);
        setBalanceFormatted(data.balanceFormatted);
        setMinimumFormatted(data.minimumFormatted);
        setError(null);
        
        // Cache the successful response
        balanceCache.set(walletAddress, {
          data,
          timestamp: Date.now()
        });
      } else {
        console.error('Balance check failed:', data);
        setError(data.error || 'Failed to check token balance');
        setBalance(0);
        setHasEnoughTokens(false);
      }
    } catch (err) {
      console.error('Error checking token balance:', err);
      setError('Network error - please try again');
      setBalance(0);
      setHasEnoughTokens(false);
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  // Check balance when wallet connects or changes, but with debouncing
  useEffect(() => {
    if (connected && publicKey) {
      const timer = setTimeout(() => {
        checkBalance();
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    } else {
      setBalance(0);
      setHasEnoughTokens(false);
      setError(null);
    }
  }, [connected, publicKey, checkBalance]);

  return {
    balance,
    hasEnoughTokens,
    minimumRequired,
    balanceFormatted,
    minimumFormatted,
    isLoading,
    error,
    checkBalance,
  };
}