import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'

const problems = [
  { num: '01', title: 'High Industrial Tariffs', desc: 'Industrial electricity tariffs between ₹7–₹9 per unit create an unsustainable cost burden for MSMEs competing in tight margins.' },
  { num: '02', title: 'Complex Procurement', desc: 'The renewable energy procurement process is riddled with compliance requirements, technical barriers, and regulatory complexity.' },
  { num: '03', title: 'Fragmented Demand', desc: 'Individual MSMEs lack the scale to negotiate directly with renewable generators, who require large, consolidated demand commitments.' },
  { num: '04', title: 'Limited Access', desc: 'Large-scale renewable procurement channels are designed for large corporates, shutting out the MSME segment entirely.' },
  { num: '05', title: 'Regulatory Barriers', desc: 'Onboarding, compliance, and approvals require specialized expertise that most MSMEs cannot afford in-house.' },
  { num: '06', title: 'No Coordination Support', desc: 'There is no single operational partner to manage the end-to-end process from procurement through delivery for small industrials.' },
]

export default function Problem() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="problem" style={{...sectionPad, background: 'var(--background)'}}>
      <div style={container}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>The Problem</SectionLabel>
          <SectionHeading>Why MSMEs Struggle with Renewable Energy</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>Industrial MSMEs face a complex web of challenges that keep them locked into expensive, unsustainable electricity.</SectionBody>
        </div>
        
        <div ref={gridRef} style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem', marginTop:'4rem',
        }} className="problem-grid">
          {problems.map((p, index) => {
            // Apply varied wabi-sabi border radii to cards based on index
            const radii = [
              '4rem 2rem 2rem 2rem',
              '2rem 4rem 2rem 2rem',
              '2rem 2rem 4rem 2rem',
              '2rem 2rem 2rem 4rem',
              '3rem 1.5rem 3rem 1.5rem',
              '1.5rem 3rem 1.5rem 3rem'
            ]
            
            return (
            <div key={p.num} style={{
              ...organicCardStyle,
              borderRadius: radii[index % radii.length],
              padding: '2.5rem 2rem',
              display:'flex', flexDirection:'column', gap:'1rem',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-deep)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-soft)'}}>
              <div style={{
                fontFamily:'var(--ff-display)',fontSize:'3rem',fontWeight:800,
                color:'var(--accent)',lineHeight:1, marginBottom: '0.5rem'
              }}>
                {p.num}
              </div>
              <h3 style={{fontSize:'1.2rem',fontWeight:700,color:'var(--foreground)', fontFamily: 'var(--ff-display)'}}>{p.title}</h3>
              <p style={{fontSize:'0.95rem',color:'var(--muted-foreground)',lineHeight:1.6}}>{p.desc}</p>
            </div>
          )})}
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){.problem-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.problem-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
