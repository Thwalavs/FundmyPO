'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [tab, setTab] = useState<'register' | 'login'>('register')
  const [role, setRole] = useState<'business' | 'funder'>('business')
  const [success, setSuccess] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>

      {/* LOGO */}
      <a href="/" style={{fontSize:'22px',fontWeight:'500',marginBottom:'1.5rem',textDecoration:'none',color:'#1a1a1a'}}>
        Fund<span style={{color:'#0F6E56'}}>MyPO</span>
      </a>

      {/* CARD */}
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'420px'}}>

        {/* TABS */}
        <div style={{display:'flex',border:'1px solid #e5e5e5',borderRadius:'8px',overflow:'hidden',marginBottom:'1.5rem'}}>
          <button
            onClick={()=>setTab('register')}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='register'?'#0F6E56':'transparent',color:tab==='register'?'#fff':'#666'}}>
            Create account
          </button>
          <button
            onClick={()=>setTab('login')}
            style={{flex:1,padding:'9px',fontSize:'14px',fontWeight:'500',border:'none',cursor:'pointer',background:tab==='login'?'#0F6E56':'transparent',color:tab==='login'?'#fff':'#666'}}>
            Sign in
          </button>
        </div>

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <div>
            <p style={{fontSize:'13px',color:'#666',marginBottom:'1rem'}}>I am registering as a:</p>

            {/* ROLE SELECTOR */}
            <div style={{display:'flex',gap:'8px',marginBottom:'1rem'}}>
              <button
                onClick={()=>setRole('business')}
                style={{flex:1,padding:'9px',border:role==='business'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='business'?'#E1F5EE':'transparent',color:role==='business'?'#085041':'#666',fontWeight:'500'}}>
                Business / SME
              </button>
              <button
                onClick={()=>setRole('funder')}
                style={{flex:1,padding:'9px',border:role==='funder'?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:role==='funder'?'#E1F5EE':'transparent',color:role==='funder'?'#085041':'#666',fontWeight:'500'}}>
                Funder
              </button>
            </div>

            {/* FIELDS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>First name</label>
                <input type="text" placeholder="Sipho" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Last name</label>
                <input type="text" placeholder="Dlamini" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>{role==='business'?'Business name':'Institution name'}</label>
              <input type="text" placeholder={role==='business'?'Dlamini Suppliers (Pty) Ltd':'Nkosi Capital (Pty) Ltd'} style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Email address</label>
              <input type="email" placeholder="you@company.co.za" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Phone number</label>
              <input type="tel" placeholder="+27 82 000 0000" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>{role==='business'?'Company registration number':'FSCA registration number'}</label>
              <input type="text" placeholder={role==='business'?'2021/123456/07':'FSP 12345'} style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Password</label>
              <input type="password" placeholder="Min. 8 characters" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            {role==='funder' && (
              <p style={{fontSize:'12px',color:'#888',marginBottom:'1rem',lineHeight:'1.5'}}>
                Funder accounts are manually reviewed before activation. You will be notified within 48 hours.
              </p>
            )}

            {success && (
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'8px',padding:'1rem',textAlign:'center',marginBottom:'1rem'}}>
                <p style={{color:'#085041',fontSize:'14px',fontWeight:'500'}}>Account created successfully!</p>
                <p style={{color:'#0F6E56',fontSize:'13px'}}>Check your email to verify your address.</p>
              </div>
            )}

            <button
              onClick={()=>setSuccess(true)}
              style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              Create account
            </button>

            <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'1rem 0',fontSize:'12px',color:'#888'}}>
              <div style={{flex:1,height:'1px',background:'#e5e5e5'}}></div>
              or
              <div style={{flex:1,height:'1px',background:'#e5e5e5'}}></div>
            </div>

            <button style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer',color:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <span>G</span> Continue with Google
            </button>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Email address</label>
              <input type="email" placeholder="you@company.co.za" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'.5rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Password</label>
              <input type="password" placeholder="Your password" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{textAlign:'right',marginBottom:'1rem'}}>
              <a href="#" style={{fontSize:'13px',color:'#0F6E56'}}>Forgot password?</a>
            </div>

            {loginSuccess && (
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'8px',padding:'1rem',textAlign:'center',marginBottom:'1rem'}}>
                <p style={{color:'#085041',fontSize:'14px',fontWeight:'500'}}>Signed in successfully!</p>
                <p style={{color:'#0F6E56',fontSize:'13px'}}>Redirecting to your dashboard...</p>
              </div>
            )}

            <button
              onClick={()=>setLoginSuccess(true)}
              style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              Sign in
            </button>

            <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'1rem 0',fontSize:'12px',color:'#888'}}>
              <div style={{flex:1,height:'1px',background:'#e5e5e5'}}></div>
              or
              <div style={{flex:1,height:'1px',background:'#e5e5e5'}}></div>
            </div>

            <button style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer',color:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <span>G</span> Continue with Google
            </button>

            <p style={{textAlign:'center',fontSize:'13px',color:'#666',marginTop:'1rem'}}>
              Don't have an account?{' '}
              <button onClick={()=>setTab('register')} style={{color:'#0F6E56',background:'none',border:'none',cursor:'pointer',fontSize:'13px'}}>
                Create one free
              </button>
            </p>
          </div>
        )}

      </div>
    </main>
  )
}