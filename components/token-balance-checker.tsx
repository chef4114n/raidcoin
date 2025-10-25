import React from 'react';
import { Coins, Shield, AlertTriangle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { useTokenBalance } from '../hooks/use-token-balance';

interface TokenBalanceCheckerProps {
  className?: string;
}

export function TokenBalanceChecker({ className = '' }: TokenBalanceCheckerProps) {
  const { 
    balance, 
    hasEnoughTokens, 
    minimumRequired, 
    balanceFormatted, 
    minimumFormatted, 
    isLoading, 
    error,
    checkBalance 
  } = useTokenBalance();

  if (isLoading) {
    return (
      <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
          <div>
            <p className="text-white font-medium">Checking Token Balance...</p>
            <p className="text-slate-400 text-sm">Verifying your RaidCoin holdings</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div>
              <p className="text-white font-medium">Error Checking Balance</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={checkBalance}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${hasEnoughTokens 
      ? 'bg-emerald-900/20 border border-emerald-500/30' 
      : 'bg-amber-900/20 border border-amber-500/30'
    } rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {hasEnoughTokens ? (
            <Shield className="h-6 w-6 text-emerald-400" />
          ) : (
            <Coins className="h-6 w-6 text-amber-400" />
          )}
          <div>
            <p className="text-white font-medium">
              {hasEnoughTokens ? 'Eligible to Submit' : 'Insufficient Token Balance'}
            </p>
            <p className={`text-sm ${hasEnoughTokens ? 'text-emerald-300' : 'text-amber-300'}`}>
              Balance: {balanceFormatted} RaidCoin tokens
            </p>
          </div>
        </div>
        <button
          onClick={checkBalance}
          className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
      
      {!hasEnoughTokens && (
        <div className="mt-4 pt-4 border-t border-amber-500/20">
          <p className="text-amber-200 text-sm">
            <strong>Minimum required:</strong> {minimumFormatted} RaidCoin tokens
          </p>
          <p className="text-amber-300 text-sm mt-1">
            You need {(minimumRequired - balance).toLocaleString()} more tokens to submit tweets.
          </p>
          <div className="mt-3">
            <a
              href={`https://pump.fun/coin/${process.env.NEXT_PUBLIC_RAIDCOIN_TOKEN_MINT || '61QMuj4oqqNsStRx1KPWuV5uvvYWpkvUdtNHG8u6pump'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <Coins className="h-4 w-4" />
              <span>Buy RaidCoin</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
      
      {hasEnoughTokens && (
        <div className="mt-4 pt-4 border-t border-emerald-500/20">
          <p className="text-emerald-200 text-sm">
            ✅ You can now submit tweets and earn SOL rewards!
          </p>
        </div>
      )}
    </div>
  );
}