'use client'
import { useState, useEffect } from 'react'

type PO = {
  id: string
  po_number: string
  client_name: string
  client_department: string
  po_value: number
  funding_needed: number
  sector: string
  status: string
  created_at: string
}

type Offer = {
  id: string
  po_id: string
  amount: number
  interest_rate: number
  term_days: number
  status: string
  created_at: string
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    reviewing: { bg:'#FAEEDA', color:'#633806', label:'Under review' },
    active:    { bg:'#E1F5EE', color:'#085041', label:'Active' },
    funded:    { bg:'#E6F1FB', color:'#0C447C', label:'Funded' },
    accepted:  { bg:'#E1F5EE', color:'#085041', label:'Accepted ✓' },
    pending:   { bg:'#f5f5f5', color:'#666', label:'Pending' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'600'}}>
      {s.label}
    </span>
  )
}

async function handleSignOut() {
  const { createBrowserClient } = await import('@supabase/ssr')
  const supabase = createBrowserClient(
    'https://efzszombcfxyyobqehyp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
  )
  await supabase.auth.signOut()
  window.location.href = '/'
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'home'|'status'|'profile'>('home')
  const [pos, setPos] = useState<PO[]>([])
  const [offers, setOffers] = useState<Record<string, Offer[]>>({})
  const [loadingPos, setLoadingPos] = useState(true)
  const [viewingOffers, setViewingOffers] = useState<string|null>(null)
  const [acceptedOffers, setAcceptedOffers] = useState<Record<string,string>>({})
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(()=>{ setMounted(true); loadData() },[])

  async function loadData() {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        'https://efzszombcfxyyobqehyp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/register'; return }
      setUserName(user.user_metadata?.first_name || user.user_metadata?.business_name || user.email || '')
      const { data: poData } = await supabase.from('purchase_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setPos(poData || [])
      if (poData && poData.length > 0) {
        const offersMap: Record<string, Offer[]> = {}
        for (const po of poData) {
          const { data: offerData } = await supabase.from('funding_offers').select('*').eq('po_id', po.id).order('interest_rate', { ascending: true })
          offersMap[po.id] = offerData || []
        }
        setOffers(offersMap)
      }
    } catch(e) { console.log(e) }
    finally { setLoadingPos(false) }
  }

  async function handleAcceptOffer(poId: string, offerId: string) {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        'https://efzszombcfxyyobqehyp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
      )
      await supabase.from('funding_offers').update({ status: 'accepted' }).eq('id', offerId)
      await supabase.from('purchase_orders').update({ status: 'funded' }).eq('id', poId)
      const { data: offerData } = await supabase.from('funding_offers').select('*').eq('id', offerId).single()
      const { data: poData } = await supabase.from('purchase_orders').select('*').eq('id', poId).single()
      if (offerData && poData) {
        const { data: funderData } = await supabase.from('profiles').select('*').eq('id', offerData.funder_id).single()
        try {
          await fetch('/api/send-email', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'offer_accepted', to: funderData?.email || 'vsiphoesihle@gmail.com',
              data: { funderName: funderData?.first_name || 'Funder', poNumber: poData.po_number, businessName: poData.client_name, amount: `R ${offerData.amount.toLocaleString()}`, rate: `${offerData.interest_rate}%`, term: `${offerData.term_days} days`, commission: `R ${(offerData.amount * 0.02).toLocaleString()}` }
            })
          })
        } catch(e) { console.log('Email failed:', e) }

        // Notify supplier their offer was accepted
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          const { data: supplierProfile } = await supabase
            .from('profiles')
            .select('email, first_name, business_name')
            .eq('id', currentUser?.id)
            .single()

          if (supplierProfile) {
            await fetch('/api/send-email', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'offer_accepted_supplier',
                to: supplierProfile.email,
                data: {
                  name: supplierProfile.first_name || supplierProfile.business_name,
                  poNumber: poData.po_number,
                  amount: `R ${offerData.amount.toLocaleString()}`,
                  rate: `${offerData.interest_rate}%`,
                  term: `${offerData.term_days} days`,
                }
              })
            })
          }
        } catch(e) { console.log('Supplier accepted email failed:', e) }
      }
      setAcceptedOffers(prev => ({...prev, [poId]: offerId}))
      await loadData()
    } catch(e) { console.log(e) }
  }

  if (!mounted) return null

  const totalFunding = pos.reduce((sum, po) => sum + po.funding_needed, 0)
  const totalOffers = Object.values(offers).reduce((sum, arr) => sum + arr.length, 0)
  const fundedPos = pos.filter(p => p.status === 'funded').length

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      {/* NAV */}
      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',height:'65px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'48px',width:'auto',}}/>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'13px',background:'rgba(255,255,255,0.1)',color:'#fff',padding:'4px 12px',borderRadius:'99px'}}>🏢 Supplier Portal</span>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#0F6E56',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'600',color:'#fff'}}>
            {userName.slice(0,2).toUpperCase() || 'VS'}
          </div>
          <button onClick={handleSignOut}
            style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',padding:'7px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'960px',margin:'0 auto',padding:'2rem'}}>

        <div style={{marginBottom:'2rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>Welcome back, {userName}! 👋</h1>
          <p style={{fontSize:'14px',color:'#666'}}>What would you like to do today?</p>
        </div>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'2rem'}}>
              <a href="/upload" style={{textDecoration:'none'}}>
                <div style={{background:'#0F6E56',borderRadius:'16px',padding:'2rem',cursor:'pointer',height:'100%'}}>
                  <div style={{fontSize:'36px',marginBottom:'1rem'}}>💰</div>
                  <h2 style={{fontSize:'20px',fontWeight:'700',color:'#fff',marginBottom:'.5rem'}}>Apply for Funding</h2>
                  <p style={{fontSize:'13px',color:'#a8dfc9',lineHeight:'1.6',marginBottom:'1.5rem'}}>
                    Upload your purchase order and supplier quotation to get competitive funding offers.
                  </p>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.15)',padding:'8px 16px',borderRadius:'8px'}}>
                    <span style={{fontSize:'13px',color:'#fff',fontWeight:'600'}}>Start application →</span>
                  </div>
                </div>
              </a>
              <div onClick={()=>setActiveTab('status')} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'16px',padding:'2rem',cursor:'pointer',height:'100%'}}>
                <div style={{fontSize:'36px',marginBottom:'1rem'}}>📋</div>
                <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.5rem'}}>Check Status</h2>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.6',marginBottom:'1.5rem'}}>
                  Track your applications, view funding offers and accept the best deal.
                </p>
                <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#E1F5EE',padding:'8px 16px',borderRadius:'8px'}}>
                  <span style={{fontSize:'13px',color:'#0F6E56',fontWeight:'600'}}>View applications →</span>
                </div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'My applications', value:pos.length.toString(), color:'#0F6E56' },
                { label:'Offers received', value:totalOffers.toString(), color:'#633806' },
                { label:'Funded POs', value:fundedPos.toString(), color:'#0C447C' },
                { label:'Total funding sought', value:`R ${totalFunding.toLocaleString()}`, color:'#085041' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'22px',fontWeight:'700',color,marginBottom:'4px'}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>Recent applications</h2>
              {loadingPos && <p style={{fontSize:'14px',color:'#888'}}>Loading...</p>}
              {!loadingPos && pos.length === 0 && (
                <div style={{textAlign:'center',padding:'1.5rem'}}>
                  <p style={{fontSize:'14px',color:'#888',marginBottom:'1rem'}}>No applications yet</p>
                  <a href="/upload" style={{background:'#0F6E56',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'13px',textDecoration:'none',fontWeight:'600'}}>
                    Apply for funding →
                  </a>
                </div>
              )}
              {pos.slice(0,3).map((po,i)=>(
                <div key={po.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<2?'1px solid #f0f0f0':'none',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <p style={{fontSize:'14px',fontWeight:'600',color:'#1B2B4B'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</p>
                    <p style={{fontSize:'12px',color:'#666'}}>{po.client_name} — {po.sector}</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <StatusBadge status={po.status}/>
                    {(offers[po.id]||[]).length > 0 && (
                      <span style={{fontSize:'12px',color:'#0F6E56',fontWeight:'600'}}>💰 {(offers[po.id]||[]).length} offer{(offers[po.id]||[]).length>1?'s':''}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === 'status' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'8px'}}>
              <div>
                <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>My Funding Applications</h2>
                <p style={{fontSize:'13px',color:'#666'}}>View offers and accept the best funding deal</p>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setActiveTab('home')}
                  style={{fontSize:'13px',color:'#666',background:'#fff',border:'1px solid #e5e5e5',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                  ← Back
                </button>
                <a href="/upload" style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',textDecoration:'none',fontWeight:'600'}}>
                  + New application
                </a>
              </div>
            </div>

            {loadingPos && <p style={{fontSize:'14px',color:'#888'}}>Loading your applications...</p>}
            {!loadingPos && pos.length === 0 && (
              <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'16px',color:'#666',marginBottom:'.5rem'}}>No applications yet</p>
                <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>Submit your first PO to start receiving funding offers.</p>
                <a href="/upload" style={{background:'#0F6E56',color:'#fff',padding:'12px 24px',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'600'}}>
                  Apply for funding →
                </a>
              </div>
            )}

            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {pos.map(po=>{
                const poOffers = offers[po.id] || []
                const acceptedOffer = poOffers.find(o => o.status === 'accepted' || acceptedOffers[po.id] === o.id)
                return (
                  <div key={po.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</span>
                          <StatusBadge status={po.status}/>
                        </div>
                        <p style={{fontSize:'13px',color:'#666'}}>{po.client_name}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Dept: {po.client_department} • {po.sector}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>📅 {new Date(po.created_at).toLocaleDateString('en-ZA')}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'16px',fontWeight:'700',color:'#0F6E56'}}>R {po.po_value.toLocaleString()}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Funding: R {po.funding_needed.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                      {['Submitted','Under review','Offers received','Funded'].map((s,i)=>{
                        const statusIndex = ['reviewing','reviewing','active','funded'].indexOf(po.status)
                        const done = i <= statusIndex || po.status === 'funded'
                        const current = (po.status==='reviewing'&&i===1)||(po.status==='active'&&i===2)||(po.status==='funded'&&i===3)
                        return (
                          <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                            <div style={{width:'22px',height:'22px',borderRadius:'50%',background:done||current?'#0F6E56':'#e5e5e5',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',marginBottom:'4px',fontWeight:'600'}}>
                              {done?'✓':i+1}
                            </div>
                            <span style={{fontSize:'9px',color:current?'#0F6E56':'#888',textAlign:'center',whiteSpace:'nowrap',fontWeight:current?'600':'400'}}>{s}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        {poOffers.length > 0 && (
                          <span style={{fontSize:'12px',color:'#0F6E56',fontWeight:'600'}}>💰 {poOffers.length} offer{poOffers.length>1?'s':''} received</span>
                        )}
                      </div>
                      {poOffers.length > 0 && !acceptedOffer && (
                        <button onClick={()=>setViewingOffers(viewingOffers===po.id?null:po.id)}
                          style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}>
                          {viewingOffers===po.id ? 'Hide offers' : `View ${poOffers.length} offers`}
                        </button>
                      )}
                      {po.status==='reviewing'&&poOffers.length===0&&(
                        <span style={{fontSize:'12px',color:'#633806',background:'#FAEEDA',padding:'6px 12px',borderRadius:'8px',fontWeight:'500'}}>
                          ⏳ Being reviewed by funders
                        </span>
                      )}
                      {po.status==='funded'&&(
                        <span style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',padding:'6px 12px',borderRadius:'8px',fontWeight:'500'}}>
                          ✅ Successfully funded
                        </span>
                      )}
                    </div>

                    {acceptedOffer && (
                      <div style={{marginTop:'1rem',background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                        <div style={{fontSize:'32px',marginBottom:'.5rem'}}>🎉</div>
                        <p style={{fontSize:'16px',fontWeight:'700',color:'#085041',marginBottom:'.5rem'}}>Offer accepted!</p>
                        <p style={{fontSize:'13px',color:'#0F6E56'}}>
                          Funding of R {acceptedOffer.amount.toLocaleString()} at {acceptedOffer.interest_rate}% for {acceptedOffer.term_days} days will be processed within 24 hours.
                        </p>
                      </div>
                    )}

                    {viewingOffers===po.id&&poOffers.length>0&&!acceptedOffer&&(
                      <div style={{marginTop:'1.25rem'}}>
                        <p style={{fontSize:'14px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>Compare funding offers</p>
                        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                          {poOffers.map((offer,i)=>(
                            <div key={offer.id} style={{background:'#f9f9f9',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                  <span style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B'}}>Offer {i+1}</span>
                                  {i===0&&<span style={{background:'#E1F5EE',color:'#085041',fontSize:'11px',padding:'2px 8px',borderRadius:'99px',fontWeight:'600'}}>⭐ Best rate</span>}
                                </div>
                                <div style={{textAlign:'right'}}>
                                  <p style={{fontSize:'22px',fontWeight:'700',color:'#0F6E56'}}>{offer.interest_rate}%</p>
                                  <p style={{fontSize:'12px',color:'#888'}}>interest rate</p>
                                </div>
                              </div>
                              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',background:'#fff',borderRadius:'8px',padding:'12px',marginBottom:'1rem'}}>
                                {[['Amount',`R ${offer.amount.toLocaleString()}`],['Term',`${offer.term_days} days`],['Fee',`R ${(offer.amount*offer.interest_rate/100).toLocaleString()}`]].map(([l,v])=>(
                                  <div key={l} style={{textAlign:'center'}}>
                                    <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B'}}>{v}</p>
                                    <p style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{l}</p>
                                  </div>
                                ))}
                              </div>
                              <button onClick={()=>handleAcceptOffer(po.id,offer.id)}
                                style={{width:'100%',padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                                Accept this offer ✓
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
            <h2 style={{fontSize:'16px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>Business Profile</h2>
            <p style={{fontSize:'14px',color:'#666'}}>Profile details coming soon.</p>
          </div>
        )}

        {/* BOTTOM NAV */}
        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginTop:'2rem',width:'fit-content'}}>
          {(['home','status','profile'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'600',background:activeTab===t?'#0F6E56':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='home'?'🏠 Home':t==='status'?'📋 My Applications':'👤 Profile'}
            </button>
          ))}
        </div>

      </div>
    </main>
  )
}
