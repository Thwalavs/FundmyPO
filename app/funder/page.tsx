'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type PO = {
  id: string
  user_id: string
  po_number: string
  client_name: string
  client_contact: string
  client_phone: string
  client_email: string
  client_department: string
  supplier_name: string
  supplier_phone: string
  supplier_email: string
  quotation_number: string
  po_value: number
  funding_needed: number
  quotation_value: number
  sector: string
  description: string
  status: string
  created_at: string
}

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'

async function getSupabase() {
  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}

function RiskBadge({ value }: { value: number }) {
  const risk = value >= 200000 ? 'Low' : 'Medium'
  const s = risk === 'Low' ? { bg: '#E1F5EE', color: '#085041' } : { bg: '#FAEEDA', color: '#633806' }
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>{risk} risk</span>
}

async function downloadDoc(userId: string, docPath: string) {
  const supabase = await getSupabase()

  // Try direct .pdf path first
  const directPath = `${userId}/${docPath}.pdf`
  const { data: directData } = await supabase.storage
    .from('verification-docs')
    .createSignedUrl(directPath, 3600)

  if (directData?.signedUrl) {
    window.open(directData.signedUrl, '_blank')
    return
  }

  // Fallback: list and find by name
  const { data: files, error: listError } = await supabase.storage
    .from('verification-docs')
    .list(userId)

  if (listError || !files || files.length === 0) {
    alert('No documents found for this business.')
    return
  }

  const matchedFile = files.find(f =>
    f.name === `${docPath}.pdf` ||
    f.name.startsWith(docPath) ||
    f.name.includes(docPath)
  )

  if (!matchedFile) {
    alert(`Document not found: ${docPath}\n\nThe business may not have uploaded this document yet.`)
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

function RealOffers() {
  const [myOffers, setMyOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const supabase = await getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: offers } = await supabase
        .from('funding_offers')
        .select('*, purchase_orders(*)')
        .eq('funder_id', user.id)
        .order('created_at', { ascending: false })
      setMyOffers((offers || []) as Offer[])
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { void (async () => { await load() })() }, [])

  if (loading) return <p style={{ fontSize: '14px', color: '#888', padding: '1rem' }}>Loading your offers...</p>

  if (myOffers.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
      <p style={{ fontSize: '16px', fontWeight: '600', color: '#1B2B4B', marginBottom: '.5rem' }}>No offers submitted yet</p>
      <p style={{ fontSize: '13px', color: '#888' }}>Go to the marketplace to find POs and submit offers.</p>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={() => load()}
          style={{ fontSize: '13px', color: '#0F6E56', background: '#E1F5EE', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Refresh offers
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {myOffers.map((offer) => {
          const po = offer.purchase_orders
          const isAccepted = offer.status === 'accepted'
          return (
            <div key={offer.id} style={{ background: '#fff', border: isAccepted ? '2px solid #0F6E56' : '1px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#1B2B4B' }}>{po?.po_number || 'PO'}</span>
                    <span style={{ background: isAccepted ? '#E1F5EE' : '#FAEEDA', color: isAccepted ? '#085041' : '#633806', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>
                      {isAccepted ? 'Accepted' : 'Pending'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666' }}>{po?.client_name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{new Date(offer.created_at).toLocaleDateString('en-ZA')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#0F6E56' }}>R {offer.amount.toLocaleString()}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>at {offer.interest_rate}% &bull; {offer.term_days} days</p>
                </div>
              </div>
              {isAccepted && (
                <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '1rem', marginTop: '.5rem' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#085041', marginBottom: '.5rem' }}>Your offer was accepted!</p>
                  <p style={{ fontSize: '12px', color: '#0F6E56', lineHeight: '1.6' }}>
                    Please proceed with the funding disbursement of <strong>R {offer.amount.toLocaleString()}</strong> to {po?.client_name}.
                    FundMyPO commission of <strong>R {(offer.amount * 0.02).toLocaleString()}</strong> (2%) will be deducted.
                  </p>
                </div>
              )}
              {!isAccepted && (
                <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '10px', marginTop: '.5rem', fontSize: '12px', color: '#666' }}>
                  Waiting for the business to review and accept your offer.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FunderDashboard() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'offers' | 'profile'>('marketplace')
  const [marketplace, setMarketplace] = useState<PO[]>([])
  const [loadingPOs, setLoadingPOs] = useState(true)
  const [submittedOffers, setSubmittedOffers] = useState<string[]>([])
  const [selectedPO, setSelectedPO] = useState<string | null>(null)
  const [previewPO, setPreviewPO] = useState<string | null>(null)
  const [viewingPODocs, setViewingPODocs] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, string>>({})
  const [terms, setTerms] = useState<Record<string, string>>({})
  const [offerError, setOfferError] = useState<Record<string, string>>({})
  const [funderName, setFunderName] = useState('Funder')

  // declare loader functions before useEffect
  async function loadFunderName() {
    try {
      const supabase = await getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setFunderName(user.user_metadata?.first_name || user.email || 'Funder')
    } catch (e) { console.log(e) }
  }

  async function loadPOs() {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false })
      if (error) { console.log('Error loading POs:', error.message); return }
      setMarketplace(data || [])
    } catch (e) { console.log(e) }
    finally { setLoadingPOs(false) }
  }

  useEffect(() => { void (async () => { await loadPOs(); await loadFunderName() })() }, [])

  async function handleSubmitOffer(poId: string) {
    const po = marketplace.find(p => p.id === poId)
    if (!po) return
    if (!rates[poId] || !terms[poId]) { setOfferError(prev => ({ ...prev, [poId]: 'Please enter both interest rate and repayment term.' })); return }
    if (parseFloat(rates[poId]) <= 0) { setOfferError(prev => ({ ...prev, [poId]: 'Interest rate must be greater than 0.' })); return }
    if (parseInt(terms[poId]) <= 0) { setOfferError(prev => ({ ...prev, [poId]: 'Repayment term must be greater than 0 days.' })); return }
    setOfferError(prev => ({ ...prev, [poId]: '' }))
    try {
      const supabase = await getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('funding_offers').insert({
        po_id: poId, funder_id: user.id, amount: po.funding_needed,
        interest_rate: parseFloat(rates[poId] || '0'), term_days: parseInt(terms[poId] || '0'), status: 'pending'
      })
    } catch (e) { console.log(e) }
    setSubmittedOffers(prev => [...prev, poId])
    setSelectedPO(null); setPreviewPO(null)
    setRates(prev => { const n = { ...prev }; delete n[poId]; return n })
    setTerms(prev => { const n = { ...prev }; delete n[poId]; return n })
  }

  

  return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>

      {/* NAV */}
      <nav style={{ background: '#1B2B4B', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{ height: '48px', width: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', background: 'rgba(77,191,176,0.2)', color: '#4DBFB0', padding: '4px 12px', borderRadius: '99px', fontWeight: '600' }}>Funder Portal</span>
          <button onClick={async () => { const s = await getSupabase(); await s.auth.signOut(); window.location.href = '/' }}
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.25rem' }}>Welcome back, {funderName}</h1>
          <p style={{ fontSize: '14px', color: '#666' }}>Browse available purchase orders and submit competitive funding offers.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Available POs', value: marketplace.length.toString(), color: '#0F6E56' },
            { label: 'My active offers', value: submittedOffers.length.toString(), color: '#633806' },
            { label: 'Total deployed', value: 'R 0', color: '#0C447C' },
            { label: 'Accepted deals', value: '0', color: '#085041' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color, marginBottom: '4px' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem', width: 'fit-content' }}>
          {(['marketplace', 'offers', 'profile'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: activeTab === t ? '#0F6E56' : 'transparent', color: activeTab === t ? '#fff' : '#666' }}>
              {t === 'marketplace' ? 'Marketplace' : t === 'offers' ? 'My Offers' : 'Profile'}
            </button>
          ))}
        </div>

        {/* MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.25rem' }}>Available Purchase Orders</h2>
              <p style={{ fontSize: '13px', color: '#666' }}>Preview a PO including all documents, then submit an offer when ready.</p>
            </div>

            {loadingPOs && <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}><p>Loading purchase orders...</p></div>}

            {!loadingPOs && marketplace.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1B2B4B', marginBottom: '.5rem' }}>No purchase orders available yet</p>
                <p style={{ fontSize: '13px', color: '#888' }}>Check back soon — businesses are submitting POs daily.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {marketplace.map(po => {
                const fundingAmount = po.funding_needed
                const rate = parseFloat(rates[po.id] || '0')
                const interestEarned = (fundingAmount * rate) / 100
                const profit = po.po_value - po.quotation_value
                const margin = po.po_value > 0 ? ((profit / po.po_value) * 100).toFixed(1) : '0'

                return (
                  <div key={po.id} style={{ background: '#fff', border: selectedPO === po.id ? '2px solid #0F6E56' : '1px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>

                    {/* PO HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#1B2B4B' }}>{po.po_number || 'PO-' + po.id.slice(0, 8)}</span>
                          <RiskBadge value={po.funding_needed} />
                          {submittedOffers.includes(po.id) && <span style={{ background: '#E6F1FB', color: '#0C447C', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>Offer submitted</span>}
                        </div>
                        <p style={{ fontSize: '13px', color: '#666' }}>{po.client_name} &bull; {po.sector}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>Dept: {po.client_department}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#0F6E56' }}>R {po.funding_needed.toLocaleString()}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>PO value: R {po.po_value.toLocaleString()}</p>
                        <p style={{ fontSize: '12px', color: '#085041', fontWeight: '600' }}>Margin: {margin}%</p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>{new Date(po.created_at).toLocaleDateString('en-ZA')}</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => setPreviewPO(previewPO === po.id ? null : po.id)}
                          style={{ fontSize: '13px', color: '#633806', background: '#FAEEDA', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                          {previewPO === po.id ? 'Hide preview' : 'Preview & Documents'}
                        </button>
                        {submittedOffers.includes(po.id) && (
                          <button onClick={() => setViewingPODocs(viewingPODocs === po.id ? null : po.id)}
                            style={{ fontSize: '13px', color: '#0C447C', background: '#E6F1FB', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            {viewingPODocs === po.id ? 'Hide docs' : 'View all documents'}
                          </button>
                        )}
                        {!submittedOffers.includes(po.id) && (
                          <button onClick={() => setSelectedPO(selectedPO === po.id ? null : po.id)}
                            style={{ fontSize: '13px', color: '#fff', background: '#0F6E56', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            {selectedPO === po.id ? 'Cancel' : 'Make an offer'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* FULL PREVIEW — unlocked docs visible before offer */}
                    {previewPO === po.id && !submittedOffers.includes(po.id) && (
                      <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#FFFBF0', borderRadius: '10px', border: '1px solid #F5D87A' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#633806', marginBottom: '1rem' }}>Full Preview — Review all documents before making an offer</p>

                        {/* PO SUMMARY + PROFIT */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                          <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', border: '1px solid #e5e5e5' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.5rem' }}>PO Summary</p>
                            {[['Client', po.client_name], ['Department', po.client_department], ['Sector', po.sector], ['PO Value', `R ${po.po_value.toLocaleString()}`], ['Funding needed', `R ${po.funding_needed.toLocaleString()}`]].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0', fontSize: '12px' }}>
                                <span style={{ color: '#888' }}>{l}</span><span style={{ fontWeight: '600' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', border: '1px solid #e5e5e5' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.5rem' }}>Profit Analysis</p>
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                              <p style={{ fontSize: '28px', fontWeight: '700', color: '#085041' }}>{margin}%</p>
                              <p style={{ fontSize: '12px', color: '#666' }}>Profit margin</p>
                              <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F6E56', marginTop: '.5rem' }}>R {profit.toLocaleString()}</p>
                              <p style={{ fontSize: '11px', color: '#666' }}>Estimated profit</p>
                            </div>
                          </div>
                        </div>

                        {/* CLIENT & SUPPLIER CONTACTS */}
                        {[
                          { title: 'Client Contact Details', rows: [['Company', po.client_name], ['Contact person', po.client_contact], ['Department', po.client_department], ['Phone', po.client_phone], ['Email', po.client_email]] },
                          { title: 'Supplier Contact Details', rows: [['Supplier', po.supplier_name], ['Phone', po.supplier_phone], ['Email', po.supplier_email], ['Quotation number', po.quotation_number], ['Quotation value', `R ${po.quotation_value.toLocaleString()}`]] },
                        ].map(({ title, rows }) => (
                          <div key={title} style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.5rem' }}>{title}</p>
                            {rows.map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                                <span style={{ color: '#888' }}>{l}</span><span style={{ fontWeight: '600' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        ))}

                        {/* PO & QUOTATION DOCS */}
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.75rem' }}>PO & Quotation Documents</p>
                          {[
                            { name: 'Purchase Order Document', path: `po-${po.id}` },
                            { name: 'Supplier Quotation', path: `quotation-${po.id}` },
                          ].map(doc => (
                            <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B2B4B' }}>{doc.name}</p>
                              <button onClick={() => downloadDoc(po.user_id, doc.path)}
                                style={{ fontSize: '12px', color: '#fff', background: '#0F6E56', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                View
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* VERIFICATION DOCS */}
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.75rem' }}>Business Verification Documents</p>
                          {[
                            { name: 'Company Registration Certificate', path: 'company-certificate' },
                            { name: 'ID Copy of Director', path: 'id-document' },
                            { name: 'CSD Full Registration Report', path: 'csd-report' },
                            { name: 'Tax Clearance Certificate', path: 'tax-clearance' },
                            { name: 'BBB-EE Certificate', path: 'bbbee-certificate' },
                          ].map(doc => (
                            <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B2B4B' }}>{doc.name}</p>
                              <button onClick={() => downloadDoc(po.user_id, doc.path)}
                                style={{ fontSize: '12px', color: '#0F6E56', background: '#E1F5EE', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                View
                              </button>
                            </div>
                          ))}
                        </div>

                        <div style={{ background: '#FAEEDA', borderRadius: '8px', padding: '10px', marginBottom: '1rem', fontSize: '12px', color: '#633806', border: '1px solid #F5D87A' }}>
                          These documents are confidential. Verify the PO and quotation directly with the client and supplier before making a funding decision.
                        </div>

                        <button onClick={() => { setSelectedPO(po.id); setPreviewPO(null) }}
                          style={{ width: '100%', padding: '10px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          Make an offer on this PO
                        </button>
                      </div>
                    )}

                    {/* OFFER FORM */}
                    {selectedPO === po.id && (
                      <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1B2B4B', marginBottom: '1rem' }}>Submit your funding offer</p>
                        {offerError[po.id] && (
                          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px', marginBottom: '1rem', fontSize: '13px', color: '#DC2626' }}>
                            {offerError[po.id]}
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>Interest rate (%) <span style={{ color: '#DC2626' }}>*</span></label>
                            <input type="number" placeholder="e.g. 3.5" value={rates[po.id] || ''}
                              onChange={e => setRates(prev => ({ ...prev, [po.id]: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>Repayment term (days) <span style={{ color: '#DC2626' }}>*</span></label>
                            <input type="number" placeholder="e.g. 60" value={terms[po.id] || ''}
                              onChange={e => setTerms(prev => ({ ...prev, [po.id]: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                          </div>
                        </div>
                        <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '12px', marginBottom: '1rem', border: '1px solid #c8ead8' }}>
                          <div style={{ fontSize: '13px', color: '#085041' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #c8ead8' }}>
                              <span>Funding amount</span><span style={{ fontWeight: '700' }}>R {fundingAmount.toLocaleString()}</span>
                            </div>
                            {rate > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                <span>Your interest ({rates[po.id]}%)</span><span style={{ fontWeight: '700', color: '#0F6E56' }}>+ R {interestEarned.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          {!rates[po.id] && <p style={{ fontSize: '12px', color: '#0F6E56', marginTop: '.5rem' }}>Enter your interest rate above to see the breakdown.</p>}
                        </div>
                        <button onClick={() => handleSubmitOffer(po.id)}
                          style={{ width: '100%', padding: '12px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                          Submit offer
                        </button>
                      </div>
                    )}

                    {/* POST-OFFER FULL DOCS */}
                    {viewingPODocs === po.id && (
                      <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#EEF4FB', borderRadius: '10px', border: '1px solid #B8D4F0' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#0C447C', marginBottom: '1rem' }}>Full Documents & Contact Details</p>
                        {[
                          { title: 'Client Contact Details', rows: [['Company', po.client_name], ['Contact person', po.client_contact], ['Department', po.client_department], ['Phone', po.client_phone], ['Email', po.client_email]] },
                          { title: 'Supplier Contact Details', rows: [['Supplier', po.supplier_name], ['Phone', po.supplier_phone], ['Email', po.supplier_email], ['Quotation number', po.quotation_number], ['Quotation value', `R ${po.quotation_value.toLocaleString()}`]] },
                        ].map(({ title, rows }) => (
                          <div key={title} style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.5rem' }}>{title}</p>
                            {rows.map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                                <span style={{ color: '#888' }}>{l}</span><span style={{ fontWeight: '600' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.75rem' }}>PO & Quotation Documents</p>
                          {[{ name: 'Purchase Order Document', path: `po-${po.id}` }, { name: 'Supplier Quotation', path: `quotation-${po.id}` }].map(doc => (
                            <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B2B4B' }}>{doc.name}</p>
                              <button onClick={() => downloadDoc(po.user_id, doc.path)}
                                style={{ fontSize: '12px', color: '#fff', background: '#0F6E56', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#1B2B4B', marginBottom: '.75rem' }}>Business Verification Documents</p>
                          {[
                            { name: 'Company Registration Certificate', path: 'company-certificate' },
                            { name: 'ID Copy of Director', path: 'id-document' },
                            { name: 'CSD Full Registration Report', path: 'csd-report' },
                            { name: 'Tax Clearance Certificate', path: 'tax-clearance' },
                            { name: 'BBB-EE Certificate', path: 'bbbee-certificate' },
                          ].map(doc => (
                            <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B2B4B' }}>{doc.name}</p>
                              <button onClick={() => downloadDoc(po.user_id, doc.path)}
                                style={{ fontSize: '12px', color: '#0F6E56', background: '#E1F5EE', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: '#FAEEDA', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#633806', border: '1px solid #F5D87A' }}>
                          These documents are confidential. Verify the PO and quotation directly with the client and supplier before making a funding decision.
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MY OFFERS */}
        {activeTab === 'offers' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1B2B4B', marginBottom: '1rem' }}>My Submitted Offers</h2>
            <RealOffers />
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1B2B4B', marginBottom: '1.5rem' }}>Funder Profile</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Profile details coming soon.</p>
          </div>
        )}

      </div>
    </main>
  )
}

type Offer = {
  id: string
  amount: number
  interest_rate: number
  term_days: number
  status: string
  created_at: string
  purchase_orders?: PO
}