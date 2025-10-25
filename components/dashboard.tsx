'use client'

import { useSession, signOut } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect, useCallback } from 'react'
import { 
  Twitter, 
  Coins, 
  TrendingUp, 
  Users, 
  LogOut, 
  ExternalLink,
  Trophy,
  Clock,
  Wallet,
  RefreshCw
} from 'lucide-react'
import { SubmitTweet } from '@/components/submit-tweet'

interface UserStats {
  totalPoints: number
  totalEarned: number
  postCount: number
  rank: number
}

interface Post {
  id: string
  content: string
  url: string
  likes: number
  retweets: number
  replies: number
  pointsAwarded: number
  tweetCreatedAt: string
}

interface Payout {
  id: string
  amount: number
  status: string
  createdAt: string
  txSignature?: string
}

export function Dashboard() {
  const { data: session } = useSession()
  const { connected, publicKey } = useWallet()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState('')
  const [savedWalletAddress, setSavedWalletAddress] = useState('')
  const [updating, setUpdating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Auto-refresh interval (60 seconds for dashboard)
  const REFRESH_INTERVAL = 60000

  useEffect(() => {
    if (session) {
      fetchUserData()
      
      // Set up auto-refresh
      const interval = setInterval(() => {
        fetchUserData(true) // Silent refresh
      }, REFRESH_INTERVAL)

      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString())
    }
  }, [connected, publicKey])

  const fetchUserData = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    
    try {
      const [statsRes, postsRes, payoutsRes, walletRes] = await Promise.all([
        fetch('/api/user/stats'),
        fetch('/api/user/posts'),
        fetch('/api/user/payouts'),
        fetch('/api/user/wallet-status')
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (postsRes.ok) setPosts(await postsRes.json())
      if (payoutsRes.ok) setPayouts(await payoutsRes.json())
      if (walletRes.ok) {
        const walletData = await walletRes.json()
        setSavedWalletAddress(walletData.walletAddress || '')
        if (!walletAddress) {
          setWalletAddress(walletData.walletAddress || '')
        }
      }
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      } else {
        setRefreshing(false)
      }
    }
  }, [walletAddress])

  const updateWalletAddress = async () => {
    if (!walletAddress) return

    setUpdating(true)
    try {
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      })

      if (response.ok) {
        setSavedWalletAddress(walletAddress)
        alert('Wallet address updated successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to update wallet address: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating wallet:', error)
      alert('Failed to update wallet address')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 shadow-professional">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="h-10 w-10 text-indigo-400 mr-4" />
              <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
                <span className="text-gradient">RaidCoin</span> Rewards
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchUserData()}
                disabled={loading || refreshing}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <img 
                src={session?.user?.image || ''} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-600"
              />
              <span className="font-semibold text-slate-200 text-lg">@{session?.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                title="Sign out"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {lastRefresh && (
          <div className="mb-4 text-center">
            <p className="text-slate-400 text-sm">
              Last updated: {lastRefresh.toLocaleTimeString()}
              {refreshing && <span className="ml-2 animate-pulse">• Refreshing...</span>}
            </p>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional hover:shadow-glow transition-all duration-200 hover:scale-105">
            <div className="flex items-center">
              <TrendingUp className="h-10 w-10 text-emerald-400" />
              <div className="ml-4">
                <p className="text-sm text-slate-400 font-medium">Total Points</p>
                <p className="text-2xl font-bold text-slate-50">{stats?.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional hover:shadow-glow transition-all duration-200 hover:scale-105">
            <div className="flex items-center">
              <Coins className="h-10 w-10 text-amber-400" />
              <div className="ml-4">
                <p className="text-sm text-slate-400 font-medium">Total Earned</p>
                <p className="text-2xl font-bold text-slate-50">{stats?.totalEarned.toFixed(4) || '0.0000'} SOL</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional hover:shadow-glow transition-all duration-200 hover:scale-105">
            <div className="flex items-center">
              <Twitter className="h-10 w-10 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm text-slate-400 font-medium">Posts Tracked</p>
                <p className="text-2xl font-bold text-slate-50">{stats?.postCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-professional hover:shadow-glow transition-all duration-200 hover:scale-105">
            <div className="flex items-center">
              <Trophy className="h-10 w-10 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm text-slate-400 font-medium">Rank</p>
                <p className="text-2xl font-bold text-slate-50">#{stats?.rank || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Setup */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-50">
            <Wallet className="mr-3 text-indigo-400" />
            Solana Wallet Management
          </h2>
          
          {savedWalletAddress ? (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-200 mb-2">✅ Wallet Connected</p>
                    <code className="text-sm text-emerald-300 bg-slate-800 px-3 py-2 rounded-lg border border-slate-600 block">
                      {savedWalletAddress}
                    </code>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(savedWalletAddress)}
                    className="text-emerald-400 hover:text-emerald-300 ml-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              {/* Option to change wallet */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Change wallet address
                </summary>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !border-indigo-500 !text-white !font-semibold !px-6 !py-3 !rounded-lg !transition-all !duration-200 hover:!scale-105 !shadow-glow" />
                    {connected && (
                      <span className="text-sm text-slate-400">
                        Connected: {publicKey?.toString().slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter new wallet address"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button
                      onClick={updateWalletAddress}
                      disabled={updating || !walletAddress || walletAddress === savedWalletAddress}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
                    >
                      {updating ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="text-amber-400 text-2xl">⚠️</div>
                <div>
                  <p className="text-sm font-semibold text-amber-200 mb-2">No Wallet Connected</p>
                  <p className="text-sm text-amber-300">Please connect a wallet to receive SOL payouts.</p>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !border-indigo-500 !text-white !font-semibold !px-6 !py-3 !rounded-lg !transition-all !duration-200 hover:!scale-105 !shadow-glow" />
                {connected && (
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Confirm wallet address"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button
                      onClick={updateWalletAddress}
                      disabled={updating || !walletAddress}
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
                    >
                      {updating ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <p className="text-xs text-slate-400 mt-6 text-center">
            💡 Payouts happen automatically every 10 minutes to your connected wallet.
          </p>
        </div>

        {/* Tweet Submission */}
        <SubmitTweet onTweetSubmitted={fetchUserData} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional animate-slide-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-50">Recent Posts</h2>
            <div className="space-y-6">
              {posts.length > 0 ? posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border-l-4 border-indigo-500 pl-6 bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed">{post.content.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4 text-slate-400">
                      <span className="flex items-center">❤️ {post.likes}</span>
                      <span className="flex items-center">🔄 {post.retweets}</span>
                      <span className="flex items-center">💬 {post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                        {post.pointsAwarded} pts
                      </span>
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors p-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-center py-12 text-lg">
                  No posts tracked yet. Start posting about $raidcoin to earn points!
                </p>
              )}
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional animate-slide-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-50">Recent Payouts</h2>
            <div className="space-y-4">
              {payouts.length > 0 ? payouts.slice(0, 5).map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-50">{payout.amount.toFixed(4)} SOL</p>
                    <p className="text-sm text-slate-400">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payout.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      payout.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {payout.status}
                    </span>
                    {payout.txSignature && (
                      <a 
                        href={`https://solscan.io/tx/${payout.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-indigo-400 hover:text-indigo-300 mt-2 transition-colors"
                      >
                        View on Solscan
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-center py-12 text-lg">
                  No payouts yet. Keep earning points to receive your first payout!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-8 mt-8 animate-fade-in">
          <h3 className="text-xl font-bold text-indigo-200 mb-6">How to Earn Points</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
              <strong className="text-indigo-300 block mb-2">Mentions:</strong>
              <p className="text-slate-300 leading-relaxed">Include $raidcoin, #raidcoin, or @raidcoin in your tweets</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
              <strong className="text-indigo-300 block mb-2">Engagement:</strong>
              <p className="text-slate-300 leading-relaxed">More likes, retweets, and replies = more points</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
              <strong className="text-indigo-300 block mb-2">Payouts:</strong>
              <p className="text-slate-300 leading-relaxed">Automatic SOL distribution every 10 minutes based on points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}