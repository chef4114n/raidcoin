import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface TokenBalanceResult {
  balance: number;
  hasEnoughTokens: boolean;
  minimumRequired: number;
  balanceFormatted: string;
  minimumFormatted: string;
  isLoading: boolean;
  error: string | null;
  isExcluded: boolean;
}

// Simple cache to avoid too many requests
const balanceCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export function useTokenBalance(): TokenBalanceResult & { checkBalance: () => Promise<void> } {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(false);
  const [minimumRequired, setMinimumRequired] = useState(500000);
  const [balanceFormatted, setBalanceFormatted] = useState('0');
  const [minimumFormatted, setMinimumFormatted] = useState('500,000');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExcluded, setIsExcluded] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Get wallet address from user profile
  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (!session?.user) {
        setWalletAddress(null);
        return;
      }

      try {
        const response = await fetch('/api/user/wallet-status');
        if (response.ok) {
          const data = await response.json();
          setWalletAddress(data.walletAddress);
        }
      } catch (error) {
        console.error('Error fetching wallet address:', error);
        setWalletAddress(null);
      }
    };

    fetchWalletAddress();
  }, [session]);

  const checkBalance = useCallback(async () => {
    if (!session?.user || !walletAddress) {
      setBalance(0);
      setHasEnoughTokens(false);
      setIsExcluded(false);
      setError(null);
      setIsLoading(false);
      return;
    }
    
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
      setIsExcluded(data.isExcluded || false);
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
        setIsExcluded(data.isExcluded || false);
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
        setHasEnoughTokens(data.hasEnoughTokens || false); // Could still be true if excluded
        setIsExcluded(data.isExcluded || false);
      }
    } catch (err) {
      console.error('Error checking token balance:', err);
      setError('Network error - please try again');
      setBalance(0);
      setHasEnoughTokens(false);
      setIsExcluded(false);
    } finally {
      setIsLoading(false);
    }
  }, [session, walletAddress]);

  // Check balance when wallet address changes, but with debouncing
  useEffect(() => {
    if (session?.user && walletAddress) {
      const timer = setTimeout(() => {
        checkBalance();
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    } else {
      setBalance(0);
      setHasEnoughTokens(false);
      setIsExcluded(false);
      setError(null);
    }
  }, [session, walletAddress, checkBalance]);

  return {
    balance,
    hasEnoughTokens,
    minimumRequired,
    balanceFormatted,
    minimumFormatted,
    isLoading,
    error,
    isExcluded,
    checkBalance,
  };
}