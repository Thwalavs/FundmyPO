'use client'
import { useState } from 'react'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main style={{fontFamily:'Inter, sans-serif',background:'#fff',color:'#1B2B4B'}}>

      {/* NAV */}
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e5e5',padding:'0 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,height:'70px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <img src="/logo.png" alt="FundMyPO" style={{height:'55px',width:'auto'}}/>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}} className="desktop-menu">
          {[['For SMEs','#smes'],['For Funders','#funders'],['How It Works','#howitworks'],['About Us','#about'],['Contact','#contact']].map(([label,href])=>(
            <a key={label} href={href} style={{fontSize:'14px',color:'#1B2B4B',textDecoration:'none',fontWeight:'500',whiteSpace:'nowrap'}}>{label}</a>
          ))}
          <a href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'10px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'600',whiteSpace:'nowrap'}}>
            Get Funded Now
          </a>
        </div>
        <button onClick={()=>setMenuOpen(!menuOpen)}
          style={{display:'none',background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#1B2B4B'}}
          className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{background:'#fff',borderBottom:'1px solid #e5e5e5',padding:'1rem 1.5rem',display:'flex',flexDirection:'column',gap:'1rem',zIndex:99,position:'relative'}}>
          {[['For SMEs','#smes'],['For Funders','#funders'],['How It Works','#howitworks'],['About Us','#about'],['Contact','#contact']].map(([label,href])=>(
            <a key={label} href={href} onClick={()=>setMenuOpen(false)}
              style={{fontSize:'15px',color:'#1B2B4B',textDecoration:'none',fontWeight:'500',padding:'8px 0',borderBottom:'1px solid #f0f0f0'}}>
              {label}
            </a>
          ))}
          <a href="/register" onClick={()=>setMenuOpen(false)}
            style={{background:'#4DBFB0',color:'#fff',padding:'12px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'600',textAlign:'center'}}>
            Get Funded Now
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg, #1B2B4B 0%, #0F6E56 100%)',padding:'4rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'3rem',flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:'280px',maxWidth:'600px'}}>
          <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',marginBottom:'1rem',textTransform:'uppercase'}}>Purchase Order Funding Platform</p>
          <h1 style={{fontSize:'clamp(28px, 5vw, 48px)',fontWeight:'700',color:'#fff',lineHeight:'1.2',marginBottom:'1.5rem'}}>
            "Funding Your Growth,<br/>
            <span style={{color:'#4DBFB0'}}>Securing Your Future."</span>
          </h1>
          <p style={{fontSize:'clamp(14px, 2.5vw, 18px)',color:'#a8c4d4',lineHeight:'1.8',marginBottom:'2rem'}}>
            Revolutionizing Purchase Order and Working Capital Solutions for South African SMEs.
          </p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
            <a href="/register" style={{background:'#4DBFB0',color:'#fff',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'600'}}>
              Apply for Funding →
            </a>
            <a href="/register?role=funder" style={{background:'rgba(255,255,255,0.1)',color:'#fff',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'600',border:'1px solid rgba(255,255,255,0.3)'}}>
              Become a Funder
            </a>
          </div>
          <div style={{display:'flex',gap:'2rem',marginTop:'2.5rem',flexWrap:'wrap'}}>
            {[['R50M+','Funded to date'],['200+','SMEs helped'],['48hrs','Average approval']].map(([val,label])=>(
              <div key={label}>
                <p style={{fontSize:'clamp(18px, 3vw, 24px)',fontWeight:'700',color:'#4DBFB0',marginBottom:'4px'}}>{val}</p>
                <p style={{fontSize:'12px',color:'#a8c4d4'}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1,minWidth:'260px',maxWidth:'400px',width:'100%'}}>
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',padding:'1.5rem',backdropFilter:'blur(10px)'}}>
            <p style={{fontSize:'13px',color:'#4DBFB0',fontWeight:'600',marginBottom:'1rem'}}>🚀 How it works</p>
            {[
              { step:'01', title:'Submit your PO', desc:'Upload your purchase order and supplier quotation' },
              { step:'02', title:'Get verified', desc:'Our team reviews and verifies your documents' },
              { step:'03', title:'Receive offers', desc:'Funders compete to give you the best rate' },
              { step:'04', title:'Access funds', desc:'Accept the best offer and get funded fast' },
            ].map(({step,title,desc})=>(
              <div key={step} style={{display:'flex',gap:'12px',marginBottom:'1.25rem',alignItems:'flex-start'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#4DBFB0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',color:'#fff',flexShrink:0}}>
                  {step}
                </div>
                <div>
                  <p style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'2px'}}>{title}</p>
                  <p style={{fontSize:'12px',color:'#a8c4d4'}}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SME JOURNEY */}
      <section id="smes" style={{padding:'4rem 1.5rem',background:'#f8fafc'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.5rem'}}>For SMEs</p>
            <h2 style={{fontSize:'clamp(24px, 4vw, 36px)',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>The SME Journey</h2>
            <p style={{fontSize:'16px',color:'#666',maxWidth:'600px',margin:'0 auto'}}>Get the working capital you need to fulfil your purchase orders without giving up equity.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem'}}>
            {[
              { icon:'📋', step:'Step 1', title:'Submit PO', desc:'Upload your confirmed purchase order and supplier quotation to our secure platform.' },
              { icon:'🔍', step:'Step 2', title:'Get Vetted', desc:'Our team verifies your documents and lists your PO on the funding marketplace.' },
              { icon:'💰', step:'Step 3', title:'Receive Offers', desc:'Verified funders review your PO and submit competitive funding offers.' },
              { icon:'🚀', step:'Step 4', title:'Access Funds', desc:'Accept the best offer, supplier gets paid and you fulfil your order.' },
            ].map(({icon,step,title,desc})=>(
              <div key={step} style={{background:'#fff',borderRadius:'16px',padding:'1.5rem',border:'1px solid #e5e5e5',textAlign:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:'36px',marginBottom:'1rem'}}>{icon}</div>
                <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',marginBottom:'.5rem'}}>{step}</p>
                <h3 style={{fontSize:'17px',fontWeight:'600',color:'#1B2B4B',marginBottom:'.75rem'}}>{title}</h3>
                <p style={{fontSize:'14px',color:'#666',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'2.5rem'}}>
            <a href="/register" style={{background:'#1B2B4B',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'600',display:'inline-block'}}>
              Apply for funding today →
            </a>
          </div>
        </div>
      </section>

      {/* FUNDER ADVANTAGE */}
      <section id="funders" style={{padding:'4rem 1.5rem',background:'#1B2B4B'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'3rem',alignItems:'center'}}>
            <div>
              <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.5rem'}}>For Funders</p>
              <h2 style={{fontSize:'clamp(24px, 4vw, 36px)',fontWeight:'700',color:'#fff',marginBottom:'1.5rem'}}>The Funder Advantage</h2>
              <p style={{fontSize:'16px',color:'#a8c4d4',lineHeight:'1.8',marginBottom:'2rem'}}>
                Deploy your capital into verified, low-risk purchase order deals and earn competitive returns.
              </p>
              {[
                { title:'Verified deals only', desc:'Every PO and supplier is verified before listing on our marketplace.' },
                { title:'Competitive returns', desc:'Earn 3-8% per deal with repayment terms of 30-90 days.' },
                { title:'Full transparency', desc:'Access all documents, contact details and margin analysis before funding.' },
                { title:'2% platform fee', desc:'FundMyPO charges a simple 2% commission on funded deals only.' },
              ].map(({title,desc})=>(
                <div key={title} style={{display:'flex',gap:'12px',marginBottom:'1.25rem',alignItems:'flex-start'}}>
                  <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'#4DBFB0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color:'#fff',flexShrink:0,marginTop:'2px'}}>✓</div>
                  <div>
                    <p style={{fontSize:'15px',fontWeight:'600',color:'#fff',marginBottom:'2px'}}>{title}</p>
                    <p style={{fontSize:'13px',color:'#a8c4d4'}}>{desc}</p>
                  </div>
                </div>
              ))}
              <a href="/register?role=funder" style={{background:'#4DBFB0',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'600',display:'inline-block',marginTop:'1rem'}}>
                Become a funder →
              </a>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[
                { value:'3-8%', label:'Returns per deal', color:'#4DBFB0' },
                { value:'30-90', label:'Day terms', color:'#fff' },
                { value:'100%', label:'Verified deals', color:'#4DBFB0' },
                { value:'2%', label:'Platform fee only', color:'#fff' },
              ].map(({value,label,color})=>(
                <div key={label} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'1.5rem',textAlign:'center'}}>
                  <p style={{fontSize:'clamp(24px, 4vw, 32px)',fontWeight:'700',color,marginBottom:'4px'}}>{value}</p>
                  <p style={{fontSize:'13px',color:'#a8c4d4'}}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{padding:'4rem 1.5rem',background:'#fff'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.5rem'}}>Simple Process</p>
          <h2 style={{fontSize:'clamp(24px, 4vw, 36px)',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>How It Works</h2>
          <p style={{fontSize:'16px',color:'#666',marginBottom:'3rem'}}>From PO submission to funding in as little as 48 hours.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'1.5rem'}}>
            {[
              { num:'1', title:'Register', desc:'Create your account and upload your verification documents.' },
              { num:'2', title:'Submit PO', desc:'Upload your purchase order and supplier quotation.' },
              { num:'3', title:'Get reviewed', desc:'Our team verifies your documents within 24 hours.' },
              { num:'4', title:'Receive offers', desc:'Funders submit competitive funding offers.' },
              { num:'5', title:'Get funded', desc:'Accept the best offer and access your funds.' },
            ].map(({num,title,desc})=>(
              <div key={num}>
                <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1B2B4B',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:'700',color:'#fff',margin:'0 auto 1rem'}}>
                  {num}
                </div>
                <h3 style={{fontSize:'15px',fontWeight:'600',color:'#1B2B4B',marginBottom:'.5rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.7'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{padding:'4rem 1.5rem',background:'#f8fafc'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'3rem',alignItems:'center'}}>
            <div>
              <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.5rem'}}>About Us</p>
              <h2 style={{fontSize:'clamp(24px, 4vw, 36px)',fontWeight:'700',color:'#1B2B4B',marginBottom:'1.5rem'}}>Who We Are</h2>
              <p style={{fontSize:'16px',color:'#666',lineHeight:'1.8',marginBottom:'1.5rem'}}>
                FundMyPO is a South African fintech platform built to bridge the funding gap for SMEs with confirmed purchase orders. We connect businesses that need working capital with verified funders who want competitive returns.
              </p>
              <p style={{fontSize:'16px',color:'#666',lineHeight:'1.8',marginBottom:'1.5rem'}}>
                Our platform is built on transparency, trust and speed. We believe every South African SME with a confirmed order deserves access to funding — regardless of their credit history or size.
              </p>
              <p style={{fontSize:'16px',color:'#666',lineHeight:'1.8',marginBottom:'2rem'}}>
                We are proudly South African, built by entrepreneurs for entrepreneurs.
              </p>
              <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                {[['🇿🇦','Proudly South African'],['🔒','Secure & verified'],['⚡','Fast approvals']].map(([icon,label])=>(
                  <div key={label} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontSize:'20px'}}>{icon}</span>
                    <span style={{fontSize:'14px',fontWeight:'500',color:'#1B2B4B'}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[
                { icon:'🎯', title:'Our Mission', desc:'To empower South African SMEs with fast, transparent purchase order funding.' },
                { icon:'👁️', title:'Our Vision', desc:'To become the leading PO funding marketplace in Africa.' },
                { icon:'💎', title:'Our Values', desc:'Transparency, integrity and speed in everything we do.' },
                { icon:'🤝', title:'Our Promise', desc:'Fair rates, fast decisions and full support throughout your journey.' },
              ].map(({icon,title,desc})=>(
                <div key={title} style={{background:'#fff',borderRadius:'12px',padding:'1.25rem',border:'1px solid #e5e5e5'}}>
                  <div style={{fontSize:'28px',marginBottom:'.75rem'}}>{icon}</div>
                  <h3 style={{fontSize:'14px',fontWeight:'600',color:'#1B2B4B',marginBottom:'.5rem'}}>{title}</h3>
                  <p style={{fontSize:'12px',color:'#666',lineHeight:'1.6'}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM TRUST */}
      <section style={{padding:'4rem 1.5rem',background:'#1B2B4B'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'clamp(24px, 4vw, 32px)',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Platform Trust & Security</h2>
          <p style={{fontSize:'16px',color:'#a8c4d4',marginBottom:'3rem'}}>Your data and documents are safe with us.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1.5rem'}}>
            {[
              { icon:'🔒', title:'256-bit encryption', desc:'All documents encrypted in transit and at rest' },
              { icon:'✅', title:'Verified users only', desc:'Every user is manually verified by our team' },
              { icon:'📋', title:'POPIA compliant', desc:'Full compliance with South African privacy laws' },
              { icon:'🛡️', title:'Secure storage', desc:'Documents stored on enterprise-grade cloud infrastructure' },
            ].map(({icon,title,desc})=>(
              <div key={title} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'1.5rem',textAlign:'center'}}>
                <div style={{fontSize:'32px',marginBottom:'.75rem'}}>{icon}</div>
                <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'.5rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#a8c4d4',lineHeight:'1.6'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'4rem 1.5rem',background:'linear-gradient(135deg, #4DBFB0 0%, #0F6E56 100%)',textAlign:'center'}}>
        <h2 style={{fontSize:'clamp(24px, 4vw, 40px)',fontWeight:'700',color:'#fff',marginBottom:'1rem'}}>Ready to get funded?</h2>
        <p style={{fontSize:'clamp(14px, 2.5vw, 18px)',color:'rgba(255,255,255,0.85)',marginBottom:'2.5rem',maxWidth:'600px',margin:'0 auto 2.5rem'}}>
          Join hundreds of South African SMEs who have used FundMyPO to grow their businesses.
        </p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/register" style={{background:'#fff',color:'#0F6E56',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'700'}}>
            Apply for Funding →
          </a>
          <a href="/register?role=funder" style={{background:'rgba(255,255,255,0.15)',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'600',border:'1px solid rgba(255,255,255,0.4)'}}>
            Become a Funder
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:'4rem 1.5rem',background:'#f8fafc'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:'12px',color:'#4DBFB0',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.5rem'}}>Get In Touch</p>
          <h2 style={{fontSize:'clamp(24px, 4vw, 36px)',fontWeight:'700',color:'#1B2B4B',marginBottom:'1rem'}}>Contact Us</h2>
          <p style={{fontSize:'16px',color:'#666',marginBottom:'3rem'}}>Have questions? We are here to help.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1.5rem',marginBottom:'3rem'}}>
            {[
              { icon:'📧', title:'Email', value:'info@fundmypo.co.za' },
              { icon:'📱', title:'WhatsApp', value:'+27 XX XXX XXXX' },
              { icon:'🌍', title:'Website', value:'fundmypo.co.za' },
              { icon:'📍', title:'Location', value:'South Africa' },
            ].map(({icon,title,value})=>(
              <div key={title} style={{background:'#fff',borderRadius:'12px',padding:'1.5rem',border:'1px solid #e5e5e5'}}>
                <div style={{fontSize:'28px',marginBottom:'.75rem'}}>{icon}</div>
                <h3 style={{fontSize:'14px',fontWeight:'600',color:'#1B2B4B',marginBottom:'.25rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#666'}}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#1B2B4B',padding:'3rem 1.5rem 1.5rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'2rem',marginBottom:'2rem'}}>
            <div>
              <img src="/logo.png" alt="FundMyPO" style={{height:'50px',marginBottom:'1rem'}}/>
              <p style={{fontSize:'13px',color:'#a8c4d4',lineHeight:'1.8',maxWidth:'280px'}}>
                South Africa's leading purchase order funding marketplace connecting SMEs with verified funders.
              </p>
              <div style={{display:'flex',gap:'12px',marginTop:'1.5rem',flexWrap:'wrap'}}>
                <a href="https://wa.me/27XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                  style={{width:'38px',height:'38px',borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://x.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{width:'38px',height:'38px',borderRadius:'50%',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{width:'38px',height:'38px',borderRadius:'50%',background:'#1877F2',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/fundmypo" target="_blank" rel="noopener noreferrer"
                  style={{width:'38px',height:'38px',borderRadius:'50%',background:'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'1rem'}}>Platform</h4>
              {[['For SMEs','/register'],['For Funders','/register?role=funder'],['How It Works','#howitworks'],['Pricing','#']].map(([label,href])=>(
                <a key={label} href={href} style={{display:'block',fontSize:'13px',color:'#a8c4d4',textDecoration:'none',marginBottom:'.5rem'}}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'1rem'}}>Company</h4>
              {[['About Us','#about'],['Contact','#contact'],['Blog','#'],['Careers','#']].map(([label,href])=>(
                <a key={label} href={href} style={{display:'block',fontSize:'13px',color:'#a8c4d4',textDecoration:'none',marginBottom:'.5rem'}}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'1rem'}}>Legal</h4>
              {[['Privacy Policy','/privacy'],['Terms & Conditions','/terms'],['POPIA Compliance','#'],['Cookie Policy','#']].map(([label,href])=>(
                <a key={label} href={href} style={{display:'block',fontSize:'13px',color:'#a8c4d4',textDecoration:'none',marginBottom:'.5rem'}}>{label}</a>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
            <p style={{fontSize:'13px',color:'#a8c4d4'}}>© 2025 FundMyPO. All rights reserved. Proudly South African 🇿🇦</p>
            <div style={{display:'flex',gap:'1.5rem'}}>
              <a href="/privacy" style={{fontSize:'13px',color:'#a8c4d4',textDecoration:'none'}}>Privacy</a>
              <a href="/terms" style={{fontSize:'13px',color:'#a8c4d4',textDecoration:'none'}}>Terms</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}