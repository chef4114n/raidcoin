'use client'

import { signIn } from 'next-auth/react'
import { Twitter, Coins, TrendingUp, Users, Zap } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Coins className="h-14 w-14 text-indigo-400 mr-4" />
            <h1 className="text-5xl font-bold text-slate-50 tracking-tight">
              <span className="text-gradient">RaidCoin</span> Rewards
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Earn Solana (SOL) rewards for posting about $raidcoin on Twitter. 
            The more engagement your posts get, the more you earn!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in">
            <Twitter className="h-12 w-12 text-blue-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-slate-50">Post on Twitter</h3>
            <p className="text-slate-300 leading-relaxed">
              Share posts mentioning $raidcoin, #raidcoin, or @raidcoin to start earning points.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in">
            <TrendingUp className="h-12 w-12 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-slate-50">Earn Points</h3>
            <p className="text-slate-300 leading-relaxed">
              Get points based on likes, retweets, replies, and quotes. Higher engagement = more points!
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-professional hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in">
            <Coins className="h-12 w-12 text-amber-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-slate-50">Receive SOL</h3>
            <p className="text-slate-300 leading-relaxed">
              Get automatic Solana payouts every 10 minutes based on your accumulated points.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 shadow-professional mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-50">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-400">1</span>
              </div>
              <h4 className="font-semibold mb-3 text-slate-50">Connect Twitter</h4>
              <p className="text-sm text-slate-300 leading-relaxed">Sign in with your Twitter account</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-400">2</span>
              </div>
              <h4 className="font-semibold mb-3 text-slate-50">Post About $raidcoin</h4>
              <p className="text-sm text-slate-300 leading-relaxed">Share content mentioning $raidcoin</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-400">3</span>
              </div>
              <h4 className="font-semibold mb-3 text-slate-50">Accumulate Points</h4>
              <p className="text-sm text-slate-300 leading-relaxed">Earn points from engagement</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-400">4</span>
              </div>
              <h4 className="font-semibold mb-3 text-slate-50">Get Paid in SOL</h4>
              <p className="text-sm text-slate-300 leading-relaxed">Receive automatic payouts</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-8 text-white text-center shadow-glow hover:scale-105 transition-all duration-300">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <div className="text-4xl font-bold">500+</div>
            <div className="text-indigo-200 text-lg">Active Raiders</div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-white text-center shadow-glow hover:scale-105 transition-all duration-300">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <div className="text-4xl font-bold">10K+</div>
            <div className="text-emerald-200 text-lg">Points Earned</div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-8 text-white text-center shadow-glow hover:scale-105 transition-all duration-300">
            <Coins className="h-12 w-12 mx-auto mb-4" />
            <div className="text-4xl font-bold">50+</div>
            <div className="text-amber-200 text-lg">SOL Distributed</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => signIn('twitter')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-200 inline-flex items-center hover:scale-105 shadow-glow"
          >
            <Twitter className="mr-4 h-6 w-6" />
            Start Earning with Twitter
          </button>
          <p className="text-sm text-slate-400 mt-6 text-lg">
            No fees • Instant payouts • Transparent rewards
          </p>
        </div>
      </div>
    </div>
  )
}