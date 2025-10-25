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
    <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Plus className="mr-2" />
        Submit Your $RaidCoin Tweet
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tweet URL
          </label>
          <input
            type="url"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="https://twitter.com/username/status/1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={submitting}
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste the URL of your tweet that mentions $raidcoin, #raidcoin, or @raidcoin
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !tweetUrl.trim()}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Twitter className="mr-2 h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit Tweet'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${
            message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">How to Get Your Tweet URL:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Post a tweet mentioning $raidcoin, #raidcoin, or @raidcoin</li>
          <li>2. Click on your tweet to open it</li>
          <li>3. Copy the URL from your browser's address bar</li>
          <li>4. Paste it in the form above</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-yellow-800 mb-2">📊 Point System:</h3>
        <div className="text-sm text-yellow-700 grid grid-cols-2 gap-2">
          <div>❤️ Likes: 1 point each</div>
          <div>🔄 Retweets: 3 points each</div>
          <div>💬 Replies: 2 points each</div>
          <div>🔗 Quotes: 3 points each</div>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          💡 Tip: Engage with the community to maximize your points!
        </p>
      </div>
    </div>
  )
}