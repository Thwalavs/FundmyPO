import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Purchase Order Funding South Africa',
  description: 'Get funding for approved purchase orders in South Africa. FundMyPO connects SMEs with verified funders who compete on rates. Fast approval, full transparency.',
  keywords: ['purchase order funding South Africa', 'PO funding', 'purchase order finance', 'SME funding South Africa'],
  alternates: { canonical: '/purchase-order-funding' },
  openGraph: {
    title: 'Purchase Order Funding South Africa | FundMyPO',
    description: 'Get funding for approved purchase orders in South Africa. Compare offers from multiple verified funders.',
    url: 'https://www.fundmypo.co.za/purchase-order-funding',
  },
}

export default function POFundingPage() {
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
            Purchase Order Funding South Africa
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.8)',lineHeight:'1.8',marginBottom:'2.5rem'}}>
            Get funding for your approved purchase orders from verified South African funders. Fast, transparent and competitive rates.
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700'}}>
              Apply for PO Funding
            </Link>
            <Link href="/register?role=funder" style={{background:'transparent',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'600',border:'1px solid rgba(255,255,255,0.4)'}}>
              Become a Funder
            </Link>
          </div>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>What is Purchase Order Funding?</h2>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            Purchase order (PO) funding is a short-term financing solution that allows South African businesses to fulfil confirmed customer orders without using their own working capital. A funder pays your supplier directly, you deliver the goods or services to your client, and repay the funder once your client pays.
          </p>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            PO funding is ideal for SMEs and contractors who have secured government tenders, corporate purchase orders, or supply contracts but lack the upfront capital to fulfil them.
          </p>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9'}}>
            FundMyPO is South Africa&apos;s first dedicated purchase order funding marketplace, connecting businesses directly with verified funders who compete on interest rates — ensuring you always get the best deal.
          </p>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#f8f9fb'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'3rem',textAlign:'center'}}>Who Qualifies for PO Funding?</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'1.5rem'}}>
            {[
              { title:'Government Contractors', desc:'Businesses with approved government purchase orders or tenders from national, provincial or municipal departments.' },
              { title:'Corporate Suppliers', desc:'SMEs supplying goods or services to large corporates, SOEs or parastatal organisations.' },
              { title:'Import/Export Businesses', desc:'Companies that need to pay foreign suppliers before receiving payment from local clients.' },
              { title:'Construction Companies', desc:'Contractors and subcontractors needing materials funding for confirmed construction projects.' },
            ].map(({title,desc})=>(
              <div key={title} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'1.5rem'}}>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1B2B4B',marginBottom:'0.75rem'}}>{title}</h3>
                <p style={{fontSize:'14px',color:'#666',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#1B2B4B'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'3rem',textAlign:'center'}}>How FundMyPO Works</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'2rem'}}>
            {[
              { num:'01', title:'Register', desc:'Create your account and upload your business verification documents.' },
              { num:'02', title:'Submit Your PO', desc:'Upload your confirmed purchase order and supplier quotation.' },
              { num:'03', title:'Receive Offers', desc:'Verified funders review your PO and submit competitive funding offers.' },
              { num:'04', title:'Get Funded', desc:'Accept the best offer and your supplier gets paid within 24 hours.' },
            ].map(({num,title,desc})=>(
              <div key={num} style={{textAlign:'center'}}>
                <div style={{width:'56px',height:'56px',background:'#4DBFB0',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'14px',fontWeight:'700',color:'#fff'}}>{num}</div>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'#fff',marginBottom:'0.5rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.65)',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'2rem'}}>Frequently Asked Questions</h2>
          {[
            { q:'How quickly can I get funding?', a:'Once your PO is listed and a funder makes an offer, you can receive funds within 24-48 hours of accepting the offer.' },
            { q:'What documents do I need?', a:'You need your company registration certificate, ID copy of director, CSD registration report, tax clearance certificate, BBB-EE certificate, the purchase order and supplier quotation.' },
            { q:'What is the minimum PO value?', a:'We accept purchase orders from R50,000 and above.' },
            { q:'Is my information secure?', a:'Yes. All documents are encrypted and only shared with verified funders who submit an offer on your specific PO.' },
            { q:'Do I need a good credit score?', a:'PO funding is asset-based, meaning it is secured by the purchase order itself. Your credit history is less important than the strength of the PO and your client.' },
          ].map(({q,a})=>(
            <div key={q} style={{borderBottom:'1px solid #e5e7eb',paddingBottom:'1.5rem',marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1B2B4B',marginBottom:'0.75rem'}}>{q}</h3>
              <p style={{fontSize:'15px',color:'#555',lineHeight:'1.8'}}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'4rem 2rem',background:'#4DBFB0',textAlign:'center'}}>
        <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Ready to get your PO funded?</h2>
        <p style={{fontSize:'16px',color:'rgba(255,255,255,0.85)',marginBottom:'2rem'}}>Join hundreds of South African SMEs already using FundMyPO.</p>
        <Link href="/register" style={{background:'#fff',color:'#0F6E56',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700',display:'inline-block'}}>
          Apply for Funding Today
        </Link>
      </section>

      <footer style={{background:'#1B2B4B',padding:'2rem',textAlign:'center'}}>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>© 2025 FundMyPO. All rights reserved. | <Link href="/privacy" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Privacy Policy</Link> | <Link href="/terms" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Terms</Link></p>
      </footer>
    </main>
  )
}
