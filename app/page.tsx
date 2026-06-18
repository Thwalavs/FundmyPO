'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ fontFamily: "'Inter','Arial',sans-serif", background: '#FAFAF8', color: '#1F2937' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        h1, h2, h3 { font-family: 'Poppins', sans-serif; }

        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; background: #10B981; transition: width 0.25s ease; }
        .nav-link:hover { color: #10B981 !important; opacity: 1 !important; }
        .nav-link:hover::after { width: 100%; }

        .cta-primary { background: #0D7E7E; color: #fff; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
        .cta-primary:hover { background: #0a6868; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,126,126,0.35); opacity: 1 !important; }
        .cta-primary:active { transform: scale(0.97); }

        .cta-outline { transition: background 0.15s ease, transform 0.15s ease; }
        .cta-outline:hover { background: rgba(255,255,255,0.14) !important; transform: translateY(-2px); opacity: 1 !important; }
        .cta-outline:active { transform: scale(0.97); }

        .cta-gold { background: #D4A574; color: #fff !important; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
        .cta-gold:hover { background: #c4935e; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,165,116,0.4); opacity: 1 !important; }
        .cta-gold:active { transform: scale(0.97); }

        .cta-dark { background: #1F2937; color: #fff !important; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
        .cta-dark:hover { background: #111827; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); opacity: 1 !important; }
        .cta-dark:active { transform: scale(0.97); }

        .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(13,126,126,0.13); }

        .footer-link { transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.85) !important; opacity: 1 !important; }

        a:hover { opacity: 0.9; }

        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          *, .cta-primary, .cta-outline, .cta-gold, .cta-dark, .card-lift, .nav-link, .pulse {
            transition: none !important; animation: none !important; transform: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 32px !important; }
          .section-title { font-size: 26px !important; }
          .hero-right { display: none !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .stat-row { flex-direction: column !important; gap: 1.5rem !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: scrolled ? 'rgba(31,41,55,0.96)' : '#1F2937',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        padding: '0 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '68px',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.22)' : '0 1px 0 rgba(255,255,255,0.06)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{ height: '44px', width: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-menu">
          {[['For SMEs', '#smes'], ['For Funders', '#funders'], ['How It Works', '#howitworks'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontWeight: '500', letterSpacing: '0.2px' }}>{label}</a>
          ))}
          <Link href="/register" className="nav-link" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
          <Link href="/register" className="cta-primary" style={{ padding: '9px 22px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.2px' }}>
            Get Funded
          </Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', fontSize: '20px' }}
          className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ background: '#1F2937', padding: '0.5rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', zIndex: 99, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[['For SMEs', '#smes'], ['For Funders', '#funders'], ['How It Works', '#howitworks'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: '15px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontWeight: '500', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {label}
            </a>
          ))}
          <a href="/register" onClick={() => setMenuOpen(false)}
            style={{ fontSize: '15px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontWeight: '500', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            Sign In
          </a>
          <Link href="/register" onClick={() => setMenuOpen(false)} className="cta-primary"
            style={{ padding: '13px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginTop: '1rem', display: 'block' }}>
            Get Funded
          </Link>
        </div>
      )}

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1F2937 0%, #0D4F4F 60%, #0D7E7E 100%)', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,165,116,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '5rem 2.5rem 7rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', width: '100%' }} className="hero-grid">

          {/* LEFT: Copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.28)', color: '#10B981', padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', marginBottom: '1.75rem', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>
              <span className="pulse" style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
              South Africa&apos;s #1 PO Funding Platform
            </div>
            <h1 className="hero-title" style={{ fontSize: '48px', fontWeight: '700', color: '#fff', lineHeight: '1.15', marginBottom: '1.5rem', fontFamily: 'Poppins,sans-serif' }}>
              Your Growth<br />Shouldn&apos;t Wait<br /><span style={{ color: '#D4A574' }}>for Traditional Finance</span>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '2.5rem', fontFamily: 'Inter,sans-serif', maxWidth: '480px' }}>
              Revolutionising purchase order and working capital solutions for South African SMEs. Turn your invoices and POs into immediate growth opportunities.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link href="/register" className="cta-primary" style={{ padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
                Unlock Your Capital →
              </Link>
              <Link href="/register?role=funder" className="cta-outline" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
                Become a Funder
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }} className="stat-row">
              {[['R50M+', 'Funded to date'], ['200+', 'SMEs helped'], ['48hrs', 'Average approval']].map(([val, label]) => (
                <div key={label}>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#D4A574', marginBottom: '4px', fontFamily: 'Poppins,sans-serif' }}>{val}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.48)', fontFamily: 'Inter,sans-serif', letterSpacing: '0.6px', textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live marketplace card */}
          <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '11px', color: '#10B981', fontFamily: 'Inter,sans-serif', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Live Marketplace</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter,sans-serif' }}>Live</span>
                </div>
              </div>
              {[
                { po: 'PO-2024-001', company: 'Dlamini Suppliers', amount: 'R 250,000', status: 'Open' },
                { po: 'PO-2024-002', company: 'Nkosi Trading', amount: 'R 480,000', status: 'Open' },
                { po: 'PO-2024-003', company: 'Zulu Enterprises', amount: 'R 120,000', status: 'Funded' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Inter,sans-serif' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{item.company}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>{item.po}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#D4A574', marginBottom: '3px' }}>{item.amount}</p>
                    <span style={{ fontSize: '11px', background: item.status === 'Open' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.08)', color: item.status === 'Open' ? '#10B981' : 'rgba(255,255,255,0.42)', padding: '2px 10px', borderRadius: '100px' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(16,185,129,0.11)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '26px', fontWeight: '700', color: '#10B981', fontFamily: 'Poppins,sans-serif' }}>100%</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter,sans-serif', marginTop: '4px' }}>Verified deals</p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 64L60 57C120 50 240 36 360 29C480 22 600 22 720 28C840 34 960 48 1080 51C1200 54 1320 46 1380 42L1440 38V64H0Z" fill="#FAFAF8" />
          </svg>
        </div>
      </section>

      {/* SME JOURNEY */}
      <section id="smes" style={{ padding: '7rem 2.5rem 6rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="two-col">
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#0D7E7E', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '1rem' }}>For South African SMEs</p>
              <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '1.25rem', lineHeight: '1.25', fontFamily: 'Poppins,sans-serif' }}>
                From Invoice to<br /><span style={{ color: '#0D7E7E' }}>Opportunity in Days</span>
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '2.5rem', fontFamily: 'Inter,sans-serif' }}>
                Get working capital to fulfil your purchase orders without giving up equity. Our platform connects you to verified funders in hours, not weeks.
              </p>
              <Link href="/register" className="cta-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
                Apply for funding today →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { num: '01', title: 'Submit Your PO', desc: 'Upload your confirmed purchase order and supplier quotation to our secure platform.' },
                { num: '02', title: 'Get Vetted Fast', desc: 'Our team verifies your documents and lists your PO on the funding marketplace within 24 hours.' },
                { num: '03', title: 'Access Your Capital', desc: 'Accept the best funder offer and your supplier gets paid within 24 hours. You deliver, then repay when your client pays.' },
              ].map(({ num, title, desc }, i) => (
                <div key={num} style={{ display: 'flex', gap: '1.5rem', padding: '1.75rem 0', borderBottom: i < 2 ? '1px solid #E5E7EB' : 'none' }}>
                  <div style={{ flexShrink: 0, width: '52px', height: '52px', background: 'linear-gradient(135deg,#0D7E7E,#10B981)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(13,126,126,0.28)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff', fontFamily: 'Poppins,sans-serif' }}>{num}</span>
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '6px', fontFamily: 'Poppins,sans-serif' }}>{title}</p>
                    <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.75', fontFamily: 'Inter,sans-serif' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave → dark */}
      <div style={{ background: '#FAFAF8', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0 0L60 7C120 14 240 28 360 35C480 42 600 42 720 36C840 30 960 16 1080 13C1200 10 1320 18 1380 22L1440 26V64H0Z" fill="#1F2937" />
        </svg>
      </div>

      {/* FUNDER ADVANTAGE */}
      <section id="funders" style={{ padding: '6rem 2.5rem', background: '#1F2937' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="two-col">
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '1rem' }}>For Funders</p>
              <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', lineHeight: '1.25', fontFamily: 'Poppins,sans-serif' }}>
                Deploy Capital With<br /><span style={{ color: '#D4A574' }}>Full Confidence</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.58)', lineHeight: '1.8', marginBottom: '2rem', fontFamily: 'Inter,sans-serif' }}>
                Deploy your capital into verified, low-risk PO deals and earn competitive returns with full transparency before you commit.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                {[['30–90', 'Day terms'], ['100%', 'Verified deals']].map(([val, label]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '26px', fontWeight: '700', color: '#D4A574', fontFamily: 'Poppins,sans-serif' }}>{val}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter,sans-serif', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/register?role=funder" className="cta-gold" style={{ display: 'inline-block', padding: '13px 26px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
                Become a Funder →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Stability of Cover', desc: 'Every PO is verified against CSD, CIPC and tax compliance before listing. You fund with confidence.', icon: '🛡️' },
                { title: 'Full Document Access', desc: 'View the full PO, supplier quotation and all business verification documents before making any offer.', icon: '📄' },
                { title: 'Competitive Returns', desc: 'Earn competitive returns per deal with short repayment terms. Set your own rates and compete for the best deals.', icon: '📈' },
                { title: 'Simple Fee Structure', desc: 'FundMyPO charges a transparent commission on funded deals only. No hidden fees.', icon: '✅' },
              ].map(({ title, desc, icon }) => (
                <div key={title} className="card-lift" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '5px', fontFamily: 'Poppins,sans-serif' }}>{title}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.52)', lineHeight: '1.7', fontFamily: 'Inter,sans-serif' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave → light */}
      <div style={{ background: '#1F2937', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0 64L60 57C120 50 240 36 360 29C480 22 600 22 720 28C840 34 960 48 1080 51C1200 54 1320 46 1380 42L1440 38V64H0Z" fill="#FAFAF8" />
        </svg>
      </div>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{ padding: '6rem 2.5rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#0D7E7E', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '1rem' }}>Simple Process</p>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '1rem', fontFamily: 'Poppins,sans-serif' }}>How It Works</h2>
            <p style={{ fontSize: '16px', color: '#6B7280', fontFamily: 'Inter,sans-serif', maxWidth: '480px', margin: '0 auto' }}>From PO submission to funding in as little as 48 hours.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem' }} className="steps-grid">
            {[
              { num: '1', title: 'Register', desc: 'Create your account and upload verification documents.' },
              { num: '2', title: 'Submit PO', desc: 'Upload your purchase order and supplier quotation.' },
              { num: '3', title: 'Get Reviewed', desc: 'Our team verifies your documents within 24 hours.' },
              { num: '4', title: 'Receive Offers', desc: 'Funders submit competitive funding offers.' },
              { num: '5', title: 'Get Funded', desc: 'Accept the best offer and access your funds.' },
            ].map(({ num, title, desc }, i) => (
              <div key={num} style={{ textAlign: 'center', position: 'relative' }}>
                {i < 4 && <div style={{ position: 'absolute', top: '23px', left: 'calc(50% + 26px)', width: 'calc(100% - 52px)', height: '2px', background: 'linear-gradient(90deg,#0D7E7E,rgba(13,126,126,0.18))' }} />}
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#0D7E7E,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', position: 'relative', zIndex: 1, boxShadow: '0 4px 16px rgba(13,126,126,0.32)' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff', fontFamily: 'Poppins,sans-serif' }}>{num}</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '6px', fontFamily: 'Poppins,sans-serif' }}>{title}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6', fontFamily: 'Inter,sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM TRUST */}
      <section style={{ padding: '6rem 2.5rem', background: '#fff', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="two-col">
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#0D7E7E', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '1rem' }}>Trust & Security</p>
              <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '1.25rem', lineHeight: '1.25', fontFamily: 'Poppins,sans-serif' }}>
                Built on a Foundation<br /><span style={{ color: '#0D7E7E' }}>of Trust</span>
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', fontFamily: 'Inter,sans-serif', marginBottom: '2.5rem' }}>
                We verify certifications and security credentials for every business on our platform. All documents are encrypted and POPIA compliant.
              </p>
              {[
                ['256-bit encryption', 'All documents encrypted in transit and at rest'],
                ['POPIA compliant', 'Full compliance with South African privacy laws'],
                ['Manual verification', 'Every user is verified by our team before going live'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: '14px', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg,#0D7E7E,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: '700' }}>✓</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', fontFamily: 'Poppins,sans-serif' }}>{title}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter,sans-serif', marginTop: '2px' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="trust-grid">
              {[
                { title: '256-bit Encryption', desc: 'Bank-grade document security' },
                { title: 'Verified Users Only', desc: 'Manual KYC on every account' },
                { title: 'POPIA Compliant', desc: 'SA privacy law compliance' },
                { title: 'Secure Storage', desc: 'Enterprise-grade infrastructure' },
              ].map(({ title, desc }) => (
                <div key={title} className="card-lift" style={{ background: '#FAFAF8', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg,#0D7E7E,#10B981)', borderRadius: '12px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13,126,126,0.28)' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.9)', borderRadius: '4px' }} />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px', fontFamily: 'Poppins,sans-serif' }}>{title}</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter,sans-serif' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'linear-gradient(135deg,#0D7E7E 0%,#1F2937 100%)', padding: '5.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(212,165,116,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: '700', color: '#fff', marginBottom: '1rem', lineHeight: '1.25', fontFamily: 'Poppins,sans-serif' }}>
            Start Growing Now
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.68)', marginBottom: '2.5rem', fontFamily: 'Inter,sans-serif', lineHeight: '1.75' }}>
            Join hundreds of South African SMEs who have used FundMyPO to transform their businesses.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="cta-gold" style={{ padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
              Apply for Funding
            </Link>
            <Link href="/register?role=funder" className="cta-outline" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>
              Become a Funder
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '6rem 2.5rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#0D7E7E', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '1rem' }}>Get In Touch</p>
          <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '1rem', fontFamily: 'Poppins,sans-serif' }}>Contact Us</h2>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '3rem', fontFamily: 'Inter,sans-serif' }}>Have questions? We&apos;re here to help.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="contact-grid">
            {[
              { title: 'Email', value: 'info@fundmypo.co.za' },
              { title: 'Phone', value: '(067) 316-2771' },
              { title: 'Website', value: 'FundMyPO.co.za' },
            ].map(({ title, value }) => (
              <div key={title} className="card-lift" style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#0D7E7E', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: '10px' }}>{title}</p>
                <p style={{ fontSize: '14px', color: '#1F2937', fontWeight: '600', fontFamily: 'Inter,sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1F2937', padding: '3.5rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }} className="footer-grid">
            <div>
              <Image src="/logo.png" alt="FundMyPO" width={140} height={44} style={{ height: '40px', marginBottom: '1.25rem', width: 'auto' }} />
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: '1.8', maxWidth: '260px', fontFamily: 'Inter,sans-serif' }}>
                South Africa&apos;s leading purchase order funding marketplace. A Platform by Fund Bridge, Ltd.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <a href="https://wa.me/27673162771" target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
                <a href="https://x.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                </a>
                <a href="https://facebook.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>Platform</h4>
              {[['For SMEs', '#smes'], ['For Funders', '#funders'], ['How It Works', '#howitworks'], ['Register', '/register']].map(([label, href]) => (
                <a key={label} href={href} className="footer-link" style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.42)', textDecoration: 'none', marginBottom: '.65rem', fontFamily: 'Inter,sans-serif' }}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>Legal</h4>
              {[['Privacy Policy', '/privacy'], ['Terms of Use', '/terms']].map(([label, href]) => (
                <a key={label} href={href} className="footer-link" style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.42)', textDecoration: 'none', marginBottom: '.65rem', fontFamily: 'Inter,sans-serif' }}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>Contact</h4>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', marginBottom: '.6rem', fontFamily: 'Inter,sans-serif' }}>(067) 316-2771</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', marginBottom: '.6rem', fontFamily: 'Inter,sans-serif' }}>FundMyPO.co.za</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', fontFamily: 'Inter,sans-serif' }}>info@fundmypo.co.za</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter,sans-serif' }}>© 2025 FundMyPO. All rights reserved. Proudly South African.</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter,sans-serif' }}>A Platform by Fund Bridge, Ltd.</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
