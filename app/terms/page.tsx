import Image from 'next/image'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main style={{ fontFamily: '"Inter", sans-serif', minHeight: '100vh', background: '#FAFAF8', color: '#1F2937' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>

      <nav style={{ background: '#1F2937', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{ height: '48px', width: 'auto' }} />
        </Link>
        <Link href="/register" style={{ background: '#0D7E7E', color: '#fff', padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          Get Funded
        </Link>
      </nav>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '32px', fontWeight: '700', marginBottom: '.5rem', color: '#1F2937' }}>Terms &amp; Conditions</h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '3rem' }}>Last updated: May 2025</p>

        {[
          { title: '1. Acceptance of Terms', content: 'By accessing and using FundMyPO, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our platform.' },
          { title: '2. Platform Description', content: 'FundMyPO is a purchase order funding marketplace that connects businesses holding confirmed purchase orders with verified funders. We act as an intermediary and do not provide funding directly.' },
          { title: '3. User Eligibility', content: 'You must be a registered business entity in South Africa to use our platform as a supplier. Funders must be registered financial institutions or accredited investors. All users must be 18 years or older.' },
          { title: '4. Document Verification', content: 'All documents submitted on FundMyPO must be authentic and valid. Submitting fraudulent, forged, or misleading documents is a criminal offence under South African law and will result in immediate account termination and legal action.' },
          { title: '5. Commission & Fees', content: "FundMyPO charges a 2% commission on all successfully funded transactions. This commission is deducted from the funder's deployed capital. There are no fees for businesses submitting purchase orders." },
          { title: '6. Confidentiality', content: 'All documents and contact information shared on FundMyPO are confidential. Funders who access business documents after submitting an offer agree to use this information solely for the purpose of verifying and funding the specific purchase order.' },
          { title: '7. Liability', content: 'FundMyPO is not liable for any losses arising from funding transactions between businesses and funders. We do not guarantee funding approval or the authenticity of purchase orders. Users engage in transactions at their own risk.' },
          { title: '8. Account Termination', content: 'FundMyPO reserves the right to terminate any account that violates these terms, submits fraudulent documents, or engages in any activity that is harmful to other users or the platform.' },
          { title: '9. Governing Law', content: 'These terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of South Africa.' },
          { title: '10. Contact', content: 'For any questions regarding these terms, please contact us at support@fundmypo.co.za' },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '17px', fontWeight: '700', marginBottom: '.75rem', color: '#1F2937' }}>{title}</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.9' }}>{content}</p>
          </div>
        ))}

        <div style={{ background: 'rgba(13,126,126,0.08)', border: '1px solid rgba(13,126,126,0.2)', borderRadius: '14px', padding: '1.5rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '14px', color: '#0D7E7E', lineHeight: '1.8' }}>
            By using FundMyPO you agree to these terms. For questions contact <strong>support@fundmypo.co.za</strong>
          </p>
        </div>
      </div>

      <footer style={{ background: '#1F2937', padding: '2.5rem 2rem', textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 FundMyPO. All rights reserved.{' '}
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
          {' | '}
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Back to home</Link>
        </p>
      </footer>
    </main>
  )
}
