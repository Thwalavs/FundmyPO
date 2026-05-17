'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleDemoLogin(type: string) {
    setLoading(true)
    setError('')
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        'https://efzszombcfxyyobqehyp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
      )
      const demoEmail = type === 'business' ? 'business@demo.com' : 'funder@demo.com'
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'Demo1234!'
      })
      if (error) {
        setError('Demo login failed: ' + error.message)
        setLoading(false)
        return
      }
      router.push(type === 'business' ? '/dashboard' : '/funder')
    } catch(e: any) {
      setError('Error: ' + e.message)
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <a href="/" style={{fontSize:'22px',fontWeight:'500',marginBottom:'1.5rem',textDecoration:'none',color:'#1a1a1a'}}>
        Fund<span style={{color:'#0F6E56'}}>MyPO</span>
      </a>
      <div style={{background:'#085041',borderRadius:'12px',padding:'1.25rem',width:'100%',maxWidth:'420px',marginBottom:'1rem'}}>
        <p style={{fontSize:'13px',fontWeight:'500',color:'#ffffff',marginBottom:'.75rem'}}>
          Investor Demo - try the platform instantly:
        </p>
        <div style={{display:'flex',gap:'8px'}}>
          <button
            onClick={()=>handleDemoLogin('business')}
            disabled={loading}
            style={{flex:1,padding:'9px',background:'#0F6E56',color:'#ffffff',border:'2px solid #5DCAA5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'500'}}>
            {loading ? 'Loading...' : 'Demo Business'}
          </button>
          <button
            onClick={()=>handleDemoLogin('funder')}
            disabled={loading}
            style={{flex:1,padding:'9px',background:'#0F6E56',color:'#ffffff',border:'2px solid #5DCAA5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'500'}}>
            {loading ? 'Loading...' : 'Demo Funder'}
          </button>
        </div>
      </div>
      {error && (
        <div style={{background:'#FEE2E2',border:'1px solid #FCA5A5',borderRadius:'8px',padding:'10px 12px',marginBottom:'1rem',fontSize:'13px',color:'#DC2626',width:'100%',maxWidth:'420px'}}>
          {error}
        </div>
      )}
      <div style={{background:'#ffffff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'420px',textAlign:'center'}}>
        <p style={{fontSize:'14px',color:'#666',marginBottom:'1rem'}}>Have an account? Sign in below:</p>
        <a href="/login" style={{display:'block',padding:'11px',background:'#0F6E56',color:'#ffffff',borderRadius:'8px',fontSize:'14px',fontWeight:'500',textDecoration:'none',marginBottom:'1rem'}}>
          Sign in
        </a>
        <p style={{fontSize:'13px',color:'#666'}}>
          New user? <a href="/signup" style={{color:'#0F6E56'}}>Create account</a>
        </p>
      </div>
    </main>
  )
}