'use client'
import { useState, useEffect } from 'react'

const users = [
  { id:1, name:'Sipho Dlamini', business:'Dlamini Suppliers', email:'sipho@dlamini.co.za', role:'business', status:'pending', date:'2 May 2025', docs:5 },
  { id:2, name:'Thabo Nkosi', business:'Nkosi Capital', email:'thabo@nkosicapital.co.za', role:'funder', status:'verified', date:'1 May 2025', docs:3 },
  { id:3, name:'Sarah Mokoena', business:'Mokoena Supplies', email:'sarah@mokoena.co.za', role:'business', status:'pending', date:'5 May 2025', docs:4 },
  { id:4, name:'David Zulu', business:'SA Growth Fund', email:'david@sagrowth.co.za', role:'funder', status:'pending', date:'6 May 2025', docs:3 },
  { id:5, name:'Vuyiswa Thwala', business:'VAA GROUP', email:'vsiphoesihle@gmail.com', role:'business', status:'verified', date:'8 May 2025', docs:5 },
]

const pos = [
  { id:'PO-2025-001', business:'Dlamini Suppliers', client:'Eskom Holdings', value:'R 500,000', funding:'R 400,000', sector:'Construction', status:'active', offers:3, date:'2 May 2025' },
  { id:'PO-2025-002', business:'Zulu Trading Co.', client:'Transnet Freight Rail', value:'R 280,000', funding:'R 250,000', sector:'Transport', status:'reviewing', offers:0, date:'5 May 2025' },
  { id:'PO-2025-003', business:'Tau Distributors', client:'City of Johannesburg', value:'R 750,000', funding:'R 600,000', sector:'Government', status:'funded', offers:5, date:'1 Apr 2025' },
  { id:'PO-2025-004', business:'Mokoena Supplies', client:'Sasol Limited', value:'R 920,000', funding:'R 800,000', sector:'Mining', status:'active', offers:2, date:'6 May 2025' },
]

