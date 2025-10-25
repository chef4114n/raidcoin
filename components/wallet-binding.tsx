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
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to bind wallet')
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
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Successfully Bound!</h2>
          <p className="text-gray-600 mb-6">
            Your Solana wallet is now connected to your account. You'll receive SOL payouts automatically based on your engagement points.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Connected Wallet:</span>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                  {userWalletAddress || publicKey?.toString() || manualAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(userWalletAddress || publicKey?.toString() || manualAddress)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            🎉 You're all set! Redirecting to dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Solana Wallet</h2>
        <p className="text-gray-600">
          Hi @{session?.user?.name}! To receive SOL rewards for your $RAIDCOIN tweets, please connect your Solana wallet.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}>
            1
          </div>
          <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}>
            2
          </div>
          <div className={`w-8 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}>
            3
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Binding Method</h3>
          
          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setBindingMethod('connect')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                bindingMethod === 'connect'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <Wallet className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-medium">Connect Wallet</span>
              </div>
              <p className="text-sm text-gray-600">
                Connect your existing Solana wallet (Phantom, Solflare, etc.)
              </p>
            </button>

            <button
              onClick={() => setBindingMethod('manual')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                bindingMethod === 'manual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-medium">Manual Entry</span>
              </div>
              <p className="text-sm text-gray-600">
                Enter your Solana wallet address manually
              </p>
            </button>
          </div>

          {/* Connect Wallet Method */}
          {bindingMethod === 'connect' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Recommended Method</p>
                  <p>Connect your wallet browser extension for the most secure experience.</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
              </div>
            </div>
          )}

          {/* Manual Entry Method */}
          {bindingMethod === 'manual' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Important</p>
                  <p>Make sure you own this wallet address. Payouts will be sent here automatically.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solana Wallet Address
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter your Solana wallet address (e.g., 7xKXtg...)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!manualAddress.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Wallet Binding</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Wallet Address:</span>
            </div>
            <code className="text-sm font-mono bg-white px-3 py-2 rounded block break-all">
              {bindingMethod === 'connect' ? publicKey?.toString() : manualAddress}
            </code>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={bindingMethod === 'connect' ? handleConnectedWalletBind : handleManualWalletBind}
              disabled={isBinding}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isBinding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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