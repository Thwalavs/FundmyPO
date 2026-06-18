import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Invoice Financing & Working Capital South Africa',
  description: 'Invoice financing and working capital solutions for South African SMEs and contractors. FundMyPO helps you unlock cash tied up in purchase orders and invoices.',
  keywords: ['invoice financing South Africa','working capital South Africa','supply chain finance','invoice factoring South Africa','working capital for contractors'],
  alternates: { canonical: '/invoice-financing' },
  openGraph: {
    title: 'Invoice Financing & Working Capital South Africa | FundMyPO',
    description: 'Unlock cash tied up in purchase orders and invoices. Compare offers from verified funders through FundMyPO.',
    url: 'https://www.fundmypo.co.za/invoice-financing',
  },
}

export default function InvoiceFinancingPage() {
  return (
    <main style={{fontFamily:'Arial,sans-serif',color:'#1B2B4B'}}>
      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',height:'68px'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'48px',width:'auto'}}/>
        </Link>
        <Link href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'9px 22px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'700'}}>
          Get Funded Now
        </Link>
      </nav>

      <section style={{background:'linear-gradient(135deg,#1B2B4B,#0F1F38)',padding:'5rem 2rem',textAlign:'center'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <h1 style={{fontSize:'clamp(28px,5vw,48px)',fontWeight:'700',color:'#fff',marginBottom:'1.5rem',lineHeight:'1.2'}}>
            Invoice Financing & Working Capital South Africa
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.8)',lineHeight:'1.8',marginBottom:'2.5rem'}}>
            Unlock the cash tied up in your purchase orders and invoices. FundMyPO gives South African SMEs access to fast, flexible working capital without giving up equity.
          </p>
          <Link href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700',display:'inline-block'}}>
            Apply for Working Capital
          </Link>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>Working Capital Solutions for South African SMEs</h2>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            Many South African SMEs face a common challenge — they have confirmed orders and contracts but lack the working capital to deliver. Traditional bank finance is slow, requires collateral and often rejects small businesses.
          </p>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            FundMyPO provides an alternative through purchase order financing — a form of supply chain finance that uses your confirmed purchase orders as the basis for funding, not your credit history or assets.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',marginTop:'2rem'}}>
            {[
              { title:'No equity required', desc:'Unlike venture capital or investors, PO funding does not require you to give up shares in your business.' },
              { title:'Asset-based lending', desc:'Funding is secured by your purchase order, not your personal assets or credit history.' },
              { title:'Fast approval', desc:'Get funded in as little as 48 hours once your PO is verified and a funder makes an offer.' },
              { title:'Competitive rates', desc:'Multiple funders compete for your deal, ensuring you get the most competitive interest rate.' },
            ].map(({title,desc})=>(
              <div key={title} style={{background:'#f8f9fb',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'1.5rem'}}>
                <h3 style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B',marginBottom:'0.5rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'4rem 2rem',background:'#4DBFB0',textAlign:'center'}}>
        <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Get working capital for your business today</h2>
        <p style={{fontSize:'16px',color:'rgba(255,255,255,0.85)',marginBottom:'2rem'}}>Register on FundMyPO and submit your purchase order in minutes.</p>
        <Link href="/register" style={{background:'#fff',color:'#0F6E56',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700',display:'inline-block'}}>
          Apply Now
        </Link>
      </section>

      <footer style={{background:'#1B2B4B',padding:'2rem',textAlign:'center'}}>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>© 2025 FundMyPO. All rights reserved. | <Link href="/privacy" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Privacy Policy</Link> | <Link href="/terms" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Terms</Link></p>
      </footer>
    </main>
  )
}
