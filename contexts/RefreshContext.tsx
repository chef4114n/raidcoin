'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface RefreshContextType {
  refreshAdminPanel: () => void
  refreshDashboard: () => void
  triggerAdminRefresh: () => void
  triggerDashboardRefresh: () => void
  lastAdminRefresh: Date | null
  lastDashboardRefresh: Date | null
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined)

export function useRefresh() {
  const context = useContext(RefreshContext)
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider')
  }
  return context
}

interface RefreshProviderProps {
  children: React.ReactNode
}

export function RefreshProvider({ children }: RefreshProviderProps) {
  const [refreshTriggers, setRefreshTriggers] = useState({
    admin: 0,
    dashboard: 0
  })
  const [lastAdminRefresh, setLastAdminRefresh] = useState<Date | null>(null)
  const [lastDashboardRefresh, setLastDashboardRefresh] = useState<Date | null>(null)

  const triggerAdminRefresh = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, admin: prev.admin + 1 }))
    setLastAdminRefresh(new Date())
  }, [])

  const triggerDashboardRefresh = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, dashboard: prev.dashboard + 1 }))
    setLastDashboardRefresh(new Date())
  }, [])

  // These will be set by the components when they mount
  const [adminRefreshFn, setAdminRefreshFn] = useState<(() => void) | null>(null)
  const [dashboardRefreshFn, setDashboardRefreshFn] = useState<(() => void) | null>(null)

  const refreshAdminPanel = useCallback(() => {
    if (adminRefreshFn) {
      adminRefreshFn()
    }
  }, [adminRefreshFn])

  const refreshDashboard = useCallback(() => {
    if (dashboardRefreshFn) {
      dashboardRefreshFn()
    }
  }, [dashboardRefreshFn])

  const value = {
    refreshAdminPanel,
    refreshDashboard,
    triggerAdminRefresh,
    triggerDashboardRefresh,
    lastAdminRefresh,
    lastDashboardRefresh
  }

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  )
}