const commissions = [
  { id:'COM-001', po:'PO-2025-003', funder:'SA Growth Fund', amount:'R 600,000', commission:'R 12,000', date:'15 Apr 2025', status:'paid' },
  { id:'COM-002', po:'PO-2025-001', funder:'Nkosi Capital', amount:'R 400,000', commission:'R 8,000', date:'3 May 2025', status:'pending' },
  { id:'COM-003', po:'PO-2025-004', funder:'Apex Finance', amount:'R 800,000', commission:'R 16,000', date:'7 May 2025', status:'pending' },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg:'#FAEEDA', color:'#633806', label:'Pending' },
    verified:  { bg:'#E1F5EE', color:'#085041', label:'Verified' },
    active:    { bg:'#E1F5EE', color:'#085041', label:'Active' },
    reviewing: { bg:'#FAEEDA', color:'#633806', label:'Under review' },
    funded:    { bg:'#E6F1FB', color:'#0C447C', label:'Funded' },
    paid:      { bg:'#E1F5EE', color:'#085041', label:'Paid' },
    rejected:  { bg:'#FEE2E2', color:'#DC2626', label:'Rejected' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:'500'}}>
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'pos'|'commissions'>('overview')
  const [userStatuses, setUserStatuses] = useState<Record<number,string>>({})
  const [mounted, setMounted] = useState(false)
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [adminName, setAdminName] = useState('Admin')

  useEffect(()=>{
    setMounted(true)
    async function checkAdmin() {
      try {
        const { createBrowserClient } = await import('@supabase/ssr')
        const supabase = createBrowserClient(
          'https://efzszombcfxyyobqehyp.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/register'
          return
        }
        const userRole = user.user_metadata?.role
        if (userRole !== 'admin') {
          window.location.href = '/'
          return
        }
        setAdminName(user.email || 'Admin')
        setAuthorized(true)
        setChecking(false)
      } catch(e) {
        window.location.href = '/register'
      }
    }
    checkAdmin()
  },[])

  async function handleSignOut() {
    const { createBrowserClient } = await import('@supabase/ssr')
    const supabase = createBrowserClient(
      'https://efzszombcfxyyobqehyp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function handleApprove(userId: number) {
    setUserStatuses(prev => ({...prev, [userId]: 'verified'}))
  }

  function handleReject(userId: number) {
    setUserStatuses(prev => ({...prev, [userId]: 'rejected'}))
  }

  if (!mounted || checking) {
    return (
      <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:'16px',color:'#666'}}>Checking access...</p>
        </div>
      </main>
    )
  }

  if (!authorized) {
    return (
      <main style={{fontFamily:'sans-serif',minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:'16px',color:'#DC2626'}}>Access denied. Redirecting...</p>
        </div>
      </main>
    )
  }

  const totalCommission = commissions.reduce((sum, c) => sum + parseFloat(c.commission.replace('R ','').replace(',','')), 0)
  const paidCommission = commissions.filter(c=>c.status==='paid').reduce((sum, c) => sum + parseFloat(c.commission.replace('R ','').replace(',','')), 0)
  const pendingCommission = commissions.filter(c=>c.status==='pending').reduce((sum, c) => sum + parseFloat(c.commission.replace('R ','').replace(',','')), 0)

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
          <button
            onClick={handleSignOut}
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

        <div style={{display:'flex',gap:'4px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:'10px',padding:'4px',marginBottom:'2rem',width:'fit-content'}}>
          {(['overview','users','pos','commissions'] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'8px 20px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500',background:activeTab===t?'#085041':'transparent',color:activeTab===t?'#fff':'#666'}}>
              {t==='overview'?'Overview':t==='users'?'Users':t==='pos'?'POs':'Commissions'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'2rem'}}>
              {[
                { label:'Total users', value:users.length.toString(), color:'#085041' },
                { label:'Pending approvals', value:users.filter(u=>u.status==='pending').length.toString(), color:'#633806' },
                { label:'Active POs', value:pos.filter(p=>p.status==='active').length.toString(), color:'#0C447C' },
                { label:'Total commission', value:`R ${totalCommission.toLocaleString()}`, color:'#0F6E56' },
                { label:'Commission paid', value:`R ${paidCommission.toLocaleString()}`, color:'#085041' },
                { label:'Commission pending', value:`R ${pendingCommission.toLocaleString()}`, color:'#633806' },
              ].map(({label,value,color})=>(
                <div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'22px',fontWeight:'500',color}}>{value}</div>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>Pending User Approvals</h2>
              {users.filter(u=>(userStatuses[u.id]||u.status)==='pending').length === 0 ? (
                <p style={{fontSize:'14px',color:'#888'}}>No pending approvals</p>
              ) : (
                users.filter(u=>(userStatuses[u.id]||u.status)==='pending').map(user=>(
                  <div key={user.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f0f0f0',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <p style={{fontSize:'14px',fontWeight:'500'}}>{user.name}</p>
                      <p style={{fontSize:'12px',color:'#666'}}>{user.business} — {user.email}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>{user.role === 'business' ? 'Business' : 'Funder'} — {user.docs} docs uploaded</p>
                    </div>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={()=>handleApprove(user.id)}
                        style={{fontSize:'13px',color:'#fff',background:'#0F6E56',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                        Approve
                      </button>
                      <button onClick={()=>handleReject(user.id)}
                        style={{fontSize:'13px',color:'#DC2626',background:'#FEE2E2',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'500'}}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.5rem'}}>
              <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'1rem'}}>Recent PO Submissions</h2>
              {pos.slice(0,3).map(po=>(
                <div key={po.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0f0f0',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
                      <span style={{fontSize:'14px',fontWeight:'500'}}>{po.id}</span>
                      <StatusBadge status={po.status}/>
                    </div>
                    <p style={{fontSize:'12px',color:'#666'}}>{po.business} — {po.client}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'14px',fontWeight:'500',color:'#0F6E56'}}>{po.value}</p>
                    <p style={{fontSize:'12px',color:'#888'}}>{po.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h2 style={{fontSize:'18px',fontWeight:'500'}}>All Users</h2>
              <div style={{display:'flex',gap:'8px'}}>
                <span style={{fontSize:'13px',background:'#E1F5EE',color:'#085041',padding:'4px 12px',borderRadius:'99px'}}>
                  {users.filter(u=>(userStatuses[u.id]||u.status)==='verified').length} verified
                </span>
                <span style={{fontSize:'13px',background:'#FAEEDA',color:'#633806',padding:'4px 12px',borderRadius:'99px'}}>
                  {users.filter(u=>(userStatuses[u.id]||u.status)==='pending').length} pending
                </span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {users.map(user=>{
                const currentStatus = userStatuses[user.id] || user.status
                return (
                  <div key={user.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'15px',fontWeight:'500'}}>{user.name}</span>
                          <StatusBadge status={currentStatus}/>
                          <span style={{fontSize:'12px',color:'#666',background:'#f5f5f5',padding:'2px 8px',borderRadius:'99px'}}>
                            {user.role === 'business' ? 'Business' : 'Funder'}
                          </span>
                        </div>
                        <p style={{fontSize:'13px',color:'#666'}}>{user.business}</p>
                        <p style={{fontSize:'12px',color:'#888'}}>{user.email} — Registered {user.date}</p>
                        <p style={{fontSize:'12px',color:'#0F6E56',marginTop:'4px'}}>{user.docs} documents uploaded</p>
                      </div>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        <button style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                          View docs
                        </button>
                        {currentStatus === 'pending' && (
                          <>
                            <button onClick={()=>handleApprove(user.id)}
                              style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              Approve
                            </button>
                            <button onClick={()=>handleReject(user.id)}
                              style={{fontSize:'12px',color:'#DC2626',background:'#FEE2E2',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                              Reject
                            </button>
                          </>
                        )}
                        {currentStatus === 'verified' && (
                          <span style={{fontSize:'12px',color:'#085041',background:'#E1F5EE',padding:'6px 12px',borderRadius:'6px',fontWeight:'500'}}>
                            Approved
                          </span>
                        )}
                        {currentStatus === 'rejected' && (
                          <span style={{fontSize:'12px',color:'#DC2626',background:'#FEE2E2',padding:'6px 12px',borderRadius:'6px',fontWeight:'500'}}>
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'pos' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h2 style={{fontSize:'18px',fontWeight:'500'}}>All Purchase Orders</h2>
              <div style={{display:'flex',gap:'8px'}}>
                <span style={{fontSize:'13px',background:'#E1F5EE',color:'#085041',padding:'4px 12px',borderRadius:'99px'}}>{pos.filter(p=>p.status==='active').length} active</span>
                <span style={{fontSize:'13px',background:'#FAEEDA',color:'#633806',padding:'4px 12px',borderRadius:'99px'}}>{pos.filter(p=>p.status==='reviewing').length} reviewing</span>
                <span style={{fontSize:'13px',background:'#E6F1FB',color:'#0C447C',padding:'4px 12px',borderRadius:'99px'}}>{pos.filter(p=>p.status==='funded').length} funded</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {pos.map(po=>(
                <div key={po.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'.75rem'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'15px',fontWeight:'500'}}>{po.id}</span>
                        <StatusBadge status={po.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{po.business} — {po.client}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>{po.sector} — {po.date}</p>
                      {po.offers > 0 && <p style={{fontSize:'12px',color:'#0F6E56',fontWeight:'500',marginTop:'4px'}}>{po.offers} funding offers received</p>}
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'16px',fontWeight:'500',color:'#0F6E56'}}>{po.value}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>Funding: {po.funding}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button style={{fontSize:'12px',color:'#0C447C',background:'#E6F1FB',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                      View PO docs
                    </button>
                    <button style={{fontSize:'12px',color:'#085041',background:'#E1F5EE',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                      View offers
                    </button>
                    {po.status === 'reviewing' && (
                      <button style={{fontSize:'12px',color:'#fff',background:'#0F6E56',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}>
                        Approve PO
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'2rem'}}>
              <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#0F6E56'}}>R {totalCommission.toLocaleString()}</p>
                <p style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>Total commission earned</p>
              </div>
              <div style={{background:'#E1F5EE',border:'1px solid #5DCAA5',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#085041'}}>R {paidCommission.toLocaleString()}</p>
                <p style={{fontSize:'12px',color:'#0F6E56',marginTop:'4px'}}>Commission paid</p>
              </div>
              <div style={{background:'#FAEEDA',border:'1px solid #F5D87A',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'500',color:'#633806'}}>R {pendingCommission.toLocaleString()}</p>
                <p style={{fontSize:'12px',color:'#633806',marginTop:'4px'}}>Commission pending</p>
              </div>
            </div>
            <h2 style={{fontSize:'18px',fontWeight:'500',marginBottom:'1rem'}}>Commission Breakdown</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {commissions.map(com=>(
                <div key={com.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'14px',fontWeight:'500'}}>{com.id}</span>
                        <StatusBadge status={com.status}/>
                      </div>
                      <p style={{fontSize:'13px',color:'#666'}}>{com.po} — {com.funder}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>{com.date}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'18px',fontWeight:'500',color:'#0F6E56'}}>{com.commission}</p>
                      <p style={{fontSize:'12px',color:'#888'}}>2% of {com.amount}</p>
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