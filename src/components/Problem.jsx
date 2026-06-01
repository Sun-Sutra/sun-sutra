import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'

import industrialTariffs from '../assets/industrial_tariffs.jpg'
import fragmentedDemand from '../assets/fragmented_demand.jpg'
import regulatoryBarriers from '../assets/regulatory_barriers.jpg'
import limitedAccess from '../assets/limited_access.jpg'
import procurementComplexity from '../assets/procurement_complexity.jpg'
import noSupport from '../assets/no_support.jpg'

const problems = [
  {
    num: '01',
    title: 'High Industrial Tariffs',
    desc: 'Industrial electricity tariffs between ₹9-17 per unit create an unsustainable cost burden for MSMEs competing in tight margins.',
    image: industrialTariffs
  },
  {
    num: '02',
    title: 'Complex Procurement',
    desc: 'The renewable energy procurement process is riddled with compliance requirements, technical barriers, and regulatory complexity.',
    image: procurementComplexity
  },
  {
    num: '03',
    title: 'Fragmented Demand',
    desc: 'Individual MSMEs lack the scale to negotiate directly with renewable generators, who require large, consolidated demand commitments.',
    image: fragmentedDemand
  },
  {
    num: '04',
    title: 'Limited Access',
    desc: 'Large-scale renewable procurement channels are designed for large corporates, shutting out the MSME segment entirely.',
    image: limitedAccess
  },
  {
    num: '05',
    title: 'Regulatory Barriers',
    desc: 'Onboarding, compliance, and approvals require specialized expertise that most MSMEs cannot afford in-house.',
    image: regulatoryBarriers
  },
  {
    num: '06',
    title: 'No Coordination Support',
    desc: 'There is no single operational partner to manage the end-to-end process from procurement through delivery for small industrials.',
    image: noSupport
  },
]

export default function Problem() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="problem" style={{
      ...sectionPad,
      paddingTop: 'clamp(100px, 10vw, 140px)',
      background: 'var(--background)'
    }}>
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
            <div
              key={p.num}
              style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '320px',
                borderRadius: radii[index % radii.length],
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                backgroundImage: `
                  linear-gradient(
                    rgba(0,0,0,0.35),
                    rgba(0,0,0,0.35)
                  ),
                  url(${p.image})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                boxShadow: 'var(--shadow-soft)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = 'var(--shadow-deep)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  opacity: 0.9,
                  lineHeight: 1,
                  marginBottom: '0.75rem',
                  textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                }}
              >
                {p.num}
              </div>

              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--ff-display)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                {p.title}
              </h3>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.7,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                {p.desc}
              </p>
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
