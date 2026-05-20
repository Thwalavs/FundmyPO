'use client'
import { useState, useEffect } from 'react'

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'

async function getSupabase() {
  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg:'#FAEEDA', color:'#633806', label:'Pending' },
    verified:  { bg:'#E1F5EE', color:'#085041', label:'Verified' },
    approved:  { bg:'#E1F5EE', color:'#085041', label:'Approved' },
    active:    { bg:'#E1F5EE', color:'#085041', label:'Active' },
    reviewing: { bg:'#FAEEDA', color:'#633806', label:'Under review' },
    funded:    { bg:'#E6F1FB', color:'#0C447C', label:'Funded' },
    paid:      { bg:'#E1F5EE', color:'#085041', label:'Paid' },
    rejected:  { bg:'#FEE2E2', color:'#DC2626', label:'Rejected' },
    accepted:  { bg:'#E1F5EE', color:'#085041', label:'Accepted' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'pos'|'offers'|'commissions'>('overview')
  const [mounted, setMounted] = useState(false)
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [adminName, setAdminName] = useState('Admin')
  const [users, setUsers] = useState<any[]>([])
  const [userStatuses, setUserStatuses] = useState<Record<string,string>>({})
  const [pos, setPos] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingPos, setLoadingPos] = useState(true)
  const [loadingOffers, setLoadingOffers] = useState(true)

  useEffect(()=>{
    setMounted(true)
    checkAdmin()
  },[])

  async function checkAdmin() {
    try {
      const supabase = await getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/register'; return }
      const userRole = user.user_metadata?.role
      if (userRole !== 'admin') { window.location.href = '/'; return }
      setAdminName(user.email || 'Admin')
      setAuthorized(true)
      setChecking(false)
      loadData()
    } catch(e) { window.location.href = '/register' }
  }

  async function loadData() {
    const supabase = await getSupabase()

    // Load users
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      })
      const data = await res.json()
      setUsers(data.users || [])

      // Load profile statuses
      const { data: profiles } = await supabase.from('profiles').select('id, status')
      if (profiles) {
        const statusMap: Record<string,string> = {}
        profiles.forEach((p: any) => { statusMap[p.id] = p.status })
        setUserStatuses(statusMap)
      }
    } catch(e) { console.log('Error loading users:', e) }
    finally { setLoadingUsers(false) }

    // Load POs
    try {
      const { data } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false })
      setPos(data || [])
    } catch(e) { console.log('Error loading POs:', e) }
    finally { setLoadingPos(false) }

    // Load offers
    try {
      const { data } = await supabase.from('funding_offers').select('*, purchase_orders(po_number, client_name)').order('created_at', { ascending: false })
      setOffers(data || [])
    } catch(e) { console.log('Error loading offers:', e) }
    finally { setLoadingOffers(false) }
  }

  async function handleApprove(userId: string) {
    try {
      const supabase = await getSupabase()
      await supabase.from('profiles').upsert({ id: userId, status: 'approved' })
      setUserStatuses(prev => ({...prev, [userId]: 'approved'}))
    } catch(e) { console.log(e) }
  }

  async function handleReject(userId: string) {
    try {
      const supabase = await getSupabase()
      await supabase.from('profiles').upsert({ id: userId, status: 'rejected' })
      setUserStatuses(prev => ({...prev, [userId]: 'rejected'}))
    } catch(e) { console.log(e) }
  }

  async function handleSignOut() {
    const supabase = await getSupabase()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!mounted || checking) {
    return (
      <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{fontSize:'16px',color:'#666'}}>Checking access...</p>
      </main>
    )
  }

  if (!authorized) {
    return (
      <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{fontSize:'16px',color:'#DC2626'}}>Access denied. Redirecting...</p>
      </main>
    )
  }

  const businessUsers = users.filter(u => u.user_metadata?.role === 'business')
  const funderUsers = users.filter(u => u.user_metadata?.role === 'funder')
  const pendingUsers = users.filter(u => u.user_metadata?.role !== 'admin' && (!userStatuses[u.id] || userStatuses[u.id] === 'pending'))
  const activePOs = pos.filter(p => p.status === 'reviewing' || p.status === 'active')
  const fundedPOs = pos.filter(p => p.status === 'funded')
  const acceptedOffers = offers.filter(o => o.status === 'accepted')
  const totalCommission = acceptedOffers.reduce((sum, o) => sum + (o.amount * 0.02), 0)

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      <nav style={{background:'#085041',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <span style={{fontSize:'20px',fontWeight:'500',color:'#fff'}}>
            Fund<span style={{color:'#5DCAA5'}}>MyPO</span>
          </span>
          <span style={{fontSize:'12px',color:'#a8dfc9',marginLeft:'12px',background:'rgba(255,255,255,0.15)',padding:'3px 10px',borderRadius:'99px'}}>
            Admin Portal
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'13px',color:'#a8dfc9'}}>{adminName}</span>
          <button onClick={handleSignOut}
            style={{fontSize:'13px',color:'#fff',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2rem'}}>

        <div style={{marginBottom:'2rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'500',marginBottom:'.25rem'}}>Admin Dashboard</h1>
          <p style={{fontSize:'14px',color:'#666'}}>Manage users, POs and commissions for FundMyPO</p>
        </div>

        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'2rem',flexWrap:'wrap'}}>
          {(['overview','users','pos','offers','commissions'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'500',background:activeTab===t?'#085041':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='overview'?'Overview':t==='users'?`Users (${users.filter(u=>u.user_metadata?.role!=='admin').length})`:t==='pos'?`POs (${pos.length})`:t==='offers'?`Offers (${offers.length})`:'Commissions'}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px',marginBottom:'2rem'}}>
              {[
                { label:'Total users', value:users.filter(u=>u.user_metadata?.role!=='admin').length.toString(), color:'#085041' },
                { label:'Businesses', value:businessUsers.length.toString(), color:'#0F6E56' },
                { label:'Funders', value:funderUsers.length.toString(), color:'#0C447C' },
                { label:'Pending approvals', value:pendingUsers.length.toString(), color:'#633806' },
                { label:'Total POs', value:pos.length.toString(), color:'#633806' },
                { label:'Funded POs', value:fundedPOs.length.toString(), color:'#085041' },
                { label:'Total offers', value:offers.length.toString(), color:'#633806' },
                { label:'Commission earned', value:`R ${totalCommission.toLocaleString()}`, color:'#0F6E56' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'20px',fontWeight:'500',color}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
                </div>
              ))}
            </div>

            {/* PENDING APPROVALS */}
            {pendingUsers.length > 0 && (
              <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>⏳ Pending User Approvals ({pendingUsers.length})</h2>
                {pendingUsers.map(user=>(
                  <div key={user.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f0f0f0',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <p style={{fontSize:'14px',fontWeight:'500'}}>{user.user_metadata?.business_name || user.user_metadata?.first_name+' '+user.user_metadata?.last_name}</p>
                      <p style={{fontSize:'12px',color:'#666'}}>{user.email}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>{user.user_metadata?.role === 'funder' ? '💰 Funder' : '🏢 Business'} — Joined {new Date(user.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={()=>handleApprove(user.id)}
                        style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                        Approve ✓
                      </button>
                      <button onClick={()=>handleReject(user.id)}
                        style={{fontSize:'13px',color:'#DC2626',background:'#FEE2E2',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                        Reject ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RECENT POs */}
            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>Recent PO Submissions</h2>
              {loadingPos && <p style={{fontSize:'14px',color:'#888'}}>Loading...</p>}
              {!loadingPos && pos.length === 0 && <p style={{fontSize:'14px',color:'#888'}}>No POs submitted yet</p>}
              {pos.slice(0,5).map(po=>(
                <div key={po.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0f0f0',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
                      <span style={{fontSize:'14px',fontWeight:'500'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</span>
                      <StatusBadge status={po.status}/>
                    </div>
                    <p style={{fontSize:'12px',color:'#666'}}>{po.client_name} • {po.sector}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'14px',fontWeight:'500',color:'#0F6E56'}}>R {po.po_value?.toLocaleString()}</p>
                    <p style={{fontSize:'12px',color:'#888'}}>{new Date(po.created_at).toLocaleDateString('en-ZA')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RECENT USERS */}
            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>Recent Registrations</h2>
              {loadingUsers && <p style={{fontSize:'14px',color:'#888'}}>Loading...</p>}
              {users.filter(u=>u.user_metadata?.role!=='admin').slice(0,5).map(user=>(
                <div key={user.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0f0f0',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <p style={{fontSize:'14px',fontWeight:'500'}}>{user.user_metadata?.business_name || user.user_metadata?.first_name+' '+user.user_metadata?.last_name || user.email}</p>
                    <p style={{fontSize:'12px',color:'#666'}}>{user.email}</p>
                    <p style={{fontSize:'11px',color:'#888'}}>{user.user_metadata?.role === 'funder' ? '💰 Funder' : '🏢 Business'}</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <StatusBadge status={userStatuses[user.id] || 'pending'}/>
                    <p style={{fontSize:'12px',color:'#888'}}>{new Date(user.created_at).toLocaleDateString('en-ZA')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'8px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'500'}}>All Users</h2>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <span style={{fontSize:'13px',background:'#E1F5EE',color:'#085041',padding:'4px 12px',borderRadius:'99px'}}>{businessUsers.length} businesses</span>
                <span style={{fontSize:'13px',background:'#E6F1FB',color:'#0C447C',padding:'4px 12px',borderRadius:'99px'}}>{funderUsers.length} funders</span>
                <span style={{fontSize:'13px',background:'#FAEEDA',color:'#633806',padding:'4px 12px',borderRadius:'99px'}}>{pendingUsers.length} pending</span>
              </div>
            </div>
            {loadingUsers && <p style={{fontSize:'14px',color:'#888'}}>Loading users...</p>}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {users.filter(u=>u.user_metadata?.role!=='admin').map(user=>{
                const currentStatus = userStatuses[user.id] || 'pending'
                const role = user.user_metadata?.role
                return (
                  <div key={user.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'15px',fontWeight:'500'}}>{user.user_metadata?.business_name || (user.user_metadata?.first_name+' '+user.user_metadata?.last_name) || 'Unknown'}</span>
                          <StatusBadge status={currentStatus}/>
                          <span style={{fontSize:'12px',color:'#666',background:'#f5f5f5',padding:'2px 8px',borderRadius:'99px'}}>
                            {role === 'funder' ? '💰 Funder' : '🏢 Business'}
                          </span>
                        </div>
                        <p style={{fontSize:'13px',color:'#666'}}>{user.email}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Phone: {user.user_metadata?.phone || 'N/A'}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Reg: {user.user_metadata?.company_reg || 'N/A'}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Joined: {new Date(user.created_at).toLocaleDateString('en-ZA')}</p>
                      </div>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        <button
                          onClick={async()=>{
                            const supabase = await getSupabase()
                            const { data: files } = await supabase.storage.from('verification-docs').list(user.id)
                            if (!files || files.length === 0) { alert('No documents uploaded yet.'); return }
                            const file = files[0]
                            const { data } = await supabase.storage.from('verification-docs').createSignedUrl(`${user.id}/${file.name}`, 3600)
                            if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                          }}
                          style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                          View docs
                        </button>
                        {currentStatus === 'pending' && (
                          <>
                            <button onClick={()=>handleApprove(user.id)}
                              style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              Approve ✓
                            </button>
                            <button onClick={()=>handleReject(user.id)}
                              style={{fontSize:'12px',color:'#DC2626',background:'#FEE2E2',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              Reject ✗
                            </button>
                          </>
                        )}
                        {currentStatus === 'approved' && (
                          <span style={{fontSize:'12px',color:'#085041',background:'#E1F5EE',padding:'6px 12px',borderRadius:'6px',fontWeight:'500'}}>✓ Approved</span>
                        )}
                        {currentStatus === 'rejected' && (
                          <button onClick={()=>handleApprove(user.id)}
                            style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                            Re-approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* POs */}
        {activeTab === 'pos' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'8px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'500'}}>All Purchase Orders</h2>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <span style={{fontSize:'13px',background:'#FAEEDA',color:'#633806',padding:'4px 12px',borderRadius:'99px'}}>{activePOs.length} active</span>
                <span style={{fontSize:'13px',background:'#E6F1FB',color:'#0C447C',padding:'4px 12px',borderRadius:'99px'}}>{fundedPOs.length} funded</span>
              </div>
            </div>
            {loadingPos && <p style={{fontSize:'14px',color:'#888'}}>Loading POs...</p>}
            {!loadingPos && pos.length === 0 && (
              <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'16px',color:'#666'}}>No purchase orders yet</p>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {pos.map(po=>(
                <div key={po.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</span>
                        <StatusBadge status={po.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{po.client_name}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>{po.sector} • {po.client_department}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Supplier: {po.supplier_name}</p>
                      <p style={{fontSize:'11px',color:'#888'}}>📅 {new Date(po.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'16px',fontWeight:'500',color:'#0F6E56'}}>R {po.po_value?.toLocaleString()}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Funding: R {po.funding_needed?.toLocaleString()}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Quote: R {po.quotation_value?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    <button onClick={async()=>{
                      const supabase = await getSupabase()
                      const { data: files } = await supabase.storage.from('verification-docs').list(po.user_id)
                      if (!files || files.length === 0) { alert('No documents uploaded yet.'); return }
                      const poDoc = files.find((f:any) => f.name.startsWith('po-'+po.id))
                      if (!poDoc) { alert('PO document not found.'); return }
                      const { data } = await supabase.storage.from('verification-docs').createSignedUrl(`${po.user_id}/${poDoc.name}`, 3600)
                      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                    }} style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                      View PO doc
                    </button>
                    <button onClick={async()=>{
                      const supabase = await getSupabase()
                      const { data: files } = await supabase.storage.from('verification-docs').list(po.user_id)
                      if (!files || files.length === 0) { alert('No documents uploaded yet.'); return }
                      const quoteDoc = files.find((f:any) => f.name.startsWith('quotation-'+po.id))
                      if (!quoteDoc) { alert('Quotation document not found.'); return }
                      const { data } = await supabase.storage.from('verification-docs').createSignedUrl(`${po.user_id}/${quoteDoc.name}`, 3600)
                      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                    }} style={{fontSize:'12px',color:'#085041',background:'#E1F5EE',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                      View quotation
                    </button>
                    {po.status === 'reviewing' && (
                      <button onClick={async()=>{
                        const supabase = await getSupabase()
                        await supabase.from('purchase_orders').update({ status: 'active' }).eq('id', po.id)
                        loadData()
                      }} style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                        Approve PO ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFERS */}
        {activeTab === 'offers' && (
          <div>
            <h2 style={{fontSize:'18px',fontWeight:'500',marginBottom:'1rem'}}>All Funding Offers</h2>
            {loadingOffers && <p style={{fontSize:'14px',color:'#888'}}>Loading offers...</p>}
            {!loadingOffers && offers.length === 0 && (
              <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'16px',color:'#666'}}>No offers submitted yet</p>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {offers.map(offer=>(
                <div key={offer.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{offer.purchase_orders?.po_number || 'PO'}</span>
                        <StatusBadge status={offer.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>Client: {offer.purchase_orders?.client_name}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Rate: {offer.interest_rate}% • Term: {offer.term_days} days</p>
                      <p style={{fontSize:'11px',color:'#888'}}>📅 {new Date(offer.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'16px',fontWeight:'500',color:'#0F6E56'}}>R {offer.amount?.toLocaleString()}</p>
                      <p style={{fontSize:'12px',color:'#DC2626'}}>Commission: R {(offer.amount * 0.02).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMISSIONS */}
        {activeTab === 'commissions' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'2rem'}}>
              <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#0F6E56'}}>R {totalCommission.toLocaleString()}</p>
                <p style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>Total commission (2%)</p>
              </div>
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#085041'}}>{acceptedOffers.length}</p>
                <p style={{fontSize:'12px',color:'#0F6E56',marginTop:'4px'}}>Accepted deals</p>
              </div>
              <div style={{background:'#FAEEDA',border:'1px solid #F5D87A',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#633806'}}>{offers.filter(o=>o.status==='pending').length}</p>
                <p style={{fontSize:'12px',color:'#633806',marginTop:'4px'}}>Pending offers</p>
              </div>
            </div>
            <h2 style={{fontSize:'18px',fontWeight:'500',marginBottom:'1rem'}}>Commission Breakdown</h2>
            {acceptedOffers.length === 0 && (
              <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>
                <p style={{fontSize:'16px',color:'#666'}}>No accepted offers yet</p>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {acceptedOffers.map(offer=>(
                <div key={offer.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'14px',fontWeight:'500'}}>{offer.purchase_orders?.po_number || 'PO'}</span>
                        <StatusBadge status={offer.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{offer.purchase_orders?.client_name}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>📅 {new Date(offer.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>R {(offer.amount * 0.02).toLocaleString()}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>2% of R {offer.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}