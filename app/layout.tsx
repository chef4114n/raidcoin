import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'raidcoin Rewards - Earn SOL for $raidcoin Posts',
  description: 'Earn Solana rewards for posting about $raidcoin on Twitter. Join thousands of raiders earning real SOL through social media engagement. Automatic payouts every 10 minutes.',
  keywords: ['raidcoin', 'solana', 'rewards', 'twitter', 'crypto', 'earnings', 'sol', 'blockchain', 'social media'],
  authors: [{ name: 'raidcoin Team' }],
  creator: 'raidcoin',
  publisher: 'raidcoin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.raidcoin.live'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.raidcoin.live',
    siteName: 'raidcoin Rewards',
    title: 'raidcoin Rewards - Earn SOL for $raidcoin Posts',
    description: 'Earn Solana rewards for posting about $raidcoin on Twitter. Join thousands of raiders earning real SOL through social media engagement. Automatic payouts every 10 minutes.',
    images: [
      {
        url: '/raidcoin-banner.png',
        width: 1200,
        height: 630,
        alt: 'raidcoin Rewards - Turn Your Tweets Into SOL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'raidcoin Rewards - Earn SOL for $raidcoin Posts',
    description: 'Earn Solana rewards for posting about $raidcoin on Twitter. Automatic payouts every 10 minutes.',
    images: ['/raidcoin-banner.png'],
    creator: '@xraidcoin',
    site: '@xraidcoin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/raidcoin-logo.png" sizes="any" />
        <link rel="icon" href="/raidcoin-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/raidcoin-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}