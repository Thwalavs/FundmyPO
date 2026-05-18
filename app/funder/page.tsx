'use client'
import { useState, useEffect } from 'react'

const marketplace = [
  { id:'PO-2025-001', business:'Dlamini Suppliers', businessId:'biz001', client:'Eskom Holdings', value:'R 500,000', funding:'R 400,000', sector:'Construction', risk:'Low', expires:'10 May 2025' },
  { id:'PO-2025-002', business:'Zulu Trading Co.', businessId:'biz002', client:'Transnet Freight Rail', value:'R 280,000', funding:'R 250,000', sector:'Transport', risk:'Medium', expires:'12 May 2025' },
  { id:'PO-2025-004', business:'Mokoena Supplies', businessId:'biz003', client:'Sasol Limited', value:'R 920,000', funding:'R 800,000', sector:'Mining', risk:'Low', expires:'15 May 2025' },
  { id:'PO-2025-005', business:'Ndlovu Contractors', businessId:'biz004', client:'City of Cape Town', value:'R 340,000', funding:'R 300,000', sector:'Government', risk:'Low', expires:'18 May 2025' },
]

const myOffers = [
  { po:'PO-2025-003', business:'Tau Distributors', amount:'R 600,000', rate:'3.5%', term:'60 days', status:'accepted' },
  { po:'PO-2025-006', business:'Khumalo Services', amount:'R 180,000', rate:'4.0%', term:'45 days', status:'pending' },
]

const businessDocs = [
  'Company Registration Certificate',
  'ID Copy of Director',
  'CSD Full Registration Report',
  'Tax Clearance Certificate',
  'BBB-EE Certificate or Sworn Affidavit',
]

function RiskBadge({ risk }: { risk: string }) {
  const s = risk === 'Low'
    ? { bg:'#E1F5EE', color:'#085041' }
    : { bg:'#FAEEDA', color:'#633806' }
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {risk} risk
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status === 'accepted'
    ? { bg:'#E1F5EE', color:'#085041', label:'Accepted' }
    : { bg:'#FAEEDA', color:'#633806', label:'Pending' }
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {s.label}
    </span>
  )
}

export default function FunderDashboard() {
  const [activeTab, setActiveTab] = useState<'marketplace'|'offers'|'profile'>('marketplace')
  const [submittedOffers, setSubmittedOffers] = useState<string[]>([])
  const [selectedPO, setSelectedPO] = useState<string|null>(null)
  const [viewingDocs, setViewingDocs] = useState<string|null>(null)
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{ setMounted(true) },[])

  function handleSubmitOffer(poId: string) {
    setSubmittedOffers(prev => [...prev, poId])
    setSelectedPO(null)
    setRate('')
    setTerm('')
  }

  if (!mounted) return null

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      {/* NAVBAR */}
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e5e5',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a'}}>
          Fund<span style={{color:'#0F6E56'}}>MyPO</span>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
