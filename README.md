# 🪙 $RAIDCOIN Twitter Rewards Platform

A complete Web3 rewards system that incentivizes Twitter engagement for the $RAIDCOIN community. Users earn Solana (SOL) rewards for posting about $raidcoin, with automatic payouts based on engagement metrics.

## 🌟 Features

### Core Functionality
- **🐦 Twitter OAuth Integration**: Seamless sign-in with Twitter/X
- **💎 Manual Tweet Submission**: Cost-effective alternative to expensive Twitter APIs
- **🔥 Smart Point System**: Rewards based on likes, retweets, replies, and quotes
- **⚡ Automated SOL Payouts**: Real-time distributions every 10 minutes
- **👛 Wallet Management**: Bind Solana wallets for seamless payments
- **📊 Real-time Dashboard**: Track points, submissions, and payout history

### Advanced Features
- **🛡️ Admin Review System**: Anti-fraud protection with manual approval
- **📈 Engagement Analytics**: Detailed metrics and performance tracking
- **🔄 Automated Point Calculation**: Background processing with Twitter API
- **🎯 Community Gamification**: Leaderboards and achievement system
- **🔐 Secure Authentication**: NextAuth.js with database sessions

## 🚀 How It Works

### For Users
1. **Connect Twitter Account** → Sign in with Twitter OAuth
2. **Bind Solana Wallet** → Add your wallet address for payments
3. **Post About $RAIDCOIN** → Create engaging content mentioning $raidcoin
4. **Submit Tweet URL** → Paste your tweet link in the dashboard
5. **Earn Points** → Get rewarded based on engagement metrics
6. **Receive SOL** → Automatic payouts every 10 minutes

### For Admins
1. **Review Submissions** → Approve/reject user-submitted tweets
2. **Monitor Analytics** → Track platform performance and user activity
3. **Process Payouts** → Automated SOL distribution system
4. **Manage Users** → User verification and wallet management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Lucide React Icons
- **State Management**: Zustand

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **External APIs**: Twitter API v2.0

### Blockchain
- **Network**: Solana (mainnet/devnet)
- **Library**: @solana/web3.js
- **Wallets**: Multi-wallet support

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase PostgreSQL
- **Environment**: Docker-ready

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Twitter Developer Account
- Solana wallet with SOL for payouts

### 1. Clone Repository
```bash
git clone https://github.com/chef4114n/raidcoin.git
cd raidcoin
npm install
```

### 2. Environment Configuration

Create `.env.local` with the following variables:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
POSTGRES_PRISMA_URL="postgresql://postgres:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key"

# Twitter OAuth 2.0 (Required)
TWITTER_CLIENT_ID="your-oauth2-client-id"
TWITTER_CLIENT_SECRET="your-oauth2-client-secret"
TWITTER_BEARER_TOKEN="your-bearer-token" # Optional, for automated tracking

# Solana
SOLANA_NETWORK="devnet" # or "mainnet-beta"
SOLANA_PRIVATE_KEY="your-base58-encoded-private-key"
CREATOR_WALLET_ADDRESS="your-creator-wallet-address"

# App Configuration
CREATOR_FEE_PERCENTAGE="10"
POINTS_CALCULATION_INTERVAL="10"
ADMIN_EMAIL="admin@example.com"
```

### 3. Database Setup
```bash
# Deploy database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Twitter Developer Setup

#### Create Twitter App
1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create new app with **OAuth 2.0** enabled
3. Configure settings:
   - **App Type**: Web App
   - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter`
   - **Website URL**: `http://localhost:3000`
   - **Scopes**: `tweet.read`, `users.read`

#### Get Credentials
1. Go to **Keys and tokens** tab
2. Copy **OAuth 2.0 Client ID** and **Client Secret**
3. (Optional) Generate **Bearer Token** for automated tracking

### 5. Solana Wallet Setup

Generate a new keypair for payouts:
```bash
node -e "
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58').default;
const keypair = Keypair.generate();
console.log('SOLANA_PRIVATE_KEY=' + bs58.encode(Buffer.from(keypair.secretKey)));
console.log('CREATOR_WALLET_ADDRESS=' + keypair.publicKey.toString());
"
```

⚠️ **Important**: Fund this wallet with SOL for payouts!

### 6. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel Deployment
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Import repository in Vercel dashboard
   - Configure environment variables
   - Deploy automatically

3. **Update Twitter Callback**:
   - Change callback URL to: `https://your-app.vercel.app/api/auth/callback/twitter`

4. **Database Migration**:
   ```bash
   npm run db:push
   ```

## 📊 Point System

### Engagement Scoring
- **👍 Likes**: 1 point each
- **🔄 Retweets**: 2 points each
- **💬 Replies**: 3 points each
- **🗣️ Quotes**: 2 points each

### Bonus Multipliers
- **🎯 $RAIDCOIN Mention**: +10% bonus
- **🔥 High Engagement**: Bonus for 100+ interactions
- **⏰ Recent Posts**: Time-based bonus decay

### Payout Calculation
- **Minimum Threshold**: 50 points
- **Distribution**: Proportional to total points
- **Creator Fee**: 10% of total pool
- **Frequency**: Every 10 minutes

## 🔧 API Reference

### Authentication Required
```
GET  /api/user/stats        # User statistics
GET  /api/user/posts        # User submissions
GET  /api/user/payouts      # Payout history
POST /api/user/wallet       # Update wallet address
POST /api/submit-tweet      # Submit tweet for review
```

### Admin Only
```
GET  /api/admin/review-posts    # Pending submissions
POST /api/admin/review-posts    # Approve/reject tweets
POST /api/calculate-points      # Manual point calculation
POST /api/process-payouts       # Trigger payouts
```

### System (Automated)
```
POST /api/fetch-tweets      # Automated tweet discovery
POST /api/calculate-points  # Background point calculation
POST /api/process-payouts   # Scheduled payout processing
```

## 🔒 Security Features

- **🛡️ Authentication**: NextAuth.js with database sessions
- **🔐 Environment Variables**: Secure secret management
- **🚫 API Rate Limiting**: Prevents abuse and spam
- **✅ Input Validation**: Comprehensive request validation
- **🔍 Admin Review**: Manual approval for quality control
- **💾 Audit Logging**: Complete transaction history

## 🏗️ Project Structure

```
raidcoin/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handlers
│   │   ├── user/          # User endpoints
│   │   └── admin/         # Admin endpoints
│   ├── auth/              # Auth pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard.tsx      # User dashboard
│   ├── landing-page.tsx   # Landing page
│   └── admin-panel.tsx    # Admin interface
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Database client
│   ├── solana.ts          # Blockchain integration
│   └── twitter.ts         # Twitter API client
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🚀 Roadmap

### Phase 1 (Current)
- [x] Core rewards system
- [x] Twitter OAuth integration
- [x] Manual tweet submission
- [x] Automated SOL payouts
- [x] Admin review system

### Phase 2 (Next)
- [ ] Mobile responsive design
- [ ] Advanced analytics dashboard
- [ ] Referral system
- [ ] Multiple token support
- [ ] Performance optimizations

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Discord integration
- [ ] NFT rewards
- [ ] Community governance
- [ ] Multi-chain support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📞 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/chef4114n/raidcoin/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/chef4114n/raidcoin/discussions)
- **📧 Email**: support@raidcoin.example
- **🐦 Twitter**: [@raidcoin](https://twitter.com/raidcoin)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for blockchain infrastructure
- **Vercel** for hosting and deployment
- **Supabase** for database services
- **Twitter** for API access
- **Open Source Community** for amazing tools and libraries

---

**Built with ❤️ for the $RAIDCOIN community**