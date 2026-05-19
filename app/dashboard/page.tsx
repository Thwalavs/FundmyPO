'use client'
import { useState, useEffect } from 'react'

const applications = [
  {
    id:'APP-2025-001',
    poNumber:'PO-2025-001',
    client:'Eskom Holdings SOC Ltd',
    department:'Supply Chain',
    value:'R 500,000',
    funding:'R 400,000',
    sector:'Construction',
    status:'offers',
    offers:3,
    date:'2 May 2025',
    offersList: [
      { id:1, funder:'Nkosi Capital', amount:'R 400,000', rate:'3.5%', term:'60 days', fee:'R 14,000', total:'R 414,000', status:'pending' },
      { id:2, funder:'Apex Finance', amount:'R 380,000', rate:'4.1%', term:'45 days', fee:'R 15,580', total:'R 395,580', status:'pending' },
      { id:3, funder:'SA Growth Fund', amount:'R 400,000', rate:'3.8%', term:'90 days', fee:'R 15,200', total:'R 415,200', status:'pending' },
    ]
  },
  {
    id:'APP-2025-002',
    poNumber:'PO-2025-002',
    client:'Transnet Freight Rail',
    department:'Procurement',
    value:'R 280,000',
    funding:'R 250,000',
    sector:'Transport',
    status:'reviewing',
    offers:0,
    date:'5 May 2025',
    offersList: []
  },
  {
    id:'APP-2025-003',
    poNumber:'PO-2025-003',
    client:'City of Johannesburg',
    department:'Infrastructure',
    value:'R 750,000',
    funding:'R 600,000',
    sector:'Government',
    status:'funded',
    offers:5,
    date:'1 Apr 2025',
    offersList: []
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    offers:    { bg:'#E1F5EE', color:'#085041', label:'Offers received' },
    reviewing: { bg:'#FAEEDA', color:'#633806', label:'Under review' },
    funded:    { bg:'#E6F1FB', color:'#0C447C', label:'Funded' },
    pending:   { bg:'#f5f5f5', color:'#666', label:'Pending' },
    accepted:  { bg:'#E1F5EE', color:'#085041', label:'Accepted ✓' },
    declined:  { bg:'#FEE2E2', color:'#DC2626', label:'Declined' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {s.label}
    </span>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'home'|'status'|'profile'>('home')
  const [viewingOffers, setViewingOffers] = useState<string|null>(null)
  const [acceptedOffer, setAcceptedOffer] = useState<Record<string,number>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{ setMounted(true) },[])

  function handleAcceptOffer(appId: string, offerId: number) {
    setAcceptedOffer(prev => ({...prev, [appId]: offerId}))
  }

  if (!mounted) return null

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

  <nav style={{background:'#fff',borderBottom:'1px solid #e5e5e5',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <a href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a'}}>
    Fund<span style={{color:'#0F6E56'}}>MyPO</span>
  </a>
  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'500',color:'#085041'}}>
    VS
  </div>
</nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>

        <div style={{marginBottom:'2rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'500',marginBottom:'.25rem'}}>Welcome back! 👋</h1>
          <p style={{fontSize:'14px',color:'#666'}}>What would you like to do today?</p>
        </div>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'2rem'}}>
              <a href="/upload" style={{textDecoration:'none'}}>
                <div style={{background:'#0F6E56',borderRadius:'16px',padding:'2rem',cursor:'pointer'}}>
                  <div style={{fontSize:'32px',marginBottom:'1rem'}}>💰</div>
                  <h2 style={{fontSize:'18px',fontWeight:'500',color:'#fff',marginBottom:'.5rem'}}>Apply for Funding</h2>
                  <p style={{fontSize:'13px',color:'#a8dfc9',lineHeight:'1.6'}}>
                    Upload your purchase order and supplier quotation to get competitive funding offers.
                  </p>
                  <div style={{marginTop:'1.25rem',display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.15)',padding:'8px 16px',borderRadius:'8px'}}>
                    <span style={{fontSize:'13px',color:'#fff',fontWeight:'500'}}>Start application →</span>
                  </div>
                </div>
              </a>

              <div onClick={()=>setActiveTab('status')} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',cursor:'pointer'}}>
                <div style={{fontSize:'32px',marginBottom:'1rem'}}>📋</div>
                <h2 style={{fontSize:'18px',fontWeight:'500',color:'#1a1a1a',marginBottom:'.5rem'}}>Check Status</h2>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.6'}}>
                  Track your applications, view funding offers and accept the best deal.
                </p>
                <div style={{marginTop:'1.25rem',display:'inline-flex',alignItems:'center',gap:'6px',background:'#E1F5EE',padding:'8px 16px',borderRadius:'8px'}}>
                  <span style={{fontSize:'13px',color:'#0F6E56',fontWeight:'500'}}>View applications →</span>
                </div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'2rem'}}>
              {[
                { label:'Active applications', value:'2', color:'#0F6E56' },
                { label:'Offers received', value:'3', color:'#633806' },
                { label:'Total funded', value:'R 600K', color:'#0C447C' },
                { label:'Avg. turnaround', value:'36h', color:'#085041' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'24px',fontWeight:'500',color}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>Recent activity</h2>
              {[
                { text:'New funding offer received for PO-2025-001', time:'2 hours ago', color:'#0F6E56' },
                { text:'PO-2025-002 is under review by our team', time:'1 day ago', color:'#633806' },
                { text:'PO-2025-003 has been successfully funded', time:'2 weeks ago', color:'#0C447C' },
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'12px',padding:'10px 0',borderBottom:i<2?'1px solid #f0f0f0':'none',alignItems:'flex-start'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:item.color,marginTop:'5px',flexShrink:0}}></div>
                  <div>
                    <p style={{fontSize:'14px',color:'#1a1a1a'}}>{item.text}</p>
                    <p style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === 'status' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <div>
                <h2 style={{fontSize:'18px',fontWeight:'500',marginBottom:'.25rem'}}>My Funding Applications</h2>
                <p style={{fontSize:'13px',color:'#666'}}>View offers and accept the best funding deal</p>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setActiveTab('home')}
                  style={{fontSize:'13px',color:'#666',background:'transparent',border:'1px solid #e5e5e5',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>
                  ← Back
                </button>
                <a href="/upload" style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',textDecoration:'none',fontWeight:'500'}}>
                  + New application
                </a>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {applications.map(app=>(
                <div key={app.id}>
                  <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'15px',fontWeight:'500'}}>{app.poNumber}</span>
                          <StatusBadge status={app.status}/>
                          {acceptedOffer[app.id] && <span style={{background:'#E1F5EE',color:'#085041',padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>Deal accepted ✓</span>}
                        </div>
                        <p style={{fontSize:'13px',color:'#666'}}>{app.client}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Dept: {app.department}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'15px',fontWeight:'500',color:'#0F6E56'}}>{app.value}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Funding: {app.funding}</p>
                      </div>
                    </div>

                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                      <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                        <span style={{fontSize:'12px',color:'#888'}}>📁 {app.sector}</span>
                        <span style={{fontSize:'12px',color:'#888'}}>📅 {app.date}</span>
                        {app.offers > 0 && <span style={{fontSize:'12px',color:'#0F6E56',fontWeight:'500'}}>💰 {app.offers} offer{app.offers>1?'s':''}</span>}
                      </div>
                      <div style={{display:'flex',gap:'8px'}}>
                        {app.offers > 0 && (
                          <button
                            onClick={()=>setViewingOffers(viewingOffers===app.id?null:app.id)}
                            style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                            {viewingOffers===app.id ? 'Hide offers' : `💰 View ${app.offers} offers`}
                          </button>
                        )}
                        {app.status === 'reviewing' && (
                          <span style={{fontSize:'12px',color:'#633806',background:'#FAEEDA',padding:'6px 14px',borderRadius:'8px'}}>
                            ⏳ Being reviewed
                          </span>
                        )}
                        {app.status === 'funded' && (
                          <span style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',padding:'6px 14px',borderRadius:'8px'}}>
                            ✅ Successfully funded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* OFFERS LIST */}
                    {viewingOffers === app.id && app.offersList.length > 0 && (
                      <div style={{marginTop:'1.25rem'}}>
                        <p style={{fontSize:'14px',fontWeight:'500',marginBottom:'1rem',color:'#1a1a1a'}}>
                          Compare funding offers for {app.poNumber}
                        </p>

                        {acceptedOffer[app.id] ? (
                          <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'1.5rem',textAlign:'center'}}>
                            <div style={{fontSize:'32px',marginBottom:'.5rem'}}>🎉</div>
                            <p style={{fontSize:'16px',fontWeight:'500',color:'#085041',marginBottom:'.5rem'}}>
                              Offer accepted successfully!
                            </p>
                            <p style={{fontSize:'14px',color:'#0F6E56',marginBottom:'.25rem'}}>
                              You accepted the offer from <strong>{app.offersList.find(o=>o.id===acceptedOffer[app.id])?.funder}</strong>
                            </p>
                            <p style={{fontSize:'13px',color:'#0F6E56'}}>
                              Funding of {app.offersList.find(o=>o.id===acceptedOffer[app.id])?.amount} at {app.offersList.find(o=>o.id===acceptedOffer[app.id])?.rate} will be processed within 24 hours.
                            </p>
                          </div>
                        ) : (
                          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                            {app.offersList.map((offer,i)=>(
                              <div key={offer.id} style={{background:'#f9f9f9',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                                  <div>
                                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                                      <span style={{fontSize:'15px',fontWeight:'500'}}>{offer.funder}</span>
                                      {i===0 && <span style={{background:'#E1F5EE',color:'#085041',fontSize:'11px',padding:'2px 8px',borderRadius:'99px',fontWeight:'500'}}>⭐ Best rate</span>}
                                    </div>
                                  </div>
                                  <div style={{textAlign:'right'}}>
                                    <p style={{fontSize:'20px',fontWeight:'500',color:'#0F6E56'}}>{offer.rate}</p>
                                    <p style={{fontSize:'12px',color:'#888'}}>interest rate</p>
                                  </div>
                                </div>

                                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',background:'#fff',borderRadius:'8px',padding:'12px',marginBottom:'1rem'}}>
                                  {[
                                    ['Amount', offer.amount],
                                    ['Term', offer.term],
                                    ['Fee', offer.fee],
                                    ['Total repay', offer.total],
                                  ].map(([l,v])=>(
                                    <div key={l} style={{textAlign:'center'}}>
                                      <p style={{fontSize:'13px',fontWeight:'500',color:'#1a1a1a'}}>{v}</p>
                                      <p style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{l}</p>
                                    </div>
                                  ))}
                                </div>

                                <button
                                  onClick={()=>handleAcceptOffer(app.id, offer.id)}
                                  style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                                  Accept this offer ✓
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
            <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1.5rem'}}>Business Profile</h2>
            {[
              ['Business name','VAA GROUP'],
              ['Email','vsiphoesihle@gmail.com'],
              ['Phone','+27 65 822 6174'],
              ['Company reg.','2018/624926'],
              ['Account status','Verified ✓'],
            ].map(([label,value])=>(
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0f0f0',fontSize:'14px'}}>
                <span style={{color:'#888'}}>{label}</span>
                <span style={{fontWeight:'500',color:label==='Account status'?'#0F6E56':'#1a1a1a'}}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginTop:'2rem',width:'fit-content'}}>
          {(['home','status','profile'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500',background:activeTab===t?'#0F6E56':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='home'?'🏠 Home':t==='status'?'📋 My Applications':'👤 Profile'}
            </button>
          ))}
        </div>

      </div>
    </main>
  )
}