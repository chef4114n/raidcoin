'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { 
  Wallet, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Copy,
  ExternalLink
} from 'lucide-react'

interface WalletBindingProps {
  onComplete: () => void
  userWalletAddress?: string
}

export function WalletBinding({ onComplete, userWalletAddress }: WalletBindingProps) {
  const { data: session } = useSession()
  const { connected, publicKey, disconnect } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [isBinding, setIsBinding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [bindingMethod, setBindingMethod] = useState<'connect' | 'manual'>('connect')

  useEffect(() => {
    // If user already has a wallet bound, show success
    if (userWalletAddress) {
      setSuccess(true)
      setCurrentStep(3)
    }
  }, [userWalletAddress])

  useEffect(() => {
    if (connected && publicKey && bindingMethod === 'connect') {
      setCurrentStep(2)
    }
  }, [connected, publicKey, bindingMethod])

  const bindWallet = async (address: string) => {
    setIsBinding(true)
    setError('')

    try {
      console.log('Making wallet binding request...');
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important: Include cookies for session
        body: JSON.stringify({ walletAddress: address })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to bind wallet');
      }

      setSuccess(true)
      setCurrentStep(3)
      
      // Wait a moment then call onComplete
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bind wallet')
    } finally {
      setIsBinding(false)
    }
  }

  const handleConnectedWalletBind = () => {
    if (publicKey) {
      bindWallet(publicKey.toString())
    }
  }

  const handleManualWalletBind = () => {
    if (manualAddress.trim()) {
      bindWallet(manualAddress.trim())
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-slate-900 border border-slate-700 rounded-xl shadow-professional animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-50 mb-3 tracking-tight">Wallet Successfully Bound!</h2>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            Your Solana wallet is now connected to your account. You'll receive SOL payouts automatically based on your engagement points.
          </p>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Connected Wallet:</span>
              <div className="flex items-center space-x-3">
                <code className="text-sm font-mono bg-slate-700 text-slate-200 px-3 py-2 rounded-md border border-slate-600">
                  {userWalletAddress || publicKey?.toString() || manualAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(userWalletAddress || publicKey?.toString() || manualAddress)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700 rounded-md"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-400 mb-6 animate-pulse-soft">
            🎉 You're all set! Redirecting to dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-900 border border-slate-700 rounded-xl shadow-professional animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-50 mb-3 tracking-tight">Connect Your Solana Wallet</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Hi <span className="text-gradient font-semibold">@{session?.user?.name}</span>! To receive SOL rewards for your $RAIDCOIN tweets, please connect your Solana wallet.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 1 
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow' 
              : 'bg-slate-800 text-slate-400 border-slate-600'
          }`}>
            <span className="font-semibold">1</span>
          </div>
          <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
            currentStep >= 2 ? 'bg-indigo-500' : 'bg-slate-700'
          }`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 2 
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow' 
              : 'bg-slate-800 text-slate-400 border-slate-600'
          }`}>
            <span className="font-semibold">2</span>
          </div>
          <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
            currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-700'
          }`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 3 
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-glow' 
              : 'bg-slate-800 text-slate-400 border-slate-600'
          }`}>
            <span className="font-semibold">3</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-50 mb-6 text-center">Choose Your Binding Method</h3>
          
          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setBindingMethod('connect')}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                bindingMethod === 'connect'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-glow'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center mb-3">
                <Wallet className="w-6 h-6 mr-3 text-indigo-400" />
                <span className="font-semibold text-slate-50">Connect Wallet</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect your existing Solana wallet (Phantom, Solflare, etc.)
              </p>
            </button>

            <button
              onClick={() => setBindingMethod('manual')}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                bindingMethod === 'manual'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-glow'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center mb-3">
                <ExternalLink className="w-6 h-6 mr-3 text-indigo-400" />
                <span className="font-semibold text-slate-50">Manual Entry</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Enter your Solana wallet address manually
              </p>
            </button>
          </div>

          {/* Connect Wallet Method */}
          {bindingMethod === 'connect' && (
            <div className="space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 flex items-start space-x-4">
                <Info className="w-6 h-6 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-indigo-300">
                  <p className="font-semibold mb-2 text-indigo-200">Recommended Method</p>
                  <p className="leading-relaxed">Connect your wallet browser extension for the most secure experience.</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !border-indigo-500 !text-white !font-semibold !px-6 !py-3 !rounded-lg !transition-all !duration-200 hover:!scale-105 !shadow-glow" />
              </div>
            </div>
          )}

          {/* Manual Entry Method */}
          {bindingMethod === 'manual' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-300">
                  <p className="font-semibold mb-2 text-amber-200">Important</p>
                  <p className="leading-relaxed">Make sure you own this wallet address. Payouts will be sent here automatically.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Solana Wallet Address
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter your Solana wallet address (e.g., 7xKXtg...)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
              
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!manualAddress.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-50 mb-6 text-center">Confirm Wallet Binding</h3>
          
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-300">Wallet Address:</span>
            </div>
            <code className="text-sm font-mono bg-slate-700 text-slate-200 px-4 py-3 rounded-lg block break-all border border-slate-600">
              {bindingMethod === 'connect' ? publicKey?.toString() : manualAddress}
            </code>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <p className="font-semibold mb-2 text-red-200">Error</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-slate-700 text-slate-300 py-3 px-6 rounded-lg hover:bg-slate-600 transition-all duration-200 font-semibold"
            >
              Back
            </button>
            <button
              onClick={bindingMethod === 'connect' ? handleConnectedWalletBind : handleManualWalletBind}
              disabled={isBinding}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
            >
              {isBinding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Bind Wallet'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}