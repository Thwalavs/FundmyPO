'use client'

import { useEffect, useRef } from 'react'

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
const TIMEOUT_MS = 180000
const STORAGE_KEY = 'fundmypo-last-activity'

async function getSupabase() {
  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}

export default function IdleLogout() {
  const timerRef = useRef<number | null>(null)
  const signedOutRef = useRef(false)

  useEffect(() => {
    let active = true

    const resetTimer = () => {
      if (!active) return
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(logoutUser, TIMEOUT_MS)
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString())
      } catch {
        // ignore storage failures
      }
    }

    const logoutUser = async () => {
      if (signedOutRef.current) return
      signedOutRef.current = true
      try {
        const supabase = await getSupabase()
        await supabase.auth.signOut()
      } catch {
        // ignore errors while logging out
      }
      if (active) {
        window.location.href = '/register'
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        resetTimer()
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        resetTimer()
      }
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ]

    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, resetTimer, { passive: true })
    )
    window.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('storage', handleStorage)

    resetTimer()

    return () => {
      active = false
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, resetTimer)
      )
      window.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return null
}
