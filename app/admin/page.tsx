'use client'
import { useState, useEffect } from 'react'

type Profile = {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  business_name: string
  phone: string
  company_reg: string
  status: string
  created_at: string
}

type Deal = {
  id: string
  po_id: string
  offer_id: string
  funder_id: string
  supplier_id: string
  amount: number
  interest_rate: number
  term_days: number
  status: string
  created_at: string
  purchase_orders?: any
  funding_offers?: any
}

type PO = {
  id: string
  user_id: string
  po_number: string
  client_name: string
  client_department: string
  po_value: number
  funding_needed: number
  sector: string
  status: string
  created_at: string
}

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'

async function getSupabase() {
  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}

async function downloadDoc(userId: string, docPath: string) {
  const supabase = await getSupabase()
  const { data: files, error } = await supabase.storage.from('verification-docs').list(userId)
  if (error || !files || files.length === 0) {
    alert('No documents found for this user.')
    return
  }
  const matchedFile = files.find(f =>
    f.name === `${docPath}.pdf` ||
    f.name === `${docPath}.jpg` ||
    f.name === `${docPath}.jpeg` ||
    f.name === `${docPath}.png` ||
    f.name.startsWith(docPath) ||
    f.name.includes(docPath)
  )
  if (!matchedFile) {
    const available = files.map(f => f.name).join(', ')
    alert(`Document "${docPath}" not found.\n\nAvailable files: ${available}`)
    return
  }
  const { data: signedData } = await supabase.storage
    .from('verification-docs')
    .createSignedUrl(`${userId}/${matchedFile.name}`, 3600)
  if (signedData?.signedUrl) {
    window.open(signedData.signedUrl, '_blank')
  } else {
    alert('Could not generate download link. Please try again.')
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'pos' | 'deals'>('dashboard')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [pos, setPos] = useState<PO[]>([])
  const [loading, setLoading] = useState(true)
  const [dealsLoading, setDealsLoading] = useState(true)
  const [posLoading, setPosLoading] = useState(true)
  const [userTab, setUserTab] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending')
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [selectedPO, setSelectedPO] = useState<PO | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingStatus, setEditingStatus] = useState<string | null>(null)

  useEffect(() => { setMounted(true); loadAll() }, [])

  async function loadAll() {
    await Promise.all([loadProfiles(), loadDeals(), loadPOs()])
  }

  async function loadProfiles() {
    setLoading(true)
    try {
      const supabase = await getSupabase()
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setProfiles(data || [])
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function loadDeals() {
    setDealsLoading(true)
    try {
      const supabase = await getSupabase()
      const { data } = await supabase
        .from('deal_approvals')
        .select('*, purchase_orders(*), funding_offers(*)')
        .order('created_at', { ascending: false })
      setDeals(data || [])
    } catch(e) { console.error(e) }
    finally { setDealsLoading(false) }
  }

  async function loadPOs() {
    setPosLoading(true)
    try {
      const supabase = await getSupabase()
      const { data } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false })
      setPos(data || [])
    } catch(e) { console.error(e) }
    finally { setPosLoading(false) }
  }

  async function updateUserStatus(profileId: string, status: 'approved' | 'declined' | 'pending') {
    setActionLoading(profileId)
    try {
      const supabase = await getSupabase()
      await supabase.from('profiles').update({ status }).eq('id', profileId)
      const profile = profiles.find(p => p.id === profileId)
      if (profile && status !== 'pending') {
        try {
          await fetch('/api/send-email', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: status === 'approved' ? 'account_approved' : 'account_declined',
              to: profile.email,
              data: { name: profile.first_name || profile.business_name, businessName: profile.business_name, role: profile.role }
            })
          })
        } catch(e) { console.log('Email failed:', e) }
      }
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status } : p))
      setSelectedProfile(prev => prev?.id === profileId ? { ...prev, status } : prev)
      setEditingStatus(null)
    } catch(e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  async function updateDealStatus(deal: Deal, status: 'approved' | 'declined') {
    setActionLoading(deal.id)
    try {
      const supabase = await getSupabase()
      await supabase.from('deal_approvals').update({ status }).eq('id', deal.id)
      if (status === 'approved') {
        await supabase.from('funding_offers').update({ status: 'accepted' }).eq('id', deal.offer_id)
        await supabase.from('purchase_orders').update({ status: 'funded' }).eq('id', deal.po_id)
        const { data: funderProfile } = await supabase.from('profiles').select('*').eq('id', deal.funder_id).single()
        const po = deal.purchase_orders
        try {
          await fetch('/api/send-email', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'deal_approved_funder',
              to: funderProfile?.email,
              data: {
                name: funderProfile?.first_name || funderProfile?.business_name || 'Funder',
                poNumber: po?.po_number, clientName: po?.client_name,
                amount: `R ${deal.amount.toLocaleString()}`,
                rate: `${deal.interest_rate}%`, term: `${deal.term_days} days`,
                commission: `R ${(deal.amount * 0.02).toLocaleString()}`,
              }
            })
          })
        } catch(e) { console.log('Funder email failed:', e) }
      } else {
        await supabase.from('funding_offers').update({ status: 'pending' }).eq('id', deal.offer_id)
        await supabase.from('purchase_orders').update({ status: 'active' }).eq('id', deal.po_id)
        const { data: supplierProfile } = await supabase.from('profiles').select('*').eq('id', deal.supplier_id).single()
        try {
          await fetch('/api/send-email', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'deal_declined_supplier',
              to: supplierProfile?.email,
              data: { name: supplierProfile?.first_name || supplierProfile?.business_name || 'Supplier', poNumber: deal.purchase_orders?.po_number }
            })
          })
        } catch(e) { console.log('Supplier email failed:', e) }
      }
      await loadDeals()
      await loadPOs()
    } catch(e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  async function handleSignOut() {
    const supabase = await getSupabase()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!mounted) return null

  const filteredUsers = profiles.filter(p => {
    const matchesTab = userTab === 'all' || p.status === userTab
    const matchesSearch = !searchQuery ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const userCounts = {
    pending: profiles.filter(p => p.status === 'pending').length,
    approved: profiles.filter(p => p.status === 'approved').length,
    declined: profiles.filter(p => p.status === 'declined').length,
    all: profiles.length,
  }

  const totalFunding = deals.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0)
  const pendingDeals = deals.filter(d => d.status === 'pending_admin').length
  const totalSuppliers = profiles.filter(p => p.role === 'business').length
  const totalFunders = profiles.filter(p => p.role === 'funder').length
  const totalPOs = pos.length
  const fundedPOs = pos.filter(p => p.status === 'funded').length

  const statusBadge = (status: string) => {
    const styles: Record<string, {bg: string, color: string, label: string}> = {
      pending:       { bg:'#FEF3C7', color:'#92400E', label:'Pending' },
      pending_admin: { bg:'#FEF3C7', color:'#92400E', label:'Pending Approval' },
      approved:      { bg:'#D1FAE5', color:'#065F46', label:'Approved' },
      declined:      { bg:'#FEE2E2', color:'#991B1B', label:'Declined' },
      reviewing:     { bg:'#E6F1FB', color:'#0C447C', label:'Reviewing' },
      funded:        { bg:'#D1FAE5', color:'#065F46', label:'Funded' },
      active:        { bg:'#E1F5EE', color:'#085041', label:'Active' },
    }
    const s = styles[status] || { bg:'#f3f4f6', color:'#6b7280', label: status }
    return <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'600'}}>{s.label}</span>
  }

  return (
    <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5'}}>

      {/* NAV */}
      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',height:'65px'}}>
        <a href="/admin" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'48px',width:'auto'}}/>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'13px',background:'rgba(255,77,77,0.2)',color:'#ff6b6b',padding:'4px 12px',borderRadius:'99px',fontWeight:'600'}}>
            Admin Panel
          </span>
          <button onClick={()=>loadAll()}
            style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',padding:'7px 14px',borderRadius:'8px',cursor:'pointer'}}>
            Refresh
          </button>
          <button onClick={handleSignOut}
            style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',padding:'7px 14px',borderRadius:'8px',cursor:'pointer'}}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2rem'}}>

        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontSize:'24px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.25rem'}}>Admin Panel</h1>
          <p style={{fontSize:'14px',color:'#666'}}>Manage users, purchase orders and funding deals.</p>
        </div>

        {/* MAIN TABS */}
        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'2rem',width:'fit-content'}}>
          {(['dashboard','users','pos','deals'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'600',
                background:activeTab===t?'#1B2B4B':'transparent',
                color:activeTab===t?'#fff':'#666',position:'relative'}}>
              {t === 'dashboard' ? 'Dashboard' : t === 'users' ? `Users (${profiles.length})` : t === 'pos' ? `POs (${totalPOs})` : `Deals (${deals.length})`}
              {t === 'users' && userCounts.pending > 0 && (
                <span style={{position:'absolute',top:'-4px',right:'-4px',background:'#DC2626',color:'#fff',borderRadius:'99px',fontSize:'10px',fontWeight:'700',padding:'2px 6px'}}>
                  {userCounts.pending}
                </span>
              )}
              {t === 'deals' && pendingDeals > 0 && (
                <span style={{position:'absolute',top:'-4px',right:'-4px',background:'#DC2626',color:'#fff',borderRadius:'99px',fontSize:'10px',fontWeight:'700',padding:'2px 6px'}}>
                  {pendingDeals}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{fontSize:'18px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>Platform Overview</h2>

            {/* STATS GRID */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'Total Users', value:profiles.length, color:'#1B2B4B', bg:'#EEF2FF', sub:'All registered users' },
                { label:'Suppliers', value:totalSuppliers, color:'#085041', bg:'#E1F5EE', sub:'Registered SMEs' },
                { label:'Funders', value:totalFunders, color:'#0C447C', bg:'#E6F1FB', sub:'Registered funders' },
                { label:'Pending Users', value:userCounts.pending, color:'#92400E', bg:'#FEF3C7', sub:'Awaiting approval' },
                { label:'Total POs', value:totalPOs, color:'#633806', bg:'#FAEEDA', sub:'All purchase orders' },
                { label:'Funded POs', value:fundedPOs, color:'#065F46', bg:'#D1FAE5', sub:'Successfully funded' },
                { label:'Pending Deals', value:pendingDeals, color:'#92400E', bg:'#FEF3C7', sub:'Awaiting approval' },
                { label:'Total Funded', value:`R ${totalFunding.toLocaleString()}`, color:'#085041', bg:'#E1F5EE', sub:'Capital deployed' },
              ].map(({label,value,color,bg,sub})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'24px',fontWeight:'700',color,marginBottom:'4px'}}>{value}</div>
                  <div style={{fontSize:'13px',fontWeight:'600',color:'#1B2B4B',marginBottom:'2px'}}>{label}</div>
                  <div style={{fontSize:'11px',color:'#888'}}>{sub}</div>
                </div>
              ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>

              {/* RECENT REGISTRATIONS */}
              <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <h3 style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B'}}>Recent Registrations</h3>
                  <button onClick={()=>setActiveTab('users')}
                    style={{fontSize:'12px',color:'#0F6E56',background:'none',border:'none',cursor:'pointer',fontWeight:'600'}}>
                    View all
                  </button>
                </div>
                {profiles.slice(0,5).map((p,i)=>(
                  <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<4?'1px solid #f0f0f0':'none'}}>
                    <div>
                      <p style={{fontSize:'13px',fontWeight:'600',color:'#1B2B4B'}}>{p.business_name || p.first_name || p.email}</p>
                      <p style={{fontSize:'11px',color:'#888'}}>{p.role === 'funder' ? 'Funder' : 'Supplier'} • {new Date(p.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                ))}
              </div>

              {/* RECENT POs */}
              <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <h3 style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B'}}>Recent Purchase Orders</h3>
                  <button onClick={()=>setActiveTab('pos')}
                    style={{fontSize:'12px',color:'#0F6E56',background:'none',border:'none',cursor:'pointer',fontWeight:'600'}}>
                    View all
                  </button>
                </div>
                {posLoading && <p style={{fontSize:'13px',color:'#888'}}>Loading...</p>}
                {pos.slice(0,5).map((po,i)=>(
                  <div key={po.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<4?'1px solid #f0f0f0':'none'}}>
                    <div>
                      <p style={{fontSize:'13px',fontWeight:'600',color:'#1B2B4B'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</p>
                      <p style={{fontSize:'11px',color:'#888'}}>{po.client_name} • R {po.po_value.toLocaleString()}</p>
                    </div>
                    {statusBadge(po.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'Pending Review', value:userCounts.pending, color:'#92400E' },
                { label:'Approved', value:userCounts.approved, color:'#065F46' },
                { label:'Declined', value:userCounts.declined, color:'#991B1B' },
                { label:'Total Users', value:userCounts.all, color:'#1B2B4B' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'28px',fontWeight:'700',color,marginBottom:'4px'}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{marginBottom:'1rem'}}>
              <input type="text" placeholder="Search by name, email or business..."
                value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                style={{width:'100%',maxWidth:'400px',padding:'10px 14px',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',outline:'none'}}/>
            </div>

            <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'1.5rem',width:'fit-content'}}>
              {(['pending','approved','declined','all'] as const).map(t=>(
                <button key={t} onClick={()=>setUserTab(t)}
                  style={{padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'600',
                    background:userTab===t?'#1B2B4B':'transparent',color:userTab===t?'#fff':'#666'}}>
                  {t.charAt(0).toUpperCase()+t.slice(1)} ({userCounts[t]})
                </button>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',overflow:'hidden'}}>
              {loading ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888'}}>Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888'}}>No users found.</div>
              ) : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e5e5'}}>
                      {['Name / Business','Email','Role','Status','Registered','Actions'].map(h=>(
                        <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'12px',fontWeight:'600',color:'#888',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((profile, i) => (
                      <tr key={profile.id} style={{borderBottom:'1px solid #f0f0f0',background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={{padding:'14px 16px'}}>
                          <p style={{fontSize:'14px',fontWeight:'600',color:'#1B2B4B',marginBottom:'2px'}}>
                            {profile.first_name ? `${profile.first_name} ${profile.last_name}` : '—'}
                          </p>
                          <p style={{fontSize:'12px',color:'#888'}}>{profile.business_name || '—'}</p>
                        </td>
                        <td style={{padding:'14px 16px',fontSize:'13px',color:'#444'}}>{profile.email}</td>
                        <td style={{padding:'14px 16px'}}>
                          <span style={{background:profile.role==='funder'?'#E6F1FB':'#E1F5EE',color:profile.role==='funder'?'#0C447C':'#085041',padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'600'}}>
                            {profile.role === 'funder' ? 'Funder' : 'Supplier'}
                          </span>
                        </td>
                        <td style={{padding:'14px 16px'}}>{statusBadge(profile.status)}</td>
                        <td style={{padding:'14px 16px',fontSize:'12px',color:'#888'}}>
                          {new Date(profile.created_at).toLocaleDateString('en-ZA')}
                        </td>
                        <td style={{padding:'14px 16px'}}>
                          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                            <button onClick={()=>setSelectedProfile(profile)}
                              style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'5px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                              View docs
                            </button>
                            {profile.status !== 'approved' && (
                              <button onClick={()=>updateUserStatus(profile.id, 'approved')}
                                disabled={actionLoading === profile.id}
                                style={{fontSize:'12px',color:'#065F46',background:'#D1FAE5',border:'none',padding:'5px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                                {actionLoading === profile.id ? '...' : 'Approve'}
                              </button>
                            )}
                            {profile.status !== 'declined' && (
                              <button onClick={()=>updateUserStatus(profile.id, 'declined')}
                                disabled={actionLoading === profile.id}
                                style={{fontSize:'12px',color:'#991B1B',background:'#FEE2E2',border:'none',padding:'5px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                                {actionLoading === profile.id ? '...' : 'Decline'}
                              </button>
                            )}
                            {profile.status !== 'pending' && (
                              <button onClick={()=>updateUserStatus(profile.id, 'pending')}
                                disabled={actionLoading === profile.id}
                                style={{fontSize:'12px',color:'#92400E',background:'#FEF3C7',border:'none',padding:'5px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                                {actionLoading === profile.id ? '...' : 'Set pending'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* POs TAB */}
        {activeTab === 'pos' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'Total POs', value:pos.length, color:'#1B2B4B' },
                { label:'Under Review', value:pos.filter(p=>p.status==='reviewing').length, color:'#633806' },
                { label:'Active', value:pos.filter(p=>p.status==='active').length, color:'#085041' },
                { label:'Funded', value:pos.filter(p=>p.status==='funded').length, color:'#065F46' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'28px',fontWeight:'700',color,marginBottom:'4px'}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',overflow:'hidden'}}>
              {posLoading ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888'}}>Loading purchase orders...</div>
              ) : pos.length === 0 ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888'}}>No purchase orders yet.</div>
              ) : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e5e5'}}>
                      {['PO Number','Client','Sector','PO Value','Funding Needed','Status','Submitted','Actions'].map(h=>(
                        <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'12px',fontWeight:'600',color:'#888',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pos.map((po,i)=>(
                      <tr key={po.id} style={{borderBottom:'1px solid #f0f0f0',background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={{padding:'14px 16px',fontSize:'14px',fontWeight:'600',color:'#1B2B4B'}}>{po.po_number || 'PO-'+po.id.slice(0,8)}</td>
                        <td style={{padding:'14px 16px'}}>
                          <p style={{fontSize:'13px',fontWeight:'600',color:'#1B2B4B'}}>{po.client_name}</p>
                          <p style={{fontSize:'11px',color:'#888'}}>{po.client_department}</p>
                        </td>
                        <td style={{padding:'14px 16px',fontSize:'13px',color:'#444'}}>{po.sector}</td>
                        <td style={{padding:'14px 16px',fontSize:'13px',fontWeight:'600',color:'#0F6E56'}}>R {po.po_value.toLocaleString()}</td>
                        <td style={{padding:'14px 16px',fontSize:'13px',color:'#444'}}>R {po.funding_needed.toLocaleString()}</td>
                        <td style={{padding:'14px 16px'}}>{statusBadge(po.status)}</td>
                        <td style={{padding:'14px 16px',fontSize:'12px',color:'#888'}}>{new Date(po.created_at).toLocaleDateString('en-ZA')}</td>
                        <td style={{padding:'14px 16px'}}>
                          <button onClick={()=>setSelectedPO(po)}
                            style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'5px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                            View docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* DEALS TAB */}
        {activeTab === 'deals' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'Pending Approval', value:deals.filter(d=>d.status==='pending_admin').length, color:'#92400E' },
                { label:'Approved Deals', value:deals.filter(d=>d.status==='approved').length, color:'#065F46' },
                { label:'Declined Deals', value:deals.filter(d=>d.status==='declined').length, color:'#991B1B' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'28px',fontWeight:'700',color,marginBottom:'4px'}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {dealsLoading ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>Loading deals...</div>
              ) : deals.length === 0 ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888',background:'#fff',borderRadius:'12px',border:'1px solid #e5e5e5'}}>No deals yet.</div>
              ) : deals.map(deal => {
                const po = deal.purchase_orders
                const isPending = deal.status === 'pending_admin'
                return (
                  <div key={deal.id} style={{background:'#fff',border:isPending?'2px solid #F59E0B':'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem',marginBottom:'1rem'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                          <span style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B'}}>{po?.po_number || 'PO'}</span>
                          {statusBadge(deal.status)}
                        </div>
                        <p style={{fontSize:'13px',color:'#666',marginBottom:'2px'}}>Client: {po?.client_name}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>Sector: {po?.sector}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>{new Date(deal.created_at).toLocaleDateString('en-ZA')}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'20px',fontWeight:'700',color:'#0F6E56'}}>R {deal.amount.toLocaleString()}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>at {deal.interest_rate}% • {deal.term_days} days</p>
                        <p style={{fontSize:'12px',color:'#DC2626',fontWeight:'600'}}>Commission: R {(deal.amount * 0.02).toLocaleString()}</p>
                        <p style={{fontSize:'12px',color:'#0F6E56',fontWeight:'600'}}>Interest: R {(deal.amount * deal.interest_rate / 100).toLocaleString()}</p>
                      </div>
                    </div>

                    {isPending && (
                      <div style={{background:'#FEF3C7',borderRadius:'8px',padding:'1rem',marginBottom:'1rem',border:'1px solid #F59E0B'}}>
                        <p style={{fontSize:'13px',fontWeight:'700',color:'#92400E',marginBottom:'4px'}}>Action required</p>
                        <p style={{fontSize:'12px',color:'#92400E'}}>The supplier has accepted a funding offer. Approve to notify the funder to disburse funds, or decline to send the deal back.</p>
                      </div>
                    )}

                    {isPending && (
                      <div style={{display:'flex',gap:'10px'}}>
                        <button onClick={()=>updateDealStatus(deal, 'approved')}
                          disabled={actionLoading === deal.id}
                          style={{flex:1,padding:'11px',background:'#0F6E56',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                          {actionLoading === deal.id ? 'Processing...' : 'Approve & Notify Funder'}
                        </button>
                        <button onClick={()=>updateDealStatus(deal, 'declined')}
                          disabled={actionLoading === deal.id}
                          style={{flex:1,padding:'11px',background:'#DC2626',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                          {actionLoading === deal.id ? 'Processing...' : 'Decline Deal'}
                        </button>
                      </div>
                    )}

                    {deal.status === 'approved' && (
                      <div style={{background:'#D1FAE5',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#065F46',fontWeight:'600'}}>
                        Deal approved — Funder has been notified to disburse funds.
                      </div>
                    )}
                    {deal.status === 'declined' && (
                      <div style={{background:'#FEE2E2',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#991B1B',fontWeight:'600'}}>
                        Deal declined — Supplier has been notified.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* USER PROFILE MODAL */}
      {selectedProfile && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'580px',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{fontSize:'18px',fontWeight:'700',color:'#1B2B4B'}}>User Details</h2>
              <button onClick={()=>{ setSelectedProfile(null); setEditingStatus(null) }}
                style={{background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#888'}}>x</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
              {[
                ['Name', `${selectedProfile.first_name || ''} ${selectedProfile.last_name || ''}`],
                ['Email', selectedProfile.email],
                ['Business', selectedProfile.business_name || '—'],
                ['Role', selectedProfile.role === 'funder' ? 'Funder' : 'Supplier'],
                ['Phone', selectedProfile.phone || '—'],
                ['Company Reg', selectedProfile.company_reg || '—'],
                ['Registered', new Date(selectedProfile.created_at).toLocaleDateString('en-ZA')],
              ].map(([label, value]) => (
                <div key={label} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px'}}>
                  <p style={{fontSize:'11px',color:'#888',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'4px'}}>{label}</p>
                  <p style={{fontSize:'13px',color:'#1B2B4B',fontWeight:'600'}}>{value}</p>
                </div>
              ))}
              <div style={{background:'#f9fafb',borderRadius:'8px',padding:'12px'}}>
                <p style={{fontSize:'11px',color:'#888',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'4px'}}>Status</p>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  {statusBadge(selectedProfile.status)}
                  <button onClick={()=>setEditingStatus(editingStatus ? null : selectedProfile.id)}
                    style={{fontSize:'11px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'3px 8px',borderRadius:'4px',cursor:'pointer',fontWeight:'600'}}>
                    Change
                  </button>
                </div>
                {editingStatus === selectedProfile.id && (
                  <div style={{display:'flex',gap:'6px',marginTop:'8px',flexWrap:'wrap'}}>
                    {(['approved','declined','pending'] as const).filter(s => s !== selectedProfile.status).map(s=>(
                      <button key={s} onClick={()=>updateUserStatus(selectedProfile.id, s)}
                        disabled={actionLoading === selectedProfile.id}
                        style={{fontSize:'12px',padding:'5px 10px',borderRadius:'6px',border:'none',cursor:'pointer',fontWeight:'600',
                          background:s==='approved'?'#D1FAE5':s==='declined'?'#FEE2E2':'#FEF3C7',
                          color:s==='approved'?'#065F46':s==='declined'?'#991B1B':'#92400E'}}>
                        {actionLoading === selectedProfile.id ? '...' : `Set ${s}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',marginBottom:'.75rem'}}>Verification Documents</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {(selectedProfile.role === 'business' ? [
                  { name:'Company Registration Certificate', path:'company-certificate' },
                  { name:'ID Copy of Director', path:'id-document' },
                  { name:'CSD Full Registration Report', path:'csd-report' },
                  { name:'Tax Clearance Certificate', path:'tax-clearance' },
                  { name:'BBB-EE Certificate', path:'bbbee-certificate' },
                ] : [
                  { name:'FSCA License', path:'fsca-license' },
                  { name:'ID Copy of Director', path:'id-document' },
                  { name:'Proof of Funds', path:'proof-of-funds' },
                ]).map(doc => (
                  <div key={doc.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'#f9fafb',borderRadius:'8px',border:'1px solid #e5e5e5'}}>
                    <p style={{fontSize:'13px',color:'#1B2B4B',fontWeight:'500'}}>{doc.name}</p>
                    <button onClick={()=>downloadDoc(selectedProfile.id, doc.path)}
                      style={{fontSize:'12px',color:'#0F6E56',background:'#E1F5EE',border:'none',padding:'5px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={()=>{ setSelectedProfile(null); setEditingStatus(null) }}
              style={{width:'100%',padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* PO DOCS MODAL */}
      {selectedPO && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{fontSize:'18px',fontWeight:'700',color:'#1B2B4B'}}>PO Documents</h2>
              <button onClick={()=>setSelectedPO(null)}
                style={{background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#888'}}>x</button>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <p style={{fontSize:'13px',fontWeight:'600',color:'#1B2B4B'}}>{selectedPO.po_number}</p>
              <p style={{fontSize:'12px',color:'#888'}}>{selectedPO.client_name} • R {selectedPO.po_value.toLocaleString()}</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'1.5rem'}}>
              {[
                { name:'Purchase Order Document', path:`po-${selectedPO.id}` },
                { name:'Supplier Quotation', path:`quotation-${selectedPO.id}` },
              ].map(doc=>(
                <div key={doc.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'#f9fafb',borderRadius:'8px',border:'1px solid #e5e5e5'}}>
                  <p style={{fontSize:'13px',color:'#1B2B4B',fontWeight:'500'}}>{doc.name}</p>
                  <button onClick={()=>downloadDoc(selectedPO.user_id, doc.path)}
                    style={{fontSize:'12px',color:'#0F6E56',background:'#E1F5EE',border:'none',padding:'5px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                    View
                  </button>
                </div>
              ))}
            </div>
            <button onClick={()=>setSelectedPO(null)}
              style={{width:'100%',padding:'12px',background:'#f5f5f5',color:'#666',border:'1px solid #e5e5e5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  )
}