'use client'
import { useState } from 'react'

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',padding:'2rem'}}>

      {/* NAVBAR */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a'}}>
          Fund<span style={{color:'#0F6E56'}}>MyPO</span>
        </a>
        <a href="/register" style={{fontSize:'14px',color:'#0F6E56',textDecoration:'none',border:'1px solid #0F6E56',padding:'8px 16px',borderRadius:'8px'}}>
          My account
        </a>
      </nav>

      {/* PROGRESS STEPS */}
      <div style={{maxWidth:'640px',margin:'0 auto 2rem',display:'flex',alignItems:'center',gap:'0'}}>
        {['PO Details','Document Upload','Review & Submit'].map((label,i)=>{
          const num = i + 1
          const active = step === num
          const done = step > num
          return (
            <div key={label} style={{display:'flex',alignItems:'center',flex:1}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:done?'#0F6E56':active?'#0F6E56':'#e5e5e5',color:done||active?'#fff':'#888',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'500'}}>
                  {done ? '✓' : num}
                </div>
                <span style={{fontSize:'11px',color:active?'#0F6E56':'#888',fontWeight:active?'500':'400',whiteSpace:'nowrap'}}>{label}</span>
              </div>
              {i < 2 && <div style={{flex:1,height:'1px',background:done?'#0F6E56':'#e5e5e5',margin:'0 4px',marginBottom:'18px'}}></div>}
            </div>
          )
        })}
      </div>

      {/* CARD */}
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',maxWidth:'640px',margin:'0 auto'}}>

        {/* SUCCESS STATE */}
        {submitted && (
          <div style={{textAlign:'center',padding:'2rem 0'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'28px'}}>✓</div>
            <h2 style={{fontSize:'22px',fontWeight:'500',marginBottom:'.5rem',color:'#085041'}}>PO Submitted Successfully!</h2>
            <p style={{fontSize:'15px',color:'#666',marginBottom:'2rem',lineHeight:'1.7'}}>Your purchase order has been submitted to the marketplace. Funders will start reviewing it shortly and you will receive offers within 24–48 hours.</p>
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1rem',marginBottom:'2rem',textAlign:'left'}}>
              <p style={{fontSize:'13px',color:'#888',marginBottom:'.5rem'}}>What happens next:</p>
              {['Your PO is verified by our team','Registered funders review your PO','You receive competitive funding offers','You compare and choose the best offer'].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'8px',padding:'6px 0',fontSize:'14px',color:'#444'}}>
                  <span style={{color:'#0F6E56',fontWeight:'500'}}>✓</span>{item}
                </div>
              ))}
            </div>
            <a href="/" style={{background:'#0F6E56',color:'#fff',padding:'12px 28px',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'500'}}>
              Back to home
            </a>
          </div>
        )}

        {/* STEP 1 — PO DETAILS */}
        {!submitted && step === 1 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.5rem'}}>Purchase Order Details</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Fill in the details of your purchase order below.</p>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>PO Number</label>
              <input type="text" placeholder="e.g. PO-2025-00123" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Client / Buyer name</label>
              <input type="text" placeholder="e.g. Eskom Holdings SOC Ltd" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>PO Value (ZAR)</label>
                <input type="number" placeholder="e.g. 500000" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Funding needed (ZAR)</label>
                <input type="number" placeholder="e.g. 400000" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>PO Issue date</label>
                <input type="date" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>PO Expiry date</label>
                <input type="date" style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
              </div>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Industry / Sector</label>
              <select style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff'}}>
                <option value="">Select sector...</option>
                <option>Construction</option>
                <option>Mining</option>
                <option>Government / Public sector</option>
                <option>Retail</option>
                <option>Manufacturing</option>
                <option>Transport & Logistics</option>
                <option>Healthcare</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Brief description of goods / services</label>
              <textarea placeholder="e.g. Supply of electrical equipment to Eskom substation in Gauteng..." style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none',minHeight:'80px',resize:'vertical'}}/>
            </div>

            <button
              onClick={()=>setStep(2)}
              style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              Continue to document upload →
            </button>
          </div>
        )}

        {/* STEP 2 — DOCUMENT UPLOAD */}
        {!submitted && step === 2 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.5rem'}}>Upload PO Document</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Upload a copy of your purchase order. Accepted formats: PDF, JPG, PNG (max 10MB).</p>

            <div
              onClick={()=>document.getElementById('fileInput')?.click()}
              style={{border:'2px dashed #0F6E56',borderRadius:'12px',padding:'2.5rem',textAlign:'center',cursor:'pointer',background:'#f9fffe',marginBottom:'1rem'}}>
              <div style={{fontSize:'32px',marginBottom:'.75rem'}}>📄</div>
              {fileName ? (
                <div>
                  <p style={{fontSize:'15px',fontWeight:'500',color:'#085041'}}>{fileName}</p>
                  <p style={{fontSize:'13px',color:'#0F6E56',marginTop:'4px'}}>File selected ✓</p>
                </div>
              ) : (
                <div>
                  <p style={{fontSize:'15px',fontWeight:'500',color:'#0F6E56'}}>Click to upload your PO document</p>
                  <p style={{fontSize:'13px',color:'#888',marginTop:'4px'}}>PDF, JPG or PNG — max 10MB</p>
                </div>
              )}
              <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} style={{display:'none'}}/>
            </div>

            <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',color:'#085041',fontWeight:'500',marginBottom:'.25rem'}}>🔒 Your documents are secure</p>
              <p style={{fontSize:'13px',color:'#0F6E56'}}>All uploaded documents are encrypted and only shared with verified funders on our platform.</p>
            </div>

            <div style={{display:'flex',gap:'12px'}}>
              <button
                onClick={()=>setStep(1)}
                style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                ← Back
              </button>
              <button
                onClick={()=>setStep(3)}
                style={{flex:2,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                Continue to review →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — REVIEW */}
        {!submitted && step === 3 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.5rem'}}>Review & Submit</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Please review your submission before sending it to the marketplace.</p>

            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'13px',fontWeight:'500',color:'#444',marginBottom:'.75rem'}}>PO Summary</p>
              {[
                ['PO Number','PO-2025-00123'],
                ['Client','Eskom Holdings SOC Ltd'],
                ['PO Value','R 500,000'],
                ['Funding needed','R 400,000'],
                ['Sector','Construction'],
                ['Document','purchase_order.pdf'],
              ].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>{label}</span>
                  <span style={{color:'#1a1a1a',fontWeight:'500'}}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',color:'#085041',lineHeight:'1.6'}}>
                By submitting, your PO will be listed on the FundMyPO marketplace where verified funders can review and submit funding offers.
              </p>
            </div>

            <div style={{display:'flex',gap:'12px'}}>
              <button
                onClick={()=>setStep(2)}
                style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                style={{flex:2,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                Submit to marketplace ✓
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}