<span style={{background:'#E1F5EE',padding:'4px 12px',borderRadius:'99px',color:'#085041',fontWeight:'500'}}>Funder portal</span>
          <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'500',color:'#085041'}}>
            TN
          </div>
        </div>
      </nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>

        {/* WELCOME */}
        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'500',marginBottom:'.25rem'}}>Welcome back, Thabo 👋</h1>
          <p style={{fontSize:'14px',color:'#666'}}>Browse available purchase orders and submit competitive funding offers.</p>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'2rem'}}>
          {[
            { label:'Available POs', value:'4', color:'#0F6E56' },
            { label:'My active offers', value:'2', color:'#633806' },
            { label:'Total deployed', value:'R 780K', color:'#0C447C' },
            { label:'Accepted deals', value:'1', color:'#085041' },
          ].map(({label,value,color})=>(
            <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{fontSize:'24px',fontWeight:'500',color}}>{value}</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'1.5rem',width:'fit-content'}}>
          {(['marketplace','offers','profile'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500',background:activeTab===t?'#0F6E56':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='marketplace'?'Marketplace':t==='offers'?'My Offers':'Profile'}
            </button>
          ))}
        </div>

        {/* MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <div>
            <div style={{marginBottom:'1rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'.25rem'}}>Available Purchase Orders</h2>
              <p style={{fontSize:'13px',color:'#666'}}>Submit an offer to unlock business verification documents.</p>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {marketplace.map(po=>(
                <div key={po.id} style={{background:'#fff',border:selectedPO===po.id?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{po.id}</span>
                        <RiskBadge risk={po.risk}/>
                        {submittedOffers.includes(po.id) && (
                          <span style={{background:'#E6F1FB',color:'#0C447C',padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
                            Offer submitted
                          </span>
                        )}
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{po.business} → {po.client}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>{po.funding}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>PO value: {po.value}</p>
                    </div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                    <div style={{display:'flex',gap:'12px'}}>
                      <span style={{fontSize:'12px',color:'#888'}}>📁 {po.sector}</span>
                      <span style={{fontSize:'12px',color:'#888'}}>⏰ Expires {po.expires}</span>
                    </div>
                    <div style={{display:'flex',gap:'8px'}}>
                      {submittedOffers.includes(po.id) && (
                        <button
                          onClick={()=>setViewingDocs(viewingDocs===po.id?null:po.id)}
                          style={{fontSize:'13px',color:'#085041',background:'#E1F5EE',border:'none',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                          {viewingDocs===po.id ? 'Hide docs' : '📄 View documents'}
                        </button>
                      )}
                      {!submittedOffers.includes(po.id) && (
                        <button
                          onClick={()=>setSelectedPO(selectedPO===po.id?null:po.id)}
                          style={{fontSize:'13px',color:'#0F6E56',background:'#E1F5EE',border:'none',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                          {selectedPO===po.id?'Cancel':'Make an offer'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OFFER FORM */}
                  {selectedPO === po.id && (
                    <div style={{marginTop:'1rem',padding:'1rem',background:'#f9f9f9',borderRadius:'10px',border:'1px solid #e5e5e5'}}>
                      <p style={{fontSize:'14px',fontWeight:'500',marginBottom:'1rem'}}>Submit your funding offer</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
                        <div>
                          <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Interest rate (%)</label>
                          <input type="number" placeholder="e.g. 3.5" value={rate} onChange={e=>setRate(e.target.value)}
                            style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'13px',color:'#666',marginBottom:'5px'}}>Repayment term (days)</label>
                          <input type="number" placeholder="e.g. 60" value={term} onChange={e=>setTerm(e.target.value)}
                            style={{width:'100%',padding:'9px 12px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
                        </div>
                      </div>
                      <div style={{background:'#E1F5EE',borderRadius:'8px',padding:'10px',marginBottom:'1rem',fontSize:'12px',color:'#085041'}}>
                        🔒 Submitting this offer will unlock the business verification documents for your review.
                      </div>
                      <button onClick={()=>handleSubmitOffer(po.id)}
                        style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                        Submit offer & unlock documents ✓
                      </button>
                    </div>
                  )}

                  {/* DOCUMENT VIEWER */}
                  {viewingDocs === po.id && (
                    <div style={{marginTop:'1rem',padding:'1.25rem',background:'#E1F5EE',borderRadius:'10px',border:'1px solid #5DCAA5'}}>
                      <p style={{fontSize:'13px',fontWeight:'500',color:'#085041',marginBottom:'.25rem'}}>
                        📄 {po.business} — Verification Documents
                      </p>
                      <p style={{fontSize:'12px',color:'#0F6E56',marginBottom:'1rem'}}>
                        These documents are confidential and available only because you submitted a funding offer.
                      </p>
                      {businessDocs.map(doc=>(
                        <div key={doc} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #c8ead8'}}>
                          <span style={{fontSize:'13px',color:'#085041'}}>📄 {doc}</span>
                          <div style={{display:'flex',gap:'8px'}}>
                            <button style={{fontSize:'12px',color:'#0F6E56',background:'#fff',border:'1px solid #0F6E56',padding:'4px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              View ↗
                            </button>
                            <button style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'4px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              Download ↓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY OFFERS TAB */}
        {activeTab === 'offers' && (
          <div>
            <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>My Submitted Offers</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {myOffers.map((offer,i)=>(
                <div key={i} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{offer.po}</span>
                        <StatusBadge status={offer.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{offer.business}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>{offer.amount}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>at {offer.rate}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'12px'}}>
                    <span style={{fontSize:'12px',color:'#888'}}>⏱ Term: {offer.term}</span>
                    <span style={{fontSize:'12px',color:'#888'}}>💰 Rate: {offer.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
            <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1.5rem'}}>Funder Profile</h2>
            {[
              ['Full name','Thabo Nkosi'],
              ['Institution','Nkosi Capital (Pty) Ltd'],
              ['Email','thabo@nkosicapital.co.za'],
              ['Phone','+27 71 000 0000'],
              ['FSCA number','FSP 12345'],
              ['Funder type','Private investor'],
              ['Account status','Verified ✓'],
            ].map(([label,value])=>(
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0f0f0',fontSize:'14px'}}>
                <span style={{color:'#888'}}>{label}</span>
                <span style={{fontWeight:'500',color:label==='Account status'?'#0F6E56':'#1a1a1a'}}>{value}</span>
              </div>
            ))}
            <button style={{marginTop:'1.5rem',padding:'10px 24px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              Edit profile
            </button>
          </div>
        )}

      </div>
    </main>
  )
}