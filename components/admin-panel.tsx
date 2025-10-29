'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { CheckCircle, XCircle, ExternalLink, Eye, Shield, Wallet, AlertTriangle, RefreshCw, DollarSign, Clock, Users, TrendingUp, Star } from 'lucide-react'

interface PendingPost {
  id: string
  content: string
  url: string
  likes: number
  retweets: number
  replies: number
  quotes: number
  pointsAwarded: number
  tweetCreatedAt: string
  user: {
    id: string
    name: string
    twitterHandle: string
    email: string
  }
}

interface AdminAuth {
  isAdmin: boolean
  hasWallet: boolean
  walletAddress?: string
  creatorWallet?: string
}

interface PayoutStatus {
  system: {
    solanaNetwork: string
    creatorWallet: string
    payoutInterval: string
    creatorFeePercentage: string
  }
  wallet: {
    payerAddress: string | null
    balance: number | null
    balanceError: string | null
  }
  database: {
    totalUsers: number
    usersWithWallets: number
    usersWithPoints: number
    totalPayouts: number
    pendingPayouts: number
    completedPayouts: number
    failedPayouts: number
  }
  recentActivity: {
    recentPayouts: any[]
    recentLogs: any[]
  }
}

export function AdminPanel() {
  const { data: session } = useSession()
  const { connected, publicKey } = useWallet()
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [adminAuth, setAdminAuth] = useState<AdminAuth | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [engagementInputs, setEngagementInputs] = useState<{[key: string]: any}>({})
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [showNewPostsNotification, setShowNewPostsNotification] = useState(false)
  const [previousPostCount, setPreviousPostCount] = useState(0)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'payouts' | 'raiders'>('posts')
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatus | null>(null)
  const [loadingPayoutStatus, setLoadingPayoutStatus] = useState(false)
  const [triggeringPayout, setTriggeringPayout] = useState(false)
  const [raidersData, setRaidersData] = useState<any[]>([])
  const [loadingRaiders, setLoadingRaiders] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchPayoutStatus = useCallback(async () => {
    setLoadingPayoutStatus(true)
    try {
      const response = await fetch('/api/admin/payout-status')
      if (response.ok) {
        const result = await response.json()
        setPayoutStatus(result.status)
      }
    } catch (error) {
      console.error('Error fetching payout status:', error)
    } finally {
      setLoadingPayoutStatus(false)
    }
  }, [])

  const fetchRaidersBreakdown = useCallback(async () => {
    setLoadingRaiders(true)
    try {
      const response = await fetch('/api/admin/raiders-breakdown')
      if (response.ok) {
        const result = await response.json()
        setRaidersData(result.raiders)
      }
    } catch (error) {
      console.error('Error fetching raiders breakdown:', error)
    } finally {
      setLoadingRaiders(false)
    }
  }, [])

  const triggerManualPayout = async () => {
    setTriggeringPayout(true)
    try {
      const response = await fetch('/api/admin/payout-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_payout' })
      })

      const result = await response.json()
      if (response.ok) {
        showNotification(result.message, 'success')
        await fetchPayoutStatus() // Refresh status
      } else {
        showNotification(result.error || 'Failed to trigger payout', 'error')
      }
    } catch (error) {
      console.error('Error triggering payout:', error)
      showNotification('Error triggering payout', 'error')
    } finally {
      setTriggeringPayout(false)
    }
  }

  // Auto-refresh interval (30 seconds)
  const REFRESH_INTERVAL = 30000

  useEffect(() => {
    if (session) {
      checkAdminAuth()
    }
  }, [session])

  const fetchPendingPosts = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    
    try {
      const response = await fetch('/api/admin/review-posts')
      if (response.ok) {
        const posts = await response.json()
        
        // Check if there are new posts
        if (silent && posts.length > previousPostCount && previousPostCount > 0) {
          setShowNewPostsNotification(true)
          setTimeout(() => setShowNewPostsNotification(false), 5000) // Hide after 5 seconds
        }
        
        setPendingPosts(posts)
        setPreviousPostCount(posts.length)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Error fetching pending posts:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      } else {
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    if (adminAuth?.isAdmin) {
      fetchPendingPosts()
      
      // Set up auto-refresh
      const interval = setInterval(() => {
        fetchPendingPosts(true) // Silent refresh
      }, REFRESH_INTERVAL)

      // Listen for tweet submissions from other components
      const handleTweetSubmitted = () => {
        console.log('New tweet submitted, refreshing admin panel...')
        fetchPendingPosts(true)
      }

      window.addEventListener('tweetSubmitted', handleTweetSubmitted)

      return () => {
        clearInterval(interval)
        window.removeEventListener('tweetSubmitted', handleTweetSubmitted)
      }
    }
  }, [adminAuth, fetchPendingPosts])

  // Fetch payout status when switching to payouts tab
  useEffect(() => {
    if (activeTab === 'payouts' && adminAuth?.isAdmin) {
      fetchPayoutStatus()
    } else if (activeTab === 'raiders' && adminAuth?.isAdmin) {
      fetchRaidersBreakdown()
    }
  }, [activeTab, adminAuth, fetchPayoutStatus, fetchRaidersBreakdown])

  const checkAdminAuth = async () => {
    setCheckingAuth(true)
    try {
      const response = await fetch('/api/admin/auth')
      if (response.ok) {
        const authData = await response.json()
        setAdminAuth(authData)
      } else {
        const errorData = await response.json()
        setAdminAuth({
          isAdmin: false,
          hasWallet: errorData.hasWallet || false,
          walletAddress: errorData.walletAddress,
          creatorWallet: errorData.creatorWallet
        })
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
      setAdminAuth({
        isAdmin: false,
        hasWallet: false
      })
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleReview = async (
    postId: string, 
    approved: boolean, 
    engagement?: { likes: number, retweets: number, replies: number, quotes: number }
  ) => {
    setProcessing(postId)
    try {
      const response = await fetch('/api/admin/review-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          approved,
          ...engagement
        })
      })

      if (response.ok) {
        const result = await response.json()
        showNotification(
          `${result.message}${result.pointsAwarded ? ` (${result.pointsAwarded} points awarded)` : ''}`,
          'success'
        )
        
        // Immediately refresh the list
        await fetchPendingPosts()
        
        // Clear the engagement inputs for this post
        setEngagementInputs(prev => {
          const newInputs = { ...prev }
          delete newInputs[postId]
          return newInputs
        })
      } else {
        showNotification('Failed to process review', 'error')
      }
    } catch (error) {
      console.error('Error processing review:', error)
      showNotification('Error processing review', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const updateEngagement = (postId: string, field: string, value: number) => {
    setEngagementInputs(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value
      }
    }))
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <Shield className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Admin Access Required</h2>
          <p className="text-slate-300 mb-6">Please sign in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Checking admin authorization...</p>
        </div>
      </div>
    )
  }

  if (!adminAuth?.hasWallet) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <Wallet className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Wallet Required</h2>
          <p className="text-slate-300 mb-6">Please connect a wallet to access admin features.</p>
          <p className="text-slate-400 text-sm mb-6">Only the creator wallet can access admin panel.</p>
        </div>
      </div>
    )
  }

  if (!adminAuth?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg w-full mx-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-4">Only the creator wallet can access this admin panel.</p>
          
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-6">
            <p className="text-slate-400 text-sm mb-2">Your wallet:</p>
            <code className="text-slate-200 text-sm bg-slate-700 px-3 py-2 rounded block break-all">
              {adminAuth.walletAddress}
            </code>
            {adminAuth.creatorWallet && (
              <>
                <p className="text-slate-400 text-sm mb-2 mt-4">Creator wallet:</p>
                <code className="text-slate-200 text-sm bg-slate-700 px-3 py-2 rounded block break-all">
                  {adminAuth.creatorWallet}
                </code>
              </>
            )}
          </div>
          
          <p className="text-slate-400 text-sm">
            Please contact the administrator if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading pending posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Notifications */}
      {showNewPostsNotification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in-right">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">New posts available for review!</span>
        </div>
      )}
      
      {notification && (
        <div className={`fixed top-16 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in-right ${
          notification.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">Admin Panel</h1>
              <p className="text-slate-300">Review posts and manage payout system</p>
              {lastRefresh && (
                <p className="text-slate-400 text-sm mt-1">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (activeTab === 'posts') fetchPendingPosts()
                  else if (activeTab === 'payouts') fetchPayoutStatus()
                  else if (activeTab === 'raiders') fetchRaidersBreakdown()
                }}
                disabled={loading || refreshing || loadingPayoutStatus || loadingRaiders}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${(refreshing || loadingPayoutStatus || loadingRaiders) ? 'animate-spin' : ''}`} />
                <span>{(refreshing || loadingPayoutStatus || loadingRaiders) ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                <div className="flex items-center text-emerald-400">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Creator Access</span>
                  {(refreshing || loadingPayoutStatus) && (
                    <div className="ml-2 h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-slate-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Post Reviews</span>
                  {pendingPosts.length > 0 && (
                    <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1">
                      {pendingPosts.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('payouts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'payouts'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Payout System</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('raiders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'raiders'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Raiders Breakdown</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'posts' ? (
          // Posts Review Tab
          pendingPosts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
              <Eye className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-slate-50 mb-3">No posts pending review</h3>
              <p className="text-slate-400">All submitted tweets have been processed.</p>
            </div>
          ) : (
            <div className="space-y-6">
            {pendingPosts.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-50 text-lg">
                      @{post.user.twitterHandle} ({post.user.name})
                    </h3>
                    <p className="text-sm text-slate-400">{post.user.email}</p>
                    <p className="text-sm text-slate-400">
                      Submitted: {new Date(post.tweetCreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                  >
                    <ExternalLink className="h-6 w-6" />
                  </a>
                </div>

                <div className="mb-6">
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                    <p className="text-slate-200 leading-relaxed">{post.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Likes
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={post.likes}
                      onChange={(e) => updateEngagement(post.id, 'likes', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Retweets
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={post.retweets}
                      onChange={(e) => updateEngagement(post.id, 'retweets', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Replies
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={post.replies}
                      onChange={(e) => updateEngagement(post.id, 'replies', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Quotes
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={post.quotes}
                      onChange={(e) => updateEngagement(post.id, 'quotes', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => handleReview(
                      post.id, 
                      true, 
                      engagementInputs[post.id] || {
                        likes: post.likes,
                        retweets: post.retweets,
                        replies: post.replies,
                        quotes: post.quotes
                      }
                    )}
                    disabled={processing === post.id}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {processing === post.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReview(post.id, false)}
                    disabled={processing === post.id}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject
                  </button>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-sm text-indigo-300">
                    <strong>Points Preview:</strong> {' '}
                    {Math.max(
                      ((engagementInputs[post.id]?.likes || post.likes) * 1) +
                      ((engagementInputs[post.id]?.retweets || post.retweets) * 3) +
                      ((engagementInputs[post.id]?.replies || post.replies) * 2) +
                      ((engagementInputs[post.id]?.quotes || post.quotes) * 3),
                      1
                    )} points
                  </p>
                </div>
              </div>
            ))}
            </div>
          )
        ) : activeTab === 'payouts' ? (
          // Payout System Tab
          <div className="space-y-6">
            {loadingPayoutStatus ? (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-slate-300 text-lg">Loading payout status...</p>
              </div>
            ) : payoutStatus ? (
              <>
                {/* System Status Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <Wallet className="h-10 w-10 text-emerald-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Wallet Balance</p>
                        <p className="text-2xl font-bold text-slate-50">
                          {payoutStatus.wallet.balance !== null 
                            ? `${payoutStatus.wallet.balance.toFixed(4)} SOL`
                            : 'Error'
                          }
                        </p>
                        {payoutStatus.wallet.balanceError && (
                          <p className="text-xs text-red-400 mt-1">{payoutStatus.wallet.balanceError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <Users className="h-10 w-10 text-indigo-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Users with Points</p>
                        <p className="text-2xl font-bold text-slate-50">{payoutStatus.database.usersWithPoints}</p>
                        <p className="text-xs text-slate-400">{payoutStatus.database.usersWithWallets} with wallets</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <Clock className="h-10 w-10 text-amber-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Auto Payouts</p>
                        <p className="text-lg font-bold text-slate-50">Every 30 min</p>
                        <p className="text-xs text-slate-400">via Vercel cron</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Trigger */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50 mb-2">Manual Payout Trigger</h3>
                      <p className="text-slate-400">Manually trigger a payout process for testing or immediate processing</p>
                    </div>
                    <button
                      onClick={triggerManualPayout}
                      disabled={triggeringPayout}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {triggeringPayout ? 'Processing...' : 'Trigger Payout'}
                    </button>
                  </div>
                </div>

                {/* Payout Statistics */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                  <h3 className="text-lg font-semibold text-slate-50 mb-4">Payout Statistics</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-50">{payoutStatus.database.totalPayouts}</p>
                      <p className="text-sm text-slate-400">Total Payouts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{payoutStatus.database.completedPayouts}</p>
                      <p className="text-sm text-slate-400">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">{payoutStatus.database.pendingPayouts}</p>
                      <p className="text-sm text-slate-400">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{payoutStatus.database.failedPayouts}</p>
                      <p className="text-sm text-slate-400">Failed</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {payoutStatus.recentActivity.recentPayouts.length > 0 && (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Payouts</h3>
                    <div className="space-y-3">
                      {payoutStatus.recentActivity.recentPayouts.slice(0, 5).map((payout: any) => (
                        <div key={payout.id} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-50">
                              {payout.user?.name || 'Unknown'} (@{payout.user?.twitterHandle || 'unknown'})
                            </p>
                            <p className="text-sm text-slate-400">
                              {new Date(payout.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-50">{payout.amount.toFixed(4)} SOL</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              payout.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                              payout.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {payout.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-50 mb-3">Failed to load payout status</h3>
                <p className="text-slate-400">Please try refreshing the page.</p>
              </div>
            )}
          </div>
        ) : (
          // Raiders Breakdown Tab
          <div className="space-y-6">
            {loadingRaiders ? (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-slate-300 text-lg">Loading raiders breakdown...</p>
              </div>
            ) : raidersData.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <Users className="h-10 w-10 text-emerald-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Total Raiders</p>
                        <p className="text-2xl font-bold text-slate-50">{raidersData.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <TrendingUp className="h-10 w-10 text-indigo-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Total Points</p>
                        <p className="text-2xl font-bold text-slate-50">
                          {raidersData.reduce((sum, raider) => sum + raider.totalPoints, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <DollarSign className="h-10 w-10 text-amber-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Total SOL Earned</p>
                        <p className="text-2xl font-bold text-slate-50">
                          {raidersData.reduce((sum, raider) => sum + raider.totalEarned, 0).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                    <div className="flex items-center">
                      <Star className="h-10 w-10 text-purple-400" />
                      <div className="ml-4">
                        <p className="text-sm text-slate-400 font-medium">Avg SOL/Raider</p>
                        <p className="text-2xl font-bold text-slate-50">
                          {(raidersData.reduce((sum, raider) => sum + raider.totalEarned, 0) / raidersData.length).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raiders List */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-50">Raiders Breakdown</h3>
                    <div className="text-sm text-slate-400">
                      Showing top {Math.min(raidersData.length, 50)} raiders
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Rank</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Raider</th>
                          <th className="text-right py-3 px-4 text-slate-300 font-medium">Total Points</th>
                          <th className="text-right py-3 px-4 text-slate-300 font-medium">SOL Earned</th>
                          <th className="text-right py-3 px-4 text-slate-300 font-medium">Tweets</th>
                          <th className="text-right py-3 px-4 text-slate-300 font-medium">Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raidersData.slice(0, 50).map((raider, index) => (
                          <tr key={raider.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                  index === 1 ? 'bg-gray-500/20 text-gray-400' :
                                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-slate-700 text-slate-300'
                                }`}>
                                  #{index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-semibold text-slate-50">
                                  {raider.name || 'Unknown'}
                                </p>
                                <p className="text-sm text-slate-400">
                                  @{raider.twitterHandle || 'unknown'}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold text-indigo-400">
                                {raider.totalPoints.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold text-emerald-400">
                                {raider.totalEarned.toFixed(4)} SOL
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-slate-300">
                                {raider.tweetCount}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-slate-400 text-sm">
                                {raider.lastActive ? new Date(raider.lastActive).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
                <Users className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-50 mb-3">No raiders data available</h3>
                <p className="text-slate-400">No raiders have earned points yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}