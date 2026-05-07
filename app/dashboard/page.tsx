'use client'
import { useState } from 'react'

const pos = [
  { id:'PO-2025-001', client:'Eskom Holdings SOC Ltd', value:'R 500,000', funding:'R 400,000', sector:'Construction', status:'offers', offers:3, date:'2 May 2025' },
  { id:'PO-2025-002', client:'Transnet Freight Rail', value:'R 280,000', funding:'R 250,000', sector:'Transport', status:'reviewing', offers:0, date:'5 May 2025' },
  { id:'PO-2025-003', client:'City of Johannesburg', value:'R 750,000', funding:'R 600,000', sector:'Government', status:'funded', offers:5, date:'1 Apr 2025' },
]

const offers = [
  { funder:'Nkosi Capital', po:'PO-2025-001', rate:'3.5%', term:'60 days', amount:'R 400,000', status:'pending' },
  { funder:'Apex Finance', po:'PO-2025-001', rate:'4.1%', term:'45 days', amount:'R 380,000', status:'pending' },
  { funder:'SA Growth Fund', po:'PO-2025-001', rate:'3.8%', term:'90 days', amount:'R 400,000', status:'pending' },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    offers:    { bg:'#E1F5EE', color:'#085041', label:'Offers received' },
    reviewing: { bg:'#FAEEDA', color:'#633806', label:'Under review' },
    funded:    { bg:'#E6F1FB', color:'#0C447C', label:'Funded' },
    pending:   { bg:'#FAEEDA', color:'#633806', label:'Pending' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {s.label}
    </span>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'pos'|'offers'|'profile'>('pos')
  const [selectedOffer, setSelectedOffer] = useState<number|null>(null)
  const [acceptedOffer, setAcceptedOffer] = useState<number|null>(null)

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      {/* NAVBAR */}
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e5e5',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a'}}>
          Fund<span style={{color:'#0F6E56'}}>MyPO</span>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <a href="/upload" style={{background:'#0F6E56',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'500'}}>
            + Upload PO
          </a>
          <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'500',color:'#085041'}}>
            SD
          </div>
        </div>
      </nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>

        {/* WELCOME */}
        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'500',marginBottom:'.25rem'}}>Welcome back, Sipho 👋</h1>
          <p style={{fontSize:'14px',color:'#666'}}>Here's what's happening with your purchase orders today.</p>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'2rem'}}>
          {[
            { label:'Active POs', value:'2', color:'#0F6E56', bg:'#E1F5EE' },
            { label:'Offers received', value:'3', color:'#633806', bg:'#FAEEDA' },
            { label:'Total funded', value:'R 600K', color:'#0C447C', bg:'#E6F1FB' },
            { label:'Avg. turnaround', value:'36h', color:'#085041', bg:'#E1F5EE' },
          ].map(({label,value,color,bg})=>(
            <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{fontSize:'24px',fontWeight:'500',color}}>{value}</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'1.5rem',width:'fit-content'}}>
          {(['pos','offers','profile'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500',background:activeTab===t?'#0F6E56':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='pos'?'My POs':t==='offers'?'Funding Offers':'Profile'}
            </button>
          ))}
        </div>

        {/* MY POs TAB */}
        {activeTab === 'pos' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500'}}>Your Purchase Orders</h2>
              <a href="/upload" style={{fontSize:'14px',color:'#0F6E56',textDecoration:'none'}}>+ Upload new PO</a>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {pos.map(po=>(
                <div key={po.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.75rem',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{po.id}</span>
                        <StatusBadge status={po.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{po.client}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'15px',fontWeight:'500',color:'#0F6E56'}}>{po.value}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Funding: {po.funding}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                    <div style={{display:'flex',gap:'12px'}}>
                      <span style={{fontSize:'12px',color:'#888'}}>📁 {po.sector}</span>
                      <span style={{fontSize:'12px',color:'#888'}}>📅 {po.date}</span>
                      {po.offers > 0 && <span style={{fontSize:'12px',color:'#0F6E56',fontWeight:'500'}}>💰 {po.offers} offers</span>}
                    </div>
                    {po.offers > 0 && (
                      <button onClick={()=>setActiveTab('offers')}
                        style={{fontSize:'13px',color:'#0F6E56',background:'#E1F5EE',border:'none',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                        View offers →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUNDING OFFERS TAB */}
        {activeTab === 'offers' && (
          <div>
            <div style={{marginBottom:'1rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'.25rem'}}>Funding Offers</h2>
              <p style={{fontSize:'13px',color:'#666'}}>Compare offers for PO-2025-001 and choose the best one for your business.</p>
            </div>

            {acceptedOffer !== null ? (
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'2rem',textAlign:'center'}}>
                <div style={{fontSize:'32px',marginBottom:'.75rem'}}>🎉</div>
                <h3 style={{fontSize:'18px',fontWeight:'500',color:'#085041',marginBottom:'.5rem'}}>Offer Accepted!</h3>
                <p style={{fontSize:'14px',color:'#0F6E56',marginBottom:'.25rem'}}>You accepted the offer from <strong>{offers[acceptedOffer].funder}</strong></p>
                <p style={{fontSize:'14px',color:'#0F6E56'}}>Funding of {offers[acceptedOffer].amount} at {offers[acceptedOffer].rate} will be processed within 24 hours.</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {offers.map((offer,i)=>(
                  <div key={i} style={{background:'#fff',border:selectedOffer===i?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem',cursor:'pointer'}}
                    onClick={()=>setSelectedOffer(i)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                          <span style={{fontSize:'15px',fontWeight:'500'}}>{offer.funder}</span>
                          {i===0 && <span style={{background:'#E1F5EE',color:'#085041',fontSize:'11px',padding:'2px 8px',borderRadius:'99px',fontWeight:'500'}}>Best rate</span>}
                        </div>
                        <p style={{fontSize:'13px',color:'#666'}}>For {offer.po}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>{offer.rate}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>interest rate</p>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',margin:'1rem 0',background:'#f5f5f5',borderRadius:'8px',padding:'12px'}}>
                      {[['Amount',offer.amount],['Term',offer.term],['Status','Pending']].map(([l,v])=>(
                        <div key={l} style={{textAlign:'center'}}>
                          <p style={{fontSize:'13px',fontWeight:'500',color:'#1a1a1a'}}>{v}</p>
                          <p style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{l}</p>
                        </div>
                      ))}
                    </div>
                    {selectedOffer === i && (
                      <button onClick={()=>setAcceptedOffer(i)}
                        style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                        Accept this offer ✓
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
            <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1.5rem'}}>Business Profile</h2>
            {[
              ['Full name','Sipho Dlamini'],
              ['Business name','Dlamini Suppliers (Pty) Ltd'],
              ['Email','sipho@dlamini.co.za'],
              ['Phone','+27 82 000 0000'],
              ['Company reg.','2021/123456/07'],
              ['Business type','Supplier / Distributor'],
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