'use client'

import React from 'react'
import { Twitter, Coins, TrendingUp, Users, Zap, ArrowRight, Star, DollarSign, Copy, ExternalLink, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DocsPage() {
  const contractAddress = process.env.NEXT_PUBLIC_RAIDCOIN_TOKEN_MINT
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">raidcoin Documentation</h1>
              <p className="text-slate-300 text-sm md:text-base">Everything you need to know about earning SOL with raidcoin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Table of Contents */}
          <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-indigo-400 mr-2 md:mr-3" />
              Table of Contents
            </h2>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <a href="#overview" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">1. Overview</a>
                <a href="#getting-started" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">2. Getting Started</a>
                <a href="#token-requirements" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">3. Token Requirements</a>
                <a href="#how-to-earn" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">4. How to Earn</a>
              </div>
              <div className="space-y-1 md:space-y-2">
                <a href="#point-system" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">5. Point System</a>
                <a href="#payouts" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">6. Payouts</a>
                <a href="#contract-info" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">7. Contract Information</a>
                <a href="#rewards-distribution" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">8. Rewards Distribution</a>
                <a href="#faq" className="block text-indigo-300 hover:text-indigo-200 transition-colors text-sm md:text-base">9. FAQ</a>
              </div>
            </div>
          </div>

          {/* Overview */}
          <section id="overview" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-emerald-400 mr-2 md:mr-3" />
              Overview
            </h2>
            <div className="space-y-3 md:space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
              <p>
                raidcoin Rewards is a revolutionary platform that allows you to earn Solana (SOL) by creating engaging content about $raidcoin on Twitter/X. 
                The more engagement your tweets receive, the more SOL you earn.
              </p>
              <p>
                Our platform tracks your tweets that mention $raidcoin, #raidcoin, or @raidcoin, calculates points based on engagement metrics, 
                and automatically distributes SOL rewards every 10 minutes based on your contribution to the community.
              </p>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-indigo-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-indigo-200 mb-2 text-sm md:text-base">Key Benefits</h4>
                    <ul className="space-y-1 text-indigo-300 text-sm md:text-base">
                      <li>• Automatic point calculation and SOL distribution</li>
                      <li>• No manual claims or complex processes</li>
                      <li>• Rewards based on real engagement metrics</li>
                      <li>• Support the $raidcoin community while earning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <ArrowRight className="h-6 w-6 md:h-7 md:w-7 text-blue-400 mr-2 md:mr-3" />
              Getting Started
            </h2>
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold mb-2 text-sm">Connect Twitter</h4>
                  <p className="text-xs text-indigo-200">Sign in with your Twitter/X account</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold mb-2 text-sm">Bind Wallet</h4>
                  <p className="text-xs text-blue-200">Connect your Solana wallet address</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold mb-2 text-sm">Buy Tokens</h4>
                  <p className="text-xs text-emerald-200">Acquire 500k+ raidcoin tokens</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <h4 className="font-bold mb-2 text-sm">Start Earning</h4>
                  <p className="text-xs text-amber-200">Tweet and submit for rewards</p>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 md:p-4">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-200 mb-2 text-sm md:text-base">Important Requirements</h4>
                    <p className="text-amber-300 text-sm md:text-base">
                      You must hold at least 500,000 raidcoin tokens in your connected wallet to participate. 
                      This ensures quality participation and supports the token ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Token Requirements */}
          <section id="token-requirements" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Coins className="h-6 w-6 md:h-7 md:w-7 text-amber-400 mr-2 md:mr-3" />
              Token Requirements
            </h2>
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-amber-200 mb-3 md:mb-4">Minimum Token Holding</h3>
                <div className="text-2xl md:text-3xl font-bold text-amber-300 mb-2">500,000 raidcoin Tokens</div>
                <p className="text-amber-300 text-sm md:text-base">
                  This requirement ensures that participants are genuine community members and helps maintain the quality of content.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold text-emerald-200 mb-3 flex items-center text-sm md:text-base">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Why This Requirement?
                  </h4>
                  <ul className="space-y-2 text-emerald-300 text-sm">
                    <li>• Prevents spam and low-quality submissions</li>
                    <li>• Ensures genuine community participation</li>
                    <li>• Supports token value and ecosystem</li>
                    <li>• Creates sustainable reward distribution</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold text-blue-200 mb-3 flex items-center text-sm md:text-base">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Verification Process
                  </h4>
                  <ul className="space-y-2 text-blue-300 text-sm">
                    <li>• Automatic balance checking every 30 seconds</li>
                    <li>• Real-time verification using Solana blockchain</li>
                    <li>• Tokens must be in your connected wallet</li>
                    <li>• No staking or locking required</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How to Earn */}
          <section id="how-to-earn" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Twitter className="h-6 w-6 md:h-7 md:w-7 text-blue-400 mr-2 md:mr-3" />
              How to Earn
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-blue-200 mb-3 md:mb-4">Content Requirements</h3>
                <p className="text-blue-300 mb-3 md:mb-4 text-sm md:text-base">Your tweets must include one or more of the following:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-blue-600/20 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-300 mb-2">$raidcoin</div>
                    <p className="text-xs md:text-sm text-blue-400">Ticker symbol</p>
                  </div>
                  <div className="bg-blue-600/20 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-300 mb-2">#raidcoin</div>
                    <p className="text-xs md:text-sm text-blue-400">Hashtag</p>
                  </div>
                  <div className="bg-blue-600/20 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-300 mb-2">@raidcoin</div>
                    <p className="text-xs md:text-sm text-blue-400">Mention</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Submission Process</h3>
                <ol className="space-y-3 text-slate-300 text-sm md:text-base">
                  <li className="flex items-start space-x-3">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">1</span>
                    <span>Create a tweet that mentions $raidcoin, uses #raidcoin, or mentions @raidcoin</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">2</span>
                    <span>Copy the tweet URL from your browser after posting</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">3</span>
                    <span>Paste the URL in the submission form on the dashboard</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">4</span>
                    <span>Our system will automatically track engagement and calculate points</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Point System */}
          <section id="point-system" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Star className="h-6 w-6 md:h-7 md:w-7 text-yellow-400 mr-2 md:mr-3" />
              Point System
            </h2>
            <div className="space-y-4">
              <p className="text-slate-300 text-sm md:text-lg">
                Points are calculated based on the engagement your tweets receive. Higher engagement means more points and bigger SOL rewards.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl">❤️</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">Likes</h3>
                      <p className="text-pink-200 text-sm">1 point each</p>
                    </div>
                  </div>
                  <p className="text-pink-300 text-xs md:text-sm">Every like on your tweet earns you 1 point</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl">🔄</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">Retweets</h3>
                      <p className="text-green-200 text-sm">3 points each</p>
                    </div>
                  </div>
                  <p className="text-green-300 text-xs md:text-sm">Retweets are weighted higher as they show strong engagement</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl">💬</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">Replies</h3>
                      <p className="text-blue-200 text-sm">2 points each</p>
                    </div>
                  </div>
                  <p className="text-blue-300 text-xs md:text-sm">Comments and replies indicate meaningful engagement</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 md:p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl">🔗</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">Quote Tweets</h3>
                      <p className="text-purple-200 text-sm">3 points each</p>
                    </div>
                  </div>
                  <p className="text-purple-300 text-xs md:text-sm">Quote tweets with commentary are highly valuable</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-yellow-200 mb-3">💡 Pro Tips for Maximum Points</h3>
                <ul className="space-y-2 text-yellow-300 text-sm">
                  <li>• Post during peak hours when your audience is most active</li>
                  <li>• Create engaging content that encourages discussion</li>
                  <li>• Use trending topics and relevant hashtags alongside #raidcoin</li>
                  <li>• Interact with the raidcoin community to build relationships</li>
                  <li>• Share news, insights, or educational content about crypto</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payouts */}
          <section id="payouts" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <DollarSign className="h-6 w-6 md:h-7 md:w-7 text-green-400 mr-2 md:mr-3" />
              Payouts
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-300 mb-2">Every 10 Minutes</div>
                  <h4 className="font-bold text-green-200 mb-2 text-sm md:text-base">Payout Frequency</h4>
                  <p className="text-green-400 text-xs md:text-sm">Automatic SOL distribution based on your points</p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">No Minimum</div>
                  <h4 className="font-bold text-blue-200 mb-2 text-sm md:text-base">Threshold</h4>
                  <p className="text-blue-400 text-xs md:text-sm">Earn any amount of points and get paid</p>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-300 mb-2">50%</div>
                  <h4 className="font-bold text-purple-200 mb-2 text-sm md:text-base">Community Share</h4>
                  <p className="text-purple-400 text-xs md:text-sm">Of total rewards pool goes to content creators</p>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">How Payouts Work</h3>
                <div className="space-y-3 md:space-y-4 text-slate-300 text-sm md:text-base">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-600 rounded-full w-1.5 h-1.5 md:w-2 md:h-2 mt-2"></div>
                    <p><strong>Point Calculation:</strong> Every 10 minutes, our system calculates total points earned by all participants</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-600 rounded-full w-1.5 h-1.5 md:w-2 md:h-2 mt-2"></div>
                    <p><strong>Reward Distribution:</strong> 50% of the rewards pool is distributed proportionally based on your point contribution</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-600 rounded-full w-1.5 h-1.5 md:w-2 md:h-2 mt-2"></div>
                    <p><strong>Automatic Transfer:</strong> SOL is automatically sent to your connected wallet address</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-600 rounded-full w-1.5 h-1.5 md:w-2 md:h-2 mt-2"></div>
                    <p><strong>No Claims Needed:</strong> Everything is automated - just create content and earn</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contract Information */}
          <section id="contract-info" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Shield className="h-6 w-6 md:h-7 md:w-7 text-indigo-400 mr-2 md:mr-3" />
              Contract Information
            </h2>
            <div className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-indigo-200 mb-3 md:mb-4">raidcoin Token Contract</h3>
                <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3 md:p-4">
                  <code className="text-indigo-300 font-mono text-xs md:text-sm break-all">{contractAddress}</code>
                  <button
                    onClick={() => copyToClipboard(contractAddress)}
                    className="ml-3 md:ml-4 p-1.5 md:p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                    title="Copy contract address"
                  >
                    <Copy className="h-3 w-3 md:h-4 md:w-4 text-slate-400 group-hover:text-white" />
                  </button>
                </div>
                <div className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-4">
                  <a
                    href={`https://pump.fun/coin/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    <Coins className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Buy on Pump.fun</span>
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                  </a>
                  <a
                    href={`https://solscan.io/token/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm"
                  >
                    <span>View on Solscan</span>
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold mb-3 text-sm md:text-base">Token Details</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li><strong>Name:</strong> raidcoin</li>
                    <li><strong>Symbol:</strong> $RAIDCOIN</li>
                    <li><strong>Network:</strong> Solana</li>
                    <li><strong>Decimals:</strong> 6</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold mb-3 text-sm md:text-base">Security</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>✅ Verified contract</li>
                    <li>✅ Public blockchain verification</li>
                    <li>✅ Transparent reward distribution</li>
                    <li>✅ No admin keys or backdoors</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Rewards Distribution */}
          <section id="rewards-distribution" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <DollarSign className="h-6 w-6 md:h-7 md:w-7 text-emerald-400 mr-2 md:mr-3" />
              Rewards Distribution & Wallets
            </h2>
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-emerald-200 mb-3 md:mb-4">Revenue Split</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 font-semibold">Raiders/Workers</span>
                      <span className="text-2xl font-bold text-emerald-400">50%</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Half of all rewards go directly to users who create content and engage with $raidcoin
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-300 font-semibold">Development Team</span>
                      <span className="text-2xl font-bold text-indigo-400">50%</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Half goes to the development team for platform maintenance and improvements
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold mb-3 text-sm md:text-base flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-emerald-400" />
                    Rewards Pool Wallet
                  </h4>
                  <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3 md:p-4">
                    <code className="text-emerald-300 font-mono text-xs md:text-sm break-all">EUZHkLdK57woXEi24ZqE1nr9pDJA3FnAphoqg8M5yGSr</code>
                    <button
                      onClick={() => copyToClipboard("EUZHkLdK57woXEi24ZqE1nr9pDJA3FnAphoqg8M5yGSr")}
                      className="ml-3 md:ml-4 p-1.5 md:p-2 hover:bg-slate-600 rounded-lg transition-colors group"
                      title="Copy rewards pool address"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4 text-slate-400 group-hover:text-white" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm mt-2">
                    This wallet holds and distributes all rewards. All payouts are automated and transparent.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                  <h4 className="font-bold mb-3 text-sm md:text-base flex items-center">
                    <Users className="h-4 w-4 mr-2 text-indigo-400" />
                    Team Wallet
                  </h4>
                  <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3 md:p-4">
                    <code className="text-indigo-300 font-mono text-xs md:text-sm break-all">36Vqo2weNnPUfnzEn4ounbV4w7wqmzPncb4wQQrTMQZU</code>
                    <button
                      onClick={() => copyToClipboard("36Vqo2weNnPUfnzEn4ounbV4w7wqmzPncb4wQQrTMQZU")}
                      className="ml-3 md:ml-4 p-1.5 md:p-2 hover:bg-slate-600 rounded-lg transition-colors group"
                      title="Copy team wallet address"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4 text-slate-400 group-hover:text-white" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm mt-2">
                    Development team wallet that receives 50% of the rewards for platform maintenance and development.
                  </p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-200 mb-1">Transparency Notice</h4>
                      <p className="text-amber-100 text-sm">
                        All wallet addresses are public and can be verified on the Solana blockchain. 
                        The 50/50 split ensures sustainable platform development while maximizing rewards for active users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <Users className="h-6 w-6 md:h-7 md:w-7 text-emerald-400 mr-2 md:mr-3" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-emerald-200">Do I need to keep my tokens staked or locked?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  No! You just need to hold 500,000+ RaidCoin tokens in your wallet. You can buy, sell, or trade them freely. 
                  The system only checks your balance when you want to submit tweets.
                </p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-blue-200">How often are rewards distributed?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  Rewards are automatically calculated and distributed every 10 minutes. You don't need to claim anything - 
                  SOL is sent directly to your connected wallet address.
                </p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-purple-200">What if my tweet doesn't get much engagement?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  Every point counts! Even if your tweet gets just a few likes, you'll still earn proportional rewards. 
                  The key is consistency and creating content that resonates with the community.
                </p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-amber-200">Can I submit the same tweet multiple times?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  No, each tweet can only be submitted once. However, our system continuously tracks engagement on submitted tweets, 
                  so if your tweet gains more likes or retweets later, your points will increase automatically.
                </p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-indigo-200">What happens if I don't have enough tokens anymore?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  If your token balance drops below 500,000, you won't be able to submit new tweets. However, any previously submitted 
                  tweets will continue to earn rewards based on their ongoing engagement.
                </p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-green-200">Are there any fees or costs?</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  No! There are no platform fees, submission costs, or hidden charges. The only requirement is holding the minimum token amount. 
                  All rewards go directly to content creators.
                </p>
              </div>
              
            </div>
          </section>

          {/* Contact */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Need More Help?</h2>
            <p className="text-indigo-200 mb-4 md:mb-6 text-sm md:text-base">
              If you have questions not covered in this documentation, feel free to reach out to our community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <a
                href="https://x.com/xraidcoin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                <span>Follow @xraidcoin</span>
              </a>
              <a
                href="/"
                className="inline-flex items-center space-x-2 bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base"
              >
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                <span>Get Started Now</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}