import Image from 'next/image'
import Link from 'next/link'

export default function PrivacyPage() {
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
        <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '32px', fontWeight: '700', marginBottom: '.5rem', color: '#1F2937' }}>Privacy Policy</h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '3rem' }}>Last updated: May 2025</p>

        {[
          { title: '1. Information We Collect', content: 'We collect information you provide when registering, including your name, email address, phone number, company registration number, and verification documents. We also collect information about your use of our platform.' },
          { title: '2. How We Use Your Information', content: 'We use your information to provide our services, verify your identity and business, facilitate funding transactions, communicate with you about your account, and improve our platform.' },
          { title: '3. Document Storage', content: 'All documents uploaded to FundMyPO are stored securely using encrypted cloud storage. Documents are only accessible to verified funders who have submitted a funding offer on your specific purchase order.' },
          { title: '4. Information Sharing', content: 'We do not sell your personal information to third parties. Your contact details and documents are only shared with funders who have made an offer on your PO. We may share information with law enforcement if required by law.' },
          { title: '5. Data Security', content: 'We implement industry-standard security measures to protect your information. All data is encrypted in transit and at rest. However, no method of transmission over the internet is 100% secure.' },
          { title: '6. Data Retention', content: 'We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us.' },
          { title: '7. Your Rights', content: 'Under POPIA (Protection of Personal Information Act), you have the right to access, correct, or delete your personal information. Contact us at privacy@fundmypo.co.za to exercise these rights.' },
          { title: '8. Cookies', content: 'We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, but this may affect platform functionality.' },
          { title: '9. Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of significant changes by email or through the platform.' },
          { title: '10. Contact Us', content: 'For privacy-related questions, contact our privacy officer at privacy@fundmypo.co.za or write to us at Project Pulse Innovation, South Africa.' },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '17px', fontWeight: '700', marginBottom: '.75rem', color: '#1F2937' }}>{title}</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.9' }}>{content}</p>
          </div>
        ))}

        <div style={{ background: 'rgba(13,126,126,0.08)', border: '1px solid rgba(13,126,126,0.2)', borderRadius: '14px', padding: '1.5rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '14px', color: '#0D7E7E', lineHeight: '1.8' }}>
            For privacy questions contact <strong>privacy@fundmypo.co.za</strong>
          </p>
        </div>
      </div>

      <footer style={{ background: '#1F2937', padding: '2.5rem 2rem', textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 FundMyPO. All rights reserved.{' '}
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          {' | '}
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Back to home</Link>
        </p>
      </footer>
    </main>
  )
}
