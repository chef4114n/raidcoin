'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface ManualUpdateProps {
  postId: string
  currentEngagement: {
    likes: number
    retweets: number
    replies: number
    quotes: number
  }
  onUpdate: () => void
}

export function ManualEngagementUpdate({ postId, currentEngagement, onUpdate }: ManualUpdateProps) {
  const [engagement, setEngagement] = useState(currentEngagement)
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch('/api/update-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          ...engagement
        })
      })

      if (response.ok) {
        onUpdate()
        alert('✅ Engagement updated successfully!')
      } else {
        alert('❌ Failed to update engagement')
      }
    } catch (error) {
      console.error('Error updating engagement:', error)
      alert('❌ Error updating engagement')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-4">
      <h4 className="font-medium text-blue-800 mb-3">Update Engagement Manually</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Likes
          </label>
          <input
            type="number"
            min="0"
            value={engagement.likes}
            onChange={(e) => setEngagement(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
            className="w-full px-2 py-1 border border-blue-200 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Retweets
          </label>
          <input
            type="number"
            min="0"
            value={engagement.retweets}
            onChange={(e) => setEngagement(prev => ({ ...prev, retweets: parseInt(e.target.value) || 0 }))}
            className="w-full px-2 py-1 border border-blue-200 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Replies
          </label>
          <input
            type="number"
            min="0"
            value={engagement.replies}
            onChange={(e) => setEngagement(prev => ({ ...prev, replies: parseInt(e.target.value) || 0 }))}
            className="w-full px-2 py-1 border border-blue-200 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Quotes
          </label>
          <input
            type="number"
            min="0"
            value={engagement.quotes}
            onChange={(e) => setEngagement(prev => ({ ...prev, quotes: parseInt(e.target.value) || 0 }))}
            className="w-full px-2 py-1 border border-blue-200 rounded text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleUpdate}
        disabled={updating}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        <RefreshCw className="mr-1 h-3 w-3" />
        {updating ? 'Updating...' : 'Update Engagement'}
      </button>
      <p className="text-xs text-blue-600 mt-2">
        New points: {Math.max(
          (engagement.likes * 1) +
          (engagement.retweets * 3) +
          (engagement.replies * 2) +
          (engagement.quotes * 3),
          1
        )} points
      </p>
    </div>
  )
}