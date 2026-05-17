'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function getSupabase() {
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(
      'https://efzszombcfxyyobqehyp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
    )
  }

  async function handleDemoLogin(type: string) {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const demoEmail = type === 'business' ? 'business@demo.com' : 'funder@demo.com'
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'Demo1234!'
      })
      if (error) { setError('Demo login failed: ' + error.message); setLoading(false); return }
      router.push(type === 'business' ? '/dashboard' : '/funder')
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            first_name: firstName,
            last_name: lastName,
            business_name: businessName,
            phone,
            company_reg: companyReg,
          }
        }
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess(true)
      setLoading(false)
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
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
          <button onClick={()=>handleDemoLogin('business')} disabled={loading}
            style={{flex:1,padding:'9px',background:'#0F6E56',color:'#ffffff',border:'2px solid #5DCAA5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'500'}}>
            {loading ? 'Loading...' : 'Demo Business'}
          </button>
          <button onClick={()=>handleDemoLogin('funder')} disabled={loading}
            style={{flex:1,padding:'9px',background:'#0F6E56',color:'#ffffff',border:'2px solid #5DCAA5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'500'}}>
            {loading ? 'Loading...' : 'Demo Funder'}
          </button>
        </div>
      </div>

      <div style={{background:'#ffffff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'420px'}}>

        <div style={{display:'flex',border:'1px solid #e5e5e5',borderRadius:'8px',overflow:'hidden',marginBottom:'1.5rem'}}>
          <button onClick={()=>setTab('login')}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='login'?'#0F6E56':'transparent',color:tab==='login'?'#ffffff':'#666666'}}>
            Sign in
          </button>
          <button onClick={()=>setTab('register')}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='register'?'#0F6E56':'transparent',color:tab==='register'?'#ffffff':'#666666'}}>
            Create account
          </button>
        </div>

        {error && (
          <div style={{background:'#FEE2E2',border:'1px solid #FCA5A5',borderRadius:'8px',padding:'10px 12px',marginBottom:'1rem',fontSize:'13px',color:'#DC2626'}}>
            {error}
          </div>
        )}

        {tab === 'login' && (
          <div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Email address</label>
              <input type="email" placeholder="you@company.co.za" value={email} onChange={e=>setEmail(e.target.value)}
                style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Password</label>
              <input type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)}
                style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>
            <button onClick={handleLogin} disabled={loading}
              style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p style={{textAlign:'center',fontSize:'13px',color:'#666666',marginTop:'1rem'}}>
              No account?{' '}
              <button onClick={()=>setTab('register')} style={{color:'#0F6E56',background:'none',border:'none',cursor:'pointer',fontSize:'13px'}}>
                Create one free
              </button>
            </p>
          </div>
        )}

        {tab === 'register' && (
          <div>
            {success ? (
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'8px',padding:'1rem',textAlign:'center'}}>
                <p style={{color:'#085041',fontSize:'15px',fontWeight:'500',marginBottom:'.5rem'}}>Account created!</p>
                <p style={{color:'#0F6E56',fontSize:'13px'}}>Check your email to verify then sign in.</p>
                <button onClick={()=>setTab('login')} style={{marginTop:'1rem',padding:'8px 20px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'13px',cursor:'pointer'}}>
                  Go to Sign in
                </button>
              </div>
            ) : (
              <div>
                <p style={{fontSize:'13px',color:'#666666',marginBottom:'1rem'}}>I am registering as a:</p>
                <div style={{display:'flex',gap:'8px',marginBottom:'1rem'}}>
                  <button onClick={()=>setRole('business')}
                    style={{flex:1,padding:'9px',border:role==='business'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='business'?'#E1F5EE':'transparent',color:role==='business'?'#085041':'#666666',fontWeight:'500'}}>
                    Business / SME
                  </button>
                  <button onClick={()=>setRole('funder')}
                    style={{flex:1,padding:'9px',border:role==='funder'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='funder'?'#E1F5EE':'transparent',color:role==='funder'?'#085041':'#666666',fontWeight:'500'}}>
                    Funder
                  </button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>First name</label>
                    <input type="text" placeholder="Sipho" value={firstName} onChange={e=>setFirstName(e.target.value)}
                      style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Last name</label>
                    <input type="text" placeholder="Dlamini" value={lastName} onChange={e=>setLastName(e.target.value)}
                      style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                  </div>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>
                    {role==='business' ? 'Business name' : 'Institution name'}
                  </label>
                  <input type="text" placeholder={role==='business' ? 'Dlamini Suppliers (Pty) Ltd' : 'Nkosi Capital (Pty) Ltd'}
                    value={businessName} onChange={e=>setBusinessName(e.target.value)}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Email address</label>
                  <input type="email" placeholder="you@company.co.za" value={email} onChange={e=>setEmail(e.target.value)}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Phone number</label>
                  <input type="tel" placeholder="+27 82 000 0000" value={phone} onChange={e=>setPhone(e.target.value)}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>
                    {role==='business' ? 'Company registration number' : 'FSCA registration number'}
                  </label>
                  <input type="text" placeholder={role==='business' ? '2021/123456/07' : 'FSP 12345'}
                    value={companyReg} onChange={e=>setCompanyReg(e.target.value)}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'13px',color:'#666666',marginBottom:'5px'}}>Password</label>
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                </div>
                {role==='funder' && (
                  <p style={{fontSize:'12px',color:'#888888',marginBottom:'1rem',lineHeight:'1.5'}}>
                    Funder accounts are manually reviewed before activation. You will be notified within 48 hours.
                  </p>
                )}
                <button onClick={handleRegister} disabled={loading}
                  style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}