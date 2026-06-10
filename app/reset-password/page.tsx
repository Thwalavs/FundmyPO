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
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'invalid_link') {
        setReady(false)
        setLinkChecking(false)
        return
      }

      const supabase = await getSupabase()
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
        setLinkChecking(false)
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') setReady(true)
        })
        setLinkChecking(false)
        return () => subscription.unsubscribe()
      }
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


  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5',
    borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff'
  }
  const labelStyle = {
    display: 'block' as const, fontSize: '13px', color: '#555',
    marginBottom: '6px', fontWeight: '500'
  }
  const fieldStyle = { marginBottom: '1rem' }

  return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>

      {/* NAV */}
      <nav style={{ background: '#1B2B4B', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{ height: '48px', width: 'auto' }} />
        </Link>
        <Link href="/register" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          Back to login
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: 'calc(100vh - 65px)' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#0F6E56', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.25rem' }}>Set new password</h1>
            <p style={{ fontSize: '13px', color: '#888' }}>Enter your new password below</p>
          </div>

          {linkChecking && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <p style={{ color: '#1D4ED8', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem' }}>Checking reset link...</p>
              <p style={{ color: '#2563EB', fontSize: '13px' }}>Please wait while we verify your password recovery token.</p>
            </div>
          )}

          {/* Success state */}
          {message && (
            <div style={{ background: '#E1F5EE', border: '1px solid #5DCAA5', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#0F6E56', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontSize: '22px' }}>✓</span>
              </div>
              <p style={{ color: '#085041', fontSize: '15px', fontWeight: '600', marginBottom: '.5rem' }}>Password updated!</p>
              <p style={{ color: '#0F6E56', fontSize: '13px' }}>Redirecting you to login...</p>
            </div>
          )}

          {/* Invalid/expired link */}
          {!message && !ready && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: '600', marginBottom: '.5rem' }}>Invalid or expired link</p>
              <p style={{ color: '#B91C1C', fontSize: '13px', marginBottom: '1rem' }}>
                This password reset link has expired or already been used. Please request a new one.
              </p>
              <button onClick={() => router.push('/register')}
                style={{ padding: '10px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Back to login
              </button>
            </div>
          )}

          {/* Reset form */}
          {!message && ready && (
            <div>
              {error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <div style={fieldStyle}>
                <label style={labelStyle}>New password <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, borderColor: password.length === 0 ? '#e5e5e5' : passwordValid ? '#0F6E56' : '#DC2626' }}
                />
                {password.length > 0 && (
                  <div style={{ marginTop: '8px', padding: '10px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Password requirements:</p>
                    {passwordChecks.map(({ label, met }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: met ? '#0F6E56' : '#DC2626' }}>{met ? 'OK' : 'X'}</span>
                        <span style={{ fontSize: '12px', color: met ? '#0F6E56' : '#DC2626' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Confirm new password <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ ...inputStyle, borderColor: confirm.length === 0 ? '#e5e5e5' : confirm === password ? '#0F6E56' : '#DC2626' }}
                />
                {confirm.length > 0 && confirm !== password && (
                  <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleReset}
                disabled={loading || !passwordValid || password !== confirm}
                style={{
                  width: '100%', padding: '12px',
                  background: (!loading && passwordValid && password === confirm && confirm.length > 0) ? '#0F6E56' : '#9CA3AF',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '.5rem'
                }}>
                {loading ? 'Updating password...' : 'Update password'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1.25rem' }}>
                Remembered your password?{' '}
                <a href="/register" style={{ color: '#0F6E56', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}