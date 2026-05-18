'use client'
import { useState, useEffect } from 'react'

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [poFile, setPoFile] = useState<File|null>(null)
  const [quotationFile, setQuotationFile] = useState<File|null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Client Information
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientDepartment, setClientDepartment] = useState('')

  // PO Details
  const [poNumber, setPoNumber] = useState('')
  const [poValue, setPoValue] = useState('')
  const [fundingNeeded, setFundingNeeded] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [sector, setSector] = useState('')
  const [description, setDescription] = useState('')

  // Supplier Details
  const [supplierName, setSupplierName] = useState('')
  const [supplierPhone, setSupplierPhone] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [quotationValue, setQuotationValue] = useState('')
  const [quotationNumber, setQuotationNumber] = useState('')

  useEffect(()=>{ setMounted(true) },[])

  function handleSubmit() {
    setLoading(true)
    setTimeout(()=>{ setLoading(false); setSubmitted(true) }, 1500)
  }

  if (!mounted) return null

  const inputStyle = {width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff'}
  const labelStyle = {display:'block' as const,fontSize:'13px',color:'#666666',marginBottom:'5px'}
  const fieldStyle = {marginBottom:'1rem'}

  const po = parseFloat(poValue) || 0
  const quote = parseFloat(quotationValue) || 0
  const profit = po - quote
  const margin = po > 0 ? ((profit / po) * 100).toFixed(1) : '0'

  function UploadBox({ label, file, onChange, hint }: { label: string, file: File|null, onChange: (f: File|null) => void, hint: string }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label}</label>
        <p style={{fontSize:'12px',color:'#888',marginBottom:'8px'}}>{hint}</p>
        <div style={{border:'2px dashed '+(file?'#0F6E56':'#e5e5e5'),borderRadius:'8px',padding:'1.25rem',textAlign:'center',background:file?'#f0faf6':'#fafafa',position:'relative'}}>
          {file ? (
            <div>
              <p style={{fontSize:'13px',color:'#0F6E56',fontWeight:'500'}}>✓ {file.name}</p>
              <p style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Click to change file</p>
            </div>
          ) : (
            <div>
              <div style={{fontSize:'24px',marginBottom:'.5rem'}}>📄</div>
              <p style={{fontSize:'13px',color:'#666',fontWeight:'500'}}>Click to upload {label}</p>
              <p style={{fontSize:'12px',color:'#aaa',marginTop:'4px'}}>PDF, JPG or PNG — max 10MB</p>
            </div>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={e=>onChange(e.target.files?.[0]||null)}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0,cursor:'pointer'}}/>
        </div>
      </div>
    )
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',padding:'2rem'}}>

      {/* NAVBAR */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',maxWidth:'700px',margin:'0 auto 2rem'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a'}}>
          Fund<span style={{color:'#0F6E56'}}>MyPO</span>
        </a>
        <a href="/dashboard" style={{fontSize:'14px',color:'#0F6E56',textDecoration:'none',border:'1px solid #0F6E56',padding:'8px 16px',borderRadius:'8px'}}>
          ← Back to dashboard
        </a>
      </nav>

      {/* PROGRESS STEPS */}
      <div style={{maxWidth:'700px',margin:'0 auto 2rem',display:'flex',alignItems:'center'}}>
        {['Client Info','PO & Supplier Details','Upload Documents','Review & Submit'].map((label,i)=>{
          const num = i + 1
          const active = step === num
          const done = step > num
          return (
            <div key={label} style={{display:'flex',alignItems:'center',flex:1}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:done?'#0F6E56':active?'#0F6E56':'#e5e5e5',color:done||active?'#fff':'#888',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'500'}}>
                  {done ? '✓' : num}
                </div>
                <span style={{fontSize:'10px',color:active?'#0F6E56':'#888',fontWeight:active?'500':'400',whiteSpace:'nowrap',textAlign:'center'}}>{label}</span>
              </div>
              {i < 3 && <div style={{flex:1,height:'1px',background:done?'#0F6E56':'#e5e5e5',margin:'0 4px',marginBottom:'18px'}}></div>}
            </div>
          )
        })}
      </div>

      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',maxWidth:'700px',margin:'0 auto'}}>

        {/* SUCCESS */}
        {submitted && (
          <div style={{textAlign:'center',padding:'2rem 0'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'28px'}}>✓</div>
            <h2 style={{fontSize:'22px',fontWeight:'500',marginBottom:'.5rem',color:'#085041'}}>Application Submitted!</h2>
            <p style={{fontSize:'15px',color:'#666',marginBottom:'2rem',lineHeight:'1.7',maxWidth:'480px',margin:'0 auto 2rem'}}>
              Your purchase order and supplier quotation have been submitted to the marketplace. Funders will review your documents and contact your client and supplier to verify before making offers.
            </p>
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'2rem',textAlign:'left',maxWidth:'400px',margin:'0 auto 2rem'}}>
              <p style={{fontSize:'13px',color:'#888',marginBottom:'.75rem',fontWeight:'500'}}>What happens next:</p>
              {[
                'Funders review your PO and supplier quotation',
                'Funders contact your client to verify the PO',
                'Funders contact your supplier to verify the quote',
                'Funders calculate profit margin and risk',
                'You receive competitive funding offers',
                'You compare and accept the best offer',
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'8px',padding:'5px 0',fontSize:'13px',color:'#444'}}>
                  <span style={{color:'#0F6E56',fontWeight:'500'}}>{i+1}.</span>{item}
                </div>
              ))}
            </div>
            <a href="/dashboard" style={{background:'#0F6E56',color:'#fff',padding:'12px 28px',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'500'}}>
              Check application status →
            </a>
          </div>
        )}

        {/* STEP 1 — CLIENT INFORMATION */}
        {!submitted && step === 1 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.25rem'}}>Client Information</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Fill in the details of the client who issued the purchase order.</p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Client / Company name</label>
              <input type="text" placeholder="e.g. Eskom Holdings SOC Ltd" value={clientName} onChange={e=>setClientName(e.target.value)} style={inputStyle}/>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Contact person name</label>
              <p style={{fontSize:'12px',color:'#888',marginBottom:'5px'}}>The person responsible for issuing the purchase order</p>
              <input type="text" placeholder="e.g. John Smith" value={clientContact} onChange={e=>setClientContact(e.target.value)} style={inputStyle}/>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Department</label>
              <p style={{fontSize:'12px',color:'#888',marginBottom:'5px'}}>The department the PO came from</p>
              <input type="text" placeholder="e.g. Supply Chain / Procurement / Infrastructure" value={clientDepartment} onChange={e=>setClientDepartment(e.target.value)} style={inputStyle}/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
              <div>
                <label style={labelStyle}>Client phone number</label>
                <input type="tel" placeholder="+27 11 000 0000" value={clientPhone} onChange={e=>setClientPhone(e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Client email address</label>
                <input type="email" placeholder="procurement@client.co.za" value={clientEmail} onChange={e=>setClientEmail(e.target.value)} style={inputStyle}/>
              </div>
            </div>

            <button onClick={()=>setStep(2)}
              style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              Continue to PO details →
            </button>
          </div>
        )}

        {/* STEP 2 — PO & SUPPLIER DETAILS */}
        {!submitted && step === 2 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.25rem'}}>PO & Supplier Details</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Fill in your purchase order and supplier quotation details.</p>

            {/* PO DETAILS */}
            <div style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'14px',fontWeight:'500',color:'#1a1a1a',marginBottom:'1rem'}}>📋 Purchase Order Details</p>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>PO Number</label>
                  <input type="text" placeholder="e.g. PO-2025-00123" value={poNumber} onChange={e=>setPoNumber(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>PO Value (ZAR)</label>
                  <input type="number" placeholder="e.g. 500000" value={poValue} onChange={e=>setPoValue(e.target.value)} style={inputStyle}/>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>Funding needed (ZAR)</label>
                  <input type="number" placeholder="e.g. 400000" value={fundingNeeded} onChange={e=>setFundingNeeded(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Industry / Sector</label>
                  <select value={sector} onChange={e=>setSector(e.target.value)} style={inputStyle}>
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
                <textarea placeholder="e.g. Supply of electrical equipment to Eskom substation in Gauteng..."
                  value={description} onChange={e=>setDescription(e.target.value)}
                  style={{...inputStyle,minHeight:'80px',resize:'vertical'}}/>
              </div>
            </div>

            {/* SUPPLIER DETAILS */}
            <div style={{background:'#f9f9f9',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'14px',fontWeight:'500',color:'#1a1a1a',marginBottom:'1rem'}}>🏭 Supplier Details</p>

              <div style={fieldStyle}>
                <label style={labelStyle}>Supplier / Vendor name</label>
                <input type="text" placeholder="e.g. ABC Electrical Supplies (Pty) Ltd" value={supplierName} onChange={e=>setSupplierName(e.target.value)} style={inputStyle}/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>Supplier phone number</label>
                  <input type="tel" placeholder="+27 11 000 0000" value={supplierPhone} onChange={e=>setSupplierPhone(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Supplier email address</label>
                  <input type="email" placeholder="sales@supplier.co.za" value={supplierEmail} onChange={e=>setSupplierEmail(e.target.value)} style={inputStyle}/>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <label style={labelStyle}>Quotation number</label>
                  <input type="text" placeholder="e.g. QT-2025-00456" value={quotationNumber} onChange={e=>setQuotationNumber(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Quotation value (ZAR)</label>
                  <input type="number" placeholder="e.g. 350000" value={quotationValue} onChange={e=>setQuotationValue(e.target.value)} style={inputStyle}/>
                </div>
              </div>
            </div>

            {/* PROFIT MARGIN CALCULATOR */}
            {po > 0 && quote > 0 && (
              <div style={{background:profit>0?'#E1F5EE':'#FEE2E2',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem',border:`1px solid ${profit>0?'#5DCAA5':'#FCA5A5'}`}}>
                <p style={{fontSize:'13px',fontWeight:'500',color:profit>0?'#085041':'#DC2626',marginBottom:'.75rem'}}>
                  📊 Profit Margin Calculator
                </p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'.75rem'}}>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>R {po.toLocaleString()}</p>
                    <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>PO Value</p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'18px',fontWeight:'500',color:'#DC2626'}}>R {quote.toLocaleString()}</p>
                    <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>Supplier Cost</p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'18px',fontWeight:'500',color:profit>0?'#085041':'#DC2626'}}>{margin}%</p>
                    <p style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>Profit Margin</p>
                  </div>
                </div>
                <div style={{padding:'.75rem',background:'rgba(255,255,255,0.6)',borderRadius:'8px',textAlign:'center'}}>
                  <p style={{fontSize:'13px',color:profit>0?'#085041':'#DC2626',fontWeight:'500'}}>
                    {profit>0
                      ? `Estimated profit: R ${profit.toLocaleString()} — Funders will see this is a viable deal ✅`
                      : `Warning: Supplier cost exceeds PO value. Please check your figures.`
                    }
                  </p>
                </div>
              </div>
            )}

            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>setStep(1)}
                style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                ← Back
              </button>
              <button onClick={()=>setStep(3)}
                style={{flex:2,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                Continue to upload documents →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — UPLOAD DOCUMENTS */}
        {!submitted && step === 3 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.25rem'}}>Upload Documents</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Upload your purchase order and supplier quotation documents.</p>

            <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',color:'#085041',fontWeight:'500',marginBottom:'3px'}}>🔒 Document security</p>
              <p style={{fontSize:'12px',color:'#0F6E56',lineHeight:'1.6'}}>
                Both documents will only be shared with verified funders who submit an offer on your PO. Funders will use the contact details in these documents to verify legitimacy directly with your client and supplier.
              </p>
            </div>

            <UploadBox
              label="Purchase Order Document"
              file={poFile}
              onChange={setPoFile}
              hint="Upload the official PO from your client. Must include client contact details and department."
            />

            <UploadBox
              label="Supplier Quotation"
              file={quotationFile}
              onChange={setQuotationFile}
              hint="Upload the quotation from your supplier. Must include supplier contact details and pricing."
            />

            <div style={{background:'#FAEEDA',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',color:'#633806',fontWeight:'500',marginBottom:'3px'}}>⚠️ Important reminder</p>
              <p style={{fontSize:'12px',color:'#633806',lineHeight:'1.6'}}>
                Make sure both documents contain valid contact details. Funders will call your client and supplier directly to verify before making any funding offer. Submitting fraudulent documents is a criminal offence.
              </p>
            </div>

            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>setStep(2)}
                style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                ← Back
              </button>
              <button onClick={()=>setStep(4)}
                style={{flex:2,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                Continue to review →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — REVIEW & SUBMIT */}
        {!submitted && step === 4 && (
          <div>
            <h2 style={{fontSize:'20px',fontWeight:'500',marginBottom:'.25rem'}}>Review & Submit</h2>
            <p style={{fontSize:'14px',color:'#666',marginBottom:'1.5rem'}}>Please review everything before submitting to the marketplace.</p>

            {/* CLIENT INFO */}
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'13px',fontWeight:'500',color:'#444',marginBottom:'.75rem'}}>👤 Client Information</p>
              {[
                ['Company', clientName || 'Eskom Holdings SOC Ltd'],
                ['Contact person', clientContact || 'John Smith'],
                ['Department', clientDepartment || 'Supply Chain'],
                ['Phone', clientPhone || '+27 11 000 0000'],
                ['Email', clientEmail || 'procurement@client.co.za'],
              ].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>{label}</span>
                  <span style={{color:'#1a1a1a',fontWeight:'500'}}>{value}</span>
                </div>
              ))}
            </div>

            {/* PO DETAILS */}
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'13px',fontWeight:'500',color:'#444',marginBottom:'.75rem'}}>📋 Purchase Order</p>
              {[
                ['PO Number', poNumber || 'PO-2025-00123'],
                ['PO Value', `R ${parseFloat(poValue||'500000').toLocaleString()}`],
                ['Funding needed', `R ${parseFloat(fundingNeeded||'400000').toLocaleString()}`],
                ['Sector', sector || 'Construction'],
              ].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>{label}</span>
                  <span style={{color:'#1a1a1a',fontWeight:'500'}}>{value}</span>
                </div>
              ))}
            </div>

            {/* SUPPLIER */}
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'13px',fontWeight:'500',color:'#444',marginBottom:'.75rem'}}>🏭 Supplier</p>
              {[
                ['Supplier', supplierName || 'ABC Electrical Supplies'],
                ['Phone', supplierPhone || '+27 11 000 0000'],
                ['Quotation number', quotationNumber || 'QT-2025-00456'],
                ['Quotation value', `R ${parseFloat(quotationValue||'350000').toLocaleString()}`],
              ].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                  <span style={{color:'#888'}}>{label}</span>
                  <span style={{color:'#1a1a1a',fontWeight:'500'}}>{value}</span>
                </div>
              ))}
            </div>

            {/* PROFIT MARGIN */}
            {po > 0 && quote > 0 && (
              <div style={{background:'#E1F5EE',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
                <p style={{fontSize:'13px',fontWeight:'500',color:'#085041',marginBottom:'.5rem'}}>📊 Profit Margin</p>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'14px'}}>
                  <span style={{color:'#666'}}>Estimated profit</span>
                  <span style={{fontWeight:'500',color:'#085041'}}>R {profit.toLocaleString()} ({margin}%)</span>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            <div style={{background:'#f5f5f5',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',fontWeight:'500',color:'#444',marginBottom:'.75rem'}}>📄 Documents</p>
              <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e5e5e5',fontSize:'14px'}}>
                <span style={{color:'#888'}}>Purchase Order</span>
                <span style={{color:poFile?'#0F6E56':'#DC2626',fontWeight:'500'}}>{poFile?'✓ '+poFile.name:'❌ Not uploaded'}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:'14px'}}>
                <span style={{color:'#888'}}>Supplier Quotation</span>
                <span style={{color:quotationFile?'#0F6E56':'#DC2626',fontWeight:'500'}}>{quotationFile?'✓ '+quotationFile.name:'❌ Not uploaded'}</span>
              </div>
            </div>

            <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',color:'#085041',lineHeight:'1.6'}}>
                By submitting, your PO will be listed on the FundMyPO marketplace. Verified funders will review your documents, contact your client and supplier to verify, then submit competitive funding offers.
              </p>
            </div>

            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={()=>setStep(3)}
                style={{flex:1,padding:'11px',background:'transparent',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{flex:2,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                {loading ? 'Submitting...' : 'Submit to marketplace ✓'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}