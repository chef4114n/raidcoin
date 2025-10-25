'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, XCircle, ExternalLink, Eye } from 'lucide-react'

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

export function AdminPanel() {
  const { data: session } = useSession()
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchPendingPosts()
    }
  }, [session])

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch('/api/admin/review-posts')
      if (response.ok) {
        const posts = await response.json()
        setPendingPosts(posts)
      }
    } catch (error) {
      console.error('Error fetching pending posts:', error)
    } finally {
      setLoading(false)
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
        alert(`✅ ${result.message}${result.pointsAwarded ? ` (${result.pointsAwarded} points awarded)` : ''}`)
        fetchPendingPosts() // Refresh the list
      } else {
        alert('❌ Failed to process review')
      }
    } catch (error) {
      console.error('Error processing review:', error)
      alert('❌ Error processing review')
    } finally {
      setProcessing(null)
    }
  }

  const [engagementInputs, setEngagementInputs] = useState<{[key: string]: any}>({})

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
      <div className="p-8 text-center">
        <p>Please sign in to access the admin panel.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2">Loading pending posts...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Review and approve manually submitted tweets</p>
      </div>

      {pendingPosts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts pending review</h3>
          <p className="text-gray-500">All submitted tweets have been processed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    @{post.user.twitterHandle} ({post.user.name})
                  </h3>
                  <p className="text-sm text-gray-500">{post.user.email}</p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(post.tweetCreatedAt).toLocaleDateString()}
                  </p>
                </div>
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>

              <div className="mb-4">
                <p className="text-gray-800">{post.content}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Likes
                  </label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={post.likes}
                    onChange={(e) => updateEngagement(post.id, 'likes', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retweets
                  </label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={post.retweets}
                    onChange={(e) => updateEngagement(post.id, 'retweets', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Replies
                  </label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={post.replies}
                    onChange={(e) => updateEngagement(post.id, 'replies', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quotes
                  </label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={post.quotes}
                    onChange={(e) => updateEngagement(post.id, 'quotes', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {processing === post.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReview(post.id, false)}
                  disabled={processing === post.id}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </button>
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
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
      )}
    </div>
  )
}