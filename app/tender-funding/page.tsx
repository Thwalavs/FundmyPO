import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Government Tender Funding South Africa',
  description: 'Get funding for government tenders and contracts in South Africa. FundMyPO connects SME contractors with verified funders. Fast approval, competitive rates.',
  keywords: ['tender funding South Africa','government tender funding','tender finance','contract financing South Africa','working capital for contractors'],
  alternates: { canonical: '/tender-funding' },
  openGraph: {
    title: 'Government Tender Funding South Africa | FundMyPO',
    description: 'Get funding for government tenders and contracts. Compare offers from verified funders through FundMyPO.',
    url: 'https://www.fundmypo.co.za/tender-funding',
  },
}

export default function TenderFundingPage() {
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
          <div style={{display:'inline-block',background:'rgba(77,191,176,0.15)',color:'#4DBFB0',padding:'6px 16px',borderRadius:'4px',fontSize:'12px',fontWeight:'700',marginBottom:'1.5rem',letterSpacing:'1px',textTransform:'uppercase'}}>
            Government Tender Funding
          </div>
          <h1 style={{fontSize:'clamp(28px,5vw,48px)',fontWeight:'700',color:'#fff',marginBottom:'1.5rem',lineHeight:'1.2'}}>
            Tender Funding South Africa
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.8)',lineHeight:'1.8',marginBottom:'2.5rem'}}>
            Won a government tender but need capital to fulfil it? FundMyPO connects you with verified funders who finance your tender so you can deliver and get paid.
          </p>
          <Link href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700',display:'inline-block'}}>
            Apply for Tender Funding
          </Link>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>What is Tender Funding?</h2>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            Tender funding — also known as contract financing or purchase order funding — is a financial solution that allows South African businesses to fulfil awarded government tenders without using their own cash reserves.
          </p>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9',marginBottom:'1.5rem'}}>
            When you win a government tender from a municipality, department, SOE or parastatal, you often need to pay suppliers upfront before your client pays you. FundMyPO bridges this cash flow gap by connecting you with funders who pay your suppliers directly.
          </p>
          <p style={{fontSize:'16px',color:'#555',lineHeight:'1.9'}}>
            Once you deliver and your government client pays, you repay the funder plus an agreed interest rate. The entire process is transparent and competitive — multiple funders bid for your deal.
          </p>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#f8f9fb'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'3rem',textAlign:'center'}}>Types of Tenders We Fund</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'1.5rem'}}>
            {[
              { title:'Municipal Tenders', desc:'Supply and delivery contracts from local municipalities across South Africa.' },
              { title:'Provincial Government', desc:'Goods and services contracts from provincial departments and entities.' },
              { title:'National Departments', desc:'Supply contracts from national government departments and agencies.' },
              { title:'SOE Contracts', desc:'Contracts from state-owned enterprises like Eskom, Transnet, PRASA and others.' },
              { title:'Construction Tenders', desc:'Material and subcontracting contracts for government construction projects.' },
              { title:'Healthcare Supply', desc:'Medical supplies and equipment contracts for public hospitals and clinics.' },
            ].map(({title,desc})=>(
              <div key={title} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'1.5rem',borderLeft:'4px solid #4DBFB0'}}>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1B2B4B',marginBottom:'0.5rem'}}>{title}</h3>
                <p style={{fontSize:'14px',color:'#666',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'5rem 2rem',background:'#1B2B4B'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Requirements for Tender Funding</h2>
          <p style={{fontSize:'16px',color:'rgba(255,255,255,0.65)',marginBottom:'3rem'}}>To qualify for tender funding on FundMyPO you need:</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',textAlign:'left'}}>
            {[
              'A confirmed, signed purchase order or tender award letter',
              'A valid CSD (Central Supplier Database) registration',
              'Tax clearance certificate in good standing',
              'Company registration documents (CIPC)',
              'A supplier quotation for the goods or services',
              'BBB-EE certificate or sworn affidavit',
            ].map((item,i)=>(
              <div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                <div style={{width:'24px',height:'24px',background:'#4DBFB0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'12px',fontWeight:'700',color:'#fff'}}>✓</div>
                <p style={{fontSize:'14px',color:'rgba(255,255,255,0.75)',lineHeight:'1.7'}}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'4rem 2rem',background:'#4DBFB0',textAlign:'center'}}>
        <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Won a tender? Get it funded today.</h2>
        <p style={{fontSize:'16px',color:'rgba(255,255,255,0.85)',marginBottom:'2rem'}}>Register on FundMyPO and submit your tender for funding in minutes.</p>
        <Link href="/register" style={{background:'#fff',color:'#0F6E56',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'700',display:'inline-block'}}>
          Apply for Tender Funding
        </Link>
      </section>

      <footer style={{background:'#1B2B4B',padding:'2rem',textAlign:'center'}}>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>© 2025 FundMyPO. All rights reserved. | <Link href="/privacy" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Privacy Policy</Link> | <Link href="/terms" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>Terms</Link></p>
      </footer>
    </main>
  )
}
