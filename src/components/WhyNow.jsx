import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { TrendingUp, TrendingDown, RefreshCw, Leaf, Globe, Building } from 'lucide-react'

const cards = [
  { icon: <TrendingUp size={24} />, title: 'Rising Industrial Tariffs', desc: 'Industrial electricity rates continue to climb, widening the cost gap between grid and renewable energy procurement.' },
  { icon: <TrendingDown size={24} />, title: 'Falling Renewable Costs', desc: 'Solar and wind generation costs are at all-time lows, making renewable procurement economically compelling at scale.' },
  { icon: <RefreshCw size={24} />, title: 'Open Access Growth', desc: 'Growing adoption of open-access frameworks is enabling industrial consumers to source power from non-DISCOM suppliers.' },
  { icon: <Leaf size={24} />, title: 'Sustainability Demand', desc: 'Export-oriented MSMEs face increasing pressure from global buyers to demonstrate credible renewable energy sourcing.' },
  { icon: <Globe size={24} />, title: 'Expanding RE Ecosystem', desc: "India's renewable energy capacity is expanding rapidly, increasing supply and creating new procurement opportunities." },
  { icon: <Building size={24} />, title: 'Policy Tailwinds', desc: 'Government initiatives to promote renewable energy for the industrial sector are creating regulatory momentum.' },
]

export default function WhyNow() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="whynow" style={{...sectionPad, background: 'var(--muted)'}}>
      <div className="blob-bg blob-1" style={{ top: '40%', right: '0%', width: 500, height: 500 }} />
      <div style={{...container, position: 'relative', zIndex: 1}}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>Why Now</SectionLabel>
          <SectionHeading>The Renewable Transition is Accelerating</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>Five converging forces are creating an unprecedented window for industrial renewable energy aggregation in India.</SectionBody>
        </div>
        
        <div ref={gridRef} style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem', marginTop:'4rem',
        }} className="why-grid">
          {cards.map((card, index) => {
            const radii = [
              '3rem 1.5rem 3rem 1.5rem',
              '1.5rem 3rem 1.5rem 3rem',
              '2rem 2rem 4rem 2rem',
              '4rem 2rem 2rem 2rem',
              '2rem 4rem 2rem 2rem',
              '2rem 2rem 2rem 4rem'
            ]
            return (
            <div key={index} style={{
              ...organicCardStyle,
              borderRadius: radii[index % radii.length],
              padding: '2.5rem',
              display: 'flex', flexDirection: 'column',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-deep)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-soft)'}}>
              <div style={{
                width:56, height:56, background:'var(--muted)', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'1.5rem', color:'var(--primary)',
              }}>
                {card.icon}
              </div>
              <h3 style={{fontFamily:'var(--ff-display)',fontSize:'1.25rem',fontWeight:700,marginBottom:'0.75rem', color:'var(--foreground)'}}>{card.title}</h3>
              <p style={{fontSize:'0.95rem',color:'var(--muted-foreground)',lineHeight:1.6}}>{card.desc}</p>
            </div>
          )})}
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){.why-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.why-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
