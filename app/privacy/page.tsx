import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'760px',margin:'0 auto',padding:'3rem 2rem'}}>
      <Link href="/" style={{fontSize:'20px',fontWeight:'500',textDecoration:'none',color:'#1a1a1a',display:'block',marginBottom:'2rem'}}>
        Fund<span style={{color:'#0F6E56'}}>MyPO</span>
      </Link>
      <h1 style={{fontSize:'28px',fontWeight:'500',marginBottom:'.5rem'}}>Privacy Policy</h1>
      <p style={{fontSize:'14px',color:'#888',marginBottom:'2rem'}}>Last updated: May 2025</p>
      {[
        { title:'1. Information We Collect', content:'We collect information you provide when registering, including your name, email address, phone number, company registration number, and verification documents. We also collect information about your use of our platform.' },
        { title:'2. How We Use Your Information', content:'We use your information to provide our services, verify your identity and business, facilitate funding transactions, communicate with you about your account, and improve our platform.' },
        { title:'3. Document Storage', content:'All documents uploaded to FundMyPO are stored securely using encrypted cloud storage. Documents are only accessible to verified funders who have submitted a funding offer on your specific purchase order.' },
        { title:'4. Information Sharing', content:'We do not sell your personal information to third parties. Your contact details and documents are only shared with funders who have made an offer on your PO. We may share information with law enforcement if required by law.' },
        { title:'5. Data Security', content:'We implement industry-standard security measures to protect your information. All data is encrypted in transit and at rest. However, no method of transmission over the internet is 100% secure.' },
        { title:'6. Data Retention', content:'We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us.' },
        { title:'7. Your Rights', content:'Under POPIA (Protection of Personal Information Act), you have the right to access, correct, or delete your personal information. Contact us at privacy@fundmypo.co.za to exercise these rights.' },
        { title:'8. Cookies', content:'We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, but this may affect platform functionality.' },
        { title:'9. Changes to This Policy', content:'We may update this privacy policy from time to time. We will notify you of significant changes by email or through the platform.' },
        { title:'10. Contact Us', content:'For privacy-related questions, contact our privacy officer at privacy@fundmypo.co.za or write to us at Project Pulse Innovation, South Africa.' },
      ].map(({title,content})=>(
        <div key={title} style={{marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'16px',fontWeight:'500',marginBottom:'.5rem',color:'#1a1a1a'}}>{title}</h2>
          <p style={{fontSize:'14px',color:'#666',lineHeight:'1.8'}}>{content}</p>
        </div>
      ))}
      <div style={{background:'#E1F5EE',borderRadius:'12px',padding:'1.5rem',marginTop:'2rem'}}>
        <p style={{fontSize:'14px',color:'#085041',lineHeight:'1.8'}}>
          For privacy questions contact <strong>privacy@fundmypo.co.za</strong>
        </p>
      </div>
      <div style={{marginTop:'2rem',paddingTop:'1rem',borderTop:'1px solid #e5e5e5',display:'flex',gap:'1rem'}}>
        <Link href="/terms" style={{fontSize:'13px',color:'#0F6E56'}}>Terms & Conditions</Link>
        <Link href="/" style={{fontSize:'13px',color:'#666'}}>← Back to home</Link>
      </div>
    </main>
  )
}