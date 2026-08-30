import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { Check, Zap, Factory, Landmark } from 'lucide-react'

export default function ValueProp() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="value" style={{...sectionPad, background: 'var(--muted)'}}>
      <div style={container}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>Value Proposition</SectionLabel>
          <SectionHeading>Ecosystem Alignment</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>Our model creates aligned incentives for I&C consumers, renewable generators, and the energy ecosystem.</SectionBody>
        </div>

        <div ref={gridRef} style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          maxWidth: 1200,
          margin: '4rem auto 0'
        }} className="bento-grid">
          
          {/* Main Card: I&C Consumers */}
          <div style={{
            ...organicCardStyle,
            gridColumn: 'span 2',
            gridRow: 'span 2',
            padding: '3rem',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }} className="bento-card">
            <div style={{
              position: 'absolute', top: '-10%', right: '-10%',
              width: 300, height: 300, background: 'var(--primary)',
              opacity: 0.05, filter: 'blur(60px)', borderRadius: '50%', zIndex: 0
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                <div style={{ padding: '12px', background: 'rgba(253, 224, 71, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Zap size={28} />
                </div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', fontWeight: 700, margin: 0 }}>For I&C Consumers</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  'Lower electricity cost — up to 30% reduction vs. current industrial tariffs',
                  'Long-term tariff stability with predictable energy pricing',
                  'Simplified renewable procurement — no internal expertise required',
                  'Full operational and compliance support throughout the lifecycle'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', fontSize: '1.1rem', lineHeight: 1.5, color: 'var(--foreground)' }}>
                    <div style={{ marginTop: 2, color: 'var(--primary)' }}><Check size={20} strokeWidth={3} /></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Secondary Card 1: Generators */}
          <div style={{
            ...organicCardStyle,
            padding: '2rem',
            background: 'var(--foreground)',
            color: 'var(--background)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }} className="bento-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <Factory size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--background)' }}>For Generators</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Aggregated industrial demand — large, consolidated off-take at once',
                'Reduced customer acquisition costs via single-point aggregation',
                'Access to the I&C market segment without fragmented outreach'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
                  <div style={{ marginTop: 2, opacity: 0.7 }}><Check size={16} strokeWidth={3} /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary Card 2: DISCOMs */}
          <div style={{
            ...organicCardStyle,
            padding: '2rem',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }} className="bento-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', background: 'var(--muted)', borderRadius: '12px', color: 'var(--foreground)' }}>
                <Landmark size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>For DISCOMs</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Renewable integration support through structured open-access',
                'Stable industrial energy ecosystem with managed profiles',
                'Reduced pressure on distribution infrastructure'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--muted-foreground)' }}>
                  <div style={{ marginTop: 2, color: 'var(--primary)' }}><Check size={16} strokeWidth={3} /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      <style>{`
        .bento-card {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
        }
        .bento-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-deep);
        }
        @media(max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            padding: 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}
