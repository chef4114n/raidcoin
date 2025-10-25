#!/bin/bash

# RaidCoin Rewards Platform Setup Script

echo "🚀 Setting up RaidCoin Rewards Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your actual environment variables"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your environment variables"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'npm run db:push' to create database tables"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For deployment to Vercel:"
echo "1. Push your code to GitHub"
echo "2. Connect repository to Vercel"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Deploy!"