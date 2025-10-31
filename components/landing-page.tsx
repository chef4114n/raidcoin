'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Twitter, Coins, TrendingUp, Users, Zap, ArrowRight, Star, DollarSign, Copy, ExternalLink } from 'lucide-react'

export function LandingPage() {
  const contractAddress = process.env.NEXT_PUBLIC_RAIDCOIN_TOKEN_MINT || '61QMuj4oqqNsStRx1KPWuV5uvvYWpkvUdtNHG8u6pump'
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-emerald-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
      
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col">
        <div className="container mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Coins className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">raidcoin</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#stats" className="hover:text-white transition-colors">Stats</a>
              <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center space-y-4">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 md:px-6 md:py-3">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
                <span className="text-indigo-300 font-medium text-sm md:text-base">Earn SOL by tweeting about $raidcoin</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Turn Your
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Tweets Into SOL
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              Get rewarded in Solana for creating engaging content about $raidcoin. 
              The more likes, retweets, and engagement you get, the more SOL you earn.
            </p>

            {/* Token Requirement Notice */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 md:px-6 md:py-3">
                <Coins className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
                <span className="text-amber-300 font-medium text-sm md:text-base">Requires 500k+ raidcoin tokens to participate</span>
              </div>
            </div>

            {/* Contract Address Display */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 md:p-4 max-w-xl mx-auto">
              <div className="text-center">
                <h3 className="text-sm md:text-base font-semibold text-white mb-2">raidcoin Contract Address</h3>
                <div className="flex items-center justify-center space-x-2 bg-slate-900/50 rounded-lg p-2 md:p-3">
                  <code className="text-xs md:text-sm text-indigo-300 font-mono break-all">{contractAddress}</code>
                  <button
                    onClick={() => copyToClipboard(contractAddress)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors group"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-3 w-3 md:h-4 md:w-4 text-slate-400 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <button
                onClick={() => signIn('twitter')}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-indigo-500/25 flex items-center space-x-3 w-full sm:w-auto"
              >
                <Twitter className="h-5 w-5 md:h-6 md:w-6" />
                <span>Start Earning Now</span>
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href={`https://pump.fun/coin/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/25 flex items-center space-x-3 w-full sm:w-auto"
              >
                <Coins className="h-5 w-5 md:h-6 md:w-6" />
                <span>Buy raidcoin</span>
                <ExternalLink className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-slate-400 text-sm md:text-base px-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Live payouts every 10 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
                <span>No fees or hidden costs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
                <span>Instant point calculation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-12 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Why Choose raidcoin Rewards?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              The most rewarding way to support $raidcoin while earning real cryptocurrency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-indigo-500/50 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-500/30 transition-colors">
                <Twitter className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Easy Social Posting</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-lg">
                Simply tweet about $raidcoin using hashtags or mentions. Our system automatically tracks your posts and calculates rewards.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-emerald-500/30 transition-colors">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Engagement Rewards</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-lg">
                Earn more points for higher engagement. Likes, retweets, replies, and quotes all contribute to your reward multiplier.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-amber-500/50 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-amber-500/30 transition-colors">
                <Coins className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Automatic Payouts</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-lg">
                Receive SOL directly to your wallet every 10 minutes. No minimum threshold, no manual claims required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="relative py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              Start earning SOL in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Connect Twitter</h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base px-2">
                Sign in with your Twitter account to get started. We'll track your $raidcoin posts automatically.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Post About $raidcoin</h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base px-2">
                Tweet about $raidcoin using hashtags or mentions. Share your thoughts, news, or memes!
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-emerald-400 rounded-full animate-pulse delay-500"></div>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Earn Points</h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base px-2">
                Get points based on engagement. More likes, retweets, and replies mean higher rewards.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl font-bold text-white">4</span>
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-amber-400 rounded-full animate-pulse delay-700"></div>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Get Paid in SOL</h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base px-2">
                Receive automatic SOL payouts every 10 minutes directly to your wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div id="stats" className="relative py-12 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Community Stats
            </h2>
            <p className="text-lg md:text-xl text-slate-300 px-4">
              Join thousands of raiders earning real rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <Users className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-5xl font-bold mb-2">2,500+</div>
              <div className="text-indigo-200 text-lg md:text-xl font-medium">Active Raiders</div>
              <div className="text-indigo-300 text-sm mt-2">Growing daily</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <Zap className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-emerald-200 text-lg md:text-xl font-medium">Points Earned</div>
              <div className="text-emerald-300 text-sm mt-2">This week</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <Coins className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-amber-200 text-lg md:text-xl font-medium">SOL Distributed</div>
              <div className="text-amber-300 text-sm mt-2">And counting</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
              Ready to Start
              <span className="block bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Earning SOL?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Join the raidcoin community today and turn your social media activity into real cryptocurrency rewards.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12 px-4">
              <button
                onClick={() => signIn('twitter')}
                className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 text-white px-10 py-4 md:px-16 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/25 flex items-center space-x-3 md:space-x-4 w-full sm:w-auto"
              >
                <Twitter className="h-6 w-6 md:h-8 md:w-8" />
                <span>Start Earning Now</span>
                <ArrowRight className="h-6 w-6 md:h-8 md:w-8 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <a
                href={`https://pump.fun/coin/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 md:px-16 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center space-x-3 md:space-x-4 w-full sm:w-auto"
              >
                <Coins className="h-6 w-6 md:h-8 md:w-8" />
                <span>Buy raidcoin</span>
                <ExternalLink className="h-6 w-6 md:h-8 md:w-8 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 mt-8 md:mt-12 text-slate-400 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>No registration fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                <span>Instant point tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-400 rounded-full animate-pulse delay-500"></div>
                <span>Automatic payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}