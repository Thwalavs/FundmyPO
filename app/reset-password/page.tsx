'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [linkChecking, setLinkChecking] = useState(true)

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
  ]
  const passwordValid = passwordChecks.every(c => c.met)

  async function getSupabase() {
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(
      'https://efzszombcfxyyobqehyp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
    )
  }

  useEffect(() => {
    void (async () => {
      const supabase = await getSupabase()

      // Handle hash-based token (#access_token=...&type=recovery)
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setReady(true)
          setLinkChecking(false)
          return
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setReady(true)
            setLinkChecking(false)
          }
        })
        return () => subscription.unsubscribe()
      }

      // Handle query param token (?token_hash=...&type=recovery)
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'invalid_link') {
        setReady(false)
        setLinkChecking(false)
        return
      }

      const token_hash = params.get('token_hash')
      const type = params.get('type')

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as 'recovery' | 'signup' | 'magiclink',
          token_hash,
        })
        setReady(!error)
        setLinkChecking(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      }
      setLinkChecking(false)
    })()
  }, [])

  async function handleReset() {
    if (!passwordValid) { setError('Password does not meet all requirements.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) { setError(error.message); setLoading(false); return }
      setMessage('Password updated successfully! Redirecting to login...')
      setTimeout(() => router.push('/register'), 2500)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setError('Error: ' + message)
      setLoading(false)
    }
  }

  const borderColor = (val: string, valid: boolean) =>
    val.length === 0 ? '#d1d5db' : valid ? '#0D7E7E' : '#DC2626'

  return (
    <main style={{ fontFamily: '"Inter", sans-serif', minHeight: '100vh', background: '#FAFAF8' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>

      <nav style={{ background: '#1F2937', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{ height: '48px', width: 'auto' }} />
        </Link>
        <Link href="/register" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: '500' }}>
          Back to login
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: 'calc(100vh - 65px)' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', background: '#0D7E7E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '.5rem' }}>Set new password</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Enter your new password below</p>
          </div>

          {linkChecking && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <p style={{ color: '#1D4ED8', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem' }}>Checking reset link...</p>
              <p style={{ color: '#2563EB', fontSize: '13px' }}>Please wait while we verify your password recovery token.</p>
            </div>
          )}

          {message && (
            <div style={{ background: 'rgba(13,126,126,0.08)', border: '1px solid rgba(13,126,126,0.25)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#0D7E7E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontSize: '22px' }}>✓</span>
              </div>
              <p style={{ fontFamily: '"Poppins", sans-serif', color: '#1F2937', fontSize: '15px', fontWeight: '700', marginBottom: '.5rem' }}>Password updated!</p>
              <p style={{ color: '#0D7E7E', fontSize: '13px' }}>Redirecting you to login...</p>
            </div>
          )}

          {!message && !ready && !linkChecking && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: '600', marginBottom: '.5rem' }}>Invalid or expired link</p>
              <p style={{ color: '#B91C1C', fontSize: '13px', marginBottom: '1rem' }}>
                This password reset link has expired or already been used. Please request a new one.
              </p>
              <button onClick={() => router.push('/forgot-password')}
                style={{ padding: '10px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Request new link
              </button>
            </div>
          )}

          {!message && ready && (
            <div>
              {error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' }}>
                  New password <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${borderColor(password, passwordValid)}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                />
                {password.length > 0 && (
                  <div style={{ marginTop: '8px', padding: '10px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password requirements:</p>
                    {passwordChecks.map(({ label, met }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: met ? '#0D7E7E' : '#DC2626' }}>{met ? 'OK' : 'X'}</span>
                        <span style={{ fontSize: '12px', color: met ? '#0D7E7E' : '#DC2626' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' }}>
                  Confirm new password <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${borderColor(confirm, confirm === password)}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                />
                {confirm.length > 0 && confirm !== password && (
                  <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleReset}
                disabled={loading || !passwordValid || password !== confirm}
                style={{
                  width: '100%', padding: '13px',
                  background: (!loading && passwordValid && password === confirm && confirm.length > 0) ? '#0D7E7E' : '#9CA3AF',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '.5rem',
                  fontFamily: '"Poppins", sans-serif'
                }}>
                {loading ? 'Updating password...' : 'Update password'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '1.25rem' }}>
                Remembered your password?{' '}
                <a href="/register" style={{ color: '#0D7E7E', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
