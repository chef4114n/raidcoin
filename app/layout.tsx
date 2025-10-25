import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RaidCoin Rewards - Earn SOL for $raidcoin Posts',
  description: 'Earn Solana rewards for posting about $raidcoin on Twitter. Track your points and receive automatic payouts.',
  keywords: ['raidcoin', 'solana', 'rewards', 'twitter', 'crypto', 'earnings'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}