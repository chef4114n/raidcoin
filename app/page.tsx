'use client'

import { useState, useEffect } from 'react'
import { AppContent } from '@/components/app-content'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return <AppContent />
}