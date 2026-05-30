import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { Wind, Combine, Factory, Check } from 'lucide-react'

const solPoints = [
  'MSME demand aggregation across industrial clusters',
  'Renewable energy procurement coordination',
  'Group captive and open-access support',
  'Compliance and onboarding management',
  'Operational coordination and ongoing support',
  'Long-term renewable electricity access',
]

const CheckDot = () => (
  <div style={{
    width:24,height:24,background:'var(--muted)',
    borderRadius:'50%', display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,
  }}>
    <Check size={14} color="var(--primary)" strokeWidth={3} />
  </div>
)

export default function Solution() {
  const headerRef = useFadeIn()
  const flowRef = useFadeIn()
  const pointsRef = useFadeIn()

  return (
    <section id="solution" style={{...sectionPad, background: 'var(--muted)'}}>
      <div className="blob-bg blob-2" style={{ top: '30%', right: '-5%', width: 500, height: 500 }} />
      <div style={{...container, position: 'relative', zIndex: 1}}>
        <div ref={headerRef}>
          <SectionLabel>Our Solution</SectionLabel>
          <SectionHeading>Simplifying Renewable Energy</SectionHeading>
          <SectionBody>We act as the intelligent layer between renewable generators and industrial MSMEs — handling everything from aggregation to compliance.</SectionBody>
        </div>

        {/* Flow */}
        <div ref={flowRef} style={{
          marginTop:'4rem', display:'flex', alignItems:'stretch', gap: '2rem'
        }} className="solution-flow">
          {/* Generators */}
          <div style={{...organicCardStyle, flex:1, textAlign:'center', borderRadius: '4rem 2rem 2rem 4rem'}}>
            <div style={{width:64,height:64,borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%',background:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem'}}>
              <Wind size={32} color="var(--primary)" strokeWidth={2} />
            </div>
            <div style={{fontFamily:'var(--ff-display)',fontSize:'1.2rem',fontWeight:700,marginBottom:'0.75rem'}}>Renewable Generators</div>
            <div style={{fontSize:'0.95rem',color:'var(--muted-foreground)',lineHeight:1.6}}>Solar, wind, and hybrid energy producers seeking reliable industrial off-takers</div>
          </div>

          <div className="flow-arrow" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>

          {/* Voltara */}
          <div style={{
            ...organicCardStyle, flex:1, textAlign:'center',
            background:'var(--primary)', color: 'var(--primary-foreground)',
            borderRadius: '2rem', boxShadow: 'var(--shadow-deep)', transform: 'scale(1.05)',
            border: 'none', zIndex: 2
          }}>
            <div style={{width:64,height:64,borderRadius:'50% 50% 20% 80% / 25% 80% 20% 75%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem'}}>
              <Combine size={32} color="var(--primary-foreground)" strokeWidth={2} />
            </div>
            <div style={{fontFamily:'var(--ff-display)',fontSize:'1.2rem',fontWeight:700,marginBottom:'0.75rem'}}>Sun Sutra Energy</div>
            <div style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.8)',lineHeight:1.6}}>Aggregation, compliance, onboarding, and operational management</div>
          </div>

          <div className="flow-arrow" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>

          {/* MSMEs */}
          <div style={{...organicCardStyle, flex:1, textAlign:'center', borderRadius: '2rem 4rem 4rem 2rem'}}>
            <div style={{width:64,height:64,borderRadius:'60% 40% 30% 70% / 60% 30% 70% 40%',background:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem'}}>
              <Factory size={32} color="var(--secondary)" strokeWidth={2} />
            </div>
            <div style={{fontFamily:'var(--ff-display)',fontSize:'1.2rem',fontWeight:700,marginBottom:'0.75rem'}}>Aggregated MSMEs</div>
            <div style={{fontSize:'0.95rem',color:'var(--muted-foreground)',lineHeight:1.6}}>Industrial clusters in Maharashtra accessing affordable clean electricity</div>
          </div>
        </div>

        {/* Points */}
        <div ref={pointsRef} style={{
          marginTop:'4rem', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem',
        }} className="sol-points">
          {solPoints.map((pt, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:16, padding:'1.5rem 2rem',
              background:'var(--surface)', border:'1px solid rgba(222,216,207,0.5)',
              borderRadius:'9999px', transition:'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow:'0 2px 10px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-soft)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.02)'}}>
              <CheckDot/>
              <span style={{fontSize:'1.05rem', color: 'var(--foreground)', fontWeight: 500}}>{pt}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){
          .solution-flow{flex-direction:column!important; gap: 1.5rem!important;}
          .flow-arrow svg { transform: rotate(90deg); }
          .solution-flow > div { transform: none !important; border-radius: 2rem !important; }
        }
        @media(max-width:768px){
          .sol-points{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  )
}
