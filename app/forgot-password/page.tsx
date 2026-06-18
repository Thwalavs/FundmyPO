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
            <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '.5rem' }}>Forgot your password?</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div style={{ background: 'rgba(13,126,126,0.08)', border: '1px solid rgba(13,126,126,0.25)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#0D7E7E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#fff', fontSize: '22px' }}>✓</span>
              </div>
              <p style={{ fontFamily: '"Poppins", sans-serif', color: '#1F2937', fontSize: '15px', fontWeight: '700', marginBottom: '.5rem' }}>Email sent!</p>
              <p style={{ color: '#0D7E7E', fontSize: '13px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                We&apos;ve sent a reset link to <strong>{email}</strong>. Check your inbox and click the link.
              </p>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '1.5rem' }}>
                Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <button onClick={() => setSent(false)}
                style={{ padding: '10px 24px', background: '#0D7E7E', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Try again
              </button>
            </div>
          ) : (
            <div>
              {error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: '500' }}>
                  Email address <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@company.co.za"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ width: '100%', padding: '11px 14px', border: `1px solid ${email ? '#0D7E7E' : '#d1d5db'}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: loading ? '#9CA3AF' : '#0D7E7E',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: '"Poppins", sans-serif'
                }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '1.25rem' }}>
                Remembered your password?{' '}
                <Link href="/register" style={{ color: '#0D7E7E', fontWeight: '600', textDecoration: 'none' }}>
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
