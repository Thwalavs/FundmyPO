import Link from 'next/link'

export default function TermsPage() {
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'760px',margin:'0 auto',padding:'3rem 2rem'}}>
      <Link href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a',display:'block',marginBottom:'2rem'}}>
        Fund<span style={{color:'#0F6E56'}}>MyPO</span>
      </Link>
      <h1 style={{fontSize:'28px',fontWeight:'500',marginBottom:'.5rem'}}>Terms & Conditions</h1>
      <p style={{fontSize:'14px',color:'#888',marginBottom:'2rem'}}>Last updated: May 2025</p>
      {[
        { title:'1. Acceptance of Terms', content:'By accessing and using FundMyPO, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our platform.' },
        { title:'2. Platform Description', content:'FundMyPO is a purchase order funding marketplace that connects businesses holding confirmed purchase orders with verified funders. We act as an intermediary and do not provide funding directly.' },
        { title:'3. User Eligibility', content:'You must be a registered business entity in South Africa to use our platform as a supplier. Funders must be registered financial institutions or accredited investors. All users must be 18 years or older.' },
        { title:'4. Document Verification', content:'All documents submitted on FundMyPO must be authentic and valid. Submitting fraudulent, forged, or misleading documents is a criminal offence under South African law and will result in immediate account termination and legal action.' },
        { title:'5. Commission & Fees', content:'FundMyPO charges a 2% commission on all successfully funded transactions. This commission is deducted from the funder\'s deployed capital. There are no fees for businesses submitting purchase orders.' },
        { title:'6. Confidentiality', content:'All documents and contact information shared on FundMyPO are confidential. Funders who access business documents after submitting an offer agree to use this information solely for the purpose of verifying and funding the specific purchase order.' },
        { title:'7. Liability', content:'FundMyPO is not liable for any losses arising from funding transactions between businesses and funders. We do not guarantee funding approval or the authenticity of purchase orders. Users engage in transactions at their own risk.' },
        { title:'8. Account Termination', content:'FundMyPO reserves the right to terminate any account that violates these terms, submits fraudulent documents, or engages in any activity that is harmful to other users or the platform.' },
        { title:'9. Governing Law', content:'These terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of South Africa.' },
        { title:'10. Contact', content:'For any questions regarding these terms, please contact us at support@fundmypo.co.za' },
      ].map(({title,content})=>(
        <div key={title} style={{marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'.5rem',color:'#1a1a1a'}}>{title}</h2>
          <p style={{fontSize:'14px',color:'#666',lineHeight:'1.8'}}>{content}</p>
        </div>
      ))}
      <div style={{background:'#E1F5EE',borderRadius:'12px',padding:'1.5rem',marginTop:'2rem'}}>
        <p style={{fontSize:'14px',color:'#085041',lineHeight:'1.8'}}>
          By using FundMyPO you agree to these terms. For questions contact <strong>support@fundmypo.co.za</strong>
        </p>
      </div>
      <div style={{marginTop:'2rem',paddingTop:'1rem',borderTop:'1px solid #e5e5e5',display:'flex',gap:'1rem'}}>
        <Link href="/privacy" style={{fontSize:'13px',color:'#0F6E56'}}>Privacy policy</Link>
        <Link href="/" style={{fontSize:'13px',color:'#666'}}>← Back to home</Link>
      </div>
    </main>
  )
}