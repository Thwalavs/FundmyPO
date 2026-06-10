'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('business')
  const [portalRole, setPortalRole] = useState('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [companyDoc, setCompanyDoc] = useState<File|null>(null)
  const [idDoc, setIdDoc] = useState<File|null>(null)
  const [csdDoc, setCsdDoc] = useState<File|null>(null)
  const [taxDoc, setTaxDoc] = useState<File|null>(null)
  const [bbbeeDoc, setBbbeeDoc] = useState<File|null>(null)
  const [fscaDoc, setFscaDoc] = useState<File|null>(null)
  const [proofFunds, setProofFunds] = useState<File|null>(null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    if (roleParam === 'funder') {
      setPortalRole('funder')
      setRole('funder')
    }
  }, [])

  async function getSupabase() {
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(
      'https://efzszombcfxyyobqehyp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
    )
  }

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
  ]
  const passwordValid = passwordChecks.every(c => c.met)

  async function handleForgotPassword() {
    if (!email) { setError('Please enter your email address first.'); return }
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://fundmypo.co.za/reset-password'
      })
      setLoading(false)
      if (error) { setError(error.message); return }
      alert('Password reset email sent! Check your inbox.')
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  async function handleLogin(currentPortalRole: string) {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      const userRole = data.user?.user_metadata?.role

      if (userRole === 'admin') {
        router.push('/admin')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', data.user.id)
        .single()

      if (profile?.status === 'pending') {
        await supabase.auth.signOut()
        setError('Your account is pending approval. You will be notified by email once our team has reviewed your documents.')
        setLoading(false)
        return
      }

      if (profile?.status === 'declined') {
        await supabase.auth.signOut()
        setError('Your account application was declined. Please contact us at info@fundmypo.co.za for more information.')
        setLoading(false)
        return
      }

      if (currentPortalRole === 'funder' && userRole !== 'funder') {
        await supabase.auth.signOut()
        setError('This portal is for funders only. Please use the supplier login instead.')
        setLoading(false)
        return
      }
      if (currentPortalRole === 'business' && userRole === 'funder') {
        await supabase.auth.signOut()
        setError('This portal is for suppliers only. Please use the funder login instead.')
        setLoading(false)
        return
      }

      if (userRole === 'funder') { router.push('/funder') }
      else { router.push('/dashboard') }
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  async function uploadFile(supabase: any, file: File, userId: string, docName: string) {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${docName}.${ext}`
    const { error } = await supabase.storage.from('verification-docs').upload(path, file, { upsert: true })
    if (error) console.error('Upload error:', docName, error.message)
    return path
  }

  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { role, first_name: firstName, last_name: lastName, business_name: businessName, phone, company_reg: companyReg } }
      })
      if (error) { setError(error.message); setLoading(false); return }

      const userId = data.user?.id
      if (userId) {
        await supabase.from('profiles').insert({
          id: userId, email, role,
          first_name: firstName, last_name: lastName,
          business_name: businessName, phone,
          company_reg: companyReg, status: 'pending',
        })

        if (role === 'business') {
          if (companyDoc) { setUploadProgress('Uploading company certificate...'); await uploadFile(supabase, companyDoc, userId, 'company-certificate') }
          if (idDoc) { setUploadProgress('Uploading ID document...'); await uploadFile(supabase, idDoc, userId, 'id-document') }
          if (csdDoc) { setUploadProgress('Uploading CSD report...'); await uploadFile(supabase, csdDoc, userId, 'csd-report') }
          if (taxDoc) { setUploadProgress('Uploading tax clearance...'); await uploadFile(supabase, taxDoc, userId, 'tax-clearance') }
          if (bbbeeDoc) { setUploadProgress('Uploading BBB-EE certificate...'); await uploadFile(supabase, bbbeeDoc, userId, 'bbbee-certificate') }
        } else {
          if (fscaDoc) { setUploadProgress('Uploading FSCA license...'); await uploadFile(supabase, fscaDoc, userId, 'fsca-license') }
          if (idDoc) { setUploadProgress('Uploading ID document...'); await uploadFile(supabase, idDoc, userId, 'id-document') }
          if (proofFunds) { setUploadProgress('Uploading proof of funds...'); await uploadFile(supabase, proofFunds, userId, 'proof-of-funds') }
        }
      }

      // Welcome email to user
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            to: email,
            data: { name: firstName || businessName, businessName, role }
          })
        })
      } catch(e) { console.log('Welcome email failed:', e) }

      // Pending approval email to user
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'registration_pending',
            to: email,
            data: { name: firstName || businessName, businessName, role }
          })
        })
      } catch(e) { console.log('Pending email failed:', e) }

      // Notify admin of new registration
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_registration',
            to: 'admin@fundmypo.co.za',
            data: { name: `${firstName} ${lastName}`, businessName, email, role }
          })
        })
      } catch(e) { console.log('Admin notification failed:', e) }

      setUploadProgress('')
      setSuccess(true)
      setLoading(false)
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  if (!mounted) return null

  const inputStyle = {width:'100%',padding:'10px 14px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff'}
  const inputFilled = (val: string) => ({...inputStyle, borderColor: val ? '#0F6E56' : '#e5e5e5'})
  const labelStyle = {display:'block' as const,fontSize:'13px',color:'#555',marginBottom:'6px',fontWeight:'500'}
  const fieldStyle = {marginBottom:'1rem'}

  function UploadBox({ label, file, onChange, required }: { label: string, file: File|null, onChange: (f: File|null) => void, required?: boolean }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>
          {label}{' '}
          {required && <span style={{color:'#DC2626'}}>*</span>}
          {!required && <span style={{fontSize:'11px',color:'#888'}}> (optional)</span>}
        </label>
        <div style={{border:'2px dashed '+(file?'#0F6E56':'#e5e5e5'),borderRadius:'8px',padding:'1rem',textAlign:'center',background:file?'#f0faf6':'#fafafa',position:'relative',cursor:'pointer'}}>
          {file ? (
            <div>
              <p style={{fontSize:'13px',color:'#0F6E56',fontWeight:'500'}}>{file.name}</p>
              <p style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Click to change</p>
            </div>
          ) : (
            <div>
              <p style={{fontSize:'13px',color:'#666',marginBottom:'.25rem'}}>Click to upload {label}</p>
              <p style={{fontSize:'12px',color:'#aaa'}}>PDF, JPG or PNG — max 5MB</p>
            </div>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>onChange(e.target.files?.[0]||null)}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0,cursor:'pointer'}}/>
        </div>
      </div>
    )
  }

  const isFunder = portalRole === 'funder'

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',height:'65px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'48px',width:'auto'}}/>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'13px',background:isFunder?'rgba(77,191,176,0.2)':'rgba(255,255,255,0.1)',color:isFunder?'#4DBFB0':'#fff',padding:'4px 12px',borderRadius:'99px',fontWeight:'500'}}>
            {isFunder ? 'Funder Portal' : 'Supplier Portal'}
          </span>
          <a href="/" style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',textDecoration:'none'}}>Back to home</a>
        </div>
      </nav>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',minHeight:'calc(100vh - 65px)'}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'480px',boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>

          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <h1 style={{fontSize:'22px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>
              {tab === 'login' ? (isFunder ? 'Funder Sign In' : 'Supplier Sign In') : (isFunder ? 'Create Funder Account' : 'Create Supplier Account')}
            </h1>
            <p style={{fontSize:'13px',color:'#888'}}>
              {tab === 'login' ? 'Welcome back to FundMyPO' : "Join South Africa's leading PO funding platform"}
            </p>
          </div>

          <div style={{display:'flex',border:'1px solid #e5e5e5',borderRadius:'10px',overflow:'hidden',marginBottom:'1.5rem'}}>
            <button onClick={()=>{setTab('login');setStep(1);setError('')}}
              style={{flex:1,padding:'10px',fontSize:'14px',fontWeight:'600',border:'none',cursor:'pointer',background:tab==='login'?'#0F6E56':'transparent',color:tab==='login'?'#fff':'#666'}}>
              Sign in
            </button>
            <button onClick={()=>{setTab('register');setStep(1);setError('')}}
              style={{flex:1,padding:'10px',fontSize:'14px',fontWeight:'600',border:'none',cursor:'pointer',background:tab==='register'?'#0F6E56':'transparent',color:tab==='register'?'#fff':'#666'}}>
              Create account
            </button>
          </div>

          {error && (
            <div style={{background:'#FEE2E2',border:'1px solid #FCA5A5',borderRadius:'8px',padding:'10px 14px',marginBottom:'1rem',fontSize:'13px',color:'#DC2626'}}>
              {error}
            </div>
          )}

          {tab === 'login' && (
            <div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email address</label>
                <input type="email" placeholder="you@company.co.za" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password</label>
                <input type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
              </div>
              <div style={{textAlign:'right',marginBottom:'1.25rem'}}>
                <button onClick={handleForgotPassword} disabled={loading}
                  style={{fontSize:'13px',color:'#0F6E56',background:'none',border:'none',cursor:'pointer',padding:0,fontWeight:'500'}}>
                  Forgot password?
                </button>
              </div>
              <button onClick={()=>handleLogin(portalRole)} disabled={loading}
                style={{width:'100%',padding:'12px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p style={{textAlign:'center',fontSize:'13px',color:'#666',marginTop:'1.25rem'}}>
                No account?{' '}
                <button onClick={()=>setTab('register')} style={{color:'#0F6E56',background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>
                  Create one free
                </button>
              </p>
              <p style={{textAlign:'center',fontSize:'12px',color:'#888',marginTop:'.5rem'}}>
                {isFunder ? (
                  <>Wrong portal? <a href="/register" style={{color:'#0F6E56',fontWeight:'500'}}>Go to supplier login</a></>
                ) : (
                  <>Are you a funder? <a href="/register?role=funder" style={{color:'#0F6E56',fontWeight:'500'}}>Go to funder login</a></>
                )}
              </p>
            </div>
          )}

          {tab === 'register' && (
            <div>
              {success ? (
                <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'2rem',textAlign:'center'}}>
                  <div style={{width:'56px',height:'56px',background:'#0F6E56',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
                    <span style={{color:'#fff',fontSize:'24px',fontWeight:'700'}}>✓</span>
                  </div>
                  <p style={{color:'#085041',fontSize:'16px',fontWeight:'600',marginBottom:'.5rem'}}>Application submitted!</p>
                  <p style={{color:'#0F6E56',fontSize:'13px',marginBottom:'1.5rem',lineHeight:'1.6'}}>
                    Your account is <strong>pending approval</strong>. Our team will review your documents within 24-48 hours and notify you by email once approved.
                  </p>
                  <button onClick={()=>{ setTab('login'); setSuccess(false) }}
                    style={{padding:'10px 24px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                    Back to Sign in
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{display:'flex',alignItems:'center',marginBottom:'1.5rem'}}>
                    {['Account details','Verification docs'].map((s,i)=>{
                      const num = i + 1
                      const active = step === num
                      const done = step > num
                      return (
                        <div key={s} style={{display:'flex',alignItems:'center',flex:1}}>
                          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                            <div style={{width:'30px',height:'30px',borderRadius:'50%',background:done?'#0F6E56':active?'#0F6E56':'#e5e5e5',color:done||active?'#fff':'#888',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'600'}}>
                              {done ? '\u2713' : num}
                            </div>
                            <span style={{fontSize:'11px',color:active?'#0F6E56':'#888',whiteSpace:'nowrap',fontWeight:active?'600':'400'}}>{s}</span>
                          </div>
                          {i < 1 && <div style={{flex:1,height:'2px',background:done?'#0F6E56':'#e5e5e5',margin:'0 6px',marginBottom:'18px'}}></div>}
                        </div>
                      )
                    })}
                  </div>

                  {step === 1 && (
                    <div>
                      <p style={{fontSize:'13px',color:'#666',marginBottom:'1rem',fontWeight:'500'}}>I am registering as a:</p>
                      <div style={{display:'flex',gap:'8px',marginBottom:'1.25rem'}}>
                        <button onClick={()=>setRole('business')}
                          style={{flex:1,padding:'10px',border:role==='business'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='business'?'#E1F5EE':'#fff',color:role==='business'?'#085041':'#666',fontWeight:'600'}}>
                          Supplier / SME
                        </button>
                        <button onClick={()=>setRole('funder')}
                          style={{flex:1,padding:'10px',border:role==='funder'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='funder'?'#E1F5EE':'#fff',color:role==='funder'?'#085041':'#666',fontWeight:'600'}}>
                          Funder
                        </button>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                        <div>
                          <label style={labelStyle}>First name <span style={{color:'#DC2626'}}>*</span></label>
                          <input type="text" placeholder="Sipho" value={firstName} onChange={e=>setFirstName(e.target.value)} style={inputFilled(firstName)}/>
                        </div>
                        <div>
                          <label style={labelStyle}>Last name <span style={{color:'#DC2626'}}>*</span></label>
                          <input type="text" placeholder="Dlamini" value={lastName} onChange={e=>setLastName(e.target.value)} style={inputFilled(lastName)}/>
                        </div>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>{role==='business'?'Business name':'Institution name'} <span style={{color:'#DC2626'}}>*</span></label>
                        <input type="text" placeholder={role==='business'?'Dlamini Suppliers (Pty) Ltd':'Nkosi Capital (Pty) Ltd'}
                          value={businessName} onChange={e=>setBusinessName(e.target.value)} style={inputFilled(businessName)}/>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Email address <span style={{color:'#DC2626'}}>*</span></label>
                        <input type="email" placeholder="you@company.co.za" value={email} onChange={e=>setEmail(e.target.value)} style={inputFilled(email)}/>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Phone number <span style={{color:'#DC2626'}}>*</span></label>
                        <input type="tel" placeholder="+27 82 000 0000" value={phone} onChange={e=>setPhone(e.target.value)} style={inputFilled(phone)}/>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>
                          {role==='business'?'Company registration number':'FSCA registration number'}
                          {role==='business'&&<span style={{color:'#DC2626'}}> *</span>}
                          {role==='funder'&&<span style={{fontSize:'11px',color:'#888'}}> (optional)</span>}
                        </label>
                        <input type="text" placeholder={role==='business'?'2021/123456/07':'FSP 12345 (if applicable)'}
                          value={companyReg} onChange={e=>setCompanyReg(e.target.value)}
                          style={{...inputStyle, borderColor: companyReg ? '#0F6E56' : '#e5e5e5'}}/>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Password <span style={{color:'#DC2626'}}>*</span></label>
                        <div style={{position:'relative'}}>
                          <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)}
                            style={{...inputStyle, borderColor: password.length === 0 ? '#e5e5e5' : passwordValid ? '#0F6E56' : '#DC2626'}}/>
                          <button type="button" onClick={()=>setShowPassword(s=>!s)} style={{position:'absolute',right:8,top:8,border:'none',background:'none',cursor:'pointer',color:'#0F6E56',fontSize:'13px',padding:4}}>
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Confirm password <span style={{color:'#DC2626'}}>*</span></label>
                        <div style={{position:'relative'}}>
                          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-type your password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                            style={{...inputStyle, borderColor: confirmPassword.length === 0 ? '#e5e5e5' : (confirmPassword === password ? '#0F6E56' : '#DC2626')}}/>
                          <button type="button" onClick={()=>setShowConfirmPassword(s=>!s)} style={{position:'absolute',right:8,top:8,border:'none',background:'none',cursor:'pointer',color:'#0F6E56',fontSize:'13px',padding:4}}>
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        {confirmPassword.length > 0 && confirmPassword !== password && (
                          <p style={{color:'#DC2626',fontSize:'12px',marginTop:'6px'}}>Passwords do not match.</p>
                        )}
                        {password.length > 0 && (
                          <div style={{marginTop:'8px',padding:'10px',background:'#f9f9f9',borderRadius:'8px',border:'1px solid #e5e5e5'}}>
                            <p style={{fontSize:'12px',fontWeight:'600',color:'#444',marginBottom:'6px'}}>Password requirements:</p>
                            {passwordChecks.map(({label,met})=>(
                              <div key={label} style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                                <span style={{fontSize:'12px',fontWeight:'600',color:met?'#0F6E56':'#DC2626'}}>{met ? 'OK' : 'X'}</span>
                                <span style={{fontSize:'12px',color:met?'#0F6E56':'#DC2626'}}>{label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{background:'#f5f5f5',borderRadius:'8px',padding:'10px',marginBottom:'1rem',fontSize:'12px',color:'#666'}}>
                        <span style={{color:'#DC2626'}}>*</span> Required fields
                      </div>
                      <button onClick={()=>{
                        if (!firstName || !lastName || !businessName || !email || !phone || !password || !confirmPassword) { setError('Please fill in all required fields.'); return }
                        if (role === 'business' && !companyReg) { setError('Please enter your company registration number.'); return }
                        if (!passwordValid) { setError('Password does not meet all requirements.'); return }
                        if (confirmPassword !== password) { setError('Passwords do not match. Please confirm your password.'); return }
                        if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
                        setError(''); setStep(2)
                      }} style={{width:'100%',padding:'12px',background:passwordValid&&firstName&&lastName&&businessName&&email&&phone&&confirmPassword&&confirmPassword===password?'#0F6E56':'#9CA3AF',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                        Continue to verification
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.25rem'}}>
                        <p style={{fontSize:'13px',color:'#085041',fontWeight:'600',marginBottom:'2px'}}>Your documents are secure</p>
                        <p style={{fontSize:'12px',color:'#0F6E56'}}>All documents are encrypted and only shared with verified parties.</p>
                      </div>
                      {role === 'business' && (
                        <div style={{background:'#f5f5f5',borderRadius:'8px',padding:'10px',marginBottom:'1rem',fontSize:'12px',color:'#666'}}>
                          <span style={{color:'#DC2626'}}>*</span> All 5 documents required for suppliers
                        </div>
                      )}
                      {role === 'funder' && (
                        <div style={{background:'#E6F1FB',borderRadius:'8px',padding:'10px',marginBottom:'1rem',fontSize:'12px',color:'#0C447C'}}>
                          All documents are optional for funders. Upload what you have available.
                        </div>
                      )}
                      {role === 'business' ? (
                        <div>
                          <UploadBox label="Company Registration Certificate" file={companyDoc} onChange={setCompanyDoc} required/>
                          <UploadBox label="ID Copy of Director" file={idDoc} onChange={setIdDoc} required/>
                          <UploadBox label="CSD Full Registration Report" file={csdDoc} onChange={setCsdDoc} required/>
                          <UploadBox label="Tax Clearance Certificate" file={taxDoc} onChange={setTaxDoc} required/>
                          <UploadBox label="BBB-EE Certificate or Sworn Affidavit" file={bbbeeDoc} onChange={setBbbeeDoc} required/>
                        </div>
                      ) : (
                        <div>
                          <UploadBox label="FSCA License" file={fscaDoc} onChange={setFscaDoc}/>
                          <UploadBox label="ID Copy of Director" file={idDoc} onChange={setIdDoc}/>
                          <UploadBox label="Proof of Funds" file={proofFunds} onChange={setProofFunds}/>
                        </div>
                      )}
                      {uploadProgress && (
                        <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'10px',marginBottom:'1rem',fontSize:'13px',color:'#085041',textAlign:'center'}}>
                          {uploadProgress}
                        </div>
                      )}
                      <div style={{background:'#FAEEDA',borderRadius:'8px',padding:'1rem',marginBottom:'1rem'}}>
                        <p style={{fontSize:'13px',color:'#633806',fontWeight:'600',marginBottom:'2px'}}>Review process</p>
                        <p style={{fontSize:'12px',color:'#633806'}}>Your account will be reviewed within 24-48 hours. You will receive an email once approved.</p>
                      </div>
                      <div style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'1rem',padding:'12px',background:'#f9f9f9',borderRadius:'8px',border:`1px solid ${agreedToTerms?'#0F6E56':'#e5e5e5'}`}}>
                        <input type="checkbox" checked={agreedToTerms} onChange={e=>setAgreedToTerms(e.target.checked)}
                          style={{marginTop:'2px',width:'16px',height:'16px',cursor:'pointer',accentColor:'#0F6E56'}}/>
                        <p style={{fontSize:'12px',color:'#666',margin:0,lineHeight:'1.6'}}>
                          I agree to the{' '}
                          <a href="/terms" target="_blank" style={{color:'#0F6E56',fontWeight:'600'}}>Terms & Conditions</a>
                          {' '}and{' '}
                          <a href="/privacy" target="_blank" style={{color:'#0F6E56',fontWeight:'600'}}>Privacy Policy</a>
                          . I confirm all documents submitted are authentic and accurate.
                        </p>
                      </div>
                      <div style={{display:'flex',gap:'10px'}}>
                        <button onClick={()=>{ setError(''); setStep(1) }}
                          style={{flex:1,padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                          Back
                        </button>
                        <button onClick={()=>{
                          if (role === 'business' && (!companyDoc || !idDoc || !csdDoc || !taxDoc || !bbbeeDoc)) {
                            setError('Please upload all 5 required documents.')
                            return
                          }
                          if (!agreedToTerms) { setError('Please agree to the Terms & Conditions.'); return }
                          setError('')
                          handleRegister()
                        }} disabled={loading}
                          style={{flex:2,padding:'12px',background:agreedToTerms?'#0F6E56':'#9CA3AF',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                          {loading ? 'Creating account...' : 'Submit & Create account'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}