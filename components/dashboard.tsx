'use client'

import { useSession, signOut } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { 
  Twitter, 
  Coins, 
  TrendingUp, 
  Users, 
  LogOut, 
  ExternalLink,
  Trophy,
  Clock,
  Wallet
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
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (session) {
      fetchUserData()
    }
  }, [session])

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString())
    }
  }, [connected, publicKey])

  const fetchUserData = async () => {
    try {
      const [statsRes, postsRes, payoutsRes] = await Promise.all([
        fetch('/api/user/stats'),
        fetch('/api/user/posts'),
        fetch('/api/user/payouts')
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (postsRes.ok) setPosts(await postsRes.json())
      if (payoutsRes.ok) setPayouts(await payoutsRes.json())
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

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
        alert('Wallet address updated successfully!')
      } else {
        alert('Failed to update wallet address')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">RaidCoin Rewards</h1>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={session?.user?.image || ''} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">@{session?.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold">{stats?.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-2xl font-bold">{stats?.totalEarned.toFixed(4) || '0.0000'} SOL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Twitter className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Posts Tracked</p>
                <p className="text-2xl font-bold">{stats?.postCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rank</p>
                <p className="text-2xl font-bold">#{stats?.rank || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Setup */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Wallet className="mr-2" />
            Solana Wallet Setup
          </h2>
          <div className="flex items-center space-x-4">
            <WalletMultiButton />
            {connected && (
              <div className="flex-1">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Your Solana wallet address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={updateWalletAddress}
                  disabled={updating}
                  className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Wallet'}
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Connect your wallet to receive SOL payouts. Payouts happen automatically every 10 minutes.
          </p>
        </div>

        {/* Tweet Submission */}
        <SubmitTweet onTweetSubmitted={fetchUserData} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
            <div className="space-y-4">
              {posts.length > 0 ? posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border-l-4 border-primary-500 pl-4">
                  <p className="text-sm text-gray-600 mb-2">{post.content.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4 text-gray-500">
                      <span>❤️ {post.likes}</span>
                      <span>🔄 {post.retweets}</span>
                      <span>💬 {post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">{post.pointsAwarded} pts</span>
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">
                  No posts tracked yet. Start posting about $raidcoin to earn points!
                </p>
              )}
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Payouts</h2>
            <div className="space-y-4">
              {payouts.length > 0 ? payouts.slice(0, 5).map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{payout.amount.toFixed(4)} SOL</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payout.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      payout.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payout.status}
                    </span>
                    {payout.txSignature && (
                      <a 
                        href={`https://solscan.io/tx/${payout.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-primary-600 hover:text-primary-700 mt-1"
                      >
                        View on Solscan
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">
                  No payouts yet. Keep earning points to receive your first payout!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-primary-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-primary-800 mb-3">How to Earn Points</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-primary-700">Mentions:</strong> Include $raidcoin, #raidcoin, or @raidcoin in your tweets
            </div>
            <div>
              <strong className="text-primary-700">Engagement:</strong> More likes, retweets, and replies = more points
            </div>
            <div>
              <strong className="text-primary-700">Payouts:</strong> Automatic SOL distribution every 10 minutes based on points
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}