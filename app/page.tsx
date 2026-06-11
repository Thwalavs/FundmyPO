'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main style={{fontFamily:"'Georgia', 'Times New Roman', serif",background:'#fff',color:'#1B2B4B'}}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; }
        .sans { font-family: 'Arial', 'Helvetica', sans-serif; }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .four-col { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 32px !important; }
          .section-title { font-size: 26px !important; }
        }
        @media (max-width: 480px) {
          .three-col { grid-template-columns: 1fr !important; }
          .four-col { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        a:hover { opacity: 0.85; }
        .nav-link:hover { color: #4DBFB0 !important; }
        .pillar-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(27,43,75,0.12); }
        .pillar-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .cta-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      {/* NAV */}
      <nav style={{background:'#1B2B4B',padding:'0 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,height:'68px',boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <Image src="/logo.png" alt="FundMyPO" width={140} height={48} style={{height:'48px',width:'auto'}} />
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}} className="desktop-menu">
          {[['For SMEs','#smes'],['For Funders','#funders'],['How It Works','#howitworks'],['Pricing','#pricing'],['Blog','#blog'],['Contact','#contact']].map(([label,href])=>(
            <a key={label} href={href} className="nav-link sans" style={{fontSize:'14px',color:'rgba(255,255,255,0.85)',textDecoration:'none',fontWeight:'500',letterSpacing:'0.3px'}}>{label}</a>
          ))}
          <Link href="/login" className="nav-link sans" style={{fontSize:'14px',color:'rgba(255,255,255,0.85)',textDecoration:'none',fontWeight:'500',letterSpacing:'0.3px'}}>
            Login
          </Link>
          <Link href="/register" className="cta-btn sans" style={{background:'#4DBFB0',color:'#fff',padding:'9px 22px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'700',letterSpacing:'0.3px'}}>
            Get Funded Now
          </Link>
        </div>
        <button onClick={()=>setMenuOpen(!menuOpen)}
          style={{display:'none',background:'none',border:'none',fontSize:'22px',cursor:'pointer',color:'#fff'}}
          className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{background:'#1B2B4B',padding:'1rem 2rem',display:'flex',flexDirection:'column',gap:'0',zIndex:99,borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          {[['For SMEs','#smes'],['For Funders','#funders'],['How It Works','#howitworks'],['Pricing','#pricing'],['Blog','#blog'],['Contact','#contact']].map(([label,href])=>(
            <a key={label} href={href} onClick={()=>setMenuOpen(false)}
              style={{fontSize:'15px',color:'rgba(255,255,255,0.85)',textDecoration:'none',fontWeight:'500',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              {label}
            </a>
          ))}
          <a href="/login" onClick={()=>setMenuOpen(false)}
            style={{fontSize:'15px',color:'rgba(255,255,255,0.85)',textDecoration:'none',fontWeight:'500',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            Login
          </a>
          <a href="/register" onClick={()=>setMenuOpen(false)}
            style={{background:'#4DBFB0',color:'#fff',padding:'12px 20px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'700',textAlign:'center',marginTop:'1rem'}}>
            Get Funded Now
          </a>
        </div>
      )}

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg, #1B2B4B 0%, #0F1F38 60%, #0C3547 100%)',padding:'0',overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',top:0,right:0,width:'45%',height:'100%',background:'rgba(77,191,176,0.06)',clipPath:'ellipse(80% 100% at 100% 50%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'4px',background:'linear-gradient(90deg, #4DBFB0, #1B2B4B)'}}/>

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'5rem 2rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}} className="hero-grid">
          <div>
            <div style={{display:'inline-block',background:'rgba(77,191,176,0.15)',color:'#4DBFB0',padding:'6px 16px',borderRadius:'4px',fontSize:'12px',fontWeight:'700',marginBottom:'1.5rem',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Arial,sans-serif'}}>
              South Africa&apos;s #1 PO Funding Platform
            </div>
            <h1 className="hero-title" style={{fontSize:'42px',fontWeight:'700',color:'#fff',lineHeight:'1.25',marginBottom:'1.25rem',fontStyle:'italic'}}>
              &quot;Funding Your Growth,<br/>Securing Your Future.&quot;
            </h1>
            <p style={{fontSize:'16px',color:'rgba(255,255,255,0.7)',lineHeight:'1.8',marginBottom:'2.5rem',fontFamily:'Arial,sans-serif',fontWeight:'400'}}>
              Revolutionizing Purchase Order and Working Capital Solutions for South African SMEs.
            </p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'3rem'}}>
              <Link href="/register" className="cta-btn sans" style={{background:'#4DBFB0',color:'#fff',padding:'13px 28px',borderRadius:'6px',textDecoration:'none',fontSize:'15px',fontWeight:'700',fontFamily:'Arial,sans-serif'}}>
                Apply for Funding
              </Link>
              <Link href="/register?role=funder" className="cta-btn sans" style={{background:'transparent',color:'#fff',padding:'13px 28px',borderRadius:'6px',textDecoration:'none',fontSize:'15px',fontWeight:'600',border:'1px solid rgba(255,255,255,0.35)',fontFamily:'Arial,sans-serif'}}>
                Become a Funder
              </Link>
            </div>
            <div style={{display:'flex',gap:'2.5rem',flexWrap:'wrap'}}>
              {[['R50M+','Funded to date'],['200+','SMEs helped'],['48hrs','Average approval']].map(([val,label])=>(
                <div key={label}>
                  <p style={{fontSize:'26px',fontWeight:'700',color:'#4DBFB0',marginBottom:'2px',fontFamily:'Arial,sans-serif'}}>{val}</p>
                  <p style={{fontSize:'12px',color:'rgba(255,255,255,0.55)',fontFamily:'Arial,sans-serif',letterSpacing:'0.3px'}}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'1.5rem',backdropFilter:'blur(8px)'}}>
              <p style={{fontSize:'11px',color:'#4DBFB0',fontFamily:'Arial,sans-serif',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'1rem'}}>Live Marketplace</p>
              {[
                { po:'PO-2024-001', company:'Dlamini Suppliers', amount:'R 250,000', margin:'18%', status:'Open' },
                { po:'PO-2024-002', company:'Nkosi Trading', amount:'R 480,000', margin:'22%', status:'Open' },
                { po:'PO-2024-003', company:'Zulu Enterprises', amount:'R 120,000', margin:'15%', status:'Funded' },
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.07)',fontFamily:'Arial,sans-serif'}}>
                  <div>
                    <p style={{fontSize:'13px',fontWeight:'600',color:'#fff',marginBottom:'2px'}}>{item.company}</p>
                    <p style={{fontSize:'11px',color:'rgba(255,255,255,0.45)'}}>{item.po}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'14px',fontWeight:'700',color:'#4DBFB0'}}>{item.amount}</p>
                    <span style={{fontSize:'11px',background:item.status==='Open'?'rgba(77,191,176,0.2)':'rgba(255,255,255,0.1)',color:item.status==='Open'?'#4DBFB0':'rgba(255,255,255,0.5)',padding:'2px 8px',borderRadius:'99px'}}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div style={{background:'rgba(77,191,176,0.12)',border:'1px solid rgba(77,191,176,0.25)',borderRadius:'10px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'700',color:'#4DBFB0',fontFamily:'Arial,sans-serif'}}>3–8%</p>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',fontFamily:'Arial,sans-serif',marginTop:'4px'}}>Returns per deal</p>
              </div>
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'1.25rem',textAlign:'center'}}>
                <p style={{fontSize:'22px',fontWeight:'700',color:'#fff',fontFamily:'Arial,sans-serif'}}>100%</p>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',fontFamily:'Arial,sans-serif',marginTop:'4px'}}>Verified deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SME JOURNEY */}
      <section id="smes" style={{padding:'5rem 2rem',background:'#f8f9fb'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'start'}} className="two-col">
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'1rem'}}>For SMEs</p>
              <h2 className="section-title" style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.25rem',lineHeight:'1.25'}}>The SME Journey</h2>
              <p style={{fontSize:'15px',color:'#666',lineHeight:'1.8',marginBottom:'2rem',fontFamily:'Arial,sans-serif'}}>
                Get working capital to fulfil your purchase orders without giving up equity. Our platform connects you to verified funders in hours, not weeks.
              </p>
              <a href="/register" className="cta-btn sans" style={{display:'inline-block',background:'#1B2B4B',color:'#fff',padding:'12px 26px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'700',fontFamily:'Arial,sans-serif'}}>
                Apply for funding today
              </a>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {[
                { num:'01', title:'Submit PO', desc:'Upload your confirmed purchase order and supplier quotation to our secure platform.' },
                { num:'02', title:'Get Vetted', desc:'Our team verifies your documents and lists your PO on the funding marketplace.' },
                { num:'03', title:'Access Funds', desc:'Accept the best funder offer and your supplier gets paid within 24 hours.' },
              ].map(({num,title,desc},i)=>(
                <div key={num} style={{display:'flex',gap:'1.25rem',padding:'1.5rem 0',borderBottom:i<2?'1px solid #e5e7eb':'none'}}>
                  <div style={{flexShrink:0,width:'48px',height:'48px',background:'#1B2B4B',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:'13px',fontWeight:'700',color:'#4DBFB0',fontFamily:'Arial,sans-serif'}}>{num}</span>
                  </div>
                  <div>
                    <p style={{fontSize:'15px',fontWeight:'700',color:'#1B2B4B',marginBottom:'5px',fontFamily:'Arial,sans-serif'}}>{title}</p>
                    <p style={{fontSize:'13px',color:'#666',lineHeight:'1.7',fontFamily:'Arial,sans-serif'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FUNDER ADVANTAGE */}
      <section id="funders" style={{padding:'5rem 2rem',background:'#1B2B4B'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'start'}} className="two-col">
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'1rem'}}>For Funders</p>
              <h2 className="section-title" style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'1.25rem',lineHeight:'1.25'}}>The Funder Advantage</h2>
              <p style={{fontSize:'15px',color:'rgba(255,255,255,0.65)',lineHeight:'1.8',marginBottom:'1.5rem',fontFamily:'Arial,sans-serif'}}>
                Deploy your capital into verified, low-risk PO deals and earn competitive returns with full transparency before you commit.
              </p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
                {[['3–8%','Returns per deal'],['30–90','Day terms'],['100%','Verified deals'],['2%','Platform fee']].map(([val,label])=>(
                  <div key={label} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'1rem',textAlign:'center'}}>
                    <p style={{fontSize:'22px',fontWeight:'700',color:'#4DBFB0',fontFamily:'Arial,sans-serif'}}>{val}</p>
                    <p style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',fontFamily:'Arial,sans-serif',marginTop:'4px'}}>{label}</p>
                  </div>
                ))}
              </div>
              <a href="/register?role=funder" className="cta-btn sans" style={{display:'inline-block',background:'#4DBFB0',color:'#fff',padding:'12px 26px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'700',fontFamily:'Arial,sans-serif'}}>
                Become a funder
              </a>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[
                { title:'Stability of Cover', desc:'Every PO is verified against CSD, CIPC and tax compliance before listing. You fund with confidence.' },
                { title:'Full Document Access', desc:'View the full PO, supplier quotation and all business verification documents before making any offer.' },
                { title:'Competitive Returns', desc:'Earn 3–8% per deal with short repayment terms. Set your own rates and compete for the best deals.' },
                { title:'Simple Fee Structure', desc:'FundMyPO charges a transparent 2% commission on funded deals only. No hidden fees.' },
              ].map(({title,desc})=>(
                <div key={title} className="pillar-card" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'1.25rem'}}>
                  <p style={{fontSize:'14px',fontWeight:'700',color:'#fff',marginBottom:'6px',fontFamily:'Arial,sans-serif'}}>{title}</p>
                  <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',lineHeight:'1.7',fontFamily:'Arial,sans-serif'}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <p style={{fontSize:'12px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'1rem'}}>Simple Process</p>
            <h2 className="section-title" style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>How It Works</h2>
            <p style={{fontSize:'15px',color:'#666',fontFamily:'Arial,sans-serif'}}>From PO submission to funding in as little as 48 hours.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'1rem'}} className="four-col">
            {[
              { num:'1', title:'Register', desc:'Create your account and upload your verification documents.' },
              { num:'2', title:'Submit PO', desc:'Upload your purchase order and supplier quotation.' },
              { num:'3', title:'Get Reviewed', desc:'Our team verifies your documents within 24 hours.' },
              { num:'4', title:'Receive Offers', desc:'Funders submit competitive funding offers.' },
              { num:'5', title:'Get Funded', desc:'Accept the best offer and access your funds.' },
            ].map(({num,title,desc},i)=>(
              <div key={num} style={{textAlign:'center',position:'relative'}}>
                {i < 4 && <div style={{position:'absolute',top:'22px',left:'calc(50% + 24px)',width:'calc(100% - 48px)',height:'2px',background:'#e5e7eb'}}/>}
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#1B2B4B',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',position:'relative',zIndex:1}}>
                  <span style={{fontSize:'14px',fontWeight:'700',color:'#4DBFB0',fontFamily:'Arial,sans-serif'}}>{num}</span>
                </div>
                <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',marginBottom:'6px',fontFamily:'Arial,sans-serif'}}>{title}</p>
                <p style={{fontSize:'12px',color:'#888',lineHeight:'1.6',fontFamily:'Arial,sans-serif'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM TRUST */}
      <section style={{padding:'5rem 2rem',background:'#f8f9fb'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}} className="two-col">
            <div>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'1rem'}}>Trust & Security</p>
              <h2 className="section-title" style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.25rem',lineHeight:'1.25'}}>Platform Trust</h2>
              <p style={{fontSize:'15px',color:'#666',lineHeight:'1.8',fontFamily:'Arial,sans-serif',marginBottom:'2rem'}}>
                We verify certifications and security credentials for every business on our platform. All documents are encrypted and POPIA compliant.
              </p>
              {[
                ['256-bit encryption','All documents encrypted in transit and at rest'],
                ['POPIA compliant','Full compliance with South African privacy laws'],
                ['Manual verification','Every user is verified by our team before going live'],
              ].map(([title,desc])=>(
                <div key={title} style={{display:'flex',gap:'12px',marginBottom:'1rem',alignItems:'flex-start'}}>
                  <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'#4DBFB0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'2px'}}>
                    <span style={{fontSize:'11px',color:'#fff',fontWeight:'700'}}>✓</span>
                  </div>
                  <div>
                    <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',fontFamily:'Arial,sans-serif'}}>{title}</p>
                    <p style={{fontSize:'12px',color:'#888',fontFamily:'Arial,sans-serif'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[
                { title:'256-bit Encryption', desc:'Bank-grade document security' },
                { title:'Verified Users Only', desc:'Manual KYC on every account' },
                { title:'POPIA Compliant', desc:'SA privacy law compliance' },
                { title:'Secure Storage', desc:'Enterprise-grade infrastructure' },
              ].map(({title,desc})=>(
                <div key={title} className="pillar-card" style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'1.5rem',textAlign:'center'}}>
                  <div style={{width:'40px',height:'40px',background:'#1B2B4B',borderRadius:'8px',margin:'0 auto 1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{width:'16px',height:'16px',border:'2px solid #4DBFB0',borderRadius:'3px'}}/>
                  </div>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'#1B2B4B',marginBottom:'4px',fontFamily:'Arial,sans-serif'}}>{title}</p>
                  <p style={{fontSize:'12px',color:'#888',fontFamily:'Arial,sans-serif'}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{background:'linear-gradient(135deg, #1B2B4B 0%, #0C3547 100%)',padding:'4rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse at center, rgba(77,191,176,0.12) 0%, transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:'700',color:'#fff',marginBottom:'1rem',lineHeight:'1.25'}}>Ready to get funded?</h2>
          <p style={{fontSize:'16px',color:'rgba(255,255,255,0.65)',marginBottom:'2.5rem',fontFamily:'Arial,sans-serif',lineHeight:'1.7'}}>
            Join hundreds of South African SMEs who have used FundMyPO to grow their businesses.
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/register" className="cta-btn sans" style={{background:'#4DBFB0',color:'#fff',padding:'13px 28px',borderRadius:'6px',textDecoration:'none',fontSize:'15px',fontWeight:'700',fontFamily:'Arial,sans-serif'}}>
              Apply for Funding
            </a>
            <a href="/register?role=funder" className="cta-btn sans" style={{background:'transparent',color:'#fff',padding:'13px 28px',borderRadius:'6px',textDecoration:'none',fontSize:'15px',fontWeight:'600',border:'1px solid rgba(255,255,255,0.3)',fontFamily:'Arial,sans-serif'}}>
              Become a Funder
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:'5rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:'12px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'1rem'}}>Get In Touch</p>
          <h2 className="section-title" style={{fontSize:'32px',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>Contact Us</h2>
          <p style={{fontSize:'15px',color:'#666',marginBottom:'3rem',fontFamily:'Arial,sans-serif'}}>Have questions? We are here to help.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem'}} className="four-col">
            {[
              { title:'Email', value:'info@fundmypo.co.za' },
              { title:'Phone', value:'(067) 316-2771' },
              { title:'Website', value:'FundMyPO.co.za' },
            ].map(({title,value})=>(
              <div key={title} style={{background:'#f8f9fb',borderRadius:'10px',padding:'1.5rem',border:'1px solid #e5e7eb'}}>
                <p style={{fontSize:'11px',fontWeight:'700',color:'#4DBFB0',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Arial,sans-serif',marginBottom:'8px'}}>{title}</p>
                <p style={{fontSize:'13px',color:'#1B2B4B',fontWeight:'600',fontFamily:'Arial,sans-serif'}}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#1B2B4B',padding:'3rem 2rem 1.5rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'2rem',marginBottom:'2.5rem'}} className="footer-grid">
            <div>
              <Image src="/logo.png" alt="FundMyPO" width={140} height={44} style={{height:'44px',marginBottom:'1rem'}} />
              <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',lineHeight:'1.8',maxWidth:'260px',fontFamily:'Arial,sans-serif'}}>
                South Africa&apos;s leading purchase order funding marketplace. A Platform by Fund Bridge, Ltd.
              </p>
              <div style={{display:'flex',gap:'10px',marginTop:'1.5rem'}}>
                <a href="https://wa.me/27673162771" target="_blank" rel="noopener noreferrer"
                  style={{width:'34px',height:'34px',borderRadius:'6px',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="https://x.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{width:'34px',height:'34px',borderRadius:'6px',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                </a>
                <a href="https://facebook.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{width:'34px',height:'34px',borderRadius:'6px',background:'#1877F2',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 style={{fontSize:'12px',fontWeight:'700',color:'rgba(255,255,255,0.9)',marginBottom:'1rem',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Arial,sans-serif'}}>Sitemap</h4>
              {[['PO','/register'],['For SMEs','#smes'],['How It Works','#howitworks'],['FundMyPO','#']].map(([label,href])=>(
                <a key={label} href={href} style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',textDecoration:'none',marginBottom:'.6rem',fontFamily:'Arial,sans-serif'}}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'12px',fontWeight:'700',color:'rgba(255,255,255,0.9)',marginBottom:'1rem',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Arial,sans-serif'}}>Legal</h4>
              {[['Privacy','/privacy'],['Legal Links','#'],['Privacy Policy','/privacy'],['Contact','#contact']].map(([label,href])=>(
                <a key={label} href={href} style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',textDecoration:'none',marginBottom:'.6rem',fontFamily:'Arial,sans-serif'}}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'12px',fontWeight:'700',color:'rgba(255,255,255,0.9)',marginBottom:'1rem',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Arial,sans-serif'}}>Contact</h4>
              <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'.5rem',fontFamily:'Arial,sans-serif'}}>(067) 316-2771</p>
              <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'.5rem',fontFamily:'Arial,sans-serif'}}>FundMyPO.co.za</p>
              <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',fontFamily:'Arial,sans-serif'}}>info@fundmypo.co.za</p>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontFamily:'Arial,sans-serif'}}>© 2025 FundMyPO. All rights reserved. Proudly South African.</p>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontFamily:'Arial,sans-serif'}}>A Platform by Fund Bridge, Ltd.</p>
          </div>
        </div>
      </footer>

    </main>
  )
}