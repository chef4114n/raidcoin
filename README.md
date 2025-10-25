# RaidCoin Rewards Platform

A Next.js application that rewards users with Solana (SOL) for posting about $raidcoin on Twitter/X.

## Features

- **User-Submitted Tweets**: Users can submit their own tweets for point calculation (solves expensive API costs)
- **Twitter API Integration**: Optional automated tracking with API (requires paid tier)  
- **Point System**: Awards points based on tweet engagement (likes, retweets, replies, quotes)
- **Solana Payouts**: Distributes SOL rewards every 10 minutes based on accumulated points
- **Real-time Dashboard**: Track your points, posts, and payout history
- **Wallet Integration**: Connect your Solana wallet to receive payments

## How It Works

### Option 1: User-Submitted Tweets (Free)
1. **Sign in with Twitter** - Connect your Twitter account
2. **Post about $raidcoin** - Create tweets mentioning $raidcoin, #raidcoin, or @raidcoin
3. **Submit Tweet URL** - Paste your tweet URL in the dashboard
4. **Earn Points** - Get points based on your tweet's engagement
5. **Receive SOL** - Automatic payouts every 10 minutes proportional to your points

### Option 2: Automated Tracking (Paid API)
1. **Configure Twitter API** - Add Bearer Token to environment variables
2. **Automatic Detection** - System finds your tweets automatically
3. **Real-time Updates** - Engagement metrics updated automatically
4. **Earn & Receive** - Same point and payout system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Twitter OAuth
- **Blockchain**: Solana Web3.js
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Twitter Developer Account
- Solana wallet with SOL for payouts

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/raidcoin_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Twitter/X API
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"

# Solana
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
SOLANA_PRIVATE_KEY="your-solana-private-key-base58"
CREATOR_WALLET_ADDRESS="your-creator-wallet-address"

# App Configuration
CREATOR_FEE_PERCENTAGE="5"
POINTS_CALCULATION_INTERVAL="10"
```

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd raidcoin
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
npm run db:generate
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. **Connect to Vercel**:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Database Setup**:
   - Use a cloud PostgreSQL service (Supabase, Neon, or similar)
   - Update `DATABASE_URL` in Vercel environment variables

### Twitter API Setup (Optional)

**Free Tier (Testing Only):**
- Cost: Free
- Limits: 1,500 tweets/month
- Suitable for: Small-scale testing

**Basic Tier (Production):**
- Cost: $100/month  
- Limits: 10,000 tweets/month
- Suitable for: Small to medium communities

**Alternative: User Submission (Recommended)**
- Cost: Free
- Users submit their own tweet URLs
- Manual verification process
- Community-driven approach

For free usage, the platform defaults to user-submitted tweets. Users can paste their tweet URLs directly in the dashboard.

4. **Solana Configuration**:
   - Generate a new Solana keypair for the payout wallet
   - Convert private key to base58 format
   - Fund the wallet with SOL for payouts

5. **Deploy**:
   - Vercel will automatically deploy with the cron jobs configured

## API Endpoints

### Public Endpoints
- `GET /api/auth/[...nextauth]` - Authentication endpoints

### Protected Endpoints
- `POST /api/fetch-tweets` - Fetch new tweets (cron job)
- `POST /api/calculate-points` - Calculate points for tweets (cron job)  
- `POST /api/process-payouts` - Process SOL payouts (cron job)
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/posts` - Get user's tracked posts
- `GET /api/user/payouts` - Get user's payout history
- `POST /api/user/wallet` - Update user's wallet address

## Point Calculation

Points are awarded based on engagement metrics:
- **Likes**: 1 point each
- **Retweets**: 3 points each  
- **Replies**: 2 points each
- **Quotes**: 3 points each

Additional factors:
- Minimum 1 point for posting
- Time decay bonus for recent posts
- Points reset after each payout cycle

## Security Considerations

- Environment variables are properly secured
- API endpoints require authentication where appropriate
- Solana private keys are handled securely
- Rate limiting is implemented for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open a GitHub issue
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Mobile app development
- [ ] Multiple token support
- [ ] Advanced analytics dashboard
- [ ] Community features
- [ ] Referral system