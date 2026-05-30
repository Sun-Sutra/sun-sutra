import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'

const streams = [
  {
    badge: 'Revenue Stream 01',
    title: 'Per-Unit Procurement Margin',
    desc: 'We earn a margin on each unit of electricity procured through our aggregated channels — aligned with volume and value delivered to MSMEs.',
  },
  {
    badge: 'Revenue Stream 02',
    title: 'Operational Coordination Fees',
    desc: 'Service fees for ongoing compliance management, onboarding coordination, and operational support throughout the customer lifecycle.',
  },
  {
    badge: 'Revenue Stream 03',
    title: 'Procurement Facilitation',
    desc: 'Facilitation fees for structuring and managing renewable energy procurement agreements between generators and aggregated MSME groups.',
  },
]

export default function BusinessModel() {
  const headerRef = useFadeIn()
  const cardsRef = useFadeIn()

  return (
    <section id="model" style={{...sectionPad, background: 'var(--muted)'}}>
      <div className="blob-bg blob-3" style={{ top: '20%', left: '0%', width: 600, height: 600 }} />
      <div style={{...container, position: 'relative', zIndex: 1}}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>Business Model</SectionLabel>
          <SectionHeading>How We Generate Revenue</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>A multi-stream model built around value delivered — aligned with MSME outcomes and generator success.</SectionBody>
        </div>
        <div ref={cardsRef} style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem', marginTop:'4rem',
        }} className="bm-grid">
          {streams.map((s, index) => {
            const radii = [
              '4rem 2rem 5rem 1.5rem',
              '2rem 4rem 1.5rem 5rem',
              '5rem 1.5rem 4rem 2rem'
            ]
            return (
            <div key={index} style={{
              ...organicCardStyle,
              borderRadius: radii[index % radii.length],
              padding: '3rem 2rem',
              display:'flex', flexDirection:'column', gap:'1.25rem',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-deep)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-soft)'}}>
              <span style={{
                display:'inline-flex', alignItems:'center', fontSize:11,
                fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
                color:'var(--secondary)', background:'var(--muted)',
                padding:'6px 16px', borderRadius:'9999px', width:'fit-content',
              }}>
                {s.badge}
              </span>
              <h3 style={{fontFamily:'var(--ff-display)',fontSize:'1.4rem',fontWeight:700, color: 'var(--foreground)', lineHeight: 1.3}}>{s.title}</h3>
              <p style={{fontSize:'0.95rem',color:'var(--muted-foreground)',lineHeight:1.6}}>{s.desc}</p>
            </div>
          )})}
        </div>
      </div>
      <style>{`@media(max-width:1024px){.bm-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
