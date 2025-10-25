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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}