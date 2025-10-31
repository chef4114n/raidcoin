'use client'

import { useState } from 'react'
import { Twitter, Plus, ExternalLink, Coins } from 'lucide-react'
import { TokenBalanceChecker } from './token-balance-checker'
import { useTokenBalance } from '../hooks/use-token-balance'

interface SubmitTweetProps {
  onTweetSubmitted: () => void
}

export function SubmitTweet({ onTweetSubmitted }: SubmitTweetProps) {
  const [tweetUrl, setTweetUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const { hasEnoughTokens, isLoading } = useTokenBalance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tweetUrl.trim()) {
      setMessage('Please enter a tweet URL')
      return
    }

    if (!hasEnoughTokens) {
      setMessage('❌ You need at least 500,000 RaidCoin tokens to submit tweets')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/submit-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetUrl: tweetUrl.trim() })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`✅ ${result.message}`)
        setTweetUrl('')
        
        // Trigger custom event for other components to listen
        window.dispatchEvent(new CustomEvent('tweetSubmitted', { 
          detail: { message: result.message, post: result.post } 
        }))
        
        // Call parent callback
        onTweetSubmitted()
      } else {
        setMessage(`❌ ${result.error}`)
      }
    } catch (error) {
      setMessage('❌ Failed to submit tweet')
      console.error('Error submitting tweet:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const isSubmitDisabled = submitting || !tweetUrl.trim() || !hasEnoughTokens || isLoading

  return (
    <div className="space-y-6">
      {/* Token Balance Checker */}
      <TokenBalanceChecker />
      
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-50">
          <Plus className="mr-3 text-indigo-400" />
          Submit Your $RaidCoin Tweet
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Tweet URL
            </label>
            <input
              type="url"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://twitter.com/username/status/1234567890"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              disabled={submitting}
            />
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Paste the URL of your tweet that mentions $raidcoin, #raidcoin, or @raidcoin
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`px-8 py-3 rounded-lg flex items-center font-semibold transition-all duration-200 ${
              hasEnoughTokens 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-glow' 
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            title={!hasEnoughTokens ? 'You need at least 500,000 RaidCoin tokens to submit tweets' : ''}
          >
            <Twitter className="mr-3 h-5 w-5" />
            {submitting ? 'Submitting...' : hasEnoughTokens ? 'Submit Tweet' : 'Insufficient Tokens'}
          </button>

          {message && (
            <div className={`p-4 rounded-xl border ${
              message.startsWith('✅') 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-300 border-red-500/20'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <h3 className="font-semibold text-indigo-200 mb-4">How to Get Your Tweet URL:</h3>
          <ol className="text-sm text-indigo-300 space-y-2 leading-relaxed">
            <li>1. Post a tweet mentioning $raidcoin, #raidcoin, or @raidcoin</li>
            <li>2. Click on your tweet to open it</li>
            <li>3. Copy the URL from your browser's address bar</li>
            <li>4. Paste it in the form above</li>
          </ol>
        </div>

        <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <h3 className="font-semibold text-amber-200 mb-4">📊 Point System:</h3>
          <div className="text-sm text-amber-300 grid grid-cols-2 gap-3">
            <div className="flex items-center">❤️ Likes: <span className="font-semibold ml-1">1 point each</span></div>
            <div className="flex items-center">🔄 Retweets: <span className="font-semibold ml-1">3 points each</span></div>
            <div className="flex items-center">💬 Replies: <span className="font-semibold ml-1">2 points each</span></div>
            <div className="flex items-center">🔗 Quotes: <span className="font-semibold ml-1">3 points each</span></div>
          </div>
          <p className="text-sm text-amber-300 mt-4 leading-relaxed">
            💡 Tip: Engage with the community to maximize your points!
          </p>
        </div>

        {!hasEnoughTokens && (
          <div className="mt-6 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h3 className="font-semibold text-red-200 mb-4">🔒 Token Requirement:</h3>
            <p className="text-sm text-red-300 leading-relaxed mb-4">
              You need to hold at least <strong>500,000 RaidCoin tokens</strong> in your connected wallet to submit tweets and earn rewards. 
              This requirement helps ensure quality participation in our community.
            </p>
            <a
              href={`https://pump.fun/coin/${process.env.NEXT_PUBLIC_RAIDCOIN_TOKEN_MINT!}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <Coins className="h-4 w-4" />
              <span>Buy RaidCoin Now</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}