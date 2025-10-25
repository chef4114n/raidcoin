'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard'
import { LandingPage } from '@/components/landing-page'
import { WalletBinding } from '@/components/wallet-binding'

interface WalletStatus {
  hasWallet: boolean
  walletAddress?: string
  user: {
    id: string
    name: string
    twitterHandle: string
  }
}

export function AppContent() {
  const { data: session, status } = useSession()
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null)
  const [isCheckingWallet, setIsCheckingWallet] = useState(false)
  const [showWalletBinding, setShowWalletBinding] = useState(false)

  useEffect(() => {
    if (session?.user?.email && !walletStatus) {
      checkWalletStatus()
    }
  }, [session, walletStatus])

  const checkWalletStatus = async () => {
    setIsCheckingWallet(true)
    try {
      const response = await fetch('/api/user/wallet-status', {
        credentials: 'include' // Include cookies for session
      })
      if (response.ok) {
        const status = await response.json()
        setWalletStatus(status)
        
        // If user doesn't have a wallet, show binding flow
        if (!status.hasWallet) {
          setShowWalletBinding(true)
        }
      } else {
        console.error('Wallet status check failed:', response.status)
      }
    } catch (error) {
      console.error('Error checking wallet status:', error)
    } finally {
      setIsCheckingWallet(false)
    }
  }

  const handleWalletBindingComplete = () => {
    setShowWalletBinding(false)
    // Refresh wallet status
    setWalletStatus(null)
    checkWalletStatus()
  }

  if (status === 'loading' || isCheckingWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  if (!session) {
    return <LandingPage />
  }

  // Show wallet binding flow for authenticated users without wallet
  if (showWalletBinding || (walletStatus && !walletStatus.hasWallet)) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <WalletBinding 
          onComplete={handleWalletBindingComplete}
          userWalletAddress={walletStatus?.walletAddress}
        />
      </div>
    )
  }

  // Show main dashboard for authenticated users with wallet
  return <Dashboard />
}