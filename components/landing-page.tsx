'use client'

import { signIn } from 'next-auth/react'
import { Twitter, Coins, TrendingUp, Users, Zap } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Coins className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">RaidCoin Rewards</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Earn Solana (SOL) rewards for posting about $raidcoin on Twitter. 
            The more engagement your posts get, the more you earn!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Twitter className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Post on Twitter</h3>
            <p className="text-gray-600">
              Share posts mentioning $raidcoin, #raidcoin, or @raidcoin to start earning points.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <TrendingUp className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
            <p className="text-gray-600">
              Get points based on likes, retweets, replies, and quotes. Higher engagement = more points!
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Coins className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Receive SOL</h3>
            <p className="text-gray-600">
              Get automatic Solana payouts every 10 minutes based on your accumulated points.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Connect Twitter</h4>
              <p className="text-sm text-gray-600">Sign in with your Twitter account</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Post About $raidcoin</h4>
              <p className="text-sm text-gray-600">Share content mentioning $raidcoin</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Accumulate Points</h4>
              <p className="text-sm text-gray-600">Earn points from engagement</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Get Paid in SOL</h4>
              <p className="text-sm text-gray-600">Receive automatic payouts</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white text-center">
            <Users className="h-10 w-10 mx-auto mb-2" />
            <div className="text-3xl font-bold">500+</div>
            <div className="text-primary-100">Active Raiders</div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg p-6 text-white text-center">
            <Zap className="h-10 w-10 mx-auto mb-2" />
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-secondary-100">Points Earned</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
            <Coins className="h-10 w-10 mx-auto mb-2" />
            <div className="text-3xl font-bold">50+</div>
            <div className="text-green-100">SOL Distributed</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => signIn('twitter')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors inline-flex items-center"
          >
            <Twitter className="mr-3" />
            Start Earning with Twitter
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No fees • Instant payouts • Transparent rewards
          </p>
        </div>
      </div>
    </div>
  )
}