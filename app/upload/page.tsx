'use client'
import { useState, useEffect } from 'react'

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [poFile, setPoFile] = useState<File|null>(null)
  const [quotationFile, setQuotationFile] = useState<File|null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientDepartment, setClientDepartment] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [poValue, setPoValue] = useState('')
  const [fundingNeeded, setFundingNeeded] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [sector, setSector] = useState('')
  const [description, setDescription] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [supplierPhone, setSupplierPhone] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [quotationValue, setQuotationValue] = useState('')
  const [quotationNumber, setQuotationNumber] = useState('')

  useEffect(()=>{ setMounted(true) },[])

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        'https://efzszombcfxyyobqehyp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Please log in first'); setLoading(false); return }
      const { data: po, error: poError } = await supabase.from('purchase_orders').insert({
        user_id: user.id, po_number: poNumber, client_name: clientName, client_contact: clientContact,
        client_phone: clientPhone, client_email: clientEmail, client_department: clientDepartment,
        po_value: parseFloat(poValue)||0, funding_needed: parseFloat(fundingNeeded)||0,
        quotation_value: parseFloat(quotationValue)||0, quotation_number: quotationNumber,
        supplier_name: supplierName, supplier_phone: supplierPhone, supplier_email: supplierEmail,
        sector, description, issue_date: issueDate, expiry_date: expiryDate, status: 'reviewing'
      }).select().single()
      if (poError) { setError('Error saving PO: ' + poError.message); setLoading(false); return }
      if (poFile && po) {
        const ext = poFile.name.split('.').pop()
        await supabase.storage.from('verification-docs').upload(`${user.id}/po-${po.id}.${ext}`, poFile, { upsert: true })
      }
      if (quotationFile && po) {
        const ext = quotationFile.name.split('.').pop()
        await supabase.storage.from('verification-docs').upload(`${user.id}/quotation-${po.id}.${ext}`, quotationFile, { upsert: true })
      }
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'new_po_submitted', to: 'vsiphoesihle@gmail.com', data: { businessName: clientName, poNumber, clientName, poValue: `R ${parseFloat(poValue||'0').toLocaleString()}` } })
        })
      } catch(e) { console.log('Email failed:', e) }
      setLoading(false)
      setSubmitted(true)
    } catch(e: any) { setError('Error: ' + e.message); setLoading(false) }
  }

  if (!mounted) return null

  const inputStyle = {width:'100%',padding:'10px 14px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff'}
  const inputReq = (val: string) => ({...inputStyle, borderColor: val ? '#0F6E56' : '#e5e5e5'})
  const labelStyle = {display:'block' as const,fontSize:'13px',color:'#555',marginBottom:'6px',fontWeight:'500'}
  const fieldStyle = {marginBottom:'1rem'}
  const po = parseFloat(poValue)||0
  const quote = parseFloat(quotationValue)||0
  const profit = po - quote
  const margin = po > 0 ? ((profit/po)*100).toFixed(1) : '0'

  function step1Valid() { return !!(clientName && clientContact && clientDepartment && clientPhone && clientEmail) }
  function step2Valid() { return !!(poNumber && poValue && fundingNeeded && sector && supplierName && supplierPhone && supplierEmail && quotationNumber && quotationValue) }

  function UploadBox({ label, file, onChange, hint }: { label: string, file: File|null, onChange: (f: File|null) => void, hint: string }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label} <span style={{color:'#DC2626'}}>*</span></label>
        <p style={{fontSize:'12px',color:'#888',marginBottom:'8px'}}>{hint}</p>
        <div style={{border:'2px dashed '+(file?'#0F6E56':'#e5e5e5'),borderRadius:'8px',padding:'1.25rem',textAlign:'center',background:file?'#f0faf6':'#fafafa',position:'relative',cursor:'pointer'}}>
          {file ? (
            <div>
              <p style={{fontSize:'13px',color:'#0F6E56',fontWeight:'600'}}>✓ {file.name}</p>
              <p style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Click to change file</p>
            </div>
          ) : (
            <div>
              <div style={{fontSize:'28px',marginBottom:'.5rem'}}>📄</div>
              <p style={{fontSize:'13px',color:'#666',fontWeight:'500'}}>Click to upload {label}</p>
              <p style={{fontSize:'12px',color:'#aaa',marginTop:'4px'}}>PDF, JPG or PNG — max 10MB</p>
            </div>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>onChange(e.target.files?.[0]||null)}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0,cursor:'pointer'}}/>
        </div>
      </div>
    )
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      {/* NAV */}
      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',height:'65px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'48px',width:'auto',background:'#fff',borderRadius:'6px',padding:'2px'}}/>
        </a>
        <a href="/dashboard" style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',textDecoration:'none',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',padding:'7px 14px',borderRadius:'8px',fontWeight:'500'}}>
          ← Back to dashboard
        </a>
      </nav>

      <div style={{maxWidth:'720px',margin:'0 auto',padding:'2rem'}}>

        {/* STEPPER */}
        <div style={{display:'flex',alignItems:'center',marginBottom:'2rem'}}>
          {['Client Info','PO & Supplier','Documents','Review'].map((label,i)=>{
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={label} style={{display:'flex',alignItems:'center',flex:1}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                  <div style={{width:'34px',height:'34px',borderRadius:'50%',background:done?'#0F6E56':active?'#0F6E56':'#e5e5e5',color:done||active?'#fff':'#888',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'700'}}>
                    {done ? '✓' : num}
                  </div>
                  <span style={{fontSize:'10px',color:active?'#0F6E56':'#888',fontWeight:active?'700':'400',whiteSpace:'nowrap'}}>{label}</span>
                </div>
                {i < 3 && <div style={{flex:1,height:'2px',background:done?'#0F6E56':'#e5e5e5',margin:'0 4px',marginBottom:'18px'}}></div>}
              </div>
            )
          })}
        </div>

        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',boxShadow:'0 4px 24px rgba(0,0,0,0.04)'}}>

          {error && (
            <div style={{background:'#FEE2E2',border:'1px solid #FCA5A5',borderRadius:'8px',padding:'10px 14px',marginBottom:'1rem',fontSize:'13px',color:'#DC2626'}}>
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}
          {submitted && (
            <div style={{textAlign:'center',padding:'2rem 0'}}>
              <div style={{width:'70px',height:'70px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem',fontSize:'32px'}}>✓</div>
              <h2 style={{fontSize:'24px',fontWeight:'700',marginBottom:'.75rem',color:'#085041'}}>Application Submitted!</h2>
              <p style={{fontSize:'15px',color:'#666',marginBottom:'2rem',lineHeight:'1.7',maxWidth:'480px',margin:'0 auto 2rem'}}>
                Your purchase order has been submitted to the marketplace. Funders will review and make offers shortly.
              </p>
              <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.5rem',marginBottom:'2rem',textAlign:'left',maxWidth:'400px',margin:'0 auto 2rem'}}>
                <p style={{fontSize:'13px',color:'#888',marginBottom:'.75rem',fontWeight:'600'}}>What happens next:</p>
                {['Funders review your PO and supplier quotation','Funders verify the PO with your client','Funders verify the quote with your supplier','You receive competitive funding offers','You compare and accept the best offer'].map((item,i)=>(
                  <div key={i} style={{display:'flex',gap:'8px',padding:'5px 0',fontSize:'13px',color:'#444'}}>
                    <span style={{color:'#0F6E56',fontWeight:'700'}}>{i+1}.</span>{item}
                  </div>
                ))}
              </div>
              <a href="/dashboard" style={{background:'#0F6E56',color:'#fff',padding:'12px 28px',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'600'}}>
                Check application status →
              </a>
            </div>
          )}

          {/* STEP 1 */}
          {!submitted && step === 1 && (
            <div>
              <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>Client Information</h2>
              <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Fill in the details of the client who issued the purchase order.</p>
              <div style={fieldStyle}>
                <label style={labelStyle}>Client / Company name <span style={{color:'#DC2626'}}>*</span></label>
                <input type="text" placeholder="e.g. Eskom Holdings SOC Ltd" value={clientName} onChange={e=>setClientName(e.target.value)} style={inputReq(clientName)}/>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Contact person name <span style={{color:'#DC2626'}}>*</span></label>
                <p style={{fontSize:'12px',color:'#888',marginBottom:'6px'}}>The person responsible for issuing the purchase order</p>
                <input type="text" placeholder="e.g. John Smith" value={clientContact} onChange={e=>setClientContact(e.target.value)} style={inputReq(clientContact)}/>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Department <span style={{color:'#DC2626'}}>*</span></label>
                <p style={{fontSize:'12px',color:'#888',marginBottom:'6px'}}>The department the PO came from</p>
                <input type="text" placeholder="e.g. Supply Chain / Procurement" value={clientDepartment} onChange={e=>setClientDepartment(e.target.value)} style={inputReq(clientDepartment)}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>Client phone <span style={{color:'#DC2626'}}>*</span></label>
                  <input type="tel" placeholder="+27 11 000 0000" value={clientPhone} onChange={e=>setClientPhone(e.target.value)} style={inputReq(clientPhone)}/>
                </div>
                <div>
                  <label style={labelStyle}>Client email <span style={{color:'#DC2626'}}>*</span></label>
                  <input type="email" placeholder="procurement@client.co.za" value={clientEmail} onChange={e=>setClientEmail(e.target.value)} style={inputReq(clientEmail)}/>
                </div>
              </div>
              <div style={{background:'#f5f5f5',borderRadius:'8px',padding:'10px',marginBottom:'1.25rem',fontSize:'12px',color:'#666'}}>
                <span style={{color:'#DC2626'}}>*</span> All fields are required
              </div>
              <button onClick={()=>{
                if (!step1Valid()) { setError('Please fill in all client information before continuing.'); window.scrollTo(0,0); return }
                setError(''); setStep(2)
              }} style={{width:'100%',padding:'12px',background:step1Valid()?'#0F6E56':'#9CA3AF',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                Continue to PO & Supplier details →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {!submitted && step === 2 && (
            <div>
              <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>PO & Supplier Details</h2>
              <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Fill in your purchase order and supplier quotation details.</p>

              <div style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'14px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>📋 Purchase Order Details</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={labelStyle}>PO Number <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="text" placeholder="e.g. PO-2025-00123" value={poNumber} onChange={e=>setPoNumber(e.target.value)} style={inputReq(poNumber)}/>
                  </div>
                  <div>
                    <label style={labelStyle}>PO Value (ZAR) <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="number" placeholder="e.g. 500000" value={poValue} onChange={e=>setPoValue(e.target.value)} style={inputReq(poValue)}/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={labelStyle}>Funding needed (ZAR) <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="number" placeholder="e.g. 400000" value={fundingNeeded} onChange={e=>setFundingNeeded(e.target.value)} style={inputReq(fundingNeeded)}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Industry / Sector <span style={{color:'#DC2626'}}>*</span></label>
                    <select value={sector} onChange={e=>setSector(e.target.value)} style={inputReq(sector)}>
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
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={labelStyle}>PO Issue date</label>
                    <input type="date" value={issueDate} onChange={e=>setIssueDate(e.target.value)} style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>PO Expiry date</label>
                    <input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} style={inputStyle}/>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Description of goods / services</label>
                  <textarea placeholder="e.g. Supply of electrical equipment..." value={description} onChange={e=>setDescription(e.target.value)}
                    style={{...inputStyle,minHeight:'80px',resize:'vertical'}}/>
                </div>
              </div>

              <div style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'14px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>🏭 Supplier Details</p>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Supplier / Vendor name <span style={{color:'#DC2626'}}>*</span></label>
                  <input type="text" placeholder="e.g. ABC Electrical Supplies (Pty) Ltd" value={supplierName} onChange={e=>setSupplierName(e.target.value)} style={inputReq(supplierName)}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={labelStyle}>Supplier phone <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="tel" placeholder="+27 11 000 0000" value={supplierPhone} onChange={e=>setSupplierPhone(e.target.value)} style={inputReq(supplierPhone)}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Supplier email <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="email" placeholder="sales@supplier.co.za" value={supplierEmail} onChange={e=>setSupplierEmail(e.target.value)} style={inputReq(supplierEmail)}/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <div>
                    <label style={labelStyle}>Quotation number <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="text" placeholder="e.g. QT-2025-00456" value={quotationNumber} onChange={e=>setQuotationNumber(e.target.value)} style={inputReq(quotationNumber)}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Quotation value (ZAR) <span style={{color:'#DC2626'}}>*</span></label>
                    <input type="number" placeholder="e.g. 350000" value={quotationValue} onChange={e=>setQuotationValue(e.target.value)} style={inputReq(quotationValue)}/>
                  </div>
                </div>
              </div>

              {po > 0 && quote > 0 && (
                <div style={{background:profit>0?'#E1F5EE':'#FEE2E2',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem',border:`1px solid ${profit>0?'#5DCAA5':'#FCA5A5'}`}}>
                  <p style={{fontSize:'13px',fontWeight:'700',color:profit>0?'#085041':'#DC2626',marginBottom:'.75rem'}}>📊 Profit Margin Calculator</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'.75rem'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'18px',fontWeight:'700',color:'#0F6E56'}}>R {po.toLocaleString()}</p>
                      <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>PO Value</p>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'18px',fontWeight:'700',color:'#DC2626'}}>R {quote.toLocaleString()}</p>
                      <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>Supplier Cost</p>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'18px',fontWeight:'700',color:profit>0?'#085041':'#DC2626'}}>{margin}%</p>
                      <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>Profit Margin</p>
                    </div>
                  </div>
                  <p style={{textAlign:'center',fontSize:'13px',color:profit>0?'#085041':'#DC2626',fontWeight:'600'}}>
                    {profit>0 ? `Estimated profit: R ${profit.toLocaleString()} ✅` : `Warning: Supplier cost exceeds PO value ⚠️`}
                  </p>
                </div>
              )}

              <div style={{display:'flex',gap:'12px'}}>
                <button onClick={()=>{ setError(''); setStep(1) }}
                  style={{flex:1,padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                  ← Back
                </button>
                <button onClick={()=>{
                  if (!step2Valid()) { setError('Please fill in all required fields before continuing.'); window.scrollTo(0,0); return }
                  setError(''); setStep(3)
                }} style={{flex:2,padding:'12px',background:step2Valid()?'#0F6E56':'#9CA3AF',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                  Continue to upload documents →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {!submitted && step === 3 && (
            <div>
              <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>Upload Documents</h2>
              <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Upload both your purchase order and supplier quotation.</p>
              <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>🔒</span>
                <div>
                  <p style={{fontSize:'13px',color:'#085041',fontWeight:'600',marginBottom:'2px'}}>Document security</p>
                  <p style={{fontSize:'12px',color:'#0F6E56',lineHeight:'1.6'}}>Both documents will only be shared with verified funders who submit an offer on your PO.</p>
                </div>
              </div>
              <UploadBox label="Purchase Order Document" file={poFile} onChange={setPoFile} hint="Upload the official PO from your client. Must include contact details and department."/>
              <UploadBox label="Supplier Quotation" file={quotationFile} onChange={setQuotationFile} hint="Upload the quotation from your supplier. Must include contact details and pricing."/>
              <div style={{background:'#FAEEDA',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>⚠️</span>
                <div>
                  <p style={{fontSize:'13px',color:'#633806',fontWeight:'600',marginBottom:'2px'}}>Important reminder</p>
                  <p style={{fontSize:'12px',color:'#633806',lineHeight:'1.6'}}>Submitting fraudulent documents is a criminal offence.</p>
                </div>
              </div>
              <div style={{display:'flex',gap:'12px'}}>
                <button onClick={()=>{ setError(''); setStep(2) }}
                  style={{flex:1,padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                  ← Back
                </button>
                <button onClick={()=>{
                  if (!poFile || !quotationFile) { setError('Please upload both the Purchase Order and Supplier Quotation before continuing.'); window.scrollTo(0,0); return }
                  setError(''); setStep(4)
                }} style={{flex:2,padding:'12px',background:(poFile&&quotationFile)?'#0F6E56':'#9CA3AF',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                  Continue to review →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {!submitted && step === 4 && (
            <div>
              <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>Review & Submit</h2>
              <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Please review everything before submitting.</p>

              {[
                { title:'👤 Client Information', rows:[['Company',clientName],['Contact',clientContact],['Department',clientDepartment],['Phone',clientPhone],['Email',clientEmail]] },
                { title:'📋 Purchase Order', rows:[['PO Number',poNumber],['PO Value',`R ${parseFloat(poValue||'0').toLocaleString()}`],['Funding needed',`R ${parseFloat(fundingNeeded||'0').toLocaleString()}`],['Sector',sector]] },
                { title:'🏭 Supplier', rows:[['Supplier',supplierName],['Phone',supplierPhone],['Quotation No.',quotationNumber],['Quotation Value',`R ${parseFloat(quotationValue||'0').toLocaleString()}`]] },
              ].map(({title,rows})=>(
                <div key={title} style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem',border:'1px solid #e5e5e5'}}>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.75rem'}}>{title}</p>
                  {rows.map(([l,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                      <span style={{color:'#888'}}>{l}</span>
                      <span style={{color:'#1B2B4B',fontWeight:'600'}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}

              {po > 0 && quote > 0 && (
                <div style={{background:'#E1F5EE',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem',border:'1px solid #5DCAA5'}}>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'#085041',marginBottom:'.5rem'}}>📊 Profit Margin</p>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'14px'}}>
                    <span style={{color:'#666'}}>Estimated profit</span>
                    <span style={{fontWeight:'700',color:'#085041'}}>R {profit.toLocaleString()} ({margin}%)</span>
                  </div>
                </div>
              )}

              <div style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.75rem'}}>📄 Documents</p>
                <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>Purchase Order</span>
                  <span style={{color:poFile?'#0F6E56':'#DC2626',fontWeight:'600'}}>{poFile?'✓ '+poFile.name:'Not uploaded'}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>Supplier Quotation</span>
                  <span style={{color:quotationFile?'#0F6E56':'#DC2626',fontWeight:'600'}}>{quotationFile?'✓ '+quotationFile.name:'Not uploaded'}</span>
                </div>
              </div>

              <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <span style={{fontSize:'18px'}}>ℹ️</span>
                <p style={{fontSize:'13px',color:'#085041',lineHeight:'1.6'}}>
                  By submitting, your PO will be listed on the FundMyPO marketplace for verified funders to review and submit offers.
                </p>
              </div>

              <div style={{display:'flex',gap:'12px'}}>
                <button onClick={()=>{ setError(''); setStep(3) }}
                  style={{flex:1,padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{flex:2,padding:'12px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
                  {loading ? 'Submitting...' : 'Submit to marketplace ✓'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
