'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState(1)
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
  const [companyDoc, setCompanyDoc] = useState('')
  const [idDoc, setIdDoc] = useState('')
  const [csdDoc, setCsdDoc] = useState('')
  const [taxDoc, setTaxDoc] = useState('')
  const [bbbeeDoc, setBbbeeDoc] = useState('')
  const [fsca, setFsca] = useState('')
  const [proofFunds, setProofFunds] = useState('')

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
      const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: 'Demo1234!' })
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
            role, first_name: firstName, last_name: lastName,
            business_name: businessName, phone, company_reg: companyReg,
          }
        }
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess(true)
      setLoading(false)
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  if (!mounted) return null

  const inputStyle = {width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}
  const labelStyle = {display:'block' as const,fontSize:'13px',color:'#666666',marginBottom:'5px'}
  const fieldStyle = {marginBottom:'1rem'}

  function UploadBox({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label}</label>
        <div
          onClick={()=>onChange(value ? '' : label)}
          style={{border:'2px dashed '+(value?'#0F6E56':'#e5e5e5'),borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',background:value?'#f0faf6':'#fafafa'}}>
          {value ? (
            <div>
              <p style={{fontSize:'13px',color:'#0F6E56',fontWeight:'500'}}>✓ {label} uploaded</p>
              <p style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Click to remove</p>
            </div>
          ) : (
            <div>
              <p style={{fontSize:'13px',color:'#666'}}>📎 Click to upload {label}</p>
              <p style={{fontSize:'12px',color:'#aaa',marginTop:'2px'}}>PDF, JPG or PNG — max 5MB</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>

      <a href="/" style={{fontSize:'22px',fontWeight:'500',marginBottom:'1.5rem',textDecoration:'none',color:'#1a1a1a'}}>
        Fund<span style={{color:'#0F6E56'}}>MyPO</span>
      </a>

      <div style={{background:'#085041',borderRadius:'12px',padding:'1.25rem',width:'100%',maxWidth:'460px',marginBottom:'1rem'}}>
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

      <div style={{background:'#ffffff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'460px'}}>

        <div style={{display:'flex',border:'1px solid #e5e5e5',borderRadius:'8px',overflow:'hidden',marginBottom:'1.5rem'}}>
          <button onClick={()=>{setTab('login');setStep(1)}}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='login'?'#0F6E56':'transparent',color:tab==='login'?'#ffffff':'#666666'}}>
            Sign in
          </button>
          <button onClick={()=>{setTab('register');setStep(1)}}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='register'?'#0F6E56':'transparent',color:tab==='register'?'#ffffff':'#666666'}}>
            Create account
          </button>
        </div>

        {error && (
          <div style={{background:'#FEE2E2',border:'1px solid #FCA5A5',borderRadius:'8px',padding:'10px 12px',marginBottom:'1rem',fontSize:'13px',color:'#DC2626'}}>
            {error}
          </div>
        )}

        {/* LOGIN */}
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
            <div style={{textAlign:'right',marginBottom:'1rem'}}>
              <a href="#" style={{fontSize:'13px',color:'#0F6E56'}}>Forgot password?</a>
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

        {/* REGISTER */}
        {tab === 'register' && (
          <div>
            {success ? (
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'8px',padding:'1.5rem',textAlign:'center'}}>
                <div style={{fontSize:'32px',marginBottom:'.5rem'}}>🎉</div>
                <p style={{color:'#085041',fontSize:'15px',fontWeight:'500',marginBottom:'.5rem'}}>Account created successfully!</p>
                <p style={{color:'#0F6E56',fontSize:'13px',marginBottom:'1rem'}}>Your documents are under review. You will be notified within 24-48 hours.</p>
                <button onClick={()=>setTab('login')} style={{padding:'8px 20px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'13px',cursor:'pointer'}}>
                  Go to Sign in
                </button>
              </div>
            ) : (
              <div>

                {/* STEP INDICATOR */}
                <div style={{display:'flex',alignItems:'center',marginBottom:'1.5rem'}}>
                  {['Account details','Verification docs'].map((s,i)=>{
                    const num = i + 1
                    const active = step === num
                    const done = step > num
                    return (
                      <div key={s} style={{display:'flex',alignItems:'center',flex:1}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                          <div style={{width:'28px',height:'28px',borderRadius:'50%',background:done||active?'#0F6E56':'#e5e5e5',color:done||active?'#fff':'#888',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'500'}}>
                            {done ? '✓' : num}
                          </div>
                          <span style={{fontSize:'11px',color:active?'#0F6E56':'#888',whiteSpace:'nowrap'}}>{s}</span>
                        </div>
                        {i < 1 && <div style={{flex:1,height:'1px',background:done?'#0F6E56':'#e5e5e5',margin:'0 4px',marginBottom:'14px'}}></div>}
                      </div>
                    )
                  })}
                </div>

                {/* STEP 1 - ACCOUNT DETAILS */}
                {step === 1 && (
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
                        <label style={labelStyle}>First name</label>
                        <input type="text" placeholder="Sipho" value={firstName} onChange={e=>setFirstName(e.target.value)} style={inputStyle}/>
                      </div>
                      <div>
                        <label style={labelStyle}>Last name</label>
                        <input type="text" placeholder="Dlamini" value={lastName} onChange={e=>setLastName(e.target.value)} style={inputStyle}/>
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{role==='business' ? 'Business name' : 'Institution name'}</label>
                      <input type="text" placeholder={role==='business' ? 'Dlamini Suppliers (Pty) Ltd' : 'Nkosi Capital (Pty) Ltd'}
                        value={businessName} onChange={e=>setBusinessName(e.target.value)} style={inputStyle}/>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Email address</label>
                      <input type="email" placeholder="you@company.co.za" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Phone number</label>
                      <input type="tel" placeholder="+27 82 000 0000" value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle}/>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{role==='business' ? 'Company registration number' : 'FSCA registration number'}</label>
                      <input type="text" placeholder={role==='business' ? '2021/123456/07' : 'FSP 12345'}
                        value={companyReg} onChange={e=>setCompanyReg(e.target.value)} style={inputStyle}/>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Password</label>
                      <input type="password" placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
                    </div>
                    <button onClick={()=>setStep(2)}
                      style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                      Continue to verification →
                    </button>
                  </div>
                )}

                {/* STEP 2 - VERIFICATION DOCS */}
                {step === 2 && (
                  <div>
                    <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
                      <p style={{fontSize:'13px',color:'#085041',fontWeight:'500',marginBottom:'3px'}}>🔒 Your documents are secure</p>
                      <p style={{fontSize:'12px',color:'#0F6E56'}}>All documents are encrypted and used only for verification purposes.</p>
                    </div>

                    {role === 'business' ? (
                      <div>
                        <UploadBox label="Company Registration Certificate" value={companyDoc} onChange={setCompanyDoc}/>
                        <UploadBox label="ID Copy of Director" value={idDoc} onChange={setIdDoc}/>
                        <UploadBox label="CSD Full Registration Report" value={csdDoc} onChange={setCsdDoc}/>
                        <UploadBox label="Tax Clearance Certificate" value={taxDoc} onChange={setTaxDoc}/>
                        <UploadBox label="BBB-EE Certificate or Sworn Affidavit" value={bbbeeDoc} onChange={setBbbeeDoc}/>
                      </div>
                    ) : (
                      <div>
                        <UploadBox label="FSCA License" value={fsca} onChange={setFsca}/>
                        <UploadBox label="ID Copy of Director" value={idDoc} onChange={setIdDoc}/>
                        <UploadBox label="Proof of Funds" value={proofFunds} onChange={setProofFunds}/>
                      </div>
                    )}

                    <div style={{background:'#FAEEDA',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
                      <p style={{fontSize:'13px',color:'#633806',fontWeight:'500',marginBottom:'3px'}}>⏱ Review process</p>
                      <p style={{fontSize:'12px',color:'#633806'}}>Your account will be reviewed within 24-48 hours after submission. You will receive an email once approved.</p>
                    </div>

                    <div style={{display:'flex',gap:'12px'}}>
                      <button onClick={()=>setStep(1)}
                        style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                        ← Back
                      </button>
                      <button onClick={handleRegister} disabled={loading}
                        style={{flex:2,padding:'11px',background:'#0F6E56',color:'#ffffff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
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
    </main>
  )
}