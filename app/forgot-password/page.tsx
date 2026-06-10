'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email) { setError('Please enter your email address.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reset-password-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || 'Failed to send email. Please try again.'); return }
      setSent(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError('Error: ' + msg)
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5',
    borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff'
  }

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

          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: '52px', height: '52px', background: '#0F6E56', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.25rem' }}>Forgot your password?</h1>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div style={{ background: '#E1F5EE', border: '1px solid #5DCAA5', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#0F6E56', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontSize: '22px' }}>✓</span>
              </div>
              <p style={{ color: '#085041', fontSize: '15px', fontWeight: '600', marginBottom: '.5rem' }}>Email sent!</p>
              <p style={{ color: '#0F6E56', fontSize: '13px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
              </p>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '1.5rem' }}>
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button onClick={() => setSent(false)}
                style={{ padding: '10px 24px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Try again
              </button>
            </div>
          ) : (
            <div>
              {error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: '500' }}>
                  Email address <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@company.co.za"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ ...inputStyle, borderColor: email ? '#0F6E56' : '#e5e5e5' }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px',
                  background: loading ? '#9CA3AF' : '#0F6E56',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1.25rem' }}>
                Remembered your password?{' '}
                <Link href="/register" style={{ color: '#0F6E56', fontWeight: '600', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}