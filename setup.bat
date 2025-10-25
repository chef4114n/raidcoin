@echo off
echo 🚀 Setting up RaidCoin Rewards Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist .env.local (
    echo 📋 Creating .env.local from template...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local with your actual environment variables
) else (
    echo ✅ .env.local already exists
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
npm run db:generate

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your environment variables
echo 2. Set up your PostgreSQL database
echo 3. Run 'npm run db:push' to create database tables
echo 4. Run 'npm run dev' to start the development server
echo.
echo For deployment to Vercel:
echo 1. Push your code to GitHub
echo 2. Connect repository to Vercel
echo 3. Configure environment variables in Vercel dashboard
echo 4. Deploy!

pause