'use client'

import { useState } from 'react'
import { Twitter, Plus, ExternalLink } from 'lucide-react'

interface SubmitTweetProps {
  onTweetSubmitted: () => void
}

export function SubmitTweet({ onTweetSubmitted }: SubmitTweetProps) {
  const [tweetUrl, setTweetUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tweetUrl.trim()) {
      setMessage('Please enter a tweet URL')
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

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional mb-8 animate-fade-in">
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
          disabled={submitting || !tweetUrl.trim()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold transition-all duration-200 hover:scale-105 shadow-glow disabled:hover:scale-100"
        >
          <Twitter className="mr-3 h-5 w-5" />
          {submitting ? 'Submitting...' : 'Submit Tweet'}
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
    </div>
  )
}