export default function Home() {
  return (
    <main style={{fontFamily:'sans-serif',margin:0,padding:0}}>

      {/* NAVBAR */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid #e5e5e5'}}>
        <div style={{fontSize:'20px',fontWeight:'500'}}>
          Fund<span style={{color:'#0F6E56'}}>MyPO</span>
        </div>
        <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}}>
          <a href="#how" style={{fontSize:'14px',color:'#666',textDecoration:'none'}}>How it works</a>
          <a href="#features" style={{fontSize:'14px',color:'#666',textDecoration:'none'}}>Features</a>
          <a href="#pricing" style={{fontSize:'14px',color:'#666',textDecoration:'none'}}>Pricing</a>
          <a href="/register" style={{background:'#0F6E56',color:'#fff',padding:'10px 22px',borderRadius:'8px',fontSize:'14px',textDecoration:'none'}}>Get started</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{textAlign:'center',padding:'4rem 2rem',maxWidth:'760px',margin:'0 auto'}}>
        <div style={{display:'inline-block',background:'#E1F5EE',color:'#0F6E56',fontSize:'12px',padding:'5px 14px',borderRadius:'99px',marginBottom:'1.5rem',fontWeight:'500'}}>
          Africa's PO funding marketplace
        </div>
        <h1 style={{fontSize:'42px',fontWeight:'500',lineHeight:'1.2',marginBottom:'1rem'}}>
          Turn your purchase orders into{' '}
          <span style={{color:'#0F6E56'}}>working capital</span>
        </h1>
        <p style={{fontSize:'17px',color:'#666',lineHeight:'1.7',marginBottom:'2rem'}}>
          FundMyPO connects businesses holding confirmed purchase orders with a network of competitive funders — so you can fulfill contracts without waiting for cash.
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/register" style={{background:'#0F6E56',color:'#fff',padding:'12px 28px',borderRadius:'8px',fontSize:'15px',textDecoration:'none',fontWeight:'500'}}>
            Supplier
          </a>
          <a href="/register?role=funder" style={{background:'transparent',color:'#0F6E56',border:'1.5px solid #0F6E56',padding:'12px 28px',borderRadius:'8px',fontSize:'15px',textDecoration:'none',fontWeight:'500'}}>
            Funder
          </a>
        </div>
      </section>

      {/* STATS */}
      <section style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',maxWidth:'640px',margin:'0 auto 4rem',padding:'0 2rem'}}>
        {[['342','POs funded'],['28','Active funders'],['48h','Avg. turnaround']].map(([num,label])=>(
          <div key={label} style={{background:'#f9f9f9',borderRadius:'12px',padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'24px',fontWeight:'500',color:'#0F6E56'}}>{num}</div>
            <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:'3rem 2rem',borderTop:'1px solid #e5e5e5'}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <p style={{fontSize:'12px',fontWeight:'500',color:'#0F6E56',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.5rem'}}>How it works</p>
          <h2 style={{fontSize:'28px',fontWeight:'500',marginBottom:'2rem'}}>From PO to funding in days, not weeks</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px'}}>
            {[
              ['1','Upload your PO','Submit your verified purchase order through our secure portal.'],
              ['2','Funders compete','Multiple funders review your PO and submit competitive offers.'],
              ['3','Compare & choose','Review all offers side by side and select the best fit.'],
              ['4','Get funded','Accept an offer and receive capital to fulfill your contract.'],
            ].map(([num,title,desc])=>(
              <div key={num} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#E1F5EE',color:'#0F6E56',fontWeight:'500',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'.75rem'}}>{num}</div>
                <h3 style={{fontSize:'14px',fontWeight:'500',marginBottom:'.4rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.6'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'3rem 2rem',borderTop:'1px solid #e5e5e5'}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <p style={{fontSize:'12px',fontWeight:'500',color:'#0F6E56',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.5rem'}}>Features</p>
          <h2 style={{fontSize:'28px',fontWeight:'500',marginBottom:'2rem'}}>Built for SMEs, contractors & suppliers</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'16px'}}>
            {[
              ['🔒','Secure PO verification','Documents are validated and risk-assessed before listing.'],
              ['⚡','Competitive marketplace','Multiple funders bid on your PO for the best rate.'],
              ['📊','Offer comparison','Side-by-side comparison of rates, terms and fees.'],
              ['🌍','Pan-African reach','Starting in South Africa, expanding across the continent.'],
            ].map(([icon,title,desc])=>(
              <div key={title} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                <div style={{fontSize:'20px',marginBottom:'.6rem'}}>{icon}</div>
                <h3 style={{fontSize:'14px',fontWeight:'500',marginBottom:'.3rem'}}>{title}</h3>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.6'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:'3rem 2rem',borderTop:'1px solid #e5e5e5'}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <p style={{fontSize:'12px',fontWeight:'500',color:'#0F6E56',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.5rem'}}>Pricing</p>
          <h2 style={{fontSize:'28px',fontWeight:'500',marginBottom:'2rem'}}>Simple, transparent plans</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px'}}>
            {[
              {name:'Starter',price:'Free',sub:'to list',features:['1 active PO listing','Access to all funders','Basic offer comparison','Transaction fee on funding'],featured:false},
              {name:'Growth',price:'R499',sub:'/month',features:['Up to 5 active listings','Priority funder visibility','Advanced offer analytics','Reduced transaction fee'],featured:true},
              {name:'Enterprise',price:'Custom',sub:'',features:['Unlimited PO listings','Dedicated account manager','API access','Risk assessment suite'],featured:false},
            ].map(({name,price,sub,features,featured})=>(
              <div key={name} style={{background:'#fff',border:featured?'2px solid #0F6E56':'1px solid #e5e5e5',borderRadius:'12px',padding:'1.25rem'}}>
                {featured && <div style={{display:'inline-block',background:'#E1F5EE',color:'#0F6E56',fontSize:'11px',padding:'3px 10px',borderRadius:'99px',marginBottom:'.5rem',fontWeight:'500'}}>Most popular</div>}
                <h3 style={{fontSize:'16px',fontWeight:'500'}}>{name}</h3>
                <div style={{fontSize:'22px',fontWeight:'500',margin:'.5rem 0'}}>{price} <span style={{fontSize:'13px',color:'#888',fontWeight:'400'}}>{sub}</span></div>
                <ul style={{listStyle:'none',padding:0,marginTop:'.75rem'}}>
                  {features.map(f=>(
                    <li key={f} style={{fontSize:'13px',color:'#666',padding:'4px 0',display:'flex',gap:'6px'}}>
                      <span style={{color:'#0F6E56',fontWeight:'500'}}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="/register" style={{display:'block',textAlign:'center',marginTop:'1rem',padding:'10px',background:featured?'#0F6E56':'transparent',color:featured?'#fff':'#0F6E56',border:featured?'none':'1.5px solid #0F6E56',borderRadius:'8px',fontSize:'14px',textDecoration:'none',fontWeight:'500'}}>
                  Get started ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'#E1F5EE',borderRadius:'12px',padding:'3rem 2rem',textAlign:'center',margin:'2rem'}}>
        <h2 style={{fontSize:'28px',fontWeight:'500',marginBottom:'.75rem',color:'#085041'}}>Ready to unlock your purchase orders?</h2>
        <p style={{fontSize:'15px',color:'#0F6E56',marginBottom:'1.5rem'}}>Join hundreds of businesses already accessing fast, competitive PO funding.</p>
        <a href="/register" style={{background:'#0F6E56',color:'#fff',padding:'12px 28px',borderRadius:'8px',fontSize:'15px',textDecoration:'none',fontWeight:'500'}}>
          Create your free account ↗
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'1.5rem 2rem',borderTop:'1px solid #e5e5e5',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
        <div style={{fontSize:'16px',fontWeight:'500'}}>Fund<span style={{color:'#0F6E56'}}>MyPO</span></div>
        <p style={{fontSize:'13px',color:'#888'}}>© 2025 Project Pulse Innovation. All rights reserved.</p>
        <div style={{display:'flex',gap:'1rem'}}>
          <a href="#" style={{fontSize:'13px',color:'#888',textDecoration:'none'}}>Privacy</a>
          <a href="#" style={{fontSize:'13px',color:'#888',textDecoration:'none'}}>Terms</a>
          <a href="#" style={{fontSize:'13px',color:'#888',textDecoration:'none'}}>Contact</a>
        </div>
      </footer>

    </main>
  )